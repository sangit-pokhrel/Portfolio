import "server-only";
import fs from "node:fs";
import path from "node:path";
import { site, type Project } from "@/content/site";
import { listImages } from "./images";

export type ProjectMedia = { cover?: string; images: string[]; video?: string };

/** Images + optional demo video from public/images/projects/<slug>/ */
export function projectMedia(slug: string): ProjectMedia {
  const images = listImages(`projects/${slug}`);
  const dir = path.join(process.cwd(), "public", "images", "projects", slug);
  const video = fs.existsSync(dir)
    ? fs.readdirSync(dir).find((f) => /\.(mp4|webm|mov)$/i.test(f))
    : undefined;
  return { cover: images[0], images, video: video ? `/images/projects/${slug}/${encodeURIComponent(video)}` : undefined };
}

export const getProject = (slug: string) => site.projects.find((p) => p.slug === slug);

/** YouTube / Vimeo page URL → embeddable player URL (anything else is returned as-is). */
export function embedUrl(url: string): string {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return url;
}

export const hostOf = (url?: string) => {
  if (!url) return "";
  try { return new URL(url).host.replace(/^www\./, ""); } catch { return url; }
};

/** Small data set the hover preview needs (sent to the client). */
export function previewData(p: Project) {
  const m = projectMedia(p.slug);
  return {
    slug: p.slug, title: p.title, year: p.year, tags: p.tags, summary: p.summary, color: p.color,
    images: m.images.slice(0, 4), host: hostOf(p.live) || `${p.slug}.app`,
    hasLive: !!p.live, hasDemo: !!(p.demo || m.video),
  };
}
export type PreviewData = ReturnType<typeof previewData>;
