"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  ArrowUpRight,
  Bot,
  Check,
  FileText,
  GitBranch,
  Mail,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
export function AIChatPreview() {
  const [model, setModel] = useState("Orion Reason");
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState(
    "Give a complex task a clear next step. Try a prompt below to explore a local, simulated response.",
  );
  const [lastPrompt, setLastPrompt] = useState("");
  function send(value: string) {
    if (!value.trim()) return;
    setLastPrompt(value.trim());
    setAnswer(
      value.toLowerCase().includes("support")
        ? "Demo plan: group incoming questions by topic, draft a suggested response, and send sensitive cases to a teammate for review."
        : "Demo plan: define the outcome, gather the relevant context, propose three practical next steps, and ask a teammate to review the result. This is a deterministic sample, not a model-generated answer.",
    );
    setPrompt("");
  }
  return (
    <div className="marketing-preview">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-alt p-3">
        <span className="flex items-center gap-2 text-[11px] font-medium">
          <Terminal size={14} />
          Prompt playground
        </span>
        <Select
          aria-label="Preview AI model"
          value={model}
          onChange={(event) => setModel(event.target.value)}
        >
          <option>Orion Reason</option>
          <option>Lumen Write</option>
          <option>Atlas Vision</option>
        </Select>
      </div>
      <div className="min-h-[250px] p-5 sm:p-7">
        <span className="text-[9px] uppercase tracking-wider text-muted">
          Local simulation / {model}
        </span>
        {lastPrompt && (
          <p className="my-4 ml-6 rounded-lg border border-border bg-surface-alt p-3 text-[12px]">
            {lastPrompt}
          </p>
        )}
        <div className="mt-5 flex gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
            <Bot size={17} />
          </span>
          <p className="text-[13px] leading-7" role="status">
            {answer}
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {["Plan a product launch", "Improve customer support"].map((text) => (
            <Button key={text} size="sm" variant="ghost" onClick={() => send(text)}>
              {text}
            </Button>
          ))}
        </div>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          send(prompt);
        }}
        className="flex gap-2 border-t border-border p-3"
      >
        <Input
          aria-label="Demo AI prompt"
          value={prompt}
          maxLength={400}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="What would you like to explore?"
          required
          className="min-w-0 flex-1"
        />
        <Button type="submit" variant="primary" aria-label="Send demo prompt">
          <ArrowUp size={15} />
        </Button>
      </form>
    </div>
  );
}
export function AIWorkflowPreview() {
  const [run, setRun] = useState(false);
  const [flow, setFlow] = useState(0);
  const document = flow === 1;
  return (
    <div className="ai-flow-studio">
      <header className="ai-flow-header">
        <span>
          <GitBranch size={16} />
          <b>Workflow studio</b>
        </span>
        <span className={run ? "ai-flow-state is-complete" : "ai-flow-state"}>
          <i />
          {run ? "Preview complete" : "Ready to explore"}
        </span>
      </header>
      <div className="ai-flow-scenarios" role="group" aria-label="Choose a workflow scenario">
        {["Support triage", "Document briefing"].map((name, i) => (
          <button
            key={name}
            type="button"
            aria-pressed={flow === i}
            onClick={() => {
              setFlow(i);
              setRun(false);
            }}
          >
            {i ? <FileText size={14} /> : <Mail size={14} />}
            <span>{name}</span>
          </button>
        ))}
      </div>
      <div className="ai-flow-map">
        <svg viewBox="0 0 400 240" preserveAspectRatio="none" aria-hidden="true">
          <path d="M200 48V78 M200 78H90V100 M200 78H310V100 M90 154V180H200V200 M310 154V180H200" />
        </svg>
        <div className="ai-flow-source">
          <span>{document ? <FileText size={15} /> : <Mail size={15} />}</span>
          <div>
            <small>INPUT RECEIVED</small>
            <b>{document ? "Quarterly feedback report" : "A customer needs a hand"}</b>
          </div>
          <span className="ai-flow-file">{document ? "PDF" : "Email"}</span>
        </div>
        <div className="ai-flow-branches">
          <div className="ai-flow-task">
            <span className="ai-flow-task-icon">
              <Sparkles size={18} />
            </span>
            <small>UNDERSTAND</small>
            <b>{document ? "Find the key themes" : "Find the intent"}</b>
            <p>{document ? "Extract the useful details" : "Identify context & urgency"}</p>
            <span className="ai-flow-task-status">
              {run ? (
                <>
                  <Check size={10} />
                  Analyzed
                </>
              ) : (
                "Context-aware processing"
              )}
            </span>
          </div>
          <div className="ai-flow-task ai-flow-task-blue">
            <span className="ai-flow-task-icon">
              <Bot size={18} />
            </span>
            <small>PREPARE</small>
            <b>{document ? "Shape an action list" : "Build a helpful draft"}</b>
            <p>{document ? "Turn insights into next steps" : "Consider tone & next steps"}</p>
            <span className="ai-flow-task-status">
              {run ? (
                <>
                  <Check size={10} />
                  Draft ready
                </>
              ) : (
                "A considered starting point"
              )}
            </span>
          </div>
        </div>
        <div className="ai-flow-review">
          <span>
            <ShieldCheck size={17} />
          </span>
          <div>
            <b>A human makes the final call.</b>
            <small>
              {run
                ? "Your sample output is ready to review."
                : "Review the context before anything moves forward."}
            </small>
          </div>
          <Check size={13} />
        </div>
      </div>
      <footer className="ai-flow-footer">
        <Link href="/apps/ai/workflows">
          Explore the full studio <ArrowUpRight size={12} />
        </Link>
        <Button size="sm" variant="primary" onClick={() => setRun(!run)}>
          {run ? <RotateCcw size={12} /> : <Play size={12} />}{" "}
          {run ? "Reset preview" : "Run preview"}
        </Button>
      </footer>
    </div>
  );
}
