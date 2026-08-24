"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* ── Magnetic ─────────────────────────────────────────────────────────────
   Pulls its child toward the cursor while hovered, springs back on leave. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    },
    [strength],
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        display: "inline-block",
        transition: "transform 0.5s cubic-bezier(0.2, 1, 0.3, 1)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

/* ── ScrambleText ─────────────────────────────────────────────────────────
   Decodes glyph noise into the real text on hover (or on mount). */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@*+=/";

export function ScrambleText({
  text,
  className,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "p" | "div";
}) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    frame.current = 0;
    timer.current = setInterval(() => {
      frame.current += 1;
      const progress = frame.current / 14;
      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i / text.length < progress) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );
      if (progress >= 1) {
        if (timer.current) clearInterval(timer.current);
        setDisplay(text);
      }
    }, 34);
  }, [text]);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return (
    <Tag className={className} onMouseEnter={scramble} aria-label={text}>
      {display}
    </Tag>
  );
}

/* ── SectionHeader ────────────────────────────────────────────────────────
   Mission-control style: index, hairline, uppercase mono label. */
export function SectionHeader({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-5 mb-12 md:mb-16" data-reveal>
      <span
        className="pf-mono"
        style={{ fontSize: 11, color: "var(--pf-blue)", letterSpacing: "0.2em" }}
      >
        {index}
      </span>
      <span
        className="block h-px flex-1"
        style={{ background: "var(--pf-line)" }}
      />
      <span className="pf-label">{label}</span>
    </div>
  );
}

/* ── useLocalTime ─────────────────────────────────────────────────────────
   Live WIB clock, hydration-safe (empty until mounted). */
export function useLocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
