import type { Metadata } from "next";
import { CompanyProfile } from "@/features/crm/components/company-profile";
export const metadata: Metadata = { title: "Orzen Next.js Tailwind CSS Admin Dashboard Template" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CompanyProfile id={id} />;
}
