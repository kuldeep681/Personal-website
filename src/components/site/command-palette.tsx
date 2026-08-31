import { useEffect, useMemo, useState } from "react";
import { NAV_ITEMS } from "./data";

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return NAV_ITEMS;
    }

    return NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(value));
  }, [query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!open);
        return;
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  useEffect(() => {
    if (active >= results.length) {
      setActive(Math.max(0, results.length - 1));
    }
  }, [active, results.length]);

  if (!open) {
    return null;
  }

  const go = (index: number) => {
    const item = results[index];

    if (!item) {
      return;
    }

    setOpen(false);

    if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }

    window.location.hash = item.href;
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-background/75 px-4 pt-[14vh] backdrop-blur-md"
      role="presentation"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md overflow-hidden border border-border bg-popover shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-hairline px-4">
          <span className="font-mono text-[13px] font-medium text-accent">›</span>

          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();

                setActive((current) => Math.min(current + 1, results.length - 1));
              }

              if (event.key === "ArrowUp") {
                event.preventDefault();

                setActive((current) => Math.max(current - 1, 0));
              }

              if (event.key === "Enter") {
                event.preventDefault();
                go(active);
              }
            }}
            placeholder="Jump to a section"
            className="w-full bg-transparent py-4 font-mono text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
          />

          <kbd className="hidden border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground sm:inline">
            esc
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto py-1.5">
          {results.length === 0 && (
            <p className="px-4 py-5 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
              No matches.
            </p>
          )}

          {results.map((item, index) => (
            <button
              key={item.label}
              type="button"
              onMouseEnter={() => setActive(index)}
              onClick={() => go(index)}
              className={`flex w-full items-baseline gap-4 px-4 py-3 text-left font-mono text-[12px] font-medium uppercase tracking-[0.14em] transition-colors ${
                index === active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
            >
              <span className="text-accent/80">{item.index}</span>

              <span>{item.label}</span>

              {item.external && <span className="ml-auto text-muted-foreground">↗</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
