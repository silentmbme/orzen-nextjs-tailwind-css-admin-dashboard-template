import type { Metadata } from "next";
import { LeadsTable } from "@/features/crm/components/leads-table";
export const metadata: Metadata = { title: "Orzen Next.js Tailwind CSS Admin Dashboard Template" };
export default function Page() {
  return <LeadsTable />;
}
