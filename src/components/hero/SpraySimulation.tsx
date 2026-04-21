import { useRef, useEffect } from 'preact/hooks';

interface Ring {
  x: number;
  y: number;
  r: number;
  maxR: number;
  life: number;
  maxLife: number;
  hue: 'teal' | 'green';
}

interface Blade {
  x: number;
  h: number;
  maxH: number;
  delay: number;
  sway: number;
}

export default function SpraySimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1, t = 0;
    let rings: Ring[] = [];
    let blades: Blade[] = [];

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      // seed blades along baseline
      blades = [];
      const count = Math.floor(w / 14);
      for (let i = 0; i < count; i++) {
        blades.push({
          x: (i / count) * w + (Math.random() - 0.5) * 10,
          h: 0,
          maxH: 18 + Math.random() * 42,
          delay: Math.random() * 300,
          sway: Math.random() * Math.PI * 2,
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const spawnRing = () => {
      rings.push({
        x: w * (0.3 + Math.random() * 0.5),
        y: h * (0.25 + Math.random() * 0.3),
        r: 0,
        maxR: 120 + Math.random() * 200,
        life: 0,
        maxLife: 180 + Math.random() * 120,
        hue: Math.random() < 0.5 ? 'teal' : 'green',
      });
    };

    const step = () => {
      t++;
      if (t % 120 === 0 || rings.length < 2) spawnRing();

      ctx.clearRect(0, 0, w, h);

      // soft horizon wash
      const grad = ctx.createLinearGradient(0, h * 0.5, 0, h);
      grad.addColorStop(0, 'oklch(94% 0.03 148 / 0)');
      grad.addColorStop(1, 'oklch(67% 0.14 148 / 0.08)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, h * 0.5, w, h * 0.5);

      // rings
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.life++;
        const p = ring.life / ring.maxLife;
        ring.r = ring.maxR * (1 - Math.pow(1 - p, 3));
        const alpha = (1 - p) * 0.3;
        const color = ring.hue === 'teal'
          ? `oklch(56% 0.12 195 / ${alpha})`
          : `oklch(58% 0.16 148 / ${alpha})`;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx.stroke();
        // inner dot
        if (p < 0.3) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(ring.x, ring.y, 2.5 * (1 - p / 0.3), 0, Math.PI * 2);
          ctx.fill();
        }
        if (ring.life > ring.maxLife) rings.splice(i, 1);
      }

      // grass blades growing
      const baseY = h * 0.88;
      for (const b of blades) {
        if (t > b.delay) {
          if (b.h < b.maxH) b.h += 0.12 + Math.random() * 0.08;
        }
        if (b.h > 1) {
          const sway = Math.sin(t * 0.02 + b.sway) * 2;
          ctx.strokeStyle = `oklch(${50 + b.h * 0.2}% 0.16 148 / 0.42)`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(b.x, baseY);
          ctx.quadraticCurveTo(b.x + sway * 0.3, baseY - b.h * 0.5, b.x + sway, baseY - b.h);
          ctx.stroke();
        }
      }

      // faint baseline
      ctx.strokeStyle = 'oklch(38% 0.05 65 / 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, baseY);
      ctx.lineTo(w, baseY);
      ctx.stroke();

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
