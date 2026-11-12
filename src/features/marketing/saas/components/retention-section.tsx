"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight, HeartPulse, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { MarketingContainer } from "@/components/marketing/marketing-container";
import { saasDashboardData } from "@/features/dashboards/saas/data";
import { customerHealth } from "@/features/saas/selectors";
import { seed } from "@/features/saas/seed";
export function RetentionSection() {
  const { cohorts } = saasDashboardData(seed);
  const [counts, setCounts] = useState(false);
  const [selected, setSelected] = useState("");
  const [health, setHealth] = useState("Healthy");
  const [detail, setDetail] = useState(
    "Select a cohort cell to inspect the relationship behind the rate.",
  );
  const reduce = useReducedMotion();
  const customers = seed.customers.filter(
    (customer) => customerHealth(seed, customer.id) === health,
  );
  return (
    <section id="retention" className="py-14 sm:py-20">
      <MarketingContainer>
        <div className="mb-8 grid items-end gap-6 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="marketing-eyebrow">02 / Customer retention</p>
            <h2 className="marketing-heading">
              Growth means more
              <br />
              when customers stay.
            </h2>
          </div>
          <div>
            <p className="text-[13px] leading-7 text-muted">
              Know who stays. See who needs a conversation.
            </p>
            <Link
              href="/apps/saas/customers"
              className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-accent"
            >
              Explore customer relationships
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
        <div className="grid items-start gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="min-w-0 rounded-xl border border-border bg-surface-alt p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-[12px] font-medium">Paid cohort retention</h3>
              <Button size="sm" onClick={() => setCounts((value) => !value)}>
                {counts ? "Show percentages" : "Show counts"}
              </Button>
            </div>
            <div
              tabIndex={0}
              role="region"
              aria-label="Retention cohort table"
              className="overflow-x-auto rounded focus-visible:outline-2 focus-visible:outline-accent"
            >
              <table className="w-full min-w-[400px] border-separate border-spacing-1 text-center text-[10px]">
                <thead className="text-muted">
                  <tr>
                    <th className="text-start font-normal">First paid</th>
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <th key={index} className="font-normal">
                        M{index}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cohorts.map((cohort, row) => (
                    <tr
                      key={cohort.month}
                      className={selected.startsWith(cohort.month) ? "bg-accent/5" : ""}
                    >
                      <th className="text-start text-[9px] font-medium">{cohort.month}</th>
                      {Array.from({ length: 6 }, (_, index) => {
                        const cell = cohort.values[index];
                        const id = `${cohort.month}-${index}`;
                        return (
                          <td key={index}>
                            {cell && cell.rate !== null ? (
                              <motion.button
                                initial={false}
                                whileInView={reduce ? undefined : { opacity: [0.7, 1] }}
                                viewport={{ once: true }}
                                transition={{
                                  delay: row * 0.025 + index * 0.015,
                                  duration: 0.3,
                                }}
                                type="button"
                                aria-pressed={selected === id}
                                aria-label={`${cohort.month} month ${index}: ${cell.rate.toFixed(0)} percent retained`}
                                onClick={() => {
                                  setSelected(id);
                                  setDetail(
                                    `${cohort.month} cohort: ${cell.retained} of ${cohort.count} customers retained (${cell.rate!.toFixed(0)}%).`,
                                  );
                                }}
                                className={`w-full rounded-sm border border-accent/10 py-3 text-[10px] font-medium ${selected === id ? "outline-2 outline-offset-1 outline-accent" : ""}`}
                                style={{
                                  background: `color-mix(in srgb,var(--accent) ${Math.max(6, cell.rate * 0.36)}%,var(--surface))`,
                                }}
                              >
                                {counts ? cell.retained : `${cell.rate.toFixed(0)}%`}
                              </motion.button>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p role="status" className="mt-4 min-h-10 text-[10px] leading-5 text-muted">
              {detail}
            </p>
            <p className="mt-2 border-t border-border pt-3 text-[9px] leading-5 text-muted">
              Existing demo ledger · paid retention at completed month-end · cohort sizes are
              intentionally small.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="rounded-xl border border-border p-4">
              <h3 className="flex items-center gap-2 text-[12px] font-medium">
                <HeartPulse size={15} className="text-accent" />
                Customer health
              </h3>
              <div
                role="group"
                aria-label="Customer health filter"
                className="my-4 flex flex-wrap gap-1"
              >
                {["Healthy", "Watch", "At risk"].map((value) => (
                  <Button
                    key={value}
                    size="sm"
                    variant={health === value ? "secondary" : "ghost"}
                    aria-pressed={health === value}
                    onClick={() => setHealth(value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
              <div className="grid gap-3">
                {customers.slice(0, 3).map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center gap-2 border-t border-border pt-3"
                  >
                    <UserAvatar name={customer.name} size={28} />
                    <div>
                      <p className="text-[11px] font-medium">{customer.company}</p>
                      <p className="text-[9px] text-muted">{customer.name}</p>
                    </div>
                    <span className="ms-auto text-[9px] text-muted">{health}</span>
                  </div>
                ))}
                {customers.length === 0 && (
                  <p className="py-4 text-[11px] text-muted">No demo customers in this category.</p>
                )}
              </div>
              <p className="mt-4 text-[9px] text-muted">
                Health derives from demo usage and invoice status.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-surface-alt p-4">
                <Users size={16} className="mb-2 text-accent" />
                <p className="text-[26px] font-medium">{cohorts.length}</p>
                <p className="mt-1 text-[10px] text-muted">acquisition cohorts</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-[10px] text-muted">Customer milestone</p>
                <p className="mt-2 text-[26px] font-medium">
                  {cohorts.reduce((sum, cohort) => sum + cohort.count, 0)}
                </p>
                <p className="mt-1 text-[10px] text-muted">paid cohort members</p>
              </div>
            </div>
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
