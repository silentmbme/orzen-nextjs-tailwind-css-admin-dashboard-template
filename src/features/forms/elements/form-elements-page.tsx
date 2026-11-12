"use client";

import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { AdvancedInputExamples } from "./advanced-input-examples";
import { InputExamples } from "./input-examples";
import { SelectionExamples } from "./selection-examples";

export function FormElementsPage() {
  return (
    <div className="forms-showcase grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="Form elements" />
          <p className="mt-1 text-[10px] text-muted">
            Interactive input, selection, date, upload, and specialized control patterns.
          </p>
        </div>
        <Badge>Accessible · Interactive</Badge>
      </div>
      <InputExamples />
      <SelectionExamples />
      <AdvancedInputExamples />
    </div>
  );
}
