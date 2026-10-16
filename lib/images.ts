import "server-only";
import fs from "node:fs";
import path from "node:path";

/*
 * Images are discovered from folders in /public/images — drop a file in and it
 * shows up. Files are sorted by name, so prefix them (01-, 02-…) to set order.
 *
 *   public/images/me/portrait.(png|jpg)  hero portrait
 *   public/images/gallery/               horizontal gallery (caption = file name)
 *   public/images/projects/              covers, matched to projects in order
 *   public/images/featured/              floating images in "Let's build"
 *   public/images/cards/                 fanned social cards
 */
const EXT = /\.(jpe?g|png|webp|avif|gif)$/i;
const ROOT = path.join(process.cwd(), "public", "images");

export function listImages(folder: string): string[] {
  const dir = path.join(ROOT, folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => EXT.test(f) && !f.startsWith("."))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => `/images/${folder}/${encodeURIComponent(f)}`);
}

/** "03-studio-session-2024.jpg" → "Studio session, 2024" */
export function captionFromFile(url: string): string {
  const name = decodeURIComponent(url.split("/").pop() ?? "")
    .replace(EXT, "")
    .replace(/^\d+[-_ ]*/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  const withYear = name.replace(/\s(\d{4})$/, ", $1");
  return withYear.charAt(0).toUpperCase() + withYear.slice(1);
}

export function portraitSrc(): string | null {
  return listImages("me").find((u) => /portrait/i.test(u)) ?? listImages("me")[0] ?? null;
}

/** Does a file exist in /public? (e.g. the story recording) */
export function publicFileExists(url: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", decodeURIComponent(url.replace(/^\//, ""))));
}
