import { site } from "@/content/site";
import { portraitSrc } from "@/lib/images";
import PortraitCanvas from "../PortraitCanvas";
import PortraitImage from "../PortraitImage";
import HeroWater from "../HeroWater";

export default function Hero() {
  const src = portraitSrc();
  return (
    <div className="sticky-track hero-track" data-theme-nav="dark">
      <section className="hero">
        <h1 className="hero-name" aria-label={`${site.firstName} ${site.lastName}`}>
          <span className="hero-name-line"><span>{site.firstName}</span></span>
          <span className="hero-name-line is-outline"><span>{site.lastName}</span></span>
        </h1>
        <HeroWater />
        {src && site.portrait.mode === "2d" && (
          <PortraitImage src={src} alt={`${site.firstName} ${site.lastName}`} removeBackground={site.portrait.removeBackground} />
        )}
        {src && site.portrait.mode === "3d" && (
          <PortraitCanvas
            src={src}
            removeBackground={site.portrait.removeBackground}
            face={site.portrait.face}
            turn={site.portrait.turn}
          />
        )}

        <div className="hero-role text-eyebrow" data-hero-fade>
          {site.role} — {site.location}
        </div>

        <a className="hero-widget" href={site.currently.url} data-hero-fade>
          <span className="hero-widget-tab text-eyebrow">{site.currently.label}</span>
          <span className="hero-widget-eq" aria-hidden="true"><i /><i /><i /><i /><i /></span>
          <span className="text-eyebrow">{site.currently.title}</span>
          <span className="text-eyebrow is-dim">{site.currently.sub}</span>
          <span className="hero-widget-line" />
          <span className="hero-widget-vinyl" aria-hidden="true" />
          <span className="text-eyebrow">{site.since}</span>
        </a>

      </section>
    </div>
  );
}
