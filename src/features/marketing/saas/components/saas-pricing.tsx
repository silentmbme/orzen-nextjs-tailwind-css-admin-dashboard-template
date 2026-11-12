"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Building2,
  Check,
  Database,
  Layers3,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { AnimatedMetric } from "./experience-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeroAction, MarketingContainer } from "@/components/marketing/marketing-container";
import { seed } from "@/features/saas/seed";

const planDetails = [
  {
    icon: Layers3,
    eyebrow: "Build your foundation",
    description: "A focused home for your first team.",
  },
  {
    icon: TrendingUp,
    eyebrow: "Find your momentum",
    description: "More context. More room to grow together.",
  },
  {
    icon: Building2,
    eyebrow: "Expand your possibilities",
    description: "A wider view for your next chapter.",
  },
];
const format = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export function SaasPricing() {
  const [yearly, setYearly] = useState(false);
  const savingPercent =
    Math.round((1 - seed.plans[1].yearly / (seed.plans[1].monthly * 12)) * 1000) / 10;
  return (
    <section
      id="pricing"
      className="relative isolate overflow-hidden border-y border-border bg-surface-alt py-16 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background:radial-gradient(ellipse_at_50%_0%,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_65%)]"
      />
      <MarketingContainer>
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <p className="marketing-eyebrow flex items-center gap-2">
              <span className="h-px w-6 bg-accent" />
              Simple plans. A clear starting point.
            </p>
            <h2 className="marketing-heading">
              The right room
              <br className="hidden sm:block" /> to grow
              <span className="text-accent">.</span>
            </h2>
            <p className="mt-4 text-[12px] leading-6 text-muted">
              Choose your next chapter. Explore with illustrative demo pricing.
            </p>
          </div>
          <div className="self-start lg:self-auto">
            <div className="mb-2.5 flex items-center justify-between gap-5 text-[10px]">
              <span className="font-medium">Your billing, your rhythm</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-accent/20 bg-accent/10 px-2 py-1 font-medium text-accent">
                <Sparkles size={10} />
                Save {savingPercent}% yearly
              </span>
            </div>
            <div
              role="group"
              aria-label="Billing period"
              className="flex min-w-[260px] rounded-lg border border-border bg-surface-alt p-1"
            >
              {[
                { label: "Monthly", value: false },
                { label: "Yearly", value: true },
              ].map((option) => (
                <Button
                  key={option.label}
                  aria-label={option.label}
                  size="sm"
                  variant="ghost"
                  aria-pressed={yearly === option.value}
                  onClick={() => setYearly(option.value)}
                  className="relative flex-1 border-transparent! bg-transparent! py-2!"
                >
                  {yearly === option.value && (
                    <motion.span
                      layoutId="saas-pricing-cycle"
                      className="absolute inset-0 rounded-md border border-border bg-surface"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 ${yearly === option.value ? "text-foreground" : "text-muted"}`}
                  >
                    {option.label}
                  </span>
                  {option.value && (
                    <span className="relative z-10 ms-1 text-[9px] text-muted">2 months free</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid items-stretch gap-4 md:grid-cols-3">
          {seed.plans.map((plan, index) => {
            const featured = index === 1;
            const { icon: Icon, eyebrow, description } = planDetails[index];
            const savings = plan.monthly * 12 - plan.yearly;
            return (
              <Card
                key={plan.id}
                className={`group relative overflow-hidden p-0! ${featured ? "saas-night border-accent/50!" : "bg-surface!"}`}
              >
                {featured && (
                  <div aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-accent" />
                )}
                <div className="p-5 lg:p-6">
                  <div className="mb-5 flex items-center justify-between gap-2">
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-xl border transition-transform group-hover:-translate-y-0.5 ${featured ? "border-accent/25 bg-accent/10 text-accent" : "border-border bg-surface-alt text-foreground"}`}
                    >
                      <Icon size={21} strokeWidth={1.6} />
                    </span>
                    {featured ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-accent/25 bg-accent/10 px-2 py-1 text-[9px] font-medium text-accent">
                        <Sparkles size={10} />
                        Recommended
                      </span>
                    ) : (
                      <span className="text-[9px] text-muted">0{index + 1}</span>
                    )}
                  </div>
                  <p className="mb-1 text-[9px] uppercase tracking-[.1em] text-muted">{eyebrow}</p>
                  <h3 className="text-[21px] font-medium tracking-tight">{plan.name}</h3>
                  <p className="mt-2 min-h-10 text-[11px] leading-5 text-muted">{description}</p>
                  <div className="mb-5 mt-3">
                    <p className="flex items-baseline gap-1">
                      <strong className="text-[38px] font-medium tracking-[-.05em]">
                        <AnimatedMetric value={yearly ? plan.yearly / 12 : plan.monthly} />
                      </strong>
                      <span className="text-[10px] text-muted">/ month</span>
                    </p>
                    <p aria-live="polite" className="mt-1 text-[10px] text-muted">
                      {yearly ? `$${plan.yearly} billed yearly` : "Billed monthly"}
                    </p>
                    <p
                      className={`mt-2 min-h-4 text-[9px] ${yearly ? "text-accent" : "text-muted"}`}
                    >
                      {yearly
                        ? `${format(savings)} less than 12 monthly payments`
                        : "Switch to yearly for two months free"}
                    </p>
                  </div>
                  <div className="[&_a]:w-full">
                    <HeroAction href="/apps/saas/plans" secondary={!featured}>
                      Explore {plan.name}
                    </HeroAction>
                  </div>
                  <div className="my-5 grid grid-cols-2 divide-x divide-border rounded-lg border border-border bg-surface-alt/40">
                    <div className="p-3">
                      <Users size={13} className="mb-1.5 text-muted" />
                      <p className="text-[12px] font-medium">{plan.seats} members</p>
                      <p className="mt-0.5 text-[9px] text-muted">Team capacity</p>
                    </div>
                    <div className="p-3">
                      <Database size={13} className="mb-1.5 text-muted" />
                      <p className="text-[12px] font-medium">{plan.storage} GB</p>
                      <p className="mt-0.5 text-[9px] text-muted">Demo storage</p>
                    </div>
                  </div>
                  <p className="mb-3 text-[9px] font-medium uppercase tracking-wider text-muted">
                    The essentials, included
                  </p>
                  <ul className="grid gap-3">
                    {plan.features.slice(0, 3).map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-[11px]">
                        <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                          <Check size={10} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={17} className="shrink-0 text-accent" />
            <div>
              <p className="text-[11px] font-medium">Explore first. Decide with context.</p>
              <p className="mt-0.5 text-[9px] text-muted">
                Demo plans only. No account, subscription, or payment is created.
              </p>
            </div>
          </div>
          <Link
            href="/apps/saas/plans"
            className="flex items-center gap-1.5 text-[11px] font-medium text-accent"
          >
            Compare plan details
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </MarketingContainer>
    </section>
  );
}
