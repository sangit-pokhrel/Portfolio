import { site } from "@/content/site";
import HL from "../HL";
import Marquee from "../Marquee";

export default function Stack() {
  return (
    <section className="s stack" id="stack" data-theme-nav="dark">
      <div className="c">
        <div className="title-layout grid-main">
          <HL as="h2" className="text-title-lg">Stack</HL>
          <div className="title-para">
            <HL as="p" className="text-body">{site.stackIntro}</HL>
          </div>
        </div>
      </div>
      <Marquee words={site.stack} />
      <Marquee words={site.stack} variant="outline" reverse />
    </section>
  );
}
