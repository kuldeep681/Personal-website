import { useEffect, useRef } from "react";

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

/**
 * Global technical network.
 *
 * Uses the same visual language as the original
 * Hero SystemField:
 *
 * - thin network connections
 * - sparse technical nodes
 * - restrained amber highlights
 * - slow cursor parallax
 *
 * The network sits behind the entire portfolio.
 */
export function BackgroundMesh() {
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
      const width = window.innerWidth;
      const height = window.innerHeight;

      targetX = ((event.clientX - width / 2) / width) * 2;
      targetY = ((event.clientY - height / 2) / height) * 2;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.035;
      currentY += (targetY - currentY) * 0.035;

      const groups = svg.querySelectorAll<SVGGElement>("[data-depth]");

      groups.forEach((group) => {
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
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <svg
        ref={ref}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        {/* Network connections */}
        <g data-depth="1.2" stroke="var(--color-hairline)" strokeWidth="0.12" opacity="0.72">
          {EDGES.map(([a, b], index) => {
            const from = NODES[a]!;
            const to = NODES[b]!;

            return (
              <line
                key={`${a}-${b}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                strokeDasharray={index % 7 === 0 ? "1.5 3" : undefined}
                style={
                  index % 7 === 0
                    ? {
                        animation: `dash-flow ${8 + (index % 4)}s linear infinite`,
                      }
                    : undefined
                }
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g data-depth="2">
          {NODES.map((node, index) => {
            const active = index % 8 === 0;

            return (
              <g key={index}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={active ? 0.48 : 0.25}
                  fill={active ? "var(--color-accent)" : "var(--color-muted-foreground)"}
                  opacity={active ? 0.62 : 0.3}
                />

                {active && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="1.8"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="0.08"
                    opacity="0.18"
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export default BackgroundMesh;
