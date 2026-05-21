#!/usr/bin/env python3
"""
Soul Map Webhook Server
===================
Receives POST requests from the success page with intake data,
automatically generates soul maps, commits to GitHub, and sends confirmation emails.

Setup:
  pip install flask python-dotenv

Environment variables (set in .env or export):
  GITHUB_PAT=ghp_your_personal_access_token
  RESEND_API_KEY=re_your_resend_api_key

Run:
  python webhook_server.py

The server listens on localhost:5000 by default.
POST http://localhost:5000/generate to trigger.
"""

import os
import sys
import json
import threading
from datetime import datetime, timedelta, date
from pathlib import Path

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler
import requests

# Load environment variables
load_dotenv()

# Import generator functions from soul_map_generator.py
sys.path.insert(0, str(Path(__file__).parent))
from soul_map_generator import generate_soul_map, generate_monthly_update, deploy_to_github, get_base_filename

# Path to subscriber database
SUBSCRIBERS_FILE = Path(__file__).parent / 'subscribers.json'

app = Flask(__name__)
CORS(app, origins=["https://soul-maps.thefirstspark.shop", "https://thefirstspark.shop"])


# ============================================================
# ZOHO CRM INTEGRATION
# ============================================================

_zoho_token_cache = {
    'access_token': None,
    'expires_at': None,
}


def _zoho_credentials_configured():
    return all([
        os.getenv('ZOHO_CLIENT_ID'),
        os.getenv('ZOHO_CLIENT_SECRET'),
        os.getenv('ZOHO_REFRESH_TOKEN'),
    ])


def _get_zoho_access_token():
    """Return a valid Zoho access token, refreshing as needed."""
    now = datetime.utcnow()
    if _zoho_token_cache['access_token'] and _zoho_token_cache['expires_at']:
        if now < _zoho_token_cache['expires_at']:
            return _zoho_token_cache['access_token']

    token_url = "https://accounts.zoho.com/oauth/v2/token"
    payload = {
        'client_id': os.getenv('ZOHO_CLIENT_ID'),
        'client_secret': os.getenv('ZOHO_CLIENT_SECRET'),
        'refresh_token': os.getenv('ZOHO_REFRESH_TOKEN'),
        'grant_type': 'refresh_token',
    }

    response = requests.post(token_url, data=payload, timeout=20)
    if response.status_code != 200:
        raise RuntimeError(f"Zoho token refresh failed: {response.status_code} {response.text}")

    token_data = response.json()
    access_token = token_data.get('access_token')
    expires_in = int(token_data.get('expires_in', 3600))
    if not access_token:
        raise RuntimeError(f"Zoho token response missing access_token: {token_data}")

    # Refresh 2 minutes early.
    _zoho_token_cache['access_token'] = access_token
    _zoho_token_cache['expires_at'] = now + timedelta(seconds=max(expires_in - 120, 60))
    return access_token


def _upsert_zoho_lead(email, name, source, metadata=None):
    """Create or update lead in Zoho CRM by email."""
    if metadata is None:
        metadata = {}

    access_token = _get_zoho_access_token()
    org_id = os.getenv('ZOHO_ORG_ID')
    lead_source_map = {
        'soul-map': 'Soul Map Interested',
        'players': 'Players Lounge Interested',
        'og': 'OG Spark Interested',
        'newsletter': 'Newsletter Subscriber',
    }

    name_parts = (name or '').strip().split()
    first_name = name_parts[0] if name_parts else ''
    last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else (name_parts[0] if name_parts else 'Subscriber')

    lead_payload = {
        'First_Name': first_name,
        'Last_Name': last_name,
        'Email': email,
        'Lead_Source': lead_source_map.get(source, 'Website'),
        'Description': f"Email Hub signup ({source}) from {metadata.get('page', 'unknown page')}",
    }

    url = "https://www.zohoapis.com/crm/v3/Leads/upsert"
    headers = {
        'Authorization': f'Zoho-oauthtoken {access_token}',
        'Content-Type': 'application/json',
    }
    if org_id:
        headers['X-ORGID'] = org_id

    body = {
        'data': [lead_payload],
        'duplicate_check_fields': ['Email'],
    }

    response = requests.post(url, headers=headers, json=body, timeout=20)
    if response.status_code not in (200, 201):
        raise RuntimeError(f"Zoho upsert failed: {response.status_code} {response.text}")

    return response.json()


