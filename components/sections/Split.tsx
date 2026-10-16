import { site } from "@/content/site";
import HL from "../HL";
import { Art, Arrow } from "../ui";

export default function Split() {
  const { left, right } = site.split;
  return (
    <div className="sticky-track split-track" data-theme-nav="dark">
      <section className="split">
        <div className="split-half is-left" data-split-left>
          <h2 className="split-title">
            <HL as="span" className="font-brier">{left.top}</HL>
            <HL as="span" className="font-mona">{left.bottom}</HL>
          </h2>
          <HL as="p" className="text-body">{left.text}</HL>
          <a className="btn-round" href={left.url} aria-label={`${left.top} ${left.bottom}`}><Arrow /></a>
        </div>
        <div className="split-half is-right" data-split-right>
          <h2 className="split-title">
            <HL as="span" className="font-brier" dir="left">{right.top}</HL>
            <HL as="span" className="font-mona" dir="left">{right.bottom}</HL>
          </h2>
          <HL as="p" className="text-body" dir="left">{right.text}</HL>
          <a className="btn-round" href={right.url} aria-label={`${right.top} ${right.bottom}`}><Arrow /></a>
        </div>
        <div className="split-center">
          <div className="split-orb"><Art seed="orb" /></div>
        </div>
      </section>
    </div>
  );
}
