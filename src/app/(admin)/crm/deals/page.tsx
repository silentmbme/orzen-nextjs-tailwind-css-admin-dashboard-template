import type { Metadata } from "next";
import { PipelineBoard } from "@/features/crm/components/pipeline-board";
export const metadata: Metadata = { title: "Orzen Next.js Tailwind CSS Admin Dashboard Template" };
export default async function Page({ searchParams }: { searchParams: Promise<{ deal?: string }> }) {
  const { deal } = await searchParams;
  return <PipelineBoard focusId={deal} />;
}
