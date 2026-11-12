"use client";
import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { CommerceCardTitle, ProductIdentity } from "@/features/ecommerce/components/commerce-ui";
import { money } from "@/features/ecommerce/types";
import type { ProductPerformance } from "../data";
export function TopProducts({ products }: { products: ProductPerformance[] }) {
  const [rank, setRank] = useState("sales");
  const ranked = [...products]
    .sort((a, b) => (rank === "sales" ? b.sales - a.sales : b.units - a.units))
    .slice(0, 5);
  const total = products.reduce((sum, product) => sum + product.sales, 0);
  return (
    <Card
      title={<CommerceCardTitle label="Best-selling products" />}
      action={
        <Select
          aria-label="Rank products by"
          value={rank}
          onChange={(e) => setRank(e.target.value)}
        >
          <option value="sales">By revenue</option>
          <option value="units">By units sold</option>
        </Select>
      }
    >
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[390px] text-left text-label">
          <thead>
            <tr className="border-b border-border text-tiny text-muted">
              <th className="py-2 font-normal">Product / SKU</th>
              <th className="px-2 font-normal">Units</th>
              <th className="text-right font-normal">Revenue</th>
              <th className="pl-3 text-right font-normal">Share</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((product, index) => (
              <tr key={product.id} className="border-b border-border last:border-0">
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 shrink-0 text-tiny text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <ProductIdentity product={product} />
                  </div>
                </td>
                <td className="px-2">{product.units}</td>
                <td className="whitespace-nowrap text-right font-medium">{money(product.sales)}</td>
                <td className="pl-3 text-right text-muted">
                  {total ? ((product.sales / total) * 100).toFixed(0) : 0}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-tiny">
        <span className="text-muted">Paid product sales · excludes tax & shipping</span>
        <Link href="/apps/ecommerce/products" className="text-accent">
          View catalog →
        </Link>
      </div>
    </Card>
  );
}
