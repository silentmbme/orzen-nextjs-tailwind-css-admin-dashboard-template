import type { Metadata } from "next";
import { ActivitiesWorkspace } from "@/features/crm/components/activities-workspace";
export const metadata: Metadata = { title: "Orzen Next.js Tailwind CSS Admin Dashboard Template" };
export default function Page() {
  return <ActivitiesWorkspace />;
}
