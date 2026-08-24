"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import Starfield from "./starfield";
import Cursor from "./cursor";
import Preloader from "./preloader";
import Hero from "./hero";
import Manifesto from "./manifesto";
import Works from "./works";
import Journey from "./journey";
import Contact from "./contact";
import { Magnetic } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { index: "01", label: "About", href: "#about" },
  { index: "02", label: "Work", href: "#work" },
  { index: "03", label: "Journey", href: "#journey" },
  { index: "04", label: "Contact", href: "#contact" },
];

export default function Portfolio() {
  const [loaded, setLoaded] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  /* Lenis + GSAP ScrollTrigger sync */
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current && max > 0)
        progressRef.current.style.transform = `scaleX(${window.scrollY / max})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /* lock scroll during preloader */
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (!loaded) lenis.stop();
    else lenis.start();
  }, [loaded]);

  /* nav entrance */
  useEffect(() => {
    if (!loaded || !navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -24, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.3 },
    );
  }, [loaded]);

  const scrollTo = (href: string) => {
    lenisRef.current?.scrollTo(href, { duration: 1.4 });
  };

  return (
    <div className="pf-root pf-grain relative min-h-svh overflow-x-clip">
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}

      <Starfield />
      <Cursor />

      {/* scroll progress hairline */}
      <div
        ref={progressRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[90] h-px w-full origin-left"
        style={{
          transform: "scaleX(0)",
          background:
            "linear-gradient(to right, rgba(91,127,255,0.2), rgba(91,127,255,0.9))",
          boxShadow: "0 0 8px rgba(91,127,255,0.5)",
        }}
      />

      {/* nav */}
      <header
        ref={navRef}
        className="fixed top-0 inset-x-0 z-[85] opacity-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(3,3,8,0.82), rgba(3,3,8,0.35) 70%, transparent)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        <nav
          className="flex items-center justify-between px-6 md:px-14 lg:px-24 py-5"
          aria-label="Primary"
        >
          <Magnetic strength={0.25}>
            <button
              type="button"
              data-cursor
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="pf-display cursor-pointer"
              style={{
                fontSize: "1.05rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--pf-ink)",
                background: "none",
                border: 0,
              }}
            >
              AoiXsy<span style={{ color: "var(--pf-blue)" }}>.</span>
            </button>
          </Magnetic>

          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <button
                  type="button"
                  data-cursor
                  onClick={() => scrollTo(l.href)}
                  className="pf-underline pf-mono cursor-pointer"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "var(--pf-ink-dim)",
                    background: "none",
                    border: 0,
                  }}
                >
                  <span style={{ color: "var(--pf-blue-soft)", marginRight: 6 }}>
                    {l.index}
                  </span>
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          {/* mobile: jump straight to contact */}
          <button
            type="button"
            data-cursor
            onClick={() => scrollTo("#contact")}
            className="md:hidden pf-mono cursor-pointer"
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--pf-ink-dim)",
              background: "none",
              border: 0,
            }}
          >
            Contact
          </button>
        </nav>
      </header>

      {/* content */}
      <main className="relative z-10">
        <Hero started={loaded} />
        <Manifesto />
        <Works />
        <Journey />
        <Contact />
      </main>

      {/* edge vignette to seat the starfield */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(3,3,8,0.55) 100%)",
        }}
      />
    </div>
  );
}
