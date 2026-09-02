import {
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  REDDIT_URL,
} from "./data";
import { useReveal } from "./use-reveal";

export function Contact() {
  const r = useReveal();

  return (
    <footer
      id="contact"
      className="grain scroll-mt-24 border-t border-hairline py-16 md:py-20"
    >
      <div
        ref={r.ref}
        className={`${r.className} mx-auto max-w-[1400px] px-6 md:px-12`}
      >
        {/* Contact header */}
        <div className="grid grid-cols-12 items-start gap-y-6 lg:gap-x-8">
          {/* Label */}
          <div className="col-span-12 lg:col-span-3">
            <p className="eyebrow">Contact</p>
          </div>

          {/* Main statement */}
          <div className="col-span-12 lg:col-span-6">
            <h2 className="display max-w-3xl text-[7vw] leading-[0.9] tracking-tight sm:text-[5vw] lg:text-[3.2vw]">
              LET&apos;S BUILD
              <br />
              <span className="text-muted-foreground">
                SOMETHING REAL.
              </span>
            </h2>
          </div>

          {/* Supporting text */}
          <div className="col-span-12 lg:col-span-3 lg:pt-1">
            <p className="max-w-xs text-[16px] leading-6 text-muted-foreground">
              Have a problem worth solving? I&apos;m interested in building
              useful software across backend systems, applied AI and
              full-stack products.
            </p>

            <p className="mt-5 font-mono text-[12px] font-medium uppercase tracking-[0.11em] text-foreground/45">
              Usually somewhere between
              <br />
              an idea and a working system.
            </p>
          </div>
        </div>

        {/* Contact links */}
        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:mt-12">
          <a
            href={`mailto:${EMAIL}`}
            className="group relative flex min-h-14 items-center justify-between overflow-hidden border border-foreground px-4 py-3 font-mono text-[13px] font-medium uppercase tracking-[0.13em] text-foreground transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-foreground hover:text-background hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)]"
          >
            <span className="relative z-10">Email</span>

            <span className="relative z-10 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </a>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="group relative flex min-h-14 items-center justify-between overflow-hidden border border-border px-4 py-3 font-mono text-[13px] font-medium uppercase tracking-[0.13em] text-muted-foreground transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent hover:text-accent hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)]"
          >
            <span>GitHub</span>

            <span className="transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </a>

          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="group relative flex min-h-14 items-center justify-between overflow-hidden border border-border px-4 py-3 font-mono text-[13px] font-medium uppercase tracking-[0.13em] text-muted-foreground transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent hover:text-accent hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)]"
          >
            <span>LinkedIn</span>

            <span className="transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </a>

          <a
            href={REDDIT_URL}
            target="_blank"
            rel="noreferrer"
            className="group relative flex min-h-14 items-center justify-between overflow-hidden border border-border px-4 py-3 font-mono text-[13px] font-medium uppercase tracking-[0.13em] text-muted-foreground transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent hover:text-accent hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)]"
          >
            <span>Reddit</span>

            <span className="transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </a>
        </div>

        {/* Footer metadata */}
        <div className="mt-12 rule-t flex flex-wrap items-center justify-between gap-4 pt-5 font-mono text-[13px] font-medium uppercase tracking-[0.13em] text-muted-foreground">
          <span>Kuldeep Mandal — Bengaluru, India</span>

          <span>
            Kernel is sleeping{" "}
            <span className="text-accent">·</span> press ⌘K
          </span>
        </div>
      </div>
    </footer>
  );
}