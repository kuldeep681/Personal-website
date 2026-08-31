import { useEffect, useRef } from "react";
import { GITHUB_URL } from "./data";

const NODES = [
  { x: 8, y: 12 },
  { x: 24, y: 6 },
  { x: 42, y: 16 },
  { x: 61, y: 8 },
  { x: 79, y: 18 },
  { x: 94, y: 10 },
  { x: 15, y: 30 },
  { x: 34, y: 25 },
  { x: 52, y: 34 },
  { x: 71, y: 27 },
  { x: 88, y: 35 },
  { x: 5, y: 48 },
  { x: 22, y: 44 },
  { x: 41, y: 53 },
  { x: 59, y: 46 },
  { x: 77, y: 55 },
  { x: 96, y: 48 },
  { x: 13, y: 67 },
  { x: 31, y: 62 },
  { x: 49, y: 72 },
  { x: 68, y: 64 },
  { x: 86, y: 73 },
  { x: 4, y: 86 },
  { x: 23, y: 82 },
  { x: 42, y: 92 },
  { x: 62, y: 84 },
  { x: 81, y: 93 },
  { x: 96, y: 85 },
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [0, 6],
  [1, 7],
  [2, 8],
  [3, 9],
  [4, 10],
  [6, 7],
  [7, 8],
  [8, 9],
  [9, 10],
  [6, 11],
  [6, 12],
  [7, 12],
  [7, 13],
  [8, 13],
  [8, 14],
  [9, 14],
  [9, 15],
  [10, 15],
  [10, 16],
  [11, 12],
  [12, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [11, 17],
  [12, 18],
  [13, 19],
  [14, 20],
  [15, 21],
  [17, 18],
  [18, 19],
  [19, 20],
  [20, 21],
  [17, 22],
  [18, 23],
  [19, 24],
  [20, 25],
  [21, 26],
  [22, 23],
  [23, 24],
  [24, 25],
  [25, 26],
  [26, 27],
];

function SystemField() {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = ref.current;

    if (!svg) return;

    let raf = 0;

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    const onMove = (event: PointerEvent) => {
      const rect = svg.getBoundingClientRect();

      targetX = ((event.clientX - (rect.left + rect.width / 2)) / rect.width) * 1.5;

      targetY = ((event.clientY - (rect.top + rect.height / 2)) / rect.height) * 1.5;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.045;
      currentY += (targetY - currentY) * 0.045;

      svg.querySelectorAll<SVGGElement>("[data-depth]").forEach((group) => {
        const depth = Number(group.dataset["depth"] ?? 1);

        group.setAttribute("transform", `translate(${currentX * depth} ${currentY * depth})`);
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, {
      passive: true,
    });

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
      aria-hidden="true"
      className="h-full w-full"
    >
      <g data-depth="1.8" stroke="var(--color-hairline)" strokeWidth="0.15" opacity="0.8">
        {EDGES.map(([a, b], index) => {
          const from = NODES[a]!;
          const to = NODES[b]!;

          return (
            <line
              key={index}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              strokeDasharray={index % 4 === 0 ? "1.5 2.5" : undefined}
              style={
                index % 4 === 0
                  ? {
                      animation: `dash-flow ${7 + (index % 3)}s linear infinite`,
                    }
                  : undefined
              }
            />
          );
        })}
      </g>

      <g data-depth="3">
        {NODES.map((node, index) => {
          const active = index % 5 === 0;

          return (
            <g key={index}>
              <circle
                cx={node.x}
                cy={node.y}
                r={active ? 0.65 : 0.34}
                fill={active ? "var(--color-accent)" : "var(--color-muted-foreground)"}
                opacity={active ? 0.78 : 0.42}
              />

              {active && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="2"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="0.1"
                  opacity="0.28"
                />
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function Hero() {
  return (
    <section className="grain relative min-h-[100svh] overflow-hidden pt-28 md:pt-32">
      <div className="pointer-events-none absolute inset-0 opacity-75">
        <SystemField />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(100% 75% at 18% 22%, transparent 20%, var(--color-background) 82%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-y-12">
          <div className="col-span-12 lg:col-span-9">
            <p className="eyebrow mb-7 flex items-center gap-3 md:mb-8">
              <span className="inline-block h-px w-8 bg-border md:w-10" />
              Software Engineer — Bengaluru, India
            </p>

            <h1 className="display max-w-4xl text-[19vw] leading-[0.88] sm:text-[13vw] md:text-[11vw] lg:text-[7.2vw]">
              KULDEEP
              <br />
              <span className="text-muted-foreground">MANDAL</span>
            </h1>
          </div>

          <div className="col-span-12 lg:col-span-7 lg:col-start-5">
            <p className="max-w-xl font-display text-[1.65rem] leading-[1.12] tracking-[-0.025em] text-foreground sm:text-3xl md:text-[2.15rem]">
              Building AI systems that <span className="text-accent">actually ship</span>.
            </p>

            <p className="mt-4 max-w-md text-[16px] leading-7 text-muted-foreground">
              Backend and full-stack engineering, applied AI, and the plumbing in between.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2.5 md:mt-9">
              <a
                href="#work"
                className="group inline-flex items-center gap-3 border border-foreground px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Explore work
                <span className="transition-transform group-hover:translate-y-0.5">↓</span>
              </a>

              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 border border-border px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                View GitHub
                <span className="transition-transform group-hover:translate-x-0.5">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Hero metadata */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rule-t py-5 font-mono text-[13px] font-medium uppercase leading-6 tracking-[0.13em] text-muted-foreground md:mt-20">
          <span>Currently at Atraya Technologies</span>

          <span className="hidden sm:inline">AI systems · Backend · Full-stack</span>

          <span className="text-accent">↓ scroll</span>
        </div>
      </div>
    </section>
  );
}
