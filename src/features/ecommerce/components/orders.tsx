"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpRight,
  CreditCard,
  PackageCheck,
  ReceiptText,
  ShoppingBag,
  Truck,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { CommerceWorkspace } from "./commerce-workspace";
import { OrdersTable, orderSearchText } from "./orders-table";
import { CommerceCardTitle, OrderStatusBadge, ProductThumb } from "./commerce-ui";
import { useCommerce } from "../hooks/use-commerce";
import { downloadReport } from "../demo-service";
import { daysAgo, money, orderStatuses, orderTotals, stores, type Order } from "../types";
const queues = [
  { id: "all", label: "All orders", icon: ShoppingBag, statuses: [] as string[] },
  {
    id: "open",
    label: "Unfulfilled",
    icon: PackageCheck,
    statuses: ["Pending", "Processing", "Ready to ship"],
  },
  { id: "transit", label: "In transit", icon: Truck, statuses: ["In transit"] },
  { id: "delivered", label: "Delivered", icon: PackageCheck, statuses: ["Delivered"] },
  { id: "returned", label: "Returns", icon: RotateCcw, statuses: ["Returned"] },
];
export function Orders() {
  const { data } = useCommerce();
  const [status, setStatus] = useState("all"),
    [queue, setQueue] = useState("all"),
    [payment, setPayment] = useState("all"),
    [store, setStore] = useState("all"),
    [period, setPeriod] = useState("all"),
    [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]),
    [preview, setPreview] = useState("");
  const scoped = data.orders.filter(
    (order) =>
      (store === "all" || order.storeId === store) &&
      (period === "all" ||
        (daysAgo(order.created) >= 0 && daysAgo(order.created) < Number(period))) &&
      (payment === "all" || order.payment === payment),
  );
  const queueDefinition = queues.find((item) => item.id === queue)!;
  const orders = scoped.filter(
    (order) =>
      (status === "all" || order.status === status) &&
      (queue === "all" || queueDefinition.statuses.includes(order.status)),
  );
  const matches = orders.filter((order) =>
    orderSearchText(order, data).includes(query.trim().toLowerCase()),
  );
  const selectedOrders = matches.filter((order) => selected.includes(order.id));
  const paid = scoped.filter((order) => order.payment === "Paid");
  const collected = paid.reduce(
    (sum, order) =>
      sum +
      orderTotals(order).total -
      data.refunds
        .filter((refund) => refund.orderId === order.id && refund.status === "Completed")
        .reduce((s, r) => s + r.amount, 0),
    0,
  );
  const pending = scoped.filter(
    (order) => order.payment === "Pending" && order.status !== "Cancelled",
  );
  const ready = scoped.filter((order) => order.status === "Ready to ship");
  const item = data.orders.find((order) => order.id === preview),
    customer = data.customers.find((c) => c.id === item?.customerId);
  function exportOrders(list: Order[]) {
    downloadReport(
      "orders",
      list.map((order) => ({
        order: order.id,
        customer: data.customers.find((c) => c.id === order.customerId)?.name || "Unknown",
        date: order.created,
        store: order.storeId,
        status: order.status,
        payment: order.payment,
        tracking: order.tracking,
        units: order.items.reduce((s, i) => s + i.quantity, 0),
        total: orderTotals(order).total,
      })),
    );
  }
  function clear() {
    setStatus("all");
    setQueue("all");
    setPayment("all");
    setStore("all");
    setPeriod("all");
    setQuery("");
    setSelected([]);
  }
  function attention(nextStatus: string, nextPayment: string) {
    setQueue(nextPayment === "Pending" ? "open" : "all");
    setStatus(nextStatus);
    setPayment(nextPayment);
    setQuery("");
    setSelected([]);
  }
  const hasFilters =
    status !== "all" ||
    queue !== "all" ||
    payment !== "all" ||
    store !== "all" ||
    period !== "all" ||
    !!query;
  return (
    <CommerceWorkspace
      title="Orders"
      description="Review purchases, resolve payment queues and keep fulfilment moving."
      actions={
        <Button disabled={!matches.length} onClick={() => exportOrders(matches)}>
          <ArrowDownToLine size={13} />
          Export orders
        </Button>
      }
    >
      <Card>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total orders",
              value: String(scoped.length),
              note: `${new Set(scoped.map((order) => order.customerId)).size} unique customers`,
              icon: ShoppingBag,
            },
            {
              label: "Net collected",
              value: money(collected),
              note: "Paid orders less completed refunds",
              icon: CreditCard,
            },
            {
              label: "Awaiting payment",
              value: String(pending.length),
              note: `${money(pending.reduce((s, o) => s + orderTotals(o).total, 0))} outstanding · excludes cancelled`,
              icon: ReceiptText,
            },
            {
              label: "Ready to dispatch",
              value: String(ready.length),
              note: "Prepared orders awaiting hand-off",
              icon: PackageCheck,
            },
          ].map((metric) => (
            <div key={metric.label} className="flex min-w-0 gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control border border-border bg-surface-alt text-accent">
                <metric.icon size={15} />
              </span>
              <div className="min-w-0">
                <p className="text-label text-muted">{metric.label}</p>
                <p className="mt-1 text-kpi font-semibold tracking-tight">{metric.value}</p>
                <p className="mt-1 text-tiny text-muted">{metric.note}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 border-t border-border pt-2 text-tiny text-muted">
          Overview follows store, date and payment filters. Queue tabs, exact status and search
          refine the register below.
        </p>
      </Card>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-surface px-3 py-2.5">
        <div className="flex items-center gap-2 text-label">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span>
            <strong className="font-medium">Your next actions</strong>
            <span className="ml-2 text-muted">
              {pending.length} payments to follow up · {ready.length} orders ready to ship
            </span>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={!pending.length}
            onClick={() => attention("all", "Pending")}
          >
            Review payments
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!ready.length}
            onClick={() => attention("Ready to ship", "all")}
          >
            Open dispatch queue
          </Button>
        </div>
      </div>
      <Card
        title={<CommerceCardTitle label="Order register" />}
        action={
          <span className="text-tiny text-muted">{matches.length} matching orders · USD</span>
        }
      >
        <div
          className="my-3 flex gap-1 overflow-x-auto border-b border-border pb-2"
          aria-label="Order queues"
        >
          {queues.map((tab) => (
            <Button
              key={tab.id}
              size="sm"
              variant={queue === tab.id ? "secondary" : "ghost"}
              aria-pressed={queue === tab.id}
              className="shrink-0"
              onClick={() => {
                setQueue(tab.id);
                setStatus("all");
                setSelected([]);
              }}
            >
              <tab.icon size={12} />
              {tab.label}
              <span className="rounded-sm bg-surface-alt px-1.5 py-0.5 text-tiny text-muted">
                {tab.id === "all"
                  ? scoped.length
                  : scoped.filter((order) => tab.statuses.includes(order.status)).length}
              </span>
            </Button>
          ))}
        </div>
        <div className="mb-3 flex flex-wrap items-end gap-2">
          <SlidersHorizontal size={14} className="mb-2 text-muted" />
          <label className="flex flex-col gap-1 text-tiny text-muted">
            Fulfilment
            <Select
              aria-label="Order status filter"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setQueue("all");
                setSelected([]);
              }}
            >
              <option value="all">All statuses</option>
              {orderStatuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-1 text-tiny text-muted">
            Payment
            <Select
              aria-label="Order payment filter"
              value={payment}
              onChange={(e) => {
                setPayment(e.target.value);
                setSelected([]);
              }}
            >
              <option value="all">All payments</option>
              {["Paid", "Pending", "Refunded"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-1 text-tiny text-muted">
            Store
            <Select
              aria-label="Order store filter"
              value={store}
              onChange={(e) => {
                setStore(e.target.value);
                setSelected([]);
              }}
            >
              <option value="all">All stores</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-1 text-tiny text-muted">
            Date range
            <Select
              aria-label="Order date filter"
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value);
                setSelected([]);
              }}
            >
              <option value="all">All dates</option>
              {[7, 30, 90].map((n) => (
                <option key={n} value={n}>
                  Last {n} days
                </option>
              ))}
            </Select>
          </label>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clear}>
              <X size={12} />
              Reset filters
            </Button>
          )}
        </div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-control border border-border bg-surface-alt px-2 py-1.5">
          <div className="flex items-center gap-2 text-tiny">
            <Button
              size="sm"
              variant="ghost"
              disabled={!matches.length}
              onClick={() =>
                setSelected(
                  selectedOrders.length === matches.length ? [] : matches.map((order) => order.id),
                )
              }
            >
              {selectedOrders.length === matches.length && matches.length
                ? "Clear selection"
                : "Select all results"}
            </Button>
            <span className="text-muted">
              {selectedOrders.length
                ? `${selectedOrders.length} selected · ${money(selectedOrders.reduce((s, o) => s + orderTotals(o).total, 0))}`
                : "Select rows to export a specific order batch"}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={!selectedOrders.length}
            onClick={() => exportOrders(selectedOrders)}
          >
            <ArrowDownToLine size={12} />
            Export selected
          </Button>
        </div>
        <OrdersTable
          orders={orders}
          data={data}
          operations
          search={{
            value: query,
            onChange: (value) => {
              setQuery(value);
              setSelected([]);
            },
          }}
          selected={selected}
          onSelect={(id) =>
            setSelected((old) =>
              old.includes(id) ? old.filter((value) => value !== id) : [...old, id],
            )
          }
          onPreview={setPreview}
        />
      </Card>
      <Dialog
        open={!!item}
        title={item ? `Order ${item.id}` : "Order preview"}
        onClose={() => setPreview("")}
      >
        {item && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-label text-muted">
                {item.created} · {stores.find((s) => s.id === item.storeId)?.name}
              </span>
              <OrderStatusBadge status={item.status} />
            </div>
            <div className="rounded-control border border-border bg-surface-alt p-3">
              <p className="font-medium">{customer?.name || "Unknown customer"}</p>
              <p className="mt-1 break-all text-label text-muted">{customer?.email}</p>
              <p className="mt-2 text-label text-muted">{item.address}</p>
            </div>
            <div className="divide-y divide-border">
              {item.items.map((line, index) => {
                const product = data.products.find((p) => p.id === line.productId);
                return (
                  <div key={index} className="flex items-center gap-2 py-2">
                    {product && <ProductThumb product={product} />}
                    <div className="min-w-0 flex-1">
                      <p className="text-label font-medium">{line.name}</p>
                      <p className="mt-1 text-tiny text-muted">
                        {line.quantity} × {money(line.unitPrice)}
                      </p>
                    </div>
                    <span className="text-label font-medium">
                      {money(line.quantity * line.unitPrice)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <OrderStatusBadge status={item.payment} />
              <span className="text-lg font-semibold">{money(orderTotals(item).total)}</span>
            </div>
            <p className="text-tiny text-muted">
              Total includes tax, shipping and discounts. Tracking:{" "}
              {item.tracking || "Not dispatched"}.
            </p>
            <div className="flex justify-end">
              <Link
                className="ui-button ui-button--primary"
                href={`/apps/ecommerce/orders/${item.id}`}
              >
                Manage order
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        )}
      </Dialog>
    </CommerceWorkspace>
  );
}
