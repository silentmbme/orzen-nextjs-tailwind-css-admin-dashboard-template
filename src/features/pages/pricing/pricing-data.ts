export type BillingPeriod = "monthly" | "yearly";
export type PlanId = "starter" | "professional" | "business" | "enterprise";
export type Plan = {
  id: PlanId;
  name: string;
  description: string;
  monthly: number | null;
  yearly: number | null;
  seats: string;
  storage: string;
  features: string[];
};

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "A focused workspace for a small team getting started.",
    monthly: 12,
    yearly: 120,
    seats: "3 seats",
    storage: "10 GB",
    features: ["3 team seats", "10 GB shared storage", "Core dashboards", "Email support"],
  },
  {
    id: "professional",
    name: "Professional",
    description: "More room to collaborate and turn work into insight.",
    monthly: 29,
    yearly: 290,
    seats: "10 seats",
    storage: "100 GB",
    features: [
      "10 team seats",
      "100 GB shared storage",
      "Advanced analytics",
      "Priority support",
      "Workflow automations",
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "Controls and capacity for a growing organization.",
    monthly: 79,
    yearly: 790,
    seats: "50 seats",
    storage: "1 TB",
    features: [
      "50 team seats",
      "1 TB shared storage",
      "Custom reporting",
      "Unlimited automations",
      "SSO and audit history",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Tailored operations, governance, and dedicated guidance.",
    monthly: null,
    yearly: null,
    seats: "Custom seats",
    storage: "Custom storage",
    features: [
      "Tailored seat limits",
      "Custom storage",
      "Advanced security",
      "Dedicated onboarding",
      "Priority success support",
    ],
  },
];

export type ComparisonCell = string | boolean;
export type ComparisonGroup = {
  name: string;
  rows: {
    feature: string;
    values: [ComparisonCell, ComparisonCell, ComparisonCell, ComparisonCell];
  }[];
};
export const comparison: ComparisonGroup[] = [
  {
    name: "Core features",
    rows: [
      { feature: "Team seats", values: ["3", "10", "50", "Custom"] },
      { feature: "Shared storage", values: ["10 GB", "100 GB", "1 TB", "Custom"] },
      { feature: "Core dashboards", values: [true, true, true, true] },
    ],
  },
  {
    name: "Collaboration",
    rows: [
      { feature: "Shared workspaces", values: ["1", "5", "Unlimited", "Unlimited"] },
      { feature: "Guest access", values: [false, true, true, true] },
      { feature: "Workflow automations", values: [false, "25 / mo", "Unlimited", "Unlimited"] },
    ],
  },
  {
    name: "Analytics",
    rows: [
      { feature: "Advanced analytics", values: [false, true, true, true] },
      { feature: "Custom reporting", values: [false, false, true, true] },
    ],
  },
  {
    name: "Integrations",
    rows: [
      { feature: "App integrations", values: ["3", "10", "Unlimited", "Custom"] },
      { feature: "API access", values: [false, true, true, true] },
    ],
  },
  {
    name: "Support",
    rows: [
      { feature: "Email support", values: [true, true, true, true] },
      { feature: "Priority support", values: [false, true, true, true] },
      { feature: "Dedicated onboarding", values: [false, false, false, true] },
    ],
  },
  {
    name: "Security",
    rows: [
      { feature: "Two-factor authentication", values: [true, true, true, true] },
      { feature: "Single sign-on", values: [false, false, true, true] },
      { feature: "Audit history", values: [false, false, "90 days", "Custom"] },
    ],
  },
];

export const faq = [
  {
    question: "Can I change my plan?",
    answer:
      "The plan controls here are illustrative. A production subscription could support upgrades or downgrades according to its billing terms.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "This template shows plan presentation only. Trial eligibility would depend on the product using it.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Cancellation policies are set by the product owner. This demo does not create a subscription.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "No payment methods are connected in this showcase. A production checkout would list its supported methods.",
  },
  {
    question: "Do you offer annual billing?",
    answer:
      "The sample annual prices equal ten monthly payments, a savings of 16.7% compared with twelve monthly payments.",
  },
  {
    question: "Can I contact sales?",
    answer:
      "The Contact Sales action is a local preview until a sales route or contact address is configured.",
  },
];
