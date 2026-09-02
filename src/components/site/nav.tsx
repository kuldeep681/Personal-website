import { useEffect, useState } from "react";
import { GITHUB_URL } from "./data";

const LINKEDIN_URL = "https://www.linkedin.com/in/kuldeep-mandal175514";
const REDDIT_URL =
  "https://www.reddit.com/u/Inevitable-Bear-/s/fjEtp9s7Wd";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  {
    label: "GitHub",
    href: GITHUB_URL,
    external: true,
  },
  {
    label: "LinkedIn",
    href: LINKEDIN_URL,
    external: true,
  },
  {
    label: "Reddit",
    href: REDDIT_URL,
    external: true,
  },
];

export function Nav({ onCommand }: { onCommand: () => void }) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setSolid(window.scrollY > 32);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-out ${
        solid
          ? "border-b border-hairline bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-12 md:py-5">
        {/* Logo */}
        <a
          href="#top"
          className="group relative flex shrink-0 items-center gap-2 font-display text-[14px] font-semibold uppercase tracking-[0.25em] text-foreground transition-colors duration-300 hover:text-accent"
        >
          <span className="relative flex h-2 w-2 items-center justify-center">
            <span className="h-1.5 w-1.5 bg-accent transition-transform duration-300 group-hover:scale-125" />

            <span className="absolute inset-0 rounded-full border border-accent/0 transition-all duration-500 group-hover:scale-150 group-hover:border-accent/40" />
          </span>

          <span>Kuldeep Mandal</span>

          <span className="absolute -bottom-1 left-4 h-px w-0 bg-accent transition-all duration-500 ease-out group-hover:w-[calc(100%-1rem)]" />
        </a>

        {/* Navigation */}
        <nav className="hidden items-center gap-5 md:flex lg:gap-7">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="group relative flex items-center gap-1.5 px-1 py-2 font-mono text-[12px] font-semibold uppercase tracking-[0.13em] text-muted-foreground transition-colors duration-300 hover:text-foreground lg:text-[13px]"
            >
              <span>{link.label}</span>

              {link.external && (
                <span className="text-[10px] text-foreground/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent">
                  ↗
                </span>
              )}

              {/* Animated underline */}
              <span className="absolute -bottom-0.5 left-1 h-px w-0 bg-accent transition-all duration-400 ease-out group-hover:w-[calc(100%-0.5rem)]" />

              {/* Small hover marker */}
              <span className="absolute -left-1 top-1/2 h-1 w-0 -translate-y-1/2 bg-accent opacity-0 transition-all duration-300 group-hover:w-0.5 group-hover:opacity-100" />
            </a>
          ))}
        </nav>

        {/* Command */}
        <button
          type="button"
          onClick={onCommand}
          aria-label="Open command palette"
          className="group flex shrink-0 items-center gap-2 border border-border px-3 py-2 font-mono text-[12px] font-semibold uppercase tracking-[0.13em] text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] active:translate-y-0 active:scale-[0.97]"
        >
          <span className="hidden sm:inline">Search</span>

          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
            ⌘K
          </span>
        </button>
      </div>
    </header>
  );
}