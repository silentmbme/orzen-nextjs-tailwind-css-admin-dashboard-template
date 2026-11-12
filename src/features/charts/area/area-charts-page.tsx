"use client";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { AreaChartExamples } from "./area-chart-examples";
export function AreaChartsPage() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="Area charts" />
          <p className="mt-1 text-[10px] text-muted">
            Recharts area variants with distinct curves, stacks, ranges, gradients, gaps, and
            directions.
          </p>
        </div>
        <Badge>Recharts · 15 types</Badge>
      </div>
      <AreaChartExamples />
    </div>
  );
}
