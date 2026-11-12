"use client";
import { useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { TableToolbar } from "./table-toolbar";
import { TablePagination } from "./table-pagination";
import { EmptyState } from "./empty-state";

export type DataColumn<T> = {
  key: string;
  label: string;
  value: (row: T) => string | number;
  render?: (row: T) => ReactNode;
};
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  label,
  pageSize = 4,
  search,
}: {
  rows: T[];
  columns: DataColumn<T>[];
  rowKey: (row: T) => string;
  label: string;
  pageSize?: number;
  search?: { value: string; onChange: (value: string) => void };
}) {
  const [localQuery, setQuery] = useState("");
  const query = search?.value ?? localQuery;
  const [sort, setSort] = useState<{ key: string; descending: boolean } | null>(null);
  const [page, setPage] = useState(0);
  const filtered = rows.filter((row) =>
    columns.some((column) =>
      String(column.value(row)).toLowerCase().includes(query.trim().toLowerCase()),
    ),
  );
  const column = columns.find((item) => item.key === sort?.key);
  if (column && sort)
    filtered.sort((a, b) => {
      const first = column.value(a),
        second = column.value(b);
      const result =
        typeof first === "number" && typeof second === "number"
          ? first - second
          : String(first).localeCompare(String(second));
      return sort.descending ? -result : result;
    });
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  return (
    <div className="data-table">
      <TableToolbar
        label={label}
        query={query}
        onQueryChange={(value) => {
          if (search) search.onChange(value);
          else setQuery(value);
          setPage(0);
        }}
      />
      <div className="data-table-scroll">
        <table aria-label={label}>
          <thead>
            <tr>
              {columns.map((item) => (
                <th
                  key={item.key}
                  aria-sort={
                    sort?.key === item.key ? (sort.descending ? "descending" : "ascending") : "none"
                  }
                >
                  <button
                    onClick={() => {
                      setSort({
                        key: item.key,
                        descending: sort?.key === item.key && !sort.descending,
                      });
                      setPage(0);
                    }}
                  >
                    {item.label}
                    {sort?.key === item.key ? (
                      sort.descending ? (
                        <ArrowDown size={11} />
                      ) : (
                        <ArrowUp size={11} />
                      )
                    ) : (
                      <ChevronsUpDown size={11} />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((item) => (
                  <td key={item.key} data-label={item.label}>
                    {item.render ? item.render(row) : item.value(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!filtered.length && (
        <EmptyState>No matching {label.toLowerCase()}. Try another search.</EmptyState>
      )}
      <TablePagination
        label={label}
        count={filtered.length}
        currentPage={currentPage}
        pageCount={pageCount}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </div>
  );
}
