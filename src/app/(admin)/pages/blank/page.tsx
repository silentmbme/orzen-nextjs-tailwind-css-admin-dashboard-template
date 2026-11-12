import { ChevronRight, FilePlus2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

export default function BlankPage() {
  return (
    <div className="grid min-w-0 gap-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <PageHeader title="Blank Page" />
          <p className="mt-1 text-[12px] text-muted">
            A clean starting point for your custom content.
          </p>
        </div>
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 pt-1 text-[11px] text-muted"
        >
          <span>Pages</span>
          <ChevronRight size={12} aria-hidden="true" />
          <span aria-current="page" className="font-medium text-foreground">
            Blank Page
          </span>
        </nav>
      </div>

      {/* Replace this section with the content for your new admin page. */}
      <section
        aria-label="Page content"
        className="flex min-h-[260px] min-w-0 items-center justify-center rounded-card border border-card-border bg-surface p-5 text-center sm:min-h-[320px]"
      >
        <div className="max-w-sm">
          <span className="mx-auto grid size-10 place-items-center rounded-lg bg-accent/10 text-accent">
            <FilePlus2 size={19} aria-hidden="true" />
          </span>
          <h2 className="mt-3 text-[14px] font-semibold text-foreground">
            Start building your page
          </h2>
          <p className="mt-1 text-[12px] leading-5 text-muted">
            Add your content here. This page already uses the admin layout and theme.
          </p>
        </div>
      </section>
    </div>
  );
}
