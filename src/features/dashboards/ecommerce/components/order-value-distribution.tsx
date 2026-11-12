"use client";
import { CommerceCardTitle } from "@/features/ecommerce/components/commerce-ui";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { Select } from "@/components/ui/select";
import { money, orderTotals, type Order } from "@/features/ecommerce/types";
export function OrderValueDistribution({ orders }: { orders: Order[] }) {
  const [scope, setScope] = useState("paid");
  const list = orders.filter((order) =>
    scope === "paid" ? order.payment === "Paid" : order.status !== "Cancelled",
  );
  const bands = [
    { name: "<$100", min: 0, max: 100 },
    { name: "$100–199", min: 100, max: 200 },
    { name: "$200–299", min: 200, max: 300 },
    { name: "$300+", min: 300, max: Infinity },
  ].map((band) => ({
    ...band,
    count: list.filter(
      (order) => orderTotals(order).total >= band.min && orderTotals(order).total < band.max,
    ).length,
  }));
  const totals = list.map((order) => orderTotals(order).total).sort((a, b) => a - b);
  const median = totals.length
    ? totals.length % 2
      ? totals[Math.floor(totals.length / 2)]
      : (totals[totals.length / 2 - 1] + totals[totals.length / 2]) / 2
    : 0;
  const peak = Math.max(...bands.map((b) => b.count));
  return (
    <ChartCard
      title={<CommerceCardTitle label="Order value distribution" />}
      action={
        <Select
          aria-label="Order value scope"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
        >
          <option value="paid">Paid only</option>
          <option value="all">Non-cancelled</option>
        </Select>
      }
    >
      <div className="mt-3 flex items-baseline gap-2">
        <strong className="text-kpi font-semibold">{money(median)}</strong>
        <span className="text-tiny text-muted">median order value</span>
      </div>
      <div className="mt-3 h-[180px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bands} margin={{ left: -30, right: 0 }}>
            <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 4" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "var(--muted)" }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "var(--muted)" }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="count" name="Orders" radius={[4, 4, 0, 0]} maxBarSize={44}>
              {bands.map((band) => (
                <Cell
                  key={band.name}
                  fill={band.count === peak ? "var(--accent)" : "var(--color-trend-up)"}
                  fillOpacity={band.count === peak ? 1 : 0.65}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-tiny text-muted">
        {list.length} orders · includes shipping, tax and discounts. Completed partial refunds are
        not deducted from the original order value.
      </p>
    </ChartCard>
  );
}
