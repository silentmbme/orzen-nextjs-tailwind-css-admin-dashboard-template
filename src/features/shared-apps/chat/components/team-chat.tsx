"use client";
import { useEffect, useRef, useState } from "react";
import {
  Phone,
  PhoneOff,
  Video,
  Mic,
  MicOff,
  Check,
  CheckCheck,
  Copy,
  FileText,
  Info,
  MessageSquare,
  Paperclip,
  Search,
  Send,
  ShieldCheck,
  Smile,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { UserAvatar } from "@/components/ui/user-avatar";
import { SharedWorkspace, AppTitle } from "../../common/workspace";
import { readAttachment, AttachmentPreview, type Attachment } from "../../common/attachment";
import { dateLabel, stamp, today, uid } from "../../common/store";
import { chatStore } from "../demo-service";

export function TeamChat() {
  const { data, warning, update } = chatStore.useStore();
  const [selected, setSelected] = useState("alex"),
    [query, setQuery] = useState(""),
    [unreadOnly, setUnreadOnly] = useState(false),
    [text, setText] = useState(""),
    [attachment, setAttachment] = useState<Attachment | null>(null),
    [preview, setPreview] = useState<Attachment | null>(null),
    [remove, setRemove] = useState(""),
    [notice, setNotice] = useState(""),
    [contacts, setContacts] = useState(false),
    [details, setDetails] = useState(true),
    [emoji, setEmoji] = useState(false),
    [loading, setLoading] = useState(false),
    [searching, setSearching] = useState(false),
    [messageQuery, setMessageQuery] = useState("");
  const [call, setCall] = useState<"audio" | "video" | null>(null),
    [muted, setMuted] = useState(false);
  const contact = data.contacts.find((c) => c.id === selected);
  const messages = data.messages.filter((m) => m.contactId === selected);
  const visibleMessages = messages.filter((m) =>
    `${m.text} ${m.attachment?.name || ""}`.toLowerCase().includes(messageQuery.toLowerCase()),
  );
  const filteredContacts = data.contacts.filter(
    (c) =>
      `${c.name} ${c.role}`.toLowerCase().includes(query.toLowerCase()) &&
      (!unreadOnly || c.unread > 0),
  );
  const files = messages.filter((m) => m.attachment);
  const scroll = useRef<HTMLDivElement>(null),
    composer = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (contact?.unread)
      update((d) => {
        const c = d.contacts.find((c) => c.id === selected);
        if (c) c.unread = 0;
      });
  }, [selected, contact?.unread, update]);
  useEffect(() => {
    scroll.current?.scrollTo({
      top: scroll.current.scrollHeight,
      behavior: "instant",
    });
  }, [selected, messages.length]);
  function select(id: string) {
    setSelected(id);
    setText("");
    setAttachment(null);
    setContacts(false);
    setEmoji(false);
    setMessageQuery("");
    setSearching(false);
    setNotice(
      update((d) => {
        d.contacts.find((c) => c.id === id)!.unread = 0;
      }),
    );
  }
  function send() {
    if (!contact || loading || (!text.trim() && !attachment)) return;
    const error = update((d) => {
      d.messages.push({
        id: uid(),
        contactId: selected,
        own: true,
        text: text.trim(),
        attachment,
        time: stamp(),
        status: "Saved locally",
      });
      d.contacts.find((c) => c.id === selected)!.unread = 0;
    });
    setNotice(error || "Message saved locally. No real-time delivery is connected.");
    if (!error) {
      setText("");
      setAttachment(null);
      setEmoji(false);
      setMessageQuery("");
      composer.current?.focus();
    }
  }
  return (
    <SharedWorkspace
      title="Team chat"
      description="Your team conversations, shared files and local message history."
      warning={warning}
      actions={
        <>
          <Button
            variant="outline"
            onClick={() => setContacts(!contacts)}
            aria-expanded={contacts}
            aria-controls="team-conversations"
          >
            <Users size={13} />
            Conversations
          </Button>
          <Button
            variant={details ? "secondary" : "outline"}
            onClick={() => setDetails(!details)}
            aria-expanded={details}
          >
            <Info size={13} />
            Contact details
          </Button>
        </>
      }
    >
      <div
        className={`grid items-start gap-widget lg:grid-cols-[240px_minmax(0,1fr)] ${details ? "xl:grid-cols-[240px_minmax(0,1fr)_230px]" : ""}`}
      >
        <div id="team-conversations" className={`${contacts ? "block" : "hidden"} lg:block`}>
          <Card
            title={<AppTitle icon={Users}>Team conversations</AppTitle>}
            action={
              <span className="rounded-control bg-surface-alt px-1.5 py-1 text-[10px] text-muted">
                {data.contacts.length}
              </span>
            }
          >
            <Input
              aria-label="Search team conversations"
              className="mt-3 w-full"
              placeholder="Find a teammate or role…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted">Team directory</p>
              <span className="text-[10px] text-muted">Sample presence</span>
            </div>
            <div className="mt-2 flex gap-3 border-b border-border pb-4">
              {data.contacts.map((c) => (
                <button
                  key={c.id}
                  aria-label={`Open conversation with ${c.name}`}
                  onClick={() => select(c.id)}
                  className="relative rounded-full focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <UserAvatar name={c.name} size={33} className="h-[33px] w-[33px]" />
                  <i
                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface ${c.status === "Available" ? "bg-success" : "bg-muted"}`}
                  />
                </button>
              ))}
            </div>
            <div className="my-3 flex gap-1">
              <Button
                size="sm"
                variant={!unreadOnly ? "secondary" : "ghost"}
                aria-pressed={!unreadOnly}
                onClick={() => setUnreadOnly(false)}
              >
                All messages
              </Button>
              <Button
                size="sm"
                variant={unreadOnly ? "secondary" : "ghost"}
                aria-pressed={unreadOnly}
                onClick={() => setUnreadOnly(true)}
              >
                Unread
                <span className="text-[10px] text-muted">
                  {data.contacts.filter((c) => c.unread > 0).length}
                </span>
              </Button>
            </div>
            <div className="max-h-[440px] space-y-1 overflow-y-auto">
              {filteredContacts.map((c) => {
                const last = data.messages.filter((m) => m.contactId === c.id).at(-1);
                return (
                  <button
                    key={c.id}
                    aria-pressed={selected === c.id}
                    onClick={() => select(c.id)}
                    className={`flex w-full items-center gap-2 rounded-control border p-2.5 text-left ${selected === c.id ? "border-accent/30 bg-accent/5" : "border-transparent hover:bg-surface-alt"}`}
                  >
                    <UserAvatar name={c.name} size={33} className="h-[33px] w-[33px]" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-1">
                        <span className="truncate text-label font-medium">{c.name}</span>
                        <time className="shrink-0 text-[9px] text-muted">
                          {last?.time.slice(11, 16)}
                        </time>
                      </span>
                      <span className="mt-1 block truncate text-[10px] text-muted">
                        {last
                          ? `${last.own ? "You: " : ""}${last.text || last.attachment?.name}`
                          : "Start a conversation"}
                      </span>
                    </span>
                    {c.unread > 0 && (
                      <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] text-white">
                        {c.unread}
                      </span>
                    )}
                  </button>
                );
              })}
              {!filteredContacts.length && (
                <p className="rounded-control border border-dashed border-border p-3 text-label text-muted">
                  {unreadOnly
                    ? "No unread conversations match this search."
                    : "No matching teammates."}
                </p>
              )}
            </div>
            <p className="mt-4 flex items-start gap-1.5 border-t border-border pt-3 text-[10px] text-muted">
              <ShieldCheck size={13} className="shrink-0 text-accent" />
              Local demo workspace. No messages leave this browser.
            </p>
          </Card>
        </div>

        <Card
          title={
            <span className="inline-flex items-center gap-2">
              <span className="relative">
                <UserAvatar name={contact?.name} size={32} className="h-8 w-8" />
                <i
                  className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-surface ${contact?.status === "Available" ? "bg-success" : "bg-muted"}`}
                />
              </span>
              <span>
                <span className="block text-body font-medium normal-case">
                  {contact?.name || "Conversation"}
                </span>
                <span className="mt-0.5 block text-[10px] font-normal normal-case text-muted">
                  {contact?.role} · {contact?.status} (sample)
                </span>
              </span>
            </span>
          }
          action={
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                aria-label="Search conversation"
                aria-expanded={searching}
                onClick={() => {
                  setSearching(!searching);
                  setMessageQuery("");
                }}
              >
                <Search size={15} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Video call"
                title="Video call (demo)"
                onClick={() => {
                  setMuted(false);
                  setCall("video");
                }}
              >
                <Video size={15} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Audio call"
                title="Audio call (demo)"
                onClick={() => {
                  setMuted(false);
                  setCall("audio");
                }}
              >
                <Phone size={15} />
              </Button>
            </div>
          }
        >
          {searching && (
            <Input
              aria-label="Search current messages"
              className="mt-3 w-full"
              placeholder="Search messages or shared files…"
              value={messageQuery}
              onChange={(e) => setMessageQuery(e.target.value)}
            />
          )}
          <div
            ref={scroll}
            role="log"
            aria-label="Team messages"
            className="mt-3 h-[420px] space-y-4 overflow-y-auto rounded-control bg-surface-alt/50 p-2 sm:p-3"
          >
            {visibleMessages.map((m, index) => (
              <div key={m.id}>
                {(index === 0 ||
                  visibleMessages[index - 1].time.slice(0, 10) !== m.time.slice(0, 10)) && (
                  <div className="mb-4 flex items-center gap-3 text-[10px] text-muted">
                    <span className="h-px flex-1 bg-border" />
                    <span>
                      {m.time.startsWith(today) ? "Today" : dateLabel(m.time)} ·{" "}
                      {m.time.slice(0, 10)}
                    </span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                )}
                <article className={`flex items-start gap-2 ${m.own ? "flex-row-reverse" : ""}`}>
                  <UserAvatar
                    name={m.own ? "Orzen Demo" : contact?.name}
                    size={27}
                    className="h-[27px] w-[27px] self-start"
                  />
                  <div className="min-w-0 max-w-[85%]">
                    <p className={`mb-1 text-[10px] text-muted ${m.own ? "text-right" : ""}`}>
                      {m.own ? "You" : contact?.name}
                    </p>
                    <div
                      className={`rounded-card border p-3 ${m.own ? "rounded-tr-none border-accent/20 bg-accent/10" : "rounded-tl-none border-border bg-surface"}`}
                    >
                      <p className="whitespace-pre-wrap break-words text-label leading-relaxed [overflow-wrap:anywhere]">
                        {m.text}
                      </p>
                      {m.attachment && (
                        <button
                          onClick={() => setPreview(m.attachment)}
                          className="mt-2 flex w-full items-center gap-2 rounded-control border border-border bg-surface-alt p-2 text-left text-tiny"
                        >
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-control bg-surface text-accent">
                            <FileText size={15} />
                          </span>
                          <span className="min-w-0">
                            <span className="block break-all font-medium">{m.attachment.name}</span>
                            <span className="mt-0.5 block text-[9px] text-muted">
                              {(m.attachment.size / 1024).toFixed(1)} KB · Preview attachment
                            </span>
                          </span>
                        </button>
                      )}
                    </div>
                    <div
                      className={`mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-muted ${m.own ? "justify-end" : ""}`}
                    >
                      <time>{m.time.slice(11, 16)} UTC</time>
                      {m.own && (
                        <span className="inline-flex items-center gap-1">
                          {m.status === "Read" ? <CheckCheck size={12} /> : <Check size={12} />}{" "}
                          {m.status}
                        </span>
                      )}
                      <button
                        className="rounded p-1 hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-accent"
                        aria-label={`Copy message ${m.id}`}
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(m.text);
                            setNotice("Message copied.");
                          } catch {
                            setNotice("Clipboard unavailable. Select the text to copy.");
                          }
                        }}
                      >
                        <Copy size={11} />
                      </button>
                      {m.own && (
                        <button
                          className="rounded p-1 hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-accent"
                          aria-label={`Delete message ${m.id}`}
                          onClick={() => setRemove(m.id)}
                        >
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            ))}
            {!visibleMessages.length && (
              <div className="grid min-h-80 place-content-center text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-card border border-border bg-surface text-accent">
                  <MessageSquare size={23} />
                </span>
                <p className="mt-3 text-label font-medium">
                  {messageQuery
                    ? "No matching messages."
                    : `Start a conversation with ${contact?.name}.`}
                </p>
                <p className="mt-1 text-[10px] text-muted">
                  {messageQuery
                    ? "Try another phrase or clear the conversation search."
                    : "Share a thought, an update or a file."}
                </p>
              </div>
            )}
          </div>
          {notice && (
            <p role="status" className="my-2 text-tiny text-muted">
              {notice}
            </p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="mt-3 rounded-card border border-border bg-surface p-3 focus-within:border-accent"
          >
            <textarea
              ref={composer}
              aria-label="Team message"
              maxLength={4000}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={`Message ${contact?.name.split(" ")[0] || "your teammate"}…`}
              className="min-h-16 w-full resize-y bg-transparent text-label outline-none"
            />
            {attachment && (
              <div className="my-2 flex items-center justify-between gap-2 rounded-control bg-surface-alt p-2 text-tiny">
                <span className="flex min-w-0 items-center gap-1">
                  <Paperclip size={12} />
                  <span className="break-all">{attachment.name}</span>
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Remove attachment"
                  onClick={() => setAttachment(null)}
                >
                  <X size={12} />
                </Button>
              </div>
            )}
            {emoji && (
              <div className="my-2 flex flex-wrap gap-1 rounded-control border border-border bg-surface-alt p-1">
                {["😊", "👍", "🎉", "✅", "👋"].map((icon) => (
                  <Button
                    key={icon}
                    variant="ghost"
                    aria-label={`Insert ${icon}`}
                    onClick={() => {
                      setText(text + icon);
                      setEmoji(false);
                      composer.current?.focus();
                    }}
                  >
                    {icon}
                  </Button>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2">
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Choose emoji"
                  aria-expanded={emoji}
                  onClick={() => setEmoji(!emoji)}
                >
                  <Smile size={15} />
                </Button>
                <label className="cursor-pointer rounded-control p-1 text-tiny text-muted focus-within:outline-2 focus-within:outline-accent">
                  <Paperclip size={14} className="mr-1 inline" />
                  Attach file
                  <input
                    aria-label="Team attachment"
                    type="file"
                    className="sr-only"
                    disabled={loading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setLoading(true);
                      try {
                        setAttachment(await readAttachment(file));
                        setNotice("");
                      } catch (err) {
                        setNotice(err instanceof Error ? err.message : "Unable to read file");
                      } finally {
                        setLoading(false);
                        e.target.value = "";
                      }
                    }}
                  />
                </label>
              </div>
              <Button type="submit" disabled={loading || (!text.trim() && !attachment)}>
                <Send size={12} />
                {loading ? "Reading file…" : "Send demo message"}
              </Button>
            </div>
            <p className="mt-2 text-[9px] text-muted">
              Ctrl / ⌘ + Enter to send · {text.length}/4,000 characters
            </p>
          </form>
        </Card>

        {details && (
          <div className="space-y-widget lg:col-span-2 xl:col-span-1">
            <Card title={<AppTitle icon={Info}>Contact details</AppTitle>}>
              <div className="mt-4 text-center">
                <div className="relative mx-auto w-fit">
                  <UserAvatar name={contact?.name} size={60} className="h-[60px] w-[60px]" />
                  <i
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface ${contact?.status === "Available" ? "bg-success" : "bg-muted"}`}
                  />
                </div>
                <p className="mt-3 text-body font-semibold">{contact?.name}</p>
                <p className="mt-1 text-tiny text-muted">{contact?.role}</p>
                <span className="mt-2 inline-block rounded-control bg-surface-alt px-2 py-1 text-[10px] text-muted">
                  {contact?.status} · demo presence
                </span>
              </div>
              <dl className="mt-4 space-y-3 border-t border-border pt-3 text-tiny">
                <div>
                  <dt className="text-muted">Email</dt>
                  <dd className="mt-1 break-all text-accent">{contact?.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Local messages</dt>
                  <dd>{messages.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Shared files</dt>
                  <dd>{files.length}</dd>
                </div>
              </dl>
            </Card>
            <Card title={<AppTitle icon={Paperclip}>Shared files</AppTitle>}>
              <div className="mt-3 space-y-2">
                {files
                  .slice(-4)
                  .reverse()
                  .map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPreview(m.attachment)}
                      className="flex w-full items-center gap-2 rounded-control border border-border p-2 text-left hover:bg-surface-alt"
                    >
                      <FileText size={16} className="shrink-0 text-accent" />
                      <span className="min-w-0">
                        <span className="block truncate text-tiny font-medium">
                          {m.attachment?.name}
                        </span>
                        <span className="mt-1 block text-[9px] text-muted">
                          {m.time.slice(0, 10)} · local attachment
                        </span>
                      </span>
                    </button>
                  ))}
                {!files.length && (
                  <p className="text-tiny text-muted">No files shared in this conversation.</p>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
      <Dialog
        open={!!call}
        title={call === "video" ? "Demo video call" : "Demo audio call"}
        onClose={() => setCall(null)}
      >
        <div className="space-y-4 text-center">
          <div className="rounded-card border border-border bg-surface-alt p-6">
            <UserAvatar name={contact?.name} size={64} className="mx-auto h-16 w-16" />
            <p className="mt-3 text-body font-semibold">{contact?.name}</p>
            <p className="mt-2 text-label text-muted">Local call preview · not connected</p>
          </div>
          <p className="text-label text-muted">
            No call is placed. Your microphone and camera are not accessed.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" aria-pressed={muted} onClick={() => setMuted(!muted)}>
              {muted ? <MicOff size={14} /> : <Mic size={14} />}
              {muted ? "Unmute demo microphone" : "Mute demo microphone"}
            </Button>
            <Button variant="destructive" onClick={() => setCall(null)}>
              <PhoneOff size={14} />
              End demo call
            </Button>
          </div>
        </div>
      </Dialog>
      <Dialog open={!!preview} title="Message attachment" onClose={() => setPreview(null)}>
        {preview && <AttachmentPreview attachment={preview} />}
      </Dialog>
      <Dialog open={!!remove} title="Delete message?" onClose={() => setRemove("")}>
        <p className="text-label text-muted">Remove this message from the local conversation?</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setRemove("")}>
            Keep message
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              const error = update((d) => {
                d.messages = d.messages.filter((m) => m.id !== remove);
              });
              setNotice(error || "Message deleted locally.");
              if (!error) setRemove("");
            }}
          >
            Confirm delete
          </Button>
        </div>
      </Dialog>
    </SharedWorkspace>
  );
}
