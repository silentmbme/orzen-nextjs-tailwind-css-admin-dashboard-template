"use client";
import { createLocalStore, isDate, uniqueIds } from "../common/store";
import { sampleAttachment, validAttachment } from "../common/attachment";
import { additionalFiles } from "./sample-files";
import type { FileData } from "./types";
const seed: FileData = {
  folders: [
    { id: "root", parentId: null, name: "My files" },
    { id: "documents", parentId: "root", name: "Documents" },
    { id: "design", parentId: "root", name: "Design assets" },
    { id: "reviews", parentId: "documents", name: "Reviews" },
  ],
  files: [
    {
      id: "file-1",
      folderId: "root",
      name: sampleAttachment.name,
      type: sampleAttachment.type,
      size: sampleAttachment.size,
      modified: "2026-11-02",
      favorite: true,
      attachment: sampleAttachment,
    },
    {
      id: "file-2",
      folderId: "documents",
      name: "release-checklist.txt",
      type: "text/plain",
      size: 68,
      modified: "2026-11-01",
      favorite: false,
      attachment: {
        name: "release-checklist.txt",
        type: "text/plain",
        size: 68,
        data:
          "data:text/plain;charset=utf-8," +
          encodeURIComponent(
            "Release checklist\n1. Review routes\n2. Check themes\n3. Verify controls",
          ),
      },
    },
    {
      id: "file-3",
      folderId: "design",
      name: "brand-guide.pdf",
      type: "application/pdf",
      size: 240000,
      modified: "2026-10-30",
      favorite: true,
      attachment: null,
    },
  ],
};
seed.files.push(...additionalFiles);
export function validFileData(v: unknown): v is FileData {
  const d = v as FileData;
  if (
    !d ||
    !Array.isArray(d.folders) ||
    !Array.isArray(d.files) ||
    !uniqueIds(d.folders) ||
    !uniqueIds(d.files) ||
    !d.folders.some((f) => f.id === "root" && f.parentId === null)
  )
    return false;
  return (
    d.folders.every((f) => {
      if (
        typeof f.name !== "string" ||
        !f.name.trim() ||
        /[\\/]/.test(f.name) ||
        (f.id !== "root" && !d.folders.some((p) => p.id === f.parentId))
      )
        return false;
      const visited = new Set<string>();
      let current: typeof f | undefined = f;
      while (current) {
        if (visited.has(current.id)) return false;
        visited.add(current.id);
        current = d.folders.find((p) => p.id === current?.parentId);
      }
      return !d.folders.some(
        (other) =>
          other.id !== f.id &&
          other.parentId === f.parentId &&
          other.name.toLowerCase() === f.name.toLowerCase(),
      );
    }) &&
    d.files.every(
      (f) =>
        d.folders.some((p) => p.id === f.folderId) &&
        typeof f.name === "string" &&
        !!f.name.trim() &&
        typeof f.type === "string" &&
        Number.isFinite(f.size) &&
        f.size >= 0 &&
        isDate(f.modified) &&
        typeof f.favorite === "boolean" &&
        (!f.attachment || validAttachment(f.attachment)),
    )
  );
}
export const fileStore = createLocalStore("nova-files-demo-v1", seed, validFileData);
