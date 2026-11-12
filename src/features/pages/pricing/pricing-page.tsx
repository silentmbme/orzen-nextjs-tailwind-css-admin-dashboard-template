"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Code2,
  Database,
  Headset,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShowcaseCard as Card } from "@/components/ui/showcase-card";
import { FeatureComparison } from "./feature-comparison";
import { PricingCard } from "./pricing-card";
import { faq, plans, type BillingPeriod, type PlanId } from "./pricing-data";

const usage = [
  {
    icon: Code2,
    name: "API requests",
    included: "10,000 requests / month",
    rate: "$4 per extra 10,000",
    accent: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: Database,
    name: "Additional storage",
    included: "100 GB with Professional",
    rate: "$2 per extra 10 GB / month",
    accent: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: UsersRound,
    name: "Extra team seats",
    included: "10 seats with Professional",
    rate: "$6 per additional seat / month",
    accent: "bg-rose-500/10 text-rose-500",
  },
];

export function PricingPage() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const [selected, setSelected] = useState<PlanId | null>(null);
  const [salesPreview, setSalesPreview] = useState(false);

  return (
    <div className="grid min-w-0 gap-widget">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <PageHeader title="Simple, flexible pricing" />
          <p className="mt-1 max-w-xl text-[11px] text-muted">
            Choose the workspace capacity that fits your team. Prices and actions are illustrative
            template content.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label="Billing period"
            className="inline-flex rounded-lg border border-border bg-surface p-1"
          >
            <button
              type="button"
              aria-pressed={period === "monthly"}
              onClick={() => setPeriod("monthly")}
              className={`rounded-md px-3 py-1.5 text-[11px] font-medium focus-visible:outline-2 focus-visible:outline-accent ${period === "monthly" ? "bg-accent text-white" : "text-muted hover:bg-surface-alt"}`}
            >
              Monthly
            </button>
            <button
              type="button"
              aria-pressed={period === "yearly"}
              onClick={() => setPeriod("yearly")}
              className={`rounded-md px-3 py-1.5 text-[11px] font-medium focus-visible:outline-2 focus-visible:outline-accent ${period === "yearly" ? "bg-accent text-white" : "text-muted hover:bg-surface-alt"}`}
            >
              Yearly
            </button>
          </div>
          <Badge tone="success">Save 16.7%</Badge>
        </div>
      </div>

      {selected && (
        <div
          role="status"
          className="flex flex-wrap items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 text-[11px]"
        >
          <Check size={13} className="text-accent" />
          <span>
            <b>{plans.find((plan) => plan.id === selected)?.name}</b> selected for preview. No
            subscription was created.
          </span>
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="ml-auto text-accent underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-accent"
          >
            Clear
          </button>
        </div>
      )}

      <section aria-labelledby="subscription-heading">
        <div className="mb-3">
          <h2 id="subscription-heading" className="text-[14px] font-semibold">
            Subscription plans
          </h2>
          <p className="mt-0.5 text-[11px] text-muted">
            Four ways to shape the same workspace around your team.
          </p>
        </div>
        <div className="grid items-stretch gap-widget sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              period={period}
              selected={selected === plan.id}
              onSelect={() => setSelected(plan.id)}
            />
          ))}
        </div>
      </section>

      <FeatureComparison />

      <Card title="Usage beyond your plan" icon={Code2}>
        <div className="grid gap-0 divide-y divide-border">
          {usage.map((item) => (
            <div
              key={item.name}
              className="grid gap-2 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-4"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-md ${item.accent}`}
                >
                  <item.icon size={14} />
                </span>
                <b className="text-[11px]">{item.name}</b>
              </div>
              <span className="text-[11px] text-muted">Included: {item.included}</span>
              <span className="text-[11px] font-medium sm:text-right">{item.rate}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 border-t border-border pt-3 text-[10px] text-muted">
          Illustrative usage allowances and rates only; no usage is metered here.
        </p>
      </Card>

      <section
        aria-labelledby="enterprise-heading"
        className="relative grid min-w-0 gap-5 overflow-hidden rounded-[9px] border border-card-border bg-surface p-5 md:grid-cols-[1.15fr_.85fr] md:items-center"
      >
        <div className="absolute right-0 top-0 h-full w-1 bg-accent" aria-hidden="true" />
        <div>
          <Badge className="border-accent/20 bg-accent/10 text-accent">
            Tailored to your organization
          </Badge>
          <h2 id="enterprise-heading" className="mt-3 text-[18px] font-semibold">
            Enterprise, on your terms
          </h2>
          <p className="mt-2 max-w-xl text-[12px] leading-5 text-muted">
            Bring together custom capacity, security requirements, and dedicated guidance. Pricing
            is set through a tailored agreement.
          </p>
          <Button variant="dark" className="mt-4" onClick={() => setSalesPreview(true)}>
            Preview contact sales <ArrowRight size={13} />
          </Button>
          {salesPreview && (
            <p role="status" className="mt-2 text-[10px] text-muted">
              Contact Sales is a demo action; no sales request was sent.
            </p>
          )}
        </div>
        <div className="grid gap-2 border-t border-border pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
          {[
            { icon: ShieldCheck, label: "Advanced security and governance" },
            { icon: Headset, label: "Dedicated success support" },
            { icon: Code2, label: "Custom integrations and API guidance" },
            { icon: UsersRound, label: "Onboarding for your organization" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 rounded-md bg-surface-alt px-3 py-2.5 text-[11px]"
            >
              <item.icon size={14} className="shrink-0 text-accent" />
              {item.label}
            </div>
          ))}
        </div>
      </section>

      <Card title="Pricing questions" icon={Headset}>
        <div className="divide-y divide-border">
          {faq.map((item) => (
            <details key={item.question} className="group py-3 first:pt-0 last:pb-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[12px] font-medium focus-visible:outline-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown
                  size={14}
                  className="shrink-0 text-muted transition-transform motion-reduce:transition-none group-open:rotate-180"
                />
              </summary>
              <p className="max-w-3xl pt-2 text-[11px] leading-5 text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-3 border-t border-border pt-3 text-[10px] text-muted">
          Plans, rates, and answers are illustrative template content.
        </p>
      </Card>
    </div>
  );
}
