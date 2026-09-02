import { useEffect, useState } from "react";
import { useReveal } from "./use-reveal";

const EDUCATION = [
  {
    period: "2024 — 2026",
    degree: "MCA",
    institution: "Amity University Jharkhand",
    location: "Ranchi, Jharkhand",
    result: "CGPA 8.03",
    description:
      "Focused on computer applications, software engineering and modern development practices. Built a stronger foundation in programming, databases and application development.",
  },
  {
    period: "2020 — 2023",
    degree: "BCA",
    institution: "School of Management Sciences",
    location: "Lucknow, Uttar Pradesh",
    result: "68.6%",
    description:
      "Studied computer programming, databases, web technologies and software development. This is where my interest in building practical software systems started to grow.",
  },
  {
    period: "2019 — 2020",
    degree: "12th",
    institution: "A.E.C.S-1",
    location: "Jaduguda, Jamshedpur",
    result: "73.2%",
    description:
      "Completed higher secondary education with Computer Science. Developed an early interest in computers, problem solving and technical subjects.",
  },
  {
    period: "2017 — 2018",
    degree: "10th",
    institution: "Atomic Energy Central School",
    location: "Turamdih, Jamshedpur",
    result: "80%",
    description:
      "Completed secondary education and built the academic foundation for further studies in computer applications and technology.",
  },
];

const EXPERIENCE = [
  {
    period: "07/2026 — Present",
    role: "Software Engineer",
    company: "Atraya Technologies Pvt. Ltd.",
    location: "Bengaluru, Karnataka",
    description:
      "Developing and maintaining full-stack web applications using Python, Django REST Framework, React.js and SQL. Building REST APIs, implementing features, improving performance and working with Git and GitHub.",
  },
  {
    period: "02/2026 — 04/2026",
    role: "Software Engineer Intern",
    company: "Atraya Technologies Pvt. Ltd.",
    location: "Bengaluru, Karnataka",
    description:
      "Contributed to a full-stack news channel web application with admin and public interfaces using React.js, Flask, Python and SQL. Worked on pagination, filtering, content management, REST APIs, authentication and database operations.",
  },
  {
    period: "04/2025 — 05/2025",
    role: "Data Analysis Intern",
    company: "Cognifyz Technologies",
    location: "Remote",
    description:
      "Worked with structured datasets to clean data, perform exploratory analysis and create visual reports. Used Python for data manipulation and visualization while developing practical experience with data-driven analysis.",
  },
  {
    period: "07/2022 — 09/2022",
    role: "Summer Intern — Java Software Development",
    company: "Analyze Infotech",
    location: "Lucknow, Uttar Pradesh",
    description:
      "Built an Inventory Management System using Java and MySQL. The application supported product management, inventory tracking, sales reports and a simple login system for managing business stock.",
  },
];

const AUTO_PLAY_MS = 7000;
const TRANSITION_MS = 650;

type CarouselControlsProps = {
  current: number;
  total: number;
  previous: () => void;
  next: () => void;
};

function BlinkingUnderscore() {
  return (
    <span
      aria-hidden="true"
      className="ml-2 inline-block font-mono text-[1.15em] font-bold leading-none text-accent"
      style={{
        animation: "about-underscore-blink 1s steps(2, end) infinite",
      }}
    >
      _
    </span>
  );
}

function DegreeLabel({ degree }: { degree: string }) {
  if (degree === "10th") {
    return (
      <>
        10
        <sup className="ml-[1px] text-[0.55em] align-super">th</sup>
      </>
    );
  }

  if (degree === "12th") {
    return (
      <>
        12
        <sup className="ml-[1px] text-[0.55em] align-super">th</sup>
      </>
    );
  }

  return degree;
}

