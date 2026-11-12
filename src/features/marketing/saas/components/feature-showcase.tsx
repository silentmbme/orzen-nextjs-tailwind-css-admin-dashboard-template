"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  CreditCard,
  Layers3,
  ReceiptText,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { MarketingContainer } from "@/components/marketing/marketing-container";
import { seed } from "@/features/saas/seed";
import { money } from "@/features/saas/types";
import { revenueMetrics } from "@/features/saas/selectors";
import { saasDashboardData } from "@/features/dashboards/saas/data";
const views = [
  {
    id: "subscriptions",
    label: "Subscriptions",
    icon: Layers3,
    title: "Every account. A clear next chapter.",
    href: "/apps/saas/subscriptions",
  },
  {
    id: "revenue",
    label: "Revenue",
    icon: TrendingUp,
    title: "See the movement behind the momentum.",
    href: "/dashboards/saas",
  },
  {
    id: "billing",
    label: "Billing",
    icon: ReceiptText,
    title: "A better view of what comes next.",
    href: "/apps/saas/billing",
  },
];
export function FeatureShowcase() {
  const [active, setActive] = useState(0);
  const view = views[active];
  const revenue = revenueMetrics(seed, 30);
  const { trend } = saasDashboardData(seed);
  const maximum = Math.max(...trend.map((point) => point.mrr), 1);
  return (
    <section id="features" className="saas-night saas-feature-scene relative py-16 sm:py-24">
      <MarketingContainer>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="marketing-eyebrow">The clarity layer</p>
            <h2 className="marketing-heading">
              Complex business.
              <br />
              <span className="text-accent">Considered software.</span>
            </h2>
          </div>
          <div
            role="group"
            aria-label="Feature scene"
            className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface/50 p-1"
          >
            {views.map(({ label, icon: Icon }, index) => (
              <button
                type="button"
                key={label}
                aria-pressed={active === index}
                onClick={() => setActive(index)}
                className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-[11px] font-medium focus-visible:outline-2 focus-visible:outline-accent ${active === index ? "bg-accent/15 text-accent" : "text-muted hover:bg-surface-alt"}`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div data-saas-stagger className="grid items-stretch gap-4 lg:grid-cols-[1.6fr_1fr]">
          <Card
            className="saas-visual-card relative overflow-hidden p-0!"
            onPointerMove={(event) => {
              const box = event.currentTarget.getBoundingClientRect();
              event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - box.left}px`);
              event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - box.top}px`);
            }}
          >
            <div className="relative z-10 flex items-center justify-between border-b border-border px-5 py-4">
              <span className="flex items-center gap-2 text-[11px]">
                <Sparkles size={14} className="text-accent" />
                Orzen intelligence
              </span>
              <span className="rounded-full border border-border px-2 py-1 text-[9px] text-muted">
                Live product concept
              </span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={view.id}
                initial={{ opacity: 0.7, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.7, y: -6 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 min-h-[330px] p-5 sm:p-7"
              >
                <p className="mb-5 text-[19px] font-medium tracking-tight">{view.title}</p>
                {active === 0 && (
                  <>
                    <div className="mb-5 flex items-center justify-between rounded-lg border border-border bg-surface/70 p-4">
                      <div>
                        <p className="text-[9px] text-muted">Subscription lifecycle</p>
                        <p className="mt-2 text-[25px] font-medium">A relationship in motion.</p>
                      </div>
                      <CreditCard size={29} className="shrink-0 text-accent" />
                    </div>
                    <div className="mb-5 flex items-center gap-2 text-[9px] text-muted">
                      <span className="rounded-full border border-border px-3 py-1.5">Trial</span>
                      <ArrowRight size={12} />
                      <span className="rounded-full bg-accent/15 px-3 py-1.5 text-accent">
                        Active
                      </span>
                      <ArrowRight size={12} />
                      <span className="rounded-full border border-border px-3 py-1.5">Renewal</span>
                    </div>
                    {seed.subscriptions.slice(0, 3).map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between gap-2 border-t border-border py-3 text-[11px]"
                      >
                        <span>
                          {
                            seed.customers.find((customer) => customer.id === sub.customerId)
                              ?.company
                          }
                        </span>
                        <span className="text-muted">
                          {seed.plans.find((plan) => plan.id === sub.planId)?.name}
                        </span>
                        <span className="rounded bg-accent/10 px-2 py-1 text-[9px]">
                          {sub.status}
                        </span>
                      </div>
                    ))}
                  </>
                )}
                {active === 1 && (
                  <>
                    <div className="flex items-baseline justify-between">
                      <p className="text-[38px] font-medium tracking-tight">
                        {money(revenue.closing)}
                      </p>
                      <p className="text-[10px] text-accent">
                        {money(revenue.closing - revenue.opening)} net movement
                      </p>
                    </div>
                    <div
                      className="mt-6 flex h-[180px] items-end gap-3"
                      role="img"
                      aria-label="Monthly recurring revenue from the existing demo ledger"
                    >
                      {trend.map((point, index) => (
                        <div
                          key={point.name}
                          className="flex h-full flex-1 flex-col justify-end gap-2"
                        >
                          <div
                            className="saas-bar-rise min-h-1 rounded-t-md bg-accent"
                            style={{
                              height: `${(point.mrr / maximum) * 90}%`,
                              opacity: 0.35 + index * 0.09,
                              animationDelay: `${index * 0.06}s`,
                            }}
                          />
                          <span className="text-center text-[9px] text-muted">{point.name}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {active === 2 && (
                  <div className="grid items-center gap-5 sm:grid-cols-[.75fr_1fr]">
                    <div className="saas-invoice-sheet rounded-lg border border-border bg-surface p-5">
                      <ReceiptText size={24} className="mb-7 text-accent" />
                      <p className="text-[9px] text-muted">{seed.invoices[0].id}</p>
                      <p className="mt-2 text-[26px] font-medium">
                        {money(seed.invoices[0].amount)}
                      </p>
                      <div className="my-5 grid gap-2" aria-hidden="true">
                        <span className="h-1 w-full rounded bg-border" />
                        <span className="h-1 w-3/4 rounded bg-border" />
                        <span className="h-1 w-1/2 rounded bg-border" />
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-1 text-[9px] text-accent">
                        <Check size={10} />
                        {seed.invoices[0].status}
                      </span>
                    </div>
                    <div className="grid gap-3">
                      {seed.invoices.slice(0, 3).map((invoice) => (
                        <div key={invoice.id} className="rounded-lg border border-border p-3">
                          <p className="flex justify-between text-[11px]">
                            <span>{invoice.id}</span>
                            <span>{money(invoice.amount)}</span>
                          </p>
                          <p className="mt-2 text-[9px] text-muted">
                            {invoice.status} / demo invoice
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <Link
              href={view.href}
              className="relative z-10 flex items-center justify-between border-t border-border px-5 py-4 text-[11px] font-medium text-accent"
            >
              Explore {view.label.toLowerCase()}
              <ArrowUpRight size={14} />
            </Link>
          </Card>
          <div className="grid gap-4">
            <Card className="saas-visual-card overflow-hidden p-5! sm:p-6!">
              <p className="text-[10px] font-medium text-accent">RELATIONSHIPS, NOT JUST RECORDS</p>
              <h3 className="mt-3 text-[23px] font-medium leading-tight tracking-tight">
                A human behind
                <br />
                every number.
              </h3>
              <div className="relative my-6 flex h-24 items-center justify-center">
                <span className="saas-orbit-ring absolute h-24 w-24 rounded-full border border-dashed border-accent/30" />
                <span className="absolute h-16 w-16 rounded-full border border-border" />
                <UserAvatar name="Priya Shah" size={40} />
                <span className="saas-float absolute left-[12%] top-0">
                  <UserAvatar name="Alex Morgan" size={27} />
                </span>
                <span className="saas-float-delayed absolute right-[12%] bottom-0">
                  <UserAvatar name="Sofia Garcia" size={27} />
                </span>
              </div>
              <p className="text-center text-[10px] text-muted">
                Finance. Success. Operations. One shared view.
              </p>
            </Card>
            <Card className="p-5! sm:p-6!">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium text-accent">RETENTION SIGNALS</p>
                <span className="saas-pulse h-1.5 w-1.5 rounded-full bg-accent" />
              </div>
              <h3 className="mt-3 text-[23px] font-medium tracking-tight">See who stays.</h3>
              <div className="mt-5 grid grid-cols-6 gap-1" aria-hidden="true">
                {Array.from({ length: 18 }, (_, index) => (
                  <span
                    key={index}
                    className="h-5 rounded-sm"
                    style={{
                      background: `color-mix(in srgb,var(--accent) ${60 - index * 2}%,var(--surface))`,
                    }}
                  />
                ))}
              </div>
              <Link
                href="#retention"
                className="mt-4 inline-flex items-center gap-1 text-[10px] text-accent"
              >
                Explore the cohorts
                <ArrowUpRight size={11} />
              </Link>
            </Card>
          </div>
        </div>
        <p className="mt-4 text-[9px] text-muted">
          Actual product concepts, fictional records. Choose a view to explore.
        </p>
      </MarketingContainer>
    </section>
  );
}
