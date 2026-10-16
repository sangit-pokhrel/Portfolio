import { site } from "@/content/site";
import { cardSrc } from "@/lib/images";
import { signatureStrokes } from "@/lib/signature";
import Marquee from "../Marquee";

/* Lando's "Message from Lando": pinned dark screen, two endless rows of the message
   behind a tinted photo card, and an accent-colour signature written on top as you scroll. */
export default function Signature() {
  const words = site.message.text.replace(/\.$/, "").split(/\s+/);
  const half = Math.ceil(words.length / 2);
  const rowA = words.slice(0, half).join(" ");
  const rowB = words.slice(half).join(" ");
  const photo = cardSrc();

  return (
    <section className="sig-track" data-sig aria-label={site.message.eyebrow}>
      <div className="sig">
        <div className="sig-eyebrow text-eyebrow">{site.message.eyebrow}</div>
        <p className="sr-only">{site.message.text}</p>
        <div className="sig-rows" aria-hidden="true">
          <Marquee words={[rowA]} variant="serif" stars={false} />
          <Marquee words={[rowB]} variant="heavy" stars={false} reverse />
        </div>
        <div className="sig-card" data-sig-card>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {photo && <img src={photo} alt="" />}
        </div>
        <svg className="sig-pen" viewBox="0 0 1000 600" aria-hidden="true">
          {signatureStrokes().map((d, i) => <path d={d} key={i} data-sig-path />)}
        </svg>
      </div>
    </section>
  );
}
