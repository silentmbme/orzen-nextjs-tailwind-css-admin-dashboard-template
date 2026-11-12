"use client";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCopy,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  PackageCheck,
  ReceiptText,
  Store,
  Truck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { CommerceWorkspace } from "./commerce-workspace";
import { CommerceCardTitle, OrderStatusBadge, ProductThumb } from "./commerce-ui";
import { useCommerce } from "../hooks/use-commerce";
import { downloadReport } from "../demo-service";
import { demoDate, money, nextStatuses, orderTotals, stores, type OrderStatus } from "../types";
const stages = [
  { status: "Pending", label: "Placed", icon: ReceiptText },
  { status: "Processing", label: "Processing", icon: Package },
  { status: "Ready to ship", label: "Ready to ship", icon: PackageCheck },
  { status: "In transit", label: "In transit", icon: Truck },
  { status: "Delivered", label: "Delivered", icon: CheckCircle2 },
];
export function OrderDetails({ id }: { id: string }) {
  const { data, update } = useCommerce();
  const [next, setNext] = useState(""),
    [tracking, setTracking] = useState(""),
    [message, setMessage] = useState(""),
    [copied, setCopied] = useState("");
  const order = data.orders.find((item) => item.id === id),
    customer = data.customers.find((item) => item.id === order?.customerId);
  const refunds = data.refunds.filter((refund) => refund.orderId === id);
  const refunded = refunds
    .filter((refund) => refund.status === "Completed")
    .reduce((sum, refund) => sum + refund.amount, 0);
  const customerOrders = data.orders.filter((item) => item.customerId === order?.customerId);
  const unitCount = order?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setMessage(`${label} copied to clipboard.`);
    } catch {
      setMessage(
        `Clipboard unavailable. Select and copy the ${label.toLowerCase()} shown on this page.`,
      );
    }
  }
  function save() {
    if (!order) return;
    if (!nextStatuses[order.status].includes(next as OrderStatus)) {
      setMessage("Choose an available next status.");
      return;
    }
    if (next === "In transit" && !tracking.trim() && !order.tracking) {
      setMessage("Enter a demo tracking reference before dispatch.");
      return;
    }
    if (["Ready to ship", "In transit", "Delivered"].includes(next) && order.payment !== "Paid") {
      setMessage("Record a simulated payment before shipping.");
      return;
    }
    update((state) => {
      const item = state.orders.find((value) => value.id === id)!;
      item.status = next as OrderStatus;
      item.tracking = tracking.trim() || item.tracking;
      item.timeline.push({ status: item.status, date: demoDate });
    });
    setNext("");
    setMessage("Demo order updated. No carrier or customer was contacted.");
  }
  function exportOrder() {
    if (order)
      downloadReport(
        `order-${order.id}`,
        order.items.map((item) => ({
          order: order.id,
          date: order.created,
          customer: customer?.name || "Unknown customer",
          product: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.unitPrice * item.quantity,
          orderTotal: orderTotals(order).total,
          fulfilment: order.status,
          payment: order.payment,
          tracking: order.tracking,
        })),
      );
  }
  return (
    <CommerceWorkspace
      title={order ? `Order ${order.id}` : "Order not found"}
      description="Purchase details, payment collection and fulfilment workspace."
      actions={
        <>
          <Link
            href="/apps/ecommerce/orders"
            className="inline-flex items-center gap-1 text-label text-accent"
          >
            <ArrowLeft size={12} />
            Back to orders
          </Link>
          {order && (
            <Button variant="outline" onClick={exportOrder}>
              <ArrowDownToLine size={13} />
              Export order
            </Button>
          )}
        </>
      }
    >
      {order ? (
        <>
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-label font-medium">{order.id}</span>
                <button
                  aria-label="Copy order ID"
                  onClick={() => copy(order.id, "Order ID")}
                  className="rounded-sm p-1 text-muted hover:text-accent"
                >
                  {copied === "Order ID" ? <Check size={12} /> : <ClipboardCopy size={12} />}
                </button>
                <OrderStatusBadge status={order.status} />
                <OrderStatusBadge status={order.payment} />
              </div>
              <span className="text-tiny text-muted">
                Local demo · no payment or carrier integration
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4 xl:grid-cols-4">
              {[
                {
                  label: "Order total",
                  value: money(orderTotals(order).total),
                  icon: CreditCard,
                  note: "Includes shipping, tax & discounts",
                },
                {
                  label: "Placed on",
                  value: order.created,
                  icon: CalendarDays,
                  note: "Demo order date",
                },
                {
                  label: "Items ordered",
                  value: `${unitCount} unit${unitCount === 1 ? "" : "s"}`,
                  icon: Package,
                  note: `${order.items.length} product line${order.items.length === 1 ? "" : "s"}`,
                },
                {
                  label: "Store",
                  value: stores.find((store) => store.id === order.storeId)?.name || order.storeId,
                  icon: Store,
                  note: customer?.region || "Region unavailable",
                },
              ].map((metric) => (
                <div key={metric.label} className="flex min-w-0 items-start gap-2">
                  <metric.icon size={14} className="mt-0.5 shrink-0 text-accent" />
                  <div className="min-w-0">
                    <p className="text-tiny text-muted">{metric.label}</p>
                    <p className="mt-1 break-words text-body font-semibold">{metric.value}</p>
                    <p className="mt-1 text-tiny text-muted">{metric.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          {message && (
            <p
              role="status"
              className="rounded-control border border-border bg-surface px-3 py-2 text-label text-muted"
            >
              {message}
            </p>
          )}
          <div className="grid items-start gap-widget xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-widget">
              <Card
                title={<CommerceCardTitle label="Ordered items" />}
                action={<Badge>{unitCount} units</Badge>}
              >
                <div className="mt-2 divide-y divide-border">
                  {order.items.map((item, index) => {
                    const product = data.products.find((value) => value.id === item.productId);
                    return (
                      <div key={index} className="flex items-start gap-3 py-3">
                        {product && (
                          <Link
                            href={`/apps/ecommerce/products/${item.productId}`}
                            aria-label={`View ${item.name}`}
                            className="shrink-0 [&_img]:h-14 [&_img]:w-14"
                          >
                            <ProductThumb product={product} />
                          </Link>
                        )}
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/apps/ecommerce/products/${item.productId}`}
                            className="text-body font-medium hover:text-accent"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-tiny text-muted">
                            SKU · {product?.sku || "Unavailable"}
                          </p>
                          <p className="mt-2 text-label text-muted">
                            {money(item.unitPrice)}
                            <span className="mx-2 text-border">/</span>Qty {item.quantity}
                          </p>
                        </div>
                        <strong className="shrink-0 text-label font-medium tabular-nums">
                          {money(item.unitPrice * item.quantity)}
                        </strong>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-1 flex items-center justify-between gap-3 border-t border-border pt-3 text-label">
                  <span className="text-muted">Product subtotal</span>
                  <strong className="font-medium">{money(orderTotals(order).subtotal)}</strong>
                </div>
                <p className="mt-2 text-tiny text-muted">
                  Item prices are captured on the order and may differ from the current catalog.
                </p>
              </Card>
              <Card
                title={<CommerceCardTitle label="Shipping timeline" />}
                action={<OrderStatusBadge status={order.status} />}
              >
                <ol className="mt-4 grid grid-cols-5 gap-1">
                  {stages.map((stage, index) => {
                    const event = order.timeline.find((item) => item.status === stage.status);
                    const current = stage.status === order.status;
                    return (
                      <li key={stage.status} className="relative min-w-0 text-center">
                        {index < stages.length - 1 && (
                          <span
                            className={`absolute top-3.5 left-[calc(50%+16px)] h-px w-[calc(100%-32px)] ${order.timeline.some((item) => item.status === stages[index + 1].status) ? "bg-accent/40" : "bg-border"}`}
                          />
                        )}
                        <span
                          className={`relative mx-auto flex h-7 w-7 items-center justify-center rounded-full border ${current ? "border-accent bg-accent/10 text-accent" : event ? "border-accent/30 bg-accent/5 text-accent" : "border-border bg-surface-alt text-muted"}`}
                        >
                          <stage.icon size={13} />
                        </span>
                        <p
                          className={`mt-2 text-[10px] leading-tight ${current ? "font-medium text-accent" : "text-muted"}`}
                        >
                          {stage.label}
                        </p>
                        <p className="mt-1 text-[9px] text-muted">{event?.date || "Not reached"}</p>
                      </li>
                    );
                  })}
                </ol>
                {["Cancelled", "Returned"].includes(order.status) && (
                  <p className="mt-3 rounded-control bg-danger-subtle px-3 py-2 text-label text-danger">
                    Order {order.status.toLowerCase()} · {order.timeline.at(-1)?.date}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-control border border-border bg-surface-alt p-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-tiny text-muted">
                      <Truck size={12} />
                      Demo tracking reference
                    </p>
                    <p className="mt-1 break-all text-label font-medium">
                      Tracking: {order.tracking || "Not dispatched"}
                    </p>
                  </div>
                  {order.tracking && (
                    <Button
                      size="sm"
                      variant="outline"
                      aria-label="Copy tracking reference"
                      onClick={() => copy(order.tracking, "Tracking reference")}
                    >
                      {copied === "Tracking reference" ? (
                        <Check size={12} />
                      ) : (
                        <ClipboardCopy size={12} />
                      )}
                      Copy
                    </Button>
                  )}
                </div>
                <details className="mt-3 text-label">
                  <summary className="cursor-pointer text-accent">
                    View {order.timeline.length} timeline events
                  </summary>
                  <ol className="mt-3 space-y-3 border-l border-border pl-3">
                    {order.timeline.map((event, index) => (
                      <li key={index} className="flex items-center justify-between gap-3">
                        <span>{event.status}</span>
                        <time className="text-tiny text-muted">{event.date}</time>
                      </li>
                    ))}
                  </ol>
                </details>
              </Card>
              <Card
                title={<CommerceCardTitle label="Customer" />}
                action={
                  <Link
                    href="/apps/ecommerce/customers"
                    className="inline-flex items-center gap-1 text-tiny text-accent"
                  >
                    Directory
                    <ArrowUpRight size={12} />
                  </Link>
                }
              >
                <div className="mt-3 flex items-center gap-3">
                  <UserAvatar name={customer?.name} size={40} />
                  <div className="min-w-0">
                    <p className="font-medium">{customer?.name || "Unknown customer"}</p>
                    <p className="mt-1 break-all text-label text-muted">
                      {customer?.email || "Email unavailable"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 border-t border-border pt-3 sm:grid-cols-2">
                  <div>
                    <p className="flex items-center gap-1.5 text-tiny text-muted">
                      <MapPin size={12} />
                      Shipping address on order
                    </p>
                    <p className="mt-2 text-label leading-relaxed">{order.address}</p>
                    <p className="mt-1 text-tiny text-muted">{customer?.region}</p>
                  </div>
                  <dl className="space-y-2 text-label">
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted">Customer since</dt>
                      <dd>{customer?.joined || "Unavailable"}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted">Orders on file</dt>
                      <dd>{customerOrders.length}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted">Current order</dt>
                      <dd>{order.id}</dd>
                    </div>
                  </dl>
                </div>
              </Card>
            </div>
            <div className="min-w-0 space-y-widget">
              <Card
                title={<CommerceCardTitle label="Payment summary" />}
                action={<OrderStatusBadge status={order.payment} />}
              >
                <div className="my-3 rounded-control border border-border bg-surface-alt p-3">
                  <p className="text-tiny text-muted">Order total · USD</p>
                  <p className="mt-1 text-kpi font-semibold tracking-tight">
                    {money(orderTotals(order).total)}
                  </p>
                  <p className="mt-1 text-tiny text-muted">
                    {order.payment === "Paid"
                      ? "Payment recorded in demo"
                      : order.payment === "Refunded"
                        ? "Fully refunded order"
                        : order.status === "Cancelled"
                          ? "Cancelled · payment not collected"
                          : "Awaiting simulated payment"}
                  </p>
                </div>
                <div className="space-y-2.5 text-label">
                  {[
                    ["Subtotal", orderTotals(order).subtotal],
                    ["Shipping", order.shipping],
                    ["Tax", order.tax],
                    ["Discount", order.discount ? -order.discount : 0],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="flex justify-between gap-2">
                      <span className="text-muted">{label}</span>
                      <span className="tabular-nums">{money(Number(value))}</span>
                    </div>
                  ))}
                  <div className="flex justify-between gap-2 border-t border-dashed border-border pt-2.5">
                    <span className="text-muted">Completed refunds</span>
                    <span className="tabular-nums">{money(refunded)}</span>
                  </div>
                  <div className="flex justify-between gap-2 border-t border-border pt-2.5 font-medium">
                    <span>Net collected</span>
                    <span>
                      {money(
                        order.payment === "Paid"
                          ? Math.max(0, orderTotals(order).total - refunded)
                          : 0,
                      )}
                    </span>
                  </div>
                </div>
                {refunds.length > 0 && (
                  <Link
                    href="/apps/ecommerce/refunds"
                    className="mt-3 flex items-center justify-between rounded-control border border-border px-2 py-2 text-tiny"
                  >
                    <span>
                      {refunds.length} refund request{refunds.length === 1 ? "" : "s"} on file
                    </span>
                    <ArrowUpRight size={12} className="text-accent" />
                  </Link>
                )}
                {order.payment === "Pending" && order.status !== "Cancelled" && (
                  <Button
                    className="mt-3 w-full"
                    onClick={() => {
                      update((state) => {
                        state.orders.find((item) => item.id === id)!.payment = "Paid";
                      });
                      setMessage("Simulated payment recorded. No money was charged.");
                    }}
                  >
                    <CreditCard size={13} />
                    Record demo payment
                  </Button>
                )}
                <p className="mt-3 text-tiny text-muted">
                  Demo ledger only. No card or bank transfer is processed.
                </p>
              </Card>
              <Card title={<CommerceCardTitle label="Update fulfilment" />}>
                <div className="mt-3 space-y-3">
                  <p className="flex items-center gap-1.5 text-label text-muted">
                    <Clock3 size={13} />
                    Current stage:{" "}
                    <span className="font-medium text-foreground">{order.status}</span>
                  </p>
                  {nextStatuses[order.status].length ? (
                    <>
                      <label className="block space-y-1 text-label">
                        Next status
                        <Select
                          className="block w-full"
                          aria-label="Next status"
                          value={next}
                          onChange={(event) => setNext(event.target.value)}
                        >
                          <option value="">Choose a status</option>
                          {nextStatuses[order.status].map((value) => (
                            <option key={value}>{value}</option>
                          ))}
                        </Select>
                      </label>
                      <label className="block space-y-1 text-label">
                        Demo tracking reference
                        <Input
                          className="block w-full"
                          value={tracking}
                          placeholder={order.tracking || "DEMO-TRACK-001"}
                          maxLength={80}
                          onChange={(event) => setTracking(event.target.value)}
                        />
                      </label>
                      <p className="text-tiny text-muted">
                        Dispatch requires a recorded payment and tracking reference. Only valid next
                        stages are available.
                      </p>
                      <Button className="w-full" onClick={save}>
                        <PackageCheck size={13} />
                        Update demo order
                      </Button>
                    </>
                  ) : (
                    <div className="rounded-control border border-border bg-surface-alt p-3">
                      <CheckCircle2 size={16} className="mb-2 text-muted" />
                      <p className="text-label">
                        This order has reached its final fulfilment stage.
                      </p>
                    </div>
                  )}
                  <p className="text-tiny text-muted">
                    Local demo changes only. No carrier or customer is contacted.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <Card>
          <EmptyState>No order matches this link.</EmptyState>
        </Card>
      )}
    </CommerceWorkspace>
  );
}
