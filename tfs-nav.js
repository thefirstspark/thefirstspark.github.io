/**
 * tfs-nav.js — Shared navigation bar for The First Spark tool pages
 * 
 * Usage: Add <script src="/tfs-nav.js"></script> inside <head> or just before </body>
 * To enable the free-tier upgrade banner: <body data-tier="free">
 */
(function () {
  'use strict';

  var NAV_HEIGHT = 50;
  var WHOP_FREE  = 'https://whop.com/sparkverse-511c/the-sparkverse-lobby/';
  var WHOP_JOIN  = 'https://whop.com/sparkverse-511c/spark-acces/';

  /* ── Inject styles ───────────────────────────────────────────── */
  var css = [
    '#tfs-nav{',
    '  position:fixed;top:0;left:0;right:0;z-index:99999;',
    '  height:' + NAV_HEIGHT + 'px;',
    '  background:rgba(5,5,8,0.97);',
    '  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);',
    '  border-bottom:1px solid rgba(251,191,36,0.18);',
    '  display:flex;align-items:center;justify-content:space-between;',
    '  padding:0 18px;',
    '  font-family:"Space Mono","Courier New",monospace;',
    '  box-sizing:border-box;',
    '}',
    '#tfs-nav a{text-decoration:none;transition:color .2s;}',
    '#tfs-nav .tfs-nav-logo{',
    '  font-size:.6rem;letter-spacing:.22em;text-transform:uppercase;',
    '  color:#fbbf24;font-weight:700;white-space:nowrap;',
    '}',
    '#tfs-nav .tfs-nav-logo:hover{color:#fff;}',
    '#tfs-nav .tfs-nav-links{',
    '  display:flex;align-items:center;gap:18px;',
    '}',
    '#tfs-nav .tfs-nav-link{',
    '  font-size:.52rem;letter-spacing:.18em;text-transform:uppercase;',
    '  color:rgba(255,255,255,0.38);',
    '}',
    '#tfs-nav .tfs-nav-link:hover{color:rgba(255,255,255,0.85);}',
    '#tfs-nav .tfs-nav-cta{',
    '  font-size:.52rem;letter-spacing:.15em;text-transform:uppercase;',
    '  padding:6px 14px;border:1px solid #fbbf24;color:#fbbf24;',
    '  white-space:nowrap;',
    '}',
    '#tfs-nav .tfs-nav-cta:hover{background:#fbbf24;color:#050508;}',

    /* Upgrade banner (free-tier) */
    '#tfs-upgrade-banner{',
    '  position:fixed;bottom:0;left:0;right:0;z-index:99998;',
    '  background:linear-gradient(90deg,rgba(5,5,8,0.98),rgba(10,10,26,0.98));',
    '  border-top:1px solid rgba(0,212,255,0.3);',
    '  display:flex;align-items:center;justify-content:center;gap:16px;',
    '  padding:10px 18px;',
    '  font-family:"Space Mono","Courier New",monospace;',
    '  box-sizing:border-box;',
    '  flex-wrap:wrap;',
    '}',
    '#tfs-upgrade-banner p{',
    '  font-size:.55rem;letter-spacing:.12em;',
    '  color:rgba(255,255,255,0.5);margin:0;',
    '}',
    '#tfs-upgrade-banner a{',
    '  font-size:.52rem;letter-spacing:.15em;text-transform:uppercase;',
    '  padding:5px 14px;border:1px solid #22d3ee;color:#22d3ee;',
    '  text-decoration:none;white-space:nowrap;transition:background .2s,color .2s;',
    '}',
    '#tfs-upgrade-banner a:hover{background:#22d3ee;color:#050508;}',
    '#tfs-upgrade-dismiss{',
    '  background:none;border:none;color:rgba(255,255,255,0.25);',
    '  font-size:.8rem;cursor:pointer;padding:0 4px;line-height:1;',
    '}',
    '#tfs-upgrade-dismiss:hover{color:rgba(255,255,255,0.6);}',

    /* Push page content below the nav */
    'body.tfs-nav-active{padding-top:' + NAV_HEIGHT + 'px !important;}',

    /* Mobile: collapse middle links */
    '@media(max-width:480px){',
    '  #tfs-nav .tfs-nav-link{display:none;}',
    '  #tfs-nav{padding:0 12px;}',
    '}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ── Build nav HTML ──────────────────────────────────────────── */
  var nav = document.createElement('nav');
  nav.id = 'tfs-nav';
  nav.setAttribute('aria-label', 'The First Spark site navigation');
  nav.innerHTML = [
    '<a href="/" class="tfs-nav-logo">◈ The First Spark</a>',
    '<div class="tfs-nav-links">',
    '  <a href="/sparkverse.html" class="tfs-nav-link">← Hub</a>',
    '  <a href="/tools.html" class="tfs-nav-link">All Tools</a>',
    '  <a href="' + WHOP_JOIN + '" class="tfs-nav-cta" target="_blank" rel="noopener">Join Free →</a>',
    '</div>'
  ].join('');

  /* Insert as first child of body (or before body exists: prepend after DOMContentLoaded) */
  function injectNav() {
    if (!document.body) return;
    document.body.insertBefore(nav, document.body.firstChild);
    document.body.classList.add('tfs-nav-active');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNav);
  } else {
    injectNav();
  }

  /* ── Upgrade banner for free-tier pages ─────────────────────── */
  function injectUpgradeBanner() {
    if (!document.body) return;
    var tier = document.body.getAttribute('data-tier');
    if (tier !== 'free') return;

    /* Respect dismiss preference (session-scoped) */
    try {
      if (sessionStorage.getItem('tfs-banner-dismissed') === '1') return;
    } catch (e) { /* ignore */ }

    var banner = document.createElement('div');
    banner.id = 'tfs-upgrade-banner';
    banner.setAttribute('role', 'complementary');
    banner.setAttribute('aria-label', 'Upgrade prompt');
    banner.innerHTML = [
      '<p>You\'re using a free tool — unlock 60+ more with Players Lounge</p>',
      '<a href="' + WHOP_FREE + '" target="_blank" rel="noopener">Start Free</a>',
      '<a href="' + WHOP_JOIN + '" target="_blank" rel="noopener">Upgrade $33/mo</a>',
      '<button id="tfs-upgrade-dismiss" aria-label="Dismiss">✕</button>'
    ].join('');

    document.body.appendChild(banner);

    document.getElementById('tfs-upgrade-dismiss').addEventListener('click', function () {
      banner.remove();
      try { sessionStorage.setItem('tfs-banner-dismissed', '1'); } catch (e) { /* ignore */ }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectUpgradeBanner);
  } else {
    injectUpgradeBanner();
  }
})();
