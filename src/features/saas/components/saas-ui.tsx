import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
export function SaasTitle({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <span aria-label={children} className="inline-flex items-center gap-1.5">
      <Icon aria-hidden size={14} className="shrink-0" />
      <span>{children}</span>
    </span>
  );
}
export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      tone={
        ["Active", "Paid", "Healthy", "Succeeded"].includes(status)
          ? "success"
          : ["Canceled", "Failed", "At risk"].includes(status)
            ? "danger"
            : "neutral"
      }
    >
      {status}
    </Badge>
  );
}
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-1 text-label">
      {label}
      {children}
    </label>
  );
}
