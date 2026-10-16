import { site } from "@/content/site";
import { listImages } from "@/lib/images";
import HL from "../HL";
import { Arrow, Media, Roll } from "../ui";

const SPEEDS = [0.25, -0.2, 0.35, -0.3];

export default function Featured() {
  const f = site.featured;
  const images = listImages("featured");
  const slots = Array.from({ length: 4 }, (_, i) => images[i]);
  return (
    <section className="s featured" data-theme-nav="dark">
      <div className="featured-imgs">
        {slots.map((src, i) => (
          <div className="f-img" data-speed={SPEEDS[i % 4]} key={i}><Media src={src} seed={`f${i}`} /></div>
        ))}
      </div>
      <div className="c featured-inner">
        <HL className="text-eyebrow is-large">{f.eyebrow}</HL>
        <HL as="h2" className="text-impact-lg">{f.title}</HL>
        <HL as="p" className="text-body">{f.text}</HL>
        <a className="btn-w" href={f.url}>
          <span className="btn-text"><Roll>{f.cta}</Roll></span>
          <span className="btn-arrow"><Arrow /></span>
        </a>
      </div>
      <div className="featured-sticker" data-sticker><span>{f.sticker}</span></div>
    </section>
  );
}
