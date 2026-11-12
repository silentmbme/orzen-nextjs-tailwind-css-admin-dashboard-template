"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { RadarChartExamples } from "./radar-chart-examples";

export function RadarChartsPage() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="Radar charts" />
          <p className="mt-1 text-[10px] text-muted">
            Recharts radar variants for performance, benchmarking, risk, and capability comparisons.
          </p>
        </div>
        <Badge>Recharts · 12 types</Badge>
      </div>
      <RadarChartExamples />
    </div>
  );
}
