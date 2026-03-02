"use client";
import { animate } from "animejs";
import { About } from "@/components/home/about";
import { Footer } from "@/components/home/footer";
import { FAQ } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { Projects } from "@/components/home/project-section/projects";
import { AnimatedProgressBar } from "@/components/ui/progress-bar";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { useMediaQuery } from "@uidotdev/usehooks";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

export default function Home() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    gsap.registerPlugin(ScrollTrigger);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      const sections = Array.from(main.querySelectorAll<HTMLElement>("section[id]")).filter(
        (section) => section.id !== "home",
      );

      sections.forEach((section, index) => {
        gsap.fromTo(
          section,
          { y: 86, autoAlpha: 0.35 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              end: "top 58%",
              scrub: 0.75,
            },
          },
        );

        const heading = section.querySelector<HTMLElement>("h2");
        if (heading) {
          ScrollTrigger.create({
            trigger: section,
            start: "top 78%",
            onEnter: () => {
              animate(heading, {
                translateY: [18, 0],
                opacity: [0.2, 1],
                duration: 680,
                delay: index * 40,
                ease: "outQuad",
              });
            },
            onEnterBack: () => {
              animate(heading, {
                translateY: [16, 0],
                opacity: [0.35, 1],
                duration: 520,
                ease: "outQuad",
              });
            },
          });
        }
      });
    }, main);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <main
        ref={mainRef}
        className="relative z-10 mb-[420px] min-h-svh overflow-hidden rounded-b-3xl bg-[oklch(0.12_0_0)] shadow-[0_50px_100px_rgba(0,0,0,0.45)]"
      >
        <Hero />
        <About />
        <Projects />
        <FAQ />
      </main>
      <Footer />
      <AnimatedProgressBar />
      {!isMobile && <SmoothCursor />}
    </>
  );
}
