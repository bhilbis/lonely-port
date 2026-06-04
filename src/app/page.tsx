"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sky, Stars, Sparkles, Float } from "@react-three/drei";
import { useRef, useEffect, useMemo, useState, Suspense, useCallback } from "react";
import gsap from "gsap";
import * as THREE from "three";

// ─── Camera ───────────────────────────────────────────────────────────────────
function CameraRig({
  scroll,
  mouse,
}: {
  scroll: React.MutableRefObject<number>;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 2, 15);
    gsap.to(camera.position, { z: 8, duration: 3.0, ease: "power3.inOut", delay: 0.2 });
  }, [camera]);

  useFrame(() => {
    const tx = scroll.current * 22;
    const ty = 1.8 + mouse.current.y * 0.5;
    camera.position.x += (tx - camera.position.x) * 0.042;
    camera.position.y += (ty - camera.position.y) * 0.022;
  });

  return null;
}

// ─── Cloud puff ───────────────────────────────────────────────────────────────
const CLOUD_MAT = new THREE.MeshStandardMaterial({
  color: "#d8eeff",
  transparent: true,
  opacity: 0.58,
  roughness: 1,
  metalness: 0,
  depthWrite: false,
});

function CloudPuff({ pos, sc = 1, s = 1 }: { pos: [number,number,number]; sc?: number; s?: number }) {
  const offsets = useMemo<[number,number,number][]>(() => [
    [0, 0, 0],
    [-(0.9 + (s % 3) * 0.15), -0.3, 0.1],
    [(1.0 + (s % 2) * 0.25), -0.2, -0.1],
    [(s % 4) * 0.08, 0.8 + (s % 2) * 0.15, 0.2],
    [-0.3, 0.6, -0.3],
  ], [s]);

  const sizes = useMemo(() =>
    [1.2, 0.82, 0.95, 0.62, 0.68].map((v, i) => v + (s * (i + 1) % 3) * 0.04)
  , [s]);

  return (
    <Float speed={0.4 + (s % 5) * 0.08} floatIntensity={0.22} rotationIntensity={0}>
      <group position={pos} scale={sc}>
        {offsets.map((o, i) => (
          <mesh key={i} position={o} material={CLOUD_MAT}>
            <sphereGeometry args={[sizes[i], 11, 7]} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// ─── Crystal ─────────────────────────────────────────────────────────────────
function Crystal({ pos, sc = 1, col = "#88ccff", spd = 0.22 }: {
  pos: [number,number,number]; sc?: number; col?: string; spd?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: col, transparent: true, opacity: 0.68,
    roughness: 0.04, metalness: 0, transmission: 0.55,
    thickness: 1.5, ior: 1.45,
    clearcoat: 1, clearcoatRoughness: 0.05,
  }), [col]);

  useFrame((_, d) => {
    if (!ref.current) return;
    ref.current.rotation.y += d * spd;
    ref.current.rotation.z += d * spd * 0.45;
  });

  return (
    <Float speed={0.9 + spd} floatIntensity={0.32} rotationIntensity={0.1}>
      <mesh ref={ref} position={pos} scale={sc} material={mat}>
        <octahedronGeometry args={[1, 0]} />
      </mesh>
    </Float>
  );
}

// ─── Light ray ───────────────────────────────────────────────────────────────
function LightRay({ pos, rot, sc }: {
  pos: [number,number,number]; rot: [number,number,number]; sc: [number,number];
}) {
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#c8e8ff", transparent: true, opacity: 0.04,
    side: THREE.DoubleSide, depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);
  return (
    <mesh position={pos} rotation={rot} material={mat}>
      <planeGeometry args={[sc[0], sc[1]]} />
    </mesh>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({ scroll, mouse }: {
  scroll: React.MutableRefObject<number>;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  return (
    <>
      {/* @ts-expect-error – R3F fog primitive */}
      <fog attach="fog" color="#8ec8f0" near={35} far={95} />
      <CameraRig scroll={scroll} mouse={mouse} />

      <Sky distance={450000} sunPosition={[2, 0.08, -1.5]}
        turbidity={5} rayleigh={2.2}
        mieCoefficient={0.006} mieDirectionalG={0.88} />

      <ambientLight intensity={1.5} color="#e0f0ff" />
      <directionalLight position={[8, 14, 5]} intensity={1.8} color="#fff8e0" />
      <directionalLight position={[-6, 4, -8]} intensity={0.55} color="#9dd4ff" />
      <pointLight position={[10, 8, -5]} intensity={0.6} color="#6bb8f5" />

      {/* Light rays */}
      <LightRay pos={[4, 6, -12]} rot={[0, 0.3, 0.15]} sc={[1.5, 18]} />
      <LightRay pos={[12, 8, -14]} rot={[0, -0.2, 0.08]} sc={[1.2, 20]} />
      <LightRay pos={[20, 7, -12]} rot={[0, 0.15, -0.1]} sc={[1.8, 16]} />

      {/* Clouds – 3 panel widths */}
      <CloudPuff pos={[-4, 4.5, -20]} sc={2.4} s={1} />
      <CloudPuff pos={[0, 6, -24]} sc={3.0} s={2} />
      <CloudPuff pos={[3, 3.2, -15]} sc={1.7} s={3} />
      <CloudPuff pos={[6, 6.5, -22]} sc={3.2} s={4} />
      <CloudPuff pos={[9, 4, -17]} sc={2.0} s={5} />
      <CloudPuff pos={[11, 7, -26]} sc={4.0} s={6} />
      <CloudPuff pos={[14, 3.5, -16]} sc={1.9} s={7} />
      <CloudPuff pos={[17, 6, -22]} sc={2.8} s={8} />
      <CloudPuff pos={[20, 4.5, -18]} sc={2.2} s={9} />
      <CloudPuff pos={[23, 6.5, -24]} sc={3.5} s={10} />
      {/* Background layer (deep) */}
      <CloudPuff pos={[2, 9, -38]} sc={5.0} s={11} />
      <CloudPuff pos={[9, 10, -42]} sc={6.0} s={12} />
      <CloudPuff pos={[18, 8, -40]} sc={5.5} s={13} />

      {/* Crystals */}
      <Crystal pos={[1.5, 0.5, -4]} sc={0.52} col="#99d4ff" spd={0.20} />
      <Crystal pos={[3.8, -1.1, -6]} sc={0.38} col="#b8e0ff" spd={0.34} />
      <Crystal pos={[7, 1.4, -5]} sc={0.68} col="#77bbe8" spd={0.17} />
      <Crystal pos={[10.5, -0.9, -4.5]} sc={0.48} col="#aad4ff" spd={0.27} />
      <Crystal pos={[14, 0.9, -5.5]} sc={0.62} col="#88ccff" spd={0.21} />
      <Crystal pos={[17.5, -0.6, -4]} sc={0.78} col="#66aaee" spd={0.29} />
      <Crystal pos={[21, 0.4, -5]} sc={0.44} col="#99d4ff" spd={0.24} />

      {/* Atmospheric dust */}
      <Sparkles count={280} size={1.1} speed={0.05} opacity={0.18}
        color="#b8deff"
        scale={[55, 14, 22]}
        position={[11, 2, -7] as [number,number,number]} />

      {/* Faint stars (twilight hint) */}
      <Stars radius={200} depth={70} count={700} factor={2} saturation={0} fade speed={0.2} />
    </>
  );
}

// ─── Panel 1 ─────────────────────────────────────────────────────────────────
function Panel1() {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef   = useRef<HTMLParagraphElement>(null);
  const divRef   = useRef<HTMLDivElement>(null);
  const hintRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([badgeRef.current, subRef.current, divRef.current, hintRef.current],
        { autoAlpha: 0, y: 22 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(badgeRef.current, { autoAlpha: 1, y: 0, duration: 0.65 }, 0.5);

      if (titleRef.current) {
        const raw = titleRef.current.textContent ?? "";
        titleRef.current.innerHTML = raw.split("").map(
          c => `<span class="ch" style="display:inline-block">${c}</span>`
        ).join("");
        gsap.set(titleRef.current.querySelectorAll(".ch"),
          { autoAlpha: 0, y: 72, rotateY: -50, transformPerspective: 600 });
        tl.to(titleRef.current.querySelectorAll(".ch"), {
          autoAlpha: 1, y: 0, rotateY: 0,
          duration: 0.65, stagger: 0.08, ease: "back.out(1.6)",
        }, 0.7);
      }

      tl.to(subRef.current,  { autoAlpha: 1, y: 0, duration: 0.75 }, 1.3);
      tl.to(divRef.current,  {
        autoAlpha: 1, y: 0, scaleX: 1, duration: 0.55,
        transformOrigin: "left center",
      }, 1.65);
      tl.to(hintRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, 1.85);

      gsap.to(wrapRef.current, {
        y: -8, duration: 4.5, ease: "sine.inOut", yoyo: true, repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="w-screen h-screen flex-shrink-0 flex items-center"
      style={{ paddingLeft: "max(52px, 6.5vw)", scrollSnapAlign: "start" }}>
      <div ref={wrapRef} className="max-w-[500px]" style={{ perspective: "800px" }}>

        <div ref={badgeRef}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-9"
          style={{ border: "1px solid rgba(255,255,255,0.24)", background: "rgba(255,255,255,0.11)", backdropFilter: "blur(14px)" }}>
          <span className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#38bdf8", boxShadow: "0 0 8px 2px rgba(56,189,248,0.85)", animation: "pulse 1.9s infinite" }} />
          <span className="text-[10px] font-bold tracking-[0.32em] uppercase"
            style={{ color: "rgba(255,255,255,0.72)" }}>Coming Soon</span>
        </div>

        <h1 ref={titleRef} className="font-black leading-none mb-7 select-none"
          style={{
            fontSize: "clamp(4.5rem, 12vw, 9.5rem)",
            background: "linear-gradient(135deg,#ffffff 0%,#c4e2fa 30%,#6ab5e8 65%,#3a8fd4 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            filter: "drop-shadow(0 4px 30px rgba(70,160,255,0.48))",
            letterSpacing: "-0.03em",
          }}>
          AoiXsy
        </h1>

        <p ref={subRef} className="text-[15px] leading-[1.78] mb-8"
          style={{ color: "rgba(255,255,255,0.70)", maxWidth: "360px", textShadow: "0 2px 16px rgba(0,40,80,0.45)" }}>
          A new portfolio experience is{" "}
          <span style={{ color: "#90d5ff", fontWeight: 600 }}>launching soon.</span><br />
          Something beautiful is being crafted.
        </p>

        <div ref={divRef} className="flex items-center gap-3 mb-9"
          style={{ transform: "scaleX(0)" }}>
          <div className="h-px w-16"
            style={{ background: "linear-gradient(to right,transparent,rgba(255,255,255,0.30))" }} />
          <span className="w-1.5 h-1.5 rounded-full"
            style={{ background: "rgba(148,213,255,0.75)" }} />
          <span className="w-1 h-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.45)" }} />
          <span className="w-1.5 h-1.5 rounded-full"
            style={{ background: "rgba(148,213,255,0.75)" }} />
          <div className="h-px w-10"
            style={{ background: "linear-gradient(to right,rgba(255,255,255,0.30),transparent)" }} />
        </div>

        <div ref={hintRef} className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.30em] uppercase"
              style={{ color: "rgba(255,255,255,0.30)" }}>Scroll to explore</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
              style={{ color: "rgba(255,255,255,0.28)" }}>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-[10px] mt-5" style={{ color: "rgba(255,255,255,0.15)" }}>
            © {new Date().getFullYear()} Flexsy Bilbis Triwibowo
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Panel 2 ─────────────────────────────────────────────────────────────────
function Panel2({ visible }: { visible: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!visible) return;
    gsap.fromTo(ref.current,
      { autoAlpha: 0, y: 36 },
      { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out", delay: 0.15 }
    );
  }, [visible]);

  return (
    <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center"
      style={{ scrollSnapAlign: "start" }}>
      <div ref={ref} className="text-center px-10" style={{ opacity: 0 }}>
        <p className="font-light text-[10px] tracking-[0.55em] uppercase mb-8"
          style={{ color: "rgba(255,255,255,0.28)" }}>In progress</p>
        <p className="font-black leading-[0.88]"
          style={{
            fontSize: "clamp(3.5rem, 10vw, 8rem)",
            color: "rgba(255,255,255,0.055)",
            letterSpacing: "-0.04em",
            textShadow: "0 0 120px rgba(120,200,255,0.20)",
          }}>
          Something<br />beautiful.
        </p>
        <p className="text-[10px] mt-10 tracking-[0.35em] uppercase"
          style={{ color: "rgba(255,255,255,0.14)" }}>— stay tuned</p>
      </div>
    </div>
  );
}

// ─── Panel 3 ─────────────────────────────────────────────────────────────────
function Panel3({ visible }: { visible: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!visible) return;
    gsap.fromTo(ref.current,
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 1.0, ease: "power3.out", delay: 0.2 }
    );
  }, [visible]);

  return (
    <div className="w-screen h-screen flex-shrink-0 flex items-end justify-end"
      style={{ scrollSnapAlign: "start", paddingRight: "max(52px, 6.5vw)", paddingBottom: "12vh" }}>
      <div ref={ref} className="text-right" style={{ opacity: 0 }}>
        <p className="font-black"
          style={{
            fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
            color: "rgba(255,255,255,0.045)",
            letterSpacing: "-0.035em",
          }}>2025</p>
        <p className="text-[10px] mt-2 tracking-[0.28em] uppercase"
          style={{ color: "rgba(255,255,255,0.13)" }}>
          aoixsy-portfolio.vercel.app
        </p>
      </div>
    </div>
  );
}

// ─── Click ripple ─────────────────────────────────────────────────────────────
function Ripple({ x, y, id, onDone }: { x: number; y: number; id: number; onDone: (id: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el,
      { scale: 0, opacity: 0.55 },
      { scale: 3.5, opacity: 0, duration: 0.75, ease: "power2.out",
        onComplete: () => onDone(id) }
    );
  }, [id, onDone]);

  return (
    <div ref={ref} className="pointer-events-none fixed z-30 rounded-full"
      style={{
        width: 60, height: 60,
        left: x - 30, top: y - 30,
        border: "1.5px solid rgba(180,224,255,0.6)",
        boxShadow: "0 0 12px rgba(120,200,255,0.3)",
        transformOrigin: "center",
      }} />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ComingSoon() {
  const scrollRef   = useRef<HTMLDivElement>(null);
  const scrollProg  = useRef(0);
  const mouseRef    = useRef({ x: 0, y: 0 });
  const p2shown     = useRef(false);
  const p3shown     = useRef(false);

  const [mounted,  setMounted]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [p2vis, setP2Vis]       = useState(false);
  const [p3vis, setP3Vis]       = useState(false);
  const [ripples, setRipples]   = useState<{ x: number; y: number; id: number }[]>([]);
  const rippleId = useRef(0);

  useEffect(() => {
    setMounted(true);
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = scrollRef.current;
      if (!el) return;
      const w = window.innerWidth;
      if (e.key === "ArrowRight") el.scrollTo({ left: el.scrollLeft + w, behavior: "smooth" });
      if (e.key === "ArrowLeft")  el.scrollTo({ left: el.scrollLeft - w, behavior: "smooth" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p   = max > 0 ? el.scrollLeft / max : 0;
    scrollProg.current = p;
    setProgress(p);
    if (p > 0.28 && !p2shown.current) { p2shown.current = true; setP2Vis(true); }
    if (p > 0.64 && !p3shown.current) { p3shown.current = true; setP3Vis(true); }
  }, []);

  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const el = scrollRef.current;
    if (el) el.scrollTo({ left: ratio * (el.scrollWidth - el.clientWidth), behavior: "smooth" });
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const id = ++rippleId.current;
    setRipples(prev => [...prev, { x: e.clientX, y: e.clientY, id }]);
  }, []);

  const removeRipple = useCallback((id: number) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden" onClick={handleClick}>

      {/* ── hide native scrollbar globally for this page ──────────── */}
      <style>{`
        .hs-panel { scrollbar-width: none; -ms-overflow-style: none; }
        .hs-panel::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── Canvas ───────────────────────────────────────────────── */}
      {mounted && (
        <div className="fixed inset-0 z-0">
          <Canvas camera={{ position: [0, 2, 15], fov: 55 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}>
            <Suspense fallback={null}>
              <Scene scroll={scrollProg} mouse={mouseRef} />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* ── Gradient vignettes over sky ──────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-[2]"
        style={{ background: "linear-gradient(to right, rgba(8,28,65,0.82) 0%, rgba(10,35,75,0.58) 22%, rgba(10,35,75,0.08) 52%, transparent 75%)" }} />
      <div className="fixed inset-0 pointer-events-none z-[2]"
        style={{ background: "linear-gradient(to bottom, rgba(5,20,50,0.42) 0%, transparent 22%, transparent 78%, rgba(4,18,44,0.68) 100%)" }} />

      {/* ── Panels ───────────────────────────────────────────────── */}
      <div ref={scrollRef} onScroll={handleScroll}
        className="hs-panel relative z-10 w-screen h-screen"
        style={{ overflowX: "auto", overflowY: "hidden", scrollSnapType: "x mandatory" } as React.CSSProperties}>
        <div className="flex h-screen" style={{ width: "300vw" }}>
          <Panel1 />
          <Panel2 visible={p2vis} />
          <Panel3 visible={p3vis} />
        </div>
      </div>

      {/* ── Click ripples ────────────────────────────────────────── */}
      {ripples.map(r => (
        <Ripple key={r.id} x={r.x} y={r.y} id={r.id} onDone={removeRipple} />
      ))}

      {/* ── Custom scrollbar ─────────────────────────────────────── */}
      {mounted && (
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
          style={{ padding: "0 max(52px, 5.5vw) 22px" }}>

          {/* Section labels */}
          <div className="flex justify-between mb-3"
            style={{ paddingRight: "2px" }}>
            {["01", "02", "03"].map((n, i) => (
              <span key={n}
                className="text-[9px] tracking-[0.22em] transition-colors duration-500"
                style={{
                  color: (progress >= (i / 3) - 0.04 && progress < (i / 3) + 0.40)
                    ? "rgba(255,255,255,0.52)"
                    : "rgba(255,255,255,0.15)",
                }}>
                {n}
              </span>
            ))}
          </div>

          {/* Track */}
          <div className="relative w-full rounded-full cursor-pointer pointer-events-auto"
            style={{ height: "2px", background: "rgba(255,255,255,0.10)" }}
            onClick={handleTrackClick}>

            {/* Active fill */}
            <div className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${progress * 100}%`,
                background: "linear-gradient(to right, rgba(56,189,248,0.90), rgba(186,230,253,0.95))",
                boxShadow: "0 0 7px rgba(56,189,248,0.55)",
                transition: "width 0.06s linear",
              }} />

            {/* Thumb */}
            <div className="absolute top-1/2 rounded-full -translate-y-1/2 -translate-x-1/2"
              style={{
                left: `${progress * 100}%`,
                width: 11, height: 11,
                background: "white",
                boxShadow: "0 0 10px rgba(56,189,248,1), 0 0 22px rgba(56,189,248,0.45)",
                transition: "left 0.06s linear",
              }} />
          </div>

          {/* Keyboard hint */}
          <p className="text-center mt-3 text-[9px] tracking-widest"
            style={{ color: "rgba(255,255,255,0.10)" }}>
            ← → arrow keys
          </p>
        </div>
      )}
    </div>
  );
}
