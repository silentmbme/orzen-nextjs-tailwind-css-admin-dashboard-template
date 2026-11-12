"use client";
import { useState } from "react";
import { Calculator, CornerDownLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShowcaseCard as Card } from "@/components/ui/showcase-card";

const months = ["January", "February", "March", "April", "May", "June"] as const;
type Month = (typeof months)[number];
type PlanRow = { id: string; label: string; region: string; values: Record<Month, number> };
const initial: PlanRow[] = [
  {
    id: "north",
    label: "Studio Headphones",
    region: "North America",
    values: { January: 84, February: 92, March: 106, April: 118, May: 126, June: 140 },
  },
  {
    id: "europe",
    label: "Orbit Smartwatch",
    region: "Europe",
    values: { January: 72, February: 78, March: 88, April: 94, May: 102, June: 110 },
  },
  {
    id: "apac",
    label: "Orzen Speaker",
    region: "Asia Pacific",
    values: { January: 96, February: 104, March: 112, April: 120, May: 134, June: 142 },
  },
  {
    id: "latam",
    label: "Arc Controller",
    region: "Latin America",
    values: { January: 48, February: 54, March: 61, April: 68, May: 74, June: 82 },
  },
];
type Cell = { row: number; col: number };
export function SpreadsheetTable() {
  const [rows, setRows] = useState(initial),
    [active, setActive] = useState<Cell>({ row: 0, col: 0 }),
    [editing, setEditing] = useState<Cell | null>(null),
    [draft, setDraft] = useState(""),
    [error, setError] = useState("");
  const focus = (cell: Cell) => {
    const next = {
      row: Math.max(0, Math.min(rows.length - 1, cell.row)),
      col: Math.max(0, Math.min(months.length - 1, cell.col)),
    };
    setActive(next);
    requestAnimationFrame(() => document.getElementById(`sheet-${next.row}-${next.col}`)?.focus());
  };
  const start = (cell: Cell) => {
    setActive(cell);
    setEditing(cell);
    setDraft(String(rows[cell.row].values[months[cell.col]]));
    setError("");
  };
  const commit = (move = 0) => {
    if (!editing) return false;
    const value = Number(draft);
    if (!Number.isFinite(value) || value < 0) {
      setError("Enter a non-negative number.");
      return false;
    }
    setRows((items) =>
      items.map((row, index) =>
        index === editing.row
          ? { ...row, values: { ...row.values, [months[editing.col]]: value } }
          : row,
      ),
    );
    const current = editing;
    setEditing(null);
    setError("");
    if (move) {
      const flat = current.row * months.length + current.col + move,
        next = Math.max(0, Math.min(rows.length * months.length - 1, flat));
      focus({ row: Math.floor(next / months.length), col: next % months.length });
    }
    return true;
  };
  const cancel = () => {
    setEditing(null);
    setError("");
    focus(active);
  };
  const keyCell = (event: React.KeyboardEvent, cell: Cell) => {
    if (event.key === "Enter") {
      event.preventDefault();
      start(cell);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focus({ row: cell.row, col: cell.col + 1 });
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focus({ row: cell.row, col: cell.col - 1 });
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      focus({ row: cell.row + 1, col: cell.col });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focus({ row: cell.row - 1, col: cell.col });
    }
  };
  return (
    <Card
      title="Spreadsheet-style sales planning"
      icon={Calculator}
      action={
        <Badge>
          <CornerDownLeft size={10} />
          Keyboard enabled
        </Badge>
      }
    >
      <div className="max-h-[430px] min-w-0 overflow-auto rounded-lg border border-border">
        <table className="w-full min-w-[900px] border-collapse">
          <caption className="sr-only">
            Monthly sales planning spreadsheet with editable numeric cells
          </caption>
          <thead className="sticky top-0 z-20">
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-30 min-w-52 border border-border bg-surface-alt px-3 py-2.5 text-left text-[11px] font-medium"
              >
                Product / Region
              </th>
              {months.map((month, index) => (
                <th
                  key={month}
                  scope="col"
                  className={`min-w-24 border border-border px-3 py-2.5 text-right text-[11px] font-medium ${active.col === index ? "bg-accent/10 text-accent" : "bg-surface-alt text-muted"}`}
                >
                  {month.slice(0, 3)}
                </th>
              ))}
              <th
                scope="col"
                className="min-w-28 border border-border bg-foreground px-3 py-2.5 text-right text-[11px] font-medium text-surface"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              const total = months.reduce((sum, month) => sum + row.values[month], 0),
                rowActive = active.row === rowIndex;
              return (
                <tr key={row.id} className={rowActive ? "bg-accent/[.025]" : ""}>
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 border border-border px-3 py-2.5 text-left ${rowActive ? "bg-accent/10" : "bg-surface"}`}
                  >
                    <b className="block text-[11px]">{row.label}</b>
                    <span className="text-[9px] font-normal text-muted">{row.region}</span>
                  </th>
                  {months.map((month, colIndex) => {
                    const cell = { row: rowIndex, col: colIndex },
                      isActive = active.row === rowIndex && active.col === colIndex,
                      isEditing = editing?.row === rowIndex && editing.col === colIndex;
                    return (
                      <td
                        key={month}
                        className={`relative border border-border p-0 text-right ${active.col === colIndex ? "bg-accent/[.035]" : ""}`}
                      >
                        {isEditing ? (
                          <>
                            <Input
                              autoFocus
                              aria-label={`${month} sales for ${row.label}`}
                              aria-invalid={Boolean(error)}
                              value={draft}
                              min={0}
                              type="number"
                              onChange={(event) => setDraft(event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  commit();
                                } else if (event.key === "Escape") {
                                  event.preventDefault();
                                  cancel();
                                } else if (event.key === "Tab") {
                                  event.preventDefault();
                                  commit(event.shiftKey ? -1 : 1);
                                }
                              }}
                              className={`h-9! min-h-9! w-full rounded-none! border-0! px-3! text-right text-[11px]! outline-2! ${error ? "outline-danger!" : "outline-accent!"}`}
                            />
                            {error && (
                              <span
                                role="alert"
                                className="absolute right-0 top-full z-40 mt-1 whitespace-nowrap rounded border border-danger/20 bg-surface px-2 py-1 text-[9px] text-danger shadow-sm"
                              >
                                {error}
                              </span>
                            )}
                          </>
                        ) : (
                          <button
                            id={`sheet-${rowIndex}-${colIndex}`}
                            type="button"
                            aria-label={`Edit ${month} sales for ${row.label}`}
                            tabIndex={isActive ? 0 : -1}
                            onFocus={() => setActive(cell)}
                            onClick={() => start(cell)}
                            onKeyDown={(event) => keyCell(event, cell)}
                            className={`h-9 w-full px-3 text-right text-[11px] tabular-nums focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${isActive ? "bg-accent/5 font-semibold text-accent" : "hover:bg-surface-alt"}`}
                          >
                            {row.values[month].toLocaleString()}
                          </button>
                        )}
                      </td>
                    );
                  })}
                  <td className="border border-border bg-foreground/5 px-3 py-2 text-right text-[11px] font-semibold tabular-nums">
                    {total.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th
                scope="row"
                className="sticky left-0 border border-border bg-surface-alt px-3 py-2.5 text-left text-[11px] font-semibold"
              >
                Monthly totals
              </th>
              {months.map((month) => (
                <td
                  key={month}
                  className="border border-border bg-surface-alt px-3 py-2.5 text-right text-[11px] font-semibold tabular-nums"
                >
                  {rows.reduce((sum, row) => sum + row.values[month], 0).toLocaleString()}
                </td>
              ))}
              <td className="border border-border bg-foreground px-3 py-2.5 text-right text-[11px] font-semibold text-surface tabular-nums">
                {rows
                  .reduce(
                    (sum, row) =>
                      sum + months.reduce((rowSum, month) => rowSum + row.values[month], 0),
                    0,
                  )
                  .toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="mt-3 text-[10px] text-muted">
        Click a cell to edit. Enter commits; Escape cancels. Use arrows to navigate before editing,
        while Tab and Shift+Tab commit and move between cells.
      </p>
    </Card>
  );
}
