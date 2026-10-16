import type Lenis from "lenis";

/** Shared handles between client components (the page is a single scene). */
let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { lenis = l; };
export const getLenis = () => lenis;

export function scrollToTarget(target: string) {
  const l = getLenis();
  const dest = target === "#top" || target === "#" ? 0 : target;
  if (l) l.scrollTo(dest, { duration: 1.6, force: true, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else if (typeof dest === "string") document.querySelector(dest)?.scrollIntoView({ behavior: "smooth" });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Hero canvas registers itself here; <Experience /> drives it. */
export const heroGL: { intro?: () => void; setProgress?: (p: number) => void; introRequested?: boolean } = {};
