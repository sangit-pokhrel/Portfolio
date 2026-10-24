"use client";

import { useEffect, useRef, useState } from "react";
import type { PreviewData } from "@/lib/projects";

/*
 * Hover a record → a small browser-window mock-up follows the cursor (up and to the right),
 * flipping through that project's screenshots with a one-line summary.
 * Hidden on touch devices (tapping a record opens its page instead).
 */
export default function ProjectPreview({ projects }: { projects: PreviewData[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [frame, setFrame] = useState(0);
  const size = useRef({ w: 336, h: 300 });

  // which record is hovered
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const over = (e: PointerEvent) => {
      const rec = (e.target as HTMLElement).closest<HTMLElement>("[data-preview]");
      setActive(rec ? Number(rec.dataset.preview) : null);
    };
    document.addEventListener("pointerover", over);
    return () => document.removeEventListener("pointerover", over);
  }, []);

  // follow the cursor with easing + a slight tilt from horizontal speed
  useEffect(() => {
    const el = ref.current!;
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf = 0;
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const dx = tx - x;
      x += dx * 0.14; y += (ty - y) * 0.14;
      const { w, h } = size.current; // measured when the card changes, not every frame
      // up-right of the cursor, flipped if it would leave the screen
      let left = x + 28, top = y - h - 18;
      if (left + w > innerWidth - 12) left = x - w - 28;
      if (top < 12) top = y + 28;
      el.style.transform = `translate3d(${left}px, ${top}px, 0) rotate(${Math.max(-8, Math.min(8, dx * 0.05))}deg)`;
    };
    window.addEventListener("pointermove", move);
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); };
  }, []);

  // measure the card once per project
  useEffect(() => {
    if (active === null) return;
    const el = ref.current!;
    size.current = { w: el.offsetWidth, h: el.offsetHeight };
  }, [active]);

  // flip through screenshots while hovering
  useEffect(() => {
    setFrame(0);
    if (active === null) return;
    const n = projects[active]?.images.length ?? 0;
    if (n < 2) return;
    const t = setInterval(() => setFrame((f) => (f + 1) % n), 1100);
    return () => clearInterval(t);
  }, [active, projects]);

  const p = active !== null ? projects[active] : null;
  return (
    <div className={`pp${p ? " is-on" : ""}`} ref={ref} aria-hidden="true">
      {p && (
        <div className="pp-card" style={{ ["--label" as string]: p.color }}>
          <div className="pp-browser">
            <div className="pp-bar">
              <i /><i /><i />
              <span className="pp-url">{p.host}</span>
            </div>
            <div className="pp-screen">
              {p.images.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" className={i === frame ? "is-on" : ""} />
              ))}
            </div>
          </div>
          <div className="pp-info">
            <div className="pp-head">
              <span className="pp-title">{p.title}</span>
              <span className="pp-year">{p.year}</span>
            </div>
            <p className="pp-sum">{p.summary}</p>
            <p className="pp-credit">{p.credit}</p>
            <div className="pp-tags">
              <span>{p.tags}</span>
              <b>{p.status}</b>
              {p.hasDemoLogin && <b className="is-demo-login">Demo account</b>}
              {p.hasCode && <b>Code</b>}
              {p.hasDemo && <b>Demo</b>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
