/* The First Spark — shared email capture.
 *
 * Drop anywhere:  <div data-spark-capture data-source="shop"></div>
 *                 <script src="https://thefirstspark.shop/js/spark-capture.js" defer></script>
 *
 * Optional attrs: data-label, data-copy, data-button, data-variant="bar" (single row, no card).
 * Posts to the list API (Supabase tfs_subscribers via bio-link). Remembers the email in
 * localStorage `tfs-email` (same key the homepage footer + generator gate use) so a
 * visitor who already signed up sees a quiet "you're on the list" instead of a form.
 */
(function () {
  var API = 'https://links.thefirstspark.shop/api/subscribe';
  var nodes = document.querySelectorAll('[data-spark-capture]');
  if (!nodes.length) return;

  var css = [
    '.sc{--sc-spark:var(--spark,#fbbf24);--sc-ink:var(--ink,#e8e4d8);--sc-mute:var(--mute,#9c978b);--sc-line:rgba(232,228,216,.12);',
    'font-family:"Space Mono","Courier New",monospace;color:var(--sc-ink);background:rgba(255,255,255,.025);border:1px solid var(--sc-line);',
    'border-radius:14px;padding:22px 22px 18px;max-width:560px;margin:28px auto;text-align:left;box-sizing:border-box}',
    '.sc *{box-sizing:border-box}',
    '.sc-label{font-family:Orbitron,"Space Mono",sans-serif;font-size:.58rem;letter-spacing:.22em;text-transform:uppercase;color:var(--sc-spark);margin:0 0 8px}',
    '.sc-copy{font-size:.8rem;line-height:1.65;color:var(--sc-mute);margin:0 0 14px}',
    '.sc-form{display:flex;gap:8px;flex-wrap:wrap}',
    '.sc-form input{flex:1 1 200px;min-width:0;background:#0b0b12;border:1px solid var(--sc-line);border-radius:8px;color:var(--sc-ink);',
    'font-family:inherit;font-size:.86rem;padding:12px 13px;outline:none}',
    '.sc-form input:focus{border-color:var(--sc-spark)}',
    '.sc-form button{flex:0 0 auto;cursor:pointer;font-family:Orbitron,"Space Mono",sans-serif;font-size:.56rem;font-weight:700;letter-spacing:.14em;',
    'text-transform:uppercase;color:#08080d;background:var(--sc-spark);border:0;border-radius:8px;padding:0 18px;min-height:44px}',
    '.sc-form button:hover{background:#fcd34d}.sc-form button[disabled]{opacity:.6;cursor:wait}',
    '.sc-msg{font-size:.72rem;color:var(--sc-mute);margin:10px 0 0;min-height:1em;line-height:1.5}.sc-msg.ok{color:var(--sc-spark)}.sc-msg.bad{color:#f87171}',
    '.sc-done{font-size:.78rem;color:var(--sc-mute)}.sc-done b{color:var(--sc-spark);font-weight:400}.sc-done a{color:var(--sc-mute);text-decoration:underline;cursor:pointer;margin-left:6px}',
    '.sc.bar{max-width:none;background:transparent;border:0;border-top:1px solid var(--sc-line);border-radius:0;padding:18px 0 0;margin:24px 0 0}',
    '.sc.bar .sc-copy{margin-bottom:10px}'
  ].join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function track(ev, params) {
    try {
      if (typeof gtag === 'function') gtag('event', ev, params || {});
      else if (window.dataLayer) window.dataLayer.push(Object.assign({ event: ev }, params || {}));
    } catch (_) {}
  }
  function saved() { try { return localStorage.getItem('tfs-email') || ''; } catch (_) { return ''; } }
  function remember(e) { try { localStorage.setItem('tfs-email', e); } catch (_) {} }
  function forget() { try { localStorage.removeItem('tfs-email'); } catch (_) {} }

  nodes.forEach(function (el, i) {
    var source = el.getAttribute('data-source') || (location.pathname.replace(/^\/|\.html$/g, '') || 'home');
    var label = el.getAttribute('data-label') || 'The Drop';
    var copy = el.getAttribute('data-copy') || 'One email when something ships. A new tool, a chapter, a map spotlight. No schedule, no filler.';
    var button = el.getAttribute('data-button') || 'Get the drops';
    var variant = el.getAttribute('data-variant') || '';
    el.className = (el.className ? el.className + ' ' : '') + 'sc' + (variant ? ' ' + variant : '');

    function renderDone(email) {
      el.innerHTML = '<div class="sc-label">' + label + '</div>' +
        '<div class="sc-done">You’re on the list as <b></b>.<a role="button" tabindex="0">Not you?</a></div>';
      el.querySelector('b').textContent = email;
      var a = el.querySelector('a');
      a.addEventListener('click', function () { forget(); renderForm(); });
      a.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); forget(); renderForm(); } });
    }

    function renderForm() {
      var id = 'sc-email-' + i;
      el.innerHTML = '<div class="sc-label">' + label + '</div>' +
        '<p class="sc-copy"></p>' +
        '<form class="sc-form" novalidate><input type="email" id="' + id + '" placeholder="you@example.com" autocomplete="email" aria-label="Email address" required>' +
        '<button type="submit"></button></form><div class="sc-msg" role="status" aria-live="polite"></div>';
      el.querySelector('.sc-copy').textContent = copy;
      el.querySelector('button').textContent = button;
      var form = el.querySelector('form'), input = el.querySelector('input'), btn = el.querySelector('button'), msg = el.querySelector('.sc-msg');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var em = (input.value || '').trim().toLowerCase();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(em)) { msg.textContent = 'Enter a valid email first.'; msg.className = 'sc-msg bad'; input.focus(); return; }
        btn.disabled = true; msg.textContent = 'Sending…'; msg.className = 'sc-msg';
        fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: em, source: source, want_email: true }) })
          .then(function (r) { return r.json(); })
          .then(function (d) {
            if (!d || !d.ok) throw new Error((d && d.error) || 'failed');
            remember(em);
            track('email_capture', { source: source, status: d.status });
            msg.textContent = 'Check your inbox. Your first spark is on its way.'; msg.className = 'sc-msg ok';
            setTimeout(function () { renderDone(em); }, 2600);
          })
          .catch(function () { msg.textContent = 'That did not go through. Try again in a minute.'; msg.className = 'sc-msg bad'; btn.disabled = false; });
      });
    }

    var have = saved();
    if (have && /@/.test(have)) renderDone(have); else renderForm();
  });
})();
