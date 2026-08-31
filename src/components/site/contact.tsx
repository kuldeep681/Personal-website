import { GITHUB_URL } from "./data";
import { useReveal } from "./use-reveal";

export function Contact() {
  const r = useReveal();
  return (
    <footer
      id="contact"
      className="grain scroll-mt-24 border-t border-hairline py-28 md:py-40"
    >
      <div ref={r.ref} className={`${r.className} mx-auto max-w-[1400px] px-6 md:px-12`}>
        <p className="eyebrow">Contact</p>
        <h2 className="display mt-10 text-[12vw] sm:text-[9vw] lg:text-[6vw]">
          LET'S BUILD
          <br />
          <span className="text-muted-foreground">SOMETHING REAL.</span>
        </h2>

        <div className="mt-16 flex flex-wrap items-center gap-3">
          <a
            href="mailto:hello@kuldeepmandal.dev"
            className="inline-flex items-center gap-3 border border-foreground px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors hover:bg-foreground hover:text-background"
          >
            Email me <span>↗</span>
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 border border-border px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
          >
            GitHub <span>↗</span>
          </a>
          <a
            href="#top"
            className="inline-flex items-center gap-3 px-2 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Download CV
          </a>
        </div>

        <div className="mt-24 rule-t flex flex-wrap items-center justify-between gap-4 pt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>Kuldeep Mandal — Bengaluru, India</span>
          <span>
            Kernel is watching <span className="text-accent">·</span> press ⌘K
          </span>
        </div>
      </div>
    </footer>
  );
}
