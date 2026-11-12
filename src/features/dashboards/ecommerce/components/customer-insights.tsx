"use client";
import { UserAvatar } from "@/components/ui/user-avatar";
import { CommerceCardTitle } from "@/features/ecommerce/components/commerce-ui";
import { useState } from "react";
import Link from "next/link";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { money, orderTotals, type CommerceData, type Order } from "@/features/ecommerce/types";
export function CustomerInsights({ data, orders }: { data: CommerceData; orders: Order[] }) {
  const [segment, setSegment] = useState<"all" | "returning">("all");
  const buyers = data.customers.filter((customer) =>
    orders.some((order) => order.customerId === customer.id),
  );
  const isReturning = (id: string) =>
    data.orders.some(
      (order) =>
        order.customerId === id &&
        order.payment === "Paid" &&
        order.created <
          (orders
            .filter((item) => item.customerId === id)
            .map((item) => item.created)
            .sort()[0] || ""),
    );
  const returning = buyers.filter((customer) => isReturning(customer.id)).length;
  const segments = [
    { name: "New buyers", value: buyers.length - returning, color: "var(--color-trend-down)" },
    { name: "Returning buyers", value: returning, color: "var(--accent)" },
  ];
  const ranked = buyers
    .filter((c) => segment === "all" || isReturning(c.id))
    .map((customer) => ({
      ...customer,
      spend: orders
        .filter((o) => o.customerId === customer.id && o.payment === "Paid")
        .reduce(
          (sum, o) =>
            sum +
            orderTotals(o).total -
            data.refunds
              .filter((r) => r.orderId === o.id && r.status === "Completed")
              .reduce((s, r) => s + r.amount, 0),
          0,
        ),
    }))
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 3);
  return (
    <Card
      title={<CommerceCardTitle label="Customer intelligence" />}
      action={
        <Link href="/apps/ecommerce/customers" className="text-tiny text-accent">
          Directory →
        </Link>
      }
    >
      <div className="mt-3 grid grid-cols-[130px_1fr] items-center gap-3">
        <div className="relative h-[130px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={
                  buyers.length
                    ? segments
                    : [{ name: "No buyers", value: 1, color: "var(--border)" }]
                }
                dataKey="value"
                innerRadius={45}
                outerRadius={60}
                animationDuration={400}
                paddingAngle={buyers.length && returning && returning < buyers.length ? 4 : 0}
                stroke="none"
              >
                {(buyers.length ? segments : [{ color: "var(--border)" }]).map((item, i) => (
                  <Cell key={i} fill={item.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <strong className="text-kpi font-semibold">{buyers.length}</strong>
            <span className="text-tiny text-muted">buyers</span>
          </div>
        </div>
        <div className="space-y-3">
          {segments.map((item) => (
            <div key={item.name}>
              <p className="flex items-center gap-1.5 text-tiny text-muted">
                <i className="h-1.5 w-1.5 rounded-full" style={{ background: item.color }} />
                {item.name}
              </p>
              <p className="mt-1 font-semibold">
                {item.value}
                <span className="ml-2 text-tiny font-normal text-muted">
                  {buyers.length ? ((item.value / buyers.length) * 100).toFixed(1) : 0}%
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
        <span className="text-label font-medium">Highest spenders</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSegment(segment === "all" ? "returning" : "all")}
        >
          {segment === "all" ? "Returning only" : "All buyers"}
        </Button>
      </div>
      <div className="mt-2 space-y-3">
        {ranked.map((customer) => (
          <div key={customer.id} className="flex items-center gap-2">
            <UserAvatar name={customer.name} size={28} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-label font-medium">{customer.name}</p>
              <p className="text-tiny text-muted">{customer.region}</p>
            </div>
            <span className="text-label font-medium">{money(customer.spend)}</span>
          </div>
        ))}
        {!ranked.length && <p className="py-3 text-label text-muted">No buyers in this segment.</p>}
      </div>
      <p className="mt-3 text-tiny text-muted">
        Returning = a paid purchase before this period. Spend is net collected in the selected
        period.
      </p>
    </Card>
  );
}
