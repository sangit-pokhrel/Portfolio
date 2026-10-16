import { site } from "@/content/site";
import { portraitSrc } from "@/lib/images";
import { signatureStrokes } from "@/lib/signature";
import { Arrow, Roll } from "../ui";
import Contours from "../Contours";
import Marquee from "../Marquee";
import PortraitImage from "../PortraitImage";
import { SocialLinks } from "./Socials";

const PAGES = [
  { href: "#top", label: "Home" },
  { href: "#work", label: "Work" },
  { href: "#journey", label: "Journey" },
  { href: "#stack", label: "Stack" },
];

/* Lando's footer: accent frame, dark panel with a raised tab, moving contours,
   signature over a two-tone headline, portrait rising from the bottom,
   links either side, a moving strip and the enquiries button. */
export default function Footer() {
  const photo = portraitSrc();
  return (
    <footer className="footer" id="contact" data-theme-nav="light">
      <span className="footer-tab" aria-hidden="true" />
      <div className="footer-panel" data-footer>
        <Contours seed={42} className="footer-contours" />

        <div className="footer-head">
          <svg className="footer-sig" viewBox="0 0 1000 600" aria-hidden="true" data-footer-sig>
            {signatureStrokes().map((d, i) => <path d={d} key={i} />)}
          </svg>
          <h2 className="footer-title">
            {site.footer.headline.map((w, i) => (
              <span key={i} className={w.accent ? "is-accent" : undefined}>{w.text} </span>
            ))}
          </h2>
        </div>

        {photo && (
          <PortraitImage src={photo} alt="" removeBackground={site.portrait.removeBackground}
            wrapClass="footer-portrait" innerClass="footer-portrait-in" />
        )}

        <nav className="footer-col is-left" aria-label="Pages">
          <div className="text-eyebrow">Pages</div>
          {PAGES.map((p) => (
            <a key={p.href} href={p.href} className="footer-link"><Roll>{p.label}</Roll></a>
          ))}
          <a className="footer-link is-accent" href={site.resumeUrl}><Roll>Résumé</Roll></a>
        </nav>

        <div className="footer-col is-right">
          <div className="text-eyebrow">Follow on</div>
          <SocialLinks className="footer-socials" />
        </div>

        <div className="footer-strip" aria-hidden="true">
          <Marquee words={site.stack} size="md" variant="plain" />
        </div>

        <a className="btn-w footer-cta" href={`mailto:${site.email}`}>
          <span className="btn-text"><Roll>{site.footer.cta}</Roll></span>
          <span className="btn-arrow"><Arrow /></span>
        </a>
      </div>

      <div className="footer-bar">
        <span>© {new Date().getFullYear()} {site.firstName} {site.lastName}. All rights reserved</span>
        <span className="footer-bar-links">
          <a href={`mailto:${site.email}`}><Roll>{site.email}</Roll></a>
          <a href="#top"><Roll>Back to top</Roll></a>
        </span>
      </div>
    </footer>
  );
}
