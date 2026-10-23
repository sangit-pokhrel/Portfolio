import { site } from "@/content/site";
import { previewData, projectMedia, STATUS_LABEL } from "@/lib/projects";
import ProjectPreview from "../ProjectPreview";
import HL from "../HL";
import { Arrow, Media, Roll } from "../ui";

/* Projects as a crate of vinyl: sleeve = cover image, the record slides out
   and spins on hover, the label takes the project's colour. */
export default function Projects() {
  return (
    <section className="s projects" id="work">
      <div className="c">
        <div className="title-layout grid-main">
          <div>
            <div className="text-eyebrow c-accent-hl projects-eyebrow">Side A — selected work</div>
            <HL as="h2" className="text-title-lg">Projects</HL>
          </div>
          <div className="title-para">
            <HL as="p" className="text-body">{site.projectsIntro}</HL>
          </div>
        </div>

        <div className="crate">
          {site.projects.map((p, i) => {
            const no = String(i + 1).padStart(2, "0");
            return (
              <a className="record" href={`/work/${p.slug}`} key={p.slug} data-preview={i} style={{ ["--label" as string]: p.color }}>
                <div className="record-stage">
                  <div className="record-disc">
                    <div className="record-spin">
                      <div className="record-label">
                        <span className="record-label-title">{p.title}</span>
                        <span className="record-label-meta">{p.year} · side {i % 2 ? "B" : "A"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="record-sleeve">
                    <Media src={projectMedia(p.slug).cover} seed={`p${i}${p.title}`} accent={p.color} alt={p.title} />
                    <span className="record-side text-eyebrow">{i % 2 ? "B" : "A"}{Math.floor(i / 2) + 1}</span>
                  </div>
                </div>
                <div className="record-meta">
                  <span className="record-no text-eyebrow">{no}</span>
                  <span className="record-title"><Roll>{p.title}</Roll></span>
                  <span className="record-tags text-eyebrow">{p.tags}</span>
                  <span className="record-year text-eyebrow">{p.year}</span>
                  <span className={`record-status text-eyebrow is-${p.status}`}>{STATUS_LABEL[p.status]}{p.company && p.status !== "open-source" ? ` · ${p.company}` : ""}</span>
                </div>
              </a>
            );
          })}
        </div>

        <div className="cta-row">
          <HL className="text-cta font-brier">{site.projectsCta}</HL>
          <a className="btn-w" href="#contact">
            <span className="btn-text"><Roll>Let&apos;s talk</Roll></span>
            <span className="btn-arrow"><Arrow /></span>
          </a>
        </div>
      </div>
      <ProjectPreview projects={site.projects.map(previewData)} />
    </section>
  );
}
