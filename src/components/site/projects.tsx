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

  const idx = STAGES.findIndex((stage) => stage.id === activeId);
  const active = STAGES[idx]!;

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
      <ol className="relative">
        {STAGES.map((stage, index) => {
          const completed = index <= idx;
          const activeStage = stage.id === activeId;

          return (
            <li key={stage.id} className="relative pl-9">
              {index < STAGES.length - 1 && (
                <span
                  className="absolute left-[6px] top-[22px] h-full w-px"
                  style={{
                    background: completed
                      ? "color-mix(in oklab, var(--color-accent) 50%, transparent)"
                      : "var(--color-hairline)",
                    transition: "background 0.4s ease",
                  }}
                />
              )}

              <button
                type="button"
                onMouseEnter={() => setActiveId(stage.id)}
                onFocus={() => setActiveId(stage.id)}
                onClick={() => setActiveId(stage.id)}
                className="group block w-full py-3 text-left"
              >
                <span
                  className="absolute left-0 top-[18px] block h-[13px] w-[13px] rounded-full border"
                  style={{
                    borderColor: completed ? "var(--color-accent)" : "var(--color-border)",
                    background: activeStage ? "var(--color-accent)" : "var(--color-background)",
                    transition: "all 0.3s ease",
                  }}
                />

                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-[13px] font-medium tracking-[0.08em] text-muted-foreground">
                    0{index + 1}
                  </span>

                  <span
                    className={`font-display text-[1.2rem] tracking-tight transition-colors sm:text-[1.35rem] ${
                      activeStage ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {stage.label.toUpperCase()}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="rule-t pt-5">
          <p className="eyebrow">
            Stage {String(idx + 1).padStart(2, "0")} / {STAGES.length}
          </p>

          <p className="mt-4 max-w-lg font-display text-[1.15rem] leading-snug tracking-tight text-foreground sm:text-[1.25rem]">
            {active.note}
          </p>

          <p className="mt-3 max-w-md text-[17px] leading-7 text-muted-foreground">
            {active.detail}
          </p>
        </div>

        <div className="mt-7 flex max-w-lg flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] font-medium uppercase tracking-[0.11em] text-muted-foreground">
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

  const shown = FEATURES.find((feature) => feature.name === hover);

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
      <div>
        <p className="eyebrow mb-6">Feature contribution — illustrative</p>

        <div className="space-y-5">
          {FEATURES.map((feature) => {
            const pct = Math.abs(feature.weight) * 100;
            const positive = feature.weight > 0;

            return (
              <div
                key={feature.name}
                onMouseEnter={() => setHover(feature.name)}
                onMouseLeave={() => setHover(null)}
                className="cursor-default"
              >
                <div className="flex items-baseline justify-between font-mono text-[13px] font-medium uppercase tracking-[0.1em]">
                  <span
                    className={hover === feature.name ? "text-foreground" : "text-muted-foreground"}
                  >
                    {feature.name}
                  </span>

                  <span className={positive ? "text-accent" : "text-muted-foreground"}>
                    {feature.weight > 0 ? "+" : ""}
                    {feature.weight.toFixed(2)}
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
                      opacity: hover && hover !== feature.name ? 0.28 : 1,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 font-mono text-[13px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
          ← retains · churns →
        </p>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="rule-t pt-5">
          <p className="max-w-lg font-display text-[1.15rem] leading-snug tracking-tight text-foreground sm:text-[1.25rem]">
            {shown
              ? `${shown.name} pushes the prediction ${
                  shown.weight > 0 ? "toward churn" : "toward retention"
                }.`
              : "A prediction is only useful if you can explain why it was made."}
          </p>

          <p className="mt-3 max-w-md text-[17px] leading-7 text-muted-foreground">
            The system pairs a gradient-boosted classifier with per-prediction explainability, so a
            churn score arrives with its reasoning attached rather than as an opaque number.
          </p>
        </div>

        <div className="mt-7 flex max-w-lg flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] font-medium uppercase tracking-[0.11em] text-muted-foreground">
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
  const reveal = useReveal();

  return (
    <article ref={reveal.ref} className={`${reveal.className} rule-t pt-8 md:pt-12`}>
      <div className="grid grid-cols-12 gap-y-7 lg:gap-x-8">
        <div className="col-span-12 lg:col-span-2">
          <p className="font-mono text-[13px] font-medium tracking-[0.14em] text-accent">{index}</p>
        </div>

        <div className="col-span-12 lg:col-span-10">
          <div className="max-w-4xl">
            <h3 className="display text-[7.5vw] leading-[0.92] sm:text-[5.2vw] lg:text-[3vw]">
              {title}
            </h3>

            <p className="mt-5 max-w-xl text-[17px] leading-7 text-muted-foreground">{blurb}</p>
          </div>

          <div className="mt-12 md:mt-14">{children}</div>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-12 inline-flex items-center gap-3 border-b border-border pb-1 font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Source on GitHub
            <span>↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  const head = useReveal();

  return (
    <section id="work" className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-24 md:px-12 md:py-32">
      <div
        ref={head.ref}
        className={`${head.className} mb-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between md:mb-20`}
      >
        <h2 className="eyebrow">Selected work</h2>

        <p className="max-w-sm text-[17px] leading-7 text-muted-foreground sm:text-right">
          Interactive representations of engineering work — not live deployments.
        </p>
      </div>

      <div className="space-y-28 md:space-y-36">
        <ProjectCase
          index="01"
          title="AI TICKET WORKFLOW ENGINE"
          blurb="A retrieval-grounded pipeline that reads a support ticket, understands it, and drafts a reply a human can trust. Walk the pipeline below."
        >
          <PipelineFigure />
        </ProjectCase>

        <ProjectCase
          index="02"
          title="CUSTOMER CHURN ML SYSTEM"
          blurb="A churn model built around explainability first. Hover a feature to see how it moves a single prediction."
        >
          <ChurnFigure />
        </ProjectCase>
      </div>
    </section>
  );
}
