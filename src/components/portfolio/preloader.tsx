"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const BOOT_LINES = [
  "INITIALIZING SIGNAL",
  "CALIBRATING ORBIT",
  "LOADING STARFIELD",
  "ESTABLISHING LINK",
];

/**
 * Counter + boot-log preloader, then splits open like shutter doors.
 * Calls onDone once the doors have cleared.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLParagraphElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const obj = { n: 0 };
    let lineIdx = -1;

    const tl = gsap.timeline();
    tl.to(obj, {
      n: 100,
      duration: 2.2,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(obj.n);
        if (numRef.current)
          numRef.current.textContent = String(v).padStart(3, "0");
        if (barRef.current) barRef.current.style.transform = `scaleX(${obj.n / 100})`;
        const idx = Math.min(
          BOOT_LINES.length - 1,
          Math.floor((obj.n / 100) * BOOT_LINES.length),
        );
        if (idx !== lineIdx && lineRef.current) {
          lineIdx = idx;
          lineRef.current.textContent = BOOT_LINES[idx];
        }
      },
    })
      .to(centerRef.current, { opacity: 0, y: -18, duration: 0.45, ease: "power3.in" })
      .to(topRef.current, { yPercent: -100, duration: 0.85, ease: "power4.inOut" }, "<0.1")
      .to(botRef.current, { yPercent: 100, duration: 0.85, ease: "power4.inOut" }, "<")
      .add(() => done.current())
      .set(rootRef.current, { display: "none" });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[200]" aria-hidden="true">
      {/* shutter halves */}
      <div
        ref={topRef}
        className="absolute inset-x-0 top-0 h-1/2"
        style={{ background: "var(--pf-void, #030308)", borderBottom: "1px solid rgba(126,152,220,0.10)" }}
      />
      <div
        ref={botRef}
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: "var(--pf-void, #030308)" }}
      />

      <div
        ref={centerRef}
        className="absolute inset-0 flex flex-col items-center justify-center gap-8"
      >
        <p
          className="pf-display"
          style={{
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "rgba(238,242,255,0.95)",
            textShadow: "0 0 60px rgba(91,127,255,0.5)",
          }}
        >
          AoiXsy
        </p>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-baseline gap-1">
            <span
              ref={numRef}
              className="pf-mono"
              style={{
                fontSize: "clamp(0.8rem, 2vw, 1rem)",
                color: "rgba(148,175,230,0.8)",
                letterSpacing: "0.14em",
                minWidth: "3ch",
                textAlign: "right",
              }}
            >
              000
            </span>
            <span className="pf-mono" style={{ fontSize: 10, color: "rgba(91,127,255,0.5)" }}>
              %
            </span>
          </div>

          <div
            className="overflow-hidden"
            style={{ width: "min(220px, 55vw)", height: 1, background: "rgba(91,127,255,0.14)" }}
          >
            <div
              ref={barRef}
              style={{
                height: "100%",
                width: "100%",
                transformOrigin: "left center",
                transform: "scaleX(0)",
                background:
                  "linear-gradient(to right, rgba(91,127,255,0.3), rgba(200,220,255,0.95), rgba(91,127,255,0.3))",
                boxShadow: "0 0 14px rgba(91,127,255,0.6)",
              }}
            />
          </div>

          <p
            ref={lineRef}
            className="pf-label pf-blink"
            style={{ fontSize: 8, letterSpacing: "0.44em" }}
          >
            {BOOT_LINES[0]}
          </p>
        </div>
      </div>
    </div>
  );
}
