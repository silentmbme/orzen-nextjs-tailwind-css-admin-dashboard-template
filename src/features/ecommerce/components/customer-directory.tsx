"use client";
import { UserAvatar } from "@/components/ui/user-avatar";
import { CommerceCardTitle } from "@/features/ecommerce/components/commerce-ui";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { CommerceWorkspace } from "./commerce-workspace";
import { OrdersTable } from "./orders-table";
import { useCommerce } from "../hooks/use-commerce";
import { money, orderTotals } from "../types";
export function CustomerDirectory() {
  const { data } = useCommerce(),
    [selected, setSelected] = useState("");
  const customer = data.customers.find((c) => c.id === selected);
  const orders = data.orders.filter((o) => o.customerId === selected);
  const spend = (id: string) =>
    data.orders
      .filter((o) => o.customerId === id && o.payment === "Paid")
      .reduce(
        (s, o) =>
          s +
          orderTotals(o).total -
          data.refunds
            .filter((r) => r.orderId === o.id && r.status === "Completed")
            .reduce((a, r) => a + r.amount, 0),
        0,
      );
  return (
    <CommerceWorkspace
      title="Customers"
      description="Demo buyer profiles, order histories and purchase statistics."
    >
      <Card title={<CommerceCardTitle label="Customer directory" />}>
        <div className="[&_table]:min-w-[650px]">
          <DataTable
            label="Customers"
            rows={data.customers}
            rowKey={(c) => c.id}
            pageSize={6}
            columns={[
              {
                key: "name",
                label: "Customer",
                value: (c) => c.name,
                render: (c) => (
                  <button
                    className="flex items-center gap-2 text-accent"
                    onClick={() => setSelected(c.id)}
                  >
                    <UserAvatar name={c.name} size={28} />
                    {c.name}
                  </button>
                ),
              },
              { key: "email", label: "Email", value: (c) => c.email },
              { key: "region", label: "Region", value: (c) => c.region },
              {
                key: "orders",
                label: "Orders",
                value: (c) => data.orders.filter((o) => o.customerId === c.id).length,
              },
              {
                key: "spent",
                label: "Net collected",
                value: (c) => spend(c.id),
                render: (c) => money(spend(c.id)),
              },
              {
                key: "profile",
                label: "Profile",
                value: (c) => c.name,
                render: (c) => (
                  <Button variant="outline" onClick={() => setSelected(c.id)}>
                    View profile
                  </Button>
                ),
              },
            ]}
          />
        </div>
      </Card>
      <Dialog open={!!customer} title="Customer profile" onClose={() => setSelected("")}>
        {customer && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <UserAvatar name={customer.name} size={40} />
              <p className="font-medium">{customer.name}</p>
            </div>
            <p className="break-all text-label text-muted">
              {customer.email} · {customer.region}
            </p>
            <p className="text-label text-muted">
              {customer.address} · Joined {customer.joined}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-control bg-surface-alt p-3">
                <p className="text-label text-muted">Total orders</p>
                <strong className="text-kpi font-semibold">{orders.length}</strong>
              </div>
              <div className="rounded-control bg-surface-alt p-3">
                <p className="text-label text-muted">Net collected</p>
                <strong className="text-kpi font-semibold">{money(spend(customer.id))}</strong>
              </div>
            </div>
            <OrdersTable orders={orders} data={data} />
          </div>
        )}
      </Dialog>
    </CommerceWorkspace>
  );
}
