export type Period = "weekly" | "monthly" | "yearly";
export type DateRange = "current" | "previous";
export const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
export const palette = {
  purple: "var(--accent)",
  blue: "var(--sales-blue)",
  coral: "var(--sales-coral)",
  pink: "var(--sales-pink)",
};
const monthly = [72, 82, 96, 91, 115, 124, 136, 142, 129, 151, 166, 181];
const weekly = [18, 24, 21, 31, 36, 42, 28];
const yearly = [720, 860, 1030, 1180, 1312];
export function getRevenue(period: Period, range: DateRange) {
  const values = period === "weekly" ? weekly : period === "yearly" ? yearly : monthly;
  const labels =
    period === "weekly"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : period === "yearly"
        ? ["2022", "2023", "2024", "2025", "2026"]
        : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const scale =
    period === "monthly" ? 1312400 / monthly.reduce((sum, value) => sum + value, 0) : 1000;
  const series = values.map((value, i) => ({
    label: labels[i],
    revenue: Math.round(value * scale * (range === "previous" ? 0.89 : 1)),
    target: Math.round(
      value * scale * (i % 3 === 0 ? 1.12 : 0.94) * (range === "previous" ? 0.92 : 1),
    ),
  }));
  if (period === "monthly")
    series[series.length - 1].revenue +=
      Math.round(1312400 * (range === "previous" ? 0.89 : 1)) -
      series.reduce((sum, point) => sum + point.revenue, 0);
  return series;
}
export const channels = [
  { name: "Website", value: 736284, color: palette.coral },
  { name: "Marketplace", value: 387158, color: palette.blue },
  { name: "Retail store", value: 188958, color: palette.pink },
];
export const productSales = [
  { label: "Mon", units: 114 },
  { label: "Tue", units: 152 },
  { label: "Wed", units: 98 },
  { label: "Thu", units: 196 },
  { label: "Fri", units: 174 },
  { label: "Sat", units: 221 },
  { label: "Sun", units: 168 },
];
export type Order = { id: string; customer: string; amount: number; status: string };
export const orders: Order[] = [
  { id: "NV-1088", customer: "Olivia Martin", amount: 338, status: "Paid" },
  { id: "NV-1087", customer: "Jackson Lee", amount: 129, status: "Pending" },
  { id: "NV-1086", customer: "Sophia Brown", amount: 480, status: "Paid" },
  { id: "NV-1085", customer: "Noah Williams", amount: 89, status: "Refunded" },
  { id: "NV-1084", customer: "Emma Davis", amount: 258, status: "Paid" },
  { id: "NV-1083", customer: "Liam Wilson", amount: 169, status: "Pending" },
  { id: "NV-1082", customer: "Ava Taylor", amount: 420, status: "Paid" },
  { id: "NV-1081", customer: "Lucas Clark", amount: 199, status: "Paid" },
];
export const topProducts = [
  {
    name: "Wireless headset",
    category: "Audio & accessories",
    units: 386,
    revenue: 65234,
    icon: "headphones",
  },
  { name: "Portable speaker", category: "Home audio", units: 284, revenue: 36636, icon: "speaker" },
  { name: "Studio controller", category: "Gaming", units: 231, revenue: 18480, icon: "gamepad" },
  { name: "Smart watch", category: "Wearables", units: 198, revenue: 39402, icon: "watch" },
];
export const regions = [
  { name: "North America", revenue: 482400, change: "+8.2%" },
  { name: "Europe", revenue: 393600, change: "+6.4%" },
  { name: "Asia Pacific", revenue: 288700, change: "+12.1%" },
  { name: "Other regions", revenue: 147700, change: "+3.7%" },
];
export const team = [
  {
    name: "Alex Morgan",
    role: "Enterprise sales",
    image: "/images/sales-team/alex-morgan.webp",
    revenue: 86400,
    target: 90000,
  },
  {
    name: "Priya Shah",
    role: "Account executive",
    image: "/images/sales-team/priya-shah.webp",
    revenue: 79200,
    target: 80000,
  },
  {
    name: "Daniel Kim",
    role: "Sales specialist",
    image: "/images/sales-team/daniel-kim.webp",
    revenue: 64800,
    target: 75000,
  },
  {
    name: "Sofia Garcia",
    role: "Account executive",
    image: "/images/sales-team/sofia-garcia.webp",
    revenue: 57600,
    target: 70000,
  },
];

export type Invoice = {
  id: string;
  customer: string;
  company: string;
  issued: string;
  due: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
};
export const invoices: Invoice[] = [
  {
    id: "INV-2026-1088",
    customer: "Olivia Martin",
    company: "Acme Studio",
    issued: "2026-10-29",
    due: "2026-11-12",
    amount: 2340,
    status: "Paid",
  },
  {
    id: "INV-2026-1087",
    customer: "Jackson Lee",
    company: "Northstar Digital",
    issued: "2026-10-28",
    due: "2026-11-11",
    amount: 1850,
    status: "Pending",
  },
  {
    id: "INV-2026-1086",
    customer: "Sophia Brown",
    company: "Orbit Creative",
    issued: "2026-10-27",
    due: "2026-11-10",
    amount: 4200,
    status: "Paid",
  },
  {
    id: "INV-2026-1085",
    customer: "Noah Williams",
    company: "Evergreen Labs",
    issued: "2026-10-16",
    due: "2026-10-30",
    amount: 960,
    status: "Overdue",
  },
  {
    id: "INV-2026-1084",
    customer: "Emma Davis",
    company: "Forma Design",
    issued: "2026-10-25",
    due: "2026-11-08",
    amount: 3120,
    status: "Paid",
  },
  {
    id: "INV-2026-1083",
    customer: "Liam Wilson",
    company: "Summit Works",
    issued: "2026-10-24",
    due: "2026-11-07",
    amount: 1680,
    status: "Pending",
  },
  {
    id: "INV-2026-1082",
    customer: "Ava Taylor",
    company: "Brightside Co.",
    issued: "2026-10-23",
    due: "2026-11-06",
    amount: 2450,
    status: "Paid",
  },
  {
    id: "INV-2026-1081",
    customer: "Lucas Clark",
    company: "Atlas Commerce",
    issued: "2026-10-14",
    due: "2026-10-28",
    amount: 780,
    status: "Overdue",
  },
];
