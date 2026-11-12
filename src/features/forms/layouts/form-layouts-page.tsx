"use client";

import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { BasicLayoutExamples } from "./basic-layout-examples";
import { BusinessLayoutExamples } from "./business-layout-examples";

export function FormLayoutsPage() {
  return (
    <div className="forms-showcase grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="Form layouts" />
          <p className="mt-1 text-[10px] text-muted">
            Reusable structural and business form compositions for responsive applications.
          </p>
        </div>
        <Badge>16 layout patterns</Badge>
      </div>
      <BasicLayoutExamples />
      <BusinessLayoutExamples />
    </div>
  );
}
