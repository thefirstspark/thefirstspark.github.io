(function () {
  var CONFIG = window.SPARK_MAILCHIMP_CONFIG || {
    u: '3f69bab8ef6446338dce0b642',
    id: '',
    dc: 'us21',
    delayMs: 12000,
    showOnceDays: 7
  };

  if (localStorage.getItem('spark_mc_subscribed') === '1') return;
  if (sessionStorage.getItem('spark_mc_popup_dismissed') === '1') return;

  var dismissedAt = localStorage.getItem('spark_mc_popup_dismissed_at');
  if (dismissedAt) {
    var days = (Date.now() - parseInt(dismissedAt, 10)) / 86400000;
    if (days < CONFIG.showOnceDays) return;
  }

  var style = document.createElement('style');
  style.textContent = [
    '#spark-mc-overlay{position:fixed;inset:0;z-index:100000;background:rgba(5,6,10,.82);',
    'backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;',
    'opacity:0;pointer-events:none;transition:opacity .35s ease}',
    '#spark-mc-overlay.spark-mc-open{opacity:1;pointer-events:auto}',
    '#spark-mc-modal{position:relative;width:min(440px,100%);border:1px solid rgba(183,148,255,.4);',
    'border-radius:14px;background:linear-gradient(160deg,#10131c,#05060a);padding:32px 28px 28px;',
    'box-shadow:0 24px 80px rgba(0,0,0,.55),0 0 60px rgba(157,107,255,.15);',
    'transform:translateY(16px) scale(.97);transition:transform .35s ease;font-family:Inter,system-ui,sans-serif}',
    '#spark-mc-overlay.spark-mc-open #spark-mc-modal{transform:translateY(0) scale(1)}',
    '#spark-mc-modal .spark-mc-kicker{font-size:11px;letter-spacing:.32em;text-transform:uppercase;',
    'color:#b794ff;margin-bottom:10px}',
    '#spark-mc-modal h2{font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(28px,5vw,36px);',
    'font-weight:600;color:#f4ede0;line-height:1.1;margin-bottom:10px}',
    '#spark-mc-modal p.spark-mc-copy{font-size:14px;line-height:1.55;color:#6b6a6e;margin-bottom:22px}',
    '#spark-mc-modal form{display:flex;flex-direction:column;gap:10px}',
    '#spark-mc-modal input[type=email]{width:100%;padding:14px 16px;border-radius:8px;',
    'border:1px solid rgba(183,148,255,.3);background:rgba(255,255,255,.04);color:#f4ede0;',
    'font-size:15px;outline:none;transition:border-color .2s}',
    '#spark-mc-modal input[type=email]::placeholder{color:#6b6a6e}',
    '#spark-mc-modal input[type=email]:focus{border-color:#ffc857}',
    '#spark-mc-modal button[type=submit]{padding:14px 20px;border:none;border-radius:8px;cursor:pointer;',
    'font-weight:700;font-size:13px;letter-spacing:.06em;',
    'background:linear-gradient(135deg,#9d6bff,#b794ff);color:#05060a;transition:transform .2s,box-shadow .2s}',
    '#spark-mc-modal button[type=submit]:hover{transform:translateY(-1px);box-shadow:0 8px 28px rgba(157,107,255,.45)}',
    '#spark-mc-modal button[type=submit]:disabled{opacity:.6;cursor:wait;transform:none}',
    '#spark-mc-modal .spark-mc-alt{font-size:12px;color:#6b6a6e;text-align:center;margin-top:14px}',
    '#spark-mc-modal .spark-mc-alt a{color:#b794ff;text-decoration:none}',
    '#spark-mc-modal .spark-mc-alt a:hover{color:#ffc857}',
    '#spark-mc-modal .spark-mc-close{position:absolute;top:12px;right:14px;background:none;border:none;',
    'color:#6b6a6e;font-size:22px;line-height:1;cursor:pointer;padding:4px}',
    '#spark-mc-modal .spark-mc-close:hover{color:#f4ede0}',
    '#spark-mc-modal .spark-mc-msg{font-size:13px;margin-top:4px;min-height:18px}',
    '#spark-mc-modal .spark-mc-msg.error{color:#ff6a3d}',
    '#spark-mc-modal .spark-mc-msg.success{color:#69c27d}',
    '#spark-mc-modal .spark-mc-success{text-align:center;padding:12px 0}',
    '#spark-mc-modal .spark-mc-success .spark-mc-icon{font-size:40px;margin-bottom:12px}',
    '.spark-mc-hp{position:absolute;left:-9999px;opacity:0;height:0;width:0;overflow:hidden}'
  ].join('');
  document.head.appendChild(style);

  var overlay = document.createElement('div');
  overlay.id = 'spark-mc-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'spark-mc-title');
  overlay.innerHTML =
    '<div id="spark-mc-modal">' +
      '<button class="spark-mc-close" type="button" aria-label="Close">×</button>' +
      '<div class="spark-mc-kicker">The Sparkverse</div>' +
      '<h2 id="spark-mc-title">Get the transmissions</h2>' +
      '<p class="spark-mc-copy">Drops, build logs, and new tools — straight to your inbox. No spam. Unsubscribe anytime.</p>' +
      '<form id="spark-mc-form" novalidate>' +
        '<label class="spark-mc-hp" for="spark-mc-hp">Leave blank</label>' +
        '<input class="spark-mc-hp" type="text" id="spark-mc-hp" name="hp" tabindex="-1" autocomplete="off">' +
        '<input type="email" name="EMAIL" placeholder="you@email.com" required autocomplete="email">' +
        '<button type="submit">Join the signal →</button>' +
        '<div class="spark-mc-msg" id="spark-mc-msg" aria-live="polite"></div>' +
      '</form>' +
      '<p class="spark-mc-alt">Want the full Lobby? <a href="https://whop.com/sparkverse-511c/the-sparkverse-lobby/" target="_blank" rel="noopener">Join free on Whop →</a></p>' +
    '</div>';

  document.body.appendChild(overlay);

  function closePopup() {
    overlay.classList.remove('spark-mc-open');
    sessionStorage.setItem('spark_mc_popup_dismissed', '1');
    localStorage.setItem('spark_mc_popup_dismissed_at', String(Date.now()));
    setTimeout(function () { overlay.remove(); }, 400);
  }

  function showSuccess(msg) {
    var modal = document.getElementById('spark-mc-modal');
    modal.innerHTML =
      '<button class="spark-mc-close" type="button" aria-label="Close">×</button>' +
      '<div class="spark-mc-success">' +
        '<div class="spark-mc-icon">✦</div>' +
        '<h2>You\'re on the list</h2>' +
        '<p class="spark-mc-copy">' + (msg || 'Check your inbox to confirm.') + '</p>' +
        '<p class="spark-mc-alt"><a href="https://whop.com/sparkverse-511c/the-sparkverse-lobby/" target="_blank" rel="noopener">Enter the Lobby →</a></p>' +
      '</div>';
    modal.querySelector('.spark-mc-close').addEventListener('click', closePopup);
    localStorage.setItem('spark_mc_subscribed', '1');
    setTimeout(closePopup, 5000);
  }

  function showError(text) {
    var msg = document.getElementById('spark-mc-msg');
    if (msg) {
      msg.className = 'spark-mc-msg error';
      msg.textContent = text;
    }
  }

  window.sparkMailchimpCallback = function (data) {
    var btn = document.querySelector('#spark-mc-form button[type=submit]');
    if (btn) btn.disabled = false;

    if (data.result === 'success') {
      showSuccess(data.msg ? data.msg.replace(/<[^>]+>/g, '') : '');
      return;
    }

    var err = (data.msg || 'Something went wrong. Try again.').replace(/<[^>]+>/g, '');
    showError(err);
  };

  function submitToMailchimp(email) {
    if (!CONFIG.id || CONFIG.id === 'YOUR_LIST_ID_HERE') {
      showError('Mailchimp list ID not set yet. Add it to spark-mailchimp-config.js');
      return;
    }

    var btn = document.querySelector('#spark-mc-form button[type=submit]');
    if (btn) btn.disabled = true;

    var msg = document.getElementById('spark-mc-msg');
    if (msg) { msg.className = 'spark-mc-msg'; msg.textContent = ''; }

    var url = 'https://' + CONFIG.dc + '.list-manage.com/subscribe/post-json?u=' + CONFIG.u +
      '&id=' + CONFIG.id + '&EMAIL=' + encodeURIComponent(email) + '&c=sparkMailchimpCallback';

    var old = document.getElementById('spark-mc-jsonp');
    if (old) old.remove();

    var script = document.createElement('script');
    script.id = 'spark-mc-jsonp';
    script.src = url;
    script.onerror = function () {
      if (btn) btn.disabled = false;
      showError('Could not reach Mailchimp. Check your connection.');
    };
    document.body.appendChild(script);
  }

  overlay.querySelector('.spark-mc-close').addEventListener('click', closePopup);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closePopup();
  });

  document.getElementById('spark-mc-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var hp = document.getElementById('spark-mc-hp');
    if (hp && hp.value) return;

    var emailInput = e.target.querySelector('input[type=email]');
    var email = (emailInput.value || '').trim();
    if (!email || email.indexOf('@') < 1) {
      showError('Enter a valid email.');
      return;
    }

    submitToMailchimp(email);
  });

  setTimeout(function () {
    overlay.classList.add('spark-mc-open');
  }, CONFIG.delayMs);
})();