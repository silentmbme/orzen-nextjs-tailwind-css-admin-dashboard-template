"use client";

import { useState } from "react";
import {
  AlertCircle,
  Archive,
  Check,
  CheckCircle2,
  File,
  FileSpreadsheet,
  FileText,
  FileType2,
  Mail,
  Paperclip,
  Pause,
  Play,
  RefreshCw,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";

type DemoFile = {
  name: string;
  type: string;
  size: string;
  progress: number;
  status: "uploading" | "complete" | "paused" | "error";
};
const initialFiles: DemoFile[] = [
  { name: "brand-guidelines.pdf", type: "PDF", size: "2.4 MB", progress: 100, status: "complete" },
  { name: "campaign-assets.zip", type: "ZIP", size: "18.7 MB", progress: 64, status: "uploading" },
  { name: "customer-data.xlsx", type: "XLSX", size: "840 KB", progress: 42, status: "paused" },
  { name: "broken-export.csv", type: "CSV", size: "1.2 MB", progress: 28, status: "error" },
];
const iconFor = (type: string) =>
  type === "PDF"
    ? FileText
    : type === "XLSX" || type === "CSV"
      ? FileSpreadsheet
      : type === "ZIP"
        ? Archive
        : type === "DOCX"
          ? FileType2
          : File;
const statusTone = {
  uploading: "text-accent",
  complete: "text-success",
  paused: "text-amber-600",
  error: "text-danger",
};

export function UploadStatusExamples() {
  const [files, setFiles] = useState(initialFiles),
    [attachments, setAttachments] = useState(["brief.pdf", "wireframes.fig", "notes.txt"]),
    [validation, setValidation] = useState<{ tone: "neutral" | "error" | "success"; text: string }>(
      { tone: "neutral", text: "Choose PDF, DOCX, XLSX, TXT or ZIP up to 5 MB." },
    ),
    [empty, setEmpty] = useState(true);
  const validate = (list: FileList | null) => {
    const selected = Array.from(list ?? []);
    if (!selected.length) return setValidation({ tone: "error", text: "No file was selected." });
    if (selected.length > 3)
      return setValidation({ tone: "error", text: "Select no more than three files." });
    const allowed = ["pdf", "doc", "docx", "xls", "xlsx", "txt", "zip"];
    const invalid = selected.find(
      (file) => !allowed.includes(file.name.split(".").pop()?.toLowerCase() ?? ""),
    );
    if (invalid)
      return setValidation({
        tone: "error",
        text: `${invalid.name} has an unsupported file type.`,
      });
    const large = selected.find((file) => file.size > 5 * 1024 * 1024);
    if (large)
      return setValidation({ tone: "error", text: `${large.name} exceeds the 5 MB local limit.` });
    setValidation({
      tone: "success",
      text: `${selected.length} file${selected.length > 1 ? "s" : ""} passed local validation.`,
    });
  };
  return (
    <div className="grid gap-3">
      <Card title="Document upload cards" action={<Badge>Fictional demo files</Badge>}>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["proposal.pdf", "PDF", "1.8 MB"],
            ["contract.docx", "DOCX", "620 KB"],
            ["forecast.xlsx", "XLSX", "940 KB"],
            ["readme.txt", "TXT", "18 KB"],
            ["assets.zip", "ZIP", "4.2 MB"],
          ].map(([name, type, size]) => {
            const Icon = iconFor(type);
            return (
              <div key={name} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between">
                  <span className="grid size-8 place-items-center rounded-lg bg-accent/10 text-accent">
                    <Icon size={14} />
                  </span>
                  <Badge tone="success">Ready</Badge>
                </div>
                <b className="mt-3 block truncate text-[8px]">{name}</b>
                <span className="text-[7px] text-muted">
                  {type} · {size}
                </span>
                <button type="button" className="mt-2 text-[7px] text-danger">
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-[1.15fr_.85fr]">
        <Card title="Multi-file upload list" action={<Badge>Simulated</Badge>}>
          <div className="grid gap-2">
            {files.map((file) => {
              const Icon = iconFor(file.type);
              return (
                <div key={file.name} className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-alt text-muted">
                      <Icon size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <b className="block truncate text-[8px]">{file.name}</b>
                      <span className="text-[7px] text-muted">
                        {file.type} · {file.size}
                      </span>
                    </div>
                    <span className={`text-[7px] capitalize ${statusTone[file.status]}`}>
                      {file.status}
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${file.name}`}
                      onClick={() =>
                        setFiles((value) => value.filter((item) => item.name !== file.name))
                      }
                      className="text-muted hover:text-danger"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-alt">
                    <div
                      className={`h-full rounded-full ${file.status === "error" ? "bg-danger" : file.status === "paused" ? "bg-amber-500" : file.status === "complete" ? "bg-success" : "bg-accent"}`}
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="mt-3"
            onClick={() => setFiles(initialFiles)}
          >
            Reset list
          </Button>
        </Card>

        <Card title="Circular and status progress">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid place-items-center rounded-xl border border-border p-4">
              <div
                role="progressbar"
                aria-valuenow={72}
                aria-valuemin={0}
                aria-valuemax={100}
                className="grid size-20 place-items-center rounded-full"
                style={{
                  background: "conic-gradient(var(--color-accent) 72%,var(--color-border) 0)",
                }}
              >
                <span className="grid size-16 place-items-center rounded-full bg-surface text-[11px] font-semibold">
                  72%
                </span>
              </div>
              <b className="mt-2 text-[8px]">Simulated upload</b>
            </div>
            <div className="grid gap-2">
              <div className="rounded-lg border border-success/30 bg-success/5 p-3">
                <CheckCircle2 size={14} className="text-success" />
                <b className="mt-2 block text-[8px]">Complete</b>
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                <Pause size={14} className="text-amber-600" />
                <b className="mt-2 block text-[8px]">Paused</b>
              </div>
              <div className="rounded-lg border border-danger/30 bg-danger/5 p-3">
                <AlertCircle size={14} className="text-danger" />
                <b className="mt-2 block text-[8px]">Upload error</b>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card
          title="Email attachment uploader"
          action={<Badge>{attachments.length} attachments</Badge>}
        >
          <div className="rounded-xl border border-border bg-surface-alt p-3">
            <div className="mb-3 flex items-center gap-2">
              <Mail size={13} className="text-accent" />
              <b className="text-[9px]">Campaign review</b>
            </div>
            <div className="flex flex-wrap gap-2">
              {attachments.map((item) => (
                <span
                  key={item}
                  className="inline-flex max-w-44 items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1.5 text-[7px]"
                >
                  <Paperclip size={9} />
                  <span className="truncate">{item}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setAttachments((value) => value.filter((entry) => entry !== item))
                    }
                    aria-label={`Remove ${item}`}
                  >
                    <X size={9} />
                  </button>
                </span>
              ))}
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-border px-2.5 py-1.5 text-[7px] text-accent">
                <Paperclip size={9} />
                Attach files
                <input
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={(event) =>
                    setAttachments((value) => [
                      ...value,
                      ...Array.from(event.target.files ?? []).map((file) => file.name),
                    ])
                  }
                />
              </label>
            </div>
          </div>
        </Card>

        <Card title="Interactive local validation">
          <label className="grid cursor-pointer place-items-center rounded-xl border border-dashed border-border bg-surface-alt p-5 text-center hover:border-accent">
            <UploadCloud size={18} className="text-accent" />
            <b className="mt-2 text-[8px]">Select up to three documents</b>
            <span className="mt-1 text-[7px] text-muted">
              PDF, Word, Excel, TXT or ZIP · 5 MB each
            </span>
            <input
              type="file"
              multiple
              className="sr-only"
              onChange={(event) => validate(event.target.files)}
            />
          </label>
          <div
            role="status"
            className={`mt-3 flex items-center gap-2 rounded-lg border p-3 text-[8px] ${validation.tone === "error" ? "border-danger/30 bg-danger/5 text-danger" : validation.tone === "success" ? "border-success/30 bg-success/5 text-success" : "border-border text-muted"}`}
          >
            {validation.tone === "error" ? (
              <AlertCircle size={13} />
            ) : validation.tone === "success" ? (
              <CheckCircle2 size={13} />
            ) : (
              <File size={13} />
            )}{" "}
            {validation.text}
          </div>
        </Card>
      </div>

      <Card title="Empty, selected, completed, and retry states">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="grid place-items-center rounded-xl border border-dashed border-border p-5 text-center">
            <UploadCloud size={17} className="text-muted" />
            <b className="mt-2 text-[8px]">Empty selection</b>
            <span className="text-[7px] text-muted">No local files chosen</span>
          </div>
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
            <FileText size={16} className="text-accent" />
            <b className="mt-3 block truncate text-[8px]">selected-document.pdf</b>
            <span className="text-[7px] text-muted">Ready for local preview</span>
          </div>
          <div className="rounded-xl border border-success/30 bg-success/5 p-4">
            <Check size={16} className="text-success" />
            <b className="mt-3 block text-[8px]">Simulation complete</b>
            <span className="text-[7px] text-muted">No server transfer occurred</span>
          </div>
          <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
            <AlertCircle size={16} className="text-danger" />
            <b className="mt-3 block text-[8px]">Transfer interrupted</b>
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-1 text-[7px] text-danger"
            >
              <RefreshCw size={9} />
              Retry demo
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => setEmpty(!empty)}>
            <Play size={10} />
            {empty ? "Show selected state" : "Return to empty"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setFiles([]);
              setAttachments([]);
              setEmpty(true);
            }}
          >
            <Trash2 size={10} />
            Clear all
          </Button>
        </div>
      </Card>
    </div>
  );
}
