"use client";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { useAi } from "../hooks/use-ai";
export function AiTitle({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <span aria-label={children} className="inline-flex items-center gap-1.5">
      <Icon size={14} aria-hidden />
      <span>{children}</span>
    </span>
  );
}
export function AiStatus({ children }: { children: string }) {
  return (
    <Badge
      tone={
        ["Success", "Succeeded", "Available", "Enabled"].includes(children)
          ? "success"
          : ["Error", "Failed", "Degraded"].includes(children)
            ? "danger"
            : "neutral"
      }
    >
      {children}
    </Badge>
  );
}
export function AiWorkspace({
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
  const { warning } = useAi();
  return (
    <div className="min-w-0 space-y-widget font-admin text-body leading-[1.4] text-foreground [&_.ui-card\_\_title]:text-label! [&_.ui-card\_\_title]:font-medium! [&_.ui-card\_\_title]:uppercase! [&_.ui-card\_\_header]:flex-wrap [&_.ui-card\_\_header]:gap-2! [&_.ui-card\_\_header]:min-h-7!">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <PageHeader title={title} />
          <p className="mt-1 text-label text-muted">{description}</p>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
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
