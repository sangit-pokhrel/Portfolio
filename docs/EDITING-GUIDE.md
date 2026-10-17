# Editing guide

How to update the portfolio without touching any design code. Almost everything is one of two things:

- **Text and links** → edit [`content/site.ts`](../content/site.ts)
- **Pictures, videos, audio** → drop files into folders under [`public/`](../public)

After a change, check it locally, then commit and push (see [Publish](#publish-your-changes)).

---

## Run it locally

```bash
npm install        # first time only
npm run dev        # open http://localhost:3000 — the page updates as you save
```

Before publishing, make sure the production build passes:

```bash
npm run build
```

---

## Where things live

| You want to change… | Edit this |
|---|---|
| Name, logo words, role, email, socials | `content/site.ts` (top of the file) |
| Résumé / CV PDFs (download popup) | `public/resume.pdf` and `public/cv.pdf` |
| Projects: titles, text, live/demo/code links | `content/site.ts` → `projects` |
| A project's cover and screenshots | `public/images/projects/<slug>/` |
| Hero photo, footer photo | `public/images/me/portrait.png` |
| Photo behind the signature | `public/images/me/card.jpg` |
| Scrolling gallery photos + captions | `public/images/gallery/` |
| "Let's build something" floating photos | `public/images/featured/` |
| "Follow along" cards | built from your `socials` links; Instagram tiles from `public/images/socials/instagram/` |
| "Unmute me" voice story | `public/audio/story.mp3` |
| Colours | `app/globals.css` (top of the file) |

---

## Your details

Open `content/site.ts`. The first block has your basics:

```ts
firstName: "Sangit",
lastName: "Pokhrel",
logo: { top: "Sangit", aka: "aka", bottom: "Music" },   // the top-left logo
role: "Full-Stack Developer",
location: "Kathmandu, Nepal",
email: "hello@yourdomain.com",
```

**Résumé and CV downloads:** the "Résumé" and "CV" buttons (top right, and "Résumé / CV" in the
footer) open a small popup where visitors pick one and it downloads. Save your PDFs as:

- `public/resume.pdf`: your short résumé
- `public/cv.pdf`: your full CV

That's all: they're picked up automatically and download as `Sangit-Pokhrel-Resume.pdf` /
`Sangit-Pokhrel-CV.pdf`. **The ones there now are samples** (made from your site details, with
`[placeholders]`); save your real PDFs over them. If a file is missing, its option is hidden. The PDFs must be in
the `public/` folder (files in the project root itself aren't reachable by visitors). The card texts
and download names are in `content/site.ts` → `documents`.

**Social links:** further down, in `socials`. The names appear in the menu, the "Follow along"
section and the footer. Add or remove entries freely:

```ts
socials: [
  { name: "GitHub", url: "https://github.com/sangit-pokhrel" },
  { name: "Instagram", url: "https://instagram.com/your-handle" },
],
```

---

## Projects

Every project appears in three places: as a vinyl record on the home page, in the hover preview that
follows the mouse, and on its own page at `/work/<slug>`.

### Edit a project's text and links

In `content/site.ts`, find the project inside `projects: [ … ]`:

```ts
{
  slug: "project-one",            // the page URL (/work/project-one) and the image folder name
  title: "Project One",
  year: "2025",
  tags: "Next.js · Postgres",     // shown under the title
  color: "#b57bff",               // colour of the record label and accents
  summary: "One line for the hover preview.",
  role: "Design & development",
  description: "A short paragraph for the project page.",
  highlights: ["What you're proudest of", "A number that moved", "A hard problem you solved"],
  live: "https://your-project.com",                 // "Visit live site" + the embedded live preview
  demo: "https://www.youtube.com/watch?v=XXXXXXX",  // demo video (YouTube or Vimeo link)
  repo: "https://github.com/sangit-pokhrel/your-repo",
},
```

- **No live site?** Set `live: ""`. The button and the live preview disappear.
- **No code to show?** Set `repo: ""`.
- **Demo:** a YouTube or Vimeo link works (normal `watch?v=` links are fine), or see the video file
  option below.

> **Live preview looks blank?** Some sites (Google, GitHub, many banks…) refuse to be shown inside
> another page. That's their setting, not a bug. Visitors can still use the "Open ↗" link in the
> frame. Your own Vercel/Netlify sites normally embed fine.

### Change a project's cover picture

Each project has its own folder: `public/images/projects/<slug>/`.

1. Open the folder for that project, e.g. `public/images/projects/project-one/`.
2. **The first file (alphabetically) is the cover.** Replace `01-cover.jpg` with your image,
   keeping the name `01-cover.jpg` (or name yours `01-…` so it sorts first).
3. Square images look best on the record sleeve.

### Add screenshots

Put more images in the same folder: `02-dashboard.jpg`, `03-mobile.jpg`, …
They appear in the hover preview slideshow and in the gallery on the project page, in name order.
Wide screenshots (16:9 or 16:10) look best in the browser frames.

### Add a demo video file

Put an `.mp4` (or `.webm`) anywhere in the project's folder, e.g. `public/images/projects/project-one/demo.mp4`.
It plays in the "Demo" section, using the cover as its poster. A video file takes priority over a
`demo` link. Keep videos small (under ~20 MB; 1080p, a minute or two).

### Add a new project

1. Copy an existing `{ … },` block inside `projects` and paste it where you want it in the list
   (the order in the file is the order on the site).
2. Give it a new, unique `slug`: lowercase, words joined with dashes, e.g. `"music-visualizer"`.
3. Create the folder `public/images/projects/music-visualizer/` and add `01-cover.jpg`
   (plus any screenshots).
4. Fill in the text and links.

### Remove or reorder projects

Delete its `{ … },` block (and its image folder if you like), or move blocks up and down to reorder.
The record numbers (A1, B1 …) and the "next project" links update automatically.

---

## Photos everywhere else

**Hero and footer photo:** `public/images/me/portrait.png`.
It must be **already cut out** (transparent background, PNG). Use remove.bg, Canva, or your phone's
"lift subject from background", then save over `portrait.png`. If you'd rather use a photo on a plain
white wall, set `removeBackground: true` under `portrait` in `content/site.ts` and the site cuts it
out itself.

**Photo behind the signature:** `public/images/me/card.jpg`: a normal photo (background included).
Landscape works best.

**Scrolling gallery:** `public/images/gallery/`. The **file name becomes the caption**:

| File name | Caption shown |
|---|---|
| `01-hackathon-2024.jpg` | Hackathon, 2024 |
| `02-live-gig-kathmandu-2025.jpg` | Live gig kathmandu, 2025 |

Number the files to set the order. The quotes between photos live in `content/site.ts` → `galleryQuotes`.

**"Let's build something":** `public/images/featured/` (first 4 files).

**"Follow along" cards:** seven mini profile screens built automatically from your details:
Now playing (plays your story), Instagram, LinkedIn, GitHub, Facebook, Résumé (opens the download
popup) and Say hello (email). Handles come from the `socials` links in `content/site.ts`. The
**GitHub card shows live data** (repos, followers, top languages, latest repos) fetched from your
public GitHub profile and refreshed daily. For the **Instagram grid**, drop up to 6 square photos into
`public/images/socials/instagram/` (otherwise your photos from `public/images/me/` are used).
Each card links to one of your `socials`, in order.

**Photos from Facebook/Instagram:** open the photo → ⋯ → Download, rename it, drop it in the folder.

---

## Your voice story ("Unmute me")

Record your story (a phone voice memo is fine), export as **MP3**, and save it over
`public/audio/story.mp3` (the current one is a **sample** narrated by a computer voice). The bottom-right avatar picks it up automatically. The bubble texts are in
`content/site.ts` → `story`.

---

## Other text on the page

All in `content/site.ts`:

| Section | Setting |
|---|---|
| Signature section text (scrolling rows) | `message.text` |
| Big headline with one highlighted word | `legacy` (set `accent: true` on the highlighted word) |
| "Now playing" card in the hero | `currently` |
| ON / OFF section | `split` |
| Tech stack marquee | `stack` |
| Scrolling bands between sections | `bands` |
| Footer headline | `footer.headline` |

---

## Colours

Top of `app/globals.css`:

```css
--ink: #1e1531;          /* dark base (purple sections, text) */
--accent: #b57bff;       /* buttons, highlights */
--accent-deep: #9d6bff;  /* serif accent words */
--pop: #ff4fa3;          /* the "HIRE ME" sticker */
```

---

## Image tips

- Formats: `.jpg` for photos, `.png` for cut-outs, `.webp` also works.
- Size: around 1600–2000 px on the long side is plenty. Compress big photos (e.g. squoosh.app) so
  the site stays fast.
- File names: lowercase, no spaces (`my-photo.jpg`, not `My Photo (1).JPG`).

---

## Publish your changes

```bash
npm run build                          # make sure it still builds
git add -A
git commit -m "Update projects and photos"
git push
```

Images are picked up when the site is **built**. Locally (`npm run dev`) just refresh the page; on a
live host, the new images appear after the next deploy (which happens automatically on push if the
site is connected to Vercel).

**Hosting (recommended): Vercel.** Sign in at vercel.com with GitHub → *Add New → Project* →
pick `sangit-pokhrel/Portfolio` → *Deploy*. Every `git push` then redeploys the site.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| New image doesn't show | Check it's in the right folder and the name has no spaces; refresh. On the live site, push and wait for the deploy. |
| Wrong project cover | The cover is the **first file by name** in the project folder; rename it to start with `01-`. |
| Project shows coloured shapes instead of its photos | The image folder name must match the project's `slug` exactly (`public/images/projects/<slug>/`). |
| Project page shows "404" | Use only lowercase letters, numbers and dashes in the `slug`, and make sure no two projects share one. |
| Live preview is blank | That website blocks embedding. Nothing to fix; the "Open ↗" link still works. |
| Build fails after editing `site.ts` | Usually a missing comma or quote. The error message names the line. |
