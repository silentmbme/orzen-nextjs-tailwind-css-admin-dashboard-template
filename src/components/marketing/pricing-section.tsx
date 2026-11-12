"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeroAction } from "./marketing-container";
export type MarketingPlan = {
  name: string;
  monthly: number;
  description: string;
  features: string[];
  featured?: boolean;
};
export function PricingSection({
  plans,
  demo,
  unit = "workspace",
}: {
  plans: MarketingPlan[];
  demo: string;
  unit?: string;
}) {
  const [yearly, setYearly] = useState(false);
  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center gap-3">
        <div
          className="flex rounded-lg border border-border bg-surface-alt p-1"
          role="group"
          aria-label="Billing period"
        >
          <Button
            size="sm"
            variant={yearly ? "ghost" : "default"}
            aria-pressed={!yearly}
            onClick={() => setYearly(false)}
          >
            Monthly
          </Button>
          <Button
            size="sm"
            variant={yearly ? "default" : "ghost"}
            aria-pressed={yearly}
            onClick={() => setYearly(true)}
          >
            Yearly
          </Button>
        </div>
        <span className="text-[11px] text-muted">Yearly billing saves 20% · demo pricing</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.featured ? "border-accent! bg-accent/5! p-6!" : "p-6!"}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[15px] font-semibold">{plan.name}</h3>
              {plan.featured && (
                <span className="rounded bg-accent/10 px-2 py-1 text-[9px] font-medium text-accent">
                  Most flexible
                </span>
              )}
            </div>
            <p className="mt-2 min-h-10 text-[12px] leading-5 text-muted">{plan.description}</p>
            <p className="my-5 flex items-end gap-1">
              <strong className="text-[36px] font-medium tracking-tight">
                ${yearly ? Math.round(plan.monthly * 0.8) : plan.monthly}
              </strong>
              <span className="pb-2 text-[11px] text-muted">/ {unit} / mo</span>
            </p>
            <p className="mb-5 text-[10px] text-muted" aria-live="polite">
              {yearly ? `$${Math.round(plan.monthly * 0.8) * 12} billed yearly` : "Billed monthly"}
            </p>
            <HeroAction href={demo} secondary={!plan.featured}>
              Try the demo
            </HeroAction>
            <ul className="mt-6 grid gap-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-[12px]">
                  <Check size={13} className="shrink-0 text-accent" />
                  {feature}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <p className="mt-4 text-[10px] text-muted">
        Illustrative plans only. No subscription, trial billing, or payment is created.
      </p>
    </div>
  );
}
