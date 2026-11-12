export const today = "2026-11-01";
export const statuses = ["Active", "Trialing", "Paused", "Canceled"] as const;
export type SubscriptionStatus = (typeof statuses)[number];
export type Plan = {
  id: string;
  name: string;
  description: string;
  monthly: number;
  yearly: number;
  seats: number;
  api: number;
  storage: number;
  features: string[];
  active: boolean;
};
export type Customer = {
  id: string;
  name: string;
  company: string;
  email: string;
  joined: string;
  region: string;
  notes: string;
};
export type Subscription = {
  id: string;
  customerId: string;
  planId: string;
  cycle: "Monthly" | "Yearly";
  status: SubscriptionStatus;
  amount: number;
  created: string;
  renewal: string;
};
export type Movement = {
  id: string;
  subscriptionId: string;
  date: string;
  kind: "New" | "Expansion" | "Contraction" | "Churn" | "Pause" | "Resume" | "Trial";
  before: number;
  after: number;
  planId: string;
  note: string;
};
export type Invoice = {
  id: string;
  subscriptionId: string;
  customerId: string;
  date: string;
  due: string;
  amount: number;
  status: "Paid" | "Open" | "Failed" | "Voided";
  description: string;
};
export type Payment = {
  id: string;
  invoiceId: string;
  date: string;
  amount: number;
  status: "Succeeded" | "Failed" | "Follow-up";
  note: string;
};
export type Usage = {
  id: string;
  customerId: string;
  planId: string;
  date: string;
  activeUsers: number;
  api: number;
  storage: number;
  reports: number;
  automations: number;
  integrations: number;
};
export type SaasData = {
  plans: Plan[];
  customers: Customer[];
  subscriptions: Subscription[];
  movements: Movement[];
  invoices: Invoice[];
  payments: Payment[];
  usage: Usage[];
};
export const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
export const round = (value: number) => Math.round(value * 100) / 100;
export const age = (date: string) => Math.floor((Date.parse(today) - Date.parse(date)) / 86400000);
export const addDays = (date: string, days: number) =>
  new Date(Date.parse(date) + days * 86400000).toISOString().slice(0, 10);
export const rate = (amount: number, cycle: Subscription["cycle"]) =>
  round(cycle === "Yearly" ? amount / 12 : amount);
export const latestDate = (rows: { date: string }[]) =>
  rows
    .map((row) => row.date)
    .sort()
    .at(-1) || "";
