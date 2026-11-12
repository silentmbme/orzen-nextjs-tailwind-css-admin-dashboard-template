import { statuses, type SaasData, type Plan } from "../types";
type Row = Record<string, unknown>;
const str = (value: unknown): value is string => typeof value === "string";
const num = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;
const date = (value: unknown) =>
  str(value) && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value));
const fields = (row: Row, keys: string[]) => keys.every((key) => str(row[key]));
const oneOf = (value: unknown, options: readonly string[]) => str(value) && options.includes(value);
const rows = (value: unknown, check: (row: Row) => boolean) =>
  Array.isArray(value) &&
  value.every((row) => row && typeof row === "object" && check(row)) &&
  new Set(value.map((row) => row.id)).size === value.length;
export function validData(value: unknown): value is SaasData {
  if (!value || typeof value !== "object") return false;
  const d = value as Record<string, unknown>;
  if (
    !rows(
      d.plans,
      (p) =>
        fields(p, ["id", "name", "description"]) &&
        [p.monthly, p.yearly, p.seats, p.api, p.storage].every(num) &&
        [p.seats, p.api].every(Number.isInteger) &&
        typeof p.active === "boolean" &&
        Array.isArray(p.features) &&
        p.features.every(str),
    )
  )
    return false;
  if (
    !rows(
      d.customers,
      (c) => fields(c, ["id", "name", "company", "email", "region", "notes"]) && date(c.joined),
    )
  )
    return false;
  if (
    !rows(
      d.subscriptions,
      (s) =>
        fields(s, ["id", "customerId", "planId"]) &&
        date(s.created) &&
        date(s.renewal) &&
        num(s.amount) &&
        oneOf(s.cycle, ["Monthly", "Yearly"]) &&
        oneOf(s.status, statuses),
    )
  )
    return false;
  if (
    !rows(
      d.movements,
      (m) =>
        fields(m, ["id", "subscriptionId", "planId", "note"]) &&
        date(m.date) &&
        [m.before, m.after].every(num) &&
        oneOf(m.kind, ["New", "Expansion", "Contraction", "Churn", "Pause", "Resume", "Trial"]),
    )
  )
    return false;
  if (
    !rows(
      d.invoices,
      (i) =>
        fields(i, ["id", "subscriptionId", "customerId", "description"]) &&
        date(i.date) &&
        date(i.due) &&
        num(i.amount) &&
        oneOf(i.status, ["Paid", "Open", "Failed", "Voided"]),
    )
  )
    return false;
  if (
    !rows(
      d.payments,
      (p) =>
        fields(p, ["id", "invoiceId", "note"]) &&
        date(p.date) &&
        num(p.amount) &&
        oneOf(p.status, ["Succeeded", "Failed", "Follow-up"]),
    )
  )
    return false;
  if (
    !rows(
      d.usage,
      (u) =>
        fields(u, ["id", "customerId", "planId"]) &&
        date(u.date) &&
        [u.activeUsers, u.api, u.storage, u.reports, u.automations, u.integrations].every(num),
    )
  )
    return false;
  const data = value as SaasData;
  return (
    data.subscriptions.every(
      (s) =>
        data.customers.some((c) => c.id === s.customerId) &&
        data.plans.some((p) => p.id === s.planId),
    ) &&
    data.movements.every(
      (m) =>
        data.subscriptions.some((s) => s.id === m.subscriptionId) &&
        data.plans.some((p) => p.id === m.planId),
    ) &&
    data.invoices.every((i) =>
      data.subscriptions.some((s) => s.id === i.subscriptionId && s.customerId === i.customerId),
    ) &&
    data.payments.every((p) => data.invoices.some((i) => i.id === p.invoiceId)) &&
    data.usage.every(
      (u) =>
        data.customers.some((c) => c.id === u.customerId) &&
        data.plans.some((p) => p.id === u.planId),
    )
  );
}
export function planError(plan: Plan, data: SaasData) {
  if (!plan.name.trim() || !plan.description.trim()) return "Name and description are required.";
  if (
    data.plans.some(
      (p) => p.id !== plan.id && p.name.toLowerCase() === plan.name.trim().toLowerCase(),
    )
  )
    return "Plan name must be unique.";
  if (
    ![plan.monthly, plan.yearly, plan.seats, plan.api, plan.storage].every(
      (v) => Number.isFinite(v) && v > 0,
    ) ||
    !Number.isInteger(plan.seats) ||
    !Number.isInteger(plan.api)
  )
    return "Prices and limits must be positive; seats and API limits must be whole numbers.";
  if (!plan.features.length || plan.features.some((f) => !f.trim()))
    return "Provide at least one plan feature.";
  return "";
}
