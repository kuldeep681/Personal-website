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

      if (!rect.width || !rect.height) return;

      const normalizedX =
        (event.clientX - (rect.left + rect.width / 2)) / rect.width;

      const normalizedY =
        (event.clientY - (rect.top + rect.height / 2)) / rect.height;

      targetX = normalizedX * 2.2;
      targetY = normalizedY * 2.2;
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const tick = () => {
      /*
       * Deliberately slow interpolation.
       * This keeps the mesh floating behind the content
       * instead of visibly following the cursor.
       */
      currentX += (targetX - currentX) * 0.028;
      currentY += (targetY - currentY) * 0.028;

      svg
        .querySelectorAll<SVGGElement>("[data-depth]")
        .forEach((group) => {
          const depth = Number(group.dataset["depth"] ?? 1);

          group.setAttribute(
            "transform",
            `translate(${currentX * depth} ${currentY * depth})`,
          );
        });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, {
      passive: true,
    });

    svg.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);

      window.removeEventListener("pointermove", onMove);
      svg.removeEventListener("mouseleave", onLeave);
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
      {/* Network lines */}
      <g
        data-depth="1.8"
        stroke="var(--color-hairline)"
        strokeWidth="0.15"
        opacity="0.9"
      >
        {EDGES.map(([a, b], index) => {
          const from = NODES[a]!;
          const to = NODES[b]!;

          const animated = index % 4 === 0;

          return (
            <line
              key={index}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              strokeDasharray={animated ? "1.5 2.5" : undefined}
              style={
                animated
                  ? {
                      animation: `dash-flow ${
                        10 + (index % 4) * 2
                      }s linear infinite`,
                    }
                  : undefined
              }
            />
          );
        })}
      </g>

      {/* Network nodes */}
      <g data-depth="3">
        {NODES.map((node, index) => {
          const active = index % 5 === 0;

          return (
            <g key={index}>
              <circle
                cx={node.x}
                cy={node.y}
                r={active ? 0.7 : 0.36}
                fill={
                  active
                    ? "var(--color-accent)"
                    : "var(--color-muted-foreground)"
                }
                opacity={active ? 0.82 : 0.46}
              />

              {active && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="2.2"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="0.1"
                  opacity="0.3"
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
  const scrollToWork = () => {
    document.getElementById("work")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="grain relative min-h-[92svh] overflow-hidden pt-28 md:min-h-[94svh] md:pt-32">
      {/* Interactive system mesh */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.78]">
        <SystemField />
      </div>

      {/* Content fade / readability layer */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(100% 78% at 18% 20%, transparent 18%, var(--color-background) 84%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-y-10 md:gap-y-12">
          {/* Identity */}
          <div className="col-span-12 lg:col-span-9">
            <p className="eyebrow mb-7 flex items-center gap-3 md:mb-8">
              <span className="inline-block h-px w-8 bg-border transition-all duration-500 md:w-10" />

              <span>Software Engineer — Bengaluru, India</span>
            </p>

            <h1 className="display max-w-4xl text-[19vw] leading-[0.88] tracking-[-0.045em] sm:text-[13vw] md:text-[11vw] lg:text-[7.2vw]">
              KULDEEP
              <br />
              <span className="text-muted-foreground">MANDAL</span>
            </h1>
          </div>

          {/* Introduction */}
          <div className="col-span-12 lg:col-span-7 lg:col-start-5">
            <p className="max-w-xl font-display text-[1.65rem] leading-[1.12] tracking-[-0.025em] text-foreground sm:text-3xl md:text-[2.15rem]">
              I build systems that think, scale, and{" "}
              <span className="text-accent">ship</span>.
            </p>

            <p className="mt-4 max-w-md text-[16px] leading-7 text-muted-foreground">
              Software engineer working across backend systems, applied AI,
              and full-stack products — building APIs, data-driven services,
              and intelligent workflows from the ground up.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-2.5 md:mt-9">
              <a
                href="#work"
                className="group inline-flex items-center gap-3 border border-foreground px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-foreground transition-all duration-300 hover:bg-foreground hover:text-background active:scale-[0.98]"
              >
                <span>Explore work</span>

                <span className="transition-transform duration-300 group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>

              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 border border-border px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground transition-all duration-300 hover:border-accent hover:text-accent active:scale-[0.98]"
              >
                <span>View GitHub</span>

                <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Hero metadata */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rule-t py-5 font-mono text-[13px] font-medium uppercase leading-6 tracking-[0.13em] text-muted-foreground md:mt-16">
          <span>BUILDING AI-DRIVEN SOFTWARE</span>

          <span className="hidden sm:inline">
            Machine Learning · Applied AI · RAG · Backend systems
          </span>

          <button
            type="button"
            onClick={scrollToWork}
            className="group flex cursor-pointer items-center gap-2 text-accent transition-colors duration-300 hover:text-foreground"
            aria-label="Scroll to selected work"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-125" />

            <span>Scroll to work</span>

            <span className="transition-transform duration-300 group-hover:translate-y-1">
              ↓
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}