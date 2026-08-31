import { useEffect, useRef } from "react";
import { GITHUB_URL } from "./data";

const NODES = [
  { x: 12, y: 22 },
  { x: 30, y: 10 },
  { x: 46, y: 30 },
  { x: 66, y: 16 },
  { x: 84, y: 34 },
  { x: 20, y: 52 },
  { x: 40, y: 66 },
  { x: 58, y: 50 },
  { x: 76, y: 68 },
  { x: 92, y: 56 },
  { x: 8, y: 80 },
  { x: 34, y: 90 },
  { x: 62, y: 86 },
  { x: 88, y: 90 },
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [2, 7],
  [7, 8],
  [4, 9],
  [8, 9],
  [5, 10],
  [6, 11],
  [8, 12],
  [9, 13],
  [6, 7],
  [11, 12],
  [12, 13],
  [1, 7],
];

/** Abstract system diagram that drifts gently toward the cursor. */
function SystemField() {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      tx = ((e.clientX - (r.left + r.width / 2)) / r.width) * 2;
      ty = ((e.clientY - (r.top + r.height / 2)) / r.height) * 2;
    };
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      svg.querySelectorAll<SVGGElement>("[data-depth]").forEach((g) => {
        const d = Number(g.dataset['depth']);
        g.setAttribute("transform", `translate(${cx * d} ${cy * d})`);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className="h-full w-full"
    >
      <g data-depth="2.4" stroke="var(--color-hairline)" strokeWidth="0.15">
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a]!.x}
            y1={NODES[a]!.y}
            x2={NODES[b]!.x}
            y2={NODES[b]!.y}
            strokeDasharray={i % 4 === 0 ? "1.5 2.5" : undefined}
            style={
              i % 4 === 0
                ? { animation: `dash-flow ${6 + (i % 3)}s linear infinite` }
                : undefined
            }
          />
        ))}
      </g>
      <g data-depth="4">
        {NODES.map((n, i) => (
          <g key={i}>
            <circle
              cx={n.x}
              cy={n.y}
              r={i % 5 === 0 ? 0.7 : 0.38}
              fill={i % 5 === 0 ? "var(--color-accent)" : "var(--color-muted-foreground)"}
              opacity={i % 5 === 0 ? 0.9 : 0.55}
            />
            {i % 5 === 0 && (
              <circle
                cx={n.x}
                cy={n.y}
                r="2.2"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="0.1"
                opacity="0.35"
              />
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}

export function Hero() {
  return (
    <section className="grain relative min-h-[100svh] overflow-hidden pt-28">
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <SystemField />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 15% 20%, transparent 30%, var(--color-background) 78%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-12 items-end gap-y-12">
          <div className="col-span-12 lg:col-span-9">
            <p className="eyebrow mb-8 flex items-center gap-3">
              <span className="inline-block h-px w-10 bg-border" />
              Software Engineer — Bengaluru, India
            </p>
            <h1 className="display text-[15vw] leading-[0.86] sm:text-[12vw] lg:text-[8.4vw]">
              KULDEEP
              <br />
              <span className="text-muted-foreground">MANDAL</span>
            </h1>
          </div>

          <div className="col-span-12 mt-6 lg:col-span-8 lg:col-start-5">
            <p className="max-w-xl font-display text-2xl leading-[1.18] tracking-tight text-foreground sm:text-3xl">
              Building AI systems that{" "}
              <span className="text-accent">actually ship</span>.
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              Backend and full-stack engineering, applied AI, and the plumbing in between.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="group inline-flex items-center gap-3 border border-foreground px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Explore work
                <span className="transition-transform group-hover:translate-x-1">↓</span>
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 border border-border px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                View GitHub
                <span className="transition-transform group-hover:translate-x-1">↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 rule-t py-5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>Currently at Atraya Technologies</span>
          <span className="hidden sm:inline">AI systems · Backend · Full-stack</span>
          <span className="text-accent">↓ scroll</span>
        </div>
      </div>
    </section>
  );
}
