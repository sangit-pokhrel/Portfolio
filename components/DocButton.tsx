"use client";

export type DocKind = "resume" | "cv";

/** Opens the Résumé / CV popup (DocsModal listens for this event). */
export const openDocs = (which: DocKind) => window.dispatchEvent(new CustomEvent("docs:open", { detail: which }));

export default function DocButton({ which, className, children, label }: {
  which: DocKind; className?: string; children: React.ReactNode; label?: string;
}) {
  return (
    <button type="button" className={className} onClick={() => openDocs(which)} aria-haspopup="dialog" aria-label={label}>
      {children}
    </button>
  );
}
