"use client";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { LineChartExamples } from "./line-chart-examples";
export function LineChartsPage() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="Line charts" />
          <p className="mt-1 text-[10px] text-muted">
            Recharts line variants with clearly different curves, steps, markers, gaps, axes, and
            shapes.
          </p>
        </div>
        <Badge>Recharts · 14 types</Badge>
      </div>
      <LineChartExamples />
    </div>
  );
}
