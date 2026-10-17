/**
 * HIGH-PERFORMANCE AMBIENT & CONFETTI PARTICLE SYSTEM
 * "PSSST... THIS IS FOR YOU"
 */

class ParticleEngine {
  constructor() {
    this.ambientCanvas = document.getElementById('ambient-canvas');
    this.confettiCanvas = document.getElementById('confetti-canvas');
    
    this.ambientCtx = this.ambientCanvas ? this.ambientCanvas.getContext('2d') : null;
    this.confettiCtx = this.confettiCanvas ? this.confettiCanvas.getContext('2d') : null;

    this.ambientParticles = [];
    this.confettiPieces = [];
    this.isRunning = false;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.colors = [
      '#FF496C', // Cherry red
      '#F8D176', // Gold
      '#BCA7F5', // Lavender
      '#F7DCE5', // Blush pink
      '#D98DA5', // Dusty rose
      '#FFF5EB'  // Warm cream
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
    
    // Spawn initial stars, motes & floating hearts
    this.createAmbientWorld();

    this.isRunning = true;
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (this.ambientCanvas && this.ambientCtx) {
      this.ambientCanvas.width = this.width * dpr;
      this.ambientCanvas.height = this.height * dpr;
      this.ambientCtx.scale(dpr, dpr);
    }

    if (this.confettiCanvas && this.confettiCtx) {
      this.confettiCanvas.width = this.width * dpr;
      this.confettiCanvas.height = this.height * dpr;
      this.confettiCtx.scale(dpr, dpr);
    }
  }

  createAmbientWorld() {
    this.ambientParticles = [];
    const count = Math.min(Math.floor((this.width * this.height) / 12000), 75);

    for (let i = 0; i < count; i++) {
      const type = Math.random() > 0.85 ? 'heart' : (Math.random() > 0.5 ? 'star' : 'mote');
      this.ambientParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: type === 'heart' ? (Math.random() * 8 + 8) : (Math.random() * 2.5 + 1),
        speedY: -(Math.random() * 0.4 + 0.1),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        type
      });
    }
  }

  /**
   * Explodes confetti at given coordinates
   */
  triggerConfetti(x = this.width / 2, y = this.height / 2, count = 70) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      const shape = Math.random() > 0.75 ? 'heart' : (Math.random() > 0.5 ? 'circle' : 'rect');

      this.confettiPieces.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 4,
        size: Math.random() * 10 + 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        shape,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        wobble: 0,
        wobbleSpeed: Math.random() * 0.1 + 0.05,
        opacity: 1,
        decay: Math.random() * 0.008 + 0.006,
        gravity: 0.28
      });
    }
  }

  /**
   * Spawns rising hearts on tap
   */
  triggerHeartBurst(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
      const speed = Math.random() * 6 + 3;

      this.confettiPieces.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 14 + 10,
        color: Math.random() > 0.4 ? '#FF496C' : '#F7DCE5',
        shape: 'heart',
        rotation: (Math.random() - 0.5) * 30,
        rotationSpeed: (Math.random() - 0.5) * 4,
        wobble: 0,
        wobbleSpeed: 0.08,
        opacity: 1,
        decay: Math.random() * 0.012 + 0.008,
        gravity: 0.12
      });
    }
  }

  /**
   * Massive finale multi-burst celebration
   */
  triggerFinaleCelebration() {
    let waves = 0;
    const interval = setInterval(() => {
      this.triggerConfetti(this.width * 0.2 + Math.random() * this.width * 0.6, this.height * 0.35 + Math.random() * 200, 65);
      waves++;
      if (waves >= 6) {
        clearInterval(interval);
      }
    }, 350);
  }

  drawHeart(ctx, x, y, size, color, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 20, size / 20);
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-10, -10, -20, 5, 0, 20);
    ctx.bezierCurveTo(20, 5, 10, -10, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  drawStar(ctx, x, y, size, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#FFF5EB';
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.lineTo(size * 1.8, 0);
      ctx.lineTo(size * 0.4, size * 0.4);
    }
    ctx.fill();
    ctx.restore();
  }

  loop() {
    if (!this.isRunning) return;

    // 1. Ambient Background Layer
    if (this.ambientCtx) {
      this.ambientCtx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.ambientParticles.length; i++) {
        const p = this.ambientParticles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.008;
        p.opacity = Math.max(0.1, Math.min(0.85, p.opacity));

        // Wrap around screen boundaries
        if (p.y < -20) p.y = this.height + 10;
        if (p.x < -20) p.x = this.width + 10;
        if (p.x > this.width + 20) p.x = -10;

        if (p.type === 'heart') {
          this.drawHeart(this.ambientCtx, p.x, p.y, p.size, p.color, p.opacity);
        } else if (p.type === 'star') {
          this.drawStar(this.ambientCtx, p.x, p.y, p.size, p.opacity);
        } else {
          this.ambientCtx.beginPath();
          this.ambientCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ambientCtx.fillStyle = p.color;
          this.ambientCtx.globalAlpha = p.opacity;
          this.ambientCtx.fill();
        }
      }
    }

    // 2. Confetti & Action Burst Layer
    if (this.confettiCtx) {
      this.confettiCtx.clearRect(0, 0, this.width, this.height);

      for (let i = this.confettiPieces.length - 1; i >= 0; i--) {
        const c = this.confettiPieces[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vy += c.gravity;
        c.vx *= 0.98; // Air drag
        c.rotation += c.rotationSpeed;
        c.wobble += c.wobbleSpeed;
        c.opacity -= c.decay;

        if (c.opacity <= 0 || c.y > this.height + 40) {
          this.confettiPieces.splice(i, 1);
          continue;
        }

        this.confettiCtx.save();
        this.confettiCtx.translate(c.x, c.y);
        this.confettiCtx.rotate((c.rotation * Math.PI) / 180);
        this.confettiCtx.globalAlpha = Math.max(0, c.opacity);
        this.confettiCtx.fillStyle = c.color;

        const wobbleScale = Math.sin(c.wobble);

        if (c.shape === 'heart') {
          this.drawHeart(this.confettiCtx, 0, 0, c.size, c.color, c.opacity);
        } else if (c.shape === 'circle') {
          this.confettiCtx.beginPath();
          this.confettiCtx.arc(0, 0, c.size * 0.5, 0, Math.PI * 2);
          this.confettiCtx.fill();
        } else {
          // 3D spinning rectangle
          this.confettiCtx.scale(wobbleScale, 1);
          this.confettiCtx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size * 0.6);
        }

        this.confettiCtx.restore();
      }
    }

    requestAnimationFrame(this.loop);
  }
}

export const particles = new ParticleEngine();

