import { useEffect, useRef, useState } from "react";
import { useReveal } from "./use-reveal";

type Project = {
  id: string;
  index: string;
  title: string;
  blurb: string;
  technologies: string[];
  github: string;
};

const PROJECTS: Project[] = [
  {
    id: "ticket",
    index: "01",
    title: "AI TICKET WORKFLOW ENGINE",
    blurb:
      "A retrieval-grounded pipeline that reads a support ticket, understands it, and drafts a reply a human can trust.",
    technologies: ["Python", "FastAPI", "React", "RAG", "Postgres"],
    github: "https://github.com/kuldeep681/ai-ticket-workflow-engine",
  },
  {
    id: "churn",
    index: "02",
    title: "CUSTOMER CHURN ML SYSTEM",
    blurb:
      "A churn prediction system built around explainability, production APIs and per-prediction reasoning.",
    technologies: ["Python", "XGBoost", "SHAP", "FastAPI", "PostgreSQL"],
    github: "https://github.com/kuldeep681/customer-churn-ml-system",
  },
  {
    id: "shelf",
    index: "03",
    title: "SHELF SCANNER",
    blurb:
      "An AI bookshelf scanner that turns a shelf image into structured book information and useful recommendations.",
    technologies: ["Python", "OCR", "FastAPI", "Streamlit", "MongoDB"],
    github: "https://github.com/kuldeep681/Shelf-Scanner",
  },
  {
    id: "rag",
    index: "04",
    title: "RAG PROJECT",
    blurb:
      "A document-grounded question answering system that retrieves relevant context before generating an answer.",
    technologies: ["Python", "Embeddings", "Vector Search", "LLM"],
    github: "https://github.com/kuldeep681/Rag_Project1",
  },
];

const TICKET_STAGES = [
  {
    label: "Input",
    note: "A raw support ticket enters the system.",
  },
  {
    label: "Classification",
    note: "Intent and category are inferred from the ticket.",
  },
  {
    label: "Priority",
    note: "Urgency is scored from language and context signals.",
  },
  {
    label: "Routing",
    note: "The ticket is directed to the appropriate processing path.",
  },
  {
    label: "Retrieval",
    note: "Relevant knowledge and previous resolutions are retrieved.",
  },
  {
    label: "Response",
    note: "A grounded draft is prepared for human review.",
  },
];

