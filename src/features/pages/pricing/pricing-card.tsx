import { Check, Database, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BillingPeriod, Plan } from "./pricing-data";

export function PricingCard({
  plan,
  period,
  selected,
  onSelect,
}: {
  plan: Plan;
  period: BillingPeriod;
  selected: boolean;
  onSelect: () => void;
}) {
  const featured = plan.id === "professional";
  const monthlyEquivalent = period === "yearly" ? (plan.yearly ?? 0) / 12 : plan.monthly;
  return (
    <article
      className={`relative flex min-w-0 flex-col overflow-hidden rounded-[9px] border bg-surface ${featured ? "border-accent" : "border-card-border"}`}
    >
      {featured && <div className="h-[3px] bg-accent" aria-hidden="true" />}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex min-h-6 items-start justify-between gap-2">
          <h3 className="text-[14px] font-semibold">{plan.name}</h3>
          {featured && (
            <Badge className="border-accent/20 bg-accent/10 text-accent">Recommended</Badge>
          )}
        </div>
        <p className="mt-2 min-h-12 text-[11px] leading-[1.5] text-muted">{plan.description}</p>
        <div
          className={`mt-4 min-h-[92px] border-y border-border py-3 ${featured ? "bg-accent/[.035]" : ""}`}
        >
          {plan.monthly === null ? (
            <>
              <strong className="text-[24px] font-semibold tracking-tight">Custom</strong>
              <span className="mt-1 block text-[10px] text-muted">
                Built around your organization
              </span>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-baseline gap-1">
                <strong className="text-[26px] font-semibold tracking-tight">
                  ${Number(monthlyEquivalent).toFixed(period === "yearly" ? 2 : 0)}
                </strong>
                <span className="text-[10px] text-muted">/ month equivalent</span>
              </div>
              <span className="mt-1 block text-[10px] text-muted">
                {period === "yearly"
                  ? `$${plan.yearly} billed annually · save $${plan.monthly * 12 - (plan.yearly ?? 0)} / year`
                  : `$${plan.monthly} billed monthly`}
              </span>
            </>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 border-b border-border py-3 text-[10px]">
          <span className="inline-flex items-center gap-1.5">
            <UsersRound size={12} className="text-accent" />
            {plan.seats}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Database size={12} className="text-blue-500" />
            {plan.storage}
          </span>
        </div>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[.04em]">
          Included features
        </p>
        <ul className="mt-2 mb-5 flex-1 space-y-2">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-[11px] leading-4">
              <Check size={12} className="mt-0.5 shrink-0 text-accent" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          variant={featured ? "primary" : "outline"}
          className="w-full"
          aria-pressed={selected}
          onClick={onSelect}
        >
          {selected
            ? "Selected for preview"
            : plan.id === "enterprise"
              ? "Preview contact sales"
              : `Preview ${plan.name}`}
        </Button>
      </div>
    </article>
  );
}
