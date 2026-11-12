import type { Metadata } from "next";
import { ErrorPage } from "@/features/pages/errors/error-page";

export const metadata: Metadata = { title: "Orzen Next.js Tailwind CSS Admin Dashboard Template" };

export default function Page() {
  return <ErrorPage code={503} />;
}
