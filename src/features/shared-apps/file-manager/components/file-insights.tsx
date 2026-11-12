"use client";
import Image from "next/image";
import { Clock3, FileImage, FileText, FolderOpen, HardDrive, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AppTitle } from "../../common/workspace";
import { dateLabel } from "../../common/store";
import type { FileData, LocalFile } from "../types";
export const formatBytes = (n: number) =>
  n >= 1048576
    ? `${(n / 1048576).toFixed(1)} MB`
    : n >= 1024
      ? `${(n / 1024).toFixed(1)} KB`
      : `${n} B`;
export function FileThumbnail({ file }: { file: LocalFile }) {
  return (
    <div className="flex h-28 items-center justify-center overflow-hidden rounded-control border border-border bg-surface-alt">
      {file.attachment?.type.startsWith("image/") ? (
        <Image
          src={file.attachment.data}
          alt={file.name}
          width={360}
          height={220}
          unoptimized
          className="h-full w-full object-contain p-2"
        />
      ) : (
        <div className="px-3 text-center">
          <FileText size={30} className="mx-auto text-accent" />
          <p className="mt-2 text-[10px] uppercase tracking-widest text-muted">
            {file.name.split(".").at(-1)} document
          </p>
        </div>
      )}
    </div>
  );
}
export function FileInsights({
  data,
  onOpen,
  onFolder,
  onType,
}: {
  data: FileData;
  onOpen: (id: string) => void;
  onFolder: (id: string) => void;
  onType: (type: string) => void;
}) {
  const recent = [...data.files].sort((a, b) => b.modified.localeCompare(a.modified)).slice(0, 5);
  const groups = [
    {
      name: "Images",
      type: "images",
      icon: FileImage,
      files: data.files.filter((f) => f.type.startsWith("image/")),
    },
    {
      name: "Documents",
      type: "documents",
      icon: FileText,
      files: data.files.filter((f) => !f.type.startsWith("image/")),
    },
  ];
  return (
    <div className="grid items-start gap-widget xl:grid-cols-[1.1fr_1fr]">
      <Card
        title={<AppTitle icon={Clock3}>Recently modified</AppTitle>}
        action={<span className="text-[10px] text-muted">Across all folders</span>}
      >
        <div className="mt-3 divide-y divide-border">
          {recent.map((f) => (
            <button
              key={f.id}
              onClick={() => onOpen(f.id)}
              className="flex w-full items-center gap-2 py-3 text-left hover:text-accent"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-control bg-surface-alt text-accent">
                {f.type.startsWith("image/") ? <FileImage size={16} /> : <FileText size={16} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-label font-medium">{f.name}</span>
                <span className="mt-1 block text-[10px] text-muted">
                  {data.folders.find((d) => d.id === f.folderId)?.name} · {formatBytes(f.size)}
                </span>
              </span>
              <time className="text-[10px] text-muted">{dateLabel(f.modified)}</time>
            </button>
          ))}
          {!recent.length && <p className="py-4 text-label text-muted">No files to show yet.</p>}
        </div>
      </Card>
      <div className="space-y-widget">
        <Card title={<AppTitle icon={HardDrive}>Storage composition</AppTitle>}>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {groups.map(({ name, type, icon: Icon, files }) => (
              <button
                key={name}
                onClick={() => onType(type)}
                className="rounded-control border border-border p-3 text-left hover:border-accent"
              >
                <Icon size={20} className="text-accent" />
                <p className="mt-3 text-label font-medium">{name}</p>
                <p className="mt-1 text-lg font-semibold">
                  {formatBytes(files.reduce((sum, f) => sum + (f.attachment?.size || 0), 0))}
                </p>
                <p className="mt-1 text-[10px] text-muted">
                  {files.length} records · select to filter
                </p>
              </button>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-muted">
            Available local file bytes only. Metadata-only samples are excluded.
          </p>
        </Card>
        <Card title={<AppTitle icon={FolderOpen}>Folder directory</AppTitle>}>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {data.folders
              .filter((f) => f.id !== "root")
              .map((f) => (
                <button
                  key={f.id}
                  onClick={() => onFolder(f.id)}
                  className="flex items-center gap-2 rounded-control border border-border p-2 text-left hover:bg-surface-alt"
                >
                  <FolderOpen size={15} className="shrink-0 text-accent" />
                  <span className="min-w-0">
                    <span className="block truncate text-label">{f.name}</span>
                    <span className="mt-1 block text-[10px] text-muted">
                      {data.files.filter((file) => file.folderId === f.id).length} direct files
                    </span>
                  </span>
                </button>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
export function FavoriteFiles({
  files,
  onOpen,
}: {
  files: LocalFile[];
  onOpen: (id: string) => void;
}) {
  const favorites = files
    .filter((f) => f.favorite)
    .sort((a, b) => Number(b.type.startsWith("image/")) - Number(a.type.startsWith("image/")))
    .slice(0, 3);
  return (
    <Card
      title={<AppTitle icon={Star}>Quick access</AppTitle>}
      action={<span className="text-[10px] text-muted">Favorite files · all folders</span>}
    >
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {favorites.map((f) => (
          <button
            key={f.id}
            onClick={() => onOpen(f.id)}
            className="min-w-0 text-left hover:text-accent"
          >
            <FileThumbnail file={f} />
            <p className="mt-2 truncate text-label font-medium">{f.name}</p>
            <p className="mt-1 text-[10px] text-muted">
              {formatBytes(f.size)} · {f.attachment ? "Available locally" : "Metadata only"}
            </p>
          </button>
        ))}
        {!favorites.length && (
          <p className="py-3 text-label text-muted">Star a file to keep it within easy reach.</p>
        )}
      </div>
    </Card>
  );
}
