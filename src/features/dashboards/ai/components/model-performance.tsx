import { Cpu, Gauge } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AiStatus, AiTitle } from "@/features/ai/components/ai-workspace";
import { metrics, usd, type AiData, type ApiRequest } from "@/features/ai/types";
export function ModelPerformance({
  data,
  rows,
  days,
}: {
  data: AiData;
  rows: ApiRequest[];
  days: number;
}) {
  const models = data.models
    .map((model) => ({
      model,
      ...metrics(
        rows.filter((r) => r.modelId === model.id),
        data.models,
      ),
    }))
    .filter((m) => m.total)
    .sort((a, b) => a.latency - b.latency);
  return (
    <Card
      title={<AiTitle icon={Gauge}>Model performance leaderboard</AiTitle>}
      action={<span className="text-[10px] text-muted">Ranked by mean latency</span>}
    >
      <div className="mt-3 space-y-3">
        {models.map(({ model, total, latency, errorRate, cost }, index) => (
          <div key={model.id} className="rounded-control border border-border p-3">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-control bg-accent/10 text-accent">
                <Cpu size={14} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-label font-medium">{model.name}</p>
                <p className="mt-0.5 text-[10px] text-muted">
                  #{index + 1} · {(total / days).toFixed(1)} requests / day
                </p>
              </div>
              <AiStatus>{model.enabled ? model.availability : "Disabled"}</AiStatus>
            </div>
            <div className="mt-3 flex items-baseline justify-between text-tiny">
              <span className="text-muted">Mean response</span>
              <span className="font-medium">
                {Math.round(latency)} <span className="font-normal text-muted">ms</span>
              </span>
            </div>
            <div className="mt-3 flex justify-between border-t border-border pt-2 text-[10px]">
              <span className="text-danger">{errorRate.toFixed(1)}% errors</span>
              <span className="text-muted">{usd(cost)}</span>
            </div>
          </div>
        ))}
      </div>
      {!models.length && (
        <p className="py-4 text-label text-muted">No model activity in this scope.</p>
      )}
    </Card>
  );
}
