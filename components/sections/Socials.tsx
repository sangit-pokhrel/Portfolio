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
        {cards.map((src, i) => (
          <div className="s-card" key={i}><Media src={src} seed={`c${i}`} /></div>
        ))}
      </div>
      <div className="socials-foot">
        <HL className="text-cta font-brier">Find me online</HL>
        <SocialLinks className="socials-links" />
      </div>
    </section>
  );
}
