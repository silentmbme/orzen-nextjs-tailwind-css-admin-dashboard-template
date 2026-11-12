import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "./icon-button";

export function TablePagination({
  label,
  count,
  currentPage,
  pageCount,
  pageSize,
  onPageChange,
}: {
  label: string;
  count: number;
  currentPage: number;
  pageCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="data-table-pagination">
      <span role="status">
        {count ? currentPage * pageSize + 1 : 0}–{Math.min((currentPage + 1) * pageSize, count)} of{" "}
        {count}
      </span>
      <div>
        <IconButton
          aria-label={`Previous ${label} page`}
          disabled={!currentPage}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={13} />
        </IconButton>
        <span>
          {currentPage + 1} / {pageCount}
        </span>
        <IconButton
          aria-label={`Next ${label} page`}
          disabled={currentPage + 1 >= pageCount}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={13} />
        </IconButton>
      </div>
    </div>
  );
}
