"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const STATEMENT =
  "I build interfaces where engineering meets art direction — obsessing over motion, micro-detail, and how a product feels the moment it loads.";

const FACTS = [
  { k: "Base", v: "East Java, Indonesia" },
  { k: "Focus", v: "Web · Mobile · Design Systems" },
  { k: "Stack", v: "Next.js · Laravel · Flutter" },
  { k: "Fuel", v: "Coffee, mostly black" },
];

const STATS = [
  { n: "3+", label: "Years building" },
  { n: "10+", label: "Projects shipped" },
  { n: "4", label: "Certifications" },
];

export default function Manifesto() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      // word-by-word ink reveal, scrubbed to scroll
      gsap.fromTo(
        ".pf-word",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: ".pf-statement",
            start: "top 78%",
            end: "top 22%",
            scrub: 0.4,
          },
        },
      );

      gsap.fromTo(
        ".pf-fact",
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".pf-facts", start: "top 82%" },
        },
      );

      gsap.fromTo(
        ".pf-stat",
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".pf-stats", start: "top 85%" },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={rootRef}
      className="relative px-6 md:px-14 lg:px-24 py-28 md:py-40"
      aria-label="About"
    >
      <SectionHeader index="01" label="Manifesto" />

      <p
        className="pf-statement pf-display max-w-5xl"
        style={{
          fontSize: "clamp(1.6rem, 4.6vw, 3.6rem)",
          fontWeight: 600,
          lineHeight: 1.28,
          letterSpacing: "-0.02em",
        }}
      >
        {STATEMENT.split(" ").map((word, i) => (
          <span key={i} className="pf-word inline-block mr-[0.28em]">
            {word}
          </span>
        ))}
      </p>

      <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 max-w-5xl">
        {/* facts */}
        <dl className="pf-facts flex flex-col">
          {FACTS.map((f) => (
            <div
              key={f.k}
              className="pf-fact flex items-baseline justify-between gap-6 py-4 border-b"
              style={{ borderColor: "var(--pf-line)" }}
            >
              <dt className="pf-label" style={{ fontSize: 9 }}>{f.k}</dt>
              <dd
                className="text-right"
                style={{ fontSize: "0.92rem", color: "var(--pf-ink-dim)" }}
              >
                {f.v}
              </dd>
            </div>
          ))}
        </dl>

        {/* stats */}
        <div className="pf-stats grid grid-cols-3 gap-6 content-start">
          {STATS.map((s) => (
            <div key={s.label} className="pf-stat">
              <p
                className="pf-display"
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "var(--pf-ink)",
                }}
              >
                {s.n}
              </p>
              <p className="pf-label mt-2" style={{ fontSize: 8, letterSpacing: "0.24em" }}>
                {s.label}
              </p>
            </div>
          ))}

          <p
            className="col-span-3 mt-4"
            style={{ fontSize: "0.9rem", lineHeight: 1.85, color: "var(--pf-ink-faint)" }}
          >
            From my first lines of code at SMKN 1 Purwosari to shipping client
            work as a freelancer — every project is a chance to sweat the last
            2% most people skip.
          </p>
        </div>
      </div>
    </section>
  );
}
