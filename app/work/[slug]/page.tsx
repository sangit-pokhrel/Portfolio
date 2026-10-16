import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { embedUrl, getProject, hostOf, projectMedia } from "@/lib/projects";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import BackToTop from "@/components/BackToTop";
import Docs from "@/components/Docs";
import Contours from "@/components/Contours";
import Browser from "@/components/Browser";
import { Arrow, Media, Roll } from "@/components/ui";

export function generateStaticParams() {
  return site.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  return p ? { title: `${p.title} — ${site.firstName} ${site.lastName}`, description: p.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const i = site.projects.indexOf(p);
  const next = site.projects[(i + 1) % site.projects.length];
  const media = projectMedia(p.slug);
  const host = hostOf(p.live) || `${p.slug}.app`;
  const demoEmbed = !media.video && p.demo ? embedUrl(p.demo) : undefined;
  const hasDemo = !!(media.video || demoEmbed);

  return (
    <>
      <SmoothScroll />
      <Contours seed={7} className="page-contours" />
      <Nav />
      <main className="pd" id="top" style={{ ["--label" as string]: p.color }}>
        <header className="pd-hero">
          <a href="/#work" className="pd-back"><span aria-hidden="true">←</span> <Roll>All work</Roll></a>
          <div className="text-eyebrow pd-eyebrow">
            <span className="pd-no">{String(i + 1).padStart(2, "0")}</span> Project · {p.year}
          </div>
          <h1 className="pd-title">{p.title}</h1>
          <p className="pd-sum">{p.summary}</p>

          <dl className="pd-meta">
            <div><dt className="text-eyebrow">Role</dt><dd>{p.role}</dd></div>
            <div><dt className="text-eyebrow">Year</dt><dd>{p.year}</dd></div>
            <div><dt className="text-eyebrow">Stack</dt><dd>{p.tags}</dd></div>
          </dl>

          <div className="pd-actions">
            {p.live && (
              <a className="btn-w" href={p.live} target="_blank" rel="noopener noreferrer">
                <span className="btn-text"><Roll>Visit live site</Roll></span><span className="btn-arrow"><Arrow /></span>
              </a>
            )}
            {hasDemo && <a className="pd-link" href="#demo"><Roll>Watch demo</Roll></a>}
            {p.repo && <a className="pd-link" href={p.repo} target="_blank" rel="noopener noreferrer"><Roll>Code ↗</Roll></a>}
          </div>
        </header>

        <section className="pd-shot" data-reveal>
          <Browser host={host} href={p.live}>
            <Media src={media.cover} seed={`p${i}${p.title}`} accent={p.color} alt={`${p.title} screenshot`} />
          </Browser>
        </section>

        {p.live && (
          <section className="pd-block" id="live" data-reveal>
            <div className="pd-block-head">
              <h2 className="pd-h2">Live preview</h2>
              <p className="pd-note">The real site, running right here. Some sites block being shown inside other pages; if it stays blank, open it live.</p>
            </div>
            <Browser host={host} href={p.live} className="is-live">
              <iframe
                src={p.live} title={`${p.title}: live preview`} loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </Browser>
          </section>
        )}

        <section className="pd-block" id="demo" data-reveal>
          <div className="pd-block-head">
            <h2 className="pd-h2">Demo</h2>
            {!hasDemo && (
              <p className="pd-note">
                Add a demo: drop <code>demo.mp4</code> into <code>public/images/projects/{p.slug}/</code>, or set{" "}
                <code>demo</code> to a YouTube/Vimeo link in <code>content/site.ts</code>.
              </p>
            )}
          </div>
          <Browser host={host} className="is-demo">
            {media.video ? (
              <video src={media.video} poster={media.cover} controls playsInline preload="metadata" />
            ) : demoEmbed ? (
              <iframe src={demoEmbed} title={`${p.title}: demo video`} loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
            ) : (
              <div className="pd-demo-empty">
                <Media src={media.images[1] ?? media.cover} seed={`d${i}`} accent={p.color} />
                <span className="pd-play" aria-hidden="true">▶</span>
              </div>
            )}
          </Browser>
        </section>

        <section className="pd-about" data-reveal>
          <h2 className="pd-h2">About the project</h2>
          <div className="pd-about-grid">
            <p className="pd-desc">{p.description}</p>
            <ul className="pd-highlights">
              {p.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </div>
        </section>

        {media.images.length > 1 && (
          <section className="pd-gallery" data-reveal>
            {media.images.slice(1).map((src) => (
              <Browser host={host} key={src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${p.title} screen`} loading="lazy" />
              </Browser>
            ))}
          </section>
        )}

        <a className="pd-next" href={`/work/${next.slug}`} style={{ ["--label" as string]: next.color }}>
          <span className="text-eyebrow">Next project</span>
          <span className="pd-next-title"><Roll>{next.title}</Roll></span>
          <span className="pd-next-arrow" aria-hidden="true"><Arrow /></span>
        </a>
      </main>
      <BackToTop />
      <Docs />
    </>
  );
}
