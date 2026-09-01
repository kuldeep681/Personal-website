import { useEffect, useState } from "react";
import { useReveal } from "./use-reveal";

const EDUCATION = [
  {
    period: "2024 — 2026",
    degree: "MCA",
    institution: "Amity University Jharkhand",
    location: "Ranchi",
    result: "CGPA 8.03",
  },
  {
    period: "2020 — 2023",
    degree: "BCA",
    institution: "School of Management Sciences",
    location: "Lucknow",
    result: "68.6%",
  },
  {
    period: "2019 — 2020",
    degree: "XII",
    institution: "A.E.C.S-1",
    location: "Jaduguda, Jamshedpur",
    result: "73.2%",
  },
  {
    period: "2017 — 2018",
    degree: "X",
    institution: "Atomic Energy Central School",
    location: "Turamdih, Jamshedpur",
    result: "80%",
  },
];

const EXPERIENCE = [
  {
    period: "07/2026 — Present",
    role: "Software Engineer",
    company: "Atraya Technologies Pvt. Ltd.",
    location: "Bengaluru",
    description:
      "Developing backend services using Django, handling database operations, backend application logic and API-driven functionality.",
  },
  {
    period: "02/2026 — 05/2026",
    role: "Trainee Software Engineer Intern",
    company: "Atraya Technologies Pvt. Ltd.",
    location: "Bengaluru",
    description:
      "Contributed to backend and frontend development for the Exam Mitra web and mobile application using Flask, SQL and AI technologies.",
  },
];

const AUTO_PLAY_MS = 7000;
const TRANSITION_MS = 650;

function BlinkingUnderscore() {
  return (
    <span
      aria-hidden="true"
      className="ml-2 inline-block font-mono font-bold leading-none text-accent"
      style={{
        animation: "about-cursor-blink 1.2s ease-in-out infinite",
      }}
    >
      _
    </span>
  );
}

function CarouselControls({
  current,
  total,
  previous,
  next,
}: {
  current: number;
  total: number;
  previous: () => void;
  next: () => void;
}) {
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
      <div className="relative h-[235px] overflow-hidden">
        <div
          className="absolute inset-0 border border-hairline p-5 sm:p-6"
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
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-5">
              <span className="font-mono text-[12px] font-medium tracking-[0.12em] text-accent">
                {item.period}
              </span>

              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/50">
                {item.result}
              </span>
            </div>

            <div className="mt-auto">
              <p className="flex items-center font-display text-[1.55rem] tracking-tight text-foreground transition-colors duration-300 hover:text-accent sm:text-[1.7rem]">
                {item.degree}
                <BlinkingUnderscore />
              </p>

              <p className="mt-2 max-w-md text-[16px] leading-6 text-foreground/70">
                {item.institution}
              </p>

              <p className="mt-2 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/45">
                {item.location}
              </p>
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
      <div className="relative h-[235px] overflow-hidden">
        <div
          className="absolute inset-0 border border-hairline p-5 sm:p-6"
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
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-5">
              <span className="font-mono text-[12px] font-medium tracking-[0.12em] text-accent">
                {item.period}
              </span>

              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/45">
                {item.location}
              </span>
            </div>

            <div className="mt-auto">
              <p className="flex items-center font-display text-[1.45rem] leading-tight tracking-tight text-foreground transition-colors duration-300 hover:text-accent sm:text-[1.6rem]">
                {item.role}
                <BlinkingUnderscore />
              </p>

              <p className="mt-2 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-foreground/70">
                {item.company}
              </p>

              <p className="mt-3 max-w-xl text-[16px] leading-6 text-foreground/65">
                {item.description}
              </p>
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
    <section
      id="about"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-14 md:px-12 md:py-18"
    >
      <style>{`
        @keyframes about-cursor-blink {
          0%,
          45% {
            opacity: 1;
          }

          50%,
          100% {
            opacity: 0.18;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-cursor-blink {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      {/* About */}
      <div
        ref={a.ref}
        className={`${a.className} grid grid-cols-12 gap-y-7 lg:gap-x-10`}
      >
        <div className="col-span-12 lg:col-span-4">
          <p className="eyebrow">About</p>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] lg:items-start lg:gap-12">
            <p className="max-w-4xl font-display text-[4.6vw] leading-[1.02] tracking-tight sm:text-[2.9vw] lg:text-[2.05vw]">
              I like the unglamorous part of engineering — the part where a
              system keeps working after the demo ends.
            </p>

            <p className="max-w-md text-[16px] leading-6 text-muted-foreground">
              I work across backend services, applied AI and the interfaces
              that sit on top of them. Most of what I build starts as a
              question about how something should be structured, not which
              framework to use.
            </p>
          </div>
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
          <div className="col-span-12 lg:col-span-6 lg:order-1">
            <p className="eyebrow mb-5">Work Experience</p>

            <ExperienceCarousel />
          </div>

          {/* Education — RIGHT */}
          <div className="col-span-12 lg:col-span-6 lg:order-2">
            <p className="eyebrow mb-5">Education</p>

            <EducationCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}