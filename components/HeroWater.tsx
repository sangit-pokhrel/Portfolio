"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { fullscreenVertex, simFragment, waterFragment } from "@/lib/water";

/*
 * Glassy / watery mouse effect over the hero name.
 * The DOM <h1> stays for layout, SEO and the intro/scroll animations (GSAP drives it);
 * this canvas re-draws the name in WebGL, reading the h1's positions and GSAP values,
 * so the letters can be refracted by a real ripple simulation that follows the cursor.
 */
// true = re-draw the name in WebGL so the ripples bend the letters; false = ripples over the real text
const DRAW_TEXT = false;

export default function HeroWater() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const hero = mount.closest(".hero") as HTMLElement;
    const h1 = hero.querySelector<HTMLElement>(".hero-name")!;
    const lines = [...h1.querySelectorAll<HTMLElement>(".hero-name-line")];
    const spans = lines.map((l) => l.querySelector<HTMLElement>("span")!);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, premultipliedAlpha: false });
    } catch {
      return; // no WebGL: the plain DOM name stays visible
    }
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(dpr);
    mount.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = new THREE.PlaneGeometry(2, 2);

    // --- ripple simulation (small, ping-pong) ---
    const SIM_W = 256;
    let simH = 160;
    const rtOpts = { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false };
    let rtA = new THREE.WebGLRenderTarget(SIM_W, simH, rtOpts);
    let rtB = new THREE.WebGLRenderTarget(SIM_W, simH, rtOpts);
    const simMat = new THREE.ShaderMaterial({
      vertexShader: fullscreenVertex, fragmentShader: simFragment,
      uniforms: {
        uPrev: { value: rtA.texture }, uTexel: { value: new THREE.Vector2(1 / SIM_W, 1 / simH) },
        uDrop: { value: new THREE.Vector3(-1, -1, 0) }, uRadius: { value: 0.035 }, uAspect: { value: 1 },
      },
    });
    const simScene = new THREE.Scene();
    simScene.add(new THREE.Mesh(quad, simMat));

    // --- text texture (redrawn only on layout changes) ---
    const textCanvas = document.createElement("canvas");
    const tg = textCanvas.getContext("2d")!;
    const textTex = new THREE.CanvasTexture(textCanvas);
    textTex.colorSpace = THREE.SRGBColorSpace;

    const uniforms = {
      uText: { value: textTex }, uSim: { value: rtA.texture },
      uRes: { value: new THREE.Vector2(1, 1) }, uSimTexel: { value: new THREE.Vector2(1 / SIM_W, 1 / simH) },
      uLine1: { value: new THREE.Vector4() }, uLine2: { value: new THREE.Vector4() },
      uOff1: { value: 0 }, uOff2: { value: 0 }, uScroll: { value: 0 }, uFade: { value: 1 },
      uTime: { value: 0 }, uDpr: { value: dpr }, uTint: { value: new THREE.Color("#b9a3e6") },
    };
    const mat = new THREE.ShaderMaterial({ vertexShader: fullscreenVertex, fragmentShader: waterFragment, uniforms, transparent: true });
    const scene = new THREE.Scene();
    scene.add(new THREE.Mesh(quad, mat));

    const heights = [0, 0];
    let ready = false;
    let h1Height = 1;

    // Measure the DOM name and draw it into the texture at its resting position
    const layout = () => {
      const W = hero.clientWidth, H = hero.clientHeight;
      renderer.setSize(W, H, false);
      const bw = Math.round(W * dpr), bh = Math.round(H * dpr);
      uniforms.uRes.value.set(bw, bh);
      textCanvas.width = bw; textCanvas.height = bh;
      simH = Math.max(32, Math.round(SIM_W * (H / W)));
      rtA.setSize(SIM_W, simH); rtB.setSize(SIM_W, simH);
      simMat.uniforms.uTexel.value.set(1 / SIM_W, 1 / simH);
      uniforms.uSimTexel.value.set(1 / SIM_W, 1 / simH);
      simMat.uniforms.uAspect.value = W / H;

      const hr = hero.getBoundingClientRect();
      const cs = getComputedStyle(hero);
      const fill = cs.getPropertyValue("--name-fill").trim() || "#ebe5f3";
      const stroke = cs.getPropertyValue("--name-stroke").trim() || "#d3c8e2";
      const family = getComputedStyle(h1).fontFamily;
      h1Height = h1.offsetHeight || 1;
      tg.clearRect(0, 0, bw, bh);

      lines.forEach((line, i) => {
        const lr = line.getBoundingClientRect();
        const ls = getComputedStyle(line);
        const size = parseFloat(ls.fontSize);
        const lh = spans[i].offsetHeight;
        heights[i] = lh;
        // rect where this line may appear (its overflow:hidden box), relative to the hero
        const rect = new THREE.Vector4((lr.left - hr.left) * dpr, (lr.top - hr.top) * dpr, lr.width * dpr, lr.height * dpr);
        // GSAP moves the whole h1 on scroll; measure at rest
        const scrollPx = ((gsap.getProperty(h1, "yPercent") as number) / 100) * h1Height;
        rect.y -= scrollPx * dpr;
        (i === 0 ? uniforms.uLine1 : uniforms.uLine2).value.copy(rect);

        if (!DRAW_TEXT) return; // keep the real DOM lettering; only the glassy ripples are drawn
        tg.save();
        tg.font = `800 ${size * dpr}px ${family}`;
        (tg as CanvasRenderingContext2D & { fontStretch: string }).fontStretch = "semi-condensed";
        (tg as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${-0.04 * size * dpr}px`;
        tg.textAlign = "center";
        tg.textBaseline = "alphabetic";
        const m = tg.measureText(spans[i].textContent ?? "");
        const asc = m.fontBoundingBoxAscent, desc = m.fontBoundingBoxDescent;
        const baseline = rect.y + (lh * dpr - (asc + desc)) / 2 + asc;
        const cx = rect.x + rect.z / 2;
        const text = (spans[i].textContent ?? "").toUpperCase();
        if (line.classList.contains("is-serif")) {
          tg.lineWidth = 2 * dpr; tg.strokeStyle = stroke; tg.strokeText(text, cx, baseline);
        } else {
          tg.fillStyle = fill; tg.fillText(text, cx, baseline);
        }
        tg.restore();
      });
      textTex.needsUpdate = true;
      ready = true;
      if (DRAW_TEXT) hero.classList.add("is-water");
    };

    // Pointer → drops into the simulation (stronger when moving faster)
    const pointer = { x: -1, y: -1, speed: 0, inside: false };
    let lastX = 0, lastY = 0;
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height;
      pointer.inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      pointer.speed = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      lastX = e.clientX; lastY = e.clientY;
      pointer.x = x; pointer.y = y;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("hero:layout", layout);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(hero);

    let raf = 0;
    const clock = new THREE.Timer();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || !ready) return;
      clock.update();
      uniforms.uTime.value = clock.getElapsed();

      // read GSAP-driven values (cached by GSAP, no layout reads)
      uniforms.uOff1.value = ((gsap.getProperty(spans[0], "yPercent") as number) / 100) * heights[0] * dpr;
      uniforms.uOff2.value = ((gsap.getProperty(spans[1], "yPercent") as number) / 100) * heights[1] * dpr;
      uniforms.uScroll.value = ((gsap.getProperty(h1, "yPercent") as number) / 100) * h1Height * dpr;
      uniforms.uFade.value = gsap.getProperty(h1, "opacity") as number;

      // two simulation steps per frame for lively waves
      for (let s = 0; s < 2; s++) {
        const strength = pointer.inside ? Math.min(pointer.speed * 0.006, 0.42) + 0.01 : 0;
        simMat.uniforms.uDrop.value.set(pointer.x, pointer.y, s === 0 ? strength : 0);
        simMat.uniforms.uPrev.value = rtA.texture;
        renderer.setRenderTarget(rtB);
        renderer.render(simScene, camera);
        [rtA, rtB] = [rtB, rtA];
      }
      pointer.speed *= 0.6;
      renderer.setRenderTarget(null);
      uniforms.uSim.value = rtA.texture;
      renderer.render(scene, camera);
    };
    tick();
    // if the name was already sized before this mounted (e.g. hot reload), lay out now
    if (hero.dataset.fitted) layout();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("hero:layout", layout);
      hero.classList.remove("is-water");
      clock.dispose();
      rtA.dispose(); rtB.dispose(); textTex.dispose(); simMat.dispose(); mat.dispose(); quad.dispose();
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return <div className="hero-water" ref={mountRef} aria-hidden="true" />;
}
