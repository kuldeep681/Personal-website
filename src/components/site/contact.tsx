import { GITHUB_URL } from "./data";
import { useReveal } from "./use-reveal";

const LINKEDIN_URL = "https://www.linkedin.com/in/kuldeep-mandal175514";
const REDDIT_URL = "https://www.reddit.com/";

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
        <div className="grid grid-cols-12 gap-y-7 lg:gap-x-10">
          {/* Label */}
          <div className="col-span-12 lg:col-span-4">
            <p className="eyebrow">Contact</p>
          </div>

          {/* Main contact area */}
          <div className="col-span-12 lg:col-span-8">
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(240px,0.8fr)] lg:items-end lg:gap-12">
              <h2 className="display max-w-5xl text-[7vw] leading-[0.9] tracking-tight sm:text-[5vw] lg:text-[3.5vw]">
                LET'S BUILD
                <br />
                <span className="text-muted-foreground">
                  SOMETHING REAL.
                </span>
              </h2>

              <p className="max-w-sm text-[16px] leading-6 text-muted-foreground">
                Open to interesting engineering problems, useful products and
                conversations around backend systems, AI and software.
              </p>
            </div>

            {/* Social links */}
            <div className="mt-9 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <a
                href="mailto:hello@kuldeepmandal.dev"
                className="group flex min-h-12 items-center justify-between border border-foreground px-4 py-3 font-mono text-[13px] font-medium uppercase tracking-[0.13em] text-foreground transition-all duration-300 hover:bg-foreground hover:text-background"
              >
                <span>Email</span>
                <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </a>

              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-12 items-center justify-between border border-border px-4 py-3 font-mono text-[13px] font-medium uppercase tracking-[0.13em] text-muted-foreground transition-all duration-300 hover:border-accent hover:text-accent"
              >
                <span>GitHub</span>
                <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </a>

              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-12 items-center justify-between border border-border px-4 py-3 font-mono text-[13px] font-medium uppercase tracking-[0.13em] text-muted-foreground transition-all duration-300 hover:border-accent hover:text-accent"
              >
                <span>LinkedIn</span>
                <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </a>

              <a
                href={REDDIT_URL}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-12 items-center justify-between border border-border px-4 py-3 font-mono text-[13px] font-medium uppercase tracking-[0.13em] text-muted-foreground transition-all duration-300 hover:border-accent hover:text-accent"
              >
                <span>Reddit</span>
                <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer metadata */}
        <div className="mt-14 rule-t flex flex-wrap items-center justify-between gap-4 pt-5 font-mono text-[13px] font-medium uppercase tracking-[0.13em] text-muted-foreground">
          <span>Kuldeep Mandal — Bengaluru, India</span>

          <span>
            Kernel is watching{" "}
            <span className="text-accent">·</span> press ⌘K
          </span>
        </div>
      </div>
    </footer>
  );
}