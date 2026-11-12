import { notFound } from "next/navigation";
import { UIShowcase } from "@/features/ui-showcase/components/ui-showcase";
import { showcaseMeta, showcaseSlugs, type ShowcaseSlug } from "@/features/ui-showcase/types";
export function generateStaticParams() {
  return showcaseSlugs.map((component) => ({ component }));
}
export async function generateMetadata({ params }: { params: Promise<{ component: string }> }) {
  const { component } = await params,
    meta = showcaseMeta[component as ShowcaseSlug];
  return { title: "Orzen Next.js Tailwind CSS Admin Dashboard Template" };
}
export default async function Page({ params }: { params: Promise<{ component: string }> }) {
  const { component } = await params;
  if (!showcaseSlugs.includes(component as ShowcaseSlug)) notFound();
  return <UIShowcase kind={component as ShowcaseSlug} />;
}
