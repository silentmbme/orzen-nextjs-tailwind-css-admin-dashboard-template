export const snapshotDate = "2026-11-02";
export type Model = {
  id: string;
  name: string;
  provider: string;
  context: number;
  inputPrice: number;
  outputPrice: number;
  enabled: boolean;
  availability: "Available" | "Degraded";
  capabilities: string[];
  description: string;
};
export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
  modelId: string;
};
export type Conversation = {
  id: string;
  title: string;
  modelId: string;
  messages: Message[];
  created: string;
};
export type PromptVersion = { version: number; content: string; date: string };
export type Prompt = {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string;
  favorite: boolean;
  versions: PromptVersion[];
};
export type Workflow = {
  id: string;
  name: string;
  agent: string;
  description: string;
  modelId: string;
  promptId: string;
  enabled: boolean;
  trigger: "Manual" | "Demo schedule";
  input: string;
  processing: string;
  output: string;
};
export type WorkflowRun = {
  id: string;
  workflowId: string;
  date: string;
  status: "Running" | "Succeeded" | "Failed";
  requestId: string;
  detail: string;
};
export type ApiRequest = {
  id: string;
  time: string;
  modelId: string;
  environment: "Production" | "Sandbox";
  workspace: string;
  input: number;
  output: number;
  latency: number;
  status: "Success" | "Error";
  error: string;
  promptId: string;
  workflowId: string;
  source: "Chat" | "Workflow" | "Demo API";
};
export type AiData = {
  models: Model[];
  defaultModelId: string;
  conversations: Conversation[];
  prompts: Prompt[];
  workflows: Workflow[];
  runs: WorkflowRun[];
  requests: ApiRequest[];
};
export type Scope = { environment: string; modelId: string; from: string; to: string };
export const usd = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(amount);
export const number = (amount: number) => amount.toLocaleString("en-US");
export const dayOffset = (days: number) =>
  new Date(Date.parse(snapshotDate) + days * 86400000).toISOString().slice(0, 10);
export const requestCost = (request: ApiRequest, models: Model[]) => {
  const model = models.find((m) => m.id === request.modelId);
  return model
    ? (request.input * model.inputPrice + request.output * model.outputPrice) / 1000000
    : 0;
};
export function scopedRequests(data: AiData, scope: Scope) {
  return data.requests.filter(
    (r) =>
      (scope.environment === "all" || r.environment === scope.environment) &&
      (scope.modelId === "all" || r.modelId === scope.modelId) &&
      r.time.slice(0, 10) >= scope.from &&
      r.time.slice(0, 10) <= scope.to,
  );
}
export function metrics(rows: ApiRequest[], models: Model[]) {
  const success = rows.filter((r) => r.status === "Success").length;
  return {
    total: rows.length,
    success,
    errors: rows.length - success,
    errorRate: rows.length ? ((rows.length - success) / rows.length) * 100 : 0,
    latency: rows.length ? rows.reduce((s, r) => s + r.latency, 0) / rows.length : 0,
    input: rows.reduce((s, r) => s + r.input, 0),
    output: rows.reduce((s, r) => s + r.output, 0),
    cost: rows.reduce((s, r) => s + requestCost(r, models), 0),
  };
}
