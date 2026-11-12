import { ChevronRight, Rows3 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { OrderExpansionTable } from "./order-expansion-table";
import { ProjectHierarchyTable } from "./project-hierarchy-table";
import { EmployeeExpansionTable } from "./employee-expansion-table";

export function ExpandableTablesPage() {
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
              Expandable
            </span>
          </nav>
          <PageHeader title="Expandable Tables" />
          <p className="mt-1 max-w-2xl text-[12px] text-muted">
            Three advanced expansion patterns for commerce operations, project hierarchy, and
            employee profiles.
          </p>
        </div>
        <Badge>
          <Rows3 size={11} />3 advanced examples
        </Badge>
      </div>
      <OrderExpansionTable />
      <ProjectHierarchyTable />
      <EmployeeExpansionTable />
    </div>
  );
}
