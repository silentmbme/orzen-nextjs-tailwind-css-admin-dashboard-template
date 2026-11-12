"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { WizardBusinessExamples } from "./wizard-business-examples";
import { WizardVariations } from "./wizard-variations";

export function FormWizardPage() {
  return (
    <div className="forms-showcase grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="Form wizard" />
          <p className="mt-1 text-[10px] text-muted">
            Interactive steppers, progress patterns, and business workflow compositions.
          </p>
        </div>
        <Badge>16 wizard layouts</Badge>
      </div>
      <WizardVariations />
      <WizardBusinessExamples />
    </div>
  );
}
