"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/smooth";

/* Lenis smooth scrolling + simple fade-up reveals, for pages other than the home page. */
export default function SmoothScroll() {
  useEffect(() => {
    document.body.classList.remove("is-loading");
    window.scrollTo(0, 0);
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
    setLenis(lenis);
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -10% 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    return () => { cancelAnimationFrame(raf); io.disconnect(); lenis.destroy(); setLenis(null); };
  }, []);
  return null;
}
