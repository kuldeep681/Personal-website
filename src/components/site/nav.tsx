import { useEffect, useState } from "react";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Engineering", href: "#engineering" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
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
          className="group relative font-display text-[14px] font-semibold uppercase tracking-[0.25em] text-foreground transition-opacity duration-300 hover:opacity-80"
        >
          Kuldeep Mandal

          <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-500 ease-out group-hover:w-full" />
        </a>

        {/* Navigation */}
        <nav className="hidden items-center gap-7 md:flex lg:gap-8">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative py-1 font-mono text-[13px] font-semibold uppercase tracking-[0.15em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              {link.label}

              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-400 ease-out group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Command */}
        <button
          type="button"
          onClick={onCommand}
          aria-label="Open command palette"
          className="group flex items-center gap-2 border border-border px-3 py-2 font-mono text-[12px] font-semibold uppercase tracking-[0.13em] text-muted-foreground transition-all duration-300 hover:border-accent hover:text-accent active:scale-[0.97]"
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