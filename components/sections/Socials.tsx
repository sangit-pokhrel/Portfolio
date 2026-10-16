import { site } from "@/content/site";
import { listImages } from "@/lib/images";
import HL from "../HL";
import { Media, Roll } from "../ui";

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      {site.socials.map((s) => (
        <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">
          <span className="btn-text"><Roll>{s.name}</Roll></span>
        </a>
      ))}
    </div>
  );
}

export default function Socials() {
  const found = listImages("cards");
  const cards: (string | undefined)[] = found.length ? found.slice(0, 9) : Array.from({ length: 7 }, () => undefined);
  return (
    <section className="s socials" data-theme-nav="dark">
      <h2 className="text-title-lg socials-title">
        <HL as="span">Follow</HL>
        <span className="socials-oval" data-oval />
        <HL as="span">Along</HL>
      </h2>
      <div className="socials-cards" data-cards>
        {cards.map((src, i) => {
          const s = site.socials[i % site.socials.length];
          const mid = (cards.length - 1) / 2;
          return (
            <a className="s-card" key={i} href={s.url} target="_blank" rel="noopener noreferrer"
              aria-label={`${s.name} (opens in a new tab)`}
              style={{ ["--unrot" as string]: `${-(i - mid) * 7}deg` }}>
              <div className="s-card-in">
                <Media src={src} seed={`c${i}`} />
                <span className="s-card-label"><span className="btn-text">{s.name}</span><span aria-hidden="true">↗</span></span>
              </div>
            </a>
          );
        })}
      </div>
      <div className="socials-foot">
        <HL className="text-cta font-brier">Find me online</HL>
        <SocialLinks className="socials-links" />
      </div>
    </section>
  );
}
