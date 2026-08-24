"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { Magnetic, ScrambleText, useLocalTime } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/bhilbis" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/flexsy-bilbis-triwibowo/" },
];

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const time = useLocalTime();

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pf-cta-line",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".pf-cta", start: "top 78%" },
        },
      );
      gsap.fromTo(
        ".pf-contact-fade",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".pf-cta", start: "top 65%" },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={rootRef}
      className="relative flex min-h-svh flex-col justify-between px-6 md:px-14 lg:px-24 pt-28 md:pt-40 pb-8"
      aria-label="Contact"
    >
      <div className="pf-cta flex-1 flex flex-col justify-center">
        <p className="pf-label pf-contact-fade mb-8" style={{ opacity: 0 }}>
          04 — Transmission open
        </p>

        <h2
          className="pf-display select-none"
          style={{
            fontWeight: 800,
            fontSize: "clamp(2rem, 8vw, 7rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.035em",
          }}
        >
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="pf-cta-line block">LET&apos;S BUILD</span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="pf-cta-line pf-outline-text block">
              SOMETHING<span style={{ WebkitTextStroke: "0", color: "var(--pf-blue)" }}>.</span>
            </span>
          </span>
        </h2>

        <div className="mt-12 md:mt-16 flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
          <Magnetic strength={0.3}>
            <a
              href="mailto:lbbpramuka@gmail.com"
              data-cursor
              data-cursor-label="Email"
              className="group relative inline-flex h-36 w-36 md:h-44 md:w-44 items-center justify-center rounded-full"
              style={{ border: "1px solid var(--pf-line-2)" }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full scale-0 transition-transform duration-500 ease-out group-hover:scale-100"
                style={{ background: "rgba(91,127,255,0.14)" }}
              />
              <span className="relative flex items-center gap-2">
                <span
                  className="pf-mono"
                  style={{ fontSize: 11, letterSpacing: "0.22em", color: "var(--pf-ink)" }}
                >
                  SAY HELLO
                </span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  style={{ color: "var(--pf-blue)" }}
                />
              </span>
            </a>
          </Magnetic>

          <div className="pf-contact-fade flex flex-col gap-3" style={{ opacity: 0 }}>
            <a
              href="mailto:lbbpramuka@gmail.com"
              data-cursor
              className="pf-underline w-fit"
              style={{ fontSize: "clamp(1rem, 2.2vw, 1.35rem)", color: "var(--pf-ink-dim)" }}
            >
              lbbpramuka@gmail.com
            </a>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.75, color: "var(--pf-ink-faint)", maxWidth: 380 }}>
              Open for freelance projects, collaborations, or just a good
              conversation about interfaces and coffee.
            </p>
          </div>
        </div>
      </div>

      {/* footer */}
      <footer className="mt-24 border-t pt-6 pb-2" style={{ borderColor: "var(--pf-line)" }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor
                className="pf-mono pf-underline"
                style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--pf-ink-dim)" }}
              >
                <ScrambleText text={s.label.toUpperCase()} />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <span className="pf-mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--pf-ink-faint)" }}>
              {time ? `${time} WIB` : "— WIB"}
            </span>
            <span className="pf-mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--pf-ink-faint)" }}>
              © {new Date().getFullYear()} AoiXsy
            </span>
            <button
              type="button"
              data-cursor
              data-cursor-label="Top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="pf-mono pf-underline cursor-pointer"
              style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--pf-ink-dim)", background: "none", border: 0 }}
            >
              BACK TO ORBIT ↑
            </button>
          </div>
        </div>

        <p
          className="pf-mono mt-5 text-center md:text-left"
          style={{ fontSize: 8, letterSpacing: "0.3em", color: "rgba(140,160,210,0.22)" }}
        >
          DESIGNED &amp; ENGINEERED BY FLEXSY BILBIS — SIGNAL FROM THE VOID
        </p>
      </footer>
    </section>
  );
}
