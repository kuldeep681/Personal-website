import { useEffect, useRef, useState } from "react";
import { KERNEL_MENU } from "./data";

type Pos = { x: number; y: number };

/**
 * Kernel — a tiny pixel companion. Follows the cursor with a lazy spring,
 * looks toward it, blinks, reacts to clicks, and opens a small nav menu.
 */
export function Kernel() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [touch, setTouch] = useState(false);
  const [squish, setSquish] = useState(false);
  const [awake, setAwake] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const eyesRef = useRef<HTMLDivElement | null>(null);
  const pos = useRef<Pos>({ x: 0, y: 0 });
  const target = useRef<Pos>({ x: 0, y: 0 });
  const vel = useRef<Pos>({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const coarse =
      typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    setTouch(coarse);
    if (coarse) return;

    pos.current = { x: window.innerWidth / 2, y: window.innerHeight * 0.7 };
    target.current = { ...pos.current };

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX + 34, y: e.clientY + 30 };
      setAwake(true);
    };
    const onDown = () => {
      setSquish(true);
      window.setTimeout(() => setSquish(false), 220);
    };
    const tick = () => {
      // spring physics toward the trailing target
      const k = 0.055;
      const damp = 0.82;
      vel.current.x = (vel.current.x + (target.current.x - pos.current.x) * k) * damp;
      vel.current.y = (vel.current.y + (target.current.y - pos.current.y) * k) * damp;
      pos.current.x += vel.current.x;
      pos.current.y += vel.current.y;
      if (bodyRef.current) {
        bodyRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      if (eyesRef.current) {
        const dx = Math.max(-1.6, Math.min(1.6, (target.current.x - pos.current.x) / 22));
        const dy = Math.max(-1.4, Math.min(1.4, (target.current.y - pos.current.y) / 22));
        eyesRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!mounted) return null;

  const sprite = (
    <button
      type="button"
      aria-label="Kernel — open navigation"
      onClick={(e) => {
        e.stopPropagation();
        setOpen((v) => !v);
      }}
      className="group relative grid h-11 w-11 place-items-center"
    >
      <span
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-accent) 22%, transparent), transparent 70%)",
        }}
      />
      <span
        className="relative block transition-transform duration-200"
        style={{
          animation: "kernel-idle 3.2s ease-in-out infinite",
          transform: squish ? "scale(0.82)" : undefined,
        }}
      >
        <svg width="26" height="26" viewBox="0 0 13 13" shapeRendering="crispEdges">
          {/* head shell — pixel blocks */}
          <g fill="currentColor" className="text-foreground">
            <rect x="3" y="1" width="7" height="1" />
            <rect x="2" y="2" width="1" height="8" />
            <rect x="10" y="2" width="1" height="8" />
            <rect x="3" y="10" width="7" height="1" />
            <rect x="3" y="2" width="7" height="8" opacity="0.14" />
            <rect x="6" y="0" width="1" height="1" opacity="0.55" />
          </g>
          <g ref={eyesRef as never} className="text-foreground" fill="currentColor">
            <rect
              x="4"
              y="5"
              width="1"
              height={squish ? 1 : 2}
              style={{ animation: "blink-caret 6s steps(1) infinite" }}
            />
            <rect
              x="8"
              y="5"
              width="1"
              height={squish ? 1 : 2}
              style={{ animation: "blink-caret 6s steps(1) infinite" }}
            />
          </g>
          <rect x="6" y="8" width="1" height="1" className="fill-accent" opacity="0.9" />
        </svg>
      </span>
    </button>
  );

  const menu = open && (
    <div
      className="absolute bottom-full right-0 mb-3 w-56 border border-border bg-popover/95 backdrop-blur-md"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-hairline px-3 py-2">
        <span className="eyebrow">Kernel</span>
        <span className="font-mono text-[10px] text-accent">online</span>
      </div>
      <nav className="py-1">
        {KERNEL_MENU.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noreferrer" : undefined}
            onClick={() => setOpen(false)}
            className="flex items-baseline gap-3 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <span className="text-accent/70">{item.index}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );

  if (touch) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <div className="relative">
          {menu}
          <div className="border border-border bg-background/80 p-1 backdrop-blur">{sprite}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={bodyRef}
      className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
      style={{ opacity: awake ? 1 : 0, transition: "opacity 0.8s ease" }}
    >
      <div className="pointer-events-auto relative -translate-x-1/2 -translate-y-1/2">
        {menu}
        {sprite}
      </div>
    </div>
  );
}
