"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { BubbleChartExamples } from "./bubble-chart-examples";

export function BubbleChartsPage() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="Bubble charts" />
          <p className="mt-1 text-[10px] text-muted">
            Recharts bubble variants for market size, opportunity, risk, segmentation, and
            three-dimensional comparisons.
          </p>
        </div>
        <Badge>Recharts · 12 types</Badge>
      </div>
      <BubbleChartExamples />
    </div>
  );
}
