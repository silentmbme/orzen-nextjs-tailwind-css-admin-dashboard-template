"use client";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import { PageHeader } from "@/components/layout/page-header";
export function AppTitle({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <span aria-label={children} className="inline-flex items-center gap-1.5">
      <Icon size={14} aria-hidden />
      {children}
    </span>
  );
}
export function AppField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-1 text-label">
      {label}
      {children}
    </label>
  );
}
export function SharedWorkspace({
  title,
  description,
  actions,
  warning,
  children,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  warning?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-widget font-admin text-body leading-[1.4] text-foreground [&_.ui-card\_\_title]:text-label! [&_.ui-card\_\_title]:font-medium! [&_.ui-card\_\_title]:uppercase! [&_.ui-card\_\_header]:flex-wrap [&_.ui-card\_\_header]:gap-2!">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <PageHeader title={title} />
          <p className="mt-1 text-label text-muted">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      </div>
      {warning && (
        <p
          role="alert"
          className="rounded-control border border-danger bg-surface p-3 text-label text-danger"
        >
          {warning}
        </p>
      )}
      {children}
    </div>
  );
}
