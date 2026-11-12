"use client";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Gauge, Layers3, ShieldCheck, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { AiStatus, AiTitle } from "@/features/ai/components/ai-workspace";
import { metrics, number, usd, type AiData, type ApiRequest } from "@/features/ai/types";
const colors = [
  "var(--accent)",
  "var(--color-trend-down)",
  "var(--color-trend-up)",
  "var(--muted)",
];
export function OperationsAlerts({ data, rows }: { data: AiData; rows: ApiRequest[] }) {
  const [inspect, setInspect] = useState(""),
    [mode, setMode] = useState("requests");
  const total = metrics(rows, data.models),
    slow = rows.filter((r) => r.latency > 2000),
    failures = rows.filter((r) => r.status === "Error");
  const budget = 2,
    limit = 300000,
    tokens = total.input + total.output;
  const breached = [
    failures.length > 0,
    slow.length > 0,
    total.cost >= budget,
    tokens >= limit,
  ].filter(Boolean).length;
  const models = data.models
    .map((model, i) => {
      const m = metrics(
        rows.filter((r) => r.modelId === model.id),
        data.models,
      );
      return {
        name: model.name,
        ...m,
        tokens: m.input + m.output,
        color: colors[i % colors.length],
        value: mode === "tokens" ? m.input + m.output : mode === "cost" ? m.cost : m.total,
      };
    })
    .filter((m) => m.total);
  const denominator = models.reduce((s, m) => s + m.value, 0);
  const workspaces = [...new Set(rows.map((r) => r.workspace))]
    .map((name) => ({
      name,
      count: rows.filter((r) => r.workspace === name).length,
    }))
    .sort((a, b) => b.count - a.count);
  return (
    <div className="grid items-start gap-widget lg:grid-cols-2">
      <Card
        title={<AiTitle icon={TriangleAlert}>Operational guardrails</AiTitle>}
        action={
          <span
            className={`rounded-control px-2 py-1 text-[10px] ${breached ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"}`}
          >
            {rows.length ? `${breached} signals to review` : "No telemetry"}
          </span>
        }
      >
        <div className="mt-3 flex items-center gap-3 rounded-control border border-border bg-surface-alt p-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-surface text-accent">
            <ShieldCheck size={20} />
          </span>
          <div>
            <p className="text-label font-medium">
              {breached ? "Review scoped operational signals" : "Within sample thresholds"}
            </p>
            <p className="mt-1 text-[10px] text-muted">
              Demo checks only · no real limits or alerts are enforced
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            {
              key: "errors",
              name: "Failed requests",
              value: failures.length,
              detail: `${total.errorRate.toFixed(1)}% error rate`,
              icon: TriangleAlert,
            },
            {
              key: "latency",
              name: "High latency",
              value: slow.length,
              detail: "Above 2,000 ms",
              icon: Gauge,
            },
          ].map(({ key, name, value, detail, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setInspect(key)}
              className="rounded-control border border-border p-3 text-left hover:border-accent"
            >
              <div className="flex justify-between gap-2 text-tiny text-muted">
                <span>{name}</span>
                <Icon size={13} />
              </div>
              <p
                className={`mt-2 text-kpi font-semibold ${value ? "text-danger" : "text-success"}`}
              >
                {value}
              </p>
              <p className="mt-1 text-[10px] text-muted">{detail} · inspect →</p>
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            {
              name: "Estimated budget",
              value: total.cost,
              cap: budget,
              label: usd(total.cost),
              remaining: usd(Math.max(0, budget - total.cost)),
            },
            {
              name: "Token allowance",
              value: tokens,
              cap: limit,
              label: number(tokens),
              remaining: number(Math.max(0, limit - tokens)),
            },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-control border border-border bg-surface-alt p-3"
            >
              <p className="text-tiny text-muted">{item.name}</p>
              <p className="mt-2 text-lg font-semibold">{item.label}</p>
              <p className="mt-2 text-[10px] text-muted">
                {item.remaining} remaining · {Math.round((item.value / item.cap) * 100)}% used
              </p>
              <span
                className={
                  item.value >= item.cap
                    ? "mt-2 inline-block text-tiny text-danger"
                    : "mt-2 inline-block text-tiny text-success"
                }
              >
                {item.value >= item.cap ? "Threshold exceeded" : "Within allowance"}
              </span>
            </div>
          ))}
        </div>
      </Card>
      <Card
        title={<AiTitle icon={Layers3}>Usage distribution</AiTitle>}
        action={
          <div className="flex gap-1">
            {["requests", "tokens", "cost"].map((value) => (
              <Button
                key={value}
                size="sm"
                aria-label={`Distribution by ${value}`}
                aria-pressed={mode === value}
                variant={mode === value ? "secondary" : "ghost"}
                onClick={() => setMode(value)}
              >
                {value[0].toUpperCase() + value.slice(1)}
              </Button>
            ))}
          </div>
        }
      >
        <div className="mt-3 grid items-center gap-3 sm:grid-cols-[150px_minmax(0,1fr)]">
          <div className="relative mx-auto h-[155px] w-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={models}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={49}
                  outerRadius={67}
                  paddingAngle={3}
                  stroke="var(--surface)"
                  isAnimationActive={false}
                >
                  {models.map((m) => (
                    <Cell key={m.name} fill={m.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => (mode === "cost" ? usd(Number(v)) : number(Number(v)))}
                  contentStyle={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                    fontSize: 11,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
              <strong className="text-lg font-semibold">
                {mode === "cost" ? usd(denominator) : number(denominator)}
              </strong>
              <span className="text-[10px] uppercase text-muted">{mode}</span>
            </div>
          </div>
          <div className="space-y-3">
            {models.map((m) => (
              <div key={m.name}>
                <div className="flex justify-between gap-2 text-label">
                  <span className="flex items-center gap-2">
                    <i className="h-2 w-2 rounded-full" style={{ background: m.color }} />
                    {m.name}
                  </span>
                  <strong>{denominator ? Math.round((m.value / denominator) * 100) : 0}%</strong>
                </div>
                <p className="mt-1 text-[10px] text-muted">
                  {m.total} requests · {number(m.tokens)} tokens · {usd(m.cost)}
                </p>
              </div>
            ))}
            {!models.length && (
              <p className="text-label text-muted">No model usage in this scope.</p>
            )}
          </div>
        </div>
        <div className="mt-3 border-t border-border pt-3">
          <p className="text-tiny font-medium">Workspace request share</p>
          <div className="mt-2 divide-y divide-border">
            {workspaces.map((w, i) => (
              <div key={w.name} className="flex items-center gap-2 py-2 text-label">
                <span className="grid h-6 w-6 place-items-center rounded-control bg-surface-alt text-[10px] text-muted">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">{w.name}</span>
                <span className="text-tiny text-muted">{w.count} requests</span>
                <strong className="w-10 text-right font-medium">
                  {total.total ? Math.round((w.count / total.total) * 100) : 0}%
                </strong>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <Dialog
        open={!!inspect}
        title={inspect === "errors" ? "Failed demo requests" : "High-latency demo requests"}
        onClose={() => setInspect("")}
      >
        <p className="mb-3 text-tiny text-muted">
          Current dashboard scope. Select another model or time period to change these records.
        </p>
        <div className="[&_table]:min-w-[580px]">
          <DataTable
            label="Guardrail requests"
            rows={inspect === "errors" ? failures : slow}
            rowKey={(r) => r.id}
            columns={[
              { key: "id", label: "Request", value: (r) => r.id.slice(0, 16) },
              {
                key: "model",
                label: "Model",
                value: (r) => data.models.find((m) => m.id === r.modelId)?.name || "",
              },
              {
                key: "status",
                label: "Status",
                value: (r) => r.status,
                render: (r) => <AiStatus>{r.status}</AiStatus>,
              },
              { key: "latency", label: "Latency ms", value: (r) => r.latency },
              {
                key: "error",
                label: "Detail",
                value: (r) => r.error || "Exceeded sample latency threshold",
              },
            ]}
          />
        </div>
      </Dialog>
    </div>
  );
}
