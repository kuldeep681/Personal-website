import { useEffect, useMemo, useState } from "react";
import { NAV_ITEMS } from "./data";

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(
    () => NAV_ITEMS.filter((i) => i.label.toLowerCase().includes(q.trim().toLowerCase())),
    [q],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
    }
  }, [open]);

  if (!open) return null;

  const go = (i: number) => {
    const item = results[i];
    if (!item) return;
    setOpen(false);
    if (item.external) window.open(item.href, "_blank");
    else window.location.hash = item.href;
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-background/70 px-4 pt-[18vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg border border-border bg-popover"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-hairline px-4">
          <span className="font-mono text-[11px] text-accent">›</span>
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown")
                setActive((a) => Math.min(a + 1, results.length - 1));
              if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
              if (e.key === "Enter") go(active);
            }}
            placeholder="Jump to a section"
            className="w-full bg-transparent py-4 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="py-1">
          {results.length === 0 && (
            <p className="px-4 py-4 font-mono text-xs text-muted-foreground">No matches.</p>
          )}
          {results.map((item, i) => (
            <button
              key={item.label}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(i)}
              className={`flex w-full items-baseline gap-3 px-4 py-2.5 text-left font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                i === active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <span className="text-accent/70">{item.index}</span>
              {item.label}
              {item.external && <span className="ml-auto text-muted-foreground">↗</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
