"use client";

import { useEffect, useRef } from "react";

/* Topographic contour lines behind the hero (the reference's background).
   Smooth value-noise field → marching squares → thin strokes on a canvas. */

function makeNoise(seed: number) {
  const perm = new Uint8Array(512);
  const p = Array.from({ length: 256 }, (_, i) => i);
  let s = seed;
  for (let i = 255; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const val = (x: number, y: number) => perm[perm[x & 255] + (y & 255)] / 255;
  return (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = fade(x - xi), yf = fade(y - yi);
    const a = val(xi, yi), b = val(xi + 1, yi), c = val(xi, yi + 1), d = val(xi + 1, yi + 1);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };
}

type Props = { seed?: number; animated?: boolean; className?: string };

export default function Contours({ seed = 7, animated = true, className = "hero-contours" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const g = cv.getContext("2d")!;
    const noise = makeNoise(seed);

    let W = 0, H = 0, time = 0;
    const size = () => {
      // animated canvases redraw every frame, so keep them at 1x for speed
      const dpr = animated ? 1 : Math.min(window.devicePixelRatio, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.strokeStyle = getComputedStyle(cv).color; // read once here, not every frame
    };
    const draw = () => {
      g.clearRect(0, 0, W, H);

      const cell = 14;
      const cols = Math.ceil(W / cell) + 1, rows = Math.ceil(H / cell) + 1;
      const f = new Float32Array(cols * rows);
      const sc = 1 / 520; // feature size in px
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          // two layers drifting in different directions → contours slowly morph
          const px = x * cell * sc, py = y * cell * sc;
          f[y * cols + x] = noise(px + time * 0.6, py + time * 0.25) * 0.7 + noise(px * 2.1 + 9 - time * 0.8, py * 2.1 + 3 + time * 0.4) * 0.3;
        }

      g.lineWidth = 1.1;
      g.lineCap = "round";
      g.beginPath();
      const levels = 10;
      for (let l = 1; l < levels; l++) {
        const iso = l / levels;
        for (let y = 0; y < rows - 1; y++)
          for (let x = 0; x < cols - 1; x++) {
            const a = f[y * cols + x], b = f[y * cols + x + 1], c = f[(y + 1) * cols + x + 1], d = f[(y + 1) * cols + x];
            const idx = (a > iso ? 8 : 0) | (b > iso ? 4 : 0) | (c > iso ? 2 : 0) | (d > iso ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const X = x * cell, Y = y * cell;
            const lerp = (v1: number, v2: number) => (iso - v1) / (v2 - v1);
            const top: [number, number] = [X + lerp(a, b) * cell, Y];
            const right: [number, number] = [X + cell, Y + lerp(b, c) * cell];
            const bottom: [number, number] = [X + lerp(d, c) * cell, Y + cell];
            const left: [number, number] = [X, Y + lerp(a, d) * cell];
            const seg = (p: [number, number], q: [number, number]) => { g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); };
            switch (idx) {
              case 1: case 14: seg(left, bottom); break;
              case 2: case 13: seg(bottom, right); break;
              case 3: case 12: seg(left, right); break;
              case 4: case 11: seg(top, right); break;
              case 5: seg(left, top); seg(bottom, right); break;
              case 6: case 9: seg(top, bottom); break;
              case 7: case 8: seg(left, top); break;
              case 10: seg(left, bottom); seg(top, right); break;
            }
          }
      }
      g.stroke();
    };

    size();
    draw();
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(t); t = setTimeout(() => { size(); draw(); }, 150); };
    window.addEventListener("resize", onResize);

    // continuous animation (~30fps), paused only while off screen
    let raf = 0, last = 0, visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(cv);
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || now - last < 33) return;
      time += (now - (last || now)) / 1000 * 0.16;
      last = now;
      draw();
    };
    if (animated) raf = requestAnimationFrame(loop); // always live

    // subtle parallax against the cursor
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * -14;
      const y = (e.clientY / window.innerHeight - 0.5) * -10;
      cv.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.03)`;
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [seed, animated]);

  return <canvas className={className} ref={ref} aria-hidden="true" />;
}
