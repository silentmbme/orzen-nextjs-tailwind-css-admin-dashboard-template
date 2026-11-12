export const stages = ["Discovery", "Qualified", "Proposal", "Negotiation", "Won", "Lost"] as const;
export type Stage = (typeof stages)[number];
export const pipelines = ["New business", "Renewals"] as const;
export type Pipeline = (typeof pipelines)[number];
export const owners = ["Alex Morgan", "Priya Shah", "Daniel Kim", "Sofia Garcia"] as const;
export type Owner = (typeof owners)[number];
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Converted";
export type ActivityKind = "Call" | "Email" | "Note" | "Task";
export type Company = {
  id: string;
  name: string;
  industry: string;
  website: string;
  size: number;
  region: string;
};
export type Contact = {
  id: string;
  name: string;
  email: string;
  title: string;
  companyId: string;
  phone: string;
  owner: Owner;
};
export type Lead = {
  id: string;
  name: string;
  email: string;
  companyId: string;
  source: string;
  score: number;
  status: LeadStatus;
  owner: Owner;
  created: string;
};
export type Opportunity = {
  id: string;
  name: string;
  companyId: string;
  contactId: string;
  value: number;
  stage: Stage;
  probability: number;
  health: "Healthy" | "Watch" | "At risk";
  pipeline: Pipeline;
  owner: Owner;
  created: string;
  closeDate: string;
};
export type Activity = {
  id: string;
  title: string;
  kind: ActivityKind;
  contactId: string;
  date: string;
  completed: boolean;
  notes: string;
};
export type Meeting = {
  id: string;
  title: string;
  contactId: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  completed: boolean;
};
export type CrmData = {
  companies: Company[];
  contacts: Contact[];
  leads: Lead[];
  opportunities: Opportunity[];
  activities: Activity[];
  meetings: Meeting[];
};
export type Entity = "company" | "contact" | "lead" | "opportunity" | "activity" | "meeting";
export type CrmRecord = Company | Contact | Lead | Opportunity | Activity | Meeting;
export const demoToday = "2026-11-01";
export const currency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
export const shortDate = (value: string) =>
  new Date(`${value}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
export const ageDays = (created: string) =>
  Math.max(0, Math.round((Date.parse(demoToday) - Date.parse(created)) / 86400000));
export const isOpenDeal = (deal: Opportunity) => deal.stage !== "Won" && deal.stage !== "Lost";
