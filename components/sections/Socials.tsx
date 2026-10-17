import { site } from "@/content/site";
import HL from "../HL";
import { Roll } from "../ui";
import SocialCards from "./SocialCards";

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
  return (
    <section className="s socials" data-theme-nav="dark">
      <h2 className="text-title-lg socials-title">
        <HL as="span">Follow</HL>
        <span className="socials-oval" data-oval />
        <HL as="span">Along</HL>
      </h2>
      <SocialCards />
      <div className="socials-foot">
        <HL className="text-cta font-brier">Find me online</HL>
        <SocialLinks className="socials-links" />
      </div>
    </section>
  );
}
