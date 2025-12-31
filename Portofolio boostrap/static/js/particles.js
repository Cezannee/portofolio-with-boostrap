// Simple starfield particles — lightweight and customizable
class Starfield {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resize();

    window.addEventListener('resize', () => this.resize());

    this.stars = [];
    this.create(220);
    this.t = 0;
    requestAnimationFrame(() => this.frame());
  }

  resize() {
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
  }

  create(n) {
    this.stars = Array.from({ length: n }).map(() => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      z: Math.random() * 1.2 + 0.2,
      o: Math.random() * 0.8 + 0.2
    }));
  }

  frame() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';

    for (const s of this.stars) {
      s.x += 0.2 * s.z;
      s.y += 0.05 * s.z;

      if (s.x > w) s.x = 0;
      if (s.y > h) s.y = 0;

      const r = 0.6 * s.z;
      ctx.beginPath();
      ctx.globalAlpha = s.o;
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.frame());
  }
}

// export global
window.createStarfield = (canvas) => new Starfield(canvas);
