import {
  addDays,
  rate,
  round,
  today,
  type SaasData,
  type Subscription,
  type Movement,
} from "./types";
const plans: SaasData["plans"] = [
  {
    id: "starter",
    name: "Starter",
    description: "For focused teams getting started.",
    monthly: 29,
    yearly: 290,
    seats: 5,
    api: 10000,
    storage: 20,
    features: ["Core workspace", "Reports", "Email support"],
    active: true,
  },
  {
    id: "growth",
    name: "Growth",
    description: "For connected teams scaling their workflow.",
    monthly: 79,
    yearly: 790,
    seats: 20,
    api: 50000,
    storage: 100,
    features: ["Core workspace", "Reports", "Automations", "Integrations", "Priority support"],
    active: true,
  },
  {
    id: "scale",
    name: "Scale",
    description: "For organizations with advanced requirements.",
    monthly: 199,
    yearly: 1990,
    seats: 100,
    api: 200000,
    storage: 500,
    features: [
      "Core workspace",
      "Reports",
      "Automations",
      "Integrations",
      "Audit history",
      "Priority support",
    ],
    active: true,
  },
];
const names = [
  "Olivia Martin",
  "Jackson Lee",
  "Sophia Brown",
  "Noah Williams",
  "Emma Davis",
  "Liam Wilson",
  "Ava Taylor",
  "Lucas Clark",
  "Mia Anderson",
  "Ethan Thomas",
  "Isabella Moore",
  "James White",
];
const companies = [
  "Orbit Labs",
  "Forma Studio",
  "Northstar",
  "Summit Retail",
  "Cedar Systems",
  "Atlas Cloud",
  "Pixel Works",
  "Bridge & Co",
  "Linear Space",
  "Kite Digital",
  "Evergreen",
  "Beacon AI",
];
const customers = names.map((name, i) => ({
  id: `cus-${i + 1}`,
  name,
  company: companies[i],
  email: `${name.toLowerCase().replaceAll(" ", ".")}@example.com`,
  joined: `2026-${String(5 + (i % 6)).padStart(2, "0")}-05`,
  region: ["North America", "Europe", "Asia Pacific"][i % 3],
  notes: i === 1 ? "Interested in additional automation capacity next quarter." : "",
}));
const movements: Movement[] = [];
const subscriptions: Subscription[] = customers.map((customer, i) => {
  const initial = plans[i % 3],
    cycle = i === 5 ? ("Yearly" as const) : ("Monthly" as const);
  let plan = initial,
    status: Subscription["status"] = "Active",
    amount = cycle === "Yearly" ? initial.yearly : initial.monthly;
  const id = `SUB-${1001 + i}`;
  const trial = i >= 10;
  const initialMrr = trial ? 0 : rate(amount, cycle);
  movements.push({
    id: `mv-${i}-new`,
    subscriptionId: id,
    date: customer.joined,
    kind: trial ? "Trial" : "New",
    before: 0,
    after: initialMrr,
    planId: initial.id,
    note: trial ? "Trial workspace opened" : "Subscription started",
  });
  if (trial) status = "Trialing";
  if (i === 0 || i === 3) {
    plan = plans[1];
    amount = plan.monthly;
    movements.push({
      id: `mv-${i}-up`,
      subscriptionId: id,
      date: "2026-10-12",
      kind: "Expansion",
      before: initialMrr,
      after: amount,
      planId: plan.id,
      note: "Upgraded to Growth",
    });
  }
  if (i === 2) {
    plan = plans[1];
    amount = plan.monthly;
    movements.push({
      id: "mv-2-down",
      subscriptionId: id,
      date: "2026-10-18",
      kind: "Contraction",
      before: initialMrr,
      after: amount,
      planId: plan.id,
      note: "Downgraded to Growth",
    });
  }
  if (i === 7) {
    status = "Paused";
    movements.push({
      id: "mv-7-pause",
      subscriptionId: id,
      date: "2026-10-22",
      kind: "Pause",
      before: initialMrr,
      after: 0,
      planId: plan.id,
      note: "Workspace subscription paused",
    });
  }
  if (i === 8 || i === 9) {
    status = "Canceled";
    movements.push({
      id: `mv-${i}-churn`,
      subscriptionId: id,
      date: i === 8 ? "2026-09-20" : "2026-10-25",
      kind: "Churn",
      before: initialMrr,
      after: 0,
      planId: plan.id,
      note: "Subscription canceled",
    });
  }
  return {
    id,
    customerId: customer.id,
    planId: plan.id,
    cycle,
    status,
    amount,
    created: customer.joined,
    renewal: cycle === "Yearly" ? "2027-10-05" : `2026-11-${String(3 + i * 2).padStart(2, "0")}`,
  };
});
const invoices: SaasData["invoices"] = [];
for (const sub of subscriptions) {
  for (let month = 5; month <= 10; month++) {
    const date = `2026-${String(month).padStart(2, "0")}-05`;
    if (date < sub.created || (sub.cycle === "Yearly" && date !== sub.created)) continue;
    const event = movements
      .filter((m) => m.subscriptionId === sub.id && m.date <= date)
      .sort((a, b) => a.date.localeCompare(b.date))
      .at(-1);
    if (!event || !event.after) continue;
    const amount =
      sub.cycle === "Yearly" ? plans.find((p) => p.id === event.planId)!.yearly : event.after;
    const status =
      month === 10 && ["SUB-1002", "SUB-1007"].includes(sub.id)
        ? ("Failed" as const)
        : month === 10 && sub.id === "SUB-1004"
          ? ("Open" as const)
          : ("Paid" as const);
    invoices.push({
      id: `INV-${invoices.length + 2001}`,
      subscriptionId: sub.id,
      customerId: sub.customerId,
      date,
      due: addDays(date, 14),
      amount,
      status,
      description: `${plans.find((p) => p.id === event.planId)!.name} · ${sub.cycle.toLowerCase()} subscription`,
    });
  }
}
const payments = invoices
  .filter((invoice) => invoice.status !== "Open")
  .map((invoice, i) => ({
    id: `pay-${i + 1}`,
    invoiceId: invoice.id,
    date: invoice.date,
    amount: invoice.amount,
    status: invoice.status === "Paid" ? ("Succeeded" as const) : ("Failed" as const),
    note: invoice.status === "Paid" ? "Seeded demo collection" : "Demo payment attempt failed",
  }));
