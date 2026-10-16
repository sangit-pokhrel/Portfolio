import Image from "next/image";

/** Text that flips over (like a rolling cube) on hover of its parent <a>/<button>. */
export function Roll({ children }: { children: React.ReactNode }) {
  return (
    <span className="roll">
      <span className="roll-a">{children}</span>
      <span className="roll-b" aria-hidden="true">{children}</span>
    </span>
  );
}

export function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* Seeded placeholder artwork, so the layout looks finished before real images exist.
   Deterministic, so server and client render identical markup. */
const PALETTE = ["#1e1531", "#b57bff", "#efe9f6", "#ff4fa3", "#b9adc9", "#352a4a", "#9d6bff"];

function rng(seed: string) {
  let s = 0;
  for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export function Art({ seed, accent }: { seed: string; accent?: string }) {
  const r = rng(seed);
  const bg = accent ? "#1a1326" : ["#1e1531", "#352a4a", "#efe9f6", "#1e1531"][Math.floor(r() * 4)];
  const shapes: React.ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    const col = accent && i % 2 === 0 ? accent : PALETTE[1 + Math.floor(r() * (PALETTE.length - 1))];
    const x = r2(r() * 100), y = r2(r() * 130), rad = r2(12 + r() * 38);
    const roll = r();
    const extra = r();
    if (col === bg) continue;
    shapes.push(
      roll > 0.4 ? (
        <circle key={i} cx={x} cy={y} r={rad} fill={col} opacity={r2(0.55 + extra * 0.45)} />
      ) : (
        <rect key={i} x={r2(x - rad)} y={r2(y - rad / 2)} width={r2(rad * 2)} height={rad} rx={r2(rad / 2)} fill={col}
          transform={`rotate(${r2(extra * 90 - 45)} ${x} ${y})`} />
      )
    );
  }
  return (
    <div className="img ph" style={{ ["--ph-bg" as string]: bg }}>
      <svg viewBox="0 0 100 130" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{shapes}</svg>
    </div>
  );
}

/** A real image when `src` is set, otherwise placeholder art. */
export function Media({ src, seed, alt = "", accent }: { src?: string; seed: string; alt?: string; accent?: string }) {
  if (!src) return <Art seed={seed} accent={accent} />;
  return (
    <div className="img">
      <Image src={src} alt={alt} fill sizes="(max-width: 767px) 80vw, 40vw" style={{ objectFit: "cover" }} />
    </div>
  );
}
