"use client";

import { useEffect, useRef } from "react";
import { cutoutPortrait } from "@/lib/portrait";

/* Flat hero portrait: your photo, background removed, standing at the bottom of the hero. */
type Props = { src: string; alt: string; removeBackground: boolean; wrapClass?: string; innerClass?: string };

export default function PortraitImage({ src, alt, removeBackground, wrapClass = "hero-portrait-move", innerClass = "hero-portrait" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = ref.current!;
    let cancelled = false;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (cancelled) return;
      const canvas = cutoutPortrait(img, removeBackground);
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", alt);
      wrap.replaceChildren(canvas);
      wrap.dataset.ready = "1";
    };
    return () => { cancelled = true; };
  }, [src, alt, removeBackground]);

  return (
    <div className={wrapClass}>
      <div className={innerClass} ref={ref} />
    </div>
  );
}
