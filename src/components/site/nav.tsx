import { useEffect, useState } from "react";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Engineering", href: "#engineering" },
  { label: "About", href: "#about" },
  { label: "Lab", href: "#lab" },
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
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        solid ? "border-b border-hairline bg-background/75 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-12 md:py-5">
        <a
          href="#top"
          className="font-display text-[14px] font-semibold uppercase tracking-[0.25em] text-foreground transition-opacity hover:opacity-70"
        >
          Kuldeep Mandal
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-mono text-[13px] font-semibold uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={onCommand}
          aria-label="Open command palette"
          className="flex items-center gap-2 border border-border px-3 py-2 font-mono text-[12px] font-semibold uppercase tracking-[0.13em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
        >
          <span className="hidden sm:inline">Search</span>
          <span>⌘K</span>
        </button>
      </div>
    </header>
  );
}
