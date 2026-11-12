"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { ValidationExamples } from "./validation-examples";
import { ValidationStates } from "./validation-states";

export function ValidationPage() {
  return (
    <div className="forms-showcase grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="Form validation" />
          <p className="mt-1 text-[10px] text-muted">
            Accessible validation states, feedback patterns, and interactive local checks.
          </p>
        </div>
        <Badge>Local validation only</Badge>
      </div>
      <ValidationStates />
      <ValidationExamples />
    </div>
  );
}
