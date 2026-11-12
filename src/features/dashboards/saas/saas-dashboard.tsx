"use client";
import { useState } from "react";
import Link from "next/link";
import { Clock3, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SaasWorkspace } from "@/features/saas/components/saas-workspace";
import { SaasTitle, StatusBadge } from "@/features/saas/components/saas-ui";
import { useSaas } from "@/features/saas/hooks/use-saas";
import { exportCsv } from "@/features/saas/demo-service";
import { revenueMetrics } from "@/features/saas/selectors";
import { money } from "@/features/saas/types";
import { saasDashboardData } from "./data";
import { SubscriptionOverview } from "./components/subscription-overview";
import { RevenueMovement } from "./components/revenue-movement";
import { RetentionHeatmap } from "./components/retention-heatmap";
import { PlanPerformance } from "./components/plan-performance";
import { SubscriptionOperations } from "./components/subscription-operations";
export function SaasDashboard() {
  const { data } = useSaas(),
    [period, setPeriod] = useState("30");
  const view = saasDashboardData(data),
    metrics = revenueMetrics(data, Number(period));
  return (
    <SaasWorkspace
      title="SaaS command center"
      description="Recurring growth, paid retention and the next subscription decisions."
      actions={
        <>
          <Select
            aria-label="Revenue window"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {[30, 90, 180].map((n) => (
              <option key={n} value={n}>
                Last {n} days
              </option>
            ))}
          </Select>
          <Button
            variant="dark"
            onClick={() =>
              exportCsv("saas-mrr", [
                {
                  days: Number(period),
                  opening: metrics.opening,
                  newMrr: metrics.fresh,
                  expansion: metrics.expansion,
                  contraction: metrics.contraction,
                  churned: metrics.churn,
                  closing: metrics.closing,
                },
              ])
            }
          >
            <Download size={13} />
            Export snapshot
          </Button>
        </>
      }
    >
      <div className="grid items-stretch gap-widget xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <SubscriptionOverview data={data} days={Number(period)} trend={view.trend} />
        <RevenueMovement data={data} days={Number(period)} />
      </div>
      <div className="grid items-stretch gap-widget xl:grid-cols-[minmax(0,1fr)_320px]">
        <RetentionHeatmap cohorts={view.cohorts} />
        <PlanPerformance data={data} />
      </div>
      <SubscriptionOperations data={data} />
      <Card
        title={<SaasTitle icon={Clock3}>Recent subscriptions</SaasTitle>}
        action={
          <Link href="/apps/saas/subscriptions" className="text-tiny text-accent">
            Manage workspace →
          </Link>
        }
      >
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {[...data.subscriptions]
            .sort((a, b) => b.created.localeCompare(a.created))
            .slice(0, 4)
            .map((sub) => (
              <div key={sub.id} className="rounded-control border border-border bg-surface-alt p-3">
                <div className="flex justify-between gap-2 text-label">
                  <span className="font-medium">{sub.id}</span>
                  <StatusBadge status={sub.status} />
                </div>
                <p className="mt-3 text-label">
                  {data.customers.find((c) => c.id === sub.customerId)?.company}
                </p>
                <p className="mt-1 text-tiny text-muted">
                  {data.plans.find((p) => p.id === sub.planId)?.name} · {money(sub.amount)} /{" "}
                  {sub.cycle.toLowerCase()}
                </p>
                <p className="mt-2 text-tiny text-muted">Created {sub.created}</p>
              </div>
            ))}
        </div>
      </Card>
    </SaasWorkspace>
  );
}