# ============================================================
# SUBSCRIBER MANAGEMENT
# ============================================================

def load_subscribers():
    """Load subscriber database from JSON file."""
    if SUBSCRIBERS_FILE.exists():
        try:
            with open(SUBSCRIBERS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return []
    return []


def save_subscribers(subscribers):
    """Save subscriber database to JSON file."""
    with open(SUBSCRIBERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(subscribers, f, indent=2, ensure_ascii=False)


def add_subscriber(name, dob, email, extra=None):
    """
    Add a new subscriber to the database.
    Automatically calculates 12-month expiry.
    """
    subscribers = load_subscribers()

    # Check if subscriber already exists
    for sub in subscribers:
        if sub['email'] == email:
            print(f"[SUBSCRIBER] Already exists: {email}")
            return sub

    # Calculate expiry (12 months from today)
    today = datetime.now()
    expiry = today + timedelta(days=365)

    subscriber = {
        'name': name,
        'email': email,
        'dob': dob,
        'purchase_date': today.isoformat(),
        'expiry_date': expiry.isoformat(),
        'active': True
    }

    if extra:
        for key in ('birth_hospital', 'soul_questions', 'interests', 'city'):
            if extra.get(key):
                subscriber[key] = extra[key]

    subscribers.append(subscriber)
    save_subscribers(subscribers)

    print(f"[SUBSCRIBER] Added: {name} ({email})")
    return subscriber


def get_active_subscribers(as_of=None):
    """Get all subscribers whose 12-month window hasn't expired."""
    if as_of is None:
        as_of = datetime.now()

    subscribers = load_subscribers()
    active = []

    for sub in subscribers:
        if not sub.get('active', True):
            continue

        expiry = datetime.fromisoformat(sub['expiry_date'])
        if as_of <= expiry:
            active.append(sub)

    return active


def deactivate_subscriber(email):
    """Mark a subscriber as inactive (monthly updates stopped)."""
    subscribers = load_subscribers()
    for sub in subscribers:
        if sub['email'] == email:
            sub['active'] = False
            save_subscribers(subscribers)
            print(f"[SUBSCRIBER] Deactivated: {email}")
            return True
    return False


# ============================================================
# MONTHLY UPDATE SCHEDULER
# ============================================================

def send_monthly_update_email(recipient_email, recipient_name, soul_map_url, month_name, month_num):
    """Send monthly update notification email via Resend API."""
    api_key = os.getenv('RESEND_API_KEY')
    if not api_key:
        print(f"[WARN] RESEND_API_KEY not set. Would send to: {recipient_email}")
        return False

    import urllib.request, urllib.error, json as _json

    html_body = f"""\
<html>
  <body style="font-family: Georgia, serif; background: #0B0B0C; color: #e0e7ff; padding: 40px 20px;">
    <div style="max-width: 700px; margin: 0 auto; border: 1px solid #6B4DF2; border-radius: 8px; padding: 40px; background: #0d0d14;">
      <h1 style="color: #F3B23A; text-align: center;">✨ {month_name} Energy Update</h1>
      <p style="text-align: center; color: #26E4D8; font-size: 14px; margin-bottom: 40px;">Your monthly frequency reading is ready</p>
      <p>Hello <strong>{recipient_name}</strong>,</p>
      <p>Your Soul Map's monthly energy reading for <strong>{month_name}</strong> has been generated. Discover what the cosmos has in store for you this month:</p>
      <div style="text-align: center; margin: 40px 0;">
        <a href="{soul_map_url}" style="background: linear-gradient(135deg, #F3B23A, #FF6A3D); color: #0B0B0C; padding: 16px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
          VIEW YOUR {month_name.upper()} READING
        </a>
      </div>
      <p style="font-size: 14px; color: #a8a8a8;">This is one of your 12 included monthly updates. You have full access as long as your subscription is active.</p>
      <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #6B4DF2; text-align: center; font-size: 12px; color: #6b7280;">
        <p><strong style="color: #F3B23A;">The First Spark</strong></p>
        <p><a href="https://thefirstspark.shop" style="color: #26E4D8;">thefirstspark.shop</a></p>
        <p style="font-style: italic;">Reality is programmable. Consciousness is the code.</p>
      </div>
    </div>
  </body>
</html>"""

    payload = _json.dumps({
        'from': 'The First Spark <hello@thefirstspark.shop>',
        'to': [recipient_email],
        'subject': f'✨ Your {month_name} Energy Update — {recipient_name}',
        'html': html_body,
    }).encode()

    req = urllib.request.Request(
        'https://api.resend.com/emails',
        data=payload,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'User-Agent': 'TheFirstSpark-SoulMap/1.0',
        },
        method='POST'
    )
    try:
        with urllib.request.urlopen(req) as r:
            print(f"[EMAIL] Monthly update sent to {recipient_email} for {month_name} — {r.status}")
            return True
    except urllib.error.HTTPError as e:
        print(f"[ERROR] Resend monthly update failed: {e.code} {e.read().decode()}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"[ERROR] Monthly update email failed: {e}", file=sys.stderr)
        return False


def generate_all_monthly_updates():
    """Generate and deploy monthly updates for all active subscribers."""
    print("\n[SCHEDULER] Starting monthly update generation...")

    active_subscribers = get_active_subscribers()
    if not active_subscribers:
        print("[SCHEDULER] No active subscribers.")
        return

    today = date.today()
    month_name = datetime.now().strftime("%B")

    import calendar
    month_num = today.month

    success_count = 0
    failed_count = 0

    for subscriber in active_subscribers:
        try:
            name = subscriber['name']
            email = subscriber['email']
            dob_str = subscriber['dob']

            # Parse DOB
            from datetime import datetime as dt
            birth_date = dt.strptime(dob_str, '%Y-%m-%d').date()

            print(f"  [MONTHLY] Generating for {name} ({email})...")

            # Generate monthly update
            html_monthly, filename_monthly, _ = generate_monthly_update(name, birth_date)

            # Deploy to GitHub
            success, result = deploy_to_github(html_monthly, filename_monthly)
            if success:
                live_url = result
                print(f"    [GIT] ✓ {live_url}")
            else:
                print(f"    [WARN] Deploy failed for {name}: {result}")
                failed_count += 1
                continue

            # Send email notification
            send_monthly_update_email(email, name, live_url, month_name, month_num)
            success_count += 1

        except Exception as e:
            print(f"  [ERROR] Failed to generate update for {subscriber.get('name', 'Unknown')}: {e}", file=sys.stderr)
            failed_count += 1

    print(f"[SCHEDULER] Monthly updates complete: {success_count} succeeded, {failed_count} failed")


def send_confirmation_email(recipient_email, recipient_name, soul_map_url):
    """Send confirmation email via Resend API."""
    api_key = os.getenv('RESEND_API_KEY')
    if not api_key:
        print(f"[WARN] RESEND_API_KEY not set. Would send to: {recipient_email}")
        return False

    import urllib.request, urllib.error, json as _json

    html_body = f"""\
<html>
  <body style="font-family: Georgia, serif; background: #0B0B0C; color: #e0e7ff; padding: 40px 20px;">
    <div style="max-width: 700px; margin: 0 auto; border: 1px solid #6B4DF2; border-radius: 8px; padding: 40px; background: #0d0d14;">
      <h1 style="color: #F3B23A; text-align: center;">✨ Soul Map Ready</h1>
      <p style="text-align: center; color: #26E4D8; font-size: 14px; margin-bottom: 40px;">Your frequency coordinates are waiting</p>
      <p>Hello <strong>{recipient_name}</strong>,</p>
      <p>Your Soul Map has been generated. Access it here:</p>
      <div style="text-align: center; margin: 40px 0;">
        <a href="{soul_map_url}" style="background: linear-gradient(135deg, #F3B23A, #FF6A3D); color: #0B0B0C; padding: 16px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
          VIEW YOUR SOUL MAP
        </a>
      </div>
      <p style="font-size: 14px; color: #a8a8a8;">You have 12 months of monthly updates. New energy reports are generated automatically each month.</p>
      <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #6B4DF2; text-align: center; font-size: 12px; color: #6b7280;">
        <p><strong style="color: #F3B23A;">The First Spark</strong></p>
        <p><a href="https://thefirstspark.shop" style="color: #26E4D8;">thefirstspark.shop</a></p>
        <p style="font-style: italic;">Reality is programmable. Consciousness is the code.</p>
      </div>
    </div>
  </body>
</html>"""

    payload = _json.dumps({
        'from': 'The First Spark <hello@thefirstspark.shop>',
        'to': [recipient_email],
        'subject': f'✨ Your Soul Map is Ready — {recipient_name}',
        'html': html_body,
    }).encode()

    req = urllib.request.Request(
        'https://api.resend.com/emails',
        data=payload,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'User-Agent': 'TheFirstSpark-SoulMap/1.0',
        },
        method='POST'
    )
    try:
        with urllib.request.urlopen(req) as r:
            print(f"[EMAIL] Sent via Resend to {recipient_email} — {r.status}")
            return True
    except urllib.error.HTTPError as e:
        print(f"[ERROR] Resend failed: {e.code} {e.read().decode()}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"[ERROR] Email failed: {e}", file=sys.stderr)
        return False


# ============================================================
# WEBHOOK ENDPOINT
# ============================================================

def _run_generation(name, dob_str, birth_date, birth_time, city, country, email, extra):
    """Background worker — runs after the HTTP response is already sent."""
    try:
        print(f"\n[BG] Starting generation for {name}...")

        html_soul_map, summary = generate_soul_map(
            name, birth_date,
            birth_time=birth_time,
            birth_city=city,
            birth_country=country
        )

        base_filename = get_base_filename(name, birth_date)
        filename = f"{base_filename}.html"

        print(f"  [GIT] Committing soul map...")
        success, result = deploy_to_github(html_soul_map, filename, summary=summary,
                                           birth_date=birth_date, birth_city=city)
        if success:
            live_url = result
            print(f"  [GIT] ✓ {live_url}")
        else:
            print(f"  [WARN] Deploy failed: {result}")
            live_url = None

        print(f"  [MONTHLY] Generating monthly update...")
        html_monthly, filename_monthly, _ = generate_monthly_update(name, birth_date)
        deploy_to_github(html_monthly, filename_monthly)
        print(f"  [MONTHLY] ✓ Committed")

        add_subscriber(name, dob_str, email, extra=extra)

        if email and live_url:
            print(f"  [EMAIL] Sending confirmation to {email}...")
            send_confirmation_email(email, name, live_url)

        print(f"  [BG] Done for {name} → {live_url}")

    except Exception as e:
        import traceback
        print(f"[BG ERROR] {name}: {e}", file=sys.stderr)
        traceback.print_exc()


@app.route('/generate', methods=['POST'])
def generate_soul_map_webhook():
    try:
        data = request.get_json()

        if not data.get('name') or not data.get('dob'):
            return jsonify({'success': False, 'error': 'Missing required fields: name, dob'}), 400

        name = data['name'].strip()
        dob_str = data['dob'].strip()
        email = (data.get('email') or '').strip()
        time_str = (data.get('time') or '').strip() or None
        city = (data.get('city') or '').strip() or None
        country = (data.get('country') or 'US').strip()

        try:
            from datetime import datetime as dt
            birth_date = dt.strptime(dob_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'success': False, 'error': 'Invalid DOB format. Use YYYY-MM-DD'}), 400

        birth_time = None
        if time_str:
            try:
                t = dt.strptime(time_str, '%H:%M')
                birth_time = (t.hour, t.minute)
            except ValueError:
                return jsonify({'success': False, 'error': 'Invalid time format. Use HH:MM (24-hour)'}), 400

        extra = {
            'birth_hospital': data.get('birth_hospital'),
            'soul_questions': data.get('soul_questions'),
            'interests': data.get('interests'),
            'city': city
        }

        # Fire and forget — return immediately so Railway doesn't timeout
        t = threading.Thread(
            target=_run_generation,
            args=(name, dob_str, birth_date, birth_time, city, country, email, extra),
            daemon=True
        )
        t.start()

        print(f"[WEBHOOK] Accepted {name} — generation running in background")

        return jsonify({
            'success': True,
            'name': name,
            'message': f'Soul Map queued for {name} — check your email in 2-3 minutes'
        }), 200

    except Exception as e:
        print(f"[ERROR] {str(e)}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'timestamp': datetime.now().isoformat()}), 200


@app.route('/email-hub/subscribe', methods=['POST'])
def email_hub_subscribe():
    """Capture email-hub signup and sync to Zoho CRM."""
    try:
        data = request.get_json(silent=True) or {}
        email = (data.get('email') or '').strip().lower()
        name = (data.get('name') or '').strip()
        source = (data.get('source') or '').strip() or 'newsletter'
        page = (data.get('page') or '').strip()

        if not email or '@' not in email:
            return jsonify({'success': False, 'error': 'Valid email is required'}), 400
        if not name:
            return jsonify({'success': False, 'error': 'Name is required'}), 400

        if not _zoho_credentials_configured():
            return jsonify({
                'success': False,
                'error': 'Zoho credentials are not configured on server',
                'missing': [
                    key for key in ['ZOHO_CLIENT_ID', 'ZOHO_CLIENT_SECRET', 'ZOHO_REFRESH_TOKEN']
                    if not os.getenv(key)
                ]
            }), 503

        zoho_result = _upsert_zoho_lead(
            email=email,
            name=name,
            source=source,
            metadata={'page': page}
        )

        return jsonify({
            'success': True,
            'email': email,
            'source': source,
            'zoho': zoho_result,
        }), 200

    except Exception as e:
        print(f"[ZOHO ERROR] {e}", file=sys.stderr)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/email-hub/health', methods=['GET'])
def email_hub_health():
    return jsonify({
        'status': 'ok',
        'zoho_configured': _zoho_credentials_configured(),
        'timestamp': datetime.now().isoformat(),
    }), 200


@app.route('/email-test', methods=['GET'])
def email_test():
    """Debug: report Resend config; if ?to= is supplied, send a test email to that address."""
    api_key = os.getenv('RESEND_API_KEY')
    if not api_key:
        return jsonify({'configured': False, 'resend_api_key': 'NOT SET'}), 200

    to = (request.args.get('to') or '').strip()
    if not to:
        return jsonify({
            'configured': True,
            'resend_api_key': f'{api_key[:6]}…',
            'hint': 'add ?to=you@example.com to actually send a test email',
        }), 200

    sent = send_confirmation_email(to, 'Test Recipient',
                                   'https://soul-maps.thefirstspark.shop/')
    return jsonify({'configured': True, 'sent': bool(sent), 'to': to}), 200


@app.route('/deploy-test', methods=['GET'])
def deploy_test():
    """Debug: test GitHub deploy synchronously and return result."""
    from soul_map_generator import deploy_to_github
    token = os.getenv('GITHUB_PAT')
    if not token:
        return jsonify({'error': 'GITHUB_PAT not set'}), 500
    test_html = '<html><body>deploy test</body></html>'
    success, result = deploy_to_github(test_html, '_deploy_test.html')
    return jsonify({'success': success, 'result': result, 'token_prefix': token[:8]}), 200


# ============================================================
# ROOT
# ============================================================

@app.route('/', methods=['GET'])
def index():
    """Info page."""
    return jsonify({
        'service': 'Soul Map Webhook Server',
        'endpoints': {
            'POST /generate': 'Generate a soul map from intake data',
            'GET /health': 'Health check'
        },
        'docs': 'See webhook_server.py for request format'
    }), 200


# ============================================================
# MAIN
# ============================================================

if __name__ == '__main__':
    # Check env vars
    if not os.getenv('GITHUB_PAT'):
        print("\n[WARN] GITHUB_PAT not set. Local generation only (no GitHub commits).")
        print("  To enable GitHub deployment, set: export GITHUB_PAT=ghp_...")

    if not os.getenv('RESEND_API_KEY'):
        print("\n[WARN] RESEND_API_KEY not set. Confirmation emails won't send.")
        print("  To enable: export RESEND_API_KEY=re_...")

    # Get port from environment (Railway sets this), default to 5000 for local
    port = int(os.getenv('PORT', 5000))
    is_production = os.getenv('RAILWAY_ENVIRONMENT') == 'production'

    print("\n⚡ Soul Map Webhook Server starting...")
    print(f"  Listening on port {port}")
    print(f"  POST /generate to trigger soul map generation")
    print(f"  GET /health to check status\n")

    # Initialize background scheduler for monthly updates
    scheduler = BackgroundScheduler()
    # Run on the 1st of each month at 00:00 UTC
    scheduler.add_job(generate_all_monthly_updates, 'cron', day=1, hour=0, minute=0)
    scheduler.start()
    print("[SCHEDULER] Monthly update job scheduled for 1st of each month at 00:00 UTC\n")

    app.run(host='0.0.0.0', port=port, debug=not is_production)
