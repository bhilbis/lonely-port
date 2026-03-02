"use client";

import { animate } from "animejs";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { TypingAnimation } from "../magicui/typing-animation";

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const brandRef = useRef<HTMLSpanElement | null>(null);

  const scrollToProjects = () => {
    const element = document.querySelector("#projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToAbout = () => {
    const element = document.querySelector("#about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    const particleCount = 1100;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;
      const radius = 3 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xf7f7f7,
      size: 0.03,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(points);

    const floatingMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const floatingMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 1), floatingMaterial);
    floatingMesh.position.set(2.8, -0.4, -2.4);
    scene.add(floatingMesh);

    const pointerTarget = new THREE.Vector2(0, 0);
    const pointerCurrent = new THREE.Vector2(0, 0);

    const onPointerMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      pointerTarget.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerTarget.y = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const resize = () => {
      const width = section.clientWidth;
      const height = section.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    section.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", resize);
    resize();

    const clock = new THREE.Clock();
    let frameId = 0;
    const animateFrame = () => {
      const elapsed = clock.getElapsedTime();
      pointerCurrent.lerp(pointerTarget, 0.06);

      points.rotation.y = elapsed * 0.04 + pointerCurrent.x * 0.18;
      points.rotation.x = elapsed * 0.018 + pointerCurrent.y * 0.09;
      points.position.x = pointerCurrent.x * 0.45;
      points.position.y = pointerCurrent.y * 0.24;

      floatingMesh.rotation.x = elapsed * 0.18 + pointerCurrent.y * 0.22;
      floatingMesh.rotation.y = elapsed * 0.24 + pointerCurrent.x * 0.28;
      floatingMesh.position.x = 2.8 + pointerCurrent.x * 0.8;
      floatingMesh.position.y = -0.4 + pointerCurrent.y * 0.45;

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animateFrame);
    };
    animateFrame();

    return () => {
      window.cancelAnimationFrame(frameId);
      section.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      particleGeometry.dispose();
      particleMaterial.dispose();
      floatingMesh.geometry.dispose();
      floatingMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set("[data-hero-reveal]", { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set("[data-hero-reveal]", { autoAlpha: 0, y: 30 });
      gsap.to("[data-hero-reveal]", {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.14,
        delay: 0.2,
      });

      gsap.to("[data-parallax='headline']", {
        yPercent: -16,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to("[data-parallax='meta']", {
        yPercent: -9,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to("[data-scroll-dot]", {
        y: 36,
        duration: 1.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const brandEl = brandRef.current;
    if (!brandEl) return;

    const finalText = "AoiXsy";
    const glyphs = "AOIXSY013579#%&*";
    const state = { value: 0 };

    const animation = animate(state, {
      value: finalText.length,
      duration: 1400,
      ease: "outExpo",
      onUpdate: () => {
        const settled = Math.floor(state.value);
        const scrambled = finalText
          .split("")
          .map((char, index) =>
            index < settled ? char : glyphs[Math.floor(Math.random() * glyphs.length)],
          )
          .join("");
        brandEl.textContent = scrambled;
      },
      onComplete: () => {
        brandEl.textContent = finalText;
      },
    });

    return () => {
      animation.pause();
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const magnets = Array.from(section.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const cleanup = magnets.map((element) => {
      const xTo = gsap.quickTo(element, "x", { duration: 0.4, ease: "power3.out" });
      const yTo = gsap.quickTo(element, "y", { duration: 0.4, ease: "power3.out" });
      const rTo = gsap.quickTo(element, "rotateZ", { duration: 0.45, ease: "power3.out" });

      const onMove = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        xTo((x / rect.width) * 26);
        yTo((y / rect.height) * 26);
        rTo((x / rect.width) * 4);
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
        rTo(0);
      };

      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerleave", onLeave);

      return () => {
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => cleanup.forEach((fn) => fn());
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative isolate min-h-screen overflow-hidden bg-[oklch(0.12_0_0)] text-[oklch(0.98_0_0)]"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-55 sm:opacity-65"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_16%_20%,oklch(0.7_0_0/0.08),transparent_38%),radial-gradient(circle_at_82%_72%,oklch(0.92_0_0/0.06),transparent_44%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-48 bg-gradient-to-b from-[oklch(0.12_0_0/0)] via-[oklch(0.12_0_0/0.7)] to-[oklch(0.12_0_0)] sm:h-56" />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-12 px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pt-32">
        <div className="col-span-12 flex flex-col justify-center gap-10 sm:gap-14 lg:col-span-8 lg:col-start-2 lg:justify-between">
          <div className="max-w-[980px]">
            <p
              data-hero-reveal
              className="mb-8 text-[10px] uppercase tracking-[0.42em] text-[oklch(0.86_0_0/0.58)]"
            >
              AOIXSY PORTFOLIO / 2026
            </p>

            <h1
              data-hero-reveal
              data-parallax="headline"
              className="leading-[0.9] tracking-[-0.04em] [font-size:clamp(2.75rem,11vw,8.5rem)]"
              style={{ fontFamily: '"Geist Sans", "Inter", system-ui, sans-serif' }}
            >
              <span ref={brandRef} className="block will-change-transform">
                AoiXsy
              </span>
              <span className="mt-5 block text-[clamp(0.78rem,1.45vw,1.05rem)] tracking-[0.22em] text-[oklch(0.92_0_0/0.68)]">
                FLEXSY BILBIS TRIWIBOWO
              </span>
            </h1>

            <div data-hero-reveal data-parallax="meta" className="mt-10 max-w-[48ch] space-y-5">
              <TypingAnimation
                sentences={["Web Developer", "Tech Enthusiast"]}
                typingSpeed={90}
                deletingSpeed={32}
                delayBetween={1800}
                className="!text-[11px] !font-medium uppercase tracking-[0.32em] text-[oklch(0.86_0_0/0.44)]"
              />
              <p className="text-sm leading-relaxed text-[oklch(0.86_0_0/0.64)] md:text-base">
                Building quietly bold digital systems with clarity, speed, and a meticulous eye for
                interaction detail.
              </p>
            </div>
          </div>

          <div data-hero-reveal className="flex flex-wrap items-center gap-4 pb-3">
            <button
              type="button"
              data-magnetic
              onClick={scrollToProjects}
              className="rounded-full border border-[oklch(0.86_0_0/0.45)] px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.26em] text-[oklch(0.98_0_0)] transition-colors duration-300 hover:bg-[oklch(0.98_0_0)] hover:text-[oklch(0.13_0_0)]"
            >
              Selected Work
            </button>
            <button
              type="button"
              data-magnetic
              onClick={scrollToAbout}
              className="rounded-full border border-[oklch(0.86_0_0/0.28)] px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.26em] text-[oklch(0.9_0_0/0.82)] transition-colors duration-300 hover:border-[oklch(0.98_0_0)] hover:text-[oklch(0.99_0_0)]"
            >
              About
            </button>
          </div>
        </div>
      </div>

      <div data-hero-reveal className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
        <span className="relative block h-14 w-px overflow-hidden bg-[oklch(0.9_0_0/0.18)]">
          <span data-scroll-dot className="absolute left-1/2 top-0 block h-3 w-px -translate-x-1/2 bg-[oklch(0.98_0_0)]" />
        </span>
      </div>
    </section>
  );
}
