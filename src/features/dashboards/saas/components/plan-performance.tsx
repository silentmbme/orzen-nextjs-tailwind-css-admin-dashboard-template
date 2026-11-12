import Link from "next/link";
import { Layers3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SaasTitle } from "@/features/saas/components/saas-ui";
import { currentMrr, mrrAt, palette } from "@/features/saas/selectors";
import { money, today, type SaasData } from "@/features/saas/types";
export function PlanPerformance({ data }: { data: SaasData }) {
  const total = currentMrr(data);
  return (
    <Card
      title={<SaasTitle icon={Layers3}>Plan performance</SaasTitle>}
      action={
        <Link href="/apps/saas/plans" className="text-tiny text-accent">
          Manage →
        </Link>
      }
    >
      <div className="mt-3 space-y-4">
        {data.plans.map((plan, index) => {
          const subs = data.subscriptions.filter(
              (s) => s.planId === plan.id && s.status === "Active",
            ),
            mrr = subs.reduce((sum, sub) => sum + mrrAt(data, sub.id, today), 0);
          return (
            <div key={plan.id}>
              <div className="flex items-center justify-between gap-2 text-label">
                <span className="flex items-center gap-2 font-medium">
                  <i className="h-2 w-2 rounded-sm" style={{ background: palette[index % 3] }} />
                  {plan.name}
                </span>
                <strong className="font-medium">{money(mrr)}</strong>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-surface-alt">
                <div
                  className="h-full rounded-full"
                  style={{
                    background: palette[index % 3],
                    width: `${total ? (mrr / total) * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="mt-1 flex justify-between text-tiny text-muted">
                <span>{subs.length} active subscribers</span>
                <span>{total ? ((mrr / total) * 100).toFixed(0) : 0}% of MRR</span>
              </p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3 text-label">
        <div>
          <p className="text-tiny text-muted">Plan upgrades · all dates</p>
          <strong>{data.movements.filter((m) => m.kind === "Expansion").length}</strong>
        </div>
        <div>
          <p className="text-tiny text-muted">Plan downgrades · all dates</p>
          <strong>{data.movements.filter((m) => m.kind === "Contraction").length}</strong>
        </div>
      </div>
    </Card>
  );
}
