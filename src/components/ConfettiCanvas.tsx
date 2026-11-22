import React, { useEffect, useRef } from 'react';

interface ConfettiCanvasProps {
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vr: number;
  opacity: number;
}

const COLORS = ['#0EA5E9', '#38BDF8', '#10B981', '#F97316', '#06B6D4', '#FACC15', '#EC4899'];

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    const width = parent ? parent.clientWidth : window.innerWidth;
    const height = parent ? parent.clientHeight : window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const particles: Particle[] = Array.from({ length: 72 }, () => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
      const speed = 5 + Math.random() * 8;
      return {
        x: width / 2 + (Math.random() - 0.5) * 90,
        y: height * 0.42 + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 5 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.24,
        opacity: 1,
      };
    });

    let animId = 0;
    let frame = 0;

    const tick = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.24; // gravity
        p.vx *= 0.988;
        p.rotation += p.vr;
        if (frame > 70) {
          p.opacity = Math.max(0, p.opacity - 0.025);
        }
        if (p.opacity > 0.02 && p.y < height + 30) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size * 0.35, p.size, p.size * 0.7);
          ctx.restore();
        }
      }

      if (alive && frame < 165) {
        animId = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-50 h-full w-full"
    />
  );
};
