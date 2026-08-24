"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Dot + lagging ring cursor. The ring inflates over interactive elements
 * (a, button, [data-cursor]) and shows an optional label from
 * [data-cursor-label]. Renders nothing on touch devices.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let raf = 0;
    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let hovering = false;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        ringPos.x = pos.x;
        ringPos.y = pos.y;
      }
      const target = (e.target as HTMLElement | null)?.closest(
        "a, button, [data-cursor]",
      ) as HTMLElement | null;
      const next = !!target;
      if (next !== hovering) {
        hovering = next;
        ring.style.width = ring.style.height = hovering ? "56px" : "28px";
        ring.style.borderColor = hovering
          ? "rgba(91,127,255,0.85)"
          : "rgba(160,182,240,0.45)";
        dot.style.transform = `translate(-50%,-50%) scale(${hovering ? 0.5 : 1})`;
      }
      const text = target?.getAttribute("data-cursor-label") ?? "";
      if (label.textContent !== text) label.textContent = text;
      label.style.opacity = text ? "1" : "0";
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      dot.style.left = `${pos.x}px`;
      dot.style.top = `${pos.y}px`;
      ring.style.left = `${ringPos.x}px`;
      ring.style.top = `${ringPos.y}px`;
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed z-[120] pointer-events-none rounded-full"
        style={{
          width: 6,
          height: 6,
          background: "#eef2ff",
          transform: "translate(-50%,-50%)",
          transition: "transform 0.25s ease",
          opacity: 0,
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed z-[119] pointer-events-none rounded-full flex items-center justify-center"
        style={{
          width: 28,
          height: 28,
          border: "1px solid rgba(160,182,240,0.45)",
          transform: "translate(-50%,-50%)",
          transition:
            "width 0.3s cubic-bezier(0.65,0,0.35,1), height 0.3s cubic-bezier(0.65,0,0.35,1), border-color 0.3s ease",
          opacity: 0,
        }}
      >
        <span
          ref={labelRef}
          className="pf-mono"
          style={{
            fontSize: 8,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(213,227,255,0.9)",
            opacity: 0,
            transition: "opacity 0.25s ease",
            whiteSpace: "nowrap",
          }}
        />
      </div>
    </>
  );
}
