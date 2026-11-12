"use client";
import { useState } from "react";
import { Check, Cpu, Layers3, Settings2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { AiWorkspace, AiTitle, AiStatus } from "./ai-workspace";
import { useAi } from "../hooks/use-ai";
import { metrics, number, usd } from "../types";
export function ModelDirectory() {
  const { data, update } = useAi(),
    [query, setQuery] = useState(""),
    [status, setStatus] = useState("all"),
    [capability, setCapability] = useState("all"),
    [selected, setSelected] = useState(""),
    [error, setError] = useState("");
  const models = data.models.filter(
      (m) =>
        `${m.name} ${m.provider}`.toLowerCase().includes(query.toLowerCase()) &&
        (status === "all" || m.enabled === (status === "enabled")) &&
        (capability === "all" || m.capabilities.includes(capability)),
    ),
    model = data.models.find((m) => m.id === selected);
  function toggle(modelId: string) {
    setError(
      update((d) => {
        const m = d.models.find((m) => m.id === modelId)!;
        if (m.id === d.defaultModelId && m.enabled)
          throw new Error("Choose a different default model before disabling this one.");
        if (
          d.runs.some(
            (r) =>
              r.status === "Running" &&
              d.workflows.find((w) => w.id === r.workflowId)?.modelId === modelId,
          )
        )
          throw new Error("Wait for active simulated runs before disabling this model.");
        m.enabled = !m.enabled;
      }),
    );
  }
  return (
    <AiWorkspace
      title="Model management"
      description="Fictional model profiles, capabilities and local routing preferences."
      actions={
        <span className="text-label text-muted">
          Default:{" "}
          <strong className="font-medium text-foreground">
            {data.models.find((m) => m.id === data.defaultModelId)?.name}
          </strong>
        </span>
      }
    >
      <Card
        title={<AiTitle icon={Settings2}>Model catalog</AiTitle>}
        action={
          <span className="text-tiny text-muted">Sample specifications · no live connections</span>
        }
      >
        <div className="my-3 flex flex-wrap gap-2">
          <Input
            aria-label="Search models"
            placeholder="Search model or provider…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Select
            aria-label="Model state filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All states</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </Select>
          <Select
            aria-label="Model capability filter"
            value={capability}
            onChange={(e) => setCapability(e.target.value)}
          >
            <option value="all">All capabilities</option>
            {["Text", "Code", "Vision", "Reasoning"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </div>
        {error && (
          <p role="alert" className="mb-3 text-label text-danger">
            {error}
          </p>
        )}
        <div className="grid gap-widget md:grid-cols-2">
          {models.map((m) => (
            <div key={m.id} className="rounded-card border border-border p-4">
              <div className="flex items-start justify-between gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-control bg-accent/10 text-accent">
                  <Cpu size={18} />
                </span>
                <AiStatus>{m.enabled ? m.availability : "Disabled"}</AiStatus>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <h2 className="font-semibold">{m.name}</h2>
                {m.id === data.defaultModelId && (
                  <span className="flex items-center gap-1 text-tiny text-accent">
                    <Check size={12} />
                    Default
                  </span>
                )}
              </div>
              <p className="mt-1 text-tiny text-muted">{m.provider}</p>
              <p className="mt-3 text-label text-muted">{m.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {m.capabilities.map((c) => (
                  <span
                    key={c}
                    className="rounded-control border border-border px-2 py-1 text-tiny"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 border-y border-border py-3 text-tiny">
                <div>
                  <dt className="text-muted">Context</dt>
                  <dd className="mt-1 font-medium">{number(m.context)}</dd>
                </div>
                <div>
                  <dt className="text-muted">Input / 1M</dt>
                  <dd className="mt-1 font-medium">{usd(m.inputPrice)}</dd>
                </div>
                <div>
                  <dt className="text-muted">Output / 1M</dt>
                  <dd className="mt-1 font-medium">{usd(m.outputPrice)}</dd>
                </div>
              </dl>
              <div className="mt-3 flex flex-wrap gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelected(m.id);
                    setError("");
                  }}
                >
                  Model details
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toggle(m.id)}>
                  {m.enabled ? "Disable" : "Enable"} {m.name}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={!m.enabled || m.id === data.defaultModelId}
                  onClick={() =>
                    setError(
                      update((d) => {
                        d.defaultModelId = m.id;
                      }),
                    )
                  }
                >
                  Set default
                </Button>
              </div>
            </div>
          ))}
        </div>
        {!models.length && (
          <p className="p-4 text-label text-muted">No models match these filters.</p>
        )}
      </Card>
      <Card title={<AiTitle icon={Layers3}>Technical comparison</AiTitle>}>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-label">
            <thead>
              <tr>
                {[
                  "Model",
                  "Context tokens",
                  "Input / 1M",
                  "Output / 1M",
                  "Demo requests",
                  "Mean latency",
                ].map((t) => (
                  <th key={t} className="pb-3 font-medium text-muted">
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {models.map((m) => {
                const stats = metrics(
                  data.requests.filter((r) => r.modelId === m.id),
                  data.models,
                );
                return (
                  <tr key={m.id} className="border-t border-border">
                    <td className="py-3">{m.name}</td>
                    <td>{number(m.context)}</td>
                    <td>{usd(m.inputPrice)}</td>
                    <td>{usd(m.outputPrice)}</td>
                    <td>{stats.total}</td>
                    <td>{Math.round(stats.latency)} ms</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <Dialog open={!!model} title="Fictional model details" onClose={() => setSelected("")}>
        {model && (
          <div className="space-y-3 text-label">
            <p className="text-lg font-semibold">{model.name}</p>
            <p className="text-muted">{model.description}</p>
            <AiStatus>{model.enabled ? model.availability : "Disabled"}</AiStatus>
            <p>
              {number(model.context)} context tokens · {model.capabilities.join(", ")}
            </p>
            <p>
              Input {usd(model.inputPrice)} / output {usd(model.outputPrice)} per million tokens.
            </p>
            <p className="rounded-control border border-border bg-surface-alt p-3 text-muted">
              These rates and availability states are fictional, not provider specifications.
              Enabling a model changes only local demo routing.
            </p>
            <Button
              onClick={() => {
                setSelected("");
                toggle(model.id);
              }}
            >
              {model.enabled ? "Disable" : "Enable"} demo model
            </Button>
          </div>
        )}
      </Dialog>
    </AiWorkspace>
  );
}
