"use client";

import { useEffect, useRef } from "react";
import { site } from "@/content/site";

/* Cloud of glassy skill/service bubbles around the hero photo.
   Each bubble bobs on its own (CSS) and drifts with the mouse by its depth (CSS vars set here). */
export default function HeroBubbles() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (window.matchMedia("(hover: none)").matches) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      x += (tx - x) * 0.06; y += (ty - y) * 0.06;
      el.style.setProperty("--mx", x.toFixed(3));
      el.style.setProperty("--my", y.toFixed(3));
    };
    window.addEventListener("pointermove", onMove);
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, []);

  return (
    <div className="hero-bubbles" ref={ref} aria-label="Skills and services">
      {site.bubbles.map((b, i) => (
        <span
          key={b.label}
          className={`bubble is-${b.kind}${b.m ? " has-m" : ""}`}
          style={{
            ["--x" as string]: `${b.x}%`, ["--y" as string]: `${b.y}%`, ["--depth" as string]: b.depth,
            ...(b.m ? { ["--xm" as string]: `${b.m[0]}%`, ["--ym" as string]: `${b.m[1]}%` } : {}),
            ["--bob" as string]: `${5 + (i % 4) * 1.3}s`, ["--delay" as string]: `${-(i * 0.9)}s`,
          }}
        >
          <span className="bubble-in" data-bubble>
            <span className="bubble-label">{b.label}</span>
            {b.note && <span className="bubble-note">{b.note}</span>}
          </span>
        </span>
      ))}
    </div>
  );
}
