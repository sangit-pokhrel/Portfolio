/* ==========================================================================
   ALL YOUR TEXT LIVES HERE.
   Images do NOT go here — drop them into the folders in /public/images
   (see README "Adding images"). They are picked up automatically.
   ========================================================================== */

export type ProjectStatus = "live" | "in-progress" | "offline" | "open-source" | "delivered";
export type Project = {
  slug: string;          // URL: /work/<slug>  ·  images: public/images/projects/<slug>/
  title: string;
  year: string;
  tags: string;
  color: string;         // record label colour
  summary: string;       // one line, shown in the hover preview
  role: string;
  description: string;   // a paragraph for the project page
  myRole: string[];      // "what I did" checklist on the project page
  highlights: string[];
  company?: string;      // where you built it ("Built at …")
  client?: string;       // who it was for, if different
  credit?: string;       // overrides the automatic "Built at … · for …" line
  status: ProjectStatus;
  live?: string;         // live site URL (embedded as a preview + "Visit live" button)
  archived?: string;     // Wayback Machine link for sites that are gone
  demo?: string;         // demo video: YouTube/Vimeo URL, or drop demo.mp4 in the project folder
  repo?: string;         // PUBLIC source code only (private repos would 404 for visitors)
  links?: { label: string; url: string; note?: string; repo?: string; shot?: string }[]; // more sites; shot = screenshot file tag
  quote?: { text: string; by: string; role?: string }; // a real line from a client or colleague
  // Read-only demo: only fill this in once the demo is actually deployed and working.
  demo_access?: { url: string; note?: string; logins: { role: string; user: string; pass: string }[] };
};
export type Social = { name: string; url: string };

