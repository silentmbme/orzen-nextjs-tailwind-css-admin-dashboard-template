import { seed } from "./seed";
import { validData } from "./schemas/validation";
import { mrrAt } from "./selectors";
import { rate, today, type SaasData, type Subscription, type Movement } from "./types";
const key = "nova-saas-demo-v1";
const initial = { data: seed, warning: "" };
let snapshot = initial,
  initialized = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());
function load() {
  try {
    const raw = localStorage.getItem(key),
      parsed: unknown = raw ? JSON.parse(raw) : structuredClone(seed);
    if (!validData(parsed)) throw new Error();
    snapshot = { data: parsed, warning: "" };
  } catch {
    snapshot = {
      data: structuredClone(seed),
      warning:
        "Saved SaaS demo data could not be read. Showing the original dataset; the next save replaces it.",
    };
  }
}
export const saasStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    if (!initialized) {
      initialized = true;
      load();
      queueMicrotask(notify);
      window.addEventListener("storage", (event) => {
        if (event.key === key) {
          load();
          notify();
        }
      });
    }
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => snapshot,
  getServerSnapshot: () => initial,
  update(change: (data: SaasData) => void) {
    try {
      const data = structuredClone(snapshot.data);
      change(data);
      if (!validData(data)) throw new Error("The change contains invalid demo data.");
      let warning = "";
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch {
        warning =
          "Storage is unavailable or full. These changes are retained for this session only.";
      }
      snapshot = { data, warning };
      notify();
      return "";
    } catch (error) {
      return error instanceof Error ? error.message : "The change could not be saved.";
    }
  },
};
export function saveSubscription(input: Subscription) {
  return saasStore.update((data) => {
    const old = data.subscriptions.find((s) => s.id === input.id),
      plan = data.plans.find((p) => p.id === input.planId);
    if (!plan || !data.customers.some((c) => c.id === input.customerId))
      throw new Error("Select a valid customer and plan.");
    if ((!old && !plan.active) || (old && old.planId !== plan.id && !plan.active))
      throw new Error("New subscriptions and plan changes require an active plan.");
    if (!input.renewal || input.renewal < today || !Number.isFinite(Date.parse(input.renewal)))
      throw new Error("Renewal must be on or after the demo date, Nov 1, 2026.");
    if (old && old.status !== "Trialing" && input.status === "Trialing")
      throw new Error("An existing paid or paused subscription cannot return to trial.");
    if (old?.status === "Canceled" && input.status !== "Canceled")
      throw new Error("Canceled subscriptions cannot be resumed. Create a new subscription.");
    const amount =
      old && old.planId === input.planId && old.cycle === input.cycle
        ? old.amount
        : input.cycle === "Yearly"
          ? plan.yearly
          : plan.monthly;
    const saved = {
      ...input,
      amount,
      id: old?.id || `SUB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      created: old?.created || today,
    };
    const before = old ? mrrAt(data, old.id, today) : 0,
      after = saved.status === "Active" ? rate(amount, saved.cycle) : 0;
    let kind: Movement["kind"] =
      after > before
        ? old
          ? before === 0
            ? "Resume"
            : "Expansion"
          : "New"
        : saved.status === "Canceled"
          ? "Churn"
          : saved.status === "Paused"
            ? "Pause"
            : saved.status === "Trialing"
              ? "Trial"
              : "Contraction";
    if (old?.status === "Trialing" && saved.status === "Active") kind = "New";
    const index = data.subscriptions.findIndex((s) => s.id === saved.id);
    if (index >= 0) data.subscriptions[index] = saved;
    else data.subscriptions.unshift(saved);
    if (!old || before !== after || old.status !== saved.status || old.planId !== saved.planId)
      data.movements.push({
        id: crypto.randomUUID(),
        subscriptionId: saved.id,
        planId: saved.planId,
        date: today,
        kind,
        before,
        after,
        note: old
          ? `${old.status} → ${saved.status}; ${plan.name} (${saved.cycle})`
          : `Created ${plan.name} subscription`,
      });
  });
}
export function exportCsv(name: string, rows: Record<string, string | number>[]) {
  const keys = Object.keys(rows[0] || {}),
    quote = (v: unknown) =>
      `"${String(v ?? "")
        .replace(/^[=+@-]/, "'$&")
        .replaceAll('"', '""')}"`;
  const url = URL.createObjectURL(
    new Blob(
      [
        [keys, ...rows.map((r) => keys.map((k) => r[k]))]
          .map((r) => r.map(quote).join(","))
          .join("\r\n"),
      ],
      { type: "text/csv;charset=utf-8" },
    ),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${name}-demo.csv`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
