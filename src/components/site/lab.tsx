import { useState } from "react";
import { GITHUB_URL } from "./data";
import { useReveal } from "./use-reveal";

function RagSketch() {
  const [k, setK] = useState(3);
  const chunks = Array.from({ length: 9 });
  return (
    <div>
      <div className="grid grid-cols-9 gap-1.5">
        {chunks.map((_, i) => (
          <span
            key={i}
            className="h-8 transition-all duration-500"
            style={{
              background:
                i < k ? "var(--color-accent)" : "color-mix(in oklab, var(--color-foreground) 8%, transparent)",
              opacity: i < k ? 0.85 : 1,
            }}
          />
        ))}
      </div>
      <input
        type="range"
        min={1}
        max={9}
        value={k}
        onChange={(e) => setK(Number(e.target.value))}
        aria-label="top-k chunks"
        className="mt-5 w-full accent-[var(--color-accent)]"
      />
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        top-k = {k} · retrieved context grows, precision falls
      </p>
    </div>
  );
}

function LatencySketch() {
  const [nodes, setNodes] = useState(2);
  const width = Math.max(10, 100 / nodes);
  return (
    <div>
      <div className="flex h-8 items-stretch gap-1.5">
        {Array.from({ length: nodes }).map((_, i) => (
          <span
            key={i}
            className="flex-1 border transition-all duration-500"
            style={{ borderColor: "var(--color-border)" }}
          />
        ))}
      </div>
      <div className="mt-4 h-px w-full bg-hairline">
        <span
          className="block h-[3px] -translate-y-px bg-foreground transition-all duration-500"
          style={{ width: `${width}%` }}
        />
      </div>
      <input
        type="range"
        min={1}
        max={8}
        value={nodes}
        onChange={(e) => setNodes(Number(e.target.value))}
        aria-label="worker count"
        className="mt-5 w-full accent-[var(--color-accent)]"
      />
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {nodes} workers · queue drains faster, coordination cost rises
      </p>
    </div>
  );
}

export function Lab() {
  const r = useReveal();
  return (
    <section
      id="lab"
      className="scroll-mt-24 border-t border-hairline py-24 md:py-32"
    >
      <div ref={r.ref} className={`${r.className} mx-auto max-w-[1400px] px-6 md:px-12`}>
        <div className="grid grid-cols-12 gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <p className="eyebrow">Lab</p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Small sketches of ideas I keep returning to. Drag the sliders.
            </p>
          </div>
          <div className="col-span-12 grid gap-14 sm:grid-cols-2 lg:col-span-8">
            <div>
              <p className="mb-6 font-display text-lg tracking-tight">Retrieval window</p>
              <RagSketch />
            </div>
            <div>
              <p className="mb-6 font-display text-lg tracking-tight">Queue throughput</p>
              <LatencySketch />
            </div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-12 gap-y-8">
          <div className="col-span-12 lg:col-span-4">
            <p className="eyebrow">GitHub</p>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="group block rule-t pt-8"
            >
              <span className="flex flex-wrap items-baseline justify-between gap-4">
                <span className="font-display text-3xl tracking-tight transition-colors group-hover:text-accent sm:text-4xl">
                  @kuldeepmandal
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Repositories, commits and experiments ↗
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
