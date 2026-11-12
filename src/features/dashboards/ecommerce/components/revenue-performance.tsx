"use client";
import { CommerceCardTitle } from "@/features/ecommerce/components/commerce-ui";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight, ShoppingBag, CheckCheck, RotateCcw } from "lucide-react";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { Button } from "@/components/ui/button";
import { money, type Order } from "@/features/ecommerce/types";
type Bucket = {
  name: string;
  revenue: number;
  previous: number;
  orders: number;
  previousOrders: number;
};
export function RevenuePerformance({
  chart,
  revenue,
  previous,
  previousOrders,
  orders,
}: {
  chart: Bucket[];
  revenue: number;
  previous: number;
  previousOrders: number;
  orders: Order[];
}) {
  const [metric, setMetric] = useState<"revenue" | "orders">("revenue");
  const current = metric === "revenue" ? revenue : orders.length,
    prior = metric === "revenue" ? previous : previousOrders;
  const change = prior ? ((current - prior) / prior) * 100 : null;
  const ChangeIcon = change !== null && change < 0 ? ArrowDownRight : ArrowUpRight;
  return (
    <ChartCard
      title={<CommerceCardTitle label="Revenue performance" />}
      action={
        <div className="flex gap-1" aria-label="Revenue chart metric">
          {(["revenue", "orders"] as const).map((value) => (
            <Button
              key={value}
              size="sm"
              variant={metric === value ? "secondary" : "ghost"}
              aria-pressed={metric === value}
              onClick={() => setMetric(value)}
            >
              {value === "revenue" ? "Revenue" : "Orders"}
            </Button>
          ))}
        </div>
      }
    >
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-label text-muted">
            {metric === "revenue" ? "Net collected · USD" : "Orders placed"}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <p className="text-kpi font-semibold tracking-tight">
              {metric === "revenue" ? money(current) : current}
            </p>
            <span
              className={`inline-flex items-center gap-1 rounded-control px-1.5 py-1 text-tiny ${change !== null && change < 0 ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"}`}
            >
              <ChangeIcon size={12} />
              {change === null ? "No prior activity" : `${Math.abs(change).toFixed(1)}%`}
            </span>
          </div>
          <p className="mt-1 text-tiny text-muted">
            vs. {metric === "revenue" ? money(prior) : `${prior} orders`} in the previous period
          </p>
        </div>
        <div className="flex gap-3 text-tiny text-muted">
          <span className="flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-sm bg-accent" />
            Current
          </span>
          <span className="flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-sm bg-trend-down" />
            Previous
          </span>
        </div>
      </div>
      <div
        className="mt-3 h-[220px] min-w-0"
        aria-label="Current and previous period revenue comparison"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chart}
            barGap={3}
            barCategoryGap="28%"
            margin={{ left: -18, right: 5, top: 10 }}
          >
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "var(--muted)" }}
              minTickGap={18}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={metric === "revenue"}
              tickFormatter={(n) =>
                metric === "revenue" ? `$${n >= 1000 ? `${n / 1000}k` : n}` : String(n)
              }
              tick={{ fontSize: 10, fill: "var(--muted)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "var(--accent)", fillOpacity: 0.04 }}
              content={<ChartTooltip currency={metric === "revenue"} />}
            />
            <Bar
              dataKey={metric === "revenue" ? "revenue" : "orders"}
              name="Current period"
              fill="var(--accent)"
              radius={[3, 3, 0, 0]}
              maxBarSize={24}
              animationDuration={400}
            />
            <Bar
              dataKey={metric === "revenue" ? "previous" : "previousOrders"}
              name="Previous period"
              fill="var(--color-trend-down)"
              fillOpacity={0.75}
              radius={[3, 3, 0, 0]}
              maxBarSize={24}
              animationDuration={400}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 grid grid-cols-3 divide-x divide-border border-t border-border pt-3">
        {[
          {
            label: "Completed",
            count: orders.filter((o) => o.status === "Delivered").length,
            icon: CheckCheck,
          },
          {
            label: "Pending",
            count: orders.filter((o) =>
              ["Pending", "Processing", "Ready to ship"].includes(o.status),
            ).length,
            icon: ShoppingBag,
          },
          {
            label: "Refunded",
            count: orders.filter((o) => o.payment === "Refunded").length,
            icon: RotateCcw,
          },
        ].map((item) => (
          <div key={item.label} className="px-3 first:pl-0">
            <p className="flex items-center gap-1.5 text-tiny text-muted">
              <item.icon size={12} />
              {item.label}
            </p>
            <strong className="mt-1 block text-lg font-semibold">
              {item.count}
              <span className="ml-1 text-tiny font-normal text-muted">orders</span>
            </strong>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
