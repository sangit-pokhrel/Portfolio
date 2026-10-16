/* ==========================================================================
   ALL YOUR TEXT LIVES HERE.
   Images do NOT go here — drop them into the folders in /public/images
   (see README "Adding images"). They are picked up automatically.
   ========================================================================== */

export type Project = {
  slug: string;          // URL: /work/<slug>  ·  images: public/images/projects/<slug>/
  title: string;
  year: string;
  tags: string;
  color: string;         // record label colour
  summary: string;       // one line, shown in the hover preview
  role: string;
  description: string;   // a paragraph for the project page
  highlights: string[];
  live?: string;         // live site URL (embedded as a preview + "Visit live" button)
  demo?: string;         // demo video: YouTube/Vimeo URL, or leave empty and drop demo.mp4 in the project folder
  repo?: string;         // source code URL
};
export type Social = { name: string; url: string };

export const site = {
  firstName: "Sangit",
  lastName: "Pokhrel",
  // Top-left logo (Lando's "LANDO / NORRIS")
  logo: { top: "Sangit", aka: "aka", bottom: "Music" },
  role: "Full-Stack Developer",
  since: "building since 2019", // the "mclaren f1 since 2019" eyebrow
  location: "Kathmandu, Nepal",
  email: "hello@yourdomain.com",
  // Résumé / CV downloads: put the PDFs in the public/ folder with these names
  documents: {
    resume: { file: "/resume.pdf", label: "Résumé", note: "1 page · the highlights", download: "Sangit-Pokhrel-Resume.pdf" },
    cv: { file: "/cv.pdf", label: "CV", note: "The full story · experience, projects, skills", download: "Sangit-Pokhrel-CV.pdf" },
  },

  // Hero portrait (public/images/me/portrait.png)
  portrait: {
    // "2d" = your photo as-is. "3d" = the photo turns to follow the cursor + hover lens.
    mode: "2d" as "2d" | "3d",
    // A photo on a plain white/light background works best (it is cut out automatically).
    // Already transparent PNG? set removeBackground: false.
    removeBackground: false, // portrait.png is already cut out (transparent background)
    // 3D only: where the face is, as fractions of the image (0–1), used to shape the depth.
    face: { x: 0.52, y: 0.35, radius: 0.12 },
    // 3D only: how strongly the head turns towards the cursor.
    turn: 1,
  },

  // Bottom-right "unmute me" widget: put your recording at public/audio/story.mp3
  story: {
    src: "/audio/story.mp3",
    prompt: "Wanna hear my story?",
    cta: "Unmute me",
    playing: "Now playing: my story",
    missing: "My voice note is coming soon",
    ended: "Thanks for listening",
  },

  // Bottom-left hero widget (Lando's "Next Race")
  currently: { label: "Now playing", title: "Project X", sub: "in beta", url: "#work" },

  // Dark signature section under the hero (Lando's "Message from Lando").
  // The text runs as two endless rows behind your photo while the signature writes itself.
  message: {
    eyebrow: "Message from Sangit",
    text: "I build fast, honest products and sweat the details nobody asked for. This is my track record.",
  },

  // Big headline after the signature; the `accent` word is set in the accent colour (purple) serif
  legacy: [
    { text: "Building a" },
    { text: "legacy", accent: true },
    { text: "in code and music, on and off the stage." },
  ] as { text: string; accent?: boolean }[],

  // Quotes and the badge mixed into the horizontal gallery between your photos
  galleryQuotes: [
    "It doesn't matter where you start, it matters how hard you keep pushing.",
    "Since I wrote my first line of code, I've worked to turn ideas into things people actually use.",
  ],
  galleryBadge: { text: "1", label: "first place" },

  split: {
    left: { top: "ON", bottom: "CODE", text: "Most recent work, case studies and shipped products.", url: "#work" },
    right: { top: "OFF", bottom: "CODE", text: "Music, photography, side quests and what keeps me sane.", url: "#journey" },
  },

  // Projects, shown as a crate of vinyl records. Each project has its own page at /work/<slug>.
  // Images: public/images/projects/<slug>/ (first file = cover, the rest = screenshots).
  // Demo video: put demo.mp4 in that folder, or set `demo` to a YouTube/Vimeo URL.
  projectsIntro:
    "Every project is a record: its own sleeve, its own sound. Hover one to pull it out of the crate.",
  projects: [
    {
      slug: "project-one", title: "Project One", year: "2025", tags: "Next.js · Postgres", color: "#b57bff",
      summary: "Full-stack product: auth, payments and a fast dashboard.",
      role: "Design & development",
      description: "Describe the problem, what you built and what changed because of it. Keep it to a few honest sentences: who it was for, the hard part, and the result.",
      highlights: ["What you're proudest of", "A number that moved (users, speed, revenue)", "A tricky technical problem you solved"],
      live: "https://example.com",
      demo: "",
      repo: "https://github.com/",
    },
    {
      slug: "project-two", title: "Project Two", year: "2025", tags: "React Native", color: "#ff4fa3",
      summary: "A mobile app that turns daily habits into a small game.",
      role: "Design & development",
      description: "Describe the problem, what you built and what changed because of it. Keep it to a few honest sentences: who it was for, the hard part, and the result.",
      highlights: ["What you're proudest of", "A number that moved (users, speed, revenue)", "A tricky technical problem you solved"],
      live: "https://example.com",
      demo: "",
      repo: "https://github.com/",
    },
    {
      slug: "project-three", title: "Project Three", year: "2024", tags: "Three.js · GLSL", color: "#b9adc9",
      summary: "Interactive 3D experience running smoothly in the browser.",
      role: "Design & development",
      description: "Describe the problem, what you built and what changed because of it. Keep it to a few honest sentences: who it was for, the hard part, and the result.",
      highlights: ["What you're proudest of", "A number that moved (users, speed, revenue)", "A tricky technical problem you solved"],
      live: "https://example.com",
      demo: "",
      repo: "https://github.com/",
    },
    {
      slug: "project-four", title: "Project Four", year: "2024", tags: "Python · ML", color: "#b57bff",
      summary: "A model that tags songs by mood, with a playful web UI.",
      role: "Design & development",
      description: "Describe the problem, what you built and what changed because of it. Keep it to a few honest sentences: who it was for, the hard part, and the result.",
      highlights: ["What you're proudest of", "A number that moved (users, speed, revenue)", "A tricky technical problem you solved"],
      live: "https://example.com",
      demo: "",
      repo: "https://github.com/",
    },
    {
      slug: "project-five", title: "Project Five", year: "2023", tags: "Node · Redis", color: "#efe9f6",
      summary: "Real-time backend handling thousands of live events.",
      role: "Design & development",
      description: "Describe the problem, what you built and what changed because of it. Keep it to a few honest sentences: who it was for, the hard part, and the result.",
      highlights: ["What you're proudest of", "A number that moved (users, speed, revenue)", "A tricky technical problem you solved"],
      live: "https://example.com",
      demo: "",
      repo: "https://github.com/",
    },
    {
      slug: "project-six", title: "Project Six", year: "2023", tags: "Go · gRPC", color: "#ff4fa3",
      summary: "Lightweight microservices with a clean developer experience.",
      role: "Design & development",
      description: "Describe the problem, what you built and what changed because of it. Keep it to a few honest sentences: who it was for, the hard part, and the result.",
      highlights: ["What you're proudest of", "A number that moved (users, speed, revenue)", "A tricky technical problem you solved"],
      live: "https://example.com",
      demo: "",
      repo: "https://github.com/",
    },
    {
      slug: "project-seven", title: "Project Seven", year: "2022", tags: "WordPress · PHP", color: "#9d6bff",
      summary: "Custom theme and plugins for a fast-growing publisher.",
      role: "Design & development",
      description: "Describe the problem, what you built and what changed because of it. Keep it to a few honest sentences: who it was for, the hard part, and the result.",
      highlights: ["What you're proudest of", "A number that moved (users, speed, revenue)", "A tricky technical problem you solved"],
      live: "https://example.com",
      demo: "",
      repo: "https://github.com/",
    },
    {
      slug: "project-eight", title: "Project Eight", year: "2021", tags: "Vue · Firebase", color: "#b57bff",
      summary: "My first shipped product: a shared playlist for parties.",
      role: "Design & development",
      description: "Describe the problem, what you built and what changed because of it. Keep it to a few honest sentences: who it was for, the hard part, and the result.",
      highlights: ["What you're proudest of", "A number that moved (users, speed, revenue)", "A tricky technical problem you solved"],
      live: "https://example.com",
      demo: "",
      repo: "https://github.com/",
    },
  ] as Project[],
  projectsCta: "See every project, experiment and write-up",

  featured: {
    eyebrow: "Available for work",
    title: "Let's build something",
    text: "Open to full-time roles and selected freelance projects. If it's ambitious, I'm interested.",
    cta: "Start a project",
    url: "mailto:hello@yourdomain.com",
    sticker: "HIRE ME",
  },

  // Scroll-reactive text bands between sections (they flip direction when you scroll up)
  bands: {
    tape: ["Sangit", "aka Music", "Kathmandu", "Code & Sound"],
    crossA: ["Now playing", "Side A", "Selected work", "Press play"],
    crossB: ["Built with care", "Shipped", "On repeat", "No skips"],
    outro: ["Let's talk", "Say hello", "Open for work"],
  },

  stackIntro: "The tools I trust on race day. Picked for speed, reliability and how good they feel to work with.",
  stack: ["React", "Next.js", "TypeScript", "Node", "Python", "PostgreSQL", "Three.js", "GSAP", "Figma", "Docker"],

  // Footer headline (Lando's "Always bringing the fight."): accent words are purple serif
  footer: {
    headline: [
      { text: "Always" },
      { text: "making", accent: true },
      { text: "the" },
      { text: "noise.", accent: true },
    ] as { text: string; accent?: boolean }[],
    cta: "Business enquiries",
  },

  socials: [
    { name: "GitHub", url: "https://github.com/" },
    { name: "LinkedIn", url: "https://linkedin.com/" },
    { name: "Instagram", url: "https://instagram.com/" },
    { name: "Facebook", url: "https://facebook.com/" },
  ] as Social[],
};

export const initials = (site.firstName[0] ?? "") + (site.lastName[0] ?? "");
