"use client";
import { useState } from "react";
import Link from "next/link";
import { Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { AiStatus, AiTitle } from "@/features/ai/components/ai-workspace";
import { usd, requestCost, type AiData, type ApiRequest, type Scope } from "@/features/ai/types";
import { ExecutionActivity } from "./execution-activity";
export function RequestActivity({
  data,
  rows,
  scope,
}: {
  data: AiData;
  rows: ApiRequest[];
  scope: Scope;
}) {
  const [selected, setSelected] = useState<ApiRequest | null>(null);
  const recent = [...rows].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 5);
  return (
    <div className="grid items-start gap-widget xl:grid-cols-[1.3fr_1fr]">
      <Card
        title={<AiTitle icon={Activity}>Recent AI requests</AiTitle>}
        action={
          <Link href="/apps/ai/usage" className="text-tiny text-accent">
            Inspect all →
          </Link>
        }
      >
        <div className="mt-3 divide-y divide-border">
          {recent.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className="flex w-full items-center justify-between gap-2 py-3 text-left hover:text-accent"
            >
              <div className="min-w-0">
                <p className="truncate font-mono text-tiny">{r.id}</p>
                <p className="mt-1 text-tiny text-muted">
                  {data.models.find((m) => m.id === r.modelId)?.name} · {r.source}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <AiStatus>{r.status}</AiStatus>
                <p className="mt-1 text-[10px] text-muted">
                  {r.latency} ms · {usd(requestCost(r, data.models))}
                </p>
              </div>
            </button>
          ))}
          {!recent.length && (
            <p className="py-4 text-label text-muted">No requests in this scope.</p>
          )}
        </div>
      </Card>
      <ExecutionActivity data={data} rows={rows} scope={scope} />
      <Dialog open={!!selected} title="Demo request details" onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-3 text-label">
            <p className="break-all font-mono">{selected.id}</p>
            <AiStatus>{selected.status}</AiStatus>
            <p>
              {selected.time} · {selected.environment} · {selected.workspace}
            </p>
            <p>
              Input {selected.input} · Output {selected.output} · {selected.latency} ms
            </p>
            <p>{selected.error || "Simulated request completed."}</p>
          </div>
        )}
      </Dialog>
    </div>
  );
}
