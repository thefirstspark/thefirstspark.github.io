/* ============================================
   FIRST SPARK — Cosmos Particle Field
   ============================================ */

(function () {
  const canvas = document.getElementById('cosmos');
  const ctx = canvas.getContext('2d');

  let W, H, particles, mouse = { x: -999, y: -999 };

  // ── PARTICLE ──
  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 1.2 + 0.2;
    this.speedX = (Math.random() - 0.5) * 0.15;
    this.speedY = (Math.random() - 0.5) * 0.15;
    this.opacity = Math.random() * 0.6 + 0.1;
    this.flicker = Math.random() * Math.PI * 2;
    this.flickerSpeed = Math.random() * 0.02 + 0.005;
    // ember tint: mostly cool white, occasional warm
    const warm = Math.random() < 0.15;
    this.r = warm ? 200 + Math.floor(Math.random() * 55) : 180 + Math.floor(Math.random() * 50);
    this.g = warm ? 130 + Math.floor(Math.random() * 50) : 180 + Math.floor(Math.random() * 50);
    this.b = warm ? 30  + Math.floor(Math.random() * 40) : 220 + Math.floor(Math.random() * 35);
  };

  Particle.prototype.update = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    this.flicker += this.flickerSpeed;

    // Soft mouse repulsion
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      const force = (100 - dist) / 100;
      this.x += dx / dist * force * 0.5;
      this.y += dy / dist * force * 0.5;
    }

    // Wrap edges
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  };

  Particle.prototype.draw = function () {
    const alpha = this.opacity * (0.6 + 0.4 * Math.sin(this.flicker));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},${alpha})`;
    ctx.fill();
  };

  // ── EMBER STREAKS (rare long particles) ──
  const streaks = [];
  function Streak() {
    this.reset();
  }
  Streak.prototype.reset = function () {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.len = Math.random() * 40 + 10;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.3 + 0.05;
    this.opacity = Math.random() * 0.15 + 0.02;
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
  };
  Streak.prototype.update = function () {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.life++;
    if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
      this.reset();
    }
  };
  Streak.prototype.draw = function () {
    const t = this.life / this.maxLife;
    const alpha = this.opacity * Math.sin(t * Math.PI);
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - Math.cos(this.angle) * this.len, this.y - Math.sin(this.angle) * this.len);
    ctx.strokeStyle = `rgba(200,133,42,${alpha})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  };

  // ── INIT ──
  function init() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;

    const count = Math.min(Math.floor((W * H) / 8000), 200);
    particles = Array.from({ length: count }, () => new Particle());

    const streakCount = Math.floor(count / 20);
    for (let i = 0; i < streakCount; i++) streaks.push(new Streak());
  }

  // ── LOOP ──
  function loop() {
    ctx.clearRect(0, 0, W, H);

    // Background gradient pulse (very subtle)
    const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
    grad.addColorStop(0, 'rgba(15,10,25,0.3)');
    grad.addColorStop(1, 'rgba(5,5,8,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    streaks.forEach(s => { s.update(); s.draw(); });
    particles.forEach(p => { p.update(); p.draw(); });

    requestAnimationFrame(loop);
  }

  // ── SCROLL REVEAL ──
  function initReveal() {
    const cards = document.querySelectorAll('.tool-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    cards.forEach(c => observer.observe(c));
  }

  // ── EVENTS ──
  window.addEventListener('resize', init);
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  init();
  loop();
  initReveal();
})();
