import { site } from "@/content/site";

/*
 * Splash: "compiling a track". An audio waveform whose bars are columns of code,
 * a playhead that sweeps as the site loads (bars light up behind it), a track timer,
 * and a terminal line. On finish the waveform collapses to a line, a play button pops,
 * and the curtain lifts. Motion lives in <Experience />.
 */
const BARS = 56;
const TOKENS = ["<", "/", ">", "{", "}", ";", "=", ">", "0", "1", "(", ")", "[", "]", "&", "$", "#", "*", "+", "~"];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

export const LOADER_TERM = `> npm run build --track ${site.firstName.toLowerCase()}.wav`;
export const LOADER_DONE = "✓ compiled · now playing";

export default function Loader() {
  const r = rng(2019);
  const bars = Array.from({ length: BARS }, (_, i) => {
    const x = i / (BARS - 1);
    // a loose "song" envelope: quiet intro, a peak, a drop, a final swell
    const env = 0.3 + 0.7 * Math.abs(Math.sin(x * Math.PI * 1.6 + 0.4)) * (0.55 + 0.45 * Math.sin(x * Math.PI));
    const hi = Math.round((22 + 78 * env * (0.6 + r() * 0.4)) * 10) / 10;
    const lo = Math.round(Math.max(6, hi * (0.18 + r() * 0.25)) * 10) / 10;
    const code = Array.from({ length: 28 }, () => TOKENS[Math.floor(r() * TOKENS.length)]).join("");
    return { hi, lo, dur: Math.round((0.7 + r() * 0.9) * 100) / 100, delay: -Math.round(r() * 150) / 100, code };
  });

  return (
    <div className="loader" data-loader aria-hidden="true">
      <div className="loader-inner">
        <div className="loader-top">
          <span className="text-eyebrow">Side A · {site.firstName.toLowerCase()}.wav</span>
          <span className="text-eyebrow loader-role">{site.role}</span>
        </div>

        <div className="loader-wave">
          <div className="loader-bars" data-loader-bars>
            {bars.map((b, i) => (
              <span
                className="lw-bar" key={i}
                style={{ ["--hi" as string]: `${b.hi}%`, ["--lo" as string]: `${b.lo}%`, ["--d" as string]: `${b.dur}s`, ["--dl" as string]: `${b.delay}s` }}
              >
                <span className="lw-code">{b.code}</span>
              </span>
            ))}
          </div>
          <span className="loader-head" data-loader-head />
        </div>

        <div className="loader-meta">
          <span className="loader-term"><span data-loader-term /><i className="loader-caret" /></span>
          <span className="loader-time"><span data-loader-time>0:00</span> / 1:00</span>
        </div>

        <div className="loader-play" data-loader-play>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
        </div>
      </div>
    </div>
  );
}
