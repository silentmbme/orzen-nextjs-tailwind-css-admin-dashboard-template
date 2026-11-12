"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { RadialChartExamples } from "./radial-chart-examples";

export function RadialChartsPage() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="Radial charts" />
          <p className="mt-1 text-[10px] text-muted">
            Recharts radial-bar variants for progress, ranking, goals, gauges, and category
            comparisons.
          </p>
        </div>
        <Badge>Recharts · 12 types</Badge>
      </div>
      <RadialChartExamples />
    </div>
  );
}
