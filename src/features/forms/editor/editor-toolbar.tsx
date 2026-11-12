"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Heading2,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";

type Tool = { label: string; icon: typeof Bold; active?: () => boolean; run: () => void };

export function EditorToolbar({
  editor,
  compact = false,
}: {
  editor: Editor | null;
  compact?: boolean;
}) {
  if (!editor) return <div className="h-9 border-b border-border bg-surface-alt" />;
  const link = () => {
    const current = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter link URL", current ?? "https://");
    if (url === null) return;
    if (!url.trim()) editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };
  const tools: Tool[] = [
    {
      label: "Bold",
      icon: Bold,
      active: () => editor.isActive("bold"),
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      icon: Italic,
      active: () => editor.isActive("italic"),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Underline",
      icon: Underline,
      active: () => editor.isActive("underline"),
      run: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      label: "Strikethrough",
      icon: Strikethrough,
      active: () => editor.isActive("strike"),
      run: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      label: "Heading",
      icon: Heading2,
      active: () => editor.isActive("heading", { level: 2 }),
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Bullet list",
      icon: List,
      active: () => editor.isActive("bulletList"),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Numbered list",
      icon: ListOrdered,
      active: () => editor.isActive("orderedList"),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Blockquote",
      icon: Quote,
      active: () => editor.isActive("blockquote"),
      run: () => editor.chain().focus().toggleBlockquote().run(),
    },
    { label: "Link", icon: Link2, active: () => editor.isActive("link"), run: link },
    {
      label: "Highlight",
      icon: Highlighter,
      active: () => editor.isActive("highlight"),
      run: () => editor.chain().focus().toggleHighlight().run(),
    },
    { label: "Undo", icon: Undo2, run: () => editor.chain().focus().undo().run() },
    { label: "Redo", icon: Redo2, run: () => editor.chain().focus().redo().run() },
  ];
  const visible = compact
    ? tools.filter((tool) => ["Bold", "Italic", "Link", "Highlight"].includes(tool.label))
    : tools;
  return (
    <div
      role="toolbar"
      aria-label="Text formatting"
      className="flex min-h-9 flex-wrap items-center gap-0.5 border-b border-border bg-surface-alt p-1.5"
    >
      {visible.map(({ label, icon: Icon, active, run }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          aria-pressed={active?.() ?? false}
          onClick={run}
          className={`grid size-7 place-items-center rounded-md text-muted hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent ${active?.() ? "bg-accent/10 text-accent" : ""}`}
        >
          <Icon size={12} />
        </button>
      ))}
    </div>
  );
}
