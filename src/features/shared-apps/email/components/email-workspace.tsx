"use client";
import { useState } from "react";
import {
  ArchiveRestore,
  FilePenLine,
  Inbox,
  Mail,
  MailOpen,
  Paperclip,
  Plus,
  Send,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { UserAvatar } from "@/components/ui/user-avatar";
import { AppField, AppTitle, SharedWorkspace } from "../../common/workspace";
import { AttachmentPreview, readAttachment, type Attachment } from "../../common/attachment";
import { dateLabel, stamp, today, uid } from "../../common/store";
import { additionalMail } from "../sample-mail";
import { emailStore } from "../demo-service";
import type { Mail as MailRecord } from "../types";
function Compose({
  mail,
  onClose,
  onSaved,
}: {
  mail?: MailRecord;
  onClose: () => void;
  onSaved: (sent: boolean) => void;
}) {
  const { update } = emailStore.useStore(),
    [to, setTo] = useState(mail?.to || ""),
    [subject, setSubject] = useState(mail?.subject || ""),
    [body, setBody] = useState(mail?.body || ""),
    [attachments, setAttachments] = useState<Attachment[]>(mail?.attachments || []),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  function save(sent: boolean) {
    if (
      sent &&
      (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to.trim()) || !subject.trim() || !body.trim())
    ) {
      setError("Enter a valid recipient, subject and message before demo sending.");
      return;
    }
    const err = update((d) => {
      const saved: MailRecord = {
        id: mail?.id || uid(),
        from: "orzen@example.com",
        sender: "Orzen Demo",
        to: to.trim(),
        subject: subject.trim() || "(No subject)",
        body,
        date: stamp(),
        folder: sent ? "Sent" : "Drafts",
        previous: sent ? "Sent" : "Drafts",
        read: true,
        starred: mail?.starred || false,
        attachments,
      };
      const i = d.messages.findIndex((m) => m.id === saved.id);
      if (i < 0) d.messages.unshift(saved);
      else d.messages[i] = saved;
    });
    if (err) setError(err);
    else onSaved(sent);
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-control border border-border bg-surface-alt p-3">
        <UserAvatar name="Orzen Demo" size={28} />
        <div>
          <p className="text-label font-medium">Orzen Demo</p>
          <p className="text-[10px] text-muted">From orzen@example.com · local outbox</p>
        </div>
      </div>
      <AppField label="To">
        <Input
          type="email"
          maxLength={200}
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="teammate@example.com"
        />
      </AppField>
      <AppField label="Subject">
        <Input maxLength={200} value={subject} onChange={(e) => setSubject(e.target.value)} />
      </AppField>
      <AppField label="Email message">
        <textarea
          maxLength={12000}
          className="min-h-56 rounded-control border border-border bg-surface p-2 text-label outline-accent"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </AppField>
      <label className="block cursor-pointer text-tiny text-accent">
        <Paperclip size={12} className="inline" /> Attach local file
        <input
          aria-label="Email attachment"
          className="sr-only"
          type="file"
          disabled={loading}
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setLoading(true);
            try {
              if (attachments.length >= 3) throw new Error("Use up to three attachments.");
              setAttachments([...attachments, await readAttachment(f)]);
              setError("");
            } catch (err) {
              setError(err instanceof Error ? err.message : "Unable to read file");
            } finally {
              setLoading(false);
              e.target.value = "";
            }
          }}
        />
      </label>
      {attachments.map((a, i) => (
        <div key={i} className="flex items-center justify-between gap-2 text-tiny">
          <span className="break-all">{a.name}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setAttachments(attachments.filter((_, index) => index !== i))}
          >
            Remove
          </Button>
        </div>
      ))}
      <p className="text-[10px] text-muted">
        Sending updates the local Sent folder only. No email is delivered.
      </p>
      {error && (
        <p role="alert" className="text-label text-danger">
          {error}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="outline" disabled={loading} onClick={() => save(false)}>
          Save draft
        </Button>
        <Button disabled={loading} onClick={() => save(true)}>
          <Send size={12} />
          Send demo email
        </Button>
      </div>
    </div>
  );
}
import { MailDetails } from "./mail-details";
export function EmailWorkspace() {
  const { data, warning, update } = emailStore.useStore();
  const [folder, setFolder] = useState("Inbox"),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all"),
    [sort, setSort] = useState("newest"),
    [selected, setSelected] = useState(""),
    [compose, setCompose] = useState<string | null>(null),
    [reply, setReply] = useState<MailRecord | null>(null),
    [preview, setPreview] = useState<Attachment | null>(null),
    [notice, setNotice] = useState(""),
    [checked, setChecked] = useState<string[]>([]);
  const [related, setRelated] = useState("");
  const relatedMail = data.messages.find((m) => m.id === related);
  const mail = data.messages.find((m) => m.id === selected);
  const rows = data.messages
    .filter(
      (m) =>
        (folder === "Starred" ? m.starred && m.folder !== "Trash" : m.folder === folder) &&
        `${m.subject} ${m.sender} ${m.from} ${m.body}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (filter === "all" ||
          (filter === "unread"
            ? !m.read
            : filter === "starred"
              ? m.starred
              : m.attachments.length > 0)),
    )
    .sort((a, b) =>
      sort === "subject"
        ? a.subject.localeCompare(b.subject)
        : sort === "oldest"
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date),
    );
  const checkedRows = rows.filter((m) => checked.includes(m.id)),
    current = rows.findIndex((m) => m.id === selected),
    unread = data.messages.filter((m) => m.folder === "Inbox" && !m.read).length;
  const inbox = data.messages.filter((m) => m.folder === "Inbox"),
    latest = [...inbox].sort((a, b) => b.date.localeCompare(a.date));
  const missingSamples = additionalMail.filter(
    (sample) => !data.messages.some((m) => m.id === sample.id),
  );
  function patch(id: string, fn: (m: MailRecord) => void) {
    const error = update((d) => {
      const m = d.messages.find((m) => m.id === id);
      if (m) fn(m);
    });
    setNotice(error);
    return error;
  }
  function open(m: MailRecord) {
    if (m.folder === "Drafts") {
      setReply(null);
      setCompose(m.id);
      return;
    }
    setSelected(m.id);
    setRelated(m.id);
    patch(m.id, (m) => {
      m.read = true;
    });
  }
  function jumpTo(m: MailRecord) {
    setFolder(m.folder);
    setQuery("");
    setFilter("all");
    setChecked([]);
    open(m);
  }
  function newMail() {
    setReply(null);
    setCompose("new");
  }
  function respond(forward: boolean, source = mail) {
    if (!source) return;
    setReply({
      ...source,
      id: "",
      to: forward ? "" : source.from === "orzen@example.com" ? source.to : source.from,
      subject: `${forward ? "Fwd" : "Re"}: ${source.subject}`,
      body: `\n\n----- ${forward ? "Forwarded" : "Original"} message -----\nFrom: ${source.from}\nDate: ${source.date}\nSubject: ${source.subject}\n\n${source.body}`,
      attachments: forward ? source.attachments : [],
      starred: false,
    });
    setCompose(forward ? "forward" : "reply");
  }
  function bulk(action: "read" | "trash" | "restore") {
    const ids = checkedRows.map((m) => m.id);
    const error = update((d) => {
      d.messages
        .filter((m) => ids.includes(m.id))
        .forEach((m) => {
          if (action === "read") m.read = true;
          else if (action === "restore") m.folder = m.previous;
          else if (m.folder !== "Trash") {
            m.previous = m.folder;
            m.folder = "Trash";
          }
        });
    });
    setNotice(
      error ||
        `${ids.length} local messages ${action === "read" ? "marked read" : action === "restore" ? "restored" : "moved to Trash"}.`,
    );
    if (!error) {
      setChecked([]);
      if (action !== "read") setSelected("");
    }
  }
  return (
    <SharedWorkspace
      title="Email"
      description="Your business inbox, saved drafts and local correspondence."
      warning={warning}
      actions={
        <Button onClick={newMail}>
          <Plus size={13} />
          Compose Mail
        </Button>
      }
    >
      <div className="grid items-start gap-widget lg:grid-cols-[250px_minmax(0,1fr)]">
        <Card title={<AppTitle icon={Inbox}>Mailboxes</AppTitle>}>
          <div className="mt-3 flex items-center gap-2 border-b border-border pb-3">
            <UserAvatar name="Orzen Demo" size={32} />
            <div className="min-w-0">
              <p className="text-label font-medium">Orzen Demo</p>
              <p className="truncate text-[10px] text-muted">orzen@example.com</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1 lg:flex-col">
            {[
              { name: "Inbox", icon: Inbox },
              { name: "Sent", icon: Send },
              { name: "Drafts", icon: FilePenLine },
              { name: "Starred", icon: Star },
              { name: "Trash", icon: Trash2 },
            ].map(({ name, icon: Icon }) => (
              <button
                key={name}
                aria-pressed={folder === name}
                onClick={() => {
                  setFolder(name);
                  setSelected("");
                  setChecked([]);
                }}
                className={`flex items-center gap-2 rounded-control border p-2.5 text-left text-label ${folder === name ? "border-accent/20 bg-accent/5 text-accent" : "border-transparent hover:bg-surface-alt"}`}
              >
                <Icon size={14} />
                <span className="flex-1">{name}</span>
                <span className="rounded-control bg-surface-alt px-1.5 py-0.5 text-[10px] text-muted">
                  {
                    data.messages.filter((m) =>
                      name === "Starred" ? m.starred && m.folder !== "Trash" : m.folder === name,
                    ).length
                  }
                </span>
              </button>
            ))}
          </div>
          <div className="mt-5 border-t border-border pt-3">
            <p className="text-[10px] uppercase tracking-wide text-muted">Inbox overview</p>
            <p className="mt-2 text-label">
              <strong className="font-semibold text-accent">{unread}</strong> unread messages
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-[10px] uppercase tracking-wide text-muted">
                Recent correspondents
              </p>
              {latest
                .filter((m, index) => latest.findIndex((other) => other.from === m.from) === index)
                .slice(0, 4)
                .map((m) => (
                  <button
                    key={m.from}
                    onClick={() => jumpTo(m)}
                    className="flex w-full items-center gap-2 rounded-control p-1 text-left hover:bg-surface-alt"
                  >
                    <UserAvatar name={m.sender} size={24} className="h-6 w-6" />
                    <span className="truncate text-tiny">{m.sender}</span>
                  </button>
                ))}
            </div>
            {missingSamples.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="mt-4 w-full"
                onClick={() =>
                  setNotice(
                    update((d) => {
                      d.messages.push(
                        ...additionalMail.filter(
                          (sample) => !d.messages.some((m) => m.id === sample.id),
                        ),
                      );
                    }) || "Additional sample mail added. Existing messages were preserved.",
                  )
                }
              >
                Add sample mail
              </Button>
            )}
            <p className="mt-4 flex items-start gap-1.5 text-[10px] text-muted">
              <ShieldCheck size={13} className="shrink-0" />
              Local demo only. Sending stores a message in Sent; nothing is delivered.
            </p>
          </div>
        </Card>
        <Card
          title={<AppTitle icon={Mail}>{folder}</AppTitle>}
          action={
            <span className="text-tiny text-muted">
              {rows.length} messages · {rows.filter((m) => !m.read).length} unread
            </span>
          }
        >
          <div className="my-3 flex flex-wrap gap-2">
            <Input
              aria-label="Search email"
              placeholder="Search sender, subject or message…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1"
            />
            <Select
              aria-label="Email filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All messages</option>
              <option value="unread">Unread</option>
              <option value="attachments">With attachments</option>
              <option value="starred">Starred messages</option>
            </Select>
            <Select aria-label="Email sort" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="subject">Subject A–Z</option>
            </Select>
          </div>
          <div className="mb-3 flex justify-between flex-wrap items-center gap-1 border-b border-border pb-3">
            <div className="flex flex-wrap gap-2 items-center">
              <input
                type="checkbox"
                aria-label="Select all filtered emails"
                checked={rows.length > 0 && checkedRows.length === rows.length}
                onChange={(e) => setChecked(e.target.checked ? rows.map((m) => m.id) : [])}
              />
              <span className="text-[10px] text-muted">
                {checkedRows.length ? `${checkedRows.length} selected` : "Select messages"}
              </span>
              {checkedRows.length > 0 && (
                <>
                  <Button size="sm" variant="ghost" onClick={() => bulk("read")}>
                    <MailOpen size={12} />
                    Mark read
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => bulk(folder === "Trash" ? "restore" : "trash")}
                  >
                    {folder === "Trash" ? <ArchiveRestore size={12} /> : <Trash2 size={12} />}{" "}
                    {folder === "Trash" ? "Restore selected" : "Trash selected"}
                  </Button>
                </>
              )}
            </div>

            <div>
              {[
                { value: "all", label: "All mail" },
                { value: "unread", label: "Unread" },
                { value: "starred", label: "Starred" },
                { value: "attachments", label: "With files" },
              ].map((tab) => (
                <Button
                  key={tab.value}
                  size="sm"
                  variant={filter === tab.value ? "secondary" : "ghost"}
                  aria-pressed={filter === tab.value}
                  onClick={() => {
                    setFilter(tab.value);
                    setChecked([]);
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
          {notice && (
            <p
              role="status"
              className="mb-3 rounded-control bg-surface-alt p-2 text-label text-muted"
            >
              {notice}
            </p>
          )}
          <div className="min-w-0">
            <div className="min-w-0">
              <div className="max-h-[620px] space-y-1 overflow-y-auto">
                {rows.map((m, index) => (
                  <div key={m.id}>
                    {(index === 0 || m.date.slice(0, 10) !== rows[index - 1].date.slice(0, 10)) && (
                      <div className="mb-1 px-1 py-1 text-[10px] font-medium text-muted">
                        {m.date.startsWith(today) ? "Today" : dateLabel(m.date)}
                      </div>
                    )}
                    <div
                      className={`rounded-control border p-2.5 ${selected === m.id ? "border-accent/25 bg-accent/5" : !m.read ? "border-border bg-surface-alt/50" : "border-border hover:bg-surface-alt"}`}
                    >
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          aria-label={`Select email ${m.subject}`}
                          checked={checked.includes(m.id)}
                          onChange={(e) =>
                            setChecked(
                              e.target.checked
                                ? [...checked, m.id]
                                : checked.filter((id) => id !== m.id),
                            )
                          }
                          className="mt-2"
                        />
                        <UserAvatar name={m.sender} size={28} className="h-7 w-7 self-start" />
                        <button onClick={() => open(m)} className="min-w-0 flex-1 text-left">
                          <div className="flex justify-between gap-2">
                            <p
                              className={`truncate text-label ${!m.read ? "font-semibold" : "font-medium"}`}
                            >
                              {m.sender}
                            </p>
                            <time className="shrink-0 text-[9px] text-muted">
                              {m.date.slice(5, 10)}
                            </time>
                          </div>
                          <p className={`mt-1 truncate text-label ${!m.read ? "font-medium" : ""}`}>
                            {m.subject}
                          </p>
                          <p className="mt-1 truncate text-[10px] text-muted">
                            {m.body.trim() || "Empty draft"}
                          </p>
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between pl-12">
                        <span className="inline-flex items-center gap-1 text-[9px] text-muted">
                          {!m.read && <i className="h-1.5 w-1.5 rounded-full bg-accent" />}
                          {!m.read ? "Unread" : m.folder}
                          {m.attachments.length > 0 && (
                            <>
                              <Paperclip size={10} />
                              {m.attachments.length}
                            </>
                          )}
                        </span>
                        <button
                          aria-label={`${m.starred ? "Unstar" : "Star"} ${m.subject}`}
                          aria-pressed={m.starred}
                          onClick={() =>
                            patch(m.id, (m) => {
                              m.starred = !m.starred;
                            })
                          }
                          className="rounded p-1 text-accent hover:bg-surface"
                        >
                          <Star size={12} fill={m.starred ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {!rows.length && (
                  <div className="grid min-h-52 place-content-center text-center">
                    <Inbox size={27} className="mx-auto text-muted" />
                    <p className="mt-3 text-label text-muted">No messages in this selection.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Dialog
        open={!!relatedMail}
        variant="offcanvas"
        title="Mail details"
        onClose={() => setRelated("")}
      >
        {relatedMail && (
          <MailDetails
            mail={relatedMail}
            related={data.messages
              .filter(
                (m) =>
                  m.id !== relatedMail.id &&
                  m.from === relatedMail.from &&
                  m.folder !== "Trash" &&
                  m.folder !== "Drafts",
              )
              .slice(0, 3)}
            position={current}
            count={rows.length}
            onPrevious={() => open(rows[current - 1])}
            onNext={() => open(rows[current + 1])}
            onOpen={open}
            onAttachment={setPreview}
            onStar={() =>
              patch(relatedMail.id, (m) => {
                m.starred = !m.starred;
              })
            }
            onRead={() =>
              patch(relatedMail.id, (m) => {
                m.read = !m.read;
              })
            }
            onReply={() => respond(false, relatedMail)}
            onForward={() => respond(true, relatedMail)}
            onTrash={() => {
              if (
                !patch(relatedMail.id, (m) => {
                  if (m.folder === "Trash") m.folder = m.previous;
                  else {
                    m.previous = m.folder as MailRecord["previous"];
                    m.folder = "Trash";
                  }
                })
              )
                setRelated("");
            }}
          />
        )}
      </Dialog>
      <Dialog
        open={compose !== null}
        title={
          compose === "new"
            ? "Compose demo email"
            : compose === "reply"
              ? "Reply to email"
              : compose === "forward"
                ? "Forward email"
                : "Edit draft"
        }
        onClose={() => setCompose(null)}
      >
        {compose !== null && (
          <Compose
            key={compose}
            mail={data.messages.find((m) => m.id === compose) || reply || undefined}
            onClose={() => setCompose(null)}
            onSaved={(sent) => {
              setCompose(null);
              setRelated("");
              setReply(null);
              setFolder(sent ? "Sent" : "Drafts");
              setSelected("");
              setChecked([]);
              setQuery("");
              setFilter("all");
              setNotice(
                sent ? "Demo email saved to Sent. Nothing was delivered." : "Draft saved locally.",
              );
            }}
          />
        )}
      </Dialog>
      <Dialog open={!!preview} title="Email attachment preview" onClose={() => setPreview(null)}>
        {preview && <AttachmentPreview attachment={preview} />}
      </Dialog>
    </SharedWorkspace>
  );
}
