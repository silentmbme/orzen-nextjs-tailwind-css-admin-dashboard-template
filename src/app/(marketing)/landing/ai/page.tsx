import type { Metadata } from "next";
import { AILanding } from "@/features/marketing/ai/ai-landing";
export const metadata: Metadata = {
  title: "Orzen Next.js Tailwind CSS Admin Dashboard Template",
  description:
    "Explore fictional AI models, local prompt simulations, and reviewable agent workflows in the Orzen AI platform demo.",
  openGraph: {
    title: "Orzen Next.js Tailwind CSS Admin Dashboard Template",
    description: "A considered command center for prompts, models, and workflows.",
    type: "website",
  },
};
export default function Page() {
  return <AILanding />;
}