function CarouselControls({
  current,
  total,
  previous,
  next,
}: CarouselControlsProps) {
  return (
    <div className="mt-6 flex flex-col items-center">
      <span className="font-mono text-[12px] font-medium tracking-[0.12em] text-foreground/60">
        {String(current + 1).padStart(2, "0")} /{" "}
        {String(total).padStart(2, "0")}
      </span>

      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={previous}
          aria-label="Previous item"
          className="flex h-9 w-9 items-center justify-center border border-border font-mono text-[14px] text-foreground/65 transition-all duration-300 hover:border-accent hover:text-accent active:scale-95"
        >
          ←
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next item"
          className="flex h-9 w-9 items-center justify-center border border-border font-mono text-[14px] text-foreground/65 transition-all duration-300 hover:border-accent hover:text-accent active:scale-95"
        >
          →
        </button>
      </div>
    </div>
  );
}

function EducationCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const [transitioning, setTransitioning] = useState(false);

  const item = EDUCATION[current]!;

  useEffect(() => {
    if (paused || transitioning) {
      return;
    }

    const timer = window.setInterval(() => {
      setDirection("next");
      setTransitioning(true);

      window.setTimeout(() => {
        setCurrent((value) => (value + 1) % EDUCATION.length);
        setTransitioning(false);
      }, TRANSITION_MS);
    }, AUTO_PLAY_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [paused, transitioning]);

  const changeSlide = (
    nextIndex: number,
    nextDirection: "next" | "previous",
  ) => {
    if (transitioning) {
      return;
    }

    setDirection(nextDirection);
    setTransitioning(true);

    window.setTimeout(() => {
      setCurrent(nextIndex);
      setTransitioning(false);
    }, TRANSITION_MS);
  };

  const next = () => {
    changeSlide((current + 1) % EDUCATION.length, "next");
  };

  const previous = () => {
    changeSlide(
      (current - 1 + EDUCATION.length) % EDUCATION.length,
      "previous",
    );
  };

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative h-[300px] overflow-visible">
        <div
          className="absolute inset-x-0 top-1"
          style={{
            opacity: transitioning ? 0 : 1,
            transform: transitioning
              ? direction === "next"
                ? "translateX(-14px)"
                : "translateX(14px)"
              : "translateX(0)",
            transition: `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`,
          }}
        >
          <div className="group border border-hairline p-5 transition-all duration-400 ease-out hover:-translate-y-1 hover:scale-[1.008] hover:border-accent/50 hover:shadow-[0_10px_28px_rgba(0,0,0,0.10)] sm:p-6">
            <div className="flex min-h-[250px] flex-col">
              <div className="flex items-start justify-between gap-5">
                <span className="font-mono text-[12px] font-medium tracking-[0.12em] text-accent">
                  {item.period}
                </span>

                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/50">
                  {item.result}
                </span>
              </div>

              <div className="mt-auto">
                <p className="font-display text-[1.55rem] tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent sm:text-[1.7rem]">
                  <DegreeLabel degree={item.degree} />
                  <BlinkingUnderscore />
                </p>

                <p className="mt-2 max-w-md text-[16px] leading-6 text-foreground/70">
                  {item.institution}
                </p>

                <p className="mt-2 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/45">
                  {item.location}
                </p>

                <p className="mt-4 max-w-xl text-[14px] leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CarouselControls
        current={current}
        total={EDUCATION.length}
        previous={previous}
        next={next}
      />
    </div>
  );
}

function ExperienceCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const [transitioning, setTransitioning] = useState(false);

  const item = EXPERIENCE[current]!;

  useEffect(() => {
    if (paused || transitioning) {
      return;
    }

    const timer = window.setInterval(() => {
      setDirection("next");
      setTransitioning(true);

      window.setTimeout(() => {
        setCurrent((value) => (value + 1) % EXPERIENCE.length);
        setTransitioning(false);
      }, TRANSITION_MS);
    }, AUTO_PLAY_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [paused, transitioning]);

  const changeSlide = (
    nextIndex: number,
    nextDirection: "next" | "previous",
  ) => {
    if (transitioning) {
      return;
    }

    setDirection(nextDirection);
    setTransitioning(true);

    window.setTimeout(() => {
      setCurrent(nextIndex);
      setTransitioning(false);
    }, TRANSITION_MS);
  };

  const next = () => {
    changeSlide((current + 1) % EXPERIENCE.length, "next");
  };

  const previous = () => {
    changeSlide(
      (current - 1 + EXPERIENCE.length) % EXPERIENCE.length,
      "previous",
    );
  };

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative h-[300px] overflow-visible">
        <div
          className="absolute inset-x-0 top-1"
          style={{
            opacity: transitioning ? 0 : 1,
            transform: transitioning
              ? direction === "next"
                ? "translateX(-14px)"
                : "translateX(14px)"
              : "translateX(0)",
            transition: `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`,
          }}
        >
          <div className="group border border-hairline p-5 transition-all duration-400 ease-out hover:-translate-y-1 hover:scale-[1.008] hover:border-accent/50 hover:shadow-[0_10px_28px_rgba(0,0,0,0.10)] sm:p-6">
            <div className="flex min-h-[250px] flex-col">
              <div className="flex items-start justify-between gap-5">
                <span className="font-mono text-[12px] font-medium tracking-[0.12em] text-accent">
                  {item.period}
                </span>

                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/45">
                  {item.location}
                </span>
              </div>

              <div className="mt-auto">
                <p className="font-display text-[1.35rem] leading-tight tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent sm:text-[1.5rem]">
                  {item.role}
                  <BlinkingUnderscore />
                </p>

                <p className="mt-2 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-foreground/70">
                  {item.company}
                </p>

                <p className="mt-3 max-w-xl text-[15px] leading-6 text-foreground/65">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CarouselControls
        current={current}
        total={EXPERIENCE.length}
        previous={previous}
        next={next}
      />
    </div>
  );
}

export function About() {
  const a = useReveal();
  const b = useReveal();

  return (
    <>
      <style>
        {`
          @keyframes about-underscore-blink {
            0%,
            45% {
              opacity: 1;
            }

            46%,
            100% {
              opacity: 0.12;
            }
          }
        `}
      </style>

      <section
        id="about"
        className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-14 md:px-12 md:py-18"
      >
        {/* About */}
        <div
          ref={a.ref}
          className={`${a.className} grid grid-cols-12 items-start gap-y-6 lg:gap-x-8`}
        >
          {/* Label */}
          <div className="col-span-12 lg:col-span-3">
            <p className="eyebrow">About</p>
          </div>

          {/* Main statement */}
          <div className="col-span-12 lg:col-span-6">
            <p className="max-w-3xl font-display text-[4.6vw] leading-[1.02] tracking-tight sm:text-[2.9vw] lg:text-[2.05vw]">
              I like the unglamorous part of engineering — the part where a
              system keeps working after the demo ends.
            </p>
          </div>

          {/* Supporting text */}
          <div className="col-span-12 lg:col-span-3 lg:pt-1">
            <p className="max-w-xs text-[16px] leading-6 text-muted-foreground">
              I work across backend services, applied AI and the interfaces
              that sit on top of them. Most of what I build starts as a
              question about how something should be structured, not which
              framework to use.
            </p>
          </div>
        </div>

        {/* Education + Experience */}
        <div
          id="experience"
          ref={b.ref}
          className={`${b.className} mt-14 scroll-mt-24 md:mt-16`}
        >
          <div className="grid grid-cols-12 gap-y-10 lg:gap-x-10">
            {/* Work Experience — LEFT */}
            <div className="col-span-12 lg:col-span-6">
              <p className="eyebrow mb-5">Work Experience</p>

              <ExperienceCarousel />
            </div>

            {/* Education — RIGHT */}
            <div className="col-span-12 lg:col-span-6">
              <p className="eyebrow mb-5">Education</p>

              <EducationCarousel />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}