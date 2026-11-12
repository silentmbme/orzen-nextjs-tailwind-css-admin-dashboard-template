"use client";
import Image from "next/image";
import { useState } from "react";
import {
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Mail,
  MapPin,
  PackageCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShowcaseCard as Card } from "@/components/ui/showcase-card";
import { UserAvatar } from "@/components/ui/user-avatar";

type Product = { name: string; sku: string; image: string; quantity: number; price: number };
type Order = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  amount: number;
  payment: "Paid" | "Pending";
  fulfillment: "Packed" | "In transit" | "Delivered";
  address: string;
  products: Product[];
};
const orders: Order[] = [
  {
    id: "ORZ-8421",
    customer: "Sofia Garcia",
    email: "sofia@example.com",
    phone: "+34 612 480 214",
    date: "Nov 09, 2026",
    amount: 378,
    payment: "Paid",
    fulfillment: "In transit",
    address: "142 Carrer de Mallorca, Barcelona 08036",
    products: [
      { name: "Studio Headphones", sku: "AUD-2048", image: "headphones", quantity: 2, price: 129 },
      { name: "Orbit Smartwatch", sku: "WAT-4092", image: "watch", quantity: 1, price: 120 },
    ],
  },
  {
    id: "ORZ-8418",
    customer: "Alex Morgan",
    email: "alex@example.com",
    phone: "+44 7700 900 842",
    date: "Nov 08, 2026",
    amount: 163,
    payment: "Paid",
    fulfillment: "Packed",
    address: "28 Clerkenwell Road, London EC1M 5PQ",
    products: [
      { name: "Orzen Speaker", sku: "SPK-1104", image: "speaker", quantity: 1, price: 89 },
      { name: "Arc Controller", sku: "GAM-7721", image: "controller", quantity: 1, price: 74 },
    ],
  },
  {
    id: "ORZ-8412",
    customer: "Priya Shah",
    email: "priya@example.com",
    phone: "+91 98204 28410",
    date: "Nov 07, 2026",
    amount: 249,
    payment: "Pending",
    fulfillment: "Packed",
    address: "18 Linking Road, Mumbai 400052",
    products: [
      { name: "Orbit Smartwatch", sku: "WAT-4092", image: "watch", quantity: 1, price: 249 },
    ],
  },
];
const th = "px-3 py-2.5 text-left text-[11px] font-medium text-muted",
  td = "px-3 py-3 text-[12px]";
