"use client";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { animate } from "animejs";
import gsap from "gsap";

/* ── math ─────────────────────────────────────────────────────────────────── */
const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const sm    = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0 || 1), 0, 1);
  return t * t * (3 - 2 * t);
};

/* ── circular star sprite ─────────────────────────────────────────────────── */
function makeSprite(): THREE.Texture {
  const S = 64, cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const ctx = cv.getContext("2d")!;
  const g = ctx.createRadialGradient(S/2, S/2, 0, S/2, S/2, S/2);
  g.addColorStop(0,    "rgba(255,255,255,1)");
  g.addColorStop(0.12, "rgba(200,222,255,0.96)");
  g.addColorStop(0.40, "rgba(80,122,220,0.28)");
  g.addColorStop(1,    "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  return new THREE.CanvasTexture(cv);
}

/*
 * Seamless loop opacity (p loops 0–1)
 *
 * Hero  : bookend — visible at both p=0 AND p=1 (start = end, loop is invisible)
 *         full  : 0.00–0.10 and 0.90–1.00
 *         fadeout: 0.10–0.22   |  fadein: 0.78–0.90
 *
 * Journey: appears in the middle of the flight
 *         fadein: 0.34–0.45   |  peak: 0.45–0.55   |  fadeout: 0.55–0.66
 */
function secOp(idx: number, p: number): number {
  if (idx === 0) {
    const a = sm(0.22, 0.10, p);   // 1 → 0  (fades out 0.10→0.22)
    const b = sm(0.78, 0.90, p);   // 0 → 1  (fades in  0.78→0.90)
    return Math.max(a, b);
  }
  if (idx === 1) return sm(0.34, 0.45, p) * sm(0.66, 0.55, p);
  return 0;
}

/* ══════════════════════════════ COMPONENT ════════════════════════════════ */
export default function ComingSoon() {
  const mountRef     = useRef<HTMLDivElement>(null);
  const loaderRef    = useRef<HTMLDivElement>(null);
  const loaderNumRef = useRef<HTMLSpanElement>(null);
  const loaderBarRef = useRef<HTMLDivElement>(null);
  const sec0         = useRef<HTMLDivElement>(null);
  const sec1         = useRef<HTMLDivElement>(null);

  const INIT_LP  = 0.05;                      // start inside hero zone
  const INIT_CAM = 80 - INIT_LP * 200;        // = 70

  const targetP  = useRef(INIT_LP);
  const scrollP  = useRef(INIT_LP);
  const scrollV  = useRef(0);
  const camZ     = useRef(INIT_CAM);
  const mouseX   = useRef(0);
  const mouseY   = useRef(0);
  const heroLive = useRef(false);
  const prevLP   = useRef(INIT_LP);
  const rafId    = useRef(0);

  const [mounted,    setMounted]    = useState(false);
  const [isMobile,   setIsMobile]   = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  useEffect(() => {
    const mob = window.innerWidth < 768 || "ontouchstart" in window;
    setIsMobile(mob);
    setMounted(true);
  }, []);

  /* ═══ THREE.JS ════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!mounted || !mountRef.current) return;
    const el  = mountRef.current;
    const mob = isMobile;
    const W = window.innerWidth, H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x020209);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020209, 0.0012);

    const camera = new THREE.PerspectiveCamera(70, W / H, 0.1, 1000);
    camera.position.z = camZ.current;

    const spr = makeSprite();

    const TLEN     = 350;
    const TRAD     = 65;
    const HR       = 16;
    const RING_GAP = 72;

    /* ── background stars: cylindrical tunnel ── */
    const SN = mob ? 1600 : 4800;
    const sBuf = new Float32Array(SN * 3);
    for (let i = 0; i < SN; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 1.5 + Math.random() * TRAD;
      sBuf[i*3]   = Math.cos(a) * r;
      sBuf[i*3+1] = Math.sin(a) * r;
      sBuf[i*3+2] = camZ.current + (Math.random() - 0.5) * TLEN;
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute("position", new THREE.BufferAttribute(sBuf, 3));
    const sMat = new THREE.PointsMaterial({
      size: 1.2, map: spr, sizeAttenuation: true,
      transparent: true, opacity: 0.88,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const stars = new THREE.Points(sGeo, sMat);
    scene.add(stars);

    /* ── helix: double-strand spiral for "surrounding" feel ── */
    const HN = mob ? 90 : 260;
    const hBuf = new Float32Array(HN * 3);
    const hCol = new Float32Array(HN * 3);
    for (let i = 0; i < HN; i++) {
      const t   = i / HN;
      const ang = t * Math.PI * 2 * 5;
      const off = (i % 2) * Math.PI * 0.3;
      hBuf[i*3]   = Math.cos(ang + off) * HR;
      hBuf[i*3+1] = Math.sin(ang + off) * HR;
      hBuf[i*3+2] = camZ.current + t * TLEN - TLEN / 2;
      hCol[i*3]   = 0.25 + Math.random() * 0.15;
      hCol[i*3+1] = 0.50 + Math.random() * 0.25;
      hCol[i*3+2] = 0.92 + Math.random() * 0.08;
    }
    const hGeo = new THREE.BufferGeometry();
    hGeo.setAttribute("position", new THREE.BufferAttribute(hBuf, 3));
    hGeo.setAttribute("color",    new THREE.BufferAttribute(hCol, 3));
    const hMat = new THREE.PointsMaterial({
      size: 1.0, map: spr, sizeAttenuation: true, vertexColors: true,
      transparent: true, opacity: 0.62,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const helix = new THREE.Points(hGeo, hMat);
    scene.add(helix);

    /* ── nebula ── */
    const NN = mob ? 150 : 420;
    const nBuf = new Float32Array(NN * 3);
    const nCol = new Float32Array(NN * 3);
    const NP: [number,number,number][] = [
      [0.07,0.04,0.28],[0.03,0.06,0.22],[0.12,0.03,0.18],[0.02,0.10,0.24],
    ];
    for (let i = 0; i < NN; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 18 + Math.random() * 55;
      nBuf[i*3]   = Math.cos(a) * r;
      nBuf[i*3+1] = Math.sin(a) * r;
      nBuf[i*3+2] = camZ.current + (Math.random() - 0.5) * TLEN;
      const c = NP[i % NP.length];
      nCol[i*3] = c[0]; nCol[i*3+1] = c[1]; nCol[i*3+2] = c[2];
    }
    const nGeo = new THREE.BufferGeometry();
    nGeo.setAttribute("position", new THREE.BufferAttribute(nBuf, 3));
    nGeo.setAttribute("color",    new THREE.BufferAttribute(nCol, 3));
    const nMat = new THREE.PointsMaterial({
      size: 24, map: spr, sizeAttenuation: true, vertexColors: true,
      transparent: true, opacity: 0.14,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const nebula = new THREE.Points(nGeo, nMat);
    scene.add(nebula);

    /* ── energy rings: fly through them (desktop only) ── */
    type RObj = { pts: THREE.Points; mat: THREE.PointsMaterial; geo: THREE.BufferGeometry };
    const rings: RObj[] = [];
    if (!mob) {
      const rdefs = [
        { r: 20, col: new THREE.Color(0.32, 0.52, 0.90) },
        { r: 25, col: new THREE.Color(0.44, 0.32, 0.82) },
        { r: 18, col: new THREE.Color(0.22, 0.60, 0.92) },
      ];
      rdefs.forEach(({ r, col }, ri) => {
        const N = 90, buf = new Float32Array(N * 3);
        for (let i = 0; i < N; i++) {
          const a = (i / N) * Math.PI * 2;
          const rr = r + Math.sin(a * 5) * 1.6;
          buf[i*3] = Math.cos(a) * rr; buf[i*3+1] = Math.sin(a) * rr; buf[i*3+2] = 0;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(buf, 3));
        const mat = new THREE.PointsMaterial({
          size: 1.0, map: spr, sizeAttenuation: true, color: col,
          transparent: true, opacity: 0.38,
          blending: THREE.AdditiveBlending, depthWrite: false,
        });
        const pts = new THREE.Points(geo, mat);
        pts.position.z = camZ.current - 45 - ri * RING_GAP;
        scene.add(pts);
        rings.push({ pts, mat, geo });
      });
    }

    /* ═════ RAF ══════════════════════════════════════════════════════════════ */
    const lerpF = mob ? 0.10 : 0.055;
    let tt = 0;

    function tick() {
      rafId.current = requestAnimationFrame(tick);
      tt += 0.001;

      scrollV.current *= 0.88;
      targetP.current += scrollV.current;
      scrollP.current  = lerp(scrollP.current, targetP.current, lerpF);

      const lp = ((scrollP.current % 1) + 1) % 1;

      /* seamless loop: detect crossing in both directions, snap camera silently */
      const fwd = prevLP.current > 0.92 && lp < 0.08;
      const bwd = prevLP.current < 0.08 && lp > 0.92;
      prevLP.current = lp;

      const tgtZ = 80 - lp * 200;
      if (fwd || bwd) camZ.current = tgtZ;   // instant snap, recycled stars hide the cut
      camZ.current = lerp(camZ.current, tgtZ, 0.06);
      camera.position.z = camZ.current;

      camera.position.x = lerp(camera.position.x, mouseX.current * 4,   0.04);
      camera.position.y = lerp(camera.position.y, mouseY.current * 3,   0.04);
      camera.rotation.z = lerp(camera.rotation.z, scrollV.current * 1.8, 0.06);

      const speed = Math.abs(scrollV.current);
      camera.fov = lerp(camera.fov, 70 + speed * 24, 0.07);
      camera.updateProjectionMatrix();

      stars.rotation.z  = tt * 0.055;
      stars.rotation.y  = tt * 0.040;
      nebula.rotation.z = tt * 0.025;
      nebula.rotation.y = tt * 0.018;
      helix.rotation.z  = tt * 0.10;

      /* recycle all particles around camera for infinite tunnel */
      const sA = sGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < SN; i++) {
        const z = sA[i*3+2];
        if (z > camera.position.z + TLEN * 0.55) sA[i*3+2] -= TLEN;
        if (z < camera.position.z - TLEN * 0.55) sA[i*3+2] += TLEN;
      }
      sGeo.attributes.position.needsUpdate = true;

      const hA = hGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < HN; i++) {
        const z = hA[i*3+2];
        if (z > camera.position.z + TLEN * 0.55) hA[i*3+2] -= TLEN;
        if (z < camera.position.z - TLEN * 0.55) hA[i*3+2] += TLEN;
      }
      hGeo.attributes.position.needsUpdate = true;

      const nA = nGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < NN; i++) {
        const z = nA[i*3+2];
        if (z > camera.position.z + TLEN * 0.55) nA[i*3+2] -= TLEN;
        if (z < camera.position.z - TLEN * 0.55) nA[i*3+2] += TLEN;
      }
      nGeo.attributes.position.needsUpdate = true;

      rings.forEach((r, ri) => {
        if (r.pts.position.z > camera.position.z + 10)
          r.pts.position.z = camera.position.z - 50 - ri * RING_GAP;
        r.pts.rotation.z += 0.003 * (ri % 2 === 0 ? 1 : -1);
        r.mat.opacity = Math.min(0.48, 0.22 + speed * 14);
      });

      /* section opacity — direct DOM, no React re-render */
      if (sec1.current) {
        const op = secOp(1, lp);
        sec1.current.style.opacity       = String(op.toFixed(4));
        sec1.current.style.transform     = `translateY(${((1 - Math.min(op * 2, 1)) * 26).toFixed(2)}px)`;
        sec1.current.style.pointerEvents = op > 0.1 ? "auto" : "none";
      }
      if (heroLive.current && sec0.current) {
        const op = secOp(0, lp);
        sec0.current.style.opacity       = String(op.toFixed(4));
        sec0.current.style.transform     = `translateY(${((1 - Math.min(op * 2, 1)) * 26).toFixed(2)}px)`;
        sec0.current.style.pointerEvents = op > 0.1 ? "auto" : "none";
      }

      renderer.render(scene, camera);
    }
    tick();

    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const onMouse = (e: MouseEvent) => {
      mouseX.current =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY.current = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("resize",    onResize);
    window.addEventListener("mousemove", onMouse, { passive: true });

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize",    onResize);
      window.removeEventListener("mousemove", onMouse);
      sGeo.dispose(); sMat.dispose();
      hGeo.dispose(); hMat.dispose();
      nGeo.dispose(); nMat.dispose();
      rings.forEach(r => { r.geo.dispose(); r.mat.dispose(); });
      spr.dispose(); renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [mounted, isMobile]);

  /* ═══ PRELOADER + HERO ENTRANCE ═══════════════════════════════════════════ */
  useEffect(() => {
    if (!mounted) return;
    const obj = { n: 0 };
    const anim = animate(obj, {
      n: 100, duration: 2700, ease: "inOutSine",
      onUpdate: () => {
        const v = Math.round(obj.n);
        if (loaderNumRef.current)
          loaderNumRef.current.textContent = String(v).padStart(3, "0");
        if (loaderBarRef.current)
          loaderBarRef.current.style.transform = `scaleX(${obj.n / 100})`;
      },
      onComplete: () => {
        if (!loaderRef.current) return;
        animate(loaderRef.current, {
          opacity: [1, 0], duration: 1000, ease: "outQuart",
          onComplete: () => {
            setLoaderDone(true);
            if (!sec0.current) return;
            sec0.current.style.opacity       = "1";
            sec0.current.style.transform     = "translateY(0)";
            sec0.current.style.pointerEvents = "auto";
            const tl = gsap.timeline({ onComplete: () => { heroLive.current = true; } });
            tl.set(".cs-hero-el",  { opacity: 0, y: 22 });
            tl.to(".cs-hero-el", { opacity: 1, y: 0, duration: 1.0, ease: "power4.out", stagger: 0.13 });
          },
        });
      },
    });
    return () => { try { anim.pause(); } catch { /* done */ } };
  }, [mounted]);

  /* ═══ WHEEL — slower sensitivity for a longer perceived journey ═══════════ */
  useEffect(() => {
    if (!mounted || isMobile) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const raw = e.deltaMode === 0 ? e.deltaY : e.deltaY * 28;
      // 0.000060 sensitivity → ~20 scroll events to traverse full loop
      scrollV.current = clamp(scrollV.current + raw * 0.000060, -0.006, 0.006);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight")
        scrollV.current = clamp(scrollV.current + 0.003, -0.006, 0.006);
      if (e.key === "ArrowUp"   || e.key === "ArrowLeft")
        scrollV.current = clamp(scrollV.current - 0.003, -0.006, 0.006);
    };
    window.addEventListener("wheel",   onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel",   onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted, isMobile]);

  /* ═══ MOBILE SCROLL ═══════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!mounted || !isMobile) return;
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      if (max > 0) targetP.current = window.scrollY / max;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted, isMobile]);

  /* ═══ SHARED STYLES ════════════════════════════════════════════════════════ */
  const fixedSec: React.CSSProperties = {
    position: "fixed", inset: 0, zIndex: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    opacity: 0, pointerEvents: "none",
    willChange: "opacity, transform",
  };

  /* ═══════════════════════════════ RENDER ═══════════════════════════════════ */
  return (
    <div style={{ background: "#020209", position: "relative" }}>

      <style>{`
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { background:#020209; overflow-x:hidden; scrollbar-width:none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar { display:none; }
        @media(min-width:768px){ html, body { overflow:hidden; } }

        @keyframes cs-orbit-a { to { transform:rotate(360deg); } }
        @keyframes cs-orbit-b { to { transform:rotate(-360deg); } }
        @keyframes cs-fadein  {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes cs-float {
          0%,100% { transform:translateY(0); }
          50%     { transform:translateY(-6px); }
        }
        @keyframes cs-pulse-ring {
          0%   { transform:scale(0.88); opacity:0.60; }
          100% { transform:scale(1.55); opacity:0; }
        }
        @keyframes cs-nav-in {
          from { opacity:0; transform:translateY(6px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .cs-nav-link {
          font-size:9px; font-weight:700; letter-spacing:0.42em;
          text-transform:uppercase; color:rgba(118,148,212,0.55);
          text-decoration:none; cursor:pointer;
          transition:color 0.25s ease;
        }
        .cs-nav-link:hover { color:rgba(205,222,255,0.92); }
      `}</style>

      {/* ═══════════════════════ PRELOADER ════════════════════════════════ */}
      {!loaderDone && (
        <div ref={loaderRef} style={{
          position:"fixed", inset:0, zIndex:500, background:"#020209",
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", overflow:"hidden",
        }}>
          {/* Ring A — 18s CW */}
          <div style={{
            position:"absolute", width:280, height:280, borderRadius:"50%",
            border:"1px solid rgba(74,111,212,0.10)", animation:"cs-orbit-a 18s linear infinite",
          }}>
            <div style={{
              position:"absolute", top:-4, left:"calc(50% - 4px)",
              width:8, height:8, borderRadius:"50%", background:"#4a6fd4",
              boxShadow:"0 0 14px 4px rgba(74,111,212,0.90)",
            }} />
          </div>
          {/* Ring B — 11s CCW */}
          <div style={{
            position:"absolute", width:180, height:180, borderRadius:"50%",
            border:"1px solid rgba(114,100,169,0.08)", animation:"cs-orbit-b 11s linear infinite",
          }}>
            <div style={{
              position:"absolute", bottom:-3, left:"calc(50% - 3px)",
              width:6, height:6, borderRadius:"50%", background:"#7264a9",
              boxShadow:"0 0 10px 3px rgba(114,100,169,0.85)",
            }} />
          </div>
          {/* Ring C — 30s reverse */}
          <div style={{
            position:"absolute", width:380, height:380, borderRadius:"50%",
            border:"1px solid rgba(40,65,140,0.06)", animation:"cs-orbit-a 30s linear infinite reverse",
          }}>
            <div style={{
              position:"absolute", top:-2.5, right:"calc(50% - 58px)",
              width:5, height:5, borderRadius:"50%", background:"rgba(74,111,212,0.55)",
              boxShadow:"0 0 8px 2px rgba(74,111,212,0.50)",
            }} />
          </div>

          <div style={{ zIndex:1, textAlign:"center", animation:"cs-fadein 0.9s ease both" }}>
            <p style={{
              fontSize:"clamp(2.2rem,7vw,3.6rem)", fontWeight:800, letterSpacing:"-0.04em",
              color:"rgba(240,246,255,0.93)", marginBottom:36,
              textShadow:"0 0 80px rgba(74,111,212,0.55)",
            }}>AoiXsy</p>

            <div style={{ display:"flex", alignItems:"baseline", justifyContent:"center", gap:3, marginBottom:14 }}>
              <span ref={loaderNumRef} style={{
                fontFamily:"ui-monospace, monospace",
                fontSize:"clamp(0.85rem,2.5vw,1.1rem)", fontWeight:500,
                color:"rgba(148,175,230,0.72)", letterSpacing:"0.12em",
                minWidth:"3ch", textAlign:"right",
              }}>000</span>
              <span style={{ fontFamily:"ui-monospace, monospace", fontSize:"0.75rem", color:"rgba(80,108,172,0.42)" }}>%</span>
            </div>

            <div style={{ width:"min(200px,52vw)", height:1, background:"rgba(74,111,212,0.12)", overflow:"hidden" }}>
              <div ref={loaderBarRef} style={{
                height:"100%", width:"100%",
                transformOrigin:"left center", transform:"scaleX(0)",
                background:"linear-gradient(to right, rgba(74,111,212,0.28), rgba(185,212,255,0.92), rgba(74,111,212,0.28))",
                boxShadow:"0 0 12px rgba(74,111,212,0.55)",
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Canvas */}
      {mounted && (
        <div ref={mountRef} style={{ position:"fixed", inset:0, zIndex:0, width:"100vw", height:"100vh" }} />
      )}

      {/* Vignette */}
      <div style={{
        position:"fixed", inset:0, zIndex:1, pointerEvents:"none",
        background:"radial-gradient(ellipse at 50% 50%, transparent 22%, rgba(2,2,9,0.80) 100%)",
      }} />
      <div style={{
        position:"fixed", inset:0, zIndex:1, pointerEvents:"none",
        background:"linear-gradient(to bottom, rgba(2,2,9,0.60) 0%, transparent 18%, transparent 82%, rgba(2,2,9,0.70) 100%)",
      }} />

      {/* ═════════════════════ SECTION 0 — HERO ═══════════════════════════ */}
      <div ref={sec0} style={fixedSec}>
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          background:"radial-gradient(ellipse 640px 360px at 50% 50%, rgba(2,2,9,0.46) 0%, transparent 72%)",
        }} />
        <div style={{ textAlign:"center", padding:"0 clamp(24px,6vw,80px)", maxWidth:660, position:"relative" }}>

          <div className="cs-hero-el" style={{ display:"inline-flex", alignItems:"center", gap:9, marginBottom:28, opacity:0 }}>
            <span style={{ position:"relative", width:8, height:8, flexShrink:0 }}>
              <span style={{
                position:"absolute", inset:-2, borderRadius:"50%",
                background:"rgba(74,111,212,0.35)", animation:"cs-pulse-ring 2.2s ease infinite",
              }} />
              <span style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#4a6fd4" }} />
            </span>
            <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.46em", textTransform:"uppercase", color:"rgba(152,178,232,0.74)" }}>
              In Development
            </span>
          </div>

          <h1 className="cs-hero-el" style={{
            fontSize:"clamp(4.5rem,16vw,11.5rem)",
            fontWeight:800, lineHeight:0.88, letterSpacing:"-0.045em",
            color:"rgba(240,246,255,0.95)",
            marginBottom:22, userSelect:"none",
            textShadow:"0 2px 0 rgba(0,0,0,0.55), 0 0 90px rgba(74,111,212,0.38)",
            opacity:0,
          }}>AoiXsy</h1>

          <p className="cs-hero-el" style={{
            fontSize:"clamp(0.82rem,1.85vw,1.0rem)",
            color:"rgba(205,220,252,0.82)",
            letterSpacing:"0.034em",
            maxWidth:360, margin:"0 auto 46px",
            lineHeight:1.80, opacity:0,
          }}>
            A new portfolio experience.
            <br />
            <span style={{ color:"rgba(152,175,228,0.55)" }}>Software developer from Indonesia.</span>
          </p>

          <div className="cs-hero-el" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, opacity:0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              style={{ animation:"cs-float 2.6s ease-in-out infinite" }}>
              <path d="M12 5v14M6 13l6 6 6-6"
                stroke="rgba(74,111,212,0.52)"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize:8, letterSpacing:"0.50em", textTransform:"uppercase", color:"rgba(74,111,212,0.40)" }}>
              scroll
            </span>
          </div>
        </div>
      </div>

      {/* ═════════════════════ SECTION 1 — JOURNEY ════════════════════════ */}
      <div ref={sec1} style={fixedSec}>
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          background:"radial-gradient(ellipse 580px 360px at 50% 50%, rgba(2,2,9,0.44) 0%, transparent 72%)",
        }} />
        <div style={{ textAlign:"center", padding:"0 clamp(24px,6vw,80px)", maxWidth:520, position:"relative" }}>

          <p style={{
            fontSize:8, letterSpacing:"0.52em", textTransform:"uppercase",
            color:"rgba(74,111,212,0.45)", marginBottom:32,
          }}>Portfolio · 2025</p>

          <h2 style={{
            fontSize:"clamp(1.9rem,5.8vw,3.4rem)",
            fontWeight:700, lineHeight:1.12, letterSpacing:"-0.032em",
            color:"rgba(230,240,255,0.90)",
            marginBottom:28,
          }}>
            Building immersive<br />digital experiences.
          </h2>

          <p style={{
            fontSize:"clamp(0.80rem,1.8vw,0.94rem)",
            color:"rgba(178,200,242,0.76)",
            lineHeight:1.82,
          }}>
            Full Stack Developer · Indonesia
            <br />
            <span style={{ color:"rgba(118,148,210,0.48)" }}>Code · Design · Motion</span>
          </p>
        </div>
      </div>

      {/* ═════════════════════ NAVIGATION (after loader) ══════════════════ */}
      {loaderDone && (
        <>
          {/* Bottom-left: wordmark + year */}
          <div style={{
            position:"fixed",
            bottom:"clamp(22px,3.5vh,36px)",
            left:"clamp(22px,4vw,44px)",
            zIndex:30,
            animation:"cs-nav-in 1s ease 0.4s both",
          }}>
            <span style={{
              fontSize:9, fontWeight:700, letterSpacing:"0.28em",
              textTransform:"uppercase", color:"rgba(80,108,172,0.36)",
            }}>AoiXsy · {new Date().getFullYear()}</span>
          </div>

          {/* Bottom-right: Contact + Connect */}
          <nav style={{
            position:"fixed",
            bottom:"clamp(22px,3.5vh,36px)",
            right:"clamp(22px,4vw,44px)",
            zIndex:30,
            display:"flex", alignItems:"center", gap:20,
            animation:"cs-nav-in 1s ease 0.6s both",
          }}>
            <a
              href="mailto:lbbpramuka@gmail.com"
              className="cs-nav-link"
            >Contact</a>
            <span style={{ width:1, height:10, background:"rgba(74,111,212,0.22)" }} />
            <a
              href="https://github.com/bhilbis"
              target="_blank" rel="noopener noreferrer"
              className="cs-nav-link"
            >Connect</a>
          </nav>
        </>
      )}

      {/* Mobile scroll track */}
      {isMobile && <div aria-hidden="true" style={{ height:"400vh", position:"relative", zIndex:0 }} />}
    </div>
  );
}
