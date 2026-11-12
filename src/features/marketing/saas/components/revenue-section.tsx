"use client";
import { useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Check, ArrowUpRight } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { MarketingContainer, HeroAction } from "@/components/marketing/marketing-container";
import { seed } from "@/features/saas/seed";
import { mrrAt, revenueMetrics } from "@/features/saas/selectors";
import { addDays, money, today } from "@/features/saas/types";
import { AnimatedMetric } from "./experience-motion";
export function RevenueSection() {
  const [days, setDays] = useState(30);
  const [filter, setFilter] = useState("all");
  const reduce = useReducedMotion();
  const metrics = revenueMetrics(seed, days);
  const points = Array.from({ length: 12 }, (_, index) => {
    const date = addDays(today, -Math.round(days * (1 - index / 11)));
    return {
      date,
      label: new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
        month: "short",
        ...(days < 365 ? { day: "numeric" as const } : {}),
        timeZone: "UTC",
      }),
      mrr: seed.subscriptions.reduce((sum, sub) => sum + mrrAt(seed, sub.id, date), 0),
    };
  });
  const events = metrics.events.filter(
    (event) =>
      filter === "all" ||
      (filter === "growth" ? event.after > event.before : event.after < event.before),
  );
  return (
    <section id="revenue" className="saas-revenue border-y border-border py-14 sm:py-20">
      <MarketingContainer>
        <div className="grid items-center gap-8 lg:grid-cols-[.85fr_1.3fr]">
          <div>
            <p className="marketing-eyebrow">01 / Revenue intelligence</p>
            <h2 className="marketing-heading">
              Know where growth
              <br />
              is really coming from.
            </h2>
            <p className="mt-4 max-w-md text-[13px] leading-7 text-muted">
              Follow the revenue. See the reason. Choose the next move.
            </p>
            <ul className="my-6 grid gap-3">
              {[
                "Three windows. One clear trend.",
                "Real movements from the demo ledger.",
                "Every signal leads somewhere useful.",
              ].map((text) => (
                <li key={text} className="flex items-start gap-2 text-[12px]">
                  <Check size={13} className="mt-0.5 shrink-0 text-accent" />
                  {text}
                </li>
              ))}
            </ul>
            <HeroAction href="/dashboards/saas" secondary>
              Explore revenue analytics
            </HeroAction>
          </div>
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] text-muted">
                The existing subscription ledger, brought to life
              </span>
              <Select
                aria-label="Marketing revenue window"
                value={days}
                onChange={(event) => setDays(Number(event.target.value))}
              >
                <option value={30}>Monthly · 30 days</option>
                <option value={90}>Quarterly · 90 days</option>
                <option value={365}>Yearly · 365 days</option>
              </Select>
            </div>
            <Card
              title="Recurring revenue"
              action={<span className="text-[10px] text-muted">Last {days} days</span>}
              className="saas-preview-shadow p-4!"
            >
              <div className="my-4 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[9px] text-muted">Closing MRR</p>
                  <p className="mt-1 text-[23px] font-semibold tracking-tight">
                    <AnimatedMetric value={metrics.closing} />
                  </p>
                </div>
                <div className="border-l border-border pl-3">
                  <p className="text-[9px] text-muted">Opening MRR</p>
                  <p className="mt-1 text-[16px] font-medium">
                    <AnimatedMetric value={metrics.opening} />
                  </p>
                </div>
                <div className="border-l border-border pl-3">
                  <p className="text-[9px] text-muted">Net movement</p>
                  <p className="mt-1 text-[16px] font-medium text-accent">
                    <AnimatedMetric value={metrics.closing - metrics.opening} />
                  </p>
                </div>
              </div>
              <div className="h-[230px] min-w-0" role="region" aria-label="Recurring revenue chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={points} margin={{ left: -18, right: 8, top: 10 }}>
                    <defs>
                      <linearGradient id="marketing-revenue-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 5" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "var(--muted)", fontSize: 9 }}
                      minTickGap={20}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "var(--muted)", fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<ChartTooltip currency />} />
                    <Area
                      dataKey="mrr"
                      name="Recurring revenue"
                      type="stepAfter"
                      stroke="var(--accent)"
                      strokeWidth={2}
                      fill="url(#marketing-revenue-fill)"
                      isAnimationActive={!reduce}
                      animationDuration={400}
                      activeDot={{
                        r: 5,
                        stroke: "var(--surface)",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {["all", "growth", "loss"].map((value) => (
                  <Button
                    key={value}
                    size="sm"
                    variant={filter === value ? "secondary" : "ghost"}
                    aria-pressed={filter === value}
                    onClick={() => setFilter(value)}
                  >
                    {value === "all" ? "All events" : value === "growth" ? "Growth" : "Loss"}
                  </Button>
                ))}
              </div>
              <div
                tabIndex={0}
                role="region"
                aria-label="Revenue movement events"
                className="mt-2 max-h-24 overflow-y-auto rounded focus-visible:outline-2 focus-visible:outline-accent"
              >
                {events
                  .slice()
                  .reverse()
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex justify-between gap-2 border-t border-border py-2 text-[10px]"
                    >
                      <span className="text-muted">
                        {event.subscriptionId} · {event.kind}
                      </span>
                      <span>
                        {event.after >= event.before ? "+" : ""}
                        {money(event.after - event.before)}
                      </span>
                    </div>
                  ))}
                {events.length === 0 && (
                  <p className="py-3 text-[10px] text-muted">
                    No movement events in this selection.
                  </p>
                )}
              </div>
            </Card>
            <p className="mt-3 flex items-center gap-1 text-[9px] text-muted">
              <ArrowUpRight size={11} />
              Period values and chart history are calculated from the same fictional ledger.
            </p>
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
