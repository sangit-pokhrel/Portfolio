# Sangit aka Music — Portfolio

> **Updating content?** See the step-by-step [Editing guide](docs/EDITING-GUIDE.md): project covers, links, photos, voice story, colours.

Next.js (App Router) + GSAP/ScrollTrigger + Lenis + Three.js.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static production build
```

## Adding images — just drop files into folders

Everything in `public/images/` is picked up automatically (jpg, png, webp, avif, gif).
Files are sorted by name, so prefix them with numbers to control order.

| Folder | Where it shows | Tips |
|---|---|---|
| `public/images/me/` | Hero 3D portrait | One file named `portrait.png` (or `.jpg`). See below. |
| `public/images/gallery/` | Horizontal scrolling gallery | The **file name becomes the caption**: `03-live-gig-2025.jpg` → "Live gig, 2025". Add as many as you like. |
| `public/images/projects/<slug>/` | Record sleeve, hover preview and the project page | First file = cover, the rest = screenshots. Drop `demo.mp4` here for the demo player. |
| `public/images/featured/` | Floating photos around "Let's build something" | First 4 are used. |
| `public/images/cards/` | Fanned cards in "Follow along" | Up to 9. Tall (9:16) images look best — phone screenshots work great. |

Folder empty? A generated placeholder is shown instead, so nothing breaks.

**Photos from Facebook/Instagram:** download them (Facebook: open photo → ⋯ → Download), rename, and drop them into the folders above.

### The hero portrait

`portrait.mode` in `content/site.ts` picks how it's shown:
`"2d"` (default) shows your photo as-is; `"3d"` makes the head turn to follow the cursor
with a halftone hover lens. Both cut a plain background out automatically.
For the best result:

- **High resolution** — at least 1500 px tall. Small photos look blurry full-screen.
- **Plain white or light background** (it's cut out automatically), or a transparent PNG
  (then set `removeBackground: false` in `content/site.ts`).
- Facing the camera, head and shoulders, some space above the head.
- If the head-turn looks off, adjust `portrait.face` (where your face is, as 0–1 fractions
  of the image) and `portrait.turn` (strength) in `content/site.ts`.

## Your voice story ("Unmute me")

Record your story (a phone voice memo is fine), export it as **MP3**, and save it as
`public/audio/story.mp3`. The bottom-right avatar picks it up automatically: click → the tape
peels off and the mouth moves with your voice. Until the file exists, the bubble says the
recording is coming soon. Texts are in `content/site.ts` → `story`.

## Projects

Each project in `content/site.ts` → `projects` gets its own page at `/work/<slug>` with a live
preview (your `live` URL embedded in a browser frame), a demo (YouTube/Vimeo link in `demo`, or a
`demo.mp4` in its image folder), description, highlights and screenshots. Hovering a record on the
home page shows a small preview that follows the cursor.

## Editing text

All text — name, logo ("Sangit aka Music"), projects, socials, email — is in
[`content/site.ts`](content/site.ts).

## Structure

| Path | What it does |
|---|---|
| `app/page.tsx` | Section order |
| `app/globals.css` | All styles and design tokens |
| `components/sections/*` | One component per section |
| `components/PortraitCanvas.tsx`, `lib/portrait.ts`, `lib/shaders.ts` | 3D portrait: cut-out, depth map, look-at-cursor, halftone lens |
| `components/Contours.tsx` | Topographic line background |
| `components/Experience.tsx` | Smooth scroll, loader and all scroll animations |
| `components/Nav.tsx` | Logo, nav and full-screen menu |
| `lib/images.ts` | Folder → image discovery |
