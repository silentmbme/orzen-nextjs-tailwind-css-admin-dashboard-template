import { Activity, CheckCheck, Cpu, Gauge, Radio, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AiTitle } from "@/features/ai/components/ai-workspace";
import { metrics, number, usd, type AiData, type ApiRequest } from "@/features/ai/types";
export function OperationsOverview({ data, rows }: { data: AiData; rows: ApiRequest[] }) {
  const m = metrics(rows, data.models);
  return (
    <Card
      title={<AiTitle icon={Radio}>Inference operations</AiTitle>}
      action={
        <span className="flex items-center gap-1.5 text-tiny text-muted">
          <i className="h-1.5 w-1.5 rounded-full bg-accent" />
          Demo telemetry
        </span>
      }
    >
      <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-control border border-border bg-surface-alt p-4">
          <p className="text-label text-muted">Total API requests</p>
          <p className="mt-2 text-[24px] font-semibold">{number(m.total)}</p>
          <p className="mt-2 text-tiny text-muted">
            {m.total ? (100 - m.errorRate).toFixed(1) : "0.0"}% successful · filtered request
            records
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { name: "Successful", value: number(m.success), icon: CheckCheck },
            { name: "Error rate", value: `${m.errorRate.toFixed(1)}%`, icon: Activity },
            { name: "Average latency", value: `${Math.round(m.latency)} ms`, icon: Gauge },
            { name: "Tokens consumed", value: number(m.input + m.output), icon: Cpu },
            { name: "Estimated cost", value: usd(m.cost), icon: Zap },
          ].map(({ name, value, icon: Icon }) => (
            <div key={name} className="rounded-control border border-border p-3">
              <p className="flex items-center gap-1.5 text-tiny text-muted">
                <Icon size={12} />
                {name}
              </p>
              <p className="mt-2 break-words text-lg font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
