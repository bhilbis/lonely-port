"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "./ui";

gsap.registerPlugin(ScrollTrigger);

type Work = {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  href: string;
  external: boolean;
  hue: [string, string]; // gradient stops for the hover wash
};

const WORKS: Work[] = [
  {
    index: "01",
    title: "Ticketing App",
    subtitle: "Full-stack ticketing system",
    description:
      "Ticketing platform with an insight-heavy dashboard — data visualisation designed to be read at a glance.",
    tech: ["Next.js", "Laravel", "MySQL", "Tailwind", "Motion"],
    href: "https://github.com/bhilbis/ukk-ticketing-app",
    external: true,
    hue: ["rgba(91,127,255,0.16)", "rgba(56,189,248,0.10)"],
  },
  {
    index: "02",
    title: "Peripheral",
    subtitle: "Mobile e-commerce",
    description:
      "E-commerce for computer peripherals with a seamless, native-feeling mobile shopping flow.",
    tech: ["Flutter", "Dart", "Firebase"],
    href: "https://github.com/bhilbis/flutter-peripheral",
    external: true,
    hue: ["rgba(52,211,153,0.13)", "rgba(45,161,212,0.10)"],
  },
  {
    index: "03",
    title: "SMKN 1 Purwosari",
    subtitle: "School platform",
    description:
      "Modern school website with a dashboard giving a clear overview of school data and activity.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Motion"],
    href: "https://www.smkn1purwosari.sch.id/public/",
    external: true,
    hue: ["rgba(232,192,122,0.12)", "rgba(91,127,255,0.10)"],
  },
];

export default function Works() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".pf-work-row").forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 46 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 88%" },
          },
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={rootRef}
      className="relative px-6 md:px-14 lg:px-24 py-28 md:py-40"
      aria-label="Selected work"
    >
      <SectionHeader index="02" label="Selected Work" />

      <ul className="border-t" style={{ borderColor: "var(--pf-line)" }}>
        {WORKS.map((w) => (
          <li key={w.index}>
            <a
              href={w.href}
              target={w.external ? "_blank" : undefined}
              rel={w.external ? "noopener noreferrer" : undefined}
              data-cursor
              data-cursor-label="View"
              className="pf-work-row group relative block overflow-hidden border-b"
              style={{ borderColor: "var(--pf-line)" }}
            >
              {/* hover wash */}
              <span
                aria-hidden="true"
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(105deg, ${w.hue[0]}, ${w.hue[1]} 60%, transparent)`,
                }}
              />

              <div className="relative flex flex-col md:flex-row md:items-center gap-4 md:gap-10 py-9 md:py-12 md:pr-8 transition-transform duration-500 ease-out md:group-hover:translate-x-4">
                <span
                  className="pf-mono shrink-0"
                  style={{ fontSize: 11, color: "var(--pf-blue-soft)", letterSpacing: "0.2em" }}
                >
                  /{w.index}
                </span>

                <div className="flex-1 min-w-0">
                  <h3
                    className="pf-display transition-colors duration-300"
                    style={{
                      fontSize: "clamp(1.8rem, 5.2vw, 4rem)",
                      fontWeight: 700,
                      lineHeight: 1.05,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {w.title}
                  </h3>
                  <p
                    className="mt-2 max-w-xl hidden sm:block"
                    style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "var(--pf-ink-faint)" }}
                  >
                    {w.description}
                  </p>
                </div>

                <div className="flex md:flex-col md:items-end items-center justify-between gap-3 shrink-0">
                  <p className="pf-label" style={{ fontSize: 8, letterSpacing: "0.26em" }}>
                    {w.subtitle}
                  </p>
                  <div className="flex flex-wrap md:justify-end gap-x-3 gap-y-1 max-w-[240px]">
                    {w.tech.map((t) => (
                      <span
                        key={t}
                        className="pf-mono"
                        style={{ fontSize: 9, color: "var(--pf-ink-faint)", letterSpacing: "0.08em" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-5 w-5 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:translate-x-1"
                    style={{ color: "var(--pf-blue)" }}
                  />
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex justify-end">
        <a
          href="https://github.com/bhilbis"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor
          className="pf-underline pf-mono inline-flex items-center gap-2"
          style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--pf-ink-dim)" }}
        >
          FULL ARCHIVE ON GITHUB
          <ArrowUpRight className="h-3.5 w-3.5" style={{ color: "var(--pf-blue)" }} />
        </a>
      </div>
    </section>
  );
}
