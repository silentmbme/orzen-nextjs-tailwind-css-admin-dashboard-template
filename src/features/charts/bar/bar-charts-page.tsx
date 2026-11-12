"use client";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { BarChartExamples } from "./bar-chart-examples";
export function BarChartsPage() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="Bar charts" />
          <p className="mt-1 text-[10px] text-muted">
            Recharts bar variants with distinct directions, groups, stacks, ranges, corners, and
            custom shapes.
          </p>
        </div>
        <Badge>Recharts · 15 types</Badge>
      </div>
      <BarChartExamples />
    </div>
  );
}
