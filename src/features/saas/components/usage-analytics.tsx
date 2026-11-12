"use client";
import { useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  ChartNoAxesCombined,
  Code2,
  Gauge,
  MousePointer2,
  UsersRound,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { SaasWorkspace } from "./saas-workspace";
import { SaasTitle, StatusBadge } from "./saas-ui";
import { useSaas } from "../hooks/use-saas";
import { exportCsv } from "../demo-service";
import { customerHealth, monthlyUsage, mrrAt, palette } from "../selectors";
import { addDays, age, latestDate, today } from "../types";
const features = [
  { key: "reports", name: "Reports" },
  { key: "automations", name: "Automations" },
  { key: "integrations", name: "Integrations" },
] as const;
export function UsageAnalytics() {
  const { data } = useSaas(),
    [period, setPeriod] = useState("30"),
    [planFilter, setPlanFilter] = useState("all"),
    [metric, setMetric] = useState<"api" | "activeUsers">("api"),
    [feature, setFeature] = useState<(typeof features)[number]["key"]>("reports");
  const days = Number(period),
    plans = data.plans.filter((p) => planFilter === "all" || p.id === planFilter);
  const usage = data.usage.filter(
    (u) =>
      age(u.date) >= 0 && age(u.date) < days && (planFilter === "all" || u.planId === planFilter),
  );
  const accounts = data.customers.filter((c) =>
    data.subscriptions.some(
      (s) => s.customerId === c.id && (planFilter === "all" || s.planId === planFilter),
    ),
  );
  const active = new Set(usage.filter((u) => u.activeUsers > 0).map((u) => u.customerId));
  const daily = Array.from({ length: days }, (_, index) => {
    const date = addDays(today, -days + index + 1);
    const records = usage.filter((u) => u.date === date);
    return { date, users: records.reduce((sum, u) => sum + u.activeUsers, 0) };
  });
  const chart = Array.from({ length: Math.min(days, 15) }, (_, index) => {
    const start = Math.floor((index * days) / Math.min(days, 15)),
      end = Math.floor(((index + 1) * days) / Math.min(days, 15));
    const row: Record<string, string | number> = {
      name: addDays(today, -days + start + 1).slice(5),
    };
    for (const plan of plans)
      row[plan.id] = usage
        .filter(
          (u) => u.planId === plan.id && age(u.date) >= days - end && age(u.date) < days - start,
        )
        .reduce((sum, u) => sum + u[metric], 0);
    return row;
  });
  const adopted = data.customers.filter((c) =>
    usage.some((u) => u.customerId === c.id && u[feature] > 0),
  );
  const engagement = accounts.map((c) => {
    const records = usage.filter((u) => u.customerId === c.id);
    const last = latestDate(records.filter((u) => u.activeUsers > 0));
    return {
      name: c.company,
      idle: last ? age(last) : days,
      users: records.reduce((sum, u) => sum + u.activeUsers, 0) / days,
      api: records.reduce((sum, u) => sum + u.api, 0),
      health: customerHealth(data, c.id),
    };
  });
  const trend = Array.from({ length: 6 }, (_, index) => {
    const month = `2026-${String(5 + index).padStart(2, "0")}`,
      start = `${month}-01`,
      end = new Date(Date.UTC(2026, 5 + index, 0)).toISOString().slice(0, 10);
    const existing = data.subscriptions.filter(
      (s) =>
        (planFilter === "all" || s.planId === planFilter) &&
        mrrAt(data, s.id, addDays(start, -1)) > 0,
    );
    return {
      name: month.slice(5),
      retention: existing.length
        ? (existing.filter((s) => mrrAt(data, s.id, end) > 0).length / existing.length) * 100
        : null,
      churn: data.movements.filter(
        (m) =>
          m.kind === "Churn" &&
          m.date >= start &&
          m.date <= end &&
          (planFilter === "all" || m.planId === planFilter),
      ).length,
    };
  });
  return (
    <SaasWorkspace
      title="Usage & analytics"
      description="Product engagement, API consumption and account behavior — without revenue duplication."
      actions={
        <>
          <Select
            aria-label="Usage date range"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {[7, 30, 90].map((n) => (
              <option key={n} value={n}>
                Last {n} days
              </option>
            ))}
          </Select>
          <Select
            aria-label="Usage plan filter"
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
          >
            <option value="all">All plans</option>
            {data.plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
          <Button
            onClick={() =>
              exportCsv(
                "saas-usage",
                usage.map((u) => ({
                  date: u.date,
                  customer: u.customerId,
                  plan: u.planId,
                  activeUsers: u.activeUsers,
                  apiRequests: u.api,
                  reports: u.reports,
                  automations: u.automations,
                  integrations: u.integrations,
                })),
              )
            }
            disabled={!usage.length}
          >
            <ArrowDownToLine size={13} />
            Export usage
          </Button>
        </>
      }
    >
      <div className="grid items-stretch gap-widget xl:grid-cols-[260px_minmax(0,1fr)]">
        <Card title={<SaasTitle icon={Activity}>Product pulse</SaasTitle>}>
          <div className="mt-4 space-y-5">
            {[
              {
                label: "Average daily active users",
                value: (daily.reduce((s, d) => s + d.users, 0) / days).toFixed(1),
                icon: UsersRound,
              },
              { label: "Active workspaces", value: String(active.size), icon: MousePointer2 },
              {
                label: "API requests",
                value: usage.reduce((s, u) => s + u.api, 0).toLocaleString("en-US"),
                icon: Code2,
              },
            ].map((item) => (
              <div key={item.label}>
                <p className="flex items-center gap-1.5 text-tiny text-muted">
                  <item.icon size={12} />
                  {item.label}
                </p>
                <p className="mt-1 text-kpi font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-tiny text-muted">
            Daily user counts aggregate workspace active seats; they are not distinct people across
            the whole period.
          </p>
        </Card>
        <ChartCard
          title={<SaasTitle icon={Code2}>Workspace consumption</SaasTitle>}
          action={
            <div className="flex gap-1">
              <Button
                variant={metric === "api" ? "secondary" : "ghost"}
                onClick={() => setMetric("api")}
              >
                API requests
              </Button>
              <Button
                variant={metric === "activeUsers" ? "secondary" : "ghost"}
                onClick={() => setMetric("activeUsers")}
              >
                Active users
              </Button>
            </div>
          }
        >
          <div className="mt-4 h-[270px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} margin={{ left: -12, right: 8 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 4" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--muted)", fontSize: 10 }}
                  minTickGap={16}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--muted)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {plans.map((plan, index) => (
                  <Bar
                    key={plan.id}
                    dataKey={plan.id}
                    name={plan.name}
                    stackId="plans"
                    fill={palette[index % 3]}
                    maxBarSize={24}
                    animationDuration={400}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-tiny text-muted">
            Buckets aggregate recorded daily consumption; active-user buckets are user-days. Usage
            is attributed to the plan recorded on each event.
          </p>
        </ChartCard>
      </div>
      <div className="grid gap-widget lg:grid-cols-2">
        <Card title={<SaasTitle icon={MousePointer2}>Feature adoption</SaasTitle>}>
          <div className="mt-3 space-y-3">
            {features.map((item) => {
              const count = new Set(usage.filter((u) => u[item.key] > 0).map((u) => u.customerId))
                .size;
              const percentage = active.size ? (count / active.size) * 100 : 0;
              return (
                <button
                  key={item.key}
                  onClick={() => setFeature(item.key)}
                  aria-pressed={feature === item.key}
                  className="block w-full text-left"
                >
                  <div className="flex justify-between text-label">
                    <span
                      className={feature === item.key ? "font-medium text-accent" : "text-muted"}
                    >
                      {item.name}
                    </span>
                    <span>
                      {count} workspaces · {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-surface-alt">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-4 rounded-control border border-border bg-surface-alt p-3">
            <p className="text-label font-medium">
              {features.find((f) => f.key === feature)?.name} adopters
            </p>
            <p className="mt-2 text-tiny leading-relaxed text-muted">
              {adopted.map((c) => c.company).join(" · ") ||
                "No recorded adoption in this selection."}
            </p>
          </div>
          <p className="mt-3 text-tiny text-muted">
            Adoption = at least one recorded use / active workspaces. Inactive or unavailable plan
            features can produce zero adoption.
          </p>
        </Card>
        <ChartCard title={<SaasTitle icon={UsersRound}>Engagement map</SaasTitle>}>
          <div className="mt-3 h-[240px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: -12, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" />
                <XAxis
                  type="number"
                  dataKey="idle"
                  name="Days since activity"
                  unit="d"
                  tick={{ fill: "var(--muted)", fontSize: 10 }}
                />
                <YAxis
                  type="number"
                  dataKey="users"
                  name="Avg daily active seats"
                  tick={{ fill: "var(--muted)", fontSize: 10 }}
                />
                <ZAxis dataKey="api" range={[50, 250]} name="API requests" />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="chart-tooltip">
                        <strong>{payload[0].payload.name}</strong>
                        <p>{payload[0].payload.idle} days since activity</p>
                        <p>{payload[0].payload.users.toFixed(1)} average daily active seats</p>
                        <p>{payload[0].payload.api.toLocaleString("en-US")} API requests</p>
                      </div>
                    ) : null
                  }
                />
                <Scatter data={engagement} animationDuration={400}>
                  {engagement.map((item) => (
                    <Cell
                      key={item.name}
                      fill={item.health === "At risk" ? "var(--color-trend-down)" : "var(--accent)"}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-tiny text-muted">
            X: idle days in this window; Y: average daily seats. Bubble size: API volume. No
            activity in the window is shown at {days} days.
          </p>
        </ChartCard>
      </div>
      <div className="grid items-start gap-widget xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card title={<SaasTitle icon={Gauge}>Plan usage limits</SaasTitle>}>
          <div className="[&_table]:min-w-[680px]">
            <DataTable
              label="SaaS usage limits"
              rows={accounts}
              rowKey={(c) => c.id}
              pageSize={5}
              columns={[
                { key: "company", label: "Workspace", value: (c) => c.company },
                {
                  key: "plan",
                  label: "Current primary plan",
                  value: (c) =>
                    data.plans.find(
                      (p) =>
                        p.id ===
                        data.subscriptions.find(
                          (s) => s.customerId === c.id && s.status === "Active",
                        )?.planId,
                    )?.name ||
                    data.plans.find(
                      (p) => p.id === data.subscriptions.find((s) => s.customerId === c.id)?.planId,
                    )?.name ||
                    "No plan",
                },
                {
                  key: "api",
                  label: "API / limit",
                  value: (c) => monthlyUsage(data, c.id).api,
                  render: (c) => {
                    const sub =
                        data.subscriptions.find(
                          (s) => s.customerId === c.id && s.status === "Active",
                        ) || data.subscriptions.find((s) => s.customerId === c.id),
                      plan = data.plans.find((p) => p.id === sub?.planId),
                      api = monthlyUsage(data, c.id).api;
                    return (
                      <span className={api > (plan?.api || 0) ? "text-danger" : ""}>
                        {api.toLocaleString("en-US")} / {plan?.api.toLocaleString("en-US") || "—"}
                      </span>
                    );
                  },
                },
                { key: "seats", label: "Peak seats", value: (c) => monthlyUsage(data, c.id).seats },
                {
                  key: "storage",
                  label: "Latest GB",
                  value: (c) => monthlyUsage(data, c.id).storage,
                },
                {
                  key: "health",
                  label: "Health",
                  value: (c) => customerHealth(data, c.id),
                  render: (c) => <StatusBadge status={customerHealth(data, c.id)} />,
                },
              ]}
            />
          </div>
          <p className="mt-2 text-tiny text-muted">
            Rolling 30-day sample vs the current primary agreement’s monthly API limit, independent
            of the chart date filter. A customer with multiple agreements uses its first active
            agreement for this illustrative limit.
          </p>
        </Card>
        <ChartCard
          title={<SaasTitle icon={ChartNoAxesCombined}>Retention & churn trend</SaasTitle>}
        >
          <div className="mt-3 h-[210px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trend} margin={{ left: -24, right: -20 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "var(--muted)", fontSize: 10 }} />
                <YAxis
                  yAxisId="churn"
                  orientation="right"
                  allowDecimals={false}
                  tick={{ fill: "var(--muted)", fontSize: 10 }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  yAxisId="churn"
                  dataKey="churn"
                  name="Cancellations"
                  fill="var(--color-trend-down)"
                  maxBarSize={15}
                  animationDuration={400}
                />
                <Line
                  dataKey="retention"
                  name="Paid retention (%)"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  animationDuration={400}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-tiny text-muted">
            Fixed completed-month history, May–Oct. Retention follows positive-MRR subscriptions
            present at the month’s start; cancellations are ledger events. Current-plan filter
            applies.
          </p>
        </ChartCard>
      </div>
    </SaasWorkspace>
  );
}
