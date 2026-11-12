import { seed } from "./seed";
import { validAiData } from "./schemas/validation";
import { snapshotDate, type AiData, type Prompt, type Workflow } from "./types";
const key = "nova-ai-demo-v1",
  initial = { data: seed, warning: "" };
let state = initial,
  initialized = false;
const listeners = new Set<() => void>(),
  notify = () => listeners.forEach((l) => l());
function load() {
  try {
    const raw = localStorage.getItem(key),
      data: unknown = raw ? JSON.parse(raw) : structuredClone(seed);
    if (!validAiData(data)) throw new Error();
    state = { data, warning: "" };
  } catch {
    state = {
      data: structuredClone(seed),
      warning:
        "Saved AI demo data could not be loaded. Original samples are shown; the next save replaces the invalid data.",
    };
  }
}
export const aiStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    if (!initialized) {
      initialized = true;
      load();
      queueMicrotask(notify);
      window.addEventListener("storage", (e) => {
        if (e.key === key) {
          load();
          notify();
        }
      });
    }
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => state,
  getServerSnapshot: () => initial,
  update(change: (data: AiData) => void) {
    try {
      const data = structuredClone(state.data);
      change(data);
      if (!validAiData(data))
        throw new Error("Invalid or unrelated AI records. This change was not saved.");
      let warning = "";
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch {
        warning = "Storage is unavailable or full. Changes remain in memory for this session only.";
      }
      state = { data, warning };
      notify();
      return "";
    } catch (e) {
      return e instanceof Error ? e.message : "Unable to save this change.";
    }
  },
};
export const id = () => crypto.randomUUID();
export const demoTime = () => `${snapshotDate}T${new Date().toISOString().slice(11)}`;
const pendingChats = new Set<string>();
export async function sendChat(conversationId: string, content: string, regenerate = false) {
  if (pendingChats.has(conversationId)) return "Wait for the current demo response.";
  const error = aiStore.update((data) => {
    const chat = data.conversations.find((c) => c.id === conversationId);
    if (!chat || !data.models.some((m) => m.id === chat.modelId && m.enabled))
      throw new Error("Select an enabled model before sending.");
    if (!regenerate && !content.trim()) throw new Error("Enter a message.");
    if (regenerate && chat.messages.at(-1)?.role !== "assistant")
      throw new Error("There is no assistant response to regenerate.");
    if (!regenerate) {
      chat.messages.push({
        id: id(),
        role: "user",
        content: content.trim(),
        time: demoTime(),
        modelId: chat.modelId,
      });
      if (chat.messages.filter((m) => m.role === "user").length === 1)
        chat.title = content.trim().slice(0, 45);
    }
  });
  if (error) return error;
  pendingChats.add(conversationId);
  await new Promise((resolve) => setTimeout(resolve, 900));
  const result = aiStore.update((data) => {
    const chat = data.conversations.find((c) => c.id === conversationId);
    if (!chat) return;
    const last = [...chat.messages].reverse().find((m) => m.role === "user");
    const modelId = chat.modelId;
    const answer = `## Simulated response\n${regenerate ? "Regenerated locally from the same demo rules." : "Here is a structured demo outline for your request."}\n\n**Your topic:** ${last?.content.slice(0, 240) || "Demo conversation"}\n\n- Define the outcome and constraints.\n- Gather the relevant context.\n- Review a small draft and choose the next step.\n\n\`Demo mode\`: no LLM or external API was called.`;
    if (regenerate) chat.messages.pop();
    chat.messages.push({ id: id(), role: "assistant", content: answer, time: demoTime(), modelId });
    data.requests.unshift({
      id: id(),
      time: demoTime(),
      modelId,
      environment: "Sandbox",
      workspace: "Chat workspace",
      input: last?.content.length || 0,
      output: answer.length,
      latency: 900,
      status: "Success",
      error: "",
      promptId: "",
      workflowId: "",
      source: "Chat",
    });
  });
  pendingChats.delete(conversationId);
  return result;
}
export function savePrompt(input: Prompt) {
  return aiStore.update((data) => {
    if (!input.name.trim() || !input.content.trim() || !input.category.trim())
      throw new Error("Name, category and template content are required.");
    const old = data.prompts.find((p) => p.id === input.id);
    const next = {
      ...input,
      id: input.id || id(),
      versions: old
        ? [
            ...old.versions,
            { version: old.versions.length + 1, content: old.content, date: snapshotDate },
          ]
        : [],
    };
    if (old) data.prompts[data.prompts.indexOf(old)] = next;
    else data.prompts.unshift(next);
  });
}
export function deletePrompt(promptId: string) {
  return aiStore.update((data) => {
    if (
      data.workflows.some((w) => w.promptId === promptId) ||
      data.requests.some((r) => r.promptId === promptId)
    )
      throw new Error("This prompt is referenced by a workflow or request and cannot be deleted.");
    data.prompts = data.prompts.filter((p) => p.id !== promptId);
  });
}
export function saveWorkflow(input: Workflow) {
  return aiStore.update((data) => {
    if (
      ![input.name, input.agent, input.input, input.processing, input.output].every((v) => v.trim())
    )
      throw new Error("Complete the agent, workflow name and every stage.");
    if (!data.models.some((m) => m.id === input.modelId && m.enabled))
      throw new Error("Select an enabled model.");
    const next = { ...input, id: input.id || id() },
      index = data.workflows.findIndex((w) => w.id === next.id);
    if (index < 0) data.workflows.unshift(next);
    else {
      if (data.runs.some((r) => r.workflowId === input.id && r.status === "Running"))
        throw new Error("Wait for the current simulated run to finish before editing.");
      data.workflows[index] = next;
    }
  });
}
export function startRun(workflowId: string, fail: boolean) {
  const runId = id();
  const error = aiStore.update((data) => {
    const flow = data.workflows.find((w) => w.id === workflowId);
    if (!flow?.enabled || !data.models.some((m) => m.id === flow.modelId && m.enabled))
      throw new Error("Enable the workflow and its model first.");
    if (data.runs.some((r) => r.workflowId === workflowId && r.status === "Running"))
      throw new Error("This workflow already has a simulated run in progress.");
    data.runs.unshift({
      id: runId,
      workflowId,
      date: demoTime(),
      status: "Running",
      requestId: "",
      detail: "Simulating local execution…",
    });
  });
  if (!error)
    setTimeout(
      () =>
        aiStore.update((data) => {
          const flow = data.workflows.find((w) => w.id === workflowId)!,
            run = data.runs.find((r) => r.id === runId);
          if (!run || run.status !== "Running") return;
          const requestId = id();
          data.requests.unshift({
            id: requestId,
            time: demoTime(),
            modelId: flow.modelId,
            environment: "Sandbox",
            workspace: flow.agent,
            input: flow.input.length * 2,
            output: fail ? 0 : flow.processing.length * 3,
            latency: 850,
            status: fail ? "Error" : "Success",
            error: fail ? "Simulated processing failure" : "",
            promptId: flow.promptId,
            workflowId,
            source: "Workflow",
          });
          run.requestId = requestId;
          run.status = fail ? "Failed" : "Succeeded";
          run.detail = fail
            ? "Simulated failure. Adjust the input and try a success scenario."
            : `Simulated output: ${flow.output}. No external task was executed.`;
        }),
      1100,
    );
  return error;
}
export function stopRun(workflowId: string) {
  return aiStore.update((data) => {
    const run = data.runs.find((r) => r.workflowId === workflowId && r.status === "Running"),
      flow = data.workflows.find((w) => w.id === workflowId);
    if (!run || !flow) throw new Error("No active simulation to stop.");
    const requestId = id();
    data.requests.unshift({
      id: requestId,
      time: demoTime(),
      modelId: flow.modelId,
      environment: "Sandbox",
      workspace: flow.agent,
      input: 0,
      output: 0,
      latency: 0,
      status: "Error",
      error: "Simulation stopped locally",
      promptId: flow.promptId,
      workflowId,
      source: "Workflow",
    });
    run.status = "Failed";
    run.requestId = requestId;
    run.detail = "Simulation stopped locally. You can start a new run.";
  });
}
export function exportReport(name: string, rows: Record<string, string | number>[]) {
  const keys = Object.keys(rows[0] || {}),
    quote = (v: string | number) =>
      `"${String(typeof v === "number" ? v : v.replace(/^[=+@-]/, "'$&")).replaceAll('"', '""')}"`;
  const blob = new Blob(
    [
      [keys, ...rows.map((r) => keys.map((k) => r[k]))]
        .map((r) => r.map(quote).join(","))
        .join("\r\n"),
    ],
    { type: "text/csv;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob),
    link = document.createElement("a");
  link.href = url;
  link.download = `${name}-demo.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
