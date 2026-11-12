"use client";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { PieChartExamples } from "./pie-chart-examples";
export function PieChartsPage() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="Pie & donut charts" />
          <p className="mt-1 text-[10px] text-muted">
            Recharts circular variants with distinct rings, gauges, labels, sectors, and
            interactions.
          </p>
        </div>
        <Badge>Recharts · 15 types</Badge>
      </div>
      <PieChartExamples />
    </div>
  );
}
