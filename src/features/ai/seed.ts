import { dayOffset, type AiData } from "./types";
const models: AiData["models"] = [
  {
    id: "nova-core",
    name: "Orzen Core",
    provider: "Orzen Labs (fictional)",
    context: 128000,
    inputPrice: 1.2,
    outputPrice: 4.8,
    enabled: true,
    availability: "Available",
    capabilities: ["Text", "Code", "Vision"],
    description: "Balanced fictional model for reasoning, code and document tasks.",
  },
  {
    id: "nova-flash",
    name: "Orzen Flash",
    provider: "Orzen Labs (fictional)",
    context: 64000,
    inputPrice: 0.15,
    outputPrice: 0.6,
    enabled: true,
    availability: "Available",
    capabilities: ["Text", "Code"],
    description: "Low latency sample model for concise transformations.",
  },
  {
    id: "atlas-reason",
    name: "Atlas Reason",
    provider: "Atlas AI (fictional)",
    context: 200000,
    inputPrice: 3,
    outputPrice: 12,
    enabled: true,
    availability: "Degraded",
    capabilities: ["Text", "Reasoning", "Code"],
    description: "Sample analytical model with a deliberately degraded demo status.",
  },
  {
    id: "prism-vision",
    name: "Prism Vision",
    provider: "Prism (fictional)",
    context: 96000,
    inputPrice: 2,
    outputPrice: 8,
    enabled: false,
    availability: "Available",
    capabilities: ["Text", "Vision"],
    description: "Disabled sample multimodal profile. No image inference is connected.",
  },
];
const prompts: AiData["prompts"] = [
  {
    id: "prompt-summary",
    name: "Executive brief",
    category: "Writing",
    description: "Turn a document into a concise brief with decisions and next steps.",
    content:
      "## Executive brief\nSummarize {{document}} for {{audience}}.\n- Highlight three decisions.\n- List the next actions.\nKeep the tone clear and practical.",
    favorite: true,
    versions: [
      { version: 1, content: "Summarize {{document}} for {{audience}}.", date: "2026-10-10" },
    ],
  },
  {
    id: "prompt-support",
    name: "Support response",
    category: "Support",
    description: "Draft a clear response to a customer question.",
    content:
      "Write a helpful response to {{question}} about {{product}}. Explain the next step. Do not invent product capabilities.",
    favorite: true,
    versions: [],
  },
  {
    id: "prompt-code",
    name: "Code review",
    category: "Engineering",
    description: "Review a code snippet for correctness and maintainability.",
    content:
      "Review {{code}} written in {{language}}.\nIdentify correctness problems, then suggest a small improvement.\nReturn a Markdown checklist.",
    favorite: false,
    versions: [],
  },
  {
    id: "prompt-classify",
    name: "Ticket classifier",
    category: "Operations",
    description: "Classify incoming demo tickets into an operational queue.",
    content:
      "Classify {{ticket}} as billing, technical or general. Explain the choice in one sentence.",
    favorite: false,
    versions: [],
  },
];
const workflows: AiData["workflows"] = [
  {
    id: "flow-brief",
    name: "Document briefing",
    agent: "Research assistant",
    description: "Create a short decision brief from incoming text.",
    modelId: "nova-core",
    promptId: "prompt-summary",
    enabled: true,
    trigger: "Manual",
    input: "Demo quarterly report: retention improved; onboarding remains a priority.",
    processing: "Extract decisions and next actions",
    output: "Markdown brief",
  },
  {
    id: "flow-triage",
    name: "Support triage",
    agent: "Support coordinator",
    description: "Classify a fictional ticket and prepare a response.",
    modelId: "nova-flash",
    promptId: "prompt-classify",
    enabled: true,
    trigger: "Demo schedule",
    input: "A fictional customer asks how to update billing details.",
    processing: "Categorize ticket and summarize intent",
    output: "Queue classification",
  },
  {
    id: "flow-review",
    name: "Engineering review",
    agent: "Code reviewer",
    description: "Review a sample patch for a compact checklist.",
    modelId: "atlas-reason",
    promptId: "prompt-code",
    enabled: false,
    trigger: "Manual",
    input: "A demo function transforms an array of records.",
    processing: "Inspect edge cases",
    output: "Review checklist",
  },
];
const requests: AiData["requests"] = Array.from({ length: 180 }, (_, i) => {
  const failed = i % 17 === 0,
    modelId = models[i % 3].id,
    workflow = i % 4 === 0 ? workflows[i % 2] : undefined;
  return {
    id: `REQ-${String(i + 1).padStart(4, "0")}`,
    time: `${dayOffset(-(i % 30))}T${String(8 + (i % 12)).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}:00.000Z`,
    modelId,
    environment: i % 5 === 0 ? "Sandbox" : "Production",
    workspace: ["Product", "Support", "Engineering"][Math.floor(i / 3) % 3],
    input: 480 + i * 13,
    output: failed ? 0 : 120 + i * 7,
    latency: modelId === "atlas-reason" ? 2200 + i * 5 : 320 + i * 3,
    status: failed ? "Error" : "Success",
    error: failed ? "Simulated upstream timeout" : "",
    promptId: workflow?.promptId || prompts[i % prompts.length].id,
    workflowId: workflow?.id || "",
    source: workflow ? "Workflow" : "Demo API",
  };
});
export const seed: AiData = {
  models,
  defaultModelId: "nova-core",
  prompts,
  workflows,
  requests,
  conversations: [
    {
      id: "chat-welcome",
      title: "Plan a product launch",
      modelId: "nova-core",
      created: "2026-11-02T09:00:00.000Z",
      messages: [
        {
          id: "msg-welcome-user",
          role: "user",
          content: "Help me plan a product launch.",
          time: "2026-11-02T09:00:00.000Z",
          modelId: "nova-core",
        },
        {
          id: "msg-welcome-assistant",
          role: "assistant",
          content:
            "## Demo launch checklist\n- Define the audience and success criteria.\n- Confirm product readiness.\n- Prepare launch messages and support notes.\n\n**Simulation:** this is a saved example, not an LLM response.",
          time: "2026-11-02T09:00:01.000Z",
          modelId: "nova-core",
        },
      ],
    },
  ],
  runs: requests
    .filter((r) => r.workflowId)
    .slice(0, 8)
    .map((r) => ({
      id: `RUN-${r.id}`,
      workflowId: r.workflowId,
      date: r.time,
      status: r.status === "Error" ? "Failed" : "Succeeded",
      requestId: r.id,
      detail: r.error || "Simulated execution completed.",
    })),
};
