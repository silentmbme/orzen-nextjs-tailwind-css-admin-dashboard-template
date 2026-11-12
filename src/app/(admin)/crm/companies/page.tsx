import type { Metadata } from "next";
import { CompaniesPage } from "@/features/crm/components/company-profile";
export const metadata: Metadata = { title: "Orzen Next.js Tailwind CSS Admin Dashboard Template" };
export default function Page() {
  return <CompaniesPage />;
}
