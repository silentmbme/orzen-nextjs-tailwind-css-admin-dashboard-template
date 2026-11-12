"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, CreditCard, MessageSquare, Users } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { MarketingContainer } from "@/components/marketing/marketing-container";
const steps = [
  {
    title: "Understand the account",
    label: "01 / Context",
    icon: CreditCard,
    description: "A subscription, an invoice, a fuller picture.",
    href: "/apps/saas/billing",
    action: "Explore billing",
  },
  {
    title: "Bring the right people in",
    label: "02 / Collaboration",
    icon: Users,
    description: "One handover. No missing context.",
    href: "/apps/saas/customers",
    action: "Meet the customers",
  },
  {
    title: "Make the next move",
    label: "03 / Momentum",
    icon: MessageSquare,
    description: "A clear owner and a considered next step.",
    href: "/apps/tasks",
    action: "Open the task board",
  },
];
export function WorkflowSection() {
  const [active, setActive] = useState(0);
  const step = steps[active];
  return (
    <section id="solutions" className="saas-workflow-scene border-y border-border py-16 sm:py-24">
      <MarketingContainer>
        <div className="grid items-center gap-8 lg:grid-cols-[.9fr_1.3fr]">
          <div>
            <p className="marketing-eyebrow">Clarity becomes momentum</p>
            <h2 className="marketing-heading">
              From a signal
              <br />
              to a shared next step.
            </h2>
            <div role="group" aria-label="Workflow stages" className="mt-8 grid gap-2">
              {steps.map(({ title, label, icon: Icon, description }, index) => (
                <button
                  type="button"
                  key={title}
                  aria-pressed={active === index}
                  onClick={() => setActive(index)}
                  className={`group flex items-start gap-3 rounded-lg border p-4 text-start transition-colors focus-visible:outline-2 focus-visible:outline-accent ${active === index ? "border-accent/35 bg-surface" : "border-transparent hover:bg-surface/60"}`}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${active === index ? "border-accent/20 bg-accent/10 text-accent" : "border-border text-muted"}`}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="flex-1">
                    <span className="text-[9px] uppercase tracking-wider text-muted">{label}</span>
                    <span className="mt-1 block text-[15px] font-medium">{title}</span>
                    <span className="mt-1 block text-[11px] text-muted">{description}</span>
                  </span>
                  <ArrowUpRight size={13} className="mt-2 text-muted" />
                </button>
              ))}
            </div>
          </div>
          <div className="saas-workflow-stage relative overflow-hidden rounded-2xl border border-border bg-surface-alt p-5 sm:p-8">
            <div className="absolute inset-0 opacity-30 saas-scene-grid" aria-hidden="true" />
            <div className="relative mb-6 flex items-center justify-between">
              <span className="text-[10px] font-medium text-muted">ORZEN / CONNECTED WORK</span>
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-2 py-1 text-[9px] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Local preview
              </span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0.7, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.7, y: -8 }}
                transition={{ duration: 0.25 }}
                className="relative min-h-[335px]"
              >
                {active === 0 && (
                  <>
                    <div className="saas-invoice-sheet mx-auto max-w-sm rounded-xl border border-border bg-surface p-6">
                      <div className="flex items-center justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-lg bg-accent/10 text-accent">
                          <CreditCard size={22} />
                        </span>
                        <span className="text-[10px] text-muted">ACCOUNT / 001</span>
                      </div>
                      <p className="mt-6 text-[25px] font-medium tracking-tight">Orbit Labs</p>
                      <p className="mt-1 text-[11px] text-muted">Growth workspace / Monthly</p>
                      <div className="my-6 flex items-center justify-between border-y border-border py-4">
                        <span className="text-[11px] text-muted">Subscription status</span>
                        <span className="flex items-center gap-1.5 text-[11px] text-accent">
                          <Check size={13} />
                          Active
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] text-muted">
                        <span>Plan context</span>
                        <span>Invoice history</span>
                        <span>Customer profile</span>
                      </div>
                    </div>
                    <div className="saas-float mx-auto -mt-2 flex max-w-[260px] items-center gap-2 rounded-lg border border-border bg-surface p-3">
                      <Check size={14} className="text-accent" />
                      <p className="text-[10px]">The context you need, already connected.</p>
                    </div>
                  </>
                )}
                {active === 1 && (
                  <div className="mx-auto max-w-sm rounded-xl border border-border bg-surface p-5">
                    <div className="mb-6 flex items-center gap-3">
                      <UserAvatar name="Priya Shah" size={38} />
                      <div>
                        <p className="text-[13px] font-medium">Customer success</p>
                        <p className="text-[10px] text-muted">Shared account context</p>
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-surface-alt p-4">
                      <p className="text-[11px] leading-6">
                        Orbit Labs is ready for a renewal conversation. The account and billing
                        context are in one place.
                      </p>
                    </div>
                    <div className="my-5 flex items-center justify-center gap-3">
                      <UserAvatar name="Alex Morgan" size={32} />
                      <span className="saas-handoff-line h-px w-12 bg-accent" />
                      <ArrowRight size={16} className="text-accent" />
                      <span className="saas-handoff-line h-px w-12 bg-accent" />
                      <UserAvatar name="Priya Shah" size={32} />
                    </div>
                    <p className="border-t border-border pt-4 text-center text-[10px] text-muted">
                      An illustrative handover, with the human still in control.
                    </p>
                  </div>
                )}
                {active === 2 && (
                  <div className="mx-auto max-w-sm rounded-xl border border-border bg-surface p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-muted">
                        Next action
                      </span>
                      <span className="rounded bg-accent/10 px-2 py-1 text-[9px] text-accent">
                        Ready for review
                      </span>
                    </div>
                    <h3 className="text-[24px] font-medium leading-tight tracking-tight">
                      Make the next conversation count.
                    </h3>
                    <div className="my-6 grid gap-3">
                      {[
                        "Review the customer context",
                        "Agree on the next step",
                        "Keep the team informed",
                      ].map((text, index) => (
                        <div key={text} className="flex items-center gap-2 text-[11px]">
                          <span
                            className={`grid h-5 w-5 place-items-center rounded border ${index === 0 ? "border-accent bg-accent/10 text-accent" : "border-border"}`}
                          >
                            {index === 0 && <Check size={11} />}
                          </span>
                          {text}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 border-t border-border pt-4">
                      <UserAvatar name="Sofia Garcia" size={25} />
                      <span className="text-[10px] text-muted">
                        A visible owner. A shared outcome.
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
              <span className="text-[9px] text-muted">
                Illustrative workflow · no automation executed
              </span>
              <Link
                href={step.href}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-accent"
              >
                {step.action}
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
