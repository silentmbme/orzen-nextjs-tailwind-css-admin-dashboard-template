"use client";
import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { CommerceWorkspace } from "./commerce-workspace";
import { CommerceCardTitle, OrderStatusBadge } from "./commerce-ui";
import { useCommerce } from "../hooks/use-commerce";
import { demoDate, money, orderTotals, round, type Refund } from "../types";
export function Refunds() {
  const { data, update } = useCommerce(),
    [selected, setSelected] = useState(""),
    [filter, setFilter] = useState("all"),
    [error, setError] = useState("");
  const refund = data.refunds.find((r) => r.id === selected),
    order = data.orders.find((o) => o.id === refund?.orderId);
  function transition(status: Refund["status"]) {
    if (!refund || !order) return;
    const allowed =
      refund.status === "Requested"
        ? ["Approved", "Rejected"]
        : refund.status === "Approved"
          ? ["Completed", "Rejected"]
          : [];
    if (!allowed.includes(status)) return;
    const completed = data.refunds
      .filter((r) => r.orderId === order.id && r.id !== refund.id && r.status === "Completed")
      .reduce((s, r) => s + r.amount, 0);
    if (
      status !== "Rejected" &&
      (order.payment !== "Paid" ||
        refund.amount <= 0 ||
        round(completed + refund.amount) > orderTotals(order).total)
    ) {
      setError("This request exceeds the remaining paid amount or the order is not paid.");
      return;
    }
    update((state) => {
      state.refunds.find((r) => r.id === refund.id)!.status = status;
      if (status === "Completed" && round(completed + refund.amount) === orderTotals(order).total) {
        const updated = state.orders.find((o) => o.id === order.id)!;
        updated.payment = "Refunded";
        updated.status = "Returned";
        updated.timeline.push({ status: "Returned", date: demoDate });
      }
    });
    setError("");
  }
  return (
    <CommerceWorkspace
      title="Refunds"
      description="Review requests and simulate local refund decisions. No money is moved."
    >
      <Card
        title={<CommerceCardTitle label="Refund tracking" />}
        action={
          <Select
            aria-label="Refund status filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All requests</option>
            {["Requested", "Approved", "Rejected", "Completed"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        }
      >
        <div className="mb-3 flex flex-wrap gap-4 text-label">
          <span>
            Requested:{" "}
            <strong className="font-medium">
              {money(
                data.refunds
                  .filter((r) => r.status === "Requested")
                  .reduce((s, r) => s + r.amount, 0),
              )}
            </strong>
          </span>
          <span>
            Completed:{" "}
            <strong className="font-medium">
              {money(
                data.refunds
                  .filter((r) => r.status === "Completed")
                  .reduce((s, r) => s + r.amount, 0),
              )}
            </strong>
          </span>
        </div>
        <div className="[&_table]:min-w-[650px]">
          <DataTable
            label="Refunds"
            rows={data.refunds.filter((r) => filter === "all" || r.status === filter)}
            rowKey={(r) => r.id}
            columns={[
              { key: "id", label: "Request", value: (r) => r.id },
              { key: "order", label: "Order", value: (r) => r.orderId },
              {
                key: "amount",
                label: "Amount",
                value: (r) => r.amount,
                render: (r) => money(r.amount),
              },
              { key: "reason", label: "Reason", value: (r) => r.reason },
              {
                key: "status",
                label: "Status",
                value: (r) => r.status,
                render: (r) => <OrderStatusBadge status={r.status} />,
              },
              {
                key: "view",
                label: "Details",
                value: (r) => r.id,
                render: (r) => (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelected(r.id);
                      setError("");
                    }}
                  >
                    View request
                  </Button>
                ),
              },
            ]}
          />
        </div>
      </Card>
      <Dialog open={!!refund} title="Refund request" onClose={() => setSelected("")}>
        {refund && (
          <div className="space-y-3">
            <div className="flex justify-between">
              <Link className="text-accent" href={`/apps/ecommerce/orders/${refund.orderId}`}>
                {refund.orderId}
              </Link>
              <OrderStatusBadge status={refund.status} />
            </div>
            <p className="text-kpi font-semibold">{money(refund.amount)}</p>
            <p className="text-label text-muted">{refund.reason}</p>
            <p className="text-label">
              Requested {refund.created} · Order total{" "}
              {order ? money(orderTotals(order).total) : "Unavailable"}
            </p>
            <p className="text-label text-muted">
              Approval and completion are separate demo steps. Partial refunds reduce net collected
              revenue without changing the fulfilment stage.
            </p>
            {error && (
              <p role="alert" className="text-danger">
                {error}
              </p>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              {["Requested", "Approved"].includes(refund.status) && (
                <Button variant="outline" onClick={() => transition("Rejected")}>
                  Reject request
                </Button>
              )}
              {refund.status === "Requested" && (
                <Button onClick={() => transition("Approved")}>Approve demo refund</Button>
              )}
              {refund.status === "Approved" && (
                <Button onClick={() => transition("Completed")}>Complete demo refund</Button>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </CommerceWorkspace>
  );
}
