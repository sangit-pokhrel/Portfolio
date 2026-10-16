import { site } from "@/content/site";

/* Big statement headline (the reference's "…legacy in Formula 1, on and off the track.").
   Words rise into place on scroll (<Experience /> animates [data-words]). */
export default function Legacy() {
  let i = 0;
  return (
    <section className="legacy">
      <h2 className="legacy-title" data-words>
        {site.legacy.map((part, pi) =>
          part.text.split(/\s+/).map((w) => (
            <span className={`lw${part.accent ? " is-accent" : ""}`} key={`${pi}-${i++}`}>
              <span>{w}</span>
            </span>
          ))
        )}
      </h2>
    </section>
  );
}
