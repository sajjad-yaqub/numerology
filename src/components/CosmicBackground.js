/**
 * ASTRANUMERICS - COSMIC CANVAS BACKGROUND
 * Interactive canvas starfield with subtle glowing particles & celestial dust.
 */

export function initCosmicCanvas(canvasId = 'cosmic-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const numParticles = Math.min(100, Math.floor((width * height) / 12000));

  class Star {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.7 + 0.2;
      this.speedAlpha = (Math.random() * 0.01 + 0.003) * (Math.random() > 0.5 ? 1 : -1);
      this.gold = Math.random() > 0.75;
    }

    update() {
      this.alpha += this.speedAlpha;
      if (this.alpha > 0.95 || this.alpha < 0.15) {
        this.speedAlpha = -this.speedAlpha;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.gold
        ? `rgba(243, 206, 109, ${this.alpha})`
        : `rgba(226, 232, 255, ${this.alpha * 0.8})`;
      ctx.shadowBlur = this.gold ? 8 : 4;
      ctx.shadowColor = this.gold ? '#f3ce6d' : '#e2e8ff';
      ctx.fill();
    }
  }

  for (let i = 0; i < numParticles; i++) {
    particles.push(new Star());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Subtle background radial gradient
    const grad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      10,
      width / 2,
      height / 2,
      Math.max(width, height)
    );
    grad.addColorStop(0, 'rgba(28, 20, 54, 0.4)');
    grad.addColorStop(0.6, 'rgba(15, 18, 29, 0.7)');
    grad.addColorStop(1, 'rgba(9, 10, 16, 1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    for (const p of particles) {
      p.update();
      p.draw();
    }

    requestAnimationFrame(render);
  }

  render();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}
