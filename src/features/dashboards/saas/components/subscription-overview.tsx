"use client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity } from "lucide-react";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { SaasTitle } from "@/features/saas/components/saas-ui";
import { revenueMetrics } from "@/features/saas/selectors";
import { money, type SaasData } from "@/features/saas/types";
export function SubscriptionOverview({
  data,
  days,
  trend,
}: {
  data: SaasData;
  days: number;
  trend: { name: string; mrr: number }[];
}) {
  const metrics = revenueMetrics(data, days),
    mrr = metrics.closing;
  return (
    <ChartCard
      title={<SaasTitle icon={Activity}>Subscription overview</SaasTitle>}
      action={<span className="text-tiny text-muted">Monthly normalized · USD</span>}
    >
      <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-label text-muted">Monthly recurring revenue</p>
          <strong className="mt-1 block text-[24px] font-semibold tracking-tight">
            {money(mrr)}
          </strong>
          <p
            className={`mt-2 text-label ${mrr >= metrics.opening ? "text-success" : "text-danger"}`}
          >
            {mrr >= metrics.opening ? "+" : ""}
            {money(mrr - metrics.opening)} net movement
          </p>
          <p className="mt-1 text-tiny text-muted">Opening MRR {money(metrics.opening)}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 border-border sm:border-l sm:pl-4">
          {[
            { name: "ARR run rate", value: money(mrr * 12) },
            {
              name: "Active subscriptions",
              value: String(data.subscriptions.filter((s) => s.status === "Active").length),
            },
            {
              name: "Net retention",
              value: metrics.nrr === null ? "—" : `${metrics.nrr.toFixed(1)}%`,
            },
            { name: "Subscriber churn", value: `${metrics.churnRate.toFixed(1)}%` },
          ].map((item) => (
            <div key={item.name}>
              <p className="text-tiny text-muted">{item.name}</p>
              <p className="mt-1 text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 h-[180px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend} margin={{ left: -15, right: 8 }}>
            <defs>
              <linearGradient id="saas-mrr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 4" />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ChartTooltip currency />} />
            <Area
              type="stepAfter"
              dataKey="mrr"
              name="MRR"
              stroke="var(--accent)"
              fill="url(#saas-mrr)"
              strokeWidth={2}
              animationDuration={400}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-tiny text-muted">
        Month-end MRR history (current month to snapshot). NRR and churn follow the selected window;
        ARR = current MRR × 12, not collected revenue.
      </p>
    </ChartCard>
  );
}
