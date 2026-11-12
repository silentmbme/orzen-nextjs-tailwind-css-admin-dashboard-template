"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { ScatterChartExamples } from "./scatter-chart-examples";

export function ScatterChartsPage() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="Scatter charts" />
          <p className="mt-1 text-[10px] text-muted">
            Recharts scatter variants for correlation, distribution, segmentation, bubbles, and
            outlier analysis.
          </p>
        </div>
        <Badge>Recharts · 12 types</Badge>
      </div>
      <ScatterChartExamples />
    </div>
  );
}
