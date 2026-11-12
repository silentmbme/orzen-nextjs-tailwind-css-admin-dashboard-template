"use client";
import { CommerceCardTitle } from "@/features/ecommerce/components/commerce-ui";
import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { money, type Category } from "@/features/ecommerce/types";
import type { ProductPerformance } from "../data";
import { chartColors } from "../data";
export function CategorySales({
  categories,
  products,
}: {
  categories: Category[];
  products: ProductPerformance[];
}) {
  const [selected, setSelected] = useState("");
  const rows = categories
    .map((category) => ({
      ...category,
      sales: products
        .filter((p) => p.categoryId === category.id)
        .reduce((sum, p) => sum + p.sales, 0),
      units: products
        .filter((p) => p.categoryId === category.id)
        .reduce((sum, p) => sum + p.units, 0),
    }))
    .sort((a, b) => b.sales - a.sales);
  const total = rows.reduce((sum, row) => sum + row.sales, 0);
  const active = rows.find((row) => row.id === selected) || rows[0];
  return (
    <Card
      title={<CommerceCardTitle label="Category composition" />}
      action={<span className="text-tiny text-muted">Product revenue</span>}
    >
      <div className="mt-3">
        <p className="text-kpi font-semibold">{money(total)}</p>
        <p className="mt-1 text-tiny text-muted">Select a category to inspect its contribution</p>
      </div>
      <div
        className="my-4 flex h-14 overflow-hidden rounded-control bg-surface-alt"
        aria-label="Category revenue proportions"
      >
        {rows
          .filter((row) => row.sales > 0)
          .map((row, index) => (
            <button
              key={row.id}
              style={{
                flex: row.sales,
                background: chartColors[index % chartColors.length],
              }}
              title={`${row.name}: ${money(row.sales)}`}
              aria-label={`Inspect ${row.name}`}
              onClick={() => setSelected(row.id)}
              className="flex min-w-0 items-center justify-center border-r border-surface text-[10px] font-semibold text-foreground transition-opacity hover:opacity-80"
            >
              {row.sales / total > 0.15 ? `${((row.sales / total) * 100).toFixed(0)}%` : ""}
            </button>
          ))}
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {rows.map((row, index) => (
          <button
            key={row.id}
            aria-pressed={row.id === active?.id}
            onClick={() => setSelected(row.id)}
            className="flex min-w-0 items-center gap-2 text-left text-label"
          >
            <i
              className="h-2 w-2 shrink-0 rounded-sm"
              style={{ background: chartColors[index % chartColors.length] }}
            />
            <span className="truncate text-muted">{row.name}</span>
            <span className="ml-auto font-medium">{row.units}</span>
          </button>
        ))}
      </div>
      {active && (
        <div className="mt-4 rounded-control border border-border bg-surface-alt p-3">
          <div className="flex justify-between gap-2 text-label">
            <span className="font-medium">{active.name}</span>
            <span className="text-accent">
              {total ? ((active.sales / total) * 100).toFixed(1) : 0}% share
            </span>
          </div>
          <div className="mt-2 flex items-end justify-between">
            <strong className="text-lg font-semibold">{money(active.sales)}</strong>
            <Link href="/apps/ecommerce/categories" className="text-tiny text-accent">
              Manage categories →
            </Link>
          </div>
          <p className="mt-1 text-tiny text-muted">
            {active.units} units sold · {products.filter((p) => p.categoryId === active.id).length}{" "}
            catalog products
          </p>
        </div>
      )}
    </Card>
  );
}
