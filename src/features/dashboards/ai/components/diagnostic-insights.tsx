"use client";
import { useState } from "react";
import { Gauge, Route } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AiTitle } from "@/features/ai/components/ai-workspace";
import { metrics, number, type AiData, type ApiRequest } from "@/features/ai/types";
export function DiagnosticInsights({ data, rows }: { data: AiData; rows: ApiRequest[] }) {
  const [bucket, setBucket] = useState<number | null>(null);
  const sorted = rows.map((r) => r.latency).sort((a, b) => a - b);
  const percentile = (p: number) =>
    sorted.length ? sorted[Math.max(0, Math.ceil(sorted.length * p) - 1)] : 0;
  const buckets = [
    { label: "< 500", min: 0, max: 500 },
    { label: "500–1k", min: 500, max: 1000 },
    { label: "1k–2k", min: 1000, max: 2000 },
    { label: "2k–3k", min: 2000, max: 3000 },
    { label: "≥ 3k", min: 3000, max: Infinity },
  ].map((b) => ({ ...b, rows: rows.filter((r) => r.latency >= b.min && r.latency < b.max) }));
  const max = Math.max(1, ...buckets.map((b) => b.rows.length));
  return (
    <div className="grid items-start gap-widget lg:grid-cols-2">
      <Card
        title={<AiTitle icon={Gauge}>Latency profile</AiTitle>}
        action={<span className="text-[10px] text-muted">All scoped requests · milliseconds</span>}
      >
        <div className="mt-3 grid grid-cols-3 divide-x divide-border rounded-control border border-border bg-surface-alt py-3">
          {[
            { label: "P50 / median", p: 0.5 },
            { label: "P95", p: 0.95 },
            { label: "P99", p: 0.99 },
          ].map((item) => (
            <div key={item.label} className="px-3">
              <p className="text-[10px] text-muted">{item.label}</p>
              <p className="mt-1 text-lg font-semibold">
                {number(percentile(item.p))}
                <span className="ml-1 text-[10px] font-normal text-muted">ms</span>
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid h-[135px] grid-cols-5 items-end gap-2">
          {buckets.map((b, i) => (
            <button
              key={b.label}
              aria-label={`Inspect latency ${b.label} ms: ${b.rows.length} requests`}
              aria-pressed={bucket === i}
              onClick={() => setBucket(bucket === i ? null : i)}
              className="flex h-full min-w-0 flex-col justify-end text-center focus-visible:outline-2 focus-visible:outline-accent"
            >
              <span className="mb-1 text-[10px] font-medium">{b.rows.length}</span>
              <span
                className={`mx-auto w-full max-w-12 rounded-t-control ${bucket === i ? "bg-accent" : "bg-accent/35 hover:bg-accent/60"}`}
                style={{ height: `${(b.rows.length / max) * 90}px`, minHeight: 2 }}
              />
              <span className="mt-2 text-[10px] text-muted">{b.label}</span>
            </button>
          ))}
        </div>
        <p role="status" className="mt-3 border-t border-border pt-2 text-tiny text-muted">
          {bucket === null
            ? "Select a latency bucket to inspect its request outcomes."
            : `${buckets[bucket].label} ms: ${buckets[bucket].rows.length} requests · ${buckets[bucket].rows.filter((r) => r.status === "Error").length} errors. Percentiles use the nearest-rank method.`}
        </p>
      </Card>
      <Card
        title={<AiTitle icon={Route}>Request source intelligence</AiTitle>}
        action={<span className="text-[10px] text-muted">Origin & environment</span>}
      >
        <div className="mt-3 space-y-3">
          {(["Demo API", "Workflow", "Chat"] as const).map((source) => {
            const m = metrics(
              rows.filter((r) => r.source === source),
              data.models,
            );
            return (
              <div key={source} className="rounded-control border border-border p-3">
                <div className="flex justify-between gap-2">
                  <span className="text-label font-medium">{source}</span>
                  <span className="text-tiny text-muted">
                    {m.total} requests ·{" "}
                    {rows.length ? Math.round((m.total / rows.length) * 100) : 0}%
                  </span>
                </div>
                <div className="mt-2 flex gap-2">
                  <span className="rounded-control bg-success-subtle px-2 py-1 text-[10px] text-success">
                    {m.success} successful
                  </span>
                  <span className="rounded-control bg-danger-subtle px-2 py-1 text-[10px] text-danger">
                    {m.errors} failed
                  </span>
                </div>
                <p className="mt-2 text-[10px] text-muted">
                  {m.success} successful · {m.errors} failed · {Math.round(m.latency)} ms mean
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
          {["Production", "Sandbox"].map((env) => (
            <div key={env}>
              <p className="text-[10px] text-muted">{env} sample records</p>
              <p className="mt-1 text-lg font-semibold">
                {rows.filter((r) => r.environment === env).length}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
