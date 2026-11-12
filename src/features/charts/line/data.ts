export type RevenuePoint = { label: string; revenue: number; previous: number; target: number };
export type Period = "7 days" | "30 days" | "90 days" | "12 months";
const make = (labels: string[], base: number, step: number): RevenuePoint[] =>
  labels.map((label, index) => ({
    label,
    revenue: Math.round(base + index * step + [0, 620, -240, 880, 260, 1040, 510][index % 7]),
    previous: Math.round(base * 0.91 + index * step * 0.82 + [180, -160, 240, 40, -120][index % 5]),
    target: Math.round(base * 1.04 + index * step * 0.94),
  }));
export const revenueData: Record<Period, RevenuePoint[]> = {
  "7 days": make(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], 7200, 430),
  "30 days": make(["1", "4", "7", "10", "13", "16", "19", "22", "25", "28"], 18400, 1100),
  "90 days": make(
    ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"],
    42000,
    2400,
  ),
  "12 months": make(
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    68000,
    6200,
  ),
};
export const trafficData = [
  { label: "Jan", organic: 42, paid: 28, referral: 18, direct: 24 },
  { label: "Feb", organic: 48, paid: 31, referral: 21, direct: 25 },
  { label: "Mar", organic: 45, paid: 38, referral: 19, direct: 29 },
  { label: "Apr", organic: 56, paid: 35, referral: 26, direct: 31 },
  { label: "May", organic: 62, paid: 42, referral: 29, direct: 34 },
  { label: "Jun", organic: 68, paid: 46, referral: 31, direct: 39 },
  { label: "Jul", organic: 73, paid: 43, referral: 36, direct: 41 },
  { label: "Aug", organic: 79, paid: 51, referral: 39, direct: 45 },
];
export const techniqueData = [
  { label: "Jan", actual: 34, compare: 29, target: 40, forecast: 34, low: 30, high: 39, rate: 120 },
  { label: "Feb", actual: 42, compare: 34, target: 42, forecast: 42, low: 37, high: 47, rate: 138 },
  { label: "Mar", actual: 38, compare: 39, target: 44, forecast: 38, low: 33, high: 44, rate: 129 },
  { label: "Apr", actual: 55, compare: 43, target: 46, forecast: 55, low: 49, high: 62, rate: 158 },
  { label: "May", actual: 61, compare: 48, target: 48, forecast: 61, low: 54, high: 69, rate: 171 },
  { label: "Jun", actual: 68, compare: 54, target: 50, forecast: 68, low: 60, high: 77, rate: 186 },
  { label: "Jul", actual: 72, compare: 59, target: 52, forecast: 76, low: 65, high: 88, rate: 201 },
  { label: "Aug", actual: 81, compare: 64, target: 54, forecast: 85, low: 71, high: 99, rate: 218 },
];
export const businessSeries = {
  subscribers: [1200, 1380, 1610, 1890, 2240, 2710, 3260, 3890],
  orders: [420, 510, 470, 620, 690, 760, 710, 840],
  conversion: [18, 21, 20, 25, 27, 31, 30, 34],
  latency: [420, 390, 405, 360, 338, 315, 302, 286],
};
