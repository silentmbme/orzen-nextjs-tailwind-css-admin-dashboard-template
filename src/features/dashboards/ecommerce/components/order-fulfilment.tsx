"use client";
import { useState } from "react";
import Link from "next/link";
import {
  PackageCheck,
  PackageOpen,
  Truck,
  CheckCheck,
  RotateCcw,
  Clock3,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { CommerceCardTitle, OrderStatusBadge } from "@/features/ecommerce/components/commerce-ui";
import { EmptyState } from "@/components/ui/empty-state";
import type { Order } from "@/features/ecommerce/types";
const stages = [
  { name: "Pending", icon: Clock3 },
  { name: "Processing", icon: PackageOpen },
  { name: "Ready to ship", icon: PackageCheck },
  { name: "In transit", icon: Truck },
  { name: "Delivered", icon: CheckCheck },
  { name: "Returned", icon: RotateCcw },
];
export function OrderFulfilment({ orders }: { orders: Order[] }) {
  const [stage, setStage] = useState("Delivered");
  const selected = orders.filter((order) => order.status === stage);
  const active = orders.filter((order) => !["Cancelled", "Returned"].includes(order.status));
  const rate = active.length
    ? (orders.filter((order) => order.status === "Delivered").length / active.length) * 100
    : 0;
  return (
    <Card
      title={<CommerceCardTitle label="Fulfilment control" />}
      action={
        <Link
          href="/apps/ecommerce/orders"
          aria-label="Manage fulfilment"
          className="text-muted hover:text-accent"
        >
          <ArrowUpRight size={15} />
        </Link>
      }
    >
      <div className="my-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-tiny text-muted">Delivered / non-returned orders</p>
          <strong className="text-kpi font-semibold">
            {rate.toFixed(0)}
            <span className="text-body text-muted">%</span>
          </strong>
        </div>
        <div className="text-right">
          <span className="text-lg font-semibold">{orders.length}</span>
          <p className="text-tiny text-muted">orders in period</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {stages.map((item) => (
          <button
            key={item.name}
            onClick={() => setStage(item.name)}
            aria-pressed={stage === item.name}
            className={`min-w-0 rounded-control border p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-accent ${stage === item.name ? "border-accent bg-accent/5" : "border-border bg-surface-alt hover:border-accent/40"}`}
          >
            <item.icon size={14} className={stage === item.name ? "text-accent" : "text-muted"} />
            <strong className="my-1 block text-lg font-semibold">
              {orders.filter((o) => o.status === item.name).length}
            </strong>
            <span className="block text-[10px] leading-tight text-muted">{item.name}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 border-t border-border pt-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-label font-medium">{stage}</span>
          <span className="text-tiny text-muted">{selected.length} orders</span>
        </div>
        {selected.length ? (
          selected.slice(0, 2).map((order) => (
            <Link
              key={order.id}
              href={`/apps/ecommerce/orders/${order.id}`}
              className="flex items-center justify-between gap-2 py-1.5 text-label"
            >
              <span className="text-accent">{order.id}</span>
              <OrderStatusBadge status={order.payment} />
            </Link>
          ))
        ) : (
          <EmptyState>No orders at this stage.</EmptyState>
        )}
        <p className="mt-2 text-tiny text-muted">
          Cancelled orders: {orders.filter((o) => o.status === "Cancelled").length}
        </p>
      </div>
    </Card>
  );
}
