import type { Metadata } from "next";
import { LeadDetails } from "@/features/crm/components/lead-details";
export const metadata: Metadata = { title: "Orzen Next.js Tailwind CSS Admin Dashboard Template" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LeadDetails id={id} />;
}
