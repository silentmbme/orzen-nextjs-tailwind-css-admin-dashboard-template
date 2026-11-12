import {
  Box,
  Check,
  Code2,
  Database,
  Layers3,
  Orbit,
  Pencil,
  Trash2,
  UsersRound,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SaasTitle, StatusBadge } from "./saas-ui";
import { money, type Plan } from "../types";
export function PricingPlanCard({
  plan,
  yearly,
  subscribers,
  mrr,
  totalMrr,
  leading,
  onEdit,
  onDelete,
  onSubscribers,
}: {
  plan: Plan;
  yearly: boolean;
  subscribers: number;
  mrr: number;
  totalMrr: number;
  leading: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSubscribers: () => void;
}) {
  const Icon = plan.seats <= 5 ? Box : plan.seats <= 20 ? Layers3 : Orbit;
  const savings = Math.max(0, plan.monthly * 12 - plan.yearly),
    share = totalMrr ? (mrr / totalMrr) * 100 : 0;
  return (
    <Card
      title={<SaasTitle icon={Icon}>{plan.name}</SaasTitle>}
      action={<StatusBadge status={plan.active ? "Active" : "Inactive"} />}
      className="h-full [&_.ui-card\_\_body]:flex [&_.ui-card\_\_body]:flex-1 [&_.ui-card\_\_body]:flex-col flex flex-col"
    >
      <div className="mt-2 flex min-h-6 items-center justify-between gap-2">
        <p className="text-tiny text-muted">
          {plan.active ? "Available for new agreements" : "Existing agreements retained"}
        </p>
        {leading && <Badge>Highest MRR</Badge>}
      </div>
      <p className="mt-2 min-h-9 text-label leading-relaxed text-muted">{plan.description}</p>
      <div className="my-3 rounded-control border border-border bg-surface-alt p-3">
        <p className="text-tiny text-muted">{yearly ? "Monthly equivalent" : "Monthly price"}</p>
        <div className="mt-1 flex flex-wrap items-end gap-1">
          <strong className="text-[24px] font-semibold leading-tight tracking-tight">
            {money(yearly ? plan.yearly / 12 : plan.monthly)}
          </strong>
          <span className="pb-0.5 text-tiny text-muted">USD / month</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2">
          <span className="text-tiny text-muted">
            {yearly ? `${money(plan.yearly)} billed yearly` : "Billed monthly"}
          </span>
          {savings > 0 && (
            <span className="text-tiny font-medium text-success">
              {yearly
                ? `Save ${money(savings)} / year`
                : `${Math.round((savings / (plan.monthly * 12)) * 100)}% less with yearly`}
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-border py-1 text-center">
        {[
          { label: "Seats", value: plan.seats.toLocaleString("en-US"), icon: UsersRound },
          { label: "API / month", value: plan.api.toLocaleString("en-US"), icon: Code2 },
          { label: "Storage", value: `${plan.storage} GB`, icon: Database },
        ].map((item) => (
          <div key={item.label} className="min-w-0 px-1">
            <item.icon size={13} className="mx-auto text-muted" />
            <p className="mt-1 break-words text-label font-medium">{item.value}</p>
            <p className="mt-1 text-tiny text-muted">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 text-tiny">
        <span className="font-medium">Included capabilities</span>
        <span className="text-muted">{plan.features.length} features</span>
      </div>
      <ul className="mt-3 mb-4 flex-1 space-y-2 text-label">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check size={12} className="mt-0.5 shrink-0 text-accent" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="rounded-control border border-border bg-surface-alt p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-tiny text-muted">Active subscribers</p>
            <p className="mt-1 text-lg font-semibold">{subscribers}</p>
          </div>
          <div className="text-right">
            <p className="text-tiny text-muted">MRR contribution</p>
            <p className="mt-1 text-lg font-semibold">{money(mrr)}</p>
          </div>
        </div>
        <div className="mt-2 h-1 rounded-full bg-border">
          <div className="h-full rounded-full bg-accent" style={{ width: `${share}%` }} />
        </div>
        <p className="mt-1 text-right text-tiny text-muted">{share.toFixed(1)}% of portfolio MRR</p>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <Button variant="outline" onClick={onEdit}>
          <Pencil size={12} />
          Edit plan
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onSubscribers}>
            Subscribers
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} aria-label={`Delete ${plan.name}`}>
            <Trash2 size={13} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
