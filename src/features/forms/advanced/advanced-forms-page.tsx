"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { AdvancedSelectionExamples } from "./advanced-selection-examples";
import { SpecializedControlExamples } from "./specialized-control-examples";

export function AdvancedFormsPage() {
  return (
    <div className="forms-showcase grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="Advanced form controls" />
          <p className="mt-1 text-[10px] text-muted">
            Search, multi-selection, date, range, rating, color, masked, and rich selection
            patterns.
          </p>
        </div>
        <Badge>Interactive showcase</Badge>
      </div>
      <AdvancedSelectionExamples />
      <SpecializedControlExamples />
    </div>
  );
}
