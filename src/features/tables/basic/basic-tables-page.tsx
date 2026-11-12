import { ChevronRight, TableProperties } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { TableStyleExamples } from "./table-style-examples";
import { BusinessTableExamples } from "./business-table-examples";

export function BasicTablesPage() {
  return (
    <div className="grid min-w-0 gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="mb-1 flex items-center gap-1 text-[11px] text-muted"
          >
            <span>Tables</span>
            <ChevronRight size={11} />
            <span aria-current="page" className="text-foreground">
              Basic
            </span>
          </nav>
          <PageHeader title="Basic Tables" />
          <p className="mt-1 max-w-2xl text-[12px] text-muted">
            Twenty semantic table compositions covering density, borders, business data, responsive
            behavior, and system states.
          </p>
        </div>
        <Badge>
          <TableProperties size={11} />
          20 table styles
        </Badge>
      </div>
      <TableStyleExamples />
      <BusinessTableExamples />
    </div>
  );
}
