import type { Metadata } from "next";
import { SaasLanding } from "@/features/marketing/saas/saas-landing";
export const metadata: Metadata = {
  title: "Orzen Next.js Tailwind CSS Admin Dashboard Template",
  description:
    "Explore recurring revenue, subscription lifecycles, and paid customer retention in the Orzen SaaS product demo. Real product previews and interactive analytics.",
  openGraph: {
    title: "Orzen Next.js Tailwind CSS Admin Dashboard Template",
    description: "A connected view of revenue, renewals, and customer relationships.",
    type: "website",
  },
};
export default function Page() {
  return <SaasLanding />;
}
