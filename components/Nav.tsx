"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { site } from "@/content/site";
import { getLenis, scrollToTarget } from "@/lib/smooth";
import { Art, Roll } from "./ui";
import Logo from "./Logo";

const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#work", label: "Work" },
  { href: "#journey", label: "Journey" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const prev = useRef(false);

  useEffect(() => {
    if (prev.current === open) return;
    prev.current = open;
    const menu = menuRef.current!;
    const q = gsap.utils.selector(menu);
    document.body.classList.toggle("menu-open", open);
    const tl = open
      ? gsap.timeline({ onStart: () => getLenis()?.stop() })
          .set(menu, { visibility: "visible" })
          .fromTo(menu, { clipPath: "ellipse(0% 0% at 50% 0%)" }, { clipPath: "ellipse(120% 100% at 50% 20%)", duration: 1.1, ease: "expo.inOut" })
          .fromTo(q(".menu-link .roll"), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.06, ease: "expo.out" }, "-=0.5")
          .fromTo(q(".menu-images"), { clipPath: "inset(100% 0% 0% 0% round 3rem)" }, { clipPath: "inset(0% 0% 0% 0% round 3rem)", duration: 1, ease: "expo.out" }, "<")
          .fromTo(q(".menu-side > *"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.8 }, "<0.2")
      : gsap.timeline({ onComplete: () => { gsap.set(menu, { visibility: "hidden" }); getLenis()?.start(); } })
          .to(q(".menu-link .roll"), { yPercent: -110, duration: 0.5, stagger: 0.03, ease: "expo.in" })
          .to(menu, { clipPath: "ellipse(120% 0% at 50% 0%)", duration: 0.9, ease: "expo.inOut" }, "-=0.3");
    return () => { tl.kill(); };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    // on a project page the sections live on the home page
    const onHome = window.location.pathname === "/";
    if (!onHome && (href === "#top" ? e.currentTarget.classList.contains("nav-brand") : !document.querySelector(href))) {
      window.location.href = href === "#top" ? "/" : `/${href}`;
      return;
    }
    scrollToTarget(href);
  };

  return (
    <>
      <header className="nav" data-nav>
        <div className="nav-inner">
          <a href="#top" className="nav-brand" aria-label={`${site.firstName} ${site.logo.aka} ${site.logo.bottom} — home`} onClick={(e) => go(e, "#top")}>
            <Logo />
          </a>
          <div className="nav-btns">
            <a className="btn-w is-nav" href={site.resumeUrl}>
              <svg className="btn-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l4 4v14H7z M14 3v4h4 M10 12h5 M10 16h5" /></svg>
              <span className="btn-text"><Roll>Résumé</Roll></span>
            </a>
            <button className="nav-burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className="menu" ref={menuRef} aria-hidden={!open}>
        <div className="menu-bg" />
        <div className="menu-grid">
          <div className="menu-images">
            {LINKS.map((_, i) => (
              <div key={i} className={`menu-img${i === active ? " is-active" : ""}`}><Art seed={`menu${i}`} /></div>
            ))}
          </div>
          <nav className="menu-links">
            {LINKS.map((l, i) => (
              <a key={l.href} href={l.href} className="menu-link" onMouseEnter={() => setActive(i)} onClick={(e) => go(e, l.href)}>
                <Roll>{l.label}</Roll>
              </a>
            ))}
          </nav>
          <div className="menu-side">
            <div className="text-eyebrow c-accent">{site.since}</div>
            <div className="menu-socials">
              {site.socials.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"><span className="btn-text"><Roll>{s.name}</Roll></span></a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
