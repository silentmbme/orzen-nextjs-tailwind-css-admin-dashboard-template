import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
export function HrTitle({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <span aria-label={children} className="inline-flex items-center gap-1.5">
      <Icon size={14} aria-hidden className="shrink-0" />
      <span>{children}</span>
    </span>
  );
}
export function HrStatus({ status }: { status: string }) {
  return (
    <Badge
      tone={
        ["Active", "Present", "Approved", "Paid", "Hired", "Open"].includes(status)
          ? "success"
          : ["Absent", "Rejected", "Inactive", "Closed"].includes(status)
            ? "danger"
            : "neutral"
      }
    >
      {status}
    </Badge>
  );
}
export function HrField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-1 text-label">
      {label}
      {children}
    </label>
  );
}
