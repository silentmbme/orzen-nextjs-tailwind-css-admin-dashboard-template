"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { CommerceWorkspace } from "./commerce-workspace";
import { CouponForm } from "./coupon-form";
import { CommerceCardTitle, OrderStatusBadge } from "./commerce-ui";
import { useCommerce } from "../hooks/use-commerce";
import { couponState, money, type Coupon } from "../types";
export function Coupons() {
  const { data } = useCommerce(),
    [editing, setEditing] = useState<Coupon | "new" | null>(null);
  return (
    <CommerceWorkspace
      title="Coupons"
      description="Manage demo discounts, expiry dates and usage limits."
      actions={<Button onClick={() => setEditing("new")}>Create coupon</Button>}
    >
      <Card title={<CommerceCardTitle label="Discount codes" />}>
        <div className="[&_table]:min-w-[650px]">
          <DataTable
            label="Coupons"
            rows={data.coupons}
            rowKey={(c) => c.id}
            columns={[
              { key: "code", label: "Code", value: (c) => c.code },
              {
                key: "discount",
                label: "Discount",
                value: (c) => c.value,
                render: (c) => (c.kind === "Percentage" ? `${c.value}%` : money(c.value)),
              },
              {
                key: "minimum",
                label: "Minimum spend",
                value: (c) => c.minSpend,
                render: (c) => money(c.minSpend),
              },
              {
                key: "usage",
                label: "Usage",
                value: (c) => c.uses,
                render: (c) => `${c.uses} / ${c.maxUses}`,
              },
              { key: "expires", label: "Expires", value: (c) => c.expires },
              {
                key: "status",
                label: "Status",
                value: (c) => couponState(c),
                render: (c) => <OrderStatusBadge status={couponState(c)} />,
              },
              {
                key: "edit",
                label: "Manage",
                value: (c) => c.code,
                render: (c) => (
                  <Button variant="outline" onClick={() => setEditing(c)}>
                    Edit
                  </Button>
                ),
              },
            ]}
          />
        </div>
      </Card>
      <Dialog
        open={!!editing}
        title={editing === "new" ? "Create coupon" : "Edit coupon"}
        onClose={() => setEditing(null)}
      >
        {editing && (
          <CouponForm
            key={editing === "new" ? "new" : editing.id}
            coupon={editing === "new" ? undefined : editing}
            onClose={() => setEditing(null)}
          />
        )}
      </Dialog>
    </CommerceWorkspace>
  );
}
