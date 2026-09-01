import { useState } from "react";
import { useReveal } from "./use-reveal";

type Decision = {
  id: string;
  question: string;
  options: {
    label: string;
    take: string;
    chosen?: boolean;
  }[];
};

const DECISIONS: Decision[] = [
  {
    id: "ingest",
    question: "How do tickets enter the system?",
    options: [
      {
        label: "Synchronous API call",
        take: "Simplest to reason about, but classification latency becomes the client's problem.",
      },
      {
        label: "Durable queue",
        take: "Accept fast, process independently. Retries and backpressure stop being emergencies.",
        chosen: true,
      },
    ],
  },
  {
    id: "model",
    question: "Where does the model live?",
    options: [
      {
        label: "In-process with the API",
        take: "Fewer moving parts, but the API scales with model memory instead of traffic.",
      },
      {
        label: "Separate inference service",
        take: "Independent scaling and rollout, at the cost of one more network hop to observe.",
        chosen: true,
      },
    ],
  },
  {
    id: "retrieval",
    question: "How is context selected for generation?",
    options: [
      {
        label: "Whole knowledge base in the prompt",
        take: "No retrieval to maintain, but cost and hallucination both grow with the corpus.",
      },
      {
        label: "Chunked vector search, top-k",
        take: "Bounded prompts and traceable citations. Chunking strategy becomes the real work.",
        chosen: true,
      },
    ],
  },
  {
    id: "trust",
    question: "Who sends the final reply?",
    options: [
      {
        label: "The system, automatically",
        take: "Great demo. One confidently wrong answer costs more than the time it saved.",
      },
      {
        label: "A human, from a draft",
        take: "The engine removes the blank page, the person keeps the judgement.",
        chosen: true,
      },
    ],
  },
];

export function HowIThink() {
  const [openId, setOpenId] = useState<string | null>(null);

  const head = useReveal();

  const activeDecision = DECISIONS.find(
    (decision) => decision.id === openId,
  );

  const activeIndex = activeDecision
    ? DECISIONS.findIndex((decision) => decision.id === activeDecision.id)
    : -1;

  return (
    <section
      id="engineering"
      className="scroll-mt-24 border-y border-hairline bg-card/40 py-16 md:py-20"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        {/* Header */}
        <div
          ref={head.ref}
          className={`${head.className} grid grid-cols-12 items-start gap-y-6 lg:gap-x-8`}
        >
          {/* Label */}
          <div className="col-span-12 lg:col-span-3">
            <p className="eyebrow">How I think</p>
          </div>

          {/* Main heading */}
          <div className="col-span-12 lg:col-span-6">
            <h2 className="display max-w-3xl text-[7vw] leading-[0.92] text-foreground sm:text-[4.8vw] lg:text-[2.8vw]">
              DESIGN A SCALABLE
              <br />
              TICKET PROCESSING
              <br />
              <span className="text-muted-foreground">SYSTEM.</span>
            </h2>
          </div>

          {/* Intro — now beside heading */}
          <div className="col-span-12 lg:col-span-3 lg:pt-1">
            <p className="max-w-xs text-[17px] leading-7 text-muted-foreground">
              Four decisions, each with a real trade-off. Open one to see
              the reasoning.
            </p>
          </div>
        </div>

        {/* Questions + answer */}
        <div className="mt-10 grid grid-cols-12 gap-y-8 lg:mt-12 lg:gap-x-12">
          {/* Questions */}
          <div className="col-span-12 lg:col-span-6">
            {DECISIONS.map((decision, index) => {
              const open = openId === decision.id;

              return (
                <div key={decision.id} className="rule-t">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenId(open ? null : decision.id)
                    }
                    className="group flex w-full items-center gap-5 py-4 text-left"
                  >
                    <span
                      className={`font-mono text-[13px] font-medium tracking-[0.08em] transition-colors ${
                        open ? "text-accent" : "text-accent/70"
                      }`}
                    >
                      Q{String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={`flex-1 font-display text-[1.15rem] tracking-tight transition-colors sm:text-[1.25rem] ${
                        open
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {decision.question}
                    </span>

                    <span
                      className={`font-mono text-[13px] transition-colors ${
                        open
                          ? "text-accent"
                          : "text-muted-foreground"
                      }`}
                    >
                      {open ? "−" : "+"}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Answer panel */}
          <div className="col-span-12 lg:col-span-6">
            <div className="lg:sticky lg:top-28">
              {activeDecision ? (
                <div
                  key={activeDecision.id}
                  className="rule-t pt-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="eyebrow text-foreground/75">
                      Q{String(activeIndex + 1).padStart(2, "0")} /{" "}
                      {String(DECISIONS.length).padStart(2, "0")}
                    </p>

                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-accent">
                      Decision
                    </span>
                  </div>

                  <div className="mt-6 space-y-7">
                    {activeDecision.options.map((option) => (
                      <div
                        key={option.label}
                        className="border-l pl-5"
                        style={{
                          borderColor: option.chosen
                            ? "var(--color-accent)"
                            : "var(--color-hairline)",
                        }}
                      >
                        <p className="flex flex-wrap items-center gap-2 font-mono text-[13px] font-medium uppercase leading-5 tracking-[0.1em] text-foreground">
                          {option.label}

                          {option.chosen && (
                            <span className="text-accent">
                              — chosen
                            </span>
                          )}
                        </p>

                        <p className="mt-2 max-w-xl text-[17px] leading-7 text-muted-foreground">
                          {option.take}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="hidden min-h-[220px] lg:block">
                  {/* Intentionally empty until a question is selected */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}