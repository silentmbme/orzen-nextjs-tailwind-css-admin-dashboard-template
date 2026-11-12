import Link from "next/link";
import { CalendarClock, CreditCard, HeartPulse } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { SaasTitle, StatusBadge } from "@/features/saas/components/saas-ui";
import { customerHealth, renewalDays } from "@/features/saas/selectors";
import { money, type SaasData } from "@/features/saas/types";
export function SubscriptionOperations({ data }: { data: SaasData }) {
  const renewals = data.subscriptions
    .filter(
      (s) =>
        ["Active", "Trialing"].includes(s.status) && renewalDays(s) >= 0 && renewalDays(s) <= 14,
    )
    .sort((a, b) => a.renewal.localeCompare(b.renewal));
  const failed = data.invoices.filter((i) => i.status === "Failed");
  const risk = data.customers.filter((c) => customerHealth(data, c.id) === "At risk");
  return (
    <div className="grid gap-widget lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <Card
        title={<SaasTitle icon={CalendarClock}>Renewal watchlist</SaasTitle>}
        action={
          <Link href="/apps/saas/subscriptions" className="text-tiny text-accent">
            Subscriptions →
          </Link>
        }
      >
        <div className="mt-2 divide-y divide-border">
          {renewals.map((sub) => {
            const customer = data.customers.find((c) => c.id === sub.customerId)!;
            return (
              <div key={sub.id} className="flex items-center gap-2 py-2.5">
                <UserAvatar name={customer.name} size={28} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-label font-medium">{customer.company}</p>
                  <p className="text-tiny text-muted">
                    {sub.id} · {sub.renewal}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-label font-medium">{money(sub.amount)}</p>
                  <p className="text-tiny text-muted">
                    {renewalDays(sub)}d · {sub.cycle.toLowerCase()}
                  </p>
                </div>
              </div>
            );
          })}
          {!renewals.length && (
            <p className="py-3 text-label text-muted">No renewals in the next 14 days.</p>
          )}
        </div>
      </Card>
      <div className="space-y-widget">
        <Card title={<SaasTitle icon={CreditCard}>Collection exceptions</SaasTitle>}>
          <p className="mt-3 text-kpi font-semibold">
            {money(failed.reduce((s, i) => s + i.amount, 0))}
          </p>
          <p className="mt-1 text-label text-muted">{failed.length} failed invoices · all dates</p>
          <Link href="/apps/saas/billing" className="mt-3 inline-block text-label text-accent">
            Review billing queue →
          </Link>
        </Card>
        <Card title={<SaasTitle icon={HeartPulse}>Account health</SaasTitle>}>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <StatusBadge status="At risk" />
            <strong className="text-lg font-semibold">{risk.length} accounts</strong>
          </div>
          <p className="mt-2 text-tiny text-muted">
            Failed invoice, no activity, or last activity over 14 days ago. This rule is
            illustrative.
          </p>
          <Link href="/apps/saas/customers" className="mt-3 inline-block text-label text-accent">
            Inspect customer health →
          </Link>
        </Card>
      </div>
    </div>
  );
}
