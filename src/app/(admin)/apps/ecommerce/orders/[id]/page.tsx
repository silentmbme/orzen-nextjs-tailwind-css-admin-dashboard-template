import { OrderDetails } from "@/features/ecommerce/components/order-details";
export const metadata = { title: "Orzen Next.js Tailwind CSS Admin Dashboard Template" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetails id={id} />;
}
