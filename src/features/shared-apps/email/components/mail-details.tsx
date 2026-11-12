"use client";
import {
  ArchiveRestore,
  ChevronLeft,
  ChevronRight,
  FileText,
  Forward,
  MailOpen,
  Paperclip,
  Reply,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { dateLabel } from "../../common/store";
import type { Attachment } from "../../common/attachment";
import type { Mail } from "../types";
type Props = {
  mail: Mail;
  related: Mail[];
  position: number;
  count: number;
  onPrevious: () => void;
  onNext: () => void;
  onStar: () => void;
  onRead: () => void;
  onTrash: () => void;
  onReply: () => void;
  onForward: () => void;
  onOpen: (mail: Mail) => void;
  onAttachment: (file: Attachment) => void;
};
export function MailDetails({
  mail,
  related,
  position,
  count,
  onPrevious,
  onNext,
  onStar,
  onRead,
  onTrash,
  onReply,
  onForward,
  onOpen,
  onAttachment,
}: Props) {
  return (
    <div className="flex min-h-0 flex-1 flex-col font-admin text-foreground">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-surface-alt px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-tiny font-medium">
            <MailOpen size={12} className="text-muted" />
            {mail.folder}
          </span>
          <span className="text-[10px] text-muted">
            {position >= 0 ? `${position + 1} of ${count}` : "Related message"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            aria-label="Previous email"
            disabled={position <= 0}
            onClick={onPrevious}
          >
            <ChevronLeft size={14} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Next email"
            disabled={position < 0 || position >= count - 1}
            onClick={onNext}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
      <div
        role="region"
        aria-label="Mail content"
        tabIndex={0}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-4 outline-accent sm:px-5"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="min-w-0 break-words text-[20px] font-semibold leading-snug">
            {mail.subject}
          </h2>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Star related mail"
            aria-pressed={mail.starred}
            onClick={onStar}
            className="shrink-0"
          >
            <Star size={15} fill={mail.starred ? "currentColor" : "none"} />
          </Button>
        </div>
        <div className="mt-4 rounded-control border border-border bg-surface-alt p-3">
          <div className="flex items-start gap-2.5">
            <UserAvatar name={mail.sender} size={34} className="h-[34px] w-[34px] shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                <p className="text-label font-medium">{mail.sender}</p>
                <time dateTime={mail.date} className="text-[10px] text-muted">
                  {dateLabel(mail.date)} · {mail.date.slice(11, 16)} UTC
                </time>
              </div>
              <p className="mt-1 break-all text-tiny text-muted">{mail.from}</p>
            </div>
          </div>
          <div className="mt-2 flex gap-2 border-t border-border pt-2 text-[10px] text-muted">
            <span className="shrink-0">To</span>
            <span className="break-all">{mail.to || "No recipient"}</span>
          </div>
        </div>
        <div className="py-5">
          <p className="whitespace-pre-wrap break-words text-[13px] leading-[1.75] [overflow-wrap:anywhere]">
            {mail.body || "This message has no body."}
          </p>
        </div>
        {mail.attachments.length > 0 && (
          <section className="border-t border-border py-4">
            <h3 className="mb-2.5 flex items-center gap-1.5 text-label font-medium">
              <Paperclip size={13} />
              {mail.attachments.length} attachment{mail.attachments.length === 1 ? "" : "s"}
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {mail.attachments.map((a, i) => (
                <button
                  key={i}
                  onClick={() => onAttachment(a)}
                  className="flex items-start gap-2.5 rounded-control border border-border p-3 text-left transition-colors hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-control bg-accent/10 text-accent">
                    <FileText size={17} />
                  </span>
                  <span className="min-w-0">
                    <span className="block break-all text-label font-medium">{a.name}</span>
                    <span className="mt-1 block text-[10px] text-muted">
                      {a.size < 1024 ? `${a.size} B` : `${(a.size / 1024).toFixed(1)} KB`} · Preview
                      file
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}
        {related.length > 0 && (
          <section className="border-t border-border pt-4">
            <h3 className="mb-2 text-label font-medium">More from this sender</h3>
            <div className="divide-y divide-border">
              {related.map((m) => (
                <button
                  key={m.id}
                  aria-label={`Read related mail: ${m.subject}`}
                  onClick={() => onOpen(m)}
                  className="flex w-full items-center gap-2 py-3 text-left hover:text-accent"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block break-words text-label">{m.subject}</span>
                    <time className="mt-1 block text-[10px] text-muted">{dateLabel(m.date)}</time>
                  </span>
                  <ChevronRight size={13} className="shrink-0 text-muted" />
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
      <footer className="shrink-0 border-t border-border bg-surface px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <Button onClick={onReply}>
              <Reply size={13} />
              Reply
            </Button>
            <Button variant="outline" onClick={onForward}>
              <Forward size={13} />
              Forward
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={onRead}>
              {mail.read ? "Mark unread" : "Mark read"}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label={mail.folder === "Trash" ? "Restore" : "Move to trash"}
              title={mail.folder === "Trash" ? "Restore" : "Move to trash"}
              onClick={onTrash}
            >
              {mail.folder === "Trash" ? <ArchiveRestore size={14} /> : <Trash2 size={14} />}
            </Button>
          </div>
        </div>
        <p className="mt-2 text-[10px] text-muted">
          Local demo · replies and forwards are not delivered externally.
        </p>
      </footer>
    </div>
  );
}
