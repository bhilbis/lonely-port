"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "./ui";
import { experience, achievements } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Journey() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      // spine draws itself as you scroll through the timeline
      gsap.fromTo(
        ".pf-spine",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".pf-timeline",
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.5,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>(".pf-tl-item").forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: -26 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 85%" },
          },
        );
      });

      gsap.fromTo(
        ".pf-cert",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".pf-certs", start: "top 85%" },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journey"
      ref={rootRef}
      className="relative px-6 md:px-14 lg:px-24 py-28 md:py-40"
      aria-label="Journey"
    >
      <SectionHeader index="03" label="Flight Log" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24">
        {/* timeline */}
        <div className="pf-timeline relative pl-8">
          <span
            aria-hidden="true"
            className="pf-spine absolute left-0 top-1 bottom-1 w-px origin-top"
            style={{ background: "linear-gradient(to bottom, var(--pf-blue), rgba(91,127,255,0.08))" }}
          />
          <ol className="flex flex-col gap-14">
            {experience.map((e) => (
              <li key={e.title} className="pf-tl-item relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-8 top-[7px] h-[7px] w-[7px] -translate-x-[3px] rounded-full"
                  style={{
                    background: "var(--pf-blue)",
                    boxShadow: "0 0 12px 2px rgba(91,127,255,0.55)",
                  }}
                />
                <p className="pf-mono mb-2" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--pf-blue-soft)" }}>
                  {e.year.toUpperCase()}
                </p>
                <h3
                  className="pf-display"
                  style={{ fontSize: "clamp(1.15rem, 2.2vw, 1.5rem)", fontWeight: 600, letterSpacing: "-0.015em" }}
                >
                  {e.title}
                </h3>
                <p className="mt-2 max-w-md" style={{ fontSize: "0.88rem", lineHeight: 1.75, color: "var(--pf-ink-faint)" }}>
                  {e.description}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* certifications */}
        <div>
          <p className="pf-label mb-8" style={{ fontSize: 9 }}>
            Certifications &amp; Credentials
          </p>
          <ul className="pf-certs flex flex-col">
            {achievements.map((a) => (
              <li
                key={a.title}
                className="pf-cert group py-5 border-b transition-colors duration-300"
                style={{ borderColor: "var(--pf-line)" }}
              >
                <div className="flex items-baseline justify-between gap-6">
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      color: "var(--pf-ink)",
                      lineHeight: 1.5,
                    }}
                  >
                    {a.title}
                  </h4>
                  <span className="pf-mono shrink-0" style={{ fontSize: 9, color: "var(--pf-ink-faint)" }}>
                    {a.date}
                  </span>
                </div>
                <div className="mt-1.5 flex items-baseline justify-between gap-6">
                  <p style={{ fontSize: "0.8rem", color: "var(--pf-ink-faint)" }}>{a.org}</p>
                  {a.credential !== "—" && (
                    <span
                      className="pf-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ fontSize: 8, letterSpacing: "0.12em", color: "var(--pf-blue-soft)" }}
                    >
                      ID · {a.credential}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
