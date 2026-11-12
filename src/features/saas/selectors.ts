import { addDays, age, latestDate, round, today, type SaasData, type Subscription } from "./types";
export const palette = ["var(--accent)", "var(--color-trend-up)", "var(--color-trend-down)"];
export function mrrAt(data: SaasData, id: string, date: string) {
  return (
    data.movements
      .filter((m) => m.subscriptionId === id && m.date <= date)
      .sort((a, b) => a.date.localeCompare(b.date))
      .at(-1)?.after || 0
  );
}
export function currentMrr(data: SaasData) {
  return round(data.subscriptions.reduce((sum, sub) => sum + mrrAt(data, sub.id, today), 0));
}
export function revenueMetrics(data: SaasData, days: number) {
  const start = addDays(today, -days),
    events = data.movements.filter((m) => m.date > start && m.date <= today);
  const starting = data.subscriptions.filter((sub) => mrrAt(data, sub.id, start) > 0);
  const opening = round(starting.reduce((sum, sub) => sum + mrrAt(data, sub.id, start), 0));
  const retained = starting.reduce((sum, sub) => sum + mrrAt(data, sub.id, today), 0);
  const fresh = events
    .filter((e) => e.kind === "New" || e.kind === "Resume")
    .reduce((s, e) => s + e.after - e.before, 0);
  const expansion = events
    .filter((e) => e.kind === "Expansion")
    .reduce((s, e) => s + e.after - e.before, 0);
  const contraction = events
    .filter((e) => e.kind === "Contraction" || e.kind === "Pause")
    .reduce((s, e) => s + e.before - e.after, 0);
  const churn = events
    .filter((e) => e.kind === "Churn")
    .reduce((s, e) => s + e.before - e.after, 0);
  return {
    opening,
    closing: currentMrr(data),
    fresh: round(fresh),
    expansion: round(expansion),
    contraction: round(contraction),
    churn: round(churn),
    nrr: opening ? (retained / opening) * 100 : null,
    churnRate: starting.length
      ? (new Set(
          events
            .filter((e) => e.kind === "Churn" && starting.some((s) => s.id === e.subscriptionId))
            .map((e) => e.subscriptionId),
        ).size /
          starting.length) *
        100
      : 0,
    events,
  };
}
export function customerHealth(data: SaasData, id: string) {
  const last = latestDate(data.usage.filter((u) => u.customerId === id && u.activeUsers > 0));
  if (
    data.invoices.some((i) => i.customerId === id && i.status === "Failed") ||
    !last ||
    age(last) > 14
  )
    return "At risk";
  return age(last) > 7 ? "Watch" : "Healthy";
}
export function lifetimeValue(data: SaasData, id: string) {
  return data.invoices
    .filter((i) => i.customerId === id && i.status === "Paid")
    .reduce((s, i) => s + i.amount, 0);
}
export function monthlyUsage(data: SaasData, id: string, days = 30) {
  const rows = data.usage.filter(
    (u) => u.customerId === id && age(u.date) >= 0 && age(u.date) < days,
  );
  return {
    api: rows.reduce((s, u) => s + u.api, 0),
    seats: Math.max(0, ...rows.map((u) => u.activeUsers)),
    storage: rows.sort((a, b) => a.date.localeCompare(b.date)).at(-1)?.storage || 0,
    rows,
  };
}
export function renewalDays(sub: Subscription) {
  return Math.round((Date.parse(sub.renewal) - Date.parse(today)) / 86400000);
}
