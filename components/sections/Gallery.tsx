import { site } from "@/content/site";
import { captionFromFile, listImages } from "@/lib/images";
import HL from "../HL";
import { Media } from "../ui";
import { signatureStrokes } from "@/lib/signature";

type Item =
  | { type: "img"; src?: string; caption: string }
  | { type: "quote"; text: string; src?: string }
  | { type: "pill" };
type Col = { cls: string; items: Item[] };

/* Columns follow the reference's rhythm: pair, big quote, image + badge,
   pair (lowered), single, quote … repeated until the photos run out. */
function buildColumns(images: string[]): Col[] {
  const pool = images.length ? [...images] : Array.from({ length: 9 }, () => "");
  const quotes = [...site.galleryQuotes];
  let badge = true;
  const img = (): Item | null => {
    if (!pool.length) return null;
    const src = pool.shift()!;
    return { type: "img", src: src || undefined, caption: src ? captionFromFile(src) : "Your photo here" };
  };
  const cols: Col[] = [];
  const pattern = ["pair", "bigquote", "badge", "pair-low", "single", "quote"] as const;
  for (let i = 0; pool.length && i < 60; i++) {
    const kind = pattern[i % pattern.length];
    const items: Item[] = [];
    let cls = "h-col";
    if (kind === "pair" || kind === "pair-low") {
      [img(), img()].forEach((x) => x && items.push(x));
      if (kind === "pair-low") cls += " is-low";
    } else if (kind === "bigquote") {
      if (!quotes.length) continue;
      const next = img();
      items.push({ type: "quote", text: quotes.shift()!, src: next?.type === "img" ? next.src : undefined });
      cls += " is-large";
    } else if (kind === "badge") {
      const x = img();
      if (x) items.push(x);
      if (badge) { items.push({ type: "pill" }); badge = false; cls += " is-tight"; }
    } else if (kind === "single") {
      const x = img();
      if (x) items.push(x);
    } else if (kind === "quote") {
      if (!quotes.length) continue;
      items.push({ type: "quote", text: quotes.shift()! });
    }
    if (items.length) cols.push({ cls, items });
  }
  return cols;
}

export default function Gallery() {
  const cols = buildColumns(listImages("gallery"));
  return (
    <section className="s hscroll" id="journey" data-theme-nav="light">
      <div className="hscroll-pin">
        <div className="hscroll-track" data-htrack>
          {cols.map((col, ci) => (
            <div className={col.cls} key={ci}>
              {col.items.map((it, ii) => {
                if (it.type === "pill")
                  return (
                    <div className="h-pill" key={ii}>
                      <span className="h-pill-num">{site.galleryBadge.text}</span>
                      <span className="btn-text">{site.galleryBadge.label}</span>
                    </div>
                  );
                if (it.type === "quote")
                  return (
                    <div className="h-item" key={ii}>
                      <HL className="h-quote">{it.text}</HL>
                      <svg className="h-sig" viewBox="0 0 1000 600" aria-hidden="true">{signatureStrokes().map((d, k) => <path d={d} key={k} />)}</svg>
                      {col.cls.includes("is-large") && <div className="h-media"><Media src={it.src} seed={`q${ci}`} /></div>}
                    </div>
                  );
                return (
                  <div className="h-item" key={ii}>
                    <div className="text-eyebrow">{it.caption}</div>
                    <div className="h-media"><Media src={it.src} seed={`g${ci}${ii}`} alt={it.caption} /></div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
