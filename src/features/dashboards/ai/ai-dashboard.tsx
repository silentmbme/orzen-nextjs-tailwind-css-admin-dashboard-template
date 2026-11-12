"use client";
import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { AiWorkspace } from "@/features/ai/components/ai-workspace";
import { useAi } from "@/features/ai/hooks/use-ai";
import { exportReport } from "@/features/ai/demo-service";
import { dayOffset, scopedRequests, snapshotDate, requestCost } from "@/features/ai/types";
import { OperationsOverview } from "./components/operations-overview";
import { TokenCostAnalysis } from "./components/token-cost-analysis";
import { ModelPerformance } from "./components/model-performance";
import { RequestActivity } from "./components/request-activity";
import { OperationsAlerts } from "./components/operations-alerts";
import { DiagnosticInsights } from "./components/diagnostic-insights";
export function AiDashboard() {
  const { data } = useAi(),
    [environment, setEnvironment] = useState("all"),
    [modelId, setModelId] = useState("all"),
    [days, setDays] = useState("7");
  const rows = scopedRequests(data, {
    environment,
    modelId,
    from: dayOffset(1 - Number(days)),
    to: snapshotDate,
  });
  return (
    <AiWorkspace
      title="AI operations"
      description="Inference health, token economics and execution signals from one demo dataset."
      actions={
        <>
          <Select
            aria-label="AI environment"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
          >
            <option value="all">All environments</option>
            <option>Production</option>
            <option>Sandbox</option>
          </Select>
          <Select
            aria-label="AI model filter"
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
          <Select
            aria-label="AI time period"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          >
            {[7, 14, 30].map((n) => (
              <option key={n} value={n}>
                Last {n} days
              </option>
            ))}
          </Select>
          <Button
            disabled={!rows.length}
            onClick={() =>
              exportReport(
                "ai-usage",
                rows.map((r) => ({
                  ...r,
                  estimatedCost: requestCost(r, data.models),
                })),
              )
            }
          >
            <Download size={13} />
            Export usage report
          </Button>
        </>
      }
    >
      <OperationsOverview data={data} rows={rows} />
      <div className="grid items-start gap-widget xl:grid-cols-[2fr_1fr]">
        <TokenCostAnalysis data={data} rows={rows} />
        <ModelPerformance data={data} rows={rows} days={Number(days)} />
      </div>
      <RequestActivity
        scope={{ environment, modelId, from: dayOffset(1 - Number(days)), to: snapshotDate }}
        data={data}
        rows={rows}
      />
      <OperationsAlerts data={data} rows={rows} />
      <DiagnosticInsights data={data} rows={rows} />
    </AiWorkspace>
  );
}
