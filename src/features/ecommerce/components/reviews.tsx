"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { CommerceWorkspace } from "./commerce-workspace";
import { CommerceCardTitle, ProductIdentity, OrderStatusBadge } from "./commerce-ui";
import { useCommerce } from "../hooks/use-commerce";
export function Reviews() {
  const { data, update } = useCommerce(),
    [status, setStatus] = useState("all"),
    [notice, setNotice] = useState("");
  return (
    <CommerceWorkspace
      title="Reviews"
      description="Inspect customer feedback and moderate local demo reviews."
    >
      <Card title={<CommerceCardTitle label="Rating distribution" />}>
        <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
          <div>
            <p className="text-kpi font-semibold">
              {data.reviews.length
                ? (data.reviews.reduce((s, r) => s + r.rating, 0) / data.reviews.length).toFixed(1)
                : "—"}{" "}
              / 5
            </p>
            <p className="text-label text-muted">{data.reviews.length} reviews · all statuses</p>
          </div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = data.reviews.filter((r) => r.rating === rating).length;
              return (
                <div key={rating} className="flex items-center gap-2 text-label">
                  <span className="w-12">{rating} stars</span>
                  <div className="h-1.5 flex-1 rounded-full bg-surface-alt">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${(count / Math.max(data.reviews.length, 1)) * 100}%` }}
                    />
                  </div>
                  <span className="w-4 text-right text-muted">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
      <Card
        title={<CommerceCardTitle label="Customer feedback" />}
        action={
          <Select
            aria-label="Review status filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All reviews</option>
            {["Pending", "Published", "Hidden"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        }
      >
        <p role="status" className="text-label text-muted">
          {notice}
        </p>
        <div className="[&_table]:min-w-[850px]">
          <DataTable
            label="Reviews"
            rows={data.reviews.filter((r) => status === "all" || r.status === status)}
            rowKey={(r) => r.id}
            columns={[
              {
                key: "product",
                label: "Product",
                value: (r) => data.products.find((p) => p.id === r.productId)?.name || "Unknown",
                render: (r) => {
                  const product = data.products.find((p) => p.id === r.productId);
                  return product ? <ProductIdentity product={product} /> : "Unknown product";
                },
              },
              {
                key: "customer",
                label: "Customer",
                value: (r) => data.customers.find((c) => c.id === r.customerId)?.name || "Unknown",
              },
              {
                key: "rating",
                label: "Rating",
                value: (r) => r.rating,
                render: (r) => `${r.rating} / 5`,
              },
              {
                key: "comment",
                label: "Feedback",
                value: (r) => r.comment,
                render: (r) => (
                  <span className="block max-w-[240px] whitespace-normal">{r.comment}</span>
                ),
              },
              {
                key: "status",
                label: "Status",
                value: (r) => r.status,
                render: (r) => <OrderStatusBadge status={r.status} />,
              },
              {
                key: "moderate",
                label: "Moderate",
                value: (r) => r.status,
                render: (r) => (
                  <div className="flex gap-1">
                    {(["Published", "Hidden"] as const).map((next) => (
                      <Button
                        key={next}
                        disabled={r.status === next}
                        variant="outline"
                        onClick={() => {
                          update((state) => {
                            state.reviews.find((item) => item.id === r.id)!.status = next;
                          });
                          setNotice(`Review ${r.id} ${next.toLowerCase()} locally.`);
                        }}
                      >
                        {next === "Published" ? "Publish" : "Hide"}
                      </Button>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Card>
    </CommerceWorkspace>
  );
}
