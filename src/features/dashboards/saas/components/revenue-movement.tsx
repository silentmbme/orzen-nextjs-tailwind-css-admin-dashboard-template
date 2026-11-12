"use client";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowLeftRight } from "lucide-react";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { Button } from "@/components/ui/button";
import { SaasTitle } from "@/features/saas/components/saas-ui";
import { revenueMetrics } from "@/features/saas/selectors";
import { money, type SaasData } from "@/features/saas/types";
export function RevenueMovement({ data, days }: { data: SaasData; days: number }) {
  const metrics = revenueMetrics(data, days),
    [selected, setSelected] = useState("all");
  const rows = [
    { name: "New / resumed", value: metrics.fresh },
    { name: "Expansion", value: metrics.expansion },
    { name: "Contraction / paused", value: -metrics.contraction },
    { name: "Churned", value: -metrics.churn },
  ];
  const events = metrics.events.filter(
    (event) =>
      selected === "all" ||
      (selected === "growth" ? event.after > event.before : event.after < event.before),
  );
  return (
    <ChartCard
      title={<SaasTitle icon={ArrowLeftRight}>Revenue movement</SaasTitle>}
      action={<span className="text-tiny text-muted">Last {days} days</span>}
    >
      <div className="mt-3 flex items-center justify-between text-label">
        <span className="text-muted">Opening {money(metrics.opening)}</span>
        <strong className="font-medium">Closing {money(metrics.closing)}</strong>
      </div>
      <div className="mt-2 h-[215px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ left: -12, right: 8 }}>
            <CartesianGrid stroke="var(--border)" horizontal={false} strokeDasharray="3 4" />
            <XAxis
              type="number"
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <ReferenceLine x={0} stroke="var(--border)" />
            <Tooltip content={<ChartTooltip currency />} />
            <Bar
              dataKey="value"
              name="MRR movement"
              radius={3}
              maxBarSize={18}
              animationDuration={400}
            >
              {rows.map((row) => (
                <Cell
                  key={row.name}
                  fill={row.value < 0 ? "var(--color-trend-down)" : "var(--accent)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-1">
        {["all", "growth", "loss"].map((value) => (
          <Button
            size="sm"
            key={value}
            variant={selected === value ? "secondary" : "ghost"}
            aria-pressed={selected === value}
            onClick={() => setSelected(value)}
          >
            {value === "all" ? "All events" : value === "growth" ? "Growth" : "Loss"}
          </Button>
        ))}
      </div>
      <div className="mt-2 max-h-24 overflow-y-auto">
        {events
          .slice()
          .reverse()
          .map((event) => (
            <div
              key={event.id}
              className="flex justify-between gap-2 border-t border-border py-2 text-tiny"
            >
              <span className="text-muted">
                {event.subscriptionId} · {event.kind}
              </span>
              <span className={event.after >= event.before ? "text-success" : "text-danger"}>
                {money(event.after - event.before)}
              </span>
            </div>
          ))}
        {!events.length && (
          <p className="py-2 text-tiny text-muted">No movement events in this selection.</p>
        )}
      </div>
    </ChartCard>
  );
}
