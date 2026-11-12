"use client";
import { CommerceCardTitle } from "@/features/ecommerce/components/commerce-ui";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { Button } from "@/components/ui/button";
import { daysAgo, demoDate, money, type Order } from "../types";
export function ProductPerformance({
  orders,
  productId,
  days,
}: {
  orders: Order[];
  productId: string;
  days: number;
}) {
  const [metric, setMetric] = useState<"revenue" | "units">("revenue");
  const paid = orders.filter((order) => order.payment === "Paid");
  const buckets = Array.from({ length: 7 }, (_, index) => {
    const start = Math.floor((index * days) / 7),
      end = Math.floor(((index + 1) * days) / 7);
    const items = paid
      .filter((order) => daysAgo(order.created) >= start && daysAgo(order.created) < end)
      .flatMap((order) => order.items)
      .filter((item) => item.productId === productId);
    return {
      name: new Date(Date.parse(demoDate) - start * 86400000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      revenue: items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
      units: items.reduce((s, i) => s + i.quantity, 0),
    };
  }).reverse();
  const total = buckets.reduce((sum, bucket) => sum + bucket[metric], 0);
  return (
    <ChartCard
      title={<CommerceCardTitle label="Product performance" />}
      action={
        <div className="flex gap-1">
          {(["revenue", "units"] as const).map((value) => (
            <Button
              key={value}
              variant={metric === value ? "secondary" : "ghost"}
              size="sm"
              aria-pressed={metric === value}
              onClick={() => setMetric(value)}
            >
              {value === "revenue" ? "Revenue" : "Units"}
            </Button>
          ))}
        </div>
      }
    >
      <p className="mt-3 text-kpi font-semibold">
        {metric === "revenue" ? money(total) : `${total} units`}
      </p>
      <p className="mt-1 text-tiny text-muted">Paid item sales in the selected period</p>
      <div className="mt-3 h-[200px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={buckets} margin={{ left: -20, right: 5 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 4" />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              minTickGap={18}
            />
            <YAxis
              allowDecimals={metric === "revenue"}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "var(--accent)", fillOpacity: 0.04 }}
              content={<ChartTooltip currency={metric === "revenue"} />}
            />
            <Bar
              dataKey={metric}
              name={metric === "revenue" ? "Product revenue" : "Units sold"}
              fill="var(--accent)"
              radius={[3, 3, 0, 0]}
              maxBarSize={30}
              animationDuration={400}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-tiny text-muted">
        Item revenue excludes tax, shipping, order discounts and fully refunded orders. Partial
        refunds are not allocated to individual products.
      </p>
    </ChartCard>
  );
}
