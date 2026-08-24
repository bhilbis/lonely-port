"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  depth: number; // 0 (far) – 1 (near)
  size: number;
  tw: number;    // twinkle phase
  twSpeed: number;
};

type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
};

/**
 * Lightweight 2D-canvas starfield with three parallax responses:
 * mouse drift, scroll drift, and a slow ambient rotation of twinkle phases.
 * Sits fixed behind the whole page for a fraction of the cost of WebGL.
 */
export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let raf = 0;

    let stars: Star[] = [];
    const meteors: Meteor[] = [];
    let nextMeteor = 4 + Math.random() * 6;

    const mouse = { x: 0, y: 0, cx: 0, cy: 0 };
    let scrollDrift = 0;

    const seed = () => {
      const isMobile = W < 768;
      const count = isMobile ? 140 : Math.min(340, Math.round((W * H) / 6200));
      stars = Array.from({ length: count }, () => {
        const depth = Math.random();
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          depth,
          size: 0.4 + depth * 1.3,
          tw: Math.random() * Math.PI * 2,
          twSpeed: 0.004 + Math.random() * 0.012,
        };
      });
    };

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / W - 0.5) * 2;
      mouse.y = (e.clientY / H - 0.5) * 2;
    };

    const onScroll = () => {
      scrollDrift = window.scrollY * 0.06;
    };

    const spawnMeteor = () => {
      const fromLeft = Math.random() > 0.5;
      const speed = 9 + Math.random() * 6;
      const angle = (25 + Math.random() * 20) * (Math.PI / 180);
      meteors.push({
        x: fromLeft ? -40 : Math.random() * W,
        y: Math.random() * H * 0.4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 40 + Math.random() * 25,
      });
    };

    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 16.7, 3);
      last = now;

      mouse.cx += (mouse.x - mouse.cx) * 0.03 * dt;
      mouse.cy += (mouse.y - mouse.cy) * 0.03 * dt;

      ctx.clearRect(0, 0, W, H);

      for (const s of stars) {
        s.tw += s.twSpeed * dt;
        const alpha = 0.25 + s.depth * 0.45 + Math.sin(s.tw) * 0.22;
        const px =
          ((s.x - mouse.cx * 26 * s.depth) % (W + 40) + W + 40) % (W + 40) - 20;
        const py =
          ((s.y - scrollDrift * s.depth - mouse.cy * 18 * s.depth) % (H + 40) +
            H + 40) % (H + 40) - 20;

        ctx.beginPath();
        ctx.arc(px, py, s.size, 0, Math.PI * 2);
        const blue = 200 + Math.round(s.depth * 55);
        ctx.fillStyle = `rgba(${170 + Math.round(s.depth * 40)}, ${185 +
          Math.round(s.depth * 35)}, ${blue}, ${Math.max(alpha, 0)})`;
        ctx.fill();
      }

      if (!reduced) {
        nextMeteor -= dt / 60;
        if (nextMeteor <= 0) {
          spawnMeteor();
          nextMeteor = 7 + Math.random() * 9;
        }
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.life += dt;
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          const t = m.life / m.maxLife;
          if (t >= 1 || m.x > W + 60 || m.y > H + 60) {
            meteors.splice(i, 1);
            continue;
          }
          const fade = Math.sin(t * Math.PI);
          const grad = ctx.createLinearGradient(
            m.x, m.y, m.x - m.vx * 9, m.y - m.vy * 9,
          );
          grad.addColorStop(0, `rgba(213, 227, 255, ${0.85 * fade})`);
          grad.addColorStop(1, "rgba(120, 150, 255, 0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(m.x - m.vx * 9, m.y - m.vy * 9);
          ctx.stroke();
        }
      }
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
