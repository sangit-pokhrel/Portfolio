/*
 * Turns one ordinary photo into the data the 3D portrait needs:
 *  - a soft cut-out mask (flood-filled from the edges if the background is plain/white)
 *  - a depth map (rounded silhouette + a bump where the face is)
 *  - the subject's bounding box, so the photo is cropped to the person
 * Runs once in the browser on a small working canvas.
 */

export type PortraitData = {
  size: [number, number];
  /** RGBA: R = mask, G = depth */
  pixels: Uint8Array;
  /** subject bounds in image UV (0–1, origin bottom-left) */
  bounds: { x0: number; y0: number; x1: number; y1: number };
  /** mask lookup in image UV, for hover hit-testing */
  maskAt: (u: number, v: number) => number;
};

type Opts = { removeBackground: boolean; face: { x: number; y: number; radius: number } };

function boxBlur(src: Float32Array, w: number, h: number, r: number, passes = 2) {
  let a = src.slice();
  let b = new Float32Array(a.length);
  r = Math.max(1, Math.round(r));
  for (let p = 0; p < passes; p++) {
    for (let y = 0; y < h; y++) {
      let acc = 0;
      for (let x = -r; x <= r; x++) acc += a[y * w + Math.min(w - 1, Math.max(0, x))];
      for (let x = 0; x < w; x++) {
        b[y * w + x] = acc / (2 * r + 1);
        acc += a[y * w + Math.min(w - 1, x + r + 1)] - a[y * w + Math.max(0, x - r)];
      }
    }
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let y = -r; y <= r; y++) acc += b[Math.min(h - 1, Math.max(0, y)) * w + x];
      for (let y = 0; y < h; y++) {
        a[y * w + x] = acc / (2 * r + 1);
        acc += b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x];
      }
    }
  }
  b = a;
  return b;
}

export function analysePortrait(img: HTMLImageElement, opts: Opts): PortraitData {
  const long = 320;
  const k = long / Math.max(img.naturalWidth, img.naturalHeight);
  const w = Math.max(2, Math.round(img.naturalWidth * k));
  const h = Math.max(2, Math.round(img.naturalHeight * k));
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const g = cv.getContext("2d", { willReadFrequently: true })!;
  g.drawImage(img, 0, 0, w, h);
  const px = g.getImageData(0, 0, w, h).data;

  // 1. Hard mask
  const mask = new Float32Array(w * h);
  if (opts.removeBackground) {
    // Background = light, low-saturation pixels connected to the image border
    const isBg = (i: number) => {
      const r = px[i * 4], gg = px[i * 4 + 1], b = px[i * 4 + 2], a = px[i * 4 + 3];
      if (a < 20) return true;
      const max = Math.max(r, gg, b), min = Math.min(r, gg, b);
      return min > 205 && max - min < 28;
    };
    const bg = new Uint8Array(w * h);
    const stack: number[] = [];
    for (let x = 0; x < w; x++) { stack.push(x, (h - 1) * w + x); }
    for (let y = 0; y < h; y++) { stack.push(y * w, y * w + w - 1); }
    while (stack.length) {
      const i = stack.pop()!;
      if (bg[i] || !isBg(i)) continue;
      bg[i] = 1;
      const x = i % w, y = (i / w) | 0;
      if (x > 0) stack.push(i - 1);
      if (x < w - 1) stack.push(i + 1);
      if (y > 0) stack.push(i - w);
      if (y < h - 1) stack.push(i + w);
    }
    for (let i = 0; i < w * h; i++) mask[i] = bg[i] ? 0 : 1;
  } else {
    for (let i = 0; i < w * h; i++) mask[i] = px[i * 4 + 3] / 255;
  }

  // 2. Soft edge (shrink slightly to drop light fringes, then feather)
  const soft = boxBlur(mask, w, h, long * 0.006);
  for (let i = 0; i < soft.length; i++) soft[i] = Math.min(1, Math.max(0, (soft[i] - 0.35) / 0.45));

  // 3. Depth: blurred silhouette = rounded body, plus a bump on the face
  const body = boxBlur(mask, w, h, long * 0.07, 3);
  let bmax = 0.0001;
  for (let i = 0; i < body.length; i++) { body[i] *= mask[i]; bmax = Math.max(bmax, body[i]); }
  const { x: fx, y: fy, radius: fr } = opts.face;
  const depth = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const dx = (x / w - fx) / fr, dy = ((y / h - fy) / fr) * (h / w) * 0.85;
      const face = Math.exp(-(dx * dx + dy * dy) * 0.9);
      depth[i] = Math.min(1, (0.55 * body[i]) / bmax + 0.6 * face * mask[i]);
    }
  }
  const depthS = boxBlur(depth, w, h, long * 0.03, 3);

  // 4. Pack (flip Y so row 0 = bottom, matching texture UVs) + bounds
  const pixels = new Uint8Array(w * h * 4);
  let x0 = w, x1 = 0, y0 = h, y1 = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const o = ((h - 1 - y) * w + x) * 4;
      pixels[o] = Math.round(soft[i] * 255);
      pixels[o + 1] = Math.round(depthS[i] * 255);
      pixels[o + 3] = 255;
      if (mask[i] > 0.5) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    }
  }
  if (x1 <= x0 || y1 <= y0) { x0 = 0; y0 = 0; x1 = w - 1; y1 = h - 1; }
  const pad = 0.02;
  const bounds = {
    x0: Math.max(0, x0 / w - pad), x1: Math.min(1, (x1 + 1) / w + pad),
    y0: Math.max(0, 1 - (y1 + 1) / h - pad), y1: Math.min(1, 1 - y0 / h + pad),
  };
  const maskAt = (u: number, v: number) => {
    const x = Math.min(w - 1, Math.max(0, Math.floor(u * w)));
    const y = Math.min(h - 1, Math.max(0, Math.floor(v * h)));
    return pixels[(y * w + x) * 4] / 255;
  };
  return { size: [w, h], pixels, bounds, maskAt };
}

