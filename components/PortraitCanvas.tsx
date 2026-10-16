"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { heroGL } from "@/lib/smooth";
import { analysePortrait } from "@/lib/portrait";
import { portraitVertex, portraitFragment } from "@/lib/shaders";

type Props = {
  src: string;
  removeBackground: boolean;
  face: { x: number; y: number; radius: number };
  turn: number;
};

/* Hero portrait: one photo, rendered with a depth map so the head turns to
   follow the cursor. Hovering the head opens a halftone "alter ego" lens
   (the reference reveals the helmet the same way). */
export default function PortraitCanvas({ src, removeBackground, face, turn }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    let disposed = false;
    let cleanup = () => {};

    const img = new Image();
    img.decoding = "async";
    img.src = src;
    img.onload = () => {
      if (disposed) return;
      cleanup = start(img);
    };

    function start(img: HTMLImageElement) {
      const data = analysePortrait(img, { removeBackground, face });
      const { bounds } = data;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(dpr);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.z = 10;

      const colorTex = new THREE.Texture(img);
      colorTex.colorSpace = THREE.SRGBColorSpace;
      colorTex.minFilter = THREE.LinearMipmapLinearFilter;
      colorTex.anisotropy = 4;
      colorTex.needsUpdate = true;
      const dataTex = new THREE.DataTexture(data.pixels, data.size[0], data.size[1], THREE.RGBAFormat);
      dataTex.minFilter = dataTex.magFilter = THREE.LinearFilter;
      dataTex.needsUpdate = true;

      const uniforms = {
        uColor: { value: colorTex },
        uData: { value: dataTex },
        uCrop: { value: new THREE.Vector4(bounds.x0, bounds.y0, bounds.x1 - bounds.x0, bounds.y1 - bounds.y0) },
        uRelief: { value: 0.35 },
        uLook: { value: new THREE.Vector2() },
        uParallax: { value: 0.02 * turn },
        uLens: { value: new THREE.Vector2(-999, -999) },
        uLensR: { value: 0 },
        uDot: { value: 7 * dpr },
        uIntro: { value: 0 },
        uDark: { value: new THREE.Color("#1e1531") },
        uAccent: { value: new THREE.Color("#b57bff") },
      };
      const material = new THREE.ShaderMaterial({
        uniforms, vertexShader: portraitVertex, fragmentShader: portraitFragment, transparent: true,
      });
      const subjectAspect = ((bounds.x1 - bounds.x0) * img.naturalWidth) / ((bounds.y1 - bounds.y0) * img.naturalHeight);
      const geometry = new THREE.PlaneGeometry(subjectAspect, 1, 96, Math.round(96 / subjectAspect));
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Layout: portrait fills most of the height, bottom cropped by the viewport (like the reference)
      let viewH = 1, viewW = 1, plane = 1;
      const layout = () => {
        const w = mount.clientWidth, h = mount.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        viewH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        viewW = viewH * camera.aspect;
        plane = Math.min(viewH * 0.98, (viewW * 1.05) / subjectAspect);
        mesh.scale.setScalar(plane);
      };
      layout();

      const touch = window.matchMedia("(hover: none)").matches;
      const pointer = { x: window.innerWidth / 2, y: window.innerHeight * 0.3, active: false };
      const look = new THREE.Vector2();
      let lensTarget = 0, lensR = 0, scrollProgress = 0, visible = true, raf = 0;

      const onMove = (e: PointerEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; };
      const onLeave = () => { pointer.active = false; };
      // Touch: tap the portrait to toggle the lens (the reference's "tap to lock")
      let locked = false;
      const onTap = () => { if (touch) locked = !locked; };

      window.addEventListener("resize", layout);
      window.addEventListener("pointermove", onMove);
      document.addEventListener("pointerleave", onLeave);
      mount.addEventListener("click", onTap);
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(mount);

      const headScreen = new THREE.Vector3();
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        const rect = mount.getBoundingClientRect();

        // position: bottom-aligned, lifted & shrunk on scroll
        const s = 1 - scrollProgress * 0.25;
        mesh.scale.setScalar(plane * s);
        mesh.position.y = -viewH / 2 + (plane * s) / 2 - viewH * 0.02 + scrollProgress * viewH * 0.12;

        // where is the face on screen?
        const fu = (face.x - bounds.x0) / (bounds.x1 - bounds.x0);
        const fv = (1 - face.y - bounds.y0) / (bounds.y1 - bounds.y0);
        headScreen.set((fu - 0.5) * subjectAspect, fv - 0.5, 0).multiply(mesh.scale).add(mesh.position).project(camera);
        const hx = rect.left + ((headScreen.x + 1) / 2) * rect.width;
        const hy = rect.top + ((1 - headScreen.y) / 2) * rect.height;

        // look towards the cursor (eases back to centre when the pointer leaves)
        const tx = pointer.active ? gsap.utils.clamp(-1, 1, (pointer.x - hx) / (rect.width * 0.45)) : 0;
        const ty = pointer.active ? gsap.utils.clamp(-1, 1, (hy - pointer.y) / (rect.height * 0.45)) : 0;
        look.x += (tx - look.x) * 0.08;
        look.y += (ty * 0.6 - look.y) * 0.08;
        uniforms.uLook.value.copy(look);
        mesh.rotation.y = look.x * 0.22;
        mesh.rotation.x = -look.y * 0.12;

        // lens: open while the cursor is over the person
        const lx = pointer.x - rect.left, ly = pointer.y - rect.top;
        if (!touch) {
          const ndc = new THREE.Vector3((lx / rect.width) * 2 - 1, 1 - (ly / rect.height) * 2, 0.5).unproject(camera);
          const dir = ndc.sub(camera.position).normalize();
          const t = (mesh.position.z - camera.position.z) / dir.z;
          const hit = camera.position.clone().add(dir.multiplyScalar(t));
          const u = (hit.x - mesh.position.x) / (subjectAspect * mesh.scale.x) + 0.5;
          const v = (hit.y - mesh.position.y) / mesh.scale.y + 0.5;
          const over = u > 0 && u < 1 && v > 0 && v < 1 &&
            data.maskAt(bounds.x0 + u * (bounds.x1 - bounds.x0), bounds.y0 + v * (bounds.y1 - bounds.y0)) > 0.5;
          lensTarget = pointer.active && over ? 1 : 0;
        } else {
          lensTarget = locked ? 1 : 0;
        }
        lensR += (lensTarget - lensR) * 0.12;
        const lensPx = Math.min(rect.width, rect.height) * 0.17 * dpr;
        uniforms.uLensR.value = lensR * lensPx;
        uniforms.uLens.value.set(
          (touch ? hx - rect.left : lx) * dpr,
          (rect.height - (touch ? hy - rect.top : ly)) * dpr
        );

        renderer.render(scene, camera);
      };
      tick();

      heroGL.intro = () => { gsap.to(uniforms.uIntro, { value: 1, duration: 1.8, ease: "expo.out" }); };
      heroGL.setProgress = (p) => { scrollProgress = p; };
      if (heroGL.introRequested) heroGL.intro();

      return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", layout);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onLeave);
        mount.removeEventListener("click", onTap);
        delete heroGL.intro;
        delete heroGL.setProgress;
        geometry.dispose(); material.dispose(); colorTex.dispose(); dataTex.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    return () => { disposed = true; cleanup(); };
  }, [src, removeBackground, face, turn]);

  return <div className="hero-gl" ref={mountRef} />;
}