const usage: SaasData["usage"] = [];
customers.forEach((customer, i) => {
  for (let day = 1; day <= 90; day++) {
    const date = addDays(today, -day);
    const event = movements
      .filter((m) => m.subscriptionId === subscriptions[i].id && m.date <= date)
      .sort((a, b) => a.date.localeCompare(b.date))
      .at(-1);
    if (
      date < customer.joined ||
      !event ||
      (!event.after && subscriptions[i].status !== "Trialing") ||
      (i === 4 && day < 18)
    )
      continue;
    const plan = plans.find((p) => p.id === event.planId)!;
    const active = (day + i) % 7 !== 0;
    usage.push({
      id: `use-${i}-${day}`,
      customerId: customer.id,
      planId: plan.id,
      date,
      activeUsers: active
        ? Math.max(1, Math.floor(plan.seats * (0.15 + ((day + i) % 5) * 0.08)))
        : 0,
      api: active ? (250 + i * 29 + (day % 9) * 31) * ((i % 3) + 1) : 0,
      storage: round(plan.storage * (0.1 + (i % 4) * 0.12)),
      reports: active ? (day + i) % 8 : 0,
      automations: active && plan.id !== "starter" ? (day + i) % 5 : 0,
      integrations: active && plan.id !== "starter" ? (day + i) % 3 : 0,
    });
  }
});
export const seed: SaasData = {
  plans,
  customers,
  subscriptions,
  movements,
  invoices,
  payments,
  usage,
};
