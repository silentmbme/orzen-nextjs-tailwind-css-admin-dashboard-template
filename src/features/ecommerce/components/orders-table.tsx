"use client";
import { UserAvatar } from "@/components/ui/user-avatar";
import Link from "next/link";
import { Eye, Package, Truck } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, ProductThumb } from "./commerce-ui";
import { money, orderTotals, stores, type CommerceData, type Order } from "../types";
export function orderSearchText(order: Order, data: CommerceData) {
  const customer = data.customers.find((c) => c.id === order.customerId);
  return [
    order.id,
    order.created,
    order.status,
    order.payment,
    order.tracking,
    customer?.name,
    customer?.email,
    stores.find((s) => s.id === order.storeId)?.name,
    orderTotals(order).total,
    ...order.items.map((i) => i.name),
  ]
    .join(" ")
    .toLowerCase();
}
export function OrdersTable({
  orders,
  data,
  operations,
  search,
  selected = [],
  onSelect,
  onPreview,
}: {
  orders: Order[];
  data: CommerceData;
  operations?: boolean;
  search?: { value: string; onChange: (value: string) => void };
  selected?: string[];
  onSelect?: (id: string) => void;
  onPreview?: (id: string) => void;
}) {
  return (
    <div className={operations ? "[&_table]:min-w-[1080px]" : "[&_table]:min-w-[620px]"}>
      <DataTable
        label="Orders"
        rows={orders}
        rowKey={(o) => o.id}
        pageSize={operations ? 8 : 5}
        search={search}
        columns={[
          ...(operations
            ? [
                {
                  key: "select",
                  label: "Select",
                  value: (o: Order) => o.id,
                  render: (o: Order) => (
                    <input
                      type="checkbox"
                      aria-label={`Select ${o.id}`}
                      checked={selected.includes(o.id)}
                      onChange={() => onSelect?.(o.id)}
                      className="h-3.5 w-3.5 cursor-pointer accent-accent"
                    />
                  ),
                },
              ]
            : []),
          {
            key: "id",
            label: "Order",
            value: (o) => (operations ? orderSearchText(o, data) : o.id),
            render: (o) => (
              <div>
                <Link className="font-medium text-accent" href={`/apps/ecommerce/orders/${o.id}`}>
                  {o.id}
                </Link>
                {operations && (
                  <p className="mt-1 text-tiny text-muted">
                    {o.created} · {stores.find((s) => s.id === o.storeId)?.name}
                  </p>
                )}
              </div>
            ),
          },
          {
            key: "customer",
            label: "Customer",
            value: (o) =>
              data.customers.find((c) => c.id === o.customerId)?.name || "Unknown customer",
            render: (o) => {
              const customer = data.customers.find((c) => c.id === o.customerId);
              return operations ? (
                <div className="flex items-center gap-2">
                  <UserAvatar name={customer?.name} size={28} />
                  <div>
                    <p className="text-label font-medium">{customer?.name || "Unknown customer"}</p>
                    <p className="mt-1 text-tiny text-muted">{customer?.email}</p>
                  </div>
                </div>
              ) : (
                customer?.name || "Unknown customer"
              );
            },
          },
          ...(operations
            ? [
                {
                  key: "items",
                  label: "Items",
                  value: (o: Order) => o.items.reduce((sum, i) => sum + i.quantity, 0),
                  render: (o: Order) => (
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {o.items.slice(0, 2).map((item, i) => {
                          const product = data.products.find((p) => p.id === item.productId);
                          return product ? (
                            <div
                              key={i}
                              className="rounded-control border-2 border-surface [&_img]:h-7 [&_img]:w-7"
                            >
                              <ProductThumb product={product} />
                            </div>
                          ) : null;
                        })}
                      </div>
                      <span className="text-tiny text-muted">
                        {o.items.reduce((sum, i) => sum + i.quantity, 0)} units
                      </span>
                    </div>
                  ),
                },
              ]
            : [{ key: "date", label: "Date", value: (o: Order) => o.created }]),
          {
            key: "status",
            label: operations ? "Fulfilment" : "Status",
            value: (o) => o.status,
            render: (o) => (
              <div>
                <OrderStatusBadge status={o.status} />
                {operations && (
                  <p className="mt-1 flex items-center gap-1 text-tiny text-muted">
                    {o.tracking ? <Truck size={10} /> : <Package size={10} />}
                    <span>
                      {o.tracking ||
                        (o.status === "Cancelled"
                          ? "Order cancelled"
                          : o.status === "Returned"
                            ? "Returned to store"
                            : "Not dispatched")}
                    </span>
                  </p>
                )}
              </div>
            ),
          },
          {
            key: "payment",
            label: "Payment",
            value: (o) => o.payment,
            render: (o) => <OrderStatusBadge status={o.payment} />,
          },
          {
            key: "total",
            label: "Total",
            value: (o) => orderTotals(o).total,
            render: (o) => (
              <strong className="font-medium tabular-nums">{money(orderTotals(o).total)}</strong>
            ),
          },
          ...(operations
            ? [
                {
                  key: "preview",
                  label: "Details",
                  value: (o: Order) => o.id,
                  render: (o: Order) => (
                    <Button
                      size="sm"
                      variant="outline"
                      aria-label={`Preview ${o.id}`}
                      onClick={() => onPreview?.(o.id)}
                    >
                      <Eye size={12} />
                      View
                    </Button>
                  ),
                },
              ]
            : []),
        ]}
      />
    </div>
  );
}
