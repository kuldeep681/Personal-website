import { useState } from "react";
import { GITHUB_URL } from "./data";
import { useReveal } from "./use-reveal";

const STAGES = [
  {
    id: "input",
    label: "Input",
    note: "A raw support ticket arrives — unstructured text, no metadata.",
    detail: "Normalised, deduplicated and queued for downstream processing.",
  },
  {
    id: "classification",
    label: "Classification",
    note: "Intent and category are inferred from the ticket body.",
    detail: "A lightweight classifier routes the ticket into a known domain.",
  },
  {
    id: "priority",
    label: "Priority",
    note: "Urgency is scored from language, entity and context signals.",
    detail: "Scoring decides queue placement rather than a hard SLA promise.",
  },
  {
    id: "retrieval",
    label: "Retrieval",
    note: "Relevant documents and prior resolutions are fetched.",
    detail: "Vector search over an internal knowledge corpus, top-k filtered.",
  },
  {
    id: "rag",
    label: "RAG",
    note: "Retrieved context is grounded into the generation prompt.",
    detail: "Context windows are trimmed so answers cite what actually exists.",
  },
  {
    id: "response",
    label: "Response",
    note: "A drafted reply is returned for human review.",
    detail: "Human-in-the-loop by design — the engine drafts, a person sends.",
  },
];

function PipelineFigure() {
  const [activeId, setActiveId] = useState(STAGES[0]!.id);
  const idx = STAGES.findIndex((s) => s.id === activeId);
  const active = STAGES[idx]!;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
      <ol className="relative">
        {STAGES.map((s, i) => {
          const on = i <= idx;
          return (
            <li key={s.id} className="relative pl-10">
              {i < STAGES.length - 1 && (
                <span
                  className="absolute left-[7px] top-5 h-full w-px"
                  style={{
                    background: on
                      ? "color-mix(in oklab, var(--color-accent) 55%, transparent)"
                      : "var(--color-hairline)",
                    transition: "background 0.5s ease",
                  }}
                />
              )}
              <button
                type="button"
                onMouseEnter={() => setActiveId(s.id)}
                onFocus={() => setActiveId(s.id)}
                onClick={() => setActiveId(s.id)}
                className="group block w-full py-3 text-left"
              >
                <span
                  className="absolute left-0 top-[18px] block h-[15px] w-[15px] rounded-full border"
                  style={{
                    borderColor: on ? "var(--color-accent)" : "var(--color-border)",
                    background:
                      s.id === activeId ? "var(--color-accent)" : "var(--color-background)",
                    transition: "all 0.35s ease",
                  }}
                />
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    0{i + 1}
                  </span>
                  <span
                    className={`font-display text-2xl tracking-tight transition-colors sm:text-3xl ${
                      s.id === activeId ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.label.toUpperCase()}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="lg:sticky lg:top-32 lg:self-start">
        <div className="rule-t pt-6">
          <p className="eyebrow">
            Stage {String(idx + 1).padStart(2, "0")} / {STAGES.length}
          </p>
          <p className="mt-5 font-display text-xl leading-snug tracking-tight text-foreground">
            {active.note}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {active.detail}
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>Python</span>
          <span>FastAPI</span>
          <span>Vector search</span>
          <span>LLM orchestration</span>
          <span>Postgres</span>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  { name: "Tenure", weight: -0.42 },
  { name: "Monthly charges", weight: 0.31 },
  { name: "Contract type", weight: -0.27 },
  { name: "Support contacts", weight: 0.22 },
  { name: "Add-on services", weight: -0.14 },
];

function ChurnFigure() {
  const [hover, setHover] = useState<string | null>(null);
  const shown = FEATURES.find((f) => f.name === hover);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
      <div>
        <p className="eyebrow mb-6">Feature contribution — illustrative</p>
        <div className="space-y-5">
          {FEATURES.map((f) => {
            const pct = Math.abs(f.weight) * 100;
            const positive = f.weight > 0;
            return (
              <div
                key={f.name}
                onMouseEnter={() => setHover(f.name)}
                onMouseLeave={() => setHover(null)}
                className="cursor-default"
              >
                <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.14em]">
                  <span
                    className={
                      hover === f.name ? "text-foreground" : "text-muted-foreground"
                    }
                  >
                    {f.name}
                  </span>
                  <span className={positive ? "text-accent" : "text-muted-foreground"}>
                    {f.weight > 0 ? "+" : ""}
                    {f.weight.toFixed(2)}
                  </span>
                </div>
                <div className="relative mt-2 h-px w-full bg-hairline">
                  <span className="absolute left-1/2 top-[-3px] h-[7px] w-px bg-border" />
                  <span
                    className="absolute top-[-1px] h-[3px] transition-all duration-500"
                    style={{
                      width: `${pct / 2}%`,
                      left: positive ? "50%" : `${50 - pct / 2}%`,
                      background: positive
                        ? "var(--color-accent)"
                        : "var(--color-muted-foreground)",
                      opacity: hover && hover !== f.name ? 0.3 : 1,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          ← retains · churns →
        </p>
      </div>

      <div className="lg:sticky lg:top-32 lg:self-start">
        <div className="rule-t pt-6">
          <p className="font-display text-xl leading-snug tracking-tight text-foreground">
            {shown
              ? `${shown.name} pushes the prediction ${shown.weight > 0 ? "toward churn" : "toward retention"}.`
              : "A prediction is only useful if you can explain why it was made."}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            The system pairs a gradient-boosted classifier with per-prediction
            explainability, so a churn score arrives with its reasoning attached rather
            than as an opaque number.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>Python</span>
          <span>scikit-learn</span>
          <span>Pandas</span>
          <span>SHAP</span>
        </div>
      </div>
    </div>
  );
}

function ProjectCase({
  index,
  title,
  blurb,
  children,
}: {
  index: string;
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  const r = useReveal();
  return (
    <article ref={r.ref} className={`${r.className} rule-t pt-10 md:pt-16`}>
      <div className="grid grid-cols-12 gap-y-8">
        <div className="col-span-12 lg:col-span-3">
          <p className="font-mono text-[11px] tracking-[0.2em] text-accent">{index}</p>
        </div>
        <div className="col-span-12 lg:col-span-9">
          <h3 className="display max-w-3xl text-[9vw] sm:text-[6vw] lg:text-[3.8vw]">
            {title}
          </h3>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {blurb}
          </p>
          <div className="mt-14">{children}</div>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-14 inline-flex items-center gap-3 border-b border-border pb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Source on GitHub <span>↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  const head = useReveal();
  return (
    <section id="work" className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-28 md:px-12 md:py-40">
      <div ref={head.ref} className={`${head.className} mb-20 flex items-end justify-between gap-8`}>
        <h2 className="eyebrow">Selected work</h2>
        <p className="max-w-xs text-right text-xs leading-relaxed text-muted-foreground">
          Interactive representations of engineering work — not live deployments.
        </p>
      </div>

      <div className="space-y-32 md:space-y-48">
        <ProjectCase
          index="01"
          title={"AI TICKET WORKFLOW ENGINE"}
          blurb="A retrieval-grounded pipeline that reads a support ticket, understands it, and drafts a reply a human can trust. Walk the pipeline below."
        >
          <PipelineFigure />
        </ProjectCase>

        <ProjectCase
          index="02"
          title={"CUSTOMER CHURN ML SYSTEM"}
          blurb="A churn model built around explainability first. Hover a feature to see how it moves a single prediction."
        >
          <ChurnFigure />
        </ProjectCase>
      </div>
    </section>
  );
}
