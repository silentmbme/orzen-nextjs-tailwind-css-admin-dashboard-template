"use client";
import { Fragment, useState } from "react";
import { Bot, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { Message } from "../types";
function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) =>
    part.startsWith("**") ? (
      <strong key={index} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : part.startsWith("`") ? (
      <code key={index} className="rounded bg-surface-alt px-1 font-mono text-tiny">
        {part.slice(1, -1)}
      </code>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}
export function MarkdownText({ content }: { content: string }) {
  return (
    <div className="space-y-2 break-words [overflow-wrap:anywhere]">
      {content.split("\n").map((line, i) =>
        line.startsWith("## ") ? (
          <h3 key={i} className="text-body font-semibold">
            {inline(line.slice(3))}
          </h3>
        ) : line.startsWith("- ") ? (
          <p key={i} className="flex gap-2">
            <span aria-hidden>•</span>
            <span>{inline(line.slice(2))}</span>
          </p>
        ) : (
          <p key={i}>{inline(line) || "\u00a0"}</p>
        ),
      )}
    </div>
  );
}
export function ConversationMessage({
  message,
  modelName,
}: {
  message: Message;
  modelName: string;
}) {
  const [notice, setNotice] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setNotice("Copied");
    } catch {
      setNotice("Clipboard unavailable. Select the message text to copy.");
    }
  }
  return (
    <article
      className={`flex gap-2.5 rounded-control p-3 ai-chat-avatar ${message.role === "assistant" ? "border border-border bg-surface" : "bg-surface-alt"}`}
    >
      {message.role === "user" ? (
        <UserAvatar name="Orzen Demo" size={28} />
      ) : (
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-control bg-accent/10 text-accent">
          <Bot size={15} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-tiny font-medium">
            {message.role === "user" ? "You" : `${modelName} · simulated`}
          </span>
          <time className="text-[10px] text-muted">{message.time.slice(11, 16)} UTC</time>
        </div>
        <div className="text-label leading-relaxed">
          <MarkdownText content={message.content} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            aria-label={`Copy ${message.role} message`}
            onClick={copy}
          >
            <Copy size={11} />
            Copy
          </Button>
          {notice && (
            <span role="status" className="text-tiny text-muted">
              {notice}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
