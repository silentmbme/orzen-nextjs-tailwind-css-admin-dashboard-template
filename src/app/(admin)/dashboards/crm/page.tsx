import type { Metadata } from "next";
import { CrmDashboard } from "@/features/dashboards/crm/crm-dashboard";
export const metadata: Metadata = { title: "Orzen Next.js Tailwind CSS Admin Dashboard Template" };
export default function Page() {
  return <CrmDashboard />;
}
