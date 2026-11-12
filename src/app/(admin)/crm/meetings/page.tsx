import type { Metadata } from "next";
import { MeetingsWorkspace } from "@/features/crm/components/meetings-workspace";
export const metadata: Metadata = { title: "Orzen Next.js Tailwind CSS Admin Dashboard Template" };
export default function Page() {
  return <MeetingsWorkspace />;
}
