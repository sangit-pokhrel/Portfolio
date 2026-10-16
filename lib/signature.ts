/*
 * A hand-drawn-style signature as ONE SVG path (viewBox 0 0 1000 600), so it can be
 * "written" with a stroke-dash animation: a big S, a run of cursive loops, then a
 * long slash and an underline swoosh. Deterministic, so server and client match.
 */

const r = (n: number) => Math.round(n * 10) / 10;

function loops(x0: number, y0: number, count: number) {
  // trochoid: the pen moves right while circling → handwriting-like loops
  const pts: string[] = [];
  const steps = count * 28;
  for (let i = 0; i <= steps; i++) {
    const t = (i / 28) * Math.PI * 2;
    const k = i / steps;
    const height = 70 + 45 * Math.sin(t * 0.45 + 0.6) - 25 * k; // letters vary in height
    const y = y0 - height * (1 - Math.cos(t)) * 0.5 + k * 30;
    // + sin → the pen curls back at the TOP of each stroke (like l / h loops); slanted forward
    const x = x0 + t * 19 + 24 * Math.sin(t) + (y0 - y) * 0.38;
    pts.push(`${r(x)} ${r(y)}`);
  }
  return { d: "L " + pts.join(" L "), end: pts[pts.length - 1].split(" ").map(Number) };
}

/** The signature as separate pen strokes, in writing order. */
export function signatureStrokes(): string[] {
  const s = "M 735 95 C 560 25 330 95 420 205 C 470 265 640 300 560 390 C 490 465 300 470 235 420";
  const l = loops(245, 418, 5);
  const [ex, ey] = l.end;
  const tail = `C ${r(ex + 60)} ${r(ey + 10)} ${r(ex + 120)} ${r(ey - 40)} ${r(ex + 150)} ${r(ey - 90)}`;
  const slash = "M 330 585 L 805 40";
  const swoosh = "M 150 500 C 380 410 690 360 960 330";
  return [`${s} ${l.d} ${tail}`, slash, swoosh];
}
