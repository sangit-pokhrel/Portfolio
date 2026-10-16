"use client";

import { createElement, useLayoutEffect, useRef, useState } from "react";

type Props = {
  children: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  /** Bar wipes towards the left instead of the right. */
  dir?: "left" | "right";
};

/**
 * Highlight-reveal text: split into rendered lines, each with a colour bar
 * that wipes in, reveals the text, and wipes out. Playback lives in
 * lib/highlight.ts and is triggered on scroll by <Experience />.
 */
export default function HL({ children, as = "div", className, dir = "right" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const words = children.trim().split(/\s+/);

  // 1. Render words, 2. measure which line each wraps onto, 3. render lines.
  useLayoutEffect(() => {
    if (lines !== null) return;
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const out: string[][] = [];
      let top: number | null = null;
      el.querySelectorAll<HTMLElement>(".hl-w").forEach((w) => {
        if (w.offsetTop !== top) { out.push([]); top = w.offsetTop; }
        out[out.length - 1].push(w.textContent ?? "");
      });
      setLines(out.map((l) => l.join(" ")));
    };
    document.fonts.ready.then(measure);
  }, [lines]);

  // Re-split when the width changes.
  useLayoutEffect(() => {
    let w = window.innerWidth;
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        if (window.innerWidth === w) return;
        w = window.innerWidth;
        setLines(null);
      }, 200);
    };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); clearTimeout(t); };
  }, []);

  const content = lines
    ? lines.map((l, i) => (
        <span className="hl-wrap" key={i}>
          <span className="hl-line">
            <span className="hl-text">{l}</span>
            <span className="hl-bar" />
          </span>
        </span>
      ))
    : words.map((w, i) => (
        <span key={i}>
          <span className="hl-w" style={{ display: "inline-block" }}>{w}</span>{i < words.length - 1 ? " " : ""}
        </span>
      ));

  return createElement(as, { ref, className, "data-hl": dir }, content);
}
