import { mrrAt } from "@/features/saas/selectors";
import { today, type SaasData } from "@/features/saas/types";
export const months = ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10", "2026-11"];
export const monthEnd = (month: string) => {
  const [year, value] = month.split("-").map(Number);
  return new Date(Date.UTC(year, value, 0)).toISOString().slice(0, 10);
};
export function saasDashboardData(data: SaasData) {
  const trend = months.map((month) => ({
    name: new Date(`${month}-01T12:00:00Z`).toLocaleDateString("en-US", {
      month: "short",
      timeZone: "UTC",
    }),
    mrr: data.subscriptions.reduce(
      (sum, sub) => sum + mrrAt(data, sub.id, monthEnd(month) > today ? today : monthEnd(month)),
      0,
    ),
  }));
  const cohorts = months.slice(0, 6).map((month) => {
    const members = data.customers.filter((customer) =>
      data.movements
        .filter(
          (m) =>
            m.after > 0 &&
            data.subscriptions.some(
              (s) => s.customerId === customer.id && s.id === m.subscriptionId,
            ),
        )
        .sort((a, b) => a.date.localeCompare(b.date))[0]
        ?.date.startsWith(month),
    );
    const startIndex = months.indexOf(month);
    return {
      month,
      count: members.length,
      values: months.slice(startIndex, 6).map((end) => {
        const retained = members.filter((customer) =>
          data.subscriptions.some(
            (sub) => sub.customerId === customer.id && mrrAt(data, sub.id, monthEnd(end)) > 0,
          ),
        ).length;
        return {
          month: end,
          retained,
          rate: members.length ? (retained / members.length) * 100 : null,
        };
      }),
    };
  });
  return { trend, cohorts };
}
