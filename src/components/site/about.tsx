import { useReveal } from "./use-reveal";

const MARKS = [
  {
    year: "2020",
    label: "BCA",
    note: "Started writing software properly.",
  },
  {
    year: "2024",
    label: "MCA",
    note: "Deeper into systems, data and applied AI.",
  },
  {
    year: "2026",
    label: "Software Engineer",
    note: "Atraya Technologies, Bengaluru.",
  },
];

export function About() {
  const a = useReveal();
  const b = useReveal();

  return (
    <section
      id="about"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-24 md:px-12 md:py-32"
    >
      {/* About */}
      <div ref={a.ref} className={`${a.className} grid grid-cols-12 gap-y-10`}>
        <div className="col-span-12 lg:col-span-4">
          <p className="eyebrow">About</p>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <p className="max-w-4xl font-display text-[5vw] leading-[1.02] tracking-tight sm:text-[3vw] lg:text-[2.15vw]">
            I like the unglamorous part of engineering — the part where a system keeps working after
            the demo ends.
          </p>

          <p className="mt-7 max-w-lg text-[17px] leading-7 text-muted-foreground">
            I work across backend services, applied AI and the interfaces that sit on top of them.
            Most of what I build starts as a question about how something should be structured, not
            which framework to use.
          </p>
        </div>
      </div>

      {/* Experience */}
      <div
        id="experience"
        ref={b.ref}
        className={`${b.className} mt-24 scroll-mt-24 grid grid-cols-12 gap-y-8`}
      >
        <div className="col-span-12 lg:col-span-4">
          <p className="eyebrow">Experience</p>
        </div>

        <div className="col-span-12 lg:col-span-8">
          {MARKS.map((mark) => (
            <div
              key={mark.year}
              className="group rule-t grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[80px_minmax(0,1fr)_auto] sm:items-baseline"
            >
              <span className="font-mono text-[13px] font-medium tracking-[0.14em] text-accent">
                {mark.year}
              </span>

              <span className="font-display text-xl tracking-tight sm:text-[1.4rem]">
                {mark.label.toUpperCase()}
              </span>

              <span className="text-[17px] leading-7 text-muted-foreground sm:text-right">
                {mark.note}
              </span>
            </div>
          ))}

          <p className="rule-t max-w-lg pt-7 text-[17px] leading-7 text-muted-foreground">
            Currently a Software Engineer at Atraya Technologies in Bengaluru, working on AI
            systems, backend services and full-stack product work.
          </p>
        </div>
      </div>
    </section>
  );
}
