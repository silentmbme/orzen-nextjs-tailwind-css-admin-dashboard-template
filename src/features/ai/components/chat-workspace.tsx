"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bot,
  Code2,
  FileText,
  History,
  MessageSquare,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { AiWorkspace, AiTitle } from "./ai-workspace";
import { ConversationMessage } from "./conversation-message";
import { useAi } from "../hooks/use-ai";
import { demoTime, id, sendChat } from "../demo-service";

const starters = [
  {
    title: "Write a project brief",
    description: "Turn an idea into a clear outline",
    text: "Help me write a concise project brief with goals, scope and next steps.",
    icon: FileText,
  },
  {
    title: "Review a code snippet",
    description: "Explore edge cases and improvements",
    text: "Help me create a code review checklist for a React component.",
    icon: Code2,
  },
  {
    title: "Plan a launch",
    description: "Structure milestones and decisions",
    text: "Create a product launch outline with milestones and success criteria.",
    icon: Sparkles,
  },
  {
    title: "Draft a reply",
    description: "Find a helpful, practical tone",
    text: "Help me draft a clear response to a customer asking about onboarding.",
    icon: MessageSquare,
  },
];
export function ChatWorkspace() {
  const { data, update } = useAi();
  const [selected, setSelected] = useState(""),
    [newModel, setNewModel] = useState(""),
    [query, setQuery] = useState(""),
    [draft, setDraft] = useState(""),
    [pending, setPending] = useState(""),
    [error, setError] = useState(""),
    [confirm, setConfirm] = useState(false),
    [history, setHistory] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null),
    composerRef = useRef<HTMLTextAreaElement>(null);
  const chat = data.conversations.find((c) => c.id === selected);
  const modelId = chat?.modelId || newModel || data.defaultModelId;
  const model = data.models.find((m) => m.id === modelId);
  const conversations = data.conversations
    .filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) =>
      (b.messages.at(-1)?.time || b.created).localeCompare(a.messages.at(-1)?.time || a.created),
    );
  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "instant",
    });
  }, [chat?.messages.length, selected, pending]);
  function fresh() {
    if (pending) return;
    setSelected("");
    setNewModel("");
    setDraft("");
    setError("");
    setHistory(false);
    composerRef.current?.focus();
  }
  function chooseStarter(text: string) {
    setDraft(text);
    composerRef.current?.focus();
  }
  async function send(regenerate = false) {
    if (pending || (!regenerate && !draft.trim())) return;
    if (!model?.enabled) {
      setError("Choose an enabled model before sending.");
      return;
    }
    let chatId = chat?.id;
    if (!chatId) {
      chatId = id();
      const error = update((d) =>
        d.conversations.unshift({
          id: chatId!,
          title: "New conversation",
          modelId,
          messages: [],
          created: demoTime(),
        }),
      );
      if (error) {
        setError(error);
        return;
      }
      setSelected(chatId);
    }
    setPending(chatId);
    setError("");
    const message = draft;
    if (!regenerate) setDraft("");
    const error = await sendChat(chatId, message, regenerate);
    setError(error);
    if (error && !regenerate) setDraft(message);
    setPending("");
  }
  return (
    <AiWorkspace
      title="AI chat"
      description="Your conversation studio for ideas, writing and technical exploration."
      actions={
        <>
          <Button
            variant="outline"
            onClick={() => setHistory(!history)}
            aria-expanded={history}
            aria-controls="ai-conversation-history"
          >
            <History size={13} />
            Conversations
          </Button>
          <Button disabled={!!pending} onClick={fresh}>
            <Plus size={13} />
            New conversation
          </Button>
        </>
      }
    >
      <div className="grid items-start gap-widget lg:grid-cols-[250px_minmax(0,1fr)]">
        <div id="ai-conversation-history" className={`${history ? "block" : "hidden"} lg:block`}>
          <Card
            title={<AiTitle icon={History}>Conversation history</AiTitle>}
            action={
              <span className="text-[10px] text-muted">{data.conversations.length} saved</span>
            }
          >
            <Button
              variant={!chat ? "secondary" : "outline"}
              className="mt-3 w-full justify-start"
              disabled={!!pending}
              onClick={fresh}
            >
              <Plus size={13} />
              Start a fresh chat
            </Button>
            <Input
              aria-label="Search conversations"
              className="mt-3 w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations…"
            />
            <p className="mt-4 text-[10px] uppercase tracking-wide text-muted">Saved locally</p>
            <div className="mt-2 max-h-[490px] space-y-1 overflow-y-auto">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  disabled={!!pending}
                  aria-pressed={c.id === chat?.id}
                  onClick={() => {
                    setSelected(c.id);
                    setDraft("");
                    setError("");
                    setHistory(false);
                  }}
                  className={`w-full rounded-control border p-2.5 text-left ${c.id === chat?.id ? "border-accent bg-accent/5" : "border-transparent hover:bg-surface-alt"}`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare size={12} className="shrink-0 text-muted" />
                    <span className="truncate text-label font-medium">{c.title}</span>
                  </div>
                  <p className="mt-1.5 truncate pl-5 text-[10px] text-muted">
                    {c.messages.at(-1)?.content.replace(/[#*`]/g, "").slice(0, 65) ||
                      "No messages yet"}
                  </p>
                  <p className="mt-1 pl-5 text-[10px] text-muted">
                    {c.messages.length} messages · {c.created.slice(5, 10)}
                  </p>
                </button>
              ))}
              {!conversations.length && (
                <p className="py-4 text-label text-muted">No matching conversations.</p>
              )}
            </div>
            <div className="mt-4 flex items-start gap-2 border-t border-border pt-3 text-[10px] text-muted">
              <Bot size={14} className="shrink-0 text-accent" />
              <p>Deterministic demo responses. No provider or external API is connected.</p>
            </div>
          </Card>
        </div>
        <Card
          title={<AiTitle icon={Bot}>{chat?.title || "New conversation"}</AiTitle>}
          action={
            <Select
              aria-label="Chat model"
              disabled={!!pending}
              value={modelId}
              onChange={(e) => {
                if (chat)
                  setError(
                    update((d) => {
                      d.conversations.find((c) => c.id === chat.id)!.modelId = e.target.value;
                    }),
                  );
                else setNewModel(e.target.value);
              }}
            >
              {data.models.map((m) => (
                <option key={m.id} value={m.id} disabled={!m.enabled}>
                  {m.name}
                  {!m.enabled ? " (disabled)" : ""}
                </option>
              ))}
            </Select>
          }
        >
          <div className="mt-2 flex flex-wrap justify-between gap-2 border-b border-border pb-2 text-[10px] text-muted">
            <span className="flex items-center gap-1.5">
              <i className="h-1.5 w-1.5 rounded-full bg-accent" />
              Local demo session
            </span>
            <span>{model?.capabilities.join(" · ")}</span>
          </div>
          <div
            ref={messagesRef}
            role="log"
            aria-label="Conversation messages"
            aria-live="polite"
            className="mt-3 max-h-[540px] min-h-[330px] space-y-3 overflow-y-auto pr-1"
          >
            {chat?.messages.map((message) => (
              <ConversationMessage
                key={message.id}
                message={message}
                modelName={
                  data.models.find((m) => m.id === message.modelId)?.name || "Sample model"
                }
              />
            ))}
            {!chat?.messages.length && (
              <div className="mx-auto max-w-[600px] px-1 py-6 sm:px-4">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-card border border-border bg-surface-alt text-accent">
                  <Sparkles size={23} />
                </div>
                <h2 className="mt-4 text-center text-[20px] font-semibold leading-tight">
                  What would you like to explore?
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-center text-label text-muted">
                  Start a new conversation or pick an idea below. Your saved chats stay in the
                  history.
                </p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {starters.map(({ title, description, text, icon: Icon }) => (
                    <button
                      key={title}
                      onClick={() => chooseStarter(text)}
                      className="group rounded-control border border-border p-3 text-left transition-colors hover:border-accent hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Icon size={15} className="text-accent" />
                        <ArrowUpRight size={12} className="text-muted" />
                      </div>
                      <p className="mt-3 text-label font-medium">{title}</p>
                      <p className="mt-1 text-[10px] text-muted">{description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {pending && (
              <p role="status" className="flex items-center gap-2 p-3 text-label text-muted">
                <span className="motion-safe:animate-pulse">● ● ●</span>
                Simulating response…
              </p>
            )}
          </div>
          {error && (
            <p role="alert" className="mt-2 text-label text-danger">
              {error}
            </p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="mt-3 rounded-card border border-border bg-surface-alt p-3 focus-within:border-accent"
          >
            <textarea
              ref={composerRef}
              aria-label="Chat message"
              required
              maxLength={4000}
              disabled={!!pending}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder="Ask a question, outline an idea or share some context…"
              className="min-h-20 w-full resize-y bg-transparent text-label outline-none"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2">
              <span className="text-[10px] text-muted">
                {draft.length}/4,000 · Ctrl / ⌘ + Enter to send
              </span>
              <Button type="submit" disabled={!draft.trim() || !!pending || !model?.enabled}>
                <Send size={12} />
                Send demo message
              </Button>
            </div>
          </form>
          <div className="mt-2 flex flex-wrap justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={!!pending || chat?.messages.at(-1)?.role !== "assistant"}
              onClick={() => void send(true)}
            >
              <RotateCcw size={12} />
              Regenerate demo response
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!!pending || !chat?.messages.length}
              onClick={() => setConfirm(true)}
            >
              <Trash2 size={12} />
              Clear conversation
            </Button>
          </div>
        </Card>
      </div>
      <Dialog open={confirm} title="Clear conversation?" onClose={() => setConfirm(false)}>
        <p className="text-label text-muted">
          Remove all messages from this local conversation? Usage records remain for reporting.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirm(false)}>
            Keep messages
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setError(
                update((d) => {
                  const c = d.conversations.find((c) => c.id === chat?.id);
                  if (c) c.messages = [];
                }),
              );
              setConfirm(false);
            }}
          >
            Confirm clear
          </Button>
        </div>
      </Dialog>
    </AiWorkspace>
  );
}
