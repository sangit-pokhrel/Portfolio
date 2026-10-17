"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "taped" | "playing" | "paused" | "ended" | "missing";
type Props = {
  src: string;
  avatar: string;
  available: boolean;
  text: { prompt: string; cta: string; playing: string; missing: string; ended: string };
};

/*
 * "Wanna hear my story? Unmute me": an avatar with its mouth taped shut and a CD behind it.
 * Click → the tape peels off, the CD spins and the recording plays; the mouth moves with
 * the loudness of the voice (Web Audio analyser). Click again to pause.
 */
export default function StoryWidget({ src, avatar, available, text }: Props) {
  const [phase, setPhase] = useState<Phase>("taped");
  const [bubble, setBubble] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mouthRef = useRef<SVGGElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
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
      if (mouthRef.current) mouthRef.current.style.transform = "";
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
      if (mouthRef.current) mouthRef.current.style.transform = `translateY(${-level * 3}px) scale(${1 + level * 0.07})`;
      if (btnRef.current) btnRef.current.style.setProperty("--talk", String(level));
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
        ref={btnRef}
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
            {/* your photo: bounces with the loudness of the voice while playing */}
            <g className="av-photo" ref={mouthRef}>
              <image href={avatar} x="0" y="0" width="120" height="120" preserveAspectRatio="xMidYMid slice" />
            </g>
            {/* tape over the mouth: peels off when unmuted */}
            <g className="av-tape">
              <rect x="27" y="70" width="30" height="8" rx="1" transform="rotate(-14 42 74)" />
              <rect x="27" y="70" width="30" height="8" rx="1" transform="rotate(10 42 74)" />
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
