import { GITHUB_URL } from "./data";
import { useReveal } from "./use-reveal";

export function Contact() {
  const r = useReveal();

  return (
    <footer id="contact" className="grain scroll-mt-24 border-t border-hairline py-24 md:py-32">
      <div ref={r.ref} className={`${r.className} mx-auto max-w-[1400px] px-6 md:px-12`}>
        <div className="grid grid-cols-12 gap-y-8">
          <div className="col-span-12 lg:col-span-4">
            <p className="eyebrow">Contact</p>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <h2 className="display max-w-5xl text-[8vw] leading-[0.9] sm:text-[5.5vw] lg:text-[3.8vw]">
              LET'S BUILD
              <br />
              <span className="text-muted-foreground">SOMETHING REAL.</span>
            </h2>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="mailto:hello@kuldeepmandal.dev"
                className="inline-flex items-center gap-3 border border-foreground px-5 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.15em] transition-colors hover:bg-foreground hover:text-background"
              >
                Email me
                <span>↗</span>
              </a>

              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 border border-border px-5 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                GitHub
                <span>↗</span>
              </a>

              <a
                href="#top"
                className="inline-flex items-center gap-3 px-2 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Download CV
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 rule-t flex flex-wrap items-center justify-between gap-4 pt-5 font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          <span>Kuldeep Mandal — Bengaluru, India</span>

          <span>
            Kernel is watching <span className="text-accent">·</span> press ⌘K
          </span>
        </div>
      </div>
    </footer>
  );
}
