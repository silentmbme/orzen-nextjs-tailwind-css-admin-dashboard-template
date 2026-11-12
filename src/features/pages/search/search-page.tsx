"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";
import {
  BookOpen,
  BriefcaseBusiness,
  FileText,
  Images,
  LibraryBig,
  Music2,
  Search,
  UsersRound,
  Video,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { categories, results, type SearchCategory, type SearchResult } from "./search-data";
import { SearchFilters, type DateRange, type SortOrder } from "./search-filters";
import { SearchResults } from "./search-results";

const categoryMeta = [
  { id: "all", label: "All results", icon: Search },
  { id: "people", label: "People", icon: UsersRound },
  { id: "projects", label: "Projects", icon: BriefcaseBusiness },
  { id: "files", label: "Files", icon: FileText },
  { id: "articles", label: "Articles", icon: BookOpen },
  { id: "videos", label: "Videos", icon: Video },
  { id: "music", label: "Music", icon: Music2 },
  { id: "books", label: "Books", icon: LibraryBig },
  { id: "images", label: "Images", icon: Images },
] as const;
const newestTimestamp = Math.max(...results.map((result) => result.timestamp));

function relevance(item: SearchResult, query: string) {
  if (!query) return 0;
  const needle = query.toLocaleLowerCase();
  if (item.title.toLocaleLowerCase() === needle) return 4;
  if (item.title.toLocaleLowerCase().includes(needle)) return 3;
  if (item.metadata.toLocaleLowerCase().includes(needle)) return 2;
  return 1;
}

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [category, setCategory] = useState<SearchCategory>("all");
  const [type, setType] = useState<SearchCategory>("all");
  const [range, setRange] = useState<DateRange>("any");
  const [sort, setSort] = useState<SortOrder>("relevance");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [preview, setPreview] = useState<SearchResult | null>(null);
  const normalized = submitted.trim().toLocaleLowerCase();
  const matched = useMemo(
    () =>
      results.filter((item) => {
        if (type !== "all" && item.type !== type) return false;
        if (range === "week" && newestTimestamp - item.timestamp > 7 * 86400) return false;
        if (range === "month" && newestTimestamp - item.timestamp > 30 * 86400) return false;
        return (
          !normalized ||
          [
            item.title,
            item.description,
            item.metadata,
            item.owner,
            item.email,
            item.department,
            item.extension,
          ].some((value) => value?.toLocaleLowerCase().includes(normalized))
        );
      }),
    [normalized, type, range],
  );
  const counts = Object.fromEntries(
    categories.map((id) => [
      id,
      id === "all" ? matched.length : matched.filter((item) => item.type === id).length,
    ]),
  ) as Record<SearchCategory, number>;
  const visible = [...matched.filter((item) => category === "all" || item.type === category)].sort(
    (a, b) =>
      sort === "newest"
        ? b.timestamp - a.timestamp
        : sort === "oldest"
          ? a.timestamp - b.timestamp
          : relevance(b, normalized) - relevance(a, normalized) || b.timestamp - a.timestamp,
  );
  const suggestions = query.trim()
    ? results
        .filter((item) =>
          `${item.title} ${item.metadata}`
            .toLocaleLowerCase()
            .includes(query.trim().toLocaleLowerCase()),
        )
        .slice(0, 5)
    : [];

  function search(value = query) {
    const clean = value.trim();
    setQuery(clean);
    setSubmitted(clean);
    setCategory("all");
    setType("all");
    setShowSuggestions(false);
  }
  function reset() {
    setQuery("");
    setSubmitted("");
    setType("all");
    setCategory("all");
    setRange("any");
    setSort("relevance");
    setShowSuggestions(false);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    search();
  }

  return (
    <div className="grid min-w-0 gap-4">
      <PageHeader title="Search Results" />
      <div className="relative mx-auto w-full max-w-[720px] pt-5 sm:pt-8">
        <form onSubmit={submit} role="search" className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <label htmlFor="workspace-search" className="sr-only">
              Search workspace results
            </label>
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <Input
              id="workspace-search"
              type="search"
              autoComplete="off"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSubmitted(event.target.value);
                setCategory("all");
                setType("all");
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => window.setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search the workspace..."
              className="h-12! w-full rounded-lg! pl-10! pr-9! text-[13px]!"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={reset}
                className="absolute right-2.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-accent"
              >
                <X size={14} />
              </button>
            )}
            {showSuggestions && query.trim() && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-card border border-border bg-surface shadow-sm">
                {suggestions.length ? (
                  suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => search(item.title)}
                      className="flex w-full items-center justify-between gap-2 border-b border-border px-3 py-2.5 text-left text-[12px] last:border-b-0 hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      <span className="truncate">{item.title}</span>
                      <span className="shrink-0 capitalize text-[10px] text-muted">
                        {item.type}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-[11px] text-muted">
                    No title suggestions. Search the full result text below.
                  </p>
                )}
              </div>
            )}
          </div>
          <Button type="submit" variant="primary" className="h-12! px-5!">
            Discover
          </Button>
        </form>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
          <span className="mr-1 text-muted">Popular searches:</span>
          {["design", "mobile", "billing", "analytics"].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => search(term)}
              className="rounded-full bg-accent/10 px-2.5 py-1 font-medium text-accent transition-colors hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-accent"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
      <section
        aria-label="Search results"
        className="min-w-0 overflow-hidden rounded-card border border-card-border bg-surface"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <h2 role="status" className="text-[13px] font-medium">
            <span className="text-muted">Found </span>
            <span className="rounded bg-accent/10 px-1.5 py-0.5 font-semibold text-accent">
              {visible.length}
            </span>
            <span className="text-muted">
              {" "}
              {visible.length === 1 ? "result" : "results"}{" "}
              {normalized ? "for" : "in the workspace"}
            </span>
            {normalized && <span className="ml-1 font-semibold">“{submitted}”</span>}
          </h2>
          <SearchFilters
            sort={sort}
            type={type}
            range={range}
            onSort={setSort}
            onType={(value) => {
              setType(value);
              setCategory("all");
            }}
            onRange={setRange}
            onReset={() => {
              setSort("relevance");
              setType("all");
              setRange("any");
              setCategory("all");
            }}
          />
        </div>
        <nav
          aria-label="Search result categories"
          className="max-w-full overflow-x-auto border-b border-border px-3 sm:px-4"
        >
          <div className="flex min-w-max gap-1">
            {categoryMeta.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-current={category === item.id ? "page" : undefined}
                onClick={() => setCategory(item.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-2.5 py-3 text-[11px] font-medium focus-visible:outline-2 focus-visible:outline-accent ${category === item.id ? "border-accent text-accent" : "border-transparent text-muted hover:text-foreground"}`}
              >
                <item.icon size={13} />
                {item.label}
                <span className="rounded bg-surface-alt px-1.5 py-0.5 text-[10px]">
                  {counts[item.id]}
                </span>
              </button>
            ))}
          </div>
        </nav>
        <SearchResults
          results={visible}
          query={submitted}
          onPreview={setPreview}
          onClear={reset}
          category={category}
        />
      </section>
      <Dialog
        open={Boolean(preview)}
        title={preview?.title ?? "Result preview"}
        onClose={() => setPreview(null)}
      >
        <div className="grid gap-4 p-4 text-[12px]">
          {preview?.video ? (
            <video
              key={preview.video}
              src={preview.video}
              poster={preview.image}
              controls
              autoPlay
              playsInline
              aria-label={preview.title}
              className="aspect-[16/10] w-full rounded-lg bg-black object-cover"
            />
          ) : (
            preview?.image && (
              <div
                className={`relative w-full overflow-hidden rounded-lg bg-surface-alt ${preview.type === "books" ? "mx-auto aspect-[2/3] max-w-[220px]" : "aspect-[16/10]"}`}
              >
                <Image
                  src={preview.image}
                  alt=""
                  fill
                  sizes={preview.type === "books" ? "220px" : "560px"}
                  className="object-cover"
                />
              </div>
            )
          )}
          <span className="w-fit rounded bg-accent/10 px-2 py-1 text-[10px] font-semibold capitalize text-accent">
            {preview?.type}
          </span>
          <p className="leading-6 text-muted">{preview?.description}</p>
          <dl className="grid grid-cols-[110px_minmax(0,1fr)] gap-x-3 gap-y-3 border-t border-border pt-4">
            <dt className="text-muted">Category</dt>
            <dd>{preview?.metadata}</dd>
            <dt className="text-muted">Updated</dt>
            <dd>{preview?.updated}</dd>
            {preview?.owner && (
              <>
                <dt className="text-muted">Owner</dt>
                <dd>{preview.owner}</dd>
              </>
            )}
            {preview?.email && (
              <>
                <dt className="text-muted">Email</dt>
                <dd>{preview.email}</dd>
              </>
            )}
            {preview?.status && (
              <>
                <dt className="text-muted">Status</dt>
                <dd>{preview.status}</dd>
              </>
            )}
            {preview?.size && (
              <>
                <dt className="text-muted">File size</dt>
                <dd>{preview.size}</dd>
              </>
            )}
          </dl>
        </div>
      </Dialog>
    </div>
  );
}