export const site = {
  firstName: "Sangit",
  lastName: "Pokhrel",
  // Top-left logo (Lando's "LANDO / NORRIS")
  logo: { top: "Sangit", aka: "aka", bottom: "Music" },
  role: "Full-Stack Web App Developer",
  since: "building since 2019", // the "mclaren f1 since 2019" eyebrow
  location: "Kathmandu, Nepal",
  email: "mail@sangitpokhrel.com.np",
  // Résumé / CV downloads: put the PDFs in the public/ folder with these names
  documents: {
    resume: { file: "/resume.pdf", label: "Resume", note: "1 page · the highlights", download: "Sangit-Pokhrel-Resume.pdf" },
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

  // Floating bubbles around your hero photo: services (big) and skills (small).
  // x / y = position in % of the hero; depth = how much it drifts with the mouse;
  // m = [x, y] position on phones (bubbles without m are hidden on phones).
  bubbles: [
    { label: "Web apps", note: "end-to-end", kind: "service", x: 20, y: 26, depth: 1.4 , m: [21, 37] },
    { label: "Mobile apps", note: "Flutter", kind: "service", x: 79, y: 24, depth: 1.2 , m: [79, 35] },
    { label: "APIs & backends", note: "fast & secure", kind: "service", x: 13, y: 52, depth: 0.9 , m: [20, 51] },
    { label: "UI / UX", note: "design → code", kind: "service", x: 86, y: 52, depth: 1.1 , m: [81, 50] },
    { label: "Next.js", kind: "skill", x: 32, y: 14, depth: 0.7 , m: [18, 65] },
    { label: "React", kind: "skill", x: 67, y: 13, depth: 0.8 , m: [83, 64] },
    { label: "TypeScript", kind: "skill", x: 30, y: 40, depth: 1.6 },
    { label: "Node.js", kind: "skill", x: 70, y: 39, depth: 1.5 },
    { label: "Python · Django", kind: "skill", x: 24, y: 70, depth: 1.0 },
    { label: "AI / ML", kind: "skill", x: 77, y: 70, depth: 1.3 },
    { label: "♪ Music", kind: "skill", x: 63, y: 84, depth: 0.6 },
  ] as { label: string; note?: string; kind: "service" | "skill"; x: number; y: number; depth: number; m?: [number, number] }[],

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
  currently: { label: "Now building", title: "Sajilo Gaadi", sub: "ride-sharing backend", url: "/work/sajilo-gaadi" },

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
  galleryBadge: { text: "2", label: "runner-up · TriCode" },

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
      slug: "artova-solutions", title: "Artova Solutions Platform", year: "2024–now", color: "#b57bff",
      tags: "Next.js 15 · TypeScript · MongoDB",
      company: "Artova Solutions", status: "live", role: "Lead Software Engineer",
      summary: "The company's site, blog, admin dashboard and intern portal, with attendance, billing and verifiable certificates.",
      description: "I built Artova's internal operations platform from scratch, alongside the public website. Staff clock in, get tasks assigned and handle billing in one place; interns get their own portal; and every certificate the company issues can be verified online by anyone through a QR code. Support emails don't live in an inbox: replies are read over IMAP and filed straight into tickets.",
      myRole: [
        "Designed and built the whole platform: public site, blog, admin dashboard and intern portal",
        "Attendance, clock-in, task assignment and billing modules",
        "Certificate generation (pdf-lib) with public QR verification",
        "Email-to-ticket support desk using IMAP",
        "JWT auth with bcrypt and single-device session enforcement",
      ],
      highlights: ["Used every day by 15+ staff", "Every certificate verifiable online by anyone", "Support replies land straight in tickets"],
      live: "https://artovasolutions.com",
    },
    {
      slug: "enlighten-research", title: "Enlighten Research Institute", year: "2026", color: "#ffc46b",
      tags: "Next.js · TypeScript · Nodemailer",
      company: "Artova Solutions", client: "Enlighten Research Institute", status: "live", role: "Full-stack developer",
      summary: "Moved a research institute's thesis workflow from paper and spreadsheets onto one platform.",
      description: "Enlighten Research Institute guides students and researchers from a research question to a finished thesis. Their workflow ran on paper and spreadsheets; I designed and delivered a management system that brings it into one platform, plus the public website clients find them through.",
      myRole: [
        "Requirements with the client, then design and build end to end",
        "Research and thesis workflow management for staff",
        "Public website with services, guidelines and resources",
        "Contact and enquiry flow with email notifications",
      ],
      highlights: ["Used by 20+ staff", "Serves 100+ clients", "Paper and spreadsheets replaced by one platform"],
      live: "https://enlightment-fawn.vercel.app",
      links: [
        { label: "Thesis Companion (sister brand site)", url: "https://thesis-companion-omega.vercel.app", note: "Next.js app with API routes, public repo", repo: "https://github.com/sangit-pokhrel/Thesis-companion" },
        { label: "Artova Research (sister brand site)", url: "https://artova-research.vercel.app" },
      ],
    },
    {
      slug: "artova-designs", title: "Artova Designs", year: "2026", color: "#ff4fa3",
      tags: "React · Fabric.js · Zustand · Vite",
      company: "Artova Solutions", status: "live", role: "Sole developer",
      summary: "An in-house poster studio: pick a design, type your words, add a photo, export for Facebook and Instagram.",
      description: "The team was producing posters for four academic-services brands in Canva, and it had become too slow and too expensive for the volume. I built Artova Designs: a poster studio with each brand's colours and logos built in, where anyone on the team can turn out an on-brand ad in a minute. It's behind a login, so the visuals here are posters rebuilt as templates in the studio.",
      myRole: [
        "Rebuilt the brands' reference posters as editable templates",
        "Canvas editor on Fabric.js with brand kits per page",
        "Exports to images, ZIP batches and PowerPoint",
        "Nepali date support and an in-app guide for the team",
      ],
      highlights: ["31 reference posters rebuilt as templates", "62 studio designs (2 variations each)", "Replaced a slow, costly Canva workflow"],
      live: "https://artovadesigns.vercel.app",
    },
    {
      slug: "himbari-foods", title: "Himbari Foods", year: "2026", color: "#8bc34a",
      tags: "Next.js 16 · React Three Fiber · Three.js",
      client: "Himbari Foods", credit: "Freelance · for Himbari Foods", status: "live", role: "Design & development",
      summary: "A 3D Himalayan storefront: spin and open product packs, browse a 3D shelf, check out with eSewa or Khalti.",
      description: "Himbari Foods sells Himalayan teas and snacks. Instead of a standard shop grid, the store is built around the products themselves: packs float over a 3D mountain hero, spin and open as you scroll, and every product has a 3D viewer with hotspots for origin, ingredients and nutrition.",
      myRole: [
        "3D hero, scroll-pinned pack that rotates and opens, parallax story pages",
        "Draggable 3D shelf with filters and typo-tolerant search in English and Nepali",
        "Product pages with a 3D viewer, hotspots and SEO structured data",
        "One-page checkout: delivery zones, eSewa / Khalti / card / COD, VAT-inclusive totals",
      ],
      highlights: ["Built from the client's PRD", "Search works in English and Nepali", "Local payments: eSewa and Khalti"],
      live: "https://himbarifoods.vercel.app",
    },
    {
      slug: "cmarga", title: "Cmarga Real Estate", year: "2024–25", color: "#2bb673",
      tags: "React · Django · SCSS",
      company: "Cmarga Pvt Ltd", status: "live", role: "Frontend developer (contract)",
      summary: "A real-estate platform for buying, selling and renting property in Nepal.",
      description: "Cmarga helps people in Nepal buy, sell and rent property with confidence. I built the cmarga.com platform as one half of a two-person team: a React frontend on a Django backend, then stayed on after launch to ship new features and fix the bugs real users reported.",
      myRole: [
        "Built the cmarga.com frontend in React on a Django backend, in a team of two",
        "Property search and listings for buying, renting and selling",
        "Appointment booking and enquiry flows",
        "Shipped new features and fixed user-reported bugs after launch",
      ],
      highlights: ["Live at cmarga.com", "Two-person team", "Kept improving it after launch"],
      live: "https://cmarga.com",
    },
    {
      slug: "online-home", title: "Online Home", year: "2025", color: "#36c2b4",
      tags: "Next.js · Supabase · Prisma · PostgreSQL",
      company: "Online Home Pvt Ltd", status: "offline", role: "Full-stack developer (contract)",
      summary: "A property marketplace for Nepal: list, search and discover places to live on a map.",
      description: "I built onlinehome.com.np end to end, from gathering requirements with the client to deployment, together with Ashok Neupane (I was the lead contributor). Owners list properties with photos, and buyers and renters search by location on an interactive map. The site has since been taken offline by the company; an archived copy is linked here.",
      myRole: [
        "Built the platform end to end: requirements, frontend, backend and deployment",
        "Map-based property search with Leaflet and Google Places",
        "Listing uploads with image compression and Cloudinary",
        "Connected third-party services through their APIs and improved page load speed",
      ],
      highlights: ["Lead contributor (91 commits)", "Map-based property search", "Installable as an app (PWA)"],
      archived: "https://web.archive.org/web/20260210125205/https://onlinehome.com.np/",
    },
    {
      slug: "ghargharko-doctor", title: "GharGharKo Doctor", year: "2025", color: "#5ec2a4",
      tags: "Next.js · React Query · Zod",
      company: "Artova Solutions", status: "live", role: "Full-stack developer",
      summary: "Clinic and hospital management: registration, appointments, lab reports, pharmacy and billing in one system.",
      description: "A clinic management system built for Nepal and in daily use at a family-run clinic. Registration, appointments, lab reports, pharmacy, billing and reporting all live in one system that keeps working when the internet drops, so there's no juggling a register book, a WhatsApp group and three different apps.",
      myRole: [
        "Patient records, appointments and billing",
        "Lab reports with QR-verified results",
        "Offline-tolerant workflows and multi-branch support",
        "Separate staff and patient entry points",
      ],
      highlights: ["In daily use at a family-run clinic", "Keeps working when the internet drops", "QR-verified lab reports"],
      live: "https://testghar.sangitpokhrel.com.np",
    },
    {
      slug: "deukhuri-public-school", title: "Deukhuri Public School", year: "2026", color: "#ef5b5b",
      tags: "Next.js · Express · MongoDB · GSAP",
      client: "Deukhuri Public School", credit: "Freelance · team of three · for Deukhuri Public School", status: "live", role: "Full-stack developer",
      summary: "The website and school system for a school in Lamahi, Dang: admissions, academics, gallery and news, in Nepali and English.",
      description: "Deukhuri Public School wanted a site that feels as warm as the school itself. With a team of three, I built a bilingual website (Nepali and English) with animated, smooth-scrolling pages, an admissions flow for the new academic year, school-visit booking, a gallery and latest updates, on top of a separate backend that powers the school's data.",
      myRole: [
        "Frontend in Next.js with GSAP and Lenis animations",
        "Bilingual pages: Nepali and English",
        "Admissions and school-visit booking flows",
        "Express + MongoDB API with JWT auth, Swagger docs and automated tests, built with two teammates",
      ],
      highlights: ["Nursery to Grade 10 school", "Nepali + English", "Team of three"],
      live: "https://dps-puce.vercel.app",
    },
    {
      slug: "sajilo-gaadi", title: "Sajilo Gaadi", year: "2026", color: "#ffd166",
      tags: "REST APIs · PostgreSQL · Auth",
      company: "Sajilo Gaadi Pvt Ltd", status: "in-progress", role: "Backend developer (contract)",
      summary: "The backend for a ride-sharing platform, now in its final stage before launch.",
      description: "I'm building the backend for Sajilo Gaadi, a ride-sharing platform, working remotely with their mobile team. The product isn't public yet, so there's nothing to click here, but I'm happy to walk through the architecture and API design in an interview.",
      myRole: [
        "REST APIs for authentication, ride booking and driver management",
        "PostgreSQL schema design, and tuning slow queries as data grew",
        "Keeping the API contract stable with the mobile team",
      ],
      highlights: ["Final stage before launch", "Contract, remote", "Code walkthrough available on request"],
    },
    {
      slug: "careersync", title: "CareerSync", year: "2025–26", color: "#4fc3ff",
      tags: "Next.js · React Query · Socket.IO · Chart.js",
      company: "Artova Solutions", status: "live", role: "Full-stack developer",
      summary: "AI résumé analyser: upload a CV, get ATS-focused feedback and matching job listings.",
      description: "CareerSync helps job seekers get past applicant-tracking systems. Upload a CV and it returns AI-powered feedback on what to fix, an ATS score, and job listings that fit, with real-time updates and charts to track progress.",
      myRole: [
        "Résumé upload and analysis flow with drag-and-drop",
        "ATS-focused feedback and scoring views with charts",
        "Job listings and real-time updates over Socket.IO",
      ],
      highlights: ["AI-powered CV feedback", "ATS optimisation", "Real-time updates"],
      live: "https://cv-analyser-backend-six.vercel.app",
      repo: "https://github.com/sangit-pokhrel/careersync",
    },
    {
      slug: "aussie-finance", title: "Aussie Finance & Home Loans", year: "2023–24", color: "#f5b642",
      tags: "HTML · CSS · JavaScript",
      client: "Aussie Finance & Home Loans", credit: "Freelance · Australian finance client", status: "delivered", role: "Frontend developer",
      summary: "The first version of the website for an Australian mortgage and home-loan broker.",
      description: "My first international client: a home-loan and finance broker in Australia. I built the first version of their website, working remotely and taking it from the brief to a site their customers could use to understand their loan options and get in touch.",
      myRole: [
        "Built the first version of the website, frontend end to end",
        "Responsive layouts for loan services and enquiry pages",
        "Worked remotely with an overseas client from brief to handover",
      ],
      highlights: ["First international client", "Australian finance sector", "Remote, brief to handover"],
    },
    {
      slug: "gallero", title: "Gallero", year: "2026", color: "#9d6bff",
      tags: "Expo · React Native · TypeScript",
      status: "open-source", role: "Solo project",
      summary: "A private, ad-free Android gallery inspired by Apple Photos. Nothing leaves your phone.",
      description: "Stock galleries lag on big libraries, third-party ones are full of ads, and cloud galleries want an account and your photos. Gallero is an Apple Photos-inspired gallery for Android that runs entirely on the device: no ads, no sign-in, no servers, and you can restyle it down to the corner radius of a thumbnail.",
      myRole: ["Product idea, design and development", "Fast virtualised grid for large libraries", "Locked albums with biometrics, memories and people views"],
      highlights: ["No ads, no account, no cloud", "Apple Photos-style experience on Android", "Open source"],
      repo: "https://github.com/sangit-pokhrel/Gallero",
    },
    {
      slug: "vocalis", title: "Vocalis", year: "2026", color: "#ff7a59",
      tags: "Kotlin · Jetpack Compose · DSP",
      status: "open-source", role: "Solo project",
      summary: "A studio-quality Android voice recorder with real-time noise and breath reduction.",
      description: "My phone has no sound recorder, and the ones in app stores either record exactly what the microphone hears or lock the useful parts behind a subscription. Vocalis cleans up voice as you record, with hand-written signal processing and no cloud, ads or tracking. Where my music and my code meet.",
      myRole: ["Hand-written DSP: spectral noise reduction, breath reduction, rumble filter, de-esser, voice EQ", "Recording UI in Jetpack Compose", "Everything on-device"],
      highlights: ["Breaths turned down by ~12 dB", "Noise reduction that learns the room", "No cloud, no ads, no tracking"],
      repo: "https://github.com/sangit-pokhrel/SoundRecorder",
    },
    {
      slug: "client-websites", title: "Client Websites", year: "2023–26", color: "#5ec2a4",
      tags: "Next.js · React · Django",
      credit: "Freelance & contract work · Nepal and Australia", status: "live", role: "Design & development",
      summary: "More production sites for clients in Nepal and Australia: cargo and logistics, a children's charity and a finance broker.",
      description: "Alongside product work I've delivered 10+ websites for clients in Nepal and Australia, usually owning everything from the first client call to deployment.",
      myRole: ["Requirements, design and build end to end", "Forms wired to Google Sheets and email, admin panels, donation flows", "Deployment and handover so clients can edit content"],
      highlights: ["10+ client websites", "Clients in Nepal and Australia", "First call to deployment"],
      live: "https://moonlightcargo.vercel.app",
      links: [
        { label: "Moonlight Cargo", shot: "moonlight", url: "https://moonlightcargo.vercel.app", note: "Cargo & logistics · rate calculator, quote forms to Google Sheets" },
        { label: "Loving Heart Nepal", shot: "lovingheart", url: "https://lovingheartnepal.vercel.app", note: "Children's charity · QR donations, admin panel, blog" },
        { label: "Destiny Finance & Home Loans", url: "https://github.com/sangit-pokhrel/destiny-revised", note: "Australian finance client · built, then rebuilt · site offline (code)" },
      ],
    },
  ] as Project[],
  projectsCta: "Company platforms, client sites, a thesis and apps of my own",

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
  stack: ["React", "Next.js", "TypeScript", "Node.js", "Express", "Django", "Spring Boot", "PostgreSQL", "MongoDB", "GraphQL", "Three.js", "Docker", "AWS"],

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
    { name: "GitHub", url: "https://github.com/sangit-pokhrel" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/pokhrelsangit/" },
    { name: "Instagram", url: "https://www.instagram.com/aw.sike/" },
    { name: "Facebook", url: "https://www.facebook.com/sangit.artova/" },
  ] as Social[],
};

export const initials = (site.firstName[0] ?? "") + (site.lastName[0] ?? "");
