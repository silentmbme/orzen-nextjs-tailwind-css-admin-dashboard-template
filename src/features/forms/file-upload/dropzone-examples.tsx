"use client";

import { useRef, useState } from "react";
import {
  FilePlus2,
  FileUp,
  FolderUp,
  ImagePlus,
  Paperclip,
  Upload,
  UploadCloud,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";
import { Input } from "@/components/ui/input";

function size(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function Dropzone({
  compact = false,
  soft = false,
  icon = "cloud",
  label = "Drop files here or browse",
}: {
  compact?: boolean;
  soft?: boolean;
  icon?: "cloud" | "folder" | "image";
  label?: string;
}) {
  const [files, setFiles] = useState<File[]>([]),
    [dragging, setDragging] = useState(false);
  const Icon = icon === "folder" ? FolderUp : icon === "image" ? ImagePlus : UploadCloud;
  const accept = (list: FileList | null) => list && setFiles(Array.from(list));
  return (
    <label
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        accept(event.dataTransfer.files);
      }}
      className={`grid cursor-pointer place-items-center border border-dashed p-4 text-center transition focus-within:outline-2 focus-within:outline-accent ${compact ? "min-h-24 grid-cols-[auto_1fr] justify-items-start gap-3 text-left" : "min-h-36"} ${soft ? "rounded-2xl bg-accent/5" : "rounded-lg bg-surface-alt"} ${dragging ? "border-accent bg-accent/10" : "border-border hover:border-accent"}`}
    >
      <input
        type="file"
        multiple
        className="sr-only"
        onChange={(event) => accept(event.target.files)}
      />
      <span className="grid size-9 place-items-center rounded-lg bg-accent/10 text-accent">
        <Icon size={17} />
      </span>
      <span>
        <b className="mt-2 block text-[9px]">
          {files.length ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : label}
        </b>
        <small className="mt-1 block text-[8px] text-muted">
          {files.length
            ? files.map((file) => file.name).join(", ")
            : "Keyboard and drag-and-drop accessible"}
        </small>
      </span>
    </label>
  );
}

export function DropzoneExamples() {
  const [basic, setBasic] = useState("No file selected"),
    [inline, setInline] = useState("No attachment"),
    fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="grid gap-3">
      <Card title="Basic upload controls" action={<Badge>5 patterns</Badge>}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="grid gap-1.5 text-[9px]">
            Default file input
            <Input
              type="file"
              className="py-2! text-[8px]! file:mr-2 file:rounded file:border-0 file:bg-accent/10 file:px-2 file:py-1 file:text-[8px] file:text-accent"
            />
          </label>
          <div>
            <span className="mb-1.5 block text-[9px]">Browse with filename</span>
            <input
              ref={fileRef}
              type="file"
              className="sr-only"
              onChange={(event) => setBasic(event.target.files?.[0]?.name ?? "No file selected")}
            />
            <Button variant="outline" className="w-full" onClick={() => fileRef.current?.click()}>
              <FileUp size={12} />
              <span className="min-w-0 truncate">{basic}</span>
            </Button>
          </div>
          <label className="grid gap-1.5 text-[9px]">
            Icon upload button
            <span className="flex">
              <span className="grid size-10 place-items-center rounded-l-lg bg-accent text-white">
                <Upload size={14} />
              </span>
              <span className="grid flex-1 place-items-center rounded-r-lg border border-l-0 border-border text-[8px]">
                Choose document
              </span>
            </span>
            <input type="file" className="sr-only" />
          </label>
          <label className="grid gap-1.5 text-[9px]">
            Inline selection
            <span className="flex items-center gap-2 rounded-lg border border-border p-2">
              <Paperclip size={12} className="text-muted" />
              <span className="min-w-0 flex-1 truncate text-[8px]">{inline}</span>
              <span className="rounded bg-surface-alt px-2 py-1 text-[7px]">Browse</span>
            </span>
            <input
              type="file"
              className="sr-only"
              onChange={(event) => setInline(event.target.files?.[0]?.name ?? "No attachment")}
            />
          </label>
          <label className="grid gap-1.5 text-[9px] opacity-45">
            Disabled upload
            <Input type="file" disabled className="py-2! text-[8px]!" />
          </label>
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        <Card title="Standard dashed dropzone">
          <Dropzone />
        </Card>
        <Card title="Compact rectangular dropzone">
          <Dropzone compact icon="folder" label="Drop documents or browse" />
        </Card>
        <Card title="Soft rounded dropzone">
          <Dropzone soft icon="image" label="Add images to your library" />
        </Card>
        <Card title="Large centered zone" className="xl:col-span-2">
          <div className="grid min-h-52 place-items-center rounded-xl border border-dashed border-border bg-surface-alt p-6">
            <label className="cursor-pointer text-center">
              <input type="file" multiple className="sr-only" />
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-white">
                <UploadCloud size={21} />
              </span>
              <b className="mt-3 block text-[10px]">Bring your project files together</b>
              <p className="mt-1 text-[8px] text-muted">
                Drop multiple documents here or select them from your device.
              </p>
              <span className="mt-3 inline-flex rounded-lg border border-border bg-surface px-3 py-2 text-[8px]">
                Browse files
              </span>
            </label>
          </div>
        </Card>
        <Card title="Icon-led upload tiles">
          <div className="grid grid-cols-2 gap-2">
            {[
              [ImagePlus, "Images", "PNG, JPG"],
              [FilePlus2, "Documents", "PDF, DOCX"],
              [FolderUp, "Archive", "ZIP"],
              [Paperclip, "Other", "TXT, CSV"],
            ].map(([Icon, title, note]) => {
              const I = Icon as typeof ImagePlus;
              return (
                <label
                  key={String(title)}
                  className="cursor-pointer rounded-lg border border-border p-3 text-center hover:border-accent"
                >
                  <input type="file" className="sr-only" />
                  <I size={15} className="mx-auto text-accent" />
                  <b className="mt-2 block text-[8px]">{String(title)}</b>
                  <small className="text-[7px] text-muted">{String(note)}</small>
                </label>
              );
            })}
          </div>
        </Card>
      </div>

      <Card title="Minimal underline upload">
        <label className="flex cursor-pointer flex-wrap items-center gap-3 border-b border-border py-3 hover:border-accent">
          <span className="grid size-8 place-items-center rounded-full bg-accent/10 text-accent">
            <Upload size={13} />
          </span>
          <span className="min-w-44 flex-1">
            <b className="block text-[9px]">Select a file to attach</b>
            <small className="text-[8px] text-muted">Maximum local demonstration size: 5 MB</small>
          </span>
          <span className="text-[8px] font-medium text-accent">Choose file</span>
          <input type="file" className="sr-only" />
        </label>
        <p className="mt-3 text-[8px] text-muted">
          Selected file sizes are displayed locally, for example: {size(1824000)}.
        </p>
      </Card>
    </div>
  );
}