export function OrderExpansionTable() {
  const [open, setOpen] = useState<string | null>(orders[0].id);
  return (
    <Card title="Order details expansion" action={<Badge>Commerce operations</Badge>}>
      <div className="min-w-0 overflow-x-auto">
        <table className="w-full min-w-[820px]">
          <caption className="sr-only">Expandable eCommerce orders</caption>
          <thead className="bg-surface-alt">
            <tr>
              {["Order", "Customer", "Order date", "Amount", "Payment", "Fulfillment", ""].map(
                (label, index) => (
                  <th
                    key={`${label}-${index}`}
                    scope="col"
                    className={`${th} ${index === 3 ? "text-right" : ""}`}
                  >
                    {label}
                    <span className="sr-only">{index === 6 ? "Expand order" : ""}</span>
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const expanded = open === order.id,
                panel = `order-${order.id}`;
              return (
                <OrderRows
                  key={order.id}
                  order={order}
                  expanded={expanded}
                  panel={panel}
                  toggle={() => setOpen(expanded ? null : order.id)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
function OrderRows({
  order,
  expanded,
  panel,
  toggle,
}: {
  order: Order;
  expanded: boolean;
  panel: string;
  toggle: () => void;
}) {
  const subtotal = order.products.reduce((sum, item) => sum + item.quantity * item.price, 0);
  return (
    <>
      <tr
        className={`border-t border-border transition-colors ${expanded ? "bg-accent/5" : "hover:bg-surface-alt"}`}
      >
        <td className={`${td} font-semibold`}>#{order.id}</td>
        <td className={td}>
          <span className="flex items-center gap-2.5">
            <UserAvatar name={order.customer} size={30} />
            <span>
              <b className="block font-medium">{order.customer}</b>
              <small className="text-[10px] text-muted">{order.email}</small>
            </span>
          </span>
        </td>
        <td className={`${td} text-muted`}>{order.date}</td>
        <td className={`${td} text-right font-semibold`}>${order.amount.toFixed(2)}</td>
        <td className={td}>
          <Badge tone={order.payment === "Paid" ? "success" : "neutral"}>{order.payment}</Badge>
        </td>
        <td className={td}>
          <span className="inline-flex items-center gap-1.5">
            <i
              className={`size-2 rounded-full ${order.fulfillment === "Delivered" ? "bg-success" : order.fulfillment === "In transit" ? "bg-blue-500" : "bg-amber-500"}`}
            />
            {order.fulfillment}
          </span>
        </td>
        <td className={`${td} text-right`}>
          <Button
            size="icon"
            variant="ghost"
            aria-label={`${expanded ? "Collapse" : "Expand"} order ${order.id}`}
            aria-expanded={expanded}
            aria-controls={panel}
            onClick={toggle}
          >
            <ChevronDown
              size={14}
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </Button>
        </td>
      </tr>
      {expanded && (
        <tr id={panel}>
          <td colSpan={7} className="border-t border-border bg-surface-alt/70 p-0">
            <div className="grid gap-5 p-4 md:grid-cols-[1.2fr_.8fr]">
              <section aria-label="Purchased products">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <b className="text-[12px]">Purchased products</b>
                    <p className="text-[10px] text-muted">{order.products.length} line items</p>
                  </div>
                  <Badge>
                    <PackageCheck size={10} />
                    Ready
                  </Badge>
                </div>
                <div className="overflow-hidden rounded-lg border border-border bg-surface">
                  {order.products.map((item) => (
                    <div
                      key={item.sku}
                      className="grid grid-cols-[44px_1fr_auto_auto] items-center gap-3 border-b border-border p-3 last:border-0"
                    >
                      <Image
                        src={`/images/ecommerce/${item.image}.webp`}
                        alt=""
                        width={44}
                        height={44}
                        className="size-11 rounded-lg border border-border object-cover"
                      />
                      <span>
                        <b className="block text-[11px]">{item.name}</b>
                        <small className="text-[10px] text-muted">SKU {item.sku}</small>
                      </span>
                      <span className="text-[10px] text-muted">Qty {item.quantity}</span>
                      <b className="text-[11px]">${item.price.toFixed(2)}</b>
                    </div>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 rounded-lg border border-border bg-surface p-3 text-[10px]">
                  <span className="text-muted">
                    Subtotal
                    <b className="mt-1 block text-[11px] text-foreground">${subtotal.toFixed(2)}</b>
                  </span>
                  <span className="text-muted">
                    Shipping<b className="mt-1 block text-[11px] text-foreground">Free</b>
                  </span>
                  <span className="text-muted">
                    Tax<b className="mt-1 block text-[11px] text-foreground">Included</b>
                  </span>
                  <span className="text-right text-muted">
                    Total
                    <b className="mt-1 block text-[12px] text-foreground">
                      ${order.amount.toFixed(2)}
                    </b>
                  </span>
                </div>
              </section>
              <aside className="grid content-start gap-3">
                <Info icon={Mail} title="Customer contact">
                  <span>{order.email}</span>
                  <span>{order.phone}</span>
                </Info>
                <Info icon={MapPin} title="Shipping address">
                  <span>{order.address}</span>
                </Info>
                <Info icon={CircleDollarSign} title="Payment summary">
                  <span>Card ending in 4821</span>
                  <span>
                    {order.payment} · ${order.amount.toFixed(2)}
                  </span>
                </Info>
                <div className="rounded-lg border border-border bg-surface p-3">
                  <div className="flex items-center gap-2">
                    <Clock3 size={13} className="text-accent" />
                    <b className="text-[11px]">Delivery timeline</b>
                  </div>
                  <div className="mt-3 grid grid-cols-3 text-center text-[9px]">
                    <Step done label="Confirmed" />
                    <Step done label="Dispatched" />
                    <Step
                      done={order.fulfillment === "Delivered"}
                      label={order.fulfillment === "Delivered" ? "Delivered" : "Arriving soon"}
                    />
                  </div>
                </div>
              </aside>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
function Info({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Mail;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <div className="flex items-center gap-2">
        <Icon size={13} className="text-accent" />
        <b className="text-[11px]">{title}</b>
      </div>
      <div className="mt-2 grid gap-1 text-[10px] text-muted">{children}</div>
    </div>
  );
}
function Step({ done, label }: { done: boolean; label: string }) {
  return (
    <span className="relative grid justify-items-center gap-1 text-muted before:absolute before:left-0 before:right-1/2 before:top-2 before:h-px before:bg-border first:before:hidden">
      <i
        className={`relative z-10 grid size-4 place-items-center rounded-full ${done ? "bg-accent text-white" : "bg-border"}`}
      >
        {done && <Check size={9} />}
      </i>
      {label}
    </span>
  );
}
