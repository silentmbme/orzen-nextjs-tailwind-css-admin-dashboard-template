"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { HeatmapChartExamples } from "./heatmap-chart-examples";

export function HeatmapChartsPage() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="Heatmap charts" />
          <p className="mt-1 text-[10px] text-muted">
            Interactive heatmap variants for activity, retention, correlation, risk, demand, and
            operational density.
          </p>
        </div>
        <Badge>Interactive · 12 types</Badge>
      </div>
      <HeatmapChartExamples />
    </div>
  );
}
