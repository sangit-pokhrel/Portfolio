import gsap from "gsap";

/** Bar wipes in, text appears, bar wipes out — line by line. */
export function playHL(el: HTMLElement, delay = 0) {
  if (el.dataset.hlDone) return;
  const fromLeft = el.dataset.hl === "left";
  const tl = gsap.timeline({ delay, onComplete: () => { el.dataset.hlDone = "1"; } });
  el.querySelectorAll<HTMLElement>(".hl-line").forEach((line, i) => {
    const bar = line.querySelector(".hl-bar");
    const txt = line.querySelector(".hl-text");
    const t = i * 0.08;
    tl.set(bar, { transformOrigin: fromLeft ? "right center" : "left center" }, t)
      .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "expo.inOut" }, t)
      .set(txt, { opacity: 1 }, t + 0.45)
      .set(bar, { transformOrigin: fromLeft ? "left center" : "right center" }, t + 0.45)
      .to(bar, { scaleX: 0, duration: 0.5, ease: "expo.inOut" }, t + 0.45);
  });
  return tl;
}
