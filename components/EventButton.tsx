"use client";

/** A button that fires a window event (e.g. "story:play", "docs:open"), so server-rendered cards can trigger client widgets. */
export default function EventButton({ event, detail, className, label, children, style }: {
  event: string; detail?: string; className?: string; label?: string; children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <button type="button" className={className} aria-label={label} style={style}
      onClick={() => window.dispatchEvent(new CustomEvent(event, { detail }))}>
      {children}
    </button>
  );
}
