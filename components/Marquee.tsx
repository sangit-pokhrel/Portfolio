/* Scroll-reactive text band: drifts constantly, speeds up with scroll velocity and
   flips direction when you scroll back up. Motion lives in <Experience /> ([data-marquee]). */

function Star() {
  return (
    <svg className="marquee-dot" viewBox="0 0 40 40" aria-hidden="true">
      <path fill="currentColor" d="M20 0c2 11 9 18 20 20-11 2-18 9-20 20-2-11-9-18-20-20C11 18 18 11 20 0z" />
    </svg>
  );
}

type Props = {
  words: string[];
  /** visual style */
  variant?: "plain" | "outline" | "accent" | "dark" | "serif" | "heavy";
  /** show the ✦ between items */
  stars?: boolean;
  size?: "lg" | "md";
  /** start moving the other way */
  reverse?: boolean;
  /** tilt in degrees (tape look) */
  tilt?: number;
  className?: string;
};

// Repeated so one list overflows wide screens; <Experience /> clones it once for a seamless loop.
const REPEAT = 3;

export default function Marquee({ words, variant = "plain", size = "lg", reverse, tilt = 0, stars = true, className = "" }: Props) {
  const items = Array.from({ length: REPEAT }, () => words).flat();
  return (
    <div
      className={`marquee is-${variant} is-${size} ${className}`}
      data-marquee
      data-dir={reverse ? -1 : 1}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
      role="marquee"
      aria-label={words.join(", ")}
    >
      <div className="marquee-list" data-marquee-list aria-hidden="true">
        {items.map((w, i) => (
          <span className="marquee-item" key={i}>{w}{stars && <Star />}</span>
        ))}
      </div>
    </div>
  );
}
