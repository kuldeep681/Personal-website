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
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        solid ? "border-b border-hairline bg-background/80 backdrop-blur-md" : ""
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-12">
        <a
          href="#top"
          className="font-display text-[13px] uppercase tracking-[0.28em] text-foreground"
        >
          Kuldeep Mandal
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={onCommand}
          className="flex items-center gap-2 border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
        >
          <span className="hidden sm:inline">Search</span>
          <span>⌘K</span>
        </button>
      </div>
    </header>
  );
}
