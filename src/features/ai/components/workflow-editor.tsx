"use client";
import { useState, type FormEvent } from "react";
import { Bot, ChevronRight, GitBranch, Play, Plus, Settings2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { AiWorkspace, AiTitle, AiStatus } from "./ai-workspace";
import { useAi } from "../hooks/use-ai";
import { saveWorkflow, startRun, stopRun } from "../demo-service";
import type { Workflow } from "../types";
function WorkflowForm({ workflow, onClose }: { workflow?: Workflow; onClose: () => void }) {
  const { data } = useAi(),
    [draft, setDraft] = useState<Workflow>(
      workflow || {
        id: "",
        name: "",
        agent: "",
        description: "",
        modelId: data.defaultModelId,
        promptId: data.prompts[0]?.id || "",
        enabled: false,
        trigger: "Manual",
        input: "",
        processing: "",
        output: "",
      },
    ),
    [error, setError] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    const error = saveWorkflow(draft);
    if (error) setError(error);
    else onClose();
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            { key: "name", label: "Workflow name *" },
            { key: "agent", label: "Agent name *" },
            { key: "description", label: "Workflow description" },
          ] as const
        ).map((f) => (
          <label key={f.key} className="flex flex-col gap-1 text-label">
            {f.label}
            <Input
              required={f.key !== "description"}
              maxLength={250}
              value={draft[f.key]}
              onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
            />
          </label>
        ))}
        <label className="flex flex-col gap-1 text-label">
          Trigger
          <Select
            value={draft.trigger}
            onChange={(e) => setDraft({ ...draft, trigger: e.target.value as Workflow["trigger"] })}
          >
            <option>Manual</option>
            <option>Demo schedule</option>
          </Select>
        </label>
        <label className="flex flex-col gap-1 text-label">
          Workflow model
          <Select
            value={draft.modelId}
            onChange={(e) => setDraft({ ...draft, modelId: e.target.value })}
          >
            {data.models.map((m) => (
              <option key={m.id} value={m.id} disabled={!m.enabled}>
                {m.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1 text-label">
          Prompt template
          <Select
            value={draft.promptId}
            onChange={(e) => setDraft({ ...draft, promptId: e.target.value })}
          >
            {data.prompts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </label>
      </div>
      {(
        [
          { key: "input", label: "Input text *" },
          { key: "processing", label: "Processing instruction *" },
          { key: "output", label: "Output format *" },
        ] as const
      ).map((f) => (
        <label key={f.key} className="flex flex-col gap-1 text-label">
          {f.label}
          <textarea
            required
            maxLength={3000}
            className="min-h-20 rounded-control border border-border bg-surface p-2 text-label outline-accent"
            value={draft[f.key]}
            onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
          />
        </label>
      ))}
      <p className="text-tiny text-muted">
        Demo schedule is a label only; no background scheduler or external agent runs.
      </p>
      {error && (
        <p role="alert" className="text-label text-danger">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save demo workflow</Button>
      </div>
    </form>
  );
}
export function WorkflowEditor() {
  const { data, update } = useAi(),
    [selected, setSelected] = useState("flow-brief"),
    [query, setQuery] = useState(""),
    [edit, setEdit] = useState<string | null>(null),
    [scenario, setScenario] = useState("success"),
    [notice, setNotice] = useState(""),
    [remove, setRemove] = useState(false),
    [node, setNode] = useState("input");
  const flow = data.workflows.find((w) => w.id === selected) || data.workflows[0],
    running = data.runs.some((r) => r.workflowId === flow?.id && r.status === "Running"),
    model = data.models.find((m) => m.id === flow?.modelId);
  const nodes = flow
    ? [
        { id: "trigger", label: "Trigger", value: flow.trigger },
        { id: "input", label: "Input", value: flow.input },
        { id: "model", label: "Model", value: model?.name || "" },
        { id: "processing", label: "Processing", value: flow.processing },
        { id: "output", label: "Output", value: flow.output },
      ]
    : [];
  return (
    <AiWorkspace
      title="AI agents & workflows"
      description="A lightweight, accessible stage editor with local execution scenarios."
      actions={
        <Button onClick={() => setEdit("new")} disabled={!data.prompts.length}>
          <Plus size={13} />
          Create workflow
        </Button>
      }
    >
      <div className="grid gap-widget xl:grid-cols-[260px_minmax(0,1fr)]">
        <Card title={<AiTitle icon={Bot}>Agent workspace</AiTitle>}>
          <Input
            aria-label="Search workflows"
            className="mt-3 w-full"
            placeholder="Search workflow or agent…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="mt-3 space-y-2">
            {data.workflows
              .filter((w) => `${w.name} ${w.agent}`.toLowerCase().includes(query.toLowerCase()))
              .map((w) => (
                <button
                  key={w.id}
                  aria-pressed={flow?.id === w.id}
                  onClick={() => {
                    setSelected(w.id);
                    setNotice("");
                    setNode("input");
                  }}
                  className={`w-full rounded-control border p-3 text-left ${flow?.id === w.id ? "border-accent bg-accent/5" : "border-border hover:bg-surface-alt"}`}
                >
                  <div className="flex justify-between gap-2">
                    <Bot size={16} className="text-accent" />
                    <AiStatus>{w.enabled ? "Enabled" : "Disabled"}</AiStatus>
                  </div>
                  <p className="mt-3 text-label font-medium">{w.name}</p>
                  <p className="mt-1 text-tiny text-muted">{w.agent}</p>
                  <p className="mt-3 text-[10px] text-muted">
                    {data.runs.filter((r) => r.workflowId === w.id).length} sample executions ·{" "}
                    {w.trigger}
                  </p>
                </button>
              ))}
            {!data.workflows.some((w) =>
              `${w.name} ${w.agent}`.toLowerCase().includes(query.toLowerCase()),
            ) && <p className="p-3 text-label text-muted">No matching workflows.</p>}
          </div>
        </Card>
        <div className="min-w-0 space-y-widget">
          {flow ? (
            <>
              <Card
                title={<AiTitle icon={GitBranch}>Workflow canvas</AiTitle>}
                action={
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={running}
                      onClick={() => setEdit(flow.id)}
                    >
                      <Settings2 size={12} />
                      Edit stages
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={running}
                      onClick={() =>
                        setNotice(
                          update((d) => {
                            d.workflows.find((w) => w.id === flow.id)!.enabled = !flow.enabled;
                          }) || `Workflow ${flow.enabled ? "disabled" : "enabled"} locally.`,
                        )
                      }
                    >
                      {flow.enabled ? "Disable" : "Enable"}
                    </Button>
                  </div>
                }
              >
                <div className="mt-3 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold">{flow.name}</h2>
                    <p className="mt-1 text-label text-muted">{flow.description}</p>
                  </div>
                  <AiStatus>{running ? "Running" : flow.enabled ? "Enabled" : "Disabled"}</AiStatus>
                </div>
                <div className="mt-4 overflow-x-auto rounded-control border border-border bg-surface-alt p-3">
                  <div className="flex min-w-[700px] items-center gap-2">
                    {nodes.map((n, index) => (
                      <div key={n.id} className="contents">
                        <button
                          aria-pressed={node === n.id}
                          aria-label={`Inspect ${n.label} stage`}
                          onClick={() => setNode(n.id)}
                          className={`min-w-0 flex-1 rounded-control border bg-surface p-3 text-left ${node === n.id ? "border-accent" : "border-border"}`}
                        >
                          <span className="text-[10px] text-accent">
                            0{index + 1} / {n.label.toUpperCase()}
                          </span>
                          <p className="mt-3 truncate text-label font-medium">{n.value}</p>
                        </button>
                        {index < nodes.length - 1 && (
                          <ChevronRight size={14} className="shrink-0 text-muted" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 rounded-control border border-border p-3">
                  <p className="text-tiny font-medium text-accent">
                    {nodes.find((n) => n.id === node)?.label} configuration
                  </p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-label">
                    {nodes.find((n) => n.id === node)?.value}
                  </p>
                  {node === "model" && (
                    <p className="mt-2 text-tiny text-muted">
                      Template: {data.prompts.find((p) => p.id === flow.promptId)?.name}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    <Select
                      aria-label="Workflow run scenario"
                      value={scenario}
                      disabled={running}
                      onChange={(e) => setScenario(e.target.value)}
                    >
                      <option value="success">Simulate success</option>
                      <option value="failure">Simulate failure</option>
                    </Select>
                    <Button
                      disabled={running || !flow.enabled || !model?.enabled}
                      onClick={() =>
                        setNotice(
                          startRun(flow.id, scenario === "failure") ||
                            "Simulated run started. No external task is executed.",
                        )
                      }
                    >
                      <Play size={12} />
                      {running ? "Running simulation…" : "Run demo workflow"}
                    </Button>
                    {running && (
                      <Button
                        variant="outline"
                        onClick={() => setNotice(stopRun(flow.id) || "Simulation stopped.")}
                      >
                        Stop simulation
                      </Button>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={running}
                    aria-label="Delete workflow"
                    onClick={() => {
                      setRemove(true);
                      setNotice("");
                    }}
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
                <p className="mt-2 text-[10px] text-muted">
                  A local timer produces a deterministic result and a related usage record. No
                  provider is called.
                </p>
                {notice && (
                  <p role="status" className="mt-3 text-label text-muted">
                    {notice}
                  </p>
                )}
              </Card>
              <Card title={<AiTitle icon={Play}>Execution history</AiTitle>}>
                <div className="[&_table]:min-w-[680px]">
                  <DataTable
                    label="Workflow executions"
                    rows={data.runs.filter((r) => r.workflowId === flow.id)}
                    rowKey={(r) => r.id}
                    columns={[
                      { key: "run", label: "Run", value: (r) => r.id.slice(0, 16) },
                      {
                        key: "date",
                        label: "Time (UTC)",
                        value: (r) => r.date.replace("T", " ").slice(0, 19),
                      },
                      {
                        key: "status",
                        label: "Status",
                        value: (r) => r.status,
                        render: (r) => <AiStatus>{r.status}</AiStatus>,
                      },
                      { key: "detail", label: "Result", value: (r) => r.detail },
                    ]}
                  />
                </div>
              </Card>
            </>
          ) : (
            <Card>
              <p className="p-4 text-label text-muted">
                Create your first local workflow to configure its stages.
              </p>
            </Card>
          )}
        </div>
      </div>
      <Dialog
        open={edit !== null}
        title={edit === "new" ? "Create workflow" : "Edit workflow"}
        onClose={() => setEdit(null)}
      >
        {edit !== null && (
          <WorkflowForm
            key={edit}
            workflow={data.workflows.find((w) => w.id === edit)}
            onClose={() => setEdit(null)}
          />
        )}
      </Dialog>
      <Dialog open={remove} title="Delete workflow?" onClose={() => setRemove(false)}>
        <p className="text-label text-muted">
          Workflows with execution or request history are protected.
        </p>
        {notice && (
          <p role="alert" className="mt-3 text-label text-danger">
            {notice}
          </p>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setRemove(false)}>
            Keep workflow
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              const error = update((d) => {
                if (
                  d.runs.some((r) => r.workflowId === flow?.id) ||
                  d.requests.some((r) => r.workflowId === flow?.id)
                )
                  throw new Error(
                    "This workflow has history and cannot be deleted. Disable it instead.",
                  );
                d.workflows = d.workflows.filter((w) => w.id !== flow?.id);
              });
              setNotice(error);
              if (!error) setRemove(false);
            }}
          >
            Confirm delete
          </Button>
        </div>
      </Dialog>
    </AiWorkspace>
  );
}
