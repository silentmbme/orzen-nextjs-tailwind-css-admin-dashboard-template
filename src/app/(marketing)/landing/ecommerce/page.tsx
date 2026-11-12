import type { Metadata } from "next";
import { EcommerceLanding } from "@/features/marketing/ecommerce/ecommerce-landing";
export const metadata: Metadata = {
  title: "Orzen Next.js Tailwind CSS Admin Dashboard Template",
  description:
    "Discover a fictional collection of audio, wearables, and gaming essentials. Explore product quick views, a local wishlist, and a demo shopping bag.",
  openGraph: {
    title: "Orzen Next.js Tailwind CSS Admin Dashboard Template",
    description: "A considered edit of everyday essentials. Demo storefront, no live checkout.",
    type: "website",
  },
};
export default function Page() {
  return <EcommerceLanding />;
}
