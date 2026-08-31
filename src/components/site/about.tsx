import { useReveal } from "./use-reveal";

const MARKS = [
  { year: "2020", label: "BCA", note: "Started writing software properly." },
  { year: "2024", label: "MCA", note: "Deeper into systems, data and applied AI." },
  { year: "2026", label: "Software Engineer", note: "Atraya Technologies, Bengaluru." },
];

export function About() {
  const a = useReveal();
  const b = useReveal();

  return (
    <section
      id="about"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-28 md:px-12 md:py-40"
    >
      <div ref={a.ref} className={`${a.className} grid grid-cols-12 gap-y-12`}>
        <div className="col-span-12 lg:col-span-4">
          <p className="eyebrow">About</p>
        </div>
        <div className="col-span-12 lg:col-span-7">
          <p className="font-display text-[6vw] leading-[1.05] tracking-tight sm:text-[3.4vw] lg:text-[2.6vw]">
            I like the unglamorous part of engineering — the part where a system keeps
            working after the demo ends.
          </p>
          <p className="mt-8 max-w-lg text-sm leading-relaxed text-muted-foreground">
            I work across backend services, applied AI and the interfaces that sit on top
            of them. Most of what I build starts as a question about how something should
            be structured, not which framework to use.
          </p>
        </div>
      </div>

      <div
        id="experience"
        ref={b.ref}
        className={`${b.className} mt-28 scroll-mt-24 grid grid-cols-12 gap-y-10`}
      >
        <div className="col-span-12 lg:col-span-4">
          <p className="eyebrow">Experience</p>
        </div>
        <div className="col-span-12 lg:col-span-8">
          {MARKS.map((m) => (
            <div
              key={m.year}
              className="group rule-t flex flex-wrap items-baseline gap-x-8 gap-y-2 py-7"
            >
              <span className="font-mono text-[11px] tracking-[0.18em] text-accent">
                {m.year}
              </span>
              <span className="font-display text-2xl tracking-tight sm:text-3xl">
                {m.label.toUpperCase()}
              </span>
              <span className="ml-auto text-sm text-muted-foreground">{m.note}</span>
            </div>
          ))}
          <p className="rule-t max-w-lg pt-8 text-sm leading-relaxed text-muted-foreground">
            Currently a Software Engineer at Atraya Technologies in Bengaluru, working on
            AI systems, backend services and full-stack product work.
          </p>
        </div>
      </div>
    </section>
  );
}
