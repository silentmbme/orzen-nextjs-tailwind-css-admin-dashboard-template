import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FAQSearch({
  query,
  onChange,
  onClear,
}: {
  query: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-[9px] border border-card-border bg-surface-alt px-4 py-6 sm:px-7 sm:py-7">
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:linear-gradient(90deg,transparent_30%,black)]" />
      <div className="relative max-w-2xl">
        <span className="text-[10px] font-semibold uppercase tracking-[.06em] text-accent">
          Knowledge base
        </span>
        <h2 className="mt-1 text-[18px] font-semibold tracking-tight">How can we help you?</h2>
        <p className="mt-1 text-[11px] text-muted">
          Search questions, answers, and topics across the help center.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <label htmlFor="faq-search" className="relative min-w-0 flex-1 basis-60">
            <span className="sr-only">Search help articles</span>
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <Input
              id="faq-search"
              type="search"
              value={query}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Search the help center..."
              className="w-full bg-surface pl-9! pr-9!"
            />
            {query && (
              <button
                type="button"
                onClick={onClear}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded text-muted hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-accent"
              >
                <X size={13} />
              </button>
            )}
          </label>
          {query && (
            <Button variant="outline" onClick={onClear}>
              Clear search
            </Button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px] text-muted">
          <span>Popular:</span>
          {["billing", "profile", "integrations"].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => onChange(term)}
              className="rounded-full border border-border bg-surface px-2 py-1 text-foreground hover:border-accent/40 focus-visible:outline-2 focus-visible:outline-accent"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
