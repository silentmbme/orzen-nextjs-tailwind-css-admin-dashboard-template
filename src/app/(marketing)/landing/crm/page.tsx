import type { Metadata } from "next";
import { CrmLanding } from "@/features/marketing/crm/crm-landing";
export const metadata: Metadata = {
  title: "Orzen Next.js Tailwind CSS Admin Dashboard Template",
  description:
    "Explore a relationship-first CRM demo with an interactive sales pipeline, lead management, follow-ups, and customer insights.",
  openGraph: {
    title: "Orzen Next.js Tailwind CSS Admin Dashboard Template",
    description: "A clearer view of your customers and your next step.",
    type: "website",
  },
};
export default function Page() {
  return <CrmLanding />;
}
