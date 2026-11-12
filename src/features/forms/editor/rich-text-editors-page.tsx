"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { EditorShowcases } from "./editor-showcases";

export function RichTextEditorsPage() {
  return (
    <div className="forms-showcase grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="Rich text editors" />
          <p className="mt-1 text-[10px] text-muted">
            Functional writing surfaces for documents, Markdown, communication, content, code, and
            templates.
          </p>
        </div>
        <Badge>Tiptap · 15 experiences</Badge>
      </div>
      <EditorShowcases />
    </div>
  );
}
