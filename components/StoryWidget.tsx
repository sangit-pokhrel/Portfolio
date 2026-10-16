"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "taped" | "playing" | "paused" | "ended" | "missing";
type Props = {
  src: string;
  available: boolean;
  text: { prompt: string; cta: string; playing: string; missing: string; ended: string };
};

/*
 * "Wanna hear my story? Unmute me": an avatar with its mouth taped shut and a CD behind it.
 * Click → the tape peels off, the CD spins and the recording plays; the mouth moves with
 * the loudness of the voice (Web Audio analyser). Click again to pause.
 */
export default function StoryWidget({ src, available, text }: Props) {
  const [phase, setPhase] = useState<Phase>("taped");
  const [bubble, setBubble] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mouthRef = useRef<SVGEllipseElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const graph = useRef<{ ctx: AudioContext; analyser: AnalyserNode; data: Uint8Array<ArrayBuffer> } | null>(null);

  // Show the invitation once the intro has finished
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const wait = setInterval(() => {
      if (!document.body.classList.contains("is-loading")) {
        clearInterval(wait);
        t = setTimeout(() => {
          setBubble(true);
          // tuck the invitation away after a few seconds so it doesn't cover the page
          t = setTimeout(() => setBubble((b) => (document.querySelector(".story.is-taped") ? false : b)), 6500);
        }, 2500);
      }
    }, 300);
    return () => { clearInterval(wait); clearTimeout(t); };
  }, []);

  // Mouth follows the voice; ring shows progress
  useEffect(() => {
    if (phase !== "playing") {
      if (mouthRef.current) mouthRef.current.style.transform = "scaleY(.25)";
      return;
    }
    let raf = 0;
    let level = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const g = graph.current, a = audioRef.current;
      if (g) {
        g.analyser.getByteTimeDomainData(g.data);
        let sum = 0;
        for (let i = 0; i < g.data.length; i++) { const v = (g.data[i] - 128) / 128; sum += v * v; }
        const rms = Math.sqrt(sum / g.data.length);
        level += (Math.min(1, rms * 6) - level) * 0.35;
      }
      if (mouthRef.current) mouthRef.current.style.transform = `scaleY(${0.25 + level * 1.6})`;
      if (ringRef.current && a && a.duration) ringRef.current.style.strokeDashoffset = String(1 - a.currentTime / a.duration);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const toggle = async () => {
    const a = audioRef.current!;
    if (!available) { setPhase("missing"); setBubble(true); return; }
    if (phase === "playing") { a.pause(); return; }
    if (!graph.current) {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      ctx.createMediaElementSource(a).connect(analyser);
      analyser.connect(ctx.destination);
      graph.current = { ctx, analyser, data: new Uint8Array(new ArrayBuffer(analyser.fftSize)) };
    }
    await graph.current.ctx.resume();
    if (phase === "ended") a.currentTime = 0;
    try { await a.play(); } catch { setPhase("missing"); setBubble(true); }
  };

  const label =
    phase === "playing" ? text.playing :
    phase === "missing" ? text.missing :
    phase === "ended" ? text.ended :
    phase === "paused" ? "Paused — tap to continue" : text.prompt;

  return (
    <div className={`story is-${phase}`} data-story>
      <div className={`story-bubble${bubble ? " is-on" : ""}`} aria-live="polite">
        <span>{label}</span>
        {phase === "taped" && <strong>{text.cta}</strong>}
      </div>

      <button
        className="story-btn"
        onClick={toggle}
        aria-pressed={phase === "playing"}
        aria-label={phase === "playing" ? "Pause my story" : `${text.prompt} ${text.cta}`}
      >
        <span className="story-cd" aria-hidden="true" />
        <svg className="story-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="48" pathLength={1} ref={ringRef} />
        </svg>
        <svg className="story-avatar" viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <clipPath id="story-clip"><circle cx="60" cy="60" r="56" /></clipPath>
          </defs>
          <g clipPath="url(#story-clip)">
            <circle cx="60" cy="60" r="56" className="av-bg" />
            {/* shoulders + checked shirt */}
            <path d="M14 122 C18 100 36 92 60 92 C84 92 102 100 106 122 Z" className="av-shirt" />
            <path d="M48 92 L60 112 L72 92" className="av-collar" />
            {/* head */}
            <ellipse cx="60" cy="58" rx="25" ry="29" className="av-skin" />
            <rect x="52" y="80" width="16" height="14" className="av-skin" />
            {/* beard */}
            <path d="M36 62 C38 84 50 91 60 91 C70 91 82 84 84 62 C80 76 71 81 60 81 C49 81 40 76 36 62 Z" className="av-hair" />
            {/* hair */}
            <path d="M33 54 C29 30 47 18 63 19 C80 20 93 31 88 55 C85 42 76 35 63 36 C51 37 41 42 33 54 Z" className="av-hair" />
            {/* glasses */}
            <rect x="39" y="49" width="17" height="12" rx="4" className="av-glasses" />
            <rect x="64" y="49" width="17" height="12" rx="4" className="av-glasses" />
            <path d="M56 54 L64 54" className="av-glasses" />
            <g className="av-eyes">
              <circle cx="47.5" cy="55" r="2" />
              <circle cx="72.5" cy="55" r="2" />
            </g>
            {/* mouth: moves with the voice */}
            <ellipse cx="60" cy="74" rx="7" ry="4.5" className="av-mouth" ref={mouthRef} />
            {/* tape: peels off when unmuted */}
            <g className="av-tape">
              <rect x="44" y="69" width="32" height="9" rx="1" transform="rotate(-12 60 73.5)" />
              <rect x="44" y="69" width="32" height="9" rx="1" transform="rotate(12 60 73.5)" />
            </g>
          </g>
        </svg>
      </button>

      <audio
        ref={audioRef}
        src={available ? src : undefined}
        preload="none"
        onPlay={() => { setPhase("playing"); setBubble(true); }}
        onPause={() => setPhase((p) => (p === "playing" ? "paused" : p))}
        onEnded={() => setPhase("ended")}
        onError={() => { if (available) setPhase("missing"); }}
      />
    </div>
  );
}
