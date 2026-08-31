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
  const [openId, setOpenId] = useState<string | null>(DECISIONS[0]!.id);

  const head = useReveal();

  return (
    <section
      id="engineering"
      className="scroll-mt-24 border-y border-hairline bg-card/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div ref={head.ref} className={`${head.className} grid grid-cols-12 gap-y-8`}>
          <div className="col-span-12 lg:col-span-4">
            <p className="eyebrow">How I think</p>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <h2 className="display max-w-4xl text-[7vw] leading-[0.92] sm:text-[4.8vw] lg:text-[2.8vw]">
              DESIGN A SCALABLE
              <br />
              TICKET PROCESSING
              <br />
              <span className="text-muted-foreground">SYSTEM.</span>
            </h2>

            <p className="mt-6 max-w-md text-[17px] leading-7 text-muted-foreground">
              Four decisions, each with a real trade-off. Open one to see the reasoning.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-12">
          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            {DECISIONS.map((decision, index) => {
              const open = openId === decision.id;

              return (
                <div key={decision.id} className="rule-t">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : decision.id)}
                    className="flex w-full items-baseline gap-5 py-5 text-left"
                  >
                    <span className="font-mono text-[13px] font-medium tracking-[0.08em] text-accent">
                      Q{String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={`flex-1 font-display text-[1.15rem] tracking-tight transition-colors sm:text-[1.25rem] ${
                        open ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {decision.question}
                    </span>

                    <span className="font-mono text-[13px] text-muted-foreground">
                      {open ? "−" : "+"}
                    </span>
                  </button>

                  <div
                    className="grid overflow-hidden transition-all duration-500"
                    style={{
                      gridTemplateRows: open ? "1fr" : "0fr",
                    }}
                  >
                    <div className="min-h-0">
                      <div className="grid gap-6 pb-8 sm:grid-cols-2">
                        {decision.options.map((option) => (
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

                              {option.chosen && <span className="text-accent">— chosen</span>}
                            </p>

                            <p className="mt-3 text-[17px] leading-7 text-muted-foreground">
                              {option.take}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
