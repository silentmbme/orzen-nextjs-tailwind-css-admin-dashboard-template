"use client";

import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { useMemo, useState } from "react";
import {
  AlignLeft,
  Clipboard,
  Eye,
  FileText,
  ImagePlus,
  Maximize2,
  Paperclip,
  Save,
  Send,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { UserAvatar } from "@/components/ui/user-avatar";
import { EditorToolbar } from "./editor-toolbar";

const extensions = [
  StarterKit,
  Underline,
  Highlight,
  Link.configure({ openOnClick: false, autolink: true }),
];
const editorClass =
  "[&_.tiptap]:min-h-32 [&_.tiptap]:px-3 [&_.tiptap]:py-3 [&_.tiptap]:text-[10px] [&_.tiptap]:leading-5 [&_.tiptap]:outline-none [&_.tiptap_h2]:mb-2 [&_.tiptap_h2]:text-[15px] [&_.tiptap_h2]:font-semibold [&_.tiptap_p]:my-1 [&_.tiptap_ul]:my-2 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5 [&_.tiptap_ol]:my-2 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5 [&_.tiptap_blockquote]:my-2 [&_.tiptap_blockquote]:border-l-2 [&_.tiptap_blockquote]:border-accent [&_.tiptap_blockquote]:pl-3 [&_.tiptap_blockquote]:text-muted [&_.tiptap_mark]:bg-amber-200/60 [&_.tiptap_a]:text-accent [&_.tiptap_a]:underline";

function RichEditor({
  content,
  compact = false,
  bubble = false,
  paper = false,
  tall = false,
}: {
  content: string;
  compact?: boolean;
  bubble?: boolean;
  paper?: boolean;
  tall?: boolean;
}) {
  const editor = useEditor({ extensions, content, immediatelyRender: false });
  return (
    <div
      className={`${paper ? "mx-auto max-w-2xl border border-border bg-surface shadow-lg" : "overflow-hidden rounded-lg border border-border bg-surface"}`}
    >
      <EditorToolbar editor={editor} compact={compact} />
      {editor && bubble && (
        <BubbleMenu editor={editor} options={{ placement: "top" }}>
          <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
            <EditorToolbar editor={editor} compact />
          </div>
        </BubbleMenu>
      )}
      <EditorContent
        editor={editor}
        aria-label="Rich text editor"
        className={`${editorClass} ${tall ? "[&_.tiptap]:min-h-72" : compact ? "[&_.tiptap]:min-h-20" : ""}`}
      />
    </div>
  );
}

function MarkdownPreview({ source }: { source: string }) {
  const blocks = source.split("\n");
  return (
    <div className="min-h-52 p-4 text-[9px] leading-5">
      {blocks.map((line, index) => {
        if (line.startsWith("# "))
          return (
            <h2 key={index} className="mb-2 text-[15px] font-semibold">
              {line.slice(2)}
            </h2>
          );
        if (line.startsWith("## "))
          return (
            <h3 key={index} className="mb-1 mt-3 text-[11px] font-semibold">
              {line.slice(3)}
            </h3>
          );
        if (line.startsWith("- "))
          return (
            <div key={index} className="ml-3 flex gap-2">
              <span>•</span>
              <span>{line.slice(2)}</span>
            </div>
          );
        if (line.startsWith("`"))
          return (
            <code
              key={index}
              className="my-1 block rounded bg-surface-alt px-2 py-1 font-mono text-[8px]"
            >
              {line.replaceAll("`", "")}
            </code>
          );
        const parts = line.split("**");
        return (
          <p key={index} className="min-h-3">
            {parts.map((part, partIndex) =>
              partIndex % 2 ? <strong key={partIndex}>{part}</strong> : part,
            )}
          </p>
        );
      })}
    </div>
  );
}

const templates = {
  Announcement:
    "<h2>Product update</h2><p>Share a concise overview of what changed and why it matters.</p><ul><li>Key improvement</li><li>Availability</li><li>Next action</li></ul>",
  "Meeting Notes":
    "<h2>Weekly product review</h2><p><strong>Attendees:</strong> Product, Design, Engineering</p><ul><li>Decisions</li><li>Open questions</li><li>Action items</li></ul>",
  Proposal:
    "<h2>Project proposal</h2><p>Define the opportunity, approach, timeline, and expected outcome.</p><blockquote>Keep the recommendation measurable and focused.</blockquote>",
};

export function EditorShowcases() {
  const [markdown, setMarkdown] = useState(
    "# Product brief\n\nA **focused workspace** for modern teams.\n\n## Priorities\n- Clear navigation\n- Fast collaboration\n- Accessible controls\n\n`npm run build`",
  );
  const [inline, setInline] = useState("A concise product description for the workspace."),
    [draft, setDraft] = useState(inline),
    [editing, setEditing] = useState(false),
    [comment, setComment] = useState(""),
    [template, setTemplate] = useState<keyof typeof templates>("Announcement"),
    [copied, setCopied] = useState(false);
  const words = useMemo(() => markdown.trim().split(/\s+/).filter(Boolean).length, [markdown]);
  const code = "export function greet(name: string) {\n  return `Welcome, ${name}`;\n}";
  return (
    <div className="grid gap-3">
      <Card title="Classic rich text editor" action={<Badge>Functional toolbar</Badge>}>
        <RichEditor content="<h2>Quarterly operating plan</h2><p>Use the grouped toolbar to format this document with <strong>bold</strong>, <em>italic</em>, underline, headings, lists, quotes, links, highlight, undo, and redo.</p><blockquote>Build clarity before adding complexity.</blockquote><ul><li>Align team priorities</li><li>Document measurable outcomes</li></ul>" />
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Minimal editor">
          <RichEditor compact content="<p>Write a concise note or product description...</p>" />
        </Card>
        <Card title="Bubble editor" action={<Badge>Select text</Badge>}>
          <p className="mb-2 text-[8px] text-muted">
            Select text inside the editor to open its contextual toolbar.
          </p>
          <RichEditor
            bubble
            compact
            content="<p>Select this sentence to reveal a floating formatting toolbar for bold, italic, links, and highlights.</p>"
          />
        </Card>
      </div>

      <Card
        title="Document editor"
        action={<span className="text-[8px] text-muted">Draft saved locally · 428 words</span>}
      >
        <div className="rounded-xl bg-surface-alt p-3 sm:p-6">
          <div className="mx-auto mb-3 flex max-w-2xl items-center gap-2">
            <Input
              defaultValue="Designing calmer enterprise workflows"
              className="border-transparent! bg-transparent! px-0! text-[13px]! font-semibold"
            />
            <Button size="sm" variant="outline">
              <Save size={11} />
              Save demo
            </Button>
          </div>
          <RichEditor
            paper
            tall
            content="<h2>Designing for operational clarity</h2><p>Enterprise tools become useful when information, action, and feedback share a clear hierarchy.</p><p>This paper-style surface gives long-form writing deliberate space while preserving Orzen’s compact controls.</p><blockquote>Good workflow design reduces decisions without hiding important context.</blockquote><h2>Principles</h2><ol><li>Prioritize the current task.</li><li>Keep state visible.</li><li>Make recovery straightforward.</li></ol>"
          />
        </div>
      </Card>

      <Card title="Markdown editor" action={<Badge>{words} words</Badge>}>
        <div className="grid overflow-hidden rounded-lg border border-border lg:grid-cols-2">
          <div className="border-b border-border lg:border-b-0 lg:border-r">
            <div className="border-b border-border bg-surface-alt px-3 py-2 text-[8px] font-medium">
              MARKDOWN SOURCE
            </div>
            <textarea
              aria-label="Markdown source"
              value={markdown}
              onChange={(event) => setMarkdown(event.target.value)}
              className="min-h-64 w-full resize-y bg-surface p-4 font-mono text-[9px] leading-5 outline-none focus:ring-1 focus:ring-inset focus:ring-accent"
            />
          </div>
          <div>
            <div className="border-b border-border bg-surface-alt px-3 py-2 text-[8px] font-medium">
              SAFE STRUCTURED PREVIEW
            </div>
            <MarkdownPreview source={markdown} />
          </div>
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-[1.1fr_.9fr]">
        <Card title="Email composer" action={<Badge>Demo · not sent</Badge>}>
          <div className="grid gap-2">
            <label className="grid grid-cols-[62px_1fr] items-center border-b border-border text-[8px]">
              <span className="text-muted">To</span>
              <Input
                defaultValue="project-team@example.com"
                className="border-0! bg-transparent! px-0!"
              />
            </label>
            <label className="grid grid-cols-[62px_1fr] items-center border-b border-border text-[8px]">
              <span className="text-muted">Subject</span>
              <Input
                defaultValue="Release review and next steps"
                className="border-0! bg-transparent! px-0!"
              />
            </label>
            <RichEditor
              compact
              content="<p>Hello team,</p><p>The release review is ready. Please add comments before Thursday.</p><p>Thank you.</p>"
            />
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-alt px-2 py-1 text-[7px]">
                <Paperclip size={9} />
                release-notes.pdf <X size={8} />
              </span>
              <div className="ml-auto flex gap-2">
                <Button size="sm" variant="outline">
                  <Paperclip size={11} />
                  Attach
                </Button>
                <Button size="sm">
                  <Send size={11} />
                  Send demo
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Comment editor">
          <div className="flex gap-3">
            <UserAvatar name="Daniel Kim" size={34} />
            <div className="min-w-0 flex-1">
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                maxLength={280}
                placeholder="Add a thoughtful comment..."
                className="ui-input min-h-24 w-full resize-y py-2.5"
              />
              <div className="mt-2 flex items-center gap-1">
                <Button size="icon" variant="ghost" aria-label="Attach file">
                  <Paperclip size={12} />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Format text">
                  <AlignLeft size={12} />
                </Button>
                <span className="ml-auto text-[7px] text-muted">{comment.length}/280</span>
                <Button size="sm" disabled={!comment.trim()}>
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Blog post editor" action={<Badge>Draft</Badge>}>
        <div className="grid gap-4 xl:grid-cols-[1fr_260px]">
          <div className="grid gap-3">
            <Input
              defaultValue="How focused teams ship better products"
              className="h-12! text-[14px]! font-semibold"
            />
            <label className="grid min-h-36 cursor-pointer place-items-center rounded-xl border border-dashed border-border bg-surface-alt text-center">
              <span>
                <ImagePlus size={20} className="mx-auto text-accent" />
                <b className="mt-2 block text-[8px]">Add cover image</b>
              </span>
              <input type="file" accept="image/*" className="sr-only" />
            </label>
            <RichEditor content="<p>Focus is less about doing fewer things and more about making the next decision obvious.</p><h2>A practical operating rhythm</h2><p>Use clear ownership, short feedback loops, and visible progress.</p>" />
          </div>
          <aside className="grid content-start gap-3 rounded-xl border border-border bg-surface-alt p-3">
            <label className="grid gap-1.5 text-[8px]">
              Category
              <Select>
                <option>Product</option>
                <option>Design</option>
                <option>Engineering</option>
              </Select>
            </label>
            <label className="grid gap-1.5 text-[8px]">
              Tags
              <Input defaultValue="teams, workflow, focus" />
            </label>
            <div className="rounded-lg border border-border bg-surface p-3">
              <Eye size={13} className="text-accent" />
              <b className="mt-2 block text-[8px]">Preview summary</b>
              <p className="mt-1 text-[7px] leading-4 text-muted">
                A concise article about creating operational clarity.
              </p>
            </div>
            <Button variant="outline">Preview locally</Button>
            <Button>Save draft</Button>
          </aside>
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Inline click-to-edit">
          <div className="rounded-xl border border-border p-4">
            {editing ? (
              <div>
                <textarea
                  autoFocus
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  className="ui-input min-h-24 w-full py-2.5"
                />
                <div className="mt-2 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setDraft(inline);
                      setEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setInline(draft);
                      setEditing(false);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="w-full rounded-lg p-2 text-left hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-accent"
              >
                <b className="text-[9px]">Product description</b>
                <p className="mt-2 text-[9px] leading-5 text-muted">{inline}</p>
                <span className="mt-2 block text-[7px] text-accent">Click to edit</span>
              </button>
            )}
          </div>
        </Card>
        <Card
          title="Distraction-free editor"
          action={<Maximize2 size={13} className="text-muted" />}
        >
          <div className="rounded-xl bg-surface-alt px-4 py-6 sm:px-8">
            <textarea
              defaultValue="Start with the idea that matters most.\n\nThis restrained surface removes secondary controls and keeps the writing rhythm visible."
              className="min-h-52 w-full resize-y bg-transparent text-[12px] leading-7 outline-none"
            />
            <div className="mt-3 flex justify-between border-t border-border pt-2 text-[7px] text-muted">
              <span>Focus mode preview</span>
              <span>22 words</span>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Safe HTML source preview" action={<Badge>Limited structured preview</Badge>}>
        <div className="grid overflow-hidden rounded-lg border border-border lg:grid-cols-2">
          <div className="border-b border-border bg-[#111827] p-4 font-mono text-[9px] leading-5 text-slate-300 lg:border-b-0 lg:border-r">
            <p>&lt;article&gt;</p>
            <p className="pl-3 text-violet-300">&lt;h2&gt;Workspace update&lt;/h2&gt;</p>
            <p className="pl-3">&lt;p&gt;A safer, clearer release.&lt;/p&gt;</p>
            <p className="pl-3">&lt;ul&gt;&lt;li&gt;Improved navigation&lt;/li&gt;&lt;/ul&gt;</p>
            <p>&lt;/article&gt;</p>
          </div>
          <article className="p-5">
            <h2 className="text-[14px] font-semibold">Workspace update</h2>
            <p className="mt-2 text-[9px] text-muted">A safer, clearer release.</p>
            <ul className="mt-3 list-disc pl-5 text-[9px]">
              <li>Improved navigation</li>
            </ul>
            <p className="mt-4 text-[7px] text-muted">
              Preview is predefined structured React content; arbitrary HTML is never rendered.
            </p>
          </article>
        </div>
      </Card>

      <Card title="Editor with document sidebar">
        <div className="grid overflow-hidden rounded-xl border border-border lg:grid-cols-[190px_1fr]">
          <aside className="border-b border-border bg-surface-alt p-3 lg:border-b-0 lg:border-r">
            <b className="text-[8px]">DOCUMENT OUTLINE</b>
            {["Overview", "Research", "Recommendations", "Next steps"].map((item, index) => (
              <button
                type="button"
                key={item}
                className={`mt-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[8px] ${index === 0 ? "bg-surface text-accent" : "text-muted hover:bg-surface"}`}
              >
                <FileText size={10} />
                {item}
              </button>
            ))}
          </aside>
          <div>
            <RichEditor content="<h2>Overview</h2><p>This editor workspace pairs a navigable outline with a focused content surface.</p><h2>Research</h2><p>Insights remain visible without crowding the primary writing area.</p><h2>Recommendations</h2><ul><li>Keep hierarchy explicit</li><li>Use meaningful section labels</li></ul>" />
          </div>
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Code block editor" action={<Badge>TypeScript</Badge>}>
          <div className="overflow-hidden rounded-xl border border-border bg-[#111827]">
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-[7px] text-slate-400">
              <span>example.ts</span>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(code);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1200);
                }}
                className="inline-flex items-center gap-1 text-slate-300"
              >
                <Clipboard size={10} />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="overflow-x-auto p-4 text-[9px] leading-5 text-slate-300">
              <code>
                {code.split("\n").map((line, index) => (
                  <span key={index} className="block">
                    <span className="mr-4 inline-block w-3 select-none text-right text-slate-600">
                      {index + 1}
                    </span>
                    {line}
                  </span>
                ))}
              </code>
            </pre>
          </div>
        </Card>

        <Card title="Template editor" action={<Badge>{template}</Badge>}>
          <div className="mb-3 flex flex-wrap gap-2">
            {(Object.keys(templates) as Array<keyof typeof templates>).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTemplate(item)}
                className={`rounded-lg border px-3 py-1.5 text-[8px] ${template === item ? "border-accent bg-accent/5 text-accent" : "border-border"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <TemplateEditor key={template} content={templates[template]} />
        </Card>
      </div>

      <Card title="Read-only content preview" action={<Badge>Structured content</Badge>}>
        <article className="mx-auto max-w-3xl rounded-xl border border-border bg-surface-alt p-5 text-[9px] leading-5">
          <span className="text-[7px] font-medium uppercase tracking-wider text-accent">
            Operations playbook
          </span>
          <h2 className="mt-2 text-[16px] font-semibold">A clear system for coordinated work</h2>
          <p className="mt-3 text-muted">
            Strong operational systems make{" "}
            <strong className="text-foreground">ownership visible</strong>, preserve context, and
            shorten feedback loops.
          </p>
          <blockquote className="my-4 border-l-2 border-accent pl-3 italic text-muted">
            The interface should explain what happened, what matters, and what comes next.
          </blockquote>
          <h3 className="text-[11px] font-semibold">Working principles</h3>
          <ol className="mt-2 list-decimal pl-5">
            <li>Keep the current state visible.</li>
            <li>Make actions reversible where possible.</li>
            <li>Use feedback that explains outcomes.</li>
          </ol>
          <a
            href="#"
            onClick={(event) => event.preventDefault()}
            className="mt-4 inline-block text-accent underline"
          >
            Read related guidance
          </a>
          <code className="mt-4 block rounded-lg bg-[#111827] p-3 font-mono text-[8px] text-slate-300">
            status: &quot;ready-for-review&quot;
          </code>
        </article>
      </Card>
    </div>
  );
}

function TemplateEditor({ content }: { content: string }) {
  return <RichEditor compact content={content} />;
}
