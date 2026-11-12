"use client";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Download, Gauge, ListFilter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { AiWorkspace, AiTitle, AiStatus } from "./ai-workspace";
import { useAi } from "../hooks/use-ai";
import { exportReport } from "../demo-service";
import {
  dayOffset,
  metrics,
  number,
  requestCost,
  scopedRequests,
  snapshotDate,
  usd,
  type ApiRequest,
} from "../types";
export function ApiUsageMonitor() {
  const { data } = useAi(),
    [from, setFrom] = useState(dayOffset(-6)),
    [to, setTo] = useState(snapshotDate),
    [modelId, setModelId] = useState("all"),
    [environment, setEnvironment] = useState("all"),
    [status, setStatus] = useState("all"),
    [selected, setSelected] = useState<ApiRequest | null>(null);
  const invalid = !from || !to || from > to;
  const rows = invalid
    ? []
    : scopedRequests(data, { from, to, modelId, environment }).filter(
        (r) => status === "all" || r.status === status,
      );
  const m = metrics(rows, data.models),
    days = Math.max(1, Math.round((Date.parse(to) - Date.parse(from)) / 86400000) + 1);
  const dates = [...new Set(rows.map((r) => r.time.slice(0, 10)))].sort();
  const trend = dates.map((date) => {
    const stats = metrics(
      rows.filter((r) => r.time.startsWith(date)),
      data.models,
    );
    return { date: date.slice(5), Success: stats.success, Error: stats.errors };
  });
  return (
    <AiWorkspace
      title="Usage & API monitoring"
      description="Inspect sample requests, latency, tokens and estimated spend."
      actions={
        <Button
          disabled={!rows.length}
          onClick={() =>
            exportReport(
              "ai-request-log",
              rows.map((r) => ({ ...r, estimatedCost: requestCost(r, data.models) })),
            )
          }
        >
          <Download size={13} />
          Export filtered report
        </Button>
      }
    >
      <Card title={<AiTitle icon={ListFilter}>Analysis scope</AiTitle>}>
        <div className="mt-3 flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-tiny text-muted">
            From date
            <Input
              aria-label="Usage from date"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-tiny text-muted">
            To date
            <Input
              aria-label="Usage to date"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-tiny text-muted">
            Model
            <Select
              aria-label="Usage model filter"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
            >
              <option value="all">All models</option>
              {data.models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-1 text-tiny text-muted">
            Environment
            <Select
              aria-label="Usage environment"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
            >
              <option value="all">All environments</option>
              <option>Production</option>
              <option>Sandbox</option>
            </Select>
          </label>
          <label className="flex flex-col gap-1 text-tiny text-muted">
            Request status
            <Select
              aria-label="Usage request status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All requests</option>
              <option>Success</option>
              <option>Error</option>
            </Select>
          </label>
        </div>
        {invalid && (
          <p role="alert" className="mt-3 text-label text-danger">
            Choose valid dates with the start before or on the end date.
          </p>
        )}
        <p className="mt-2 text-[10px] text-muted">
          All metrics, charts and exports use these filters. Log search affects only visible table
          rows.
        </p>
      </Card>
      <div className="grid items-start gap-widget xl:grid-cols-[260px_minmax(0,1fr)]">
        <Card title={<AiTitle icon={Gauge}>Request diagnostics</AiTitle>}>
          <dl className="mt-3 divide-y divide-border">
            {[
              { name: "API requests", value: number(m.total) },
              { name: "Token usage", value: number(m.input + m.output) },
              { name: "Estimated USD cost", value: usd(m.cost) },
              { name: "Mean latency", value: `${Math.round(m.latency)} ms` },
              {
                name: "Success rate",
                value: `${m.total ? (100 - m.errorRate).toFixed(1) : "0.0"}%`,
              },
              { name: "Error rate", value: `${m.errorRate.toFixed(1)}%` },
            ].map((item) => (
              <div key={item.name} className="py-3">
                <dt className="text-tiny text-muted">{item.name}</dt>
                <dd className="mt-1 text-lg font-semibold">{item.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-tiny text-muted">Fictional analysis limits</p>
          <p className={`mt-1 text-label ${m.total >= 200 ? "text-danger" : "text-muted"}`}>
            {m.total} / 200 requests
          </p>
          <div className="mt-2 h-1.5 bg-surface-alt">
            <div className="h-full bg-accent" style={{ width: `${Math.min(100, m.total / 2)}%` }} />
          </div>
          <p className="mt-2 text-[10px] text-muted">
            {(m.total / days).toFixed(1)} requests per calendar day in selected range. No quota is
            enforced.
          </p>
        </Card>
        <div className="min-w-0 space-y-widget">
          <ChartCard title={<AiTitle icon={Activity}>Request outcome trends</AiTitle>}>
            <div className="mt-3 h-[190px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ left: -25, right: 8 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 4" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "var(--muted)", fontSize: 10 }}
                    minTickGap={25}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "var(--muted)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface)",
                      borderColor: "var(--border)",
                      fontSize: 11,
                    }}
                  />
                  <Line dataKey="Success" stroke="var(--accent)" strokeWidth={2} />
                  <Line dataKey="Error" stroke="var(--color-trend-down)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-tiny text-muted">
              Purple: successful requests · Coral: errors · UTC dates
            </p>
          </ChartCard>
          <Card title={<AiTitle icon={Gauge}>Model-level diagnostics</AiTitle>}>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {data.models
                .filter((model) => modelId === "all" || modelId === model.id)
                .map((model) => {
                  const stats = metrics(
                    rows.filter((r) => r.modelId === model.id),
                    data.models,
                  );
                  return (
                    <button
                      key={model.id}
                      onClick={() => setModelId(modelId === model.id ? "all" : model.id)}
                      aria-pressed={modelId === model.id}
                      className="rounded-control border border-border bg-surface-alt p-3 text-left hover:border-accent"
                    >
                      <div className="flex flex-wrap justify-between gap-2">
                        <p className="text-label font-medium">{model.name}</p>
                        <span className="text-tiny text-muted">{stats.total} requests</span>
                      </div>
                      <p className="mt-2 text-tiny text-muted">
                        {Math.round(stats.latency)} ms avg · {stats.errorRate.toFixed(1)}% errors
                      </p>
                      <p className="mt-1 text-tiny">
                        Input {number(stats.input)} / Output {number(stats.output)}
                      </p>
                      <p className="mt-2 text-tiny text-accent">
                        {usd(stats.cost)} · select to {modelId === model.id ? "clear" : "focus"}
                      </p>
                    </button>
                  );
                })}
            </div>
          </Card>
        </div>
      </div>
      <Card
        title={<AiTitle icon={Activity}>API event log</AiTitle>}
        action={<span className="text-tiny text-muted">Simulated events · UTC</span>}
      >
        <div className="[&_table]:min-w-[950px]">
          <DataTable
            label="AI requests"
            rows={[...rows].sort((a, b) => b.time.localeCompare(a.time))}
            rowKey={(r) => r.id}
            pageSize={8}
            columns={[
              {
                key: "id",
                label: "Request",
                value: (r) => r.id,
                render: (r) => (
                  <button
                    className="font-mono text-tiny text-accent"
                    onClick={() => setSelected(r)}
                  >
                    {r.id.slice(0, 16)}
                  </button>
                ),
              },
              {
                key: "time",
                label: "Timestamp",
                value: (r) => r.time.replace("T", " ").slice(0, 19),
              },
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
              { key: "tokens", label: "Tokens", value: (r) => r.input + r.output },
              { key: "latency", label: "Latency ms", value: (r) => r.latency },
              {
                key: "cost",
                label: "Est. USD",
                value: (r) => requestCost(r, data.models),
                render: (r) => usd(requestCost(r, data.models)),
              },
              { key: "workspace", label: "Workspace", value: (r) => r.workspace },
            ]}
          />
        </div>
      </Card>
      <Dialog open={!!selected} title="API request inspection" onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-3 text-label">
            <p className="break-all font-mono">{selected.id}</p>
            <AiStatus>{selected.status}</AiStatus>
            <p>
              {selected.time} · {selected.environment}
            </p>
            <p>
              {data.models.find((m) => m.id === selected.modelId)?.name} · {selected.workspace} ·{" "}
              {selected.source}
            </p>
            <p>
              Input {number(selected.input)} / Output {number(selected.output)} tokens
            </p>
            <p>
              {selected.latency} ms · {usd(requestCost(selected, data.models))} estimated
            </p>
            <p className="rounded-control border border-border bg-surface-alt p-3 text-muted">
              {selected.error || "Simulated request completed. No provider was called."}
            </p>
          </div>
        )}
      </Dialog>
    </AiWorkspace>
  );
}
