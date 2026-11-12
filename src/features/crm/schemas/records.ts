import {
  demoToday,
  owners,
  pipelines,
  stages,
  type CrmData,
  type CrmRecord,
  type Entity,
} from "../types";

export const collections = {
  company: "companies",
  contact: "contacts",
  lead: "leads",
  opportunity: "opportunities",
  activity: "activities",
  meeting: "meetings",
} as const;
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const date = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(value)) &&
  new Date(value).toISOString().slice(0, 10) === value;
const has = <T extends string>(values: readonly T[], value: string): value is T =>
  values.includes(value as T);

export function parseRecord(
  entity: Entity,
  values: Record<string, string>,
  id: string,
  data: CrmData,
): { record?: CrmRecord; error?: string } {
  const v = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()]));
  const required =
    entity === "company"
      ? ["name", "industry", "website", "region"]
      : entity === "activity"
        ? ["title", "contactId", "date", "kind"]
        : entity === "meeting"
          ? ["title", "contactId", "date", "time", "location"]
          : entity === "opportunity"
            ? ["name", "companyId", "contactId", "closeDate", "owner"]
            : ["name", "email", "companyId", "owner"];
  if (required.some((key) => !v[key])) return { error: "Complete all required fields." };
  if (Object.values(v).some((value) => value.length > 1000))
    return { error: "Keep each field under 1,000 characters." };
  if (v.email && !email.test(v.email)) return { error: "Enter a valid email address." };
  if (v.owner && !has(owners, v.owner)) return { error: "Choose a valid record owner." };
  if (v.companyId && !data.companies.some((company) => company.id === v.companyId))
    return { error: "Choose an existing company." };
  if (v.contactId && !data.contacts.some((contact) => contact.id === v.contactId))
    return { error: "Choose an existing contact." };
  if ([v.created, v.date, v.closeDate].some((value) => value && !date(value)))
    return { error: "Enter valid calendar dates." };
  const created = v.created || demoToday;
  if (entity === "company") {
    try {
      const url = new URL(v.website);
      if (!["https:", "http:"].includes(url.protocol)) throw new Error();
    } catch {
      return { error: "Use a valid http:// or https:// website URL." };
    }
    if (!Number.isInteger(Number(v.size)) || Number(v.size) < 1 || Number(v.size) > 1000000)
      return { error: "Company size must be between 1 and 1,000,000." };
    return {
      record: {
        id,
        name: v.name,
        industry: v.industry,
        website: v.website,
        size: Number(v.size),
        region: v.region,
      },
    };
  }
  if (entity === "contact")
    return {
      record: {
        id,
        name: v.name,
        email: v.email,
        title: v.title || "Contact",
        companyId: v.companyId,
        phone: v.phone || "Not provided",
        owner: v.owner as (typeof owners)[number],
      },
    };
  if (entity === "lead") {
    if (!Number.isInteger(Number(v.score)) || Number(v.score) < 0 || Number(v.score) > 100)
      return { error: "Lead score must be a whole number from 0 to 100." };
    if (!has(["New", "Contacted", "Qualified", "Converted"] as const, v.status))
      return { error: "Choose a valid lead status." };
    return {
      record: {
        id,
        name: v.name,
        email: v.email,
        companyId: v.companyId,
        source: v.source || "Website",
        score: Number(v.score),
        status: v.status,
        owner: v.owner as (typeof owners)[number],
        created,
      },
    };
  }
  if (entity === "opportunity") {
    if (
      !has(stages, v.stage) ||
      !has(pipelines, v.pipeline) ||
      !has(["Healthy", "Watch", "At risk"] as const, v.health)
    )
      return { error: "Choose a valid stage, pipeline and deal health." };
    if (!Number.isFinite(Number(v.value)) || Number(v.value) <= 0 || Number(v.value) > 1000000000)
      return { error: "Deal value must be greater than zero and at most 1 billion." };
    if (
      !Number.isInteger(Number(v.probability)) ||
      Number(v.probability) < 0 ||
      Number(v.probability) > 100
    )
      return { error: "Probability must be a whole number from 0 to 100." };
    if (v.closeDate < created) return { error: "Close date cannot precede the created date." };
    if (data.contacts.find((contact) => contact.id === v.contactId)?.companyId !== v.companyId)
      return { error: "The primary contact must belong to the selected company." };
    return {
      record: {
        id,
        name: v.name,
        companyId: v.companyId,
        contactId: v.contactId,
        value: Math.round(Number(v.value) * 100) / 100,
        stage: v.stage,
        pipeline: v.pipeline,
        probability: v.stage === "Won" ? 100 : v.stage === "Lost" ? 0 : Number(v.probability),
        health: v.health,
        owner: v.owner as (typeof owners)[number],
        created,
        closeDate: v.closeDate,
      },
    };
  }
  const completed = v.completed === "true";
  if (entity === "activity") {
    if (!has(["Call", "Email", "Note", "Task"] as const, v.kind))
      return { error: "Choose a valid activity type." };
    return {
      record: {
        id,
        title: v.title,
        kind: v.kind,
        contactId: v.contactId,
        date: v.date,
        completed,
        notes: v.notes || "",
      },
    };
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(v.time)) return { error: "Enter a valid meeting time." };
  if (!Number.isInteger(Number(v.duration)) || Number(v.duration) < 15 || Number(v.duration) > 480)
    return { error: "Meeting duration must be 15 to 480 minutes." };
  return {
    record: {
      id,
      title: v.title,
      contactId: v.contactId,
      date: v.date,
      time: v.time,
      duration: Number(v.duration),
      location: v.location,
      completed,
    },
  };
}

export function validStoredData(value: unknown): value is CrmData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  if (
    !Object.values(collections).every(
      (key) => Array.isArray(candidate[key]) && (candidate[key] as unknown[]).length <= 1000,
    )
  )
    return false;
  const data = value as CrmData;
  if (
    !Object.values(collections).every((key) =>
      data[key].every((row) => row && typeof row === "object" && typeof row.id === "string"),
    )
  )
    return false;
  return (Object.entries(collections) as [Entity, (typeof collections)[Entity]][]).every(
    ([entity, key]) => {
      const ids = data[key].map((row) => row.id);
      return (
        new Set(ids).size === ids.length &&
        data[key].every((row) => {
          const values: Record<string, string> = {};
          for (const [name, field] of Object.entries(row)) {
            if (!["string", "number", "boolean"].includes(typeof field)) return false;
            values[name] = String(field);
          }
          const parsed = parseRecord(entity, values, row.id, data);
          if (parsed.error || !parsed.record) return false;
          const original = row as unknown as Record<string, unknown>;
          return Object.entries(parsed.record).every(
            ([name, field]) => typeof original[name] === typeof field,
          );
        })
      );
    },
  );
}
