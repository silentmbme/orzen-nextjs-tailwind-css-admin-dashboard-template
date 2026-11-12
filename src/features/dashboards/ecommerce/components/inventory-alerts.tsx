"use client";
import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, PackageX, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CommerceCardTitle, ProductThumb } from "@/features/ecommerce/components/commerce-ui";
import type { ProductPerformance } from "../data";
export function InventoryAlerts({
  products,
  days,
}: {
  products: ProductPerformance[];
  days: number;
}) {
  const [sort, setSort] = useState<"cover" | "stock">("cover");
  const cover = (p: ProductPerformance) => (p.units > 0 ? p.stock / (p.units / days) : Infinity);
  const low = products
    .filter((p) => p.stock <= p.reorderLevel)
    .sort((a, b) => (sort === "cover" ? cover(a) - cover(b) : a.stock - b.stock));
  return (
    <Card
      title={<CommerceCardTitle label="Replenishment watch" />}
      action={
        <Link
          href="/apps/ecommerce/inventory"
          aria-label="Manage inventory"
          className="text-muted hover:text-accent"
        >
          <ArrowUpRight size={15} />
        </Link>
      }
    >
      <div className="mt-3 flex items-center gap-3 rounded-control bg-danger-subtle p-3">
        <AlertTriangle size={21} className="shrink-0 text-danger" />
        <div>
          <span className="text-lg font-semibold">{low.length}</span>
          <span className="ml-1.5 text-label">products need attention</span>
          <p className="text-tiny text-muted">
            {low.filter((p) => p.stock === 0).length} out of stock · current inventory
          </p>
        </div>
      </div>
      <div className="my-2 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSort(sort === "cover" ? "stock" : "cover")}
        >
          {sort === "cover" ? "Sort: days of cover" : "Sort: available stock"}
        </Button>
      </div>
      <div className="space-y-3">
        {low.slice(0, 4).map((product) => (
          <Link
            href={`/apps/ecommerce/products/${product.id}`}
            key={product.id}
            className="flex items-start gap-2"
          >
            <ProductThumb product={product} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-label font-medium">{product.name}</p>
              <div className="mt-1 flex items-center justify-between gap-2 text-tiny">
                <span className="text-danger">
                  {product.stock === 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <PackageX size={11} />
                      Sold out
                    </span>
                  ) : (
                    `${product.stock} left / reorder at ${product.reorderLevel}`
                  )}
                </span>
                <span className="text-muted">
                  {product.stock === 0
                    ? "0d cover"
                    : Number.isFinite(cover(product))
                      ? `${Math.floor(cover(product))}d cover`
                      : "No recent sales"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