function TicketInteraction() {
  const [active, setActive] = useState(0);
  const stage = TICKET_STAGES[active]!;

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-12">
      <div>
        <p className="eyebrow mb-4 text-foreground/75">
          Workflow explorer
        </p>

        <div className="space-y-0">
          {TICKET_STAGES.map((item, index) => {
            const selected = index === active;
            const completed = index < active;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActive(index)}
                className="group relative flex w-full items-center gap-4 py-2.5 text-left"
              >
                <span
                  className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] font-medium transition-all duration-300"
                  style={{
                    borderColor:
                      selected || completed
                        ? "var(--color-accent)"
                        : "var(--color-border)",
                    background: selected
                      ? "var(--color-accent)"
                      : "var(--color-background)",
                    color: selected
                      ? "var(--color-accent-foreground)"
                      : "var(--color-foreground)",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {index < TICKET_STAGES.length - 1 && (
                  <span
                    className="absolute left-[13px] top-9 h-full w-px transition-colors duration-500"
                    style={{
                      background:
                        index < active
                          ? "color-mix(in oklab, var(--color-accent) 50%, transparent)"
                          : "var(--color-hairline)",
                    }}
                  />
                )}

                <span
                  className={`font-display text-[1.05rem] tracking-tight transition-colors duration-300 sm:text-[1.15rem] ${
                    selected
                      ? "text-foreground"
                      : "text-foreground/65 group-hover:text-foreground"
                  }`}
                >
                  {item.label.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="rule-t pt-4">
          <p className="eyebrow text-foreground/75">
            Stage {String(active + 1).padStart(2, "0")} /{" "}
            {TICKET_STAGES.length}
          </p>

          <p className="mt-3 max-w-lg font-display text-[1.15rem] leading-snug tracking-tight text-foreground sm:text-[1.25rem]">
            {stage.note}
          </p>

          <p className="mt-3 max-w-md text-[17px] leading-7 text-foreground/65">
            Select another stage to follow the ticket through the system.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] font-medium uppercase tracking-[0.11em] text-foreground/60">
          <span>Classification</span>
          <span>Priority</span>
          <span>Routing</span>
          <span>RAG</span>
        </div>
      </div>
    </div>
  );
}

type ChurnFeature = {
  name: string;
  value: number;
  weight: number;
  description: string;
};

const INITIAL_CHURN_FEATURES: ChurnFeature[] = [
  {
    name: "Tenure",
    value: 68,
    weight: -0.42,
    description:
      "Longer tenure generally pushes this illustrative prediction toward retention.",
  },
  {
    name: "Monthly charges",
    value: 72,
    weight: 0.31,
    description:
      "Higher monthly charges increase the illustrative churn pressure.",
  },
  {
    name: "Contract stability",
    value: 35,
    weight: -0.27,
    description:
      "A more stable contract reduces the illustrative churn pressure.",
  },
  {
    name: "Support contacts",
    value: 64,
    weight: 0.22,
    description:
      "Frequent support contact increases the illustrative churn pressure.",
  },
];

function ChurnInteraction() {
  const [features, setFeatures] = useState(INITIAL_CHURN_FEATURES);
  const [selected, setSelected] = useState(1);

  const updateFeature = (index: number, value: number) => {
    setFeatures((current) =>
      current.map((feature, featureIndex) =>
        featureIndex === index
          ? {
              ...feature,
              value,
            }
          : feature,
      ),
    );
  };

  const selectedFeature = features[selected]!;

  const totalPressure = features.reduce((total, feature) => {
    const normalized = (feature.value - 50) / 50;
    return total + normalized * feature.weight;
  }, 0);

  const churnScore = Math.max(5, Math.min(95, 50 + totalPressure * 55));

  const isChurn = churnScore >= 50;

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
      <div>
        <p className="eyebrow mb-5 text-foreground/75">
          Prediction explorer
        </p>

        <div className="space-y-4">
          {features.map((feature, index) => {
            const active = selected === index;

            return (
              <div
                key={feature.name}
                className={`border-b pb-4 transition-colors duration-300 ${
                  active ? "border-foreground/30" : "border-hairline"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelected(index)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span
                    className={`font-mono text-[12px] font-medium uppercase tracking-[0.1em] transition-colors duration-300 ${
                      active ? "text-foreground" : "text-foreground/65"
                    }`}
                  >
                    {feature.name}
                  </span>

                  <span
                    className={
                      feature.weight > 0
                        ? "font-mono text-[12px] text-accent"
                        : "font-mono text-[12px] text-foreground/65"
                    }
                  >
                    {feature.weight > 0 ? "+" : ""}
                    {feature.weight.toFixed(2)}
                  </span>
                </button>

                <div className="mt-2.5 flex items-center gap-4">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={feature.value}
                    onChange={(event) =>
                      updateFeature(index, Number(event.target.value))
                    }
                    aria-label={`${feature.name} feature value`}
                    className="w-full accent-[var(--color-accent)]"
                  />

                  <span className="w-8 shrink-0 text-right font-mono text-[12px] font-medium text-accent">
                    {feature.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="rule-t pt-4">
          <p className="eyebrow text-foreground/75">Live prediction</p>

          <div className="mt-4 flex items-end gap-4">
            <span className="font-display text-[3.5rem] leading-none tracking-tight text-foreground transition-all duration-500">
              {Math.round(churnScore)}
            </span>

            <span className="pb-1 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/55">
              / 100
            </span>
          </div>

          <p className="mt-4 max-w-lg font-display text-[1.15rem] leading-snug tracking-tight text-foreground sm:text-[1.25rem]">
            The current signals point{" "}
            <span className={isChurn ? "text-accent" : "text-foreground"}>
              {isChurn ? "toward churn" : "toward retention"}
            </span>
            .
          </p>

          <p className="mt-3 max-w-md text-[17px] leading-7 text-foreground/65">
            {selectedFeature.description}
          </p>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/55">
            <span>Retention</span>
            <span>Churn</span>
          </div>

          <div className="relative h-1 bg-hairline">
            <span
              className="absolute left-0 top-0 h-1 bg-accent transition-all duration-500 ease-out"
              style={{
                width: `${churnScore}%`,
              }}
            />

            <span
              className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-foreground transition-all duration-500 ease-out"
              style={{
                left: "50%",
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] font-medium uppercase tracking-[0.11em] text-foreground/60">
          <span>XGBoost</span>
          <span>SHAP</span>
          <span>FastAPI</span>
          <span>PostgreSQL</span>
        </div>
      </div>
    </div>
  );
}

const BOOKS = [
  {
    title: "SYSTEM DESIGN",
    category: "Engineering",
    size: "h-28 w-14",
  },
  {
    title: "DEEP LEARNING",
    category: "AI / ML",
    size: "h-36 w-10",
  },
  {
    title: "CLEAN CODE",
    category: "Software",
    size: "h-24 w-16",
  },
  {
    title: "DATABASE",
    category: "Systems",
    size: "h-32 w-12",
  },
  {
    title: "PYTHON",
    category: "Programming",
    size: "h-20 w-11",
  },
  {
    title: "MACHINE LEARNING",
    category: "AI / ML",
    size: "h-36 w-16",
  },
  {
    title: "DISTRIBUTED SYSTEMS",
    category: "Systems",
    size: "h-26 w-10",
  },
  {
    title: "REFACTORING",
    category: "Software",
    size: "h-32 w-14",
  },
  {
    title: "NEURAL NETWORKS",
    category: "AI / ML",
    size: "h-24 w-12",
  },
  {
    title: "ALGORITHMS",
    category: "Computer Science",
    size: "h-36 w-11",
  },
];

function ShelfInteraction() {
  const [scanned, setScanned] = useState(false);
  const [selectedBook, setSelectedBook] = useState(0);

  const book = BOOKS[selectedBook]!;

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-12">
      <div>
        <p className="eyebrow mb-4 text-foreground/75">
          Shelf scanner
        </p>

        <div className="border border-hairline px-5 pb-5 pt-6">
          <div className="flex min-h-[190px] items-end justify-center gap-1.5 border-b border-hairline">
            {BOOKS.map((item, index) => {
              const selected = selectedBook === index;

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => {
                    setSelectedBook(index);
                    setScanned(true);
                  }}
                  aria-label={`Select ${item.title}`}
                  className={`${item.size} shrink-0 origin-bottom border px-1.5 transition-all duration-300 ${
                    selected
                      ? "border-accent bg-accent/10"
                      : "border-border hover:-translate-y-1 hover:border-foreground/60"
                  }`}
                >
                  <span
                    className={`flex h-full items-center justify-center text-center font-mono text-[8px] font-medium uppercase leading-tight tracking-[0.04em] ${
                      selected
                        ? "text-accent"
                        : "text-foreground/55"
                    }`}
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                    }}
                  >
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 h-1 bg-foreground/10" />

          <button
            type="button"
            onClick={() => {
              setScanned(true);
              setSelectedBook(0);
            }}
            className="mt-4 w-full border border-foreground px-5 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-foreground transition-all duration-300 hover:bg-foreground hover:text-background"
          >
            {scanned ? "Rescan shelf" : "Scan shelf"}
          </button>
        </div>
      </div>

      <div>
        <div className="rule-t pt-4">
          <p className="eyebrow text-foreground/75">
            {scanned ? "Book detected" : "Waiting for scan"}
          </p>

          <p className="mt-3 font-display text-[1.15rem] leading-snug tracking-tight text-foreground sm:text-[1.25rem]">
            {scanned
              ? `${book.title} — ${book.category}`
              : "Turn a shelf image into structured book information."}
          </p>

          <p className="mt-3 max-w-md text-[17px] leading-7 text-foreground/65">
            {scanned
              ? "The scanner identifies visible titles and can enrich them with metadata before producing recommendations."
              : "Click a book to inspect it, or scan the shelf to simulate the recognition step."}
          </p>
        </div>

        {scanned && (
          <div className="mt-6 border-l border-accent pl-5">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/55">
              Recommendation
            </p>

            <p className="mt-2 font-display text-base text-foreground">
              Explore more {book.category.toLowerCase()} books.
            </p>

            <p className="mt-2 text-sm leading-6 text-foreground/60">
              The detected category can be used as the starting point for
              recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const RAG_QUESTIONS = [
  {
    question: "What is retrieved before generation?",
    chunks: [
      "Architecture notes",
      "Relevant document sections",
      "Previous answers",
    ],
    answer:
      "The system retrieves the most relevant document chunks and provides them as context before generation.",
  },
  {
    question: "Why use top-k retrieval?",
    chunks: [
      "Similarity scores",
      "Top matching chunks",
      "Context window",
    ],
    answer:
      "Top-k keeps the context bounded while prioritising the documents most closely related to the question.",
  },
  {
    question: "What happens if context is missing?",
    chunks: [
      "Low confidence",
      "No matching evidence",
      "Fallback behaviour",
    ],
    answer:
      "A grounded system should avoid pretending it knows the answer when the retrieved context does not support one.",
  },
];

function RagInteraction() {
  const [question, setQuestion] = useState(0);
  const [asked, setAsked] = useState(false);

  const current = RAG_QUESTIONS[question]!;

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
      <div>
        <p className="eyebrow mb-4 text-foreground/75">
          Retrieval explorer
        </p>

        <div className="space-y-1">
          {RAG_QUESTIONS.map((item, index) => (
            <button
              key={item.question}
              type="button"
              onClick={() => {
                setQuestion(index);
                setAsked(false);
              }}
              className={`w-full border-b border-hairline py-3.5 text-left font-display text-[1rem] tracking-tight transition-colors duration-300 sm:text-[1.1rem] ${
                question === index
                  ? "text-foreground"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {item.question}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setAsked(true)}
          className="mt-5 border border-foreground px-5 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-foreground transition-all duration-300 hover:bg-foreground hover:text-background"
        >
          {asked ? "Retrieve again" : "Retrieve context →"}
        </button>
      </div>

      <div>
        <div className="rule-t pt-4">
          <p className="eyebrow text-foreground/75">
            {asked ? "Retrieved context" : "RAG pipeline"}
          </p>

          {!asked ? (
            <>
              <p className="mt-3 max-w-lg font-display text-[1.15rem] leading-snug tracking-tight text-foreground sm:text-[1.25rem]">
                Select a question and retrieve the context used before
                generation.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/55">
                <span>Question</span>
                <span>→</span>
                <span>Embeddings</span>
                <span>→</span>
                <span>Search</span>
                <span>→</span>
                <span>LLM</span>
              </div>
            </>
          ) : (
            <>
              <div className="mt-4 space-y-2">
                {current.chunks.map((chunk, index) => (
                  <div
                    key={chunk}
                    className="border border-hairline px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.09em] text-foreground/70"
                  >
                    <span className="mr-3 text-accent">
                      0{index + 1}
                    </span>
                    {chunk}
                  </div>
                ))}
              </div>

              <div className="mt-5 border-l border-accent pl-5">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/55">
                  Generated answer
                </p>

                <p className="mt-2 text-[17px] leading-7 text-foreground/75">
                  {current.answer}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectInteraction({ id }: { id: string }) {
  if (id === "ticket") {
    return <TicketInteraction />;
  }

  if (id === "churn") {
    return <ChurnInteraction />;
  }

  if (id === "shelf") {
    return <ShelfInteraction />;
  }

  return <RagInteraction />;
}

function ProjectCard({ project }: { project: Project }) {
  const reveal = useReveal();

  return (
    <article
      ref={reveal.ref}
      className={`${reveal.className} rule-t pt-6 md:pt-8`}
    >
      <div className="grid grid-cols-12 gap-y-6 lg:gap-x-8">
        <div className="col-span-12 lg:col-span-2">
          <p className="font-mono text-[13px] font-medium tracking-[0.14em] text-accent">
            {project.index}
          </p>
        </div>

        <div className="col-span-12 lg:col-span-10">
          <div className="max-w-4xl">
            <h3 className="display text-[7vw] leading-[0.92] text-foreground sm:text-[5vw] lg:text-[2.8vw]">
              {project.title}
            </h3>

            <p className="mt-4 max-w-2xl text-[17px] leading-7 text-foreground/70">
              {project.blurb}
            </p>
          </div>

          <div className="mt-8">
            <ProjectInteraction id={project.id} />
          </div>

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] font-medium uppercase tracking-[0.11em] text-foreground/60">
            {project.technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>

          <div className="mt-7">
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 border-b border-foreground/40 pb-1 font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-foreground/75 transition-all duration-300 hover:border-accent hover:text-accent"
            >
              Source on GitHub
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                ↗
              </span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

const PROJECT_TRANSITION_MS = 800;
const PROJECT_AUTO_PLAY_MS = 10000;

export function Projects() {
  const head = useReveal();

  const [activeProject, setActiveProject] = useState(0);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const [transitioning, setTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);

  const timeoutRef = useRef<number | null>(null);

  const project = PROJECTS[activeProject]!;

  const changeProject = (
    nextIndex: number,
    nextDirection: "next" | "previous",
  ) => {
    if (transitioning) return;

    setDirection(nextDirection);
    setTransitioning(true);

    timeoutRef.current = window.setTimeout(() => {
      setActiveProject(nextIndex);
      setTransitioning(false);
    }, PROJECT_TRANSITION_MS);
  };

  const previous = () => {
    const nextIndex =
      activeProject === 0
        ? PROJECTS.length - 1
        : activeProject - 1;

    changeProject(nextIndex, "previous");
  };

  const next = () => {
    const nextIndex =
      activeProject === PROJECTS.length - 1
        ? 0
        : activeProject + 1;

    changeProject(nextIndex, "next");
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (paused || transitioning) {
      return;
    }

    const timer = window.setTimeout(() => {
      const nextIndex =
        activeProject === PROJECTS.length - 1
          ? 0
          : activeProject + 1;

      changeProject(nextIndex, "next");
    }, PROJECT_AUTO_PLAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeProject, paused, transitioning]);

  return (
    <section
      id="work"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-16 md:px-12 md:py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={head.ref}
        className={`${head.className} mb-8`}
      >
        <h2 className="eyebrow text-foreground/80">
          Selected work
        </h2>
      </div>

      <div className="overflow-hidden">
        <div
          key={project.id}
          className="will-change-transform"
          style={{
            opacity: transitioning ? 0 : 1,
            transform: transitioning
              ? direction === "next"
                ? "translate3d(-28px, 0, 0)"
                : "translate3d(28px, 0, 0)"
              : "translate3d(0, 0, 0)",
            transition: `
              opacity ${PROJECT_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1),
              transform ${PROJECT_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)
            `,
          }}
        >
          <ProjectCard project={project} />
        </div>
      </div>

      {/* Project navigation */}
      <div className="mt-8 flex items-center justify-end border-t border-hairline pt-4">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-foreground/65">
            {String(activeProject + 1).padStart(2, "0")} /{" "}
            {String(PROJECTS.length).padStart(2, "0")}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous project"
              onClick={previous}
              disabled={transitioning}
              className="flex h-10 w-10 items-center justify-center border border-border font-mono text-sm text-foreground/70 transition-all duration-300 hover:border-accent hover:text-accent active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ←
            </button>

            <button
              type="button"
              aria-label="Next project"
              onClick={next}
              disabled={transitioning}
              className="flex h-10 w-10 items-center justify-center border border-border font-mono text-sm text-foreground/70 transition-all duration-300 hover:border-accent hover:text-accent active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Project position indicator */}
      <div className="mt-2 flex gap-1.5">
        {PROJECTS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Go to project ${item.index}`}
            onClick={() => {
              if (index === activeProject || transitioning) return;

              changeProject(
                index,
                index > activeProject ? "next" : "previous",
              );
            }}
            className="h-[2px] flex-1 transition-all duration-500"
            style={{
              background:
                index === activeProject
                  ? "var(--color-accent)"
                  : "var(--color-border)",
            }}
          />
        ))}
      </div>
    </section>
  );
}