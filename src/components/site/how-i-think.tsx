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
    id: "grounding",
    question: "How do you keep AI accurate?",
    options: [
      {
        label: "Let the model answer",
        take: "The model can answer quickly, but it may make up information.",
      },
      {
        label: "Give it useful context",
        take: "Retrieve relevant information first, then let the model answer from that context.",
        chosen: true,
      },
    ],
  },
  {
    id: "threshold",
    question: "How do you choose a model decision?",
    options: [
      {
        label: "Use the default threshold",
        take: "It is simple, but it may not give the results the problem actually needs.",
      },
      {
        label: "Tune it for the problem",
        take: "Choose a threshold based on what matters most, such as finding more customers likely to leave.",
        chosen: true,
      },
    ],
  },
  {
    id: "production",
    question: "How do you turn ML into software?",
    options: [
      {
        label: "Stop at the model",
        take: "A trained model works for experiments, but users still need a way to use it.",
      },
      {
        label: "Build the full system",
        take: "Add APIs, validation, testing, storage, and deployment around the model.",
        chosen: true,
      },
    ],
  },
  {
    id: "orchestration",
    question: "Where should AI be used?",
    options: [
      {
        label: "Let AI control everything",
        take: "This gives the model a lot of freedom, but important steps can become unpredictable.",
      },
      {
        label: "Use AI where it helps",
        take: "Let AI understand text and context, while normal code controls important workflow steps.",
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
              BUILDING AI
              <br />
              THAT WORKS
              <br />
              <span className="text-muted-foreground">
                IN REAL SYSTEMS.
              </span>
            </h2>
          </div>

          {/* Intro */}
          <div className="col-span-12 lg:col-span-3 lg:pt-1">
            <p className="max-w-xs text-[17px] leading-7 text-muted-foreground">
              A few simple engineering decisions I make when building
              AI-powered software.
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
                <div className="hidden min-h-[220px] lg:flex lg:items-center">
                  <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-muted-foreground">
                    Select a question to see the decision.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}