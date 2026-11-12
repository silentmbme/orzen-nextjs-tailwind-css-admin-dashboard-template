"use client";
import Image from "next/image";
export type Attachment = { name: string; type: string; size: number; data: string };
export const sampleAttachment: Attachment = {
  name: "project-notes.txt",
  type: "text/plain",
  size: 82,
  data:
    "data:text/plain;charset=utf-8," +
    encodeURIComponent(
      "Orzen demo project notes\nConfirm the review date and assign an owner for each action.",
    ),
};
const allowed = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
  "text/csv",
  "application/json",
  "application/pdf",
];
export function validAttachment(a: Attachment) {
  return (
    !!a &&
    typeof a.name === "string" &&
    typeof a.size === "number" &&
    a.size >= 0 &&
    a.size <= 2 * 1024 * 1024 &&
    allowed.includes(a.type) &&
    typeof a.data === "string" &&
    a.data.startsWith(`data:${a.type}`) &&
    a.data.includes(",")
  );
}
export async function readAttachment(file: File): Promise<Attachment> {
  if (!allowed.includes(file.type) || file.size > 2 * 1024 * 1024)
    throw new Error("Choose a PNG, JPG, WebP, plain text, CSV, JSON or PDF file up to 2 MB.");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("This file could not be read."));
    reader.onload = () =>
      resolve({ name: file.name, type: file.type, size: file.size, data: String(reader.result) });
    reader.readAsDataURL(file);
  });
}
export function AttachmentPreview({ attachment }: { attachment: Attachment }) {
  let text = "";
  if (attachment.type.startsWith("text/") || attachment.type === "application/json") {
    try {
      const [head, ...rest] = attachment.data.split(","),
        raw = rest.join(",");
      text = head.includes(";base64")
        ? new TextDecoder().decode(Uint8Array.from(atob(raw), (c) => c.charCodeAt(0)))
        : decodeURIComponent(raw);
    } catch {
      text = "Preview unavailable for this document.";
    }
  }
  return (
    <div className="space-y-3">
      <p className="break-all text-label font-medium">{attachment.name}</p>
      {attachment.type.startsWith("image/") ? (
        <Image
          src={attachment.data}
          alt={attachment.name}
          width={600}
          height={400}
          unoptimized
          className="max-h-80 w-full rounded-control object-contain"
        />
      ) : text ? (
        <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-control border border-border bg-surface-alt p-3 text-label">
          {text.slice(0, 50000)}
        </pre>
      ) : (
        <p className="rounded-control border border-border p-4 text-label text-muted">
          Inline preview is unavailable for this format. Download the local file to open it in a
          compatible application.
        </p>
      )}
      <a href={attachment.data} download={attachment.name} className="ui-button ui-button--outline">
        Download available file
      </a>
    </div>
  );
}
