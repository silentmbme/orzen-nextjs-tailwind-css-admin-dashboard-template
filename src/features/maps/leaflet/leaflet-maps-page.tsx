"use client";
import dynamic from "next/dynamic";
import { PageHeader } from "@/components/layout/page-header";
const LeafletExamples = dynamic(() => import("./leaflet-map-examples"), {
  ssr: false,
  loading: () => (
    <div
      className="grid h-80 place-items-center rounded-lg border border-border bg-surface text-muted"
      role="status"
    >
      Loading interactive maps…
    </div>
  ),
});
export function LeafletMapsPage() {
  return (
    <div className="grid min-w-0 gap-3">
      <div>
        <p className="mb-1 text-[11px] text-muted">Maps / Leaflet Maps</p>
        <PageHeader title="Leaflet Maps" />
        <p className="mt-1 text-[12px] text-muted">
          Explore locations, clustered facilities, and illustrative geographic coverage.
        </p>
      </div>
      <LeafletExamples />
    </div>
  );
}
