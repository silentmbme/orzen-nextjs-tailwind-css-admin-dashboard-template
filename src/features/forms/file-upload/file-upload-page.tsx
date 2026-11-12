"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { DropzoneExamples } from "./dropzone-examples";
import { ImageUploadExamples } from "./image-upload-examples";
import { UploadStatusExamples } from "./upload-status-examples";

export function FileUploadPage() {
  return (
    <div className="forms-showcase grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="File upload" />
          <p className="mt-1 text-[10px] text-muted">
            Local file selection, dropzones, image previews, status lists, and validation patterns.
          </p>
        </div>
        <Badge>Frontend showcase · 24 patterns</Badge>
      </div>
      <DropzoneExamples />
      <ImageUploadExamples />
      <UploadStatusExamples />
    </div>
  );
}
