import { RotateCcw } from "lucide-react";
import { Select } from "@/components/ui/select";
import type { SearchCategory } from "./search-data";

export type SortOrder = "relevance" | "newest" | "oldest";
export type DateRange = "any" | "week" | "month";

export function SearchFilters({
  sort,
  type,
  range,
  onSort,
  onType,
  onRange,
  onReset,
}: {
  sort: SortOrder;
  type: SearchCategory;
  range: DateRange;
  onSort: (value: SortOrder) => void;
  onType: (value: SearchCategory) => void;
  onRange: (value: DateRange) => void;
  onReset: () => void;
}) {
  return (
    <div aria-label="Refine search results" className="flex min-w-0 flex-wrap items-center gap-2">
      <span className="mr-1 text-[11px] font-medium text-muted">Filter by</span>
      <Select
        aria-label="Filter result type"
        value={type}
        onChange={(event) => onType(event.target.value as SearchCategory)}
        className="min-w-0 max-w-[145px] text-[11px]!"
      >
        <option value="all">All types</option>
        <option value="people">People</option>
        <option value="projects">Projects</option>
        <option value="files">Files</option>
        <option value="articles">Articles</option>
        <option value="videos">Videos</option>
        <option value="music">Music</option>
        <option value="books">Books</option>
        <option value="images">Images</option>
      </Select>
      <Select
        aria-label="Filter by date"
        value={range}
        onChange={(event) => onRange(event.target.value as DateRange)}
        className="min-w-0 max-w-[145px] text-[11px]!"
      >
        <option value="any">Any time</option>
        <option value="week">Past week</option>
        <option value="month">Past month</option>
      </Select>
      <Select
        aria-label="Sort results"
        value={sort}
        onChange={(event) => onSort(event.target.value as SortOrder)}
        className="min-w-0 max-w-[150px] text-[11px]!"
      >
        <option value="relevance">Most relevant</option>
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </Select>
      <button
        type="button"
        onClick={onReset}
        className="grid size-8 place-items-center rounded-md text-muted hover:bg-surface-alt hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
        aria-label="Reset search filters"
      >
        <RotateCcw size={14} />
      </button>
    </div>
  );
}