/**
 * Flat (2D) cut-out at full resolution: removes a plain light background that
 * touches the image edges, softens the edge, and crops to the person.
 * Returns a canvas ready to display.
 */
export function cutoutPortrait(img: HTMLImageElement, removeBackground: boolean): HTMLCanvasElement {
  const w = img.naturalWidth, h = img.naturalHeight;
  const src = document.createElement("canvas");
  src.width = w; src.height = h;
  const g = src.getContext("2d", { willReadFrequently: true })!;
  g.drawImage(img, 0, 0);
  const id = g.getImageData(0, 0, w, h);
  const px = id.data;

  if (removeBackground) {
    const bg = new Uint8Array(w * h);
    const isBg = (i: number) => {
      const r = px[i * 4], gg = px[i * 4 + 1], b = px[i * 4 + 2];
      const max = Math.max(r, gg, b), min = Math.min(r, gg, b);
      return px[i * 4 + 3] < 20 || (min > 205 && max - min < 28);
    };
    const stack: number[] = [];
    for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
    for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
    while (stack.length) {
      const i = stack.pop()!;
      if (bg[i] || !isBg(i)) continue;
      bg[i] = 1;
      const x = i % w;
      if (x > 0) stack.push(i - 1);
      if (x < w - 1) stack.push(i + 1);
      if (i >= w) stack.push(i - w);
      if (i < w * (h - 1)) stack.push(i + w);
    }
    // soft edge: alpha = share of foreground in a small neighbourhood, pulled in slightly to drop the white fringe
    const fg = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) fg[i] = bg[i] ? 0 : 1;
    const soft = boxBlur(fg, w, h, Math.max(1, Math.round(Math.max(w, h) / 600)), 1);
    for (let i = 0; i < w * h; i++) {
      const a = Math.min(1, Math.max(0, (soft[i] - 0.45) / 0.5));
      px[i * 4 + 3] = Math.round(a * px[i * 4 + 3]);
    }
    g.putImageData(id, 0, 0);
  }

  // crop to the visible person
  let x0 = w, x1 = 0, y0 = h, y1 = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (px[(y * w + x) * 4 + 3] > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 <= x0 || y1 <= y0) { x0 = 0; y0 = 0; x1 = w - 1; y1 = h - 1; }
  const out = document.createElement("canvas");
  out.width = x1 - x0 + 1; out.height = y1 - y0 + 1;
  out.getContext("2d")!.drawImage(src, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
  return out;
}
