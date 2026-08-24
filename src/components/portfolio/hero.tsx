"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_ITEMS = [
  "Full-Stack Developer",
  "UI Engineering",
  "Motion & Interaction",
  "Design Systems",
  "Web · Mobile",
];

export default function Hero({ started }: { started: boolean }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!started || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.05 });
      tl.fromTo(".pf-hero-line",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.15,
          ease: "power4.out",
          stagger: 0.12,
        })
        .to(".pf-hero-fade", {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
        }, "-=0.65")
        .to(".pf-hero-rule", {
          scaleX: 1,
          duration: 1.1,
          ease: "power4.inOut",
        }, "-=0.9");

      // subtle parallax exit as you scroll away
      gsap.to(".pf-hero-inner", {
        yPercent: -14,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [started]);

  return (
    <section
      ref={rootRef}
      className="relative min-h-svh flex flex-col justify-between overflow-hidden"
      aria-label="Intro"
    >
      <div className="pf-hero-inner flex flex-1 flex-col justify-center px-6 md:px-14 lg:px-24 pt-28 pb-10">
        {/* status row */}
        <div
          className="pf-hero-fade flex items-center gap-3 mb-8 md:mb-10"
          style={{ opacity: 0, transform: "translateY(16px)" }}
        >
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ background: "var(--pf-blue)", animation: "pf-ping 2.2s cubic-bezier(0,0,0.2,1) infinite" }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--pf-blue)" }} />
          </span>
          <span className="pf-label" style={{ color: "rgba(152,178,232,0.75)" }}>
            Available for work
          </span>
          <span className="pf-label hidden sm:inline" style={{ letterSpacing: "0.2em" }}>
            · 07°38′S 112°44′E — East Java, ID
          </span>
        </div>

        {/* headline */}
        <h1
          className="pf-display select-none"
          style={{
            fontWeight: 800,
            fontSize: "clamp(3.4rem, 13.5vw, 11.5rem)",
            lineHeight: 0.93,
            letterSpacing: "-0.035em",
          }}
        >
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="pf-hero-line block">FLEXSY</span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="pf-hero-line pf-outline-text block">
              BILBIS<span style={{ WebkitTextStroke: "0", color: "var(--pf-blue)" }}>.</span>
            </span>
          </span>
        </h1>

        {/* sub row */}
        <div className="mt-10 md:mt-14 flex flex-col md:flex-row md:items-end md:justify-between gap-8 max-w-[1400px]">
          <p
            className="pf-hero-fade max-w-md"
            style={{
              opacity: 0,
              transform: "translateY(16px)",
              fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
              lineHeight: 1.85,
              color: "var(--pf-ink-dim)",
            }}
          >
            a.k.a{" "}
            <span style={{ color: "var(--pf-ink)" }}>AoiXsy</span> — a full-stack
            developer crafting immersive web &amp; mobile experiences, obsessive
            about motion, detail, and the feeling an interface leaves behind.
          </p>

          <div className="pf-hero-fade flex items-center gap-3" style={{ opacity: 0, transform: "translateY(16px)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"
              style={{ animation: "pf-float 2.6s ease-in-out infinite" }}>
              <path d="M12 5v14M6 13l6 6 6-6" stroke="rgba(91,127,255,0.6)"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="pf-label" style={{ fontSize: 8 }}>Scroll to explore</span>
          </div>
        </div>
      </div>

      {/* bottom marquee */}
      <div
        className="relative z-10 border-t"
        style={{ borderColor: "var(--pf-line)" }}
      >
        <span
          className="pf-hero-rule absolute -top-px left-0 h-px w-full origin-left"
          style={{ background: "var(--pf-line-2)", transform: "scaleX(0)" }}
        />
        <div className="overflow-hidden py-4 md:py-5" aria-hidden="true">
          <div className="pf-marquee-track" style={{ "--pf-marquee-dur": "40s" } as React.CSSProperties}>
            {[0, 1].map((half) => (
              <div key={half} className="flex shrink-0 items-center">
                {MARQUEE_ITEMS.map((item) => (
                  <span key={`${half}-${item}`} className="flex items-center">
                    <span
                      className="pf-display px-6 md:px-10 whitespace-nowrap"
                      style={{
                        fontSize: "clamp(0.8rem, 1.6vw, 1.05rem)",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--pf-ink-faint)",
                      }}
                    >
                      {item}
                    </span>
                    <span style={{ color: "var(--pf-blue-soft)", fontSize: 10 }}>✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
