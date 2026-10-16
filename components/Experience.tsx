"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { heroGL, scrollToTarget, setLenis } from "@/lib/smooth";
import { playHL } from "@/lib/highlight";

gsap.registerPlugin(ScrollTrigger);

/**
 * Owns smooth scrolling, the loader/intro, and every scroll-driven scene.
 * Renders nothing; works on the markup the section components rendered.
 */
export default function Experience() {
  useEffect(() => {
    const $ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => el.querySelector<T>(s)!;
    const $$ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => [...el.querySelectorAll<T>(s)];
    const cleanups: (() => void)[] = [];
    let cancelled = false;

    /* ---- Smooth scroll ---- */
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();

    // In-page anchors go through Lenis (menu links handle themselves in <Nav />)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || a.closest(".menu") || a.classList.contains("nav-brand")) return;
      const href = a.getAttribute("href")!;
      if (href !== "#" && !document.querySelector(href === "#top" ? "main" : href)) return;
      e.preventDefault();
      scrollToTarget(href);
    };
    document.addEventListener("click", onClick);
    cleanups.push(() => document.removeEventListener("click", onClick));

    const ctx = gsap.context(() => {});

    /* ---- Giant type fitted to its container ---- */
    function fit(el: HTMLElement, ratio: number, capVw: number) {
      el.style.fontSize = "";
      const w = el.getBoundingClientRect().width;
      const target = el.parentElement!.clientWidth * ratio;
      const cur = parseFloat(getComputedStyle(el).fontSize);
      el.style.fontSize = Math.min(cur * (target / w), capVw * window.innerWidth) + "px";
    }
    function fitAll() {
      const first = $(".hero-name-line:first-child");
      fit(first, 0.94, 0.26);
      const firstPx = parseFloat(first.style.fontSize);
      const second = $(".hero-name-line.is-outline");
      second.style.fontSize = firstPx * 0.62 + "px";
      fit(second, 0.9, (firstPx * 0.62) / window.innerWidth);
      // let the water layer re-draw the name at its new size
      const hero = document.querySelector<HTMLElement>(".hero");
      if (hero) hero.dataset.fitted = "1";
      window.dispatchEvent(new Event("hero:layout"));
    }

    /* ---- Loader + intro ---- */
    const count = { v: 0 };
    const countEl = $("[data-loader-count]");
    const showCount = () => (countEl.textContent = String(Math.round(count.v)));
    ctx.add(() => {
      gsap.set(".hero-name-line > span", { yPercent: 105 });
      if (document.querySelector(".hero-portrait")) gsap.set(".hero-portrait", { yPercent: 12, opacity: 0 });
      gsap.to(count, { v: 90, duration: 1.6, ease: "power2.out", onUpdate: showCount });
    });

    const ready = Promise.all([
      document.fonts.ready,
      new Promise<void>((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", () => r(), { once: true }))),
    ]);

    ready.then(() => {
      if (cancelled) return;
      ctx.add(() => {
        fitAll();
        buildScroll();
        gsap.timeline()
          .to(count, { v: 100, duration: 0.5, ease: "power2.out", onUpdate: showCount }, "+=0.3")
          .to(".loader-inner", { yPercent: -40, opacity: 0, duration: 0.8, ease: "expo.in" })
          .to("[data-loader]", { clipPath: "ellipse(150% 0% at 50% 0%)", duration: 1.2, ease: "expo.inOut" }, "-=0.35")
          .add(() => { heroGL.introRequested = true; heroGL.intro?.(); }, "-=0.6")
          .to(".hero-name-line > span", { yPercent: 0, duration: 1.4, stagger: 0.12, ease: "expo.out" }, "-=0.6")
          .add(() => {
            if (document.querySelector(".hero-portrait")) gsap.to(".hero-portrait", { yPercent: 0, opacity: 1, duration: 1.6, ease: "expo.out" });
          }, "<0.15")
          .to("[data-hero-fade]", { opacity: 1, duration: 1, stagger: 0.1 }, "-=1")
          .add(() => {
            gsap.set("[data-loader]", { display: "none" });
            document.body.classList.remove("is-loading");
            lenis.start();
            ScrollTrigger.refresh();
            // arriving from another page with a section link (e.g. /#work)
            const hash = window.location.hash;
            if (hash.length > 1 && document.querySelector(hash)) setTimeout(() => scrollToTarget(hash), 200);
          });
      });
    });

    /** Write a signature: strokes drawn one after another, each timed by its length. */
    function drawStrokes(paths: SVGPathElement[], tl: gsap.core.Timeline, at: number, total: number) {
      const lens = paths.map((p) => p.getTotalLength());
      const sum = lens.reduce((a, b) => a + b, 0) || 1;
      let t = at;
      paths.forEach((p, i) => {
        // gap longer than the stroke + offset past it, so the round pen tip doesn't show as a dot before drawing
        gsap.set(p, { strokeDasharray: `${lens[i]} ${lens[i] + 40}`, strokeDashoffset: lens[i] + 20 });
        const d = (lens[i] / sum) * total;
        tl.to(p, { strokeDashoffset: 0, ease: "none", duration: d }, t);
        t += d;
      });
    }

    /* ---- Scroll scenes ---- */
    function buildScroll() {
      // Hero: GL object lifts & shrinks, name parallaxes away
      ScrollTrigger.create({
        trigger: ".hero-track", start: "top top", end: "bottom top", scrub: true,
        onUpdate: (st) => heroGL.setProgress?.(st.progress),
      });
      if (document.querySelector(".hero-portrait-move")) gsap.to(".hero-portrait-move", { yPercent: -14, scale: 0.62, ease: "none", scrollTrigger: { trigger: ".hero-track", start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-name", { yPercent: 12, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero-track", start: "top top", end: "bottom top", scrub: true } });

      // Signature section: photo shrinks into a card, then the signature writes itself
      const strokes = $$<SVGPathElement>("[data-sig-path]");
      if (strokes.length) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-sig]", start: "top 70%", end: "bottom bottom", scrub: 1.2 } })
          .fromTo("[data-sig-card]", { scale: 1.9, yPercent: 25 }, { scale: 1, yPercent: 0, ease: "power2.out", duration: 1 })
          .fromTo(".sig-rows", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.35);
        drawStrokes(strokes, tl, 0.85, 1.6);
      }

      // Legacy headline: words rise into place
      gsap.set(".lw > span", { yPercent: 110 });
      ScrollTrigger.create({
        trigger: "[data-words]", start: "top 80%", once: true,
        onEnter: () => gsap.to(".lw > span", { yPercent: 0, duration: 1.1, stagger: 0.045, ease: "expo.out" }),
      });

      // Horizontal gallery: sticky section sized to viewport + track overflow (like the reference)
      const track = $("[data-htrack]");
      const hSection = $(".hscroll");
      const dist = () => track.scrollWidth - window.innerWidth;
      const sizeH = () => { hSection.style.height = window.innerHeight + dist() + "px"; };
      sizeH();
      ScrollTrigger.addEventListener("refreshInit", sizeH);
      cleanups.push(() => ScrollTrigger.removeEventListener("refreshInit", sizeH));

      const hItems = [
        ...$$(".h-media", track).map((el) => ({ el, at: 0.95, done: false, play: () => gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0% round .5rem)" }, { clipPath: "inset(0% 0% 0% 0% round .5rem)", duration: 1.2, ease: "expo.out" }) })),
        ...$$("[data-hl]", track).map((el) => ({ el, at: 0.85, done: false, play: () => playHL(el) })),
        ...$$(".h-sig", track).map((svg) => {
          const tl = gsap.timeline({ paused: true, delay: 0.4 });
          drawStrokes($$<SVGPathElement>("path", svg), tl, 0, 1.4);
          return { el: svg, at: 0.85, done: false, play: () => tl.play() };
        }),
        ...$$(".h-pill", track).map((el) => ({ el, at: 0.85, done: false, play: () => gsap.fromTo(el, { scale: 0, rotate: -30 }, { scale: 1, rotate: 0, duration: 1, ease: "back.out(2)" }) })),
      ];
      gsap.set($$(".h-media", track), { clipPath: "inset(100% 0% 0% 0% round .5rem)" });
      gsap.set($$(".h-pill", track), { scale: 0 });
      const hImgs = $$(".h-media > .img", track).map((img) => ({ img, center: 0 }));
      const hLeft = new Map<Element, number>();
      // positions inside the track are measured once per refresh, so scrolling never forces a layout read
      const measureH = () => {
        const t = track.getBoundingClientRect().left;
        hItems.forEach((it) => hLeft.set(it.el, it.el.getBoundingClientRect().left - t));
        hImgs.forEach((h) => { const r = h.img.parentElement!.getBoundingClientRect(); h.center = r.left - t + r.width / 2; });
      };
      measureH();
      ScrollTrigger.addEventListener("refresh", measureH);
      cleanups.push(() => ScrollTrigger.removeEventListener("refresh", measureH));
      const hUpdate = () => {
        const vw = window.innerWidth;
        const x = gsap.getProperty(track, "x") as number;
        hItems.forEach((it) => {
          if (!it.done && (hLeft.get(it.el) ?? 0) + x < vw * it.at) { it.done = true; it.play(); }
        });
        hImgs.forEach((h) => gsap.set(h.img, { xPercent: ((h.center + x) / vw - 0.5) * -10 }));
      };
      gsap.to(track, {
        x: () => -dist(), ease: "none", onUpdate: hUpdate,
        scrollTrigger: { trigger: hSection, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true, onEnter: hUpdate },
      });

      // Purple → white: the whole background dissolves while the runway scrolls by
      // (every pixel changes together, so there are no gradient bands or seams)
      // (routed through a soft violet so the midpoint never looks grey)
      let morphP = 0;
      let navHook = () => {}; // set once the nav-theme function exists below
      gsap.timeline({ scrollTrigger: { trigger: ".dark-end", start: "top 95%", end: "bottom bottom", scrub: 0.6, onUpdate: (st) => { morphP = st.progress; navHook(); } } })
        .fromTo(".dark-group", { backgroundColor: "rgba(30, 21, 49, 1)" }, {
          keyframes: [
            { backgroundColor: "rgba(92, 64, 150, 1)", ease: "power1.in" },
            { backgroundColor: "rgba(201, 178, 240, 0.85)", ease: "none" },
            { backgroundColor: "rgba(246, 243, 250, 0)", ease: "power1.out" },
          ],
        }, 0)
        .fromTo(".dark-group-bg", { opacity: 1 }, { opacity: 0, ease: "power1.in" }, 0);

      // Highlight reveals (gallery ones are handled above)
      $$("[data-hl]").forEach((el) => {
        if (el.closest(".hscroll")) return;
        ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => playHL(el) });
      });

      // Split: orb rises, grows, finally covers the screen into the dark section
      gsap.timeline({ scrollTrigger: { trigger: ".split-track", start: "top top", end: "bottom bottom", scrub: 1 } })
        .to(".split-orb", { y: 0, scale: 1, rotate: -4, ease: "power2.out", duration: 1 })
        .to(".split-orb", { rotate: 0, duration: 0.4 })
        .to("[data-split-left]", { xPercent: -15, opacity: 0, duration: 0.8 }, "+=0.2")
        .to("[data-split-right]", { xPercent: 15, opacity: 0, duration: 0.8 }, "<")
        .to(".split-orb", { width: "100vw", height: "100vh", borderRadius: 0, backgroundColor: "#ece4f8", duration: 1, ease: "power2.inOut" }, "<")
        .to(".split-orb .img", { opacity: 0, duration: 0.6 }, "<");

      // Projects stagger in
      gsap.set(".record", { y: 80, opacity: 0, rotate: 2 });
      ScrollTrigger.batch(".record", {
        start: "top 90%", once: true,
        onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, rotate: 0, duration: 1.2, stagger: 0.08, ease: "expo.out", overwrite: true }),
      });

      // Featured parallax + sticker spin
      $$("[data-speed]").forEach((el) => {
        gsap.to(el, { yPercent: -100 * parseFloat(el.dataset.speed!), ease: "none", scrollTrigger: { trigger: ".featured", start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.fromTo("[data-sticker]", { rotate: -40, scale: 0.6 }, { rotate: 25, scale: 1, ease: "none", scrollTrigger: { trigger: ".featured", start: "top bottom", end: "bottom top", scrub: true } });

      // Social cards fan out
      const cards = $$(".s-card");
      const mid = (cards.length - 1) / 2;
      const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize);
      const spread = () => (window.innerWidth < 768 ? 4.5 : 11) * rem();
      gsap.timeline({ scrollTrigger: { trigger: "[data-cards]", start: "top 85%", end: "center 45%", scrub: 1, invalidateOnRefresh: true } })
        .fromTo(cards, { x: 0, y: 120, rotate: 0 }, {
          x: (i) => (i - mid) * spread(),
          y: (i) => Math.pow(Math.abs(i - mid), 2) * 14,
          rotate: (i) => (i - mid) * 7,
          ease: "none",
        });
      // 3D tilt of the hovered card, following the pointer
      cards.forEach((card) => {
        const inner = card.querySelector<HTMLElement>(".s-card-in");
        if (!inner) return;
        const onMove = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          inner.style.setProperty("--tx", `${((e.clientX - r.left) / r.width - 0.5) * 16}deg`);
          inner.style.setProperty("--ty", `${-((e.clientY - r.top) / r.height - 0.5) * 12}deg`);
        };
        const onLeave = () => { inner.style.setProperty("--tx", "0deg"); inner.style.setProperty("--ty", "0deg"); };
        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        cleanups.push(() => { card.removeEventListener("pointermove", onMove); card.removeEventListener("pointerleave", onLeave); });
      });
      gsap.fromTo("[data-oval]", { width: "1rem" }, { width: () => (window.innerWidth < 768 ? "5rem" : "9rem"), ease: "none", scrollTrigger: { trigger: ".socials", start: "top 80%", end: "top 30%", scrub: true } });

      // Footer reveal
      // Footer: panel opens up, portrait rises, signature writes itself
      gsap.to("[data-footer]", { clipPath: "inset(0% 0% 0% 0% round 2rem)", ease: "none", scrollTrigger: { trigger: ".footer", start: "top bottom", end: "top 10%", scrub: true } });
      gsap.fromTo(".footer-tab", { yPercent: 110 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".footer", start: "top 40%", end: "top 10%", scrub: true } });
      gsap.fromTo(".footer-portrait-in", { yPercent: 35 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".footer", start: "top 70%", end: "bottom bottom", scrub: true } });
      const footSig = gsap.timeline({ paused: true });
      drawStrokes($$<SVGPathElement>("[data-footer-sig] path"), footSig, 0, 1.6);
      ScrollTrigger.create({ trigger: ".footer-head", start: "top 70%", once: true, onEnter: () => footSig.play() });

      // Nav colour follows the section beneath it
      const themed = $$("[data-theme-nav]");
      const nav = $("[data-nav]");
      // section positions are cached on refresh; scrolling only compares numbers
      let zones: { top: number; bottom: number; theme: string; inDark: boolean }[] = [];
      const measureZones = () => {
        zones = themed.map((el) => {
          const r = el.getBoundingClientRect();
          return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY, theme: el.dataset.themeNav!, inDark: !!el.closest(".dark-group") };
        });
      };
      const navTheme = () => {
        const y = window.scrollY + 40;
        let theme = "dark";
        for (const z of zones) if (z.top <= y && z.bottom > y) theme = z.inDark && morphP > 0.45 ? "dark" : z.theme;
        nav.classList.toggle("is-light", theme === "light");
      };
      measureZones();
      navHook = navTheme;
      const onZones = () => { measureZones(); navTheme(); };
      ScrollTrigger.addEventListener("refresh", onZones);
      cleanups.push(() => ScrollTrigger.removeEventListener("refresh", onZones));
      lenis.on("scroll", navTheme);
      navTheme();

      // Marquees: constant drift, boosted & flipped by scroll velocity
      $$("[data-marquee]").forEach((m) => {
        const list = $("[data-marquee-list]", m);
        const clone = list.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        m.appendChild(clone);
        cleanups.push(() => clone.remove());
        const lists = [list, clone];
        const side = m.dataset.dir === "-1" ? -1 : 1;
        const BASE = 38; // px per second when idle
        const BOOST = 4; // extra px/s per unit of scroll velocity
        let width = list.offsetWidth;
        const onWidth = () => { width = list.offsetWidth; };
        ScrollTrigger.addEventListener("refresh", onWidth);
        cleanups.push(() => ScrollTrigger.removeEventListener("refresh", onWidth));
        let x = 0, dir = 1, boost = 0, onScreen = false;
        const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), { rootMargin: "100px" });
        io.observe(m);
        cleanups.push(() => io.disconnect());
        const tick = (_t: number, dt: number) => {
          if (!onScreen) return;
          const v = lenis.velocity || 0;
          if (Math.abs(v) > 0.5) dir = v > 0 ? 1 : -1;
          boost += (Math.min(Math.abs(v), 60) * BOOST - boost) * 0.1; // eased so it never jerks
          x -= (BASE + boost) * dir * side * (dt / 1000);
          if (width) x = ((x % width) - width) % width;
          gsap.set(lists, { x });
        };
        gsap.ticker.add(tick);
        cleanups.push(() => gsap.ticker.remove(tick));
      });

      // Refit giant type on width change
      let w = window.innerWidth;
      let t: ReturnType<typeof setTimeout>;
      const onResize = () => {
        clearTimeout(t);
        t = setTimeout(() => {
          if (window.innerWidth === w) return;
          w = window.innerWidth;
          fitAll();
          ScrollTrigger.refresh();
        }, 300);
      };
      window.addEventListener("resize", onResize);
      cleanups.push(() => { window.removeEventListener("resize", onResize); clearTimeout(t); });
    }

    return () => {
      cancelled = true;
      ctx.revert();
      cleanups.forEach((fn) => fn());
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
