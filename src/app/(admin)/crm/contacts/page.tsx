import type { Metadata } from "next";
import { ContactDirectory } from "@/features/crm/components/contact-directory";
export const metadata: Metadata = { title: "Orzen Next.js Tailwind CSS Admin Dashboard Template" };
export default function Page() {
  return <ContactDirectory />;
}
