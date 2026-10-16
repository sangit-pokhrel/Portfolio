"use client";

import { useEffect, useRef, useState } from "react";
import { getLenis } from "@/lib/smooth";
import type { DocKind } from "./DocButton";

type Doc = { kind: DocKind; file: string; label: string; note: string; download: string; available: boolean };

/*
 * Cute "grab my Résumé / CV" popup. A little paper character bobs on top, two cards to pick
 * from; picking one downloads the PDF, the character cheers, and the popup closes itself.
 */
export default function DocsModal({ docs }: { docs: Doc[] }) {
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState<DocKind>("resume");
  const [done, setDone] = useState<DocKind | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      lastFocus.current = document.activeElement as HTMLElement;
      setFocus((e as CustomEvent<DocKind>).detail ?? "resume");
      setDone(null);
      setOpen(true);
    };
    window.addEventListener("docs:open", onOpen);
    return () => window.removeEventListener("docs:open", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    document.body.classList.add("docs-open");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    // move focus into the dialog
    requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>(".docs-card.is-focus, .docs-close")?.focus());
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("docs-open");
      getLenis()?.start();
      lastFocus.current?.focus?.();
    };
  }, [open]);

  // after a download, cheer then close
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setOpen(false), 2200);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <div className={`docs${open ? " is-open" : ""}${done ? " is-done" : ""}`} aria-hidden={!open}>
      <div className="docs-backdrop" onClick={() => setOpen(false)} />
      <div className="docs-dialog" role="dialog" aria-modal="true" aria-labelledby="docs-title" ref={dialogRef}>
        <button className="docs-close" onClick={() => setOpen(false)} aria-label="Close">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        {/* the little paper character */}
        <svg className="docs-buddy" viewBox="0 0 120 120" aria-hidden="true">
          <g className="docs-buddy-body">
            <path d="M30 14 h46 l18 18 v70 a6 6 0 0 1 -6 6 H30 a6 6 0 0 1 -6 -6 V20 a6 6 0 0 1 6 -6 z" className="docs-paper" />
            <path d="M76 14 v14 a4 4 0 0 0 4 4 h14" className="docs-fold" />
            <path d="M38 78 h40 M38 88 h28" className="docs-lines" />
            <g className="docs-eyes"><circle cx="48" cy="52" r="4.2" /><circle cx="70" cy="52" r="4.2" /></g>
            <ellipse cx="40" cy="62" rx="5" ry="3" className="docs-cheek" />
            <ellipse cx="78" cy="62" rx="5" ry="3" className="docs-cheek" />
            <path d="M52 62 q7 7 14 0" className="docs-smile" />
            <path d="M50 60 q9 14 18 0 z" className="docs-grin" />
          </g>
          <g className="docs-sparkles">
            <path d="M14 30 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
            <path d="M104 18 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
            <path d="M106 76 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" />
          </g>
        </svg>

        <h2 className="docs-title" id="docs-title">{done ? "On its way!" : "Grab a copy"}</h2>
        <p className="docs-sub">
          {done ? "Thanks for your interest. Talk soon!" : "Pick the one you need: the quick read or the full story."}
        </p>

        <div className={`docs-options${docs.filter((d) => d.available).length === 1 ? " is-single" : ""}`}>
          {docs.filter((d) => d.available).map((d) => (
            <a
              key={d.kind}
              className={`docs-card${focus === d.kind ? " is-focus" : ""}${done === d.kind ? " is-picked" : ""}`}
              href={d.file}
              download={d.download}
              onClick={() => setDone(d.kind)}
              onMouseEnter={() => setFocus(d.kind)}
            >
              <span className="docs-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
              </span>
              <span className="docs-card-label">{d.label}</span>
              <span className="docs-card-note">{d.note}</span>
              <span className="docs-card-cta">{done === d.kind ? "Downloading ✓" : "Download PDF"}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
