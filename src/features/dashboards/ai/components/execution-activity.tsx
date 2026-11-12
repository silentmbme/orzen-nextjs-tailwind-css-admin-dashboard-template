"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, GitBranch, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { AiStatus, AiTitle } from "@/features/ai/components/ai-workspace";
import { metrics, usd, type AiData, type ApiRequest, type Scope } from "@/features/ai/types";
export function ExecutionActivity({
  data,
  rows,
  scope,
}: {
  data: AiData;
  rows: ApiRequest[];
  scope: Scope;
}) {
  const [tab, setTab] = useState("runs"),
    [inspect, setInspect] = useState("");
  const runs = data.runs
    .filter(
      (run) =>
        rows.some((r) => r.id === run.requestId) ||
        (run.status === "Running" &&
          scope.environment !== "Production" &&
          (scope.modelId === "all" ||
            data.workflows.find((w) => w.id === run.workflowId)?.modelId === scope.modelId) &&
          run.date.slice(0, 10) >= scope.from &&
          run.date.slice(0, 10) <= scope.to),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  const prompts = data.prompts
    .map((p) => ({
      ...p,
      ...metrics(
        rows.filter((r) => r.promptId === p.id),
        data.models,
      ),
    }))
    .filter((p) => p.total)
    .sort((a, b) => b.total - a.total);
  const selected = runs.find((r) => r.id === inspect);
  return (
    <Card
      title={<AiTitle icon={GitBranch}>Execution & prompt activity</AiTitle>}
      action={
        <Link href="/apps/ai/workflows" className="text-tiny text-accent">
          Workflows →
        </Link>
      }
    >
      <div className="mt-3 grid grid-cols-3 divide-x divide-border rounded-control border border-border bg-surface-alt py-3">
        {[
          { label: "Runs in scope", value: runs.length },
          {
            label: "Active",
            value: runs.filter((r) => r.status === "Running").length,
          },
          {
            label: "Failed",
            value: runs.filter((r) => r.status === "Failed").length,
          },
        ].map((item) => (
          <div key={item.label} className="px-3">
            <p className="text-[10px] text-muted">{item.label}</p>
            <p className="mt-1 text-xl font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="my-3 flex gap-1">
        <Button
          size="sm"
          variant={tab === "runs" ? "secondary" : "ghost"}
          aria-pressed={tab === "runs"}
          onClick={() => setTab("runs")}
        >
          <Play size={11} />
          Executions
        </Button>
        <Button
          size="sm"
          variant={tab === "prompts" ? "secondary" : "ghost"}
          aria-pressed={tab === "prompts"}
          onClick={() => setTab("prompts")}
        >
          <BookOpen size={11} />
          Prompt usage
        </Button>
      </div>
      {tab === "runs" ? (
        <div className="max-h-[290px] overflow-y-auto divide-y divide-border">
          {runs.slice(0, 6).map((run) => (
            <button
              key={run.id}
              onClick={() => setInspect(run.id)}
              className="flex w-full items-center gap-2 py-3 text-left hover:text-accent"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-control bg-accent/10 text-accent">
                <GitBranch size={14} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-label font-medium">
                  {data.workflows.find((w) => w.id === run.workflowId)?.name}
                </p>
                <p className="mt-1 text-[10px] text-muted">
                  {run.date.slice(5, 10)} · {run.date.slice(11, 16)} UTC
                </p>
              </div>
              <AiStatus>{run.status}</AiStatus>
              <ChevronRight size={12} className="shrink-0 text-muted" />
            </button>
          ))}
          {!runs.length && (
            <p className="py-5 text-label text-muted">No workflow executions in scope.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {prompts.slice(0, 4).map((p, i) => (
            <div key={p.id} className="rounded-control border border-border p-3">
              <div className="flex justify-between gap-2 text-label">
                <span className="font-medium">
                  <span className="mr-2 text-tiny text-muted">0{i + 1}</span>
                  {p.name}
                </span>
                <span className="text-accent">{p.total} uses</span>
              </div>
              <p className="mt-2 text-[10px] text-muted">
                {p.category} · {p.errorRate.toFixed(1)}% errors · {usd(p.cost)}
              </p>
            </div>
          ))}
          {!prompts.length && (
            <p className="py-5 text-label text-muted">No prompt usage in this scope.</p>
          )}
          <Link href="/apps/ai/prompts" className="block text-tiny text-accent">
            Open prompt library →
          </Link>
        </div>
      )}
      <Dialog open={!!selected} title="Simulated execution details" onClose={() => setInspect("")}>
        {selected && (
          <div className="space-y-3 text-label">
            <p className="font-medium">
              {data.workflows.find((w) => w.id === selected.workflowId)?.name}
            </p>
            <AiStatus>{selected.status}</AiStatus>
            <p className="break-all font-mono text-tiny">{selected.id}</p>
            <p className="text-muted">{selected.date} · local demo</p>
            <p className="rounded-control border border-border bg-surface-alt p-3">
              {selected.detail}
            </p>
            <Link href="/apps/ai/workflows" className="inline-block text-accent">
              Open workflow workspace →
            </Link>
          </div>
        )}
      </Dialog>
    </Card>
  );
}
