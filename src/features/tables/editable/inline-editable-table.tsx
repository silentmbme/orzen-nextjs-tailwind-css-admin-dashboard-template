"use client";
import Image from "next/image";
import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShowcaseCard as Card } from "@/components/ui/showcase-card";

type Product = {
  id: string;
  name: string;
  sku: string;
  image: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Low stock" | "Out of stock";
};
type Field = "name" | "price" | "stock";
const initial: Product[] = [
  {
    id: "p1",
    name: "Studio Headphones",
    sku: "AUD-2048",
    image: "headphones",
    category: "Audio",
    price: 129,
    stock: 84,
    status: "Active",
  },
  {
    id: "p2",
    name: "Orbit Smartwatch",
    sku: "WAT-4092",
    image: "watch",
    category: "Wearables",
    price: 249,
    stock: 18,
    status: "Low stock",
  },
  {
    id: "p3",
    name: "Orzen Speaker",
    sku: "SPK-1104",
    image: "speaker",
    category: "Audio",
    price: 89,
    stock: 0,
    status: "Out of stock",
  },
  {
    id: "p4",
    name: "Arc Controller",
    sku: "GAM-7721",
    image: "controller",
    category: "Gaming",
    price: 74,
    stock: 42,
    status: "Active",
  },
];
const th = "px-3 py-2.5 text-left text-[11px] font-medium text-muted",
  td = "px-3 py-2.5 text-[12px]";
export function InlineEditableTable() {
  const [rows, setRows] = useState(initial),
    [active, setActive] = useState<{ id: string; field: Field } | null>(null),
    [draft, setDraft] = useState(""),
    [error, setError] = useState(""),
    [saved, setSaved] = useState("");
  const begin = (row: Product, field: Field) => {
    setActive({ id: row.id, field });
    setDraft(String(row[field]));
    setError("");
    setSaved("");
  };
  const cancel = () => {
    setActive(null);
    setError("");
  };
  const save = () => {
    if (!active) return;
    const value = draft.trim();
    if (active.field === "name" && !value) return setError("Product name is required.");
    if (active.field === "price" && (!Number.isFinite(Number(value)) || Number(value) < 0))
      return setError("Enter a non-negative price.");
    if (active.field === "stock" && (!Number.isInteger(Number(value)) || Number(value) < 0))
      return setError("Stock must be a non-negative integer.");
    setRows((items) =>
      items.map((item) =>
        item.id === active.id
          ? { ...item, [active.field]: active.field === "name" ? value : Number(value) }
          : item,
      ),
    );
    setSaved(
      `${active.field === "name" ? "Product name" : active.field === "price" ? "Unit price" : "Stock"} updated locally.`,
    );
    setActive(null);
    setError("");
  };
  return (
    <Card
      title="Inline cell editing"
      action={
        <span aria-live="polite" className="text-[10px] text-success">
          {saved}
        </span>
      }
    >
      <div className="min-w-0 overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <caption className="sr-only">Product price management with inline cell editing</caption>
          <thead className="bg-surface-alt">
            <tr>
              {["Product", "SKU", "Category", "Unit price", "Stock", "Status"].map((label) => (
                <th
                  key={label}
                  scope="col"
                  className={`${th} ${label === "Unit price" || label === "Stock" ? "text-right" : ""}`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="group border-t border-border hover:bg-surface-alt/60">
                <td className={`${td} w-[250px]`}>
                  <span className="flex items-center gap-3">
                    <Image
                      src={`/images/ecommerce/${row.image}.webp`}
                      alt=""
                      width={38}
                      height={38}
                      className="size-9.5 rounded-lg border border-border object-cover"
                    />
                    <Editable
                      value={row.name}
                      row={row}
                      field="name"
                      active={active}
                      draft={draft}
                      error={error}
                      setDraft={setDraft}
                      begin={begin}
                      save={save}
                      cancel={cancel}
                    />
                  </span>
                </td>
                <td className={`${td} text-muted`}>{row.sku}</td>
                <td className={td}>{row.category}</td>
                <td className={`${td} w-[150px] text-right`}>
                  <Editable
                    value={`$${row.price.toFixed(2)}`}
                    row={row}
                    field="price"
                    active={active}
                    draft={draft}
                    error={error}
                    setDraft={setDraft}
                    begin={begin}
                    save={save}
                    cancel={cancel}
                    numeric
                  />
                </td>
                <td className={`${td} w-[130px] text-right`}>
                  <Editable
                    value={String(row.stock)}
                    row={row}
                    field="stock"
                    active={active}
                    draft={draft}
                    error={error}
                    setDraft={setDraft}
                    begin={begin}
                    save={save}
                    cancel={cancel}
                    numeric
                  />
                </td>
                <td className={td}>
                  <Badge
                    tone={
                      row.status === "Active"
                        ? "success"
                        : row.status === "Out of stock"
                          ? "danger"
                          : "neutral"
                    }
                  >
                    {row.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[10px] text-muted">
        Select product name, price, or stock. Enter saves; Escape cancels. Changes remain in this
        local demo only.
      </p>
    </Card>
  );
}
function Editable({
  value,
  row,
  field,
  active,
  draft,
  error,
  setDraft,
  begin,
  save,
  cancel,
  numeric = false,
}: {
  value: string;
  row: Product;
  field: Field;
  active: { id: string; field: Field } | null;
  draft: string;
  error: string;
  setDraft: (value: string) => void;
  begin: (row: Product, field: Field) => void;
  save: () => void;
  cancel: () => void;
  numeric?: boolean;
}) {
  const editing = active?.id === row.id && active.field === field,
    errorId = `${row.id}-${field}-error`;
  if (editing)
    return (
      <span className="relative flex min-w-0 items-center justify-end gap-1">
        <Input
          autoFocus
          aria-label={`Edit ${field} for ${row.name}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          type={numeric ? "number" : "text"}
          min={numeric ? 0 : undefined}
          step={field === "stock" ? 1 : field === "price" ? 0.01 : undefined}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") save();
            if (event.key === "Escape") cancel();
          }}
          className={`${field === "name" ? "w-40" : "w-24"} h-7! min-h-7! px-2! text-[11px]! ${error ? "border-danger!" : "border-accent!"}`}
        />
        <Button
          size="icon"
          variant="ghost"
          className="size-7! min-h-7! text-success"
          aria-label="Save cell"
          onClick={save}
        >
          <Check size={12} />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-7! min-h-7!"
          aria-label="Cancel editing"
          onClick={cancel}
        >
          <X size={12} />
        </Button>
        {error && (
          <span
            id={errorId}
            role="alert"
            className="absolute right-0 top-full z-10 mt-1 whitespace-nowrap rounded border border-danger/20 bg-surface px-2 py-1 text-[9px] text-danger shadow-sm"
          >
            {error}
          </span>
        )}
      </span>
    );
  return (
    <button
      type="button"
      onClick={() => begin(row, field)}
      className={`group/edit inline-flex min-h-7 max-w-full items-center gap-1.5 rounded px-1.5 text-left hover:bg-accent/5 focus-visible:outline-2 focus-visible:outline-accent ${numeric ? "ml-auto justify-end" : ""}`}
      aria-label={`Edit ${field} for ${row.name}`}
    >
      <span className="truncate font-medium">{value}</span>
      <Pencil
        size={10}
        className="shrink-0 text-muted opacity-0 transition-opacity group-hover/edit:opacity-100 group-focus-visible/edit:opacity-100"
      />
    </button>
  );
}
