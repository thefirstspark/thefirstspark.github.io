(function () {
  if (document.getElementById('spark-lobby-cta')) return;
  if (sessionStorage.getItem('spark-lobby-cta-dismissed') === '1') return;

  var LOBBY_URL = 'https://whop.com/sparkverse-511c/the-sparkverse-lobby/';
  var TOOLS_URL = 'https://thefirstspark.shop/free-tools.html';

  var style = document.createElement('style');
  style.textContent = [
    '#spark-lobby-cta{position:fixed;bottom:0;left:0;right:0;z-index:99999;',
    'display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;',
    'padding:12px 48px 12px 20px;background:linear-gradient(180deg,rgba(10,10,15,.72),rgba(10,10,15,.96));',
    'border-top:1px solid rgba(183,148,255,.35);backdrop-filter:blur(12px);',
    'font-family:Inter,system-ui,sans-serif;font-size:13px;color:#f4ede0;',
    'animation:sparkCtaIn .45s ease}',
    '@keyframes sparkCtaIn{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}',
    '#spark-lobby-cta .spark-cta-text{color:#b794ff;margin:0}',
    '#spark-lobby-cta .spark-cta-text strong{color:#ffc857;font-weight:600}',
    '#spark-lobby-cta a.spark-cta-btn{display:inline-flex;align-items:center;gap:6px;',
    'padding:8px 16px;border-radius:6px;text-decoration:none;font-weight:600;font-size:12px;',
    'letter-spacing:.04em;transition:transform .2s,box-shadow .2s}',
    '#spark-lobby-cta a.spark-cta-primary{background:linear-gradient(135deg,#9d6bff,#b794ff);color:#0a0a0f}',
    '#spark-lobby-cta a.spark-cta-primary:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(157,107,255,.4)}',
    '#spark-lobby-cta a.spark-cta-ghost{border:1px solid rgba(244,237,224,.25);color:#f4ede0}',
    '#spark-lobby-cta a.spark-cta-ghost:hover{border-color:#b794ff;color:#b794ff}',
    '#spark-lobby-cta .spark-cta-close{position:absolute;right:14px;top:50%;transform:translateY(-50%);',
    'background:none;border:none;color:#6b6a6e;font-size:20px;line-height:1;cursor:pointer;padding:4px}',
    '#spark-lobby-cta .spark-cta-close:hover{color:#f4ede0}',
    '@media(max-width:600px){#spark-lobby-cta{padding:10px 40px 10px 14px;font-size:12px;gap:8px}',
    '#spark-lobby-cta a.spark-cta-btn{padding:7px 12px;font-size:11px}}'
  ].join('');
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.id = 'spark-lobby-cta';
  bar.innerHTML =
    '<p class="spark-cta-text"><strong>Drops + chat</strong> live in the Lobby</p>' +
    '<a class="spark-cta-btn spark-cta-primary" href="' + LOBBY_URL + '" target="_blank" rel="noopener">Join free →</a>' +
    '<a class="spark-cta-btn spark-cta-ghost" href="' + TOOLS_URL + '">All 8 free tools</a>' +
    '<button class="spark-cta-close" type="button" aria-label="Dismiss">×</button>';

  bar.querySelector('.spark-cta-close').addEventListener('click', function () {
    sessionStorage.setItem('spark-lobby-cta-dismissed', '1');
    bar.remove();
  });

  document.body.appendChild(bar);
})();