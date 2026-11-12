import Image from "next/image";
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  LibraryBig,
  Music2,
  Play,
  SearchX,
  UsersRound,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { ResultType, SearchCategory, SearchResult } from "./search-data";

const labels: Record<ResultType, string> = {
  people: "People",
  projects: "Projects",
  files: "Files",
  articles: "Knowledge base",
  videos: "Videos",
  music: "Music",
  books: "Books",
  images: "Images",
};
const icons: Record<ResultType, LucideIcon> = {
  people: UsersRound,
  projects: BriefcaseBusiness,
  files: FileText,
  articles: BookOpen,
  videos: Video,
  music: Music2,
  books: LibraryBig,
  images: FileImage,
};
const fileIcons: Record<NonNullable<SearchResult["extension"]>, LucideIcon> = {
  PDF: FileText,
  DOCX: FileText,
  XLSX: FileSpreadsheet,
  PNG: FileImage,
  ZIP: FileArchive,
};
const accents: Record<ResultType, string> = {
  people: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
  projects: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
  files: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
  articles: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  videos: "bg-pink-500/10 text-pink-600 dark:text-pink-300",
  music: "bg-purple-500/10 text-purple-600 dark:text-purple-300",
  books: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  images: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
};

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return text;
  const index = text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());
  if (index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded-sm bg-amber-200/70 px-0.5 text-inherit dark:bg-amber-400/25">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}

export function SearchResults({
  results,
  query,
  onPreview,
  onClear,
  category,
}: {
  results: SearchResult[];
  query: string;
  onPreview: (value: SearchResult) => void;
  onClear: () => void;
  category: SearchCategory;
}) {
  if (!results.length)
    return (
      <div className="px-5 py-14 text-center">
        <SearchX size={28} className="mx-auto text-muted" />
        <h2 className="mt-3 text-[14px] font-semibold">No matching results</h2>
        <p className="mt-1 text-[12px] text-muted">
          Check the spelling or broaden your search and filters.
        </p>
        <Button size="sm" variant="outline" className="mt-4" onClick={onClear}>
          Clear search and filters
        </Button>
      </div>
    );
  if (category === "videos" || category === "images")
    return (
      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => onPreview(item)}
            className="group min-w-0 overflow-hidden rounded-lg border border-border text-left text-foreground transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-accent"
          >
            <span className="relative block aspect-[16/10] overflow-hidden bg-surface-alt">
              {item.image && (
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                />
              )}
              {item.video && (
                <>
                  <span className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/25" />
                  <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-accent shadow-sm">
                    <Play size={18} fill="currentColor" />
                  </span>
                  <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    0:03
                  </span>
                </>
              )}
            </span>
            <span className="block p-3">
              <span className="block truncate text-[12px] font-semibold">{item.title}</span>
              <span className="mt-1 block text-[11px] text-muted">
                {item.metadata} · {item.updated}
              </span>
            </span>
          </button>
        ))}
      </div>
    );
  if (category === "books")
    return (
      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => onPreview(item)}
            className="flex min-w-0 gap-3 rounded-lg border border-border p-3 text-left text-foreground transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-accent"
          >
            <span className="relative h-28 w-[76px] shrink-0 overflow-hidden rounded-r-md bg-surface-alt shadow-sm">
              {item.image && (
                <Image src={item.image} alt="" fill sizes="76px" className="object-cover" />
              )}
            </span>
            <span className="min-w-0">
              <span className="block text-[12px] font-semibold">{item.title}</span>
              <span className="mt-1 block text-[11px] leading-4 text-muted">
                {item.description}
              </span>
              <span className="mt-2 block text-[10px] text-accent">{item.metadata}</span>
            </span>
          </button>
        ))}
      </div>
    );
  return (
    <div className="min-w-0">
      <ol className="divide-y divide-border">
        {results.map((item) => {
          const Icon =
            item.type === "files" ? fileIcons[item.extension ?? "PDF"] : icons[item.type];
          return (
            <li
              key={item.id}
              className="group px-4 py-5 transition-colors hover:bg-surface-alt/60 sm:px-6"
            >
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                {item.type === "people" ? (
                  <UserAvatar name={item.title} size={42} />
                ) : item.image && (item.type === "videos" || item.type === "books") ? (
                  <span className="relative size-10 shrink-0 overflow-hidden rounded-md bg-surface-alt">
                    <Image src={item.image} alt="" fill sizes="40px" className="object-cover" />
                  </span>
                ) : (
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-lg ${accents[item.type]}`}
                  >
                    <Icon size={18} />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onPreview(item)}
                    className="flex max-w-full items-center gap-1.5 text-left text-[14px] font-semibold leading-5 text-foreground hover:text-accent focus-visible:rounded focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <span className="truncate">
                      <Highlight text={item.title} query={query} />
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </button>
                  <p className="mt-1 truncate text-[11px] text-emerald-600 dark:text-emerald-400">
                    Workspace / {labels[item.type]} / {item.metadata}
                  </p>
                  <p className="mt-2 line-clamp-2 text-[12px] leading-[1.6] text-muted">
                    <Highlight text={item.description} query={query} />
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
                    {item.type === "people" && (
                      <>
                        <span>{item.email}</span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {item.status}
                        </span>
                      </>
                    )}
                    {item.type === "projects" && (
                      <>
                        <span>Owner {item.owner}</span>
                        <span>{item.progress}% complete</span>
                        <span>{item.status}</span>
                      </>
                    )}
                    {item.type === "files" && (
                      <>
                        <span>
                          {item.extension} · {item.size}
                        </span>
                        <span>By {item.owner}</span>
                      </>
                    )}
                    {item.type === "articles" && (
                      <>
                        <span>{item.readingTime}</span>
                        <span>Guide</span>
                      </>
                    )}
                    {item.type === "videos" && <span>Silent demo video · 3 sec</span>}
                    {item.type === "images" && <span>Image preview</span>}
                    {item.type === "music" && <span>{item.metadata}</span>}
                    {item.type === "books" && <span>{item.metadata}</span>}
                    <span className="sm:hidden">{item.updated}</span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
