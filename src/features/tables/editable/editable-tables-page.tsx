import { ChevronRight, FilePenLine } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { InlineEditableTable } from "./inline-editable-table";
import { RowEditableTable } from "./row-editable-table";
import { SpreadsheetTable } from "./spreadsheet-table";

export function EditableTablesPage() {
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
              Editable
            </span>
          </nav>
          <PageHeader title="Editable Tables" />
          <p className="mt-1 max-w-2xl text-[12px] text-muted">
            Three focused local-editing patterns for product pricing, employee records, and monthly
            sales planning.
          </p>
        </div>
        <Badge>
          <FilePenLine size={11} />
          Local demo editing
        </Badge>
      </div>
      <InlineEditableTable />
      <RowEditableTable />
      <SpreadsheetTable />
    </div>
  );
}
