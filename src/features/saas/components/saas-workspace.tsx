"use client";
import type { ReactNode } from "react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import { PageHeader } from "@/components/layout/page-header";
export function SaasWorkspace({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-widget font-admin text-body leading-[1.4] text-foreground [&_.ui-card\_\_title]:text-label! [&_.ui-card\_\_title]:font-medium! [&_.ui-card\_\_title]:uppercase! [&_.ui-card\_\_title]:leading-[1.4]! [&_.ui-card\_\_header]:min-h-7! [&_.ui-card\_\_header]:gap-2! [&_.ui-card\_\_header]:flex-wrap">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <PageHeader title={title} />
          <p className="mt-1 text-label text-muted">{description}</p>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
