"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToTarget } from "@/lib/smooth";

/* Floating "back to top": appears once you've scrolled past the hero; the ring shows page progress. */
export default function BackToTop() {
  const [shown, setShown] = useState(false);
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let max = 1, raf = 0;
    const measure = () => { max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); };
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    measure();
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setShown(y > window.innerHeight * 0.9);
      if (ring.current) ring.current.style.strokeDashoffset = String(1 - Math.min(1, y / max));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { ro.disconnect(); window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <button
      className={`to-top${shown ? " is-shown" : ""}`}
      onClick={() => scrollToTarget("#top")}
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
    >
      <svg className="to-top-ring" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="46" pathLength={1} ref={ring} />
      </svg>
      <svg className="to-top-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
      <span className="to-top-label">Top</span>
    </button>
  );
}
