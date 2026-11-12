import type { AiData } from "../types";
export const variables = (content: string) => [
  ...new Set([...content.matchAll(/\{\{\s*([a-zA-Z][\w]*)\s*\}\}/g)].map((m) => m[1])),
];
export function validAiData(value: unknown): value is AiData {
  if (!value || typeof value !== "object") return false;
  const d = value as AiData;
  const arrays = [d.models, d.conversations, d.prompts, d.workflows, d.runs, d.requests];
  if (
    arrays.some(
      (a) =>
        !Array.isArray(a) ||
        a.some((x) => !x || typeof x.id !== "string") ||
        new Set(a.map((x) => x.id)).size !== a.length,
    )
  )
    return false;
  const text = (...values: unknown[]) => values.every((v) => typeof v === "string");
  const nonnegative = (...values: unknown[]) =>
    values.every((v) => typeof v === "number" && Number.isFinite(v) && v >= 0);
  const date = (v: unknown) => typeof v === "string" && Number.isFinite(Date.parse(v));
  const hasModel = (id: string) => d.models.some((m) => m.id === id);
  const hasPrompt = (id: string) => d.prompts.some((p) => p.id === id);
  const hasWorkflow = (id: string) => d.workflows.some((w) => w.id === id);
  return (
    d.models.length > 0 &&
    d.models.some((m) => m.id === d.defaultModelId && m.enabled) &&
    d.models.every(
      (m) =>
        text(m.name, m.provider, m.description) &&
        nonnegative(m.context, m.inputPrice, m.outputPrice) &&
        typeof m.enabled === "boolean" &&
        ["Available", "Degraded"].includes(m.availability) &&
        Array.isArray(m.capabilities) &&
        m.capabilities.every((c) => typeof c === "string"),
    ) &&
    d.prompts.every(
      (p) =>
        text(p.name, p.category, p.description, p.content) &&
        typeof p.favorite === "boolean" &&
        Array.isArray(p.versions) &&
        p.versions.every((v) => nonnegative(v.version) && text(v.content) && date(v.date)),
    ) &&
    d.workflows.every(
      (w) =>
        text(w.name, w.agent, w.description, w.input, w.processing, w.output) &&
        hasModel(w.modelId) &&
        hasPrompt(w.promptId) &&
        typeof w.enabled === "boolean" &&
        ["Manual", "Demo schedule"].includes(w.trigger),
    ) &&
    d.requests.every(
      (r) =>
        hasModel(r.modelId) &&
        (!r.promptId || hasPrompt(r.promptId)) &&
        (!r.workflowId || hasWorkflow(r.workflowId)) &&
        date(r.time) &&
        text(r.error, r.workspace) &&
        nonnegative(r.input, r.output, r.latency) &&
        ["Production", "Sandbox"].includes(r.environment) &&
        ["Success", "Error"].includes(r.status) &&
        ["Chat", "Workflow", "Demo API"].includes(r.source),
    ) &&
    d.runs.every(
      (r) =>
        hasWorkflow(r.workflowId) &&
        date(r.date) &&
        text(r.detail) &&
        ["Running", "Succeeded", "Failed"].includes(r.status) &&
        (r.status === "Running"
          ? !r.requestId
          : d.requests.some((q) => q.id === r.requestId && q.workflowId === r.workflowId)),
    ) &&
    d.conversations.every(
      (c) =>
        text(c.title) &&
        date(c.created) &&
        hasModel(c.modelId) &&
        Array.isArray(c.messages) &&
        c.messages.every(
          (m) =>
            text(m.id, m.content) &&
            date(m.time) &&
            hasModel(m.modelId) &&
            ["user", "assistant"].includes(m.role),
        ),
    )
  );
}
