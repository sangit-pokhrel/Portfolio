import { site } from "@/content/site";

/* "SANGIT aka MUSIC" lockup: serif name, green handwritten "aka", heavy MUSIC,
   a live purple sound-wave + play button, a flowing line, a leaf and a floating note. */
export default function Logo() {
  return (
    <span className="logo" aria-hidden="true">
      <svg className="logo-swoosh" viewBox="0 0 240 70" preserveAspectRatio="none">
        <path d="M2 44 C 40 18, 70 62, 112 40 S 180 12, 238 30" />
      </svg>
      <svg className="logo-leaf" viewBox="0 0 24 24">
        <path d="M3 21 C 4 11, 11 4, 21 3 C 20 13, 13 20, 3 21 Z" />
        <path className="logo-leaf-vein" d="M4 20 L 18 6" />
      </svg>
      <span className="logo-top">{site.logo.top}</span>
      <span className="logo-bottom">
        <em className="logo-aka">{site.logo.aka}</em>
        <span className="logo-music">{site.logo.bottom}</span>
        <span className="logo-wave"><i /><i /><i /><i /><i /><i /><i /></span>
        <span className="logo-play"><svg viewBox="0 0 10 10"><path d="M3.5 2.5 L7.5 5 L3.5 7.5 Z" /></svg></span>
      </span>
      <span className="logo-note">♪</span>
    </span>
  );
}
