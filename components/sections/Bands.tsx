import { site } from "@/content/site";
import Marquee from "../Marquee";

/* Extra scroll-reactive text bands placed between sections. Words live in content/site.ts → bands. */

/** Accent-colour tape across the page. */
export function TapeBand() {
  return (
    <div className="band band-tape" data-theme-nav="dark">
      <Marquee words={site.bands.tape} variant="accent" size="md" tilt={-2.5} />
    </div>
  );
}

/** Two bands crossing in an X, moving opposite ways (between projects and "let's build"). */
export function CrossBands() {
  return (
    <div className="band band-cross" data-theme-nav="dark">
      <Marquee words={site.bands.crossA} variant="dark" size="md" tilt={3} />
      <Marquee words={site.bands.crossB} variant="accent" size="md" tilt={-3} reverse />
    </div>
  );
}

/** Big outlined band before the footer. */
export function OutroBand() {
  return (
    <div className="band band-outro" data-theme-nav="dark">
      <Marquee words={site.bands.outro} variant="outline" />
    </div>
  );
}
