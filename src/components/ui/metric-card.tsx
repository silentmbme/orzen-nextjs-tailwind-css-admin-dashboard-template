import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight, ArrowUp, ArrowDown } from "lucide-react";
import { Card } from "./card";
export function MetricCard({
  label,
  value,
  change,
  up,
  icon: Icon,
  comparison = "compared to last month",
  variant = "default",
  action,
}: {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: LucideIcon;
  comparison?: string;
  variant?: "default" | "inset";
  action?: ReactNode;
}) {
  return (
    <Card className={variant === "inset" ? "min-w-0" : "metric-card"}>
      {variant === "inset" ? (
        <>
          <div className="mb-2 flex min-h-5 items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2 text-label font-medium uppercase">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-surface-alt text-muted">
                <Icon size={12} />
              </span>
              {label}
            </span>
            {action}
          </div>
          <div className="rounded-control bg-surface-alt px-2.5 py-2">
            <strong className="block text-kpi font-semibold leading-tight tracking-tight">
              {value}
            </strong>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-label">
              <span
                className={`inline-flex items-center gap-0.5 ${up ? "text-success" : "text-danger"}`}
              >
                {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {change}
              </span>
              <span className="text-tiny text-muted">{comparison}</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="ui-stat__heading">
            <span className="ui-stat__heading-label">
              <Icon size={14} />
              {label}
            </span>
            {action}
          </div>
          <div className="ui-stat__value-wrap">
            <strong className="ui-stat__value">{value}</strong>
            <div className="ui-stat__trend">
              <span className={up ? "positive" : "negative"}>
                {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              </span>
              <span className={up ? "positive-text" : "negative-text"}>{change}</span>
              <span className="compare">{comparison}</span>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
