"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowLeft,
  CheckCircle2,
  ShoppingBag,
  Package,
  Pencil,
  ReceiptText,
  Star,
  Warehouse,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ProductInformation } from "./product-information";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { CommerceWorkspace } from "./commerce-workspace";
import { ProductForm } from "./product-form";
import { ProductGallery } from "./product-gallery";
import { ProductPerformance } from "./product-performance";
import { OrdersTable } from "./orders-table";
import { CommerceCardTitle, OrderStatusBadge } from "./commerce-ui";
import { useCommerce } from "../hooks/use-commerce";
import { downloadReport } from "../demo-service";
import { daysAgo, money } from "../types";

export function ProductDetails({ id }: { id: string }) {
  const { data } = useCommerce();
  const [edit, setEdit] = useState(false),
    [period, setPeriod] = useState("all"),
    [tab, setTab] = useState("overview");
  const product = data.products.find((p) => p.id === id);
  const allOrders = data.orders.filter((order) =>
    order.items.some((item) => item.productId === id),
  );
  const orders = allOrders.filter(
    (order) =>
      period === "all" || (daysAgo(order.created) >= 0 && daysAgo(order.created) < Number(period)),
  );
  const sales = orders
    .filter((order) => order.payment === "Paid")
    .flatMap((order) => order.items)
    .filter((item) => item.productId === id);
  const units = sales.reduce((sum, item) => sum + item.quantity, 0),
    revenue = sales.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const reviews = data.reviews.filter((review) => review.productId === id),
    published = reviews.filter((review) => review.status === "Published");
  const movements = data.movements
    .filter((movement) => movement.productId === id)
    .toSorted((a, b) => b.date.localeCompare(a.date));
  const days =
    period === "all"
      ? Math.max(90, ...allOrders.map((order) => daysAgo(order.created) + 1))
      : Number(period);
  const category = data.categories.find((c) => c.id === product?.categoryId);

  const rating = published.length
    ? published.reduce((sum, review) => sum + review.rating, 0) / published.length
    : 0;
  const checklist = product
    ? [
        { label: "Product photography", complete: product.images.length > 0 },
        {
          label: "Description & SKU",
          complete: !!product.description.trim() && !!product.sku.trim(),
        },
        { label: "Pricing configured", complete: product.price > 0 },
        { label: "Category assigned", complete: !!category },
        { label: "Stock available", complete: product.stock > 0 },
      ]
    : [];
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "orders", label: "Orders", count: orders.length },
    { id: "reviews", label: "Reviews", count: reviews.length },
    { id: "inventory", label: "Inventory history", count: movements.length },
  ];
  return (
    <CommerceWorkspace
      title={product?.name || "Product not found"}
      description="Product workspace · catalog, performance and operational history."
      actions={
        <>
          <Link
            href="/apps/ecommerce/products"
            className="inline-flex items-center gap-1 text-label text-accent"
          >
            <ArrowLeft size={12} />
            Back to products
          </Link>
          {product && (
            <>
              <Button
                variant="outline"
                onClick={() =>
                  downloadReport("product-summary", [
                    {
                      product: product.name,
                      sku: product.sku,
                      price: product.price,
                      stock: product.stock,
                      status: product.status,
                      period,
                      paidUnits: units,
                      productRevenue: revenue,
                      orders: orders.length,
                    },
                  ])
                }
              >
                <ArrowDownToLine size={13} />
                Export summary
              </Button>
              <Button onClick={() => setEdit(true)}>
                <Pencil size={13} />
                Edit product
              </Button>
            </>
          )}
        </>
      }
    >
      {product ? (
        <>
          <div className="grid items-start gap-widget md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <Card
              title={<CommerceCardTitle label="Product gallery" />}
              action={
                <span className="text-tiny text-muted">
                  {product.images.length} asset{product.images.length === 1 ? "" : "s"}
                </span>
              }
            >
              <div className="mt-3">
                <ProductGallery key={product.id} product={product} />
              </div>
            </Card>
            <ProductInformation
              product={product}
              category={category?.name || "Uncategorized"}
              onEdit={() => setEdit(true)}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex max-w-full gap-1 overflow-x-auto" aria-label="Product sections">
              {tabs.map((item) => (
                <Button
                  key={item.id}
                  variant={tab === item.id ? "secondary" : "ghost"}
                  aria-pressed={tab === item.id}
                  className="shrink-0"
                  onClick={() => setTab(item.id)}
                >
                  {item.label}
                  {item.count !== undefined && (
                    <span className="rounded-sm bg-surface-alt px-1.5 py-0.5 text-tiny text-muted">
                      {item.count}
                    </span>
                  )}
                </Button>
              ))}
            </div>
            <Select
              aria-label="Product sales period"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              <option value="all">All time</option>
              {[7, 30, 90].map((value) => (
                <option key={value} value={value}>
                  Last {value} days
                </option>
              ))}
            </Select>
          </div>
          <Card>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                {
                  label: "Units sold",
                  value: String(units),
                  note: "Paid items · selected period",
                  icon: Package,
                },
                {
                  label: "Product revenue",
                  value: money(revenue),
                  note: "Before order-level adjustments",
                  icon: ReceiptText,
                },
                {
                  label: "Orders containing product",
                  value: String(orders.length),
                  note: "All payment / fulfilment states",
                  icon: ShoppingBag,
                },
                {
                  label: "Available stock",
                  value: String(product.stock),
                  note: "Current snapshot · all time",
                  icon: Warehouse,
                },
              ].map((metric) => (
                <div key={metric.label} className="flex min-w-0 gap-2">
                  <metric.icon size={15} className="mt-1 shrink-0 text-accent" />
                  <div className="min-w-0">
                    <p className="text-label text-muted">{metric.label}</p>
                    <p className="mt-1 break-words text-kpi font-semibold">{metric.value}</p>
                    <p className="mt-1 text-tiny text-muted">{metric.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          {tab === "overview" && (
            <div className="grid items-stretch gap-widget xl:grid-cols-[minmax(0,1fr)_320px]">
              <ProductPerformance orders={orders} productId={id} days={days} />
              <Card
                title={<CommerceCardTitle label="Catalog readiness" />}
                action={
                  <span className="text-tiny text-muted">
                    {checklist.filter((item) => item.complete).length} / {checklist.length} checks
                  </span>
                }
              >
                <div className="mt-3 space-y-3">
                  {checklist.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-2 text-label"
                    >
                      <span className="text-muted">{item.label}</span>
                      {item.complete ? (
                        <CheckCircle2 size={14} className="text-success" />
                      ) : (
                        <XCircle size={14} className="text-danger" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-control border border-border bg-surface-alt p-3">
                  <p className="flex items-center gap-1.5 text-label font-medium">
                    <Star size={12} className="text-accent" />
                    Published customer rating
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {published.length ? `${rating.toFixed(1)} / 5` : "Not rated"}
                  </p>
                  <p className="mt-1 text-tiny text-muted">
                    {published.length} published ·{" "}
                    {reviews.filter((review) => review.status === "Pending").length} awaiting
                    moderation
                  </p>
                </div>
                <p className="mt-3 text-tiny text-muted">
                  Checks reflect configured fields and current stock. Listing state remains{" "}
                  {product.status.toLowerCase()} until edited.
                </p>
              </Card>
            </div>
          )}
          {tab === "orders" && (
            <Card title={<CommerceCardTitle label="Orders containing this product" />}>
              <p className="mt-2 text-tiny text-muted">
                Selected period · totals below cover the entire order, including other products.
              </p>
              <OrdersTable orders={orders} data={data} />
            </Card>
          )}
          {tab === "reviews" && (
            <Card
              title={<CommerceCardTitle label="Customer feedback" />}
              action={
                <Link href="/apps/ecommerce/reviews" className="text-label text-accent">
                  Moderate reviews →
                </Link>
              }
            >
              <div className="mt-3 space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-control border border-border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-label font-medium">
                        {data.customers.find((customer) => customer.id === review.customerId)
                          ?.name || "Unknown customer"}
                      </span>
                      <OrderStatusBadge status={review.status} />
                    </div>
                    <p className="mt-2 flex items-center gap-1 text-label">
                      <Star size={12} className="text-accent" />
                      {review.rating} / 5
                      <span className="ml-2 text-tiny text-muted">{review.created}</span>
                    </p>
                    <p className="mt-2 text-label text-muted">{review.comment}</p>
                  </div>
                ))}
                {!reviews.length && <EmptyState>No reviews for this product yet.</EmptyState>}
              </div>
              <p className="mt-3 text-tiny text-muted">
                Feedback covers all dates. Only published reviews contribute to the customer rating.
              </p>
            </Card>
          )}
          {tab === "inventory" && (
            <Card
              title={<CommerceCardTitle label="Inventory movement" />}
              action={
                <Link href="/apps/ecommerce/inventory" className="text-label text-accent">
                  Adjust inventory →
                </Link>
              }
            >
              <p className="mt-2 text-tiny text-muted">
                Opening balance and local adjustments · all dates · orders do not trigger additional
                stock deductions.
              </p>
              <div className="[&_table]:min-w-[600px]">
                <DataTable
                  label="Product inventory movements"
                  rows={movements}
                  rowKey={(movement) => movement.id}
                  columns={[
                    { key: "date", label: "Date", value: (movement) => movement.date },
                    { key: "before", label: "Before", value: (movement) => movement.before },
                    {
                      key: "change",
                      label: "Change",
                      value: (movement) => movement.change,
                      render: (movement) => (
                        <span className={movement.change >= 0 ? "text-success" : "text-danger"}>
                          {movement.change > 0 ? "+" : ""}
                          {movement.change}
                        </span>
                      ),
                    },
                    { key: "after", label: "After", value: (movement) => movement.after },
                    { key: "reason", label: "Reason", value: (movement) => movement.reason },
                  ]}
                />
              </div>
            </Card>
          )}
          <Dialog open={edit} title="Edit demo product" onClose={() => setEdit(false)}>
            {edit && (
              <ProductForm
                key={product.id}
                product={product}
                onSave={() => setEdit(false)}
                onCancel={() => setEdit(false)}
              />
            )}
          </Dialog>
        </>
      ) : (
        <Card>
          <EmptyState>
            No product matches this link. It may belong to another browser’s local demo.
          </EmptyState>
        </Card>
      )}
    </CommerceWorkspace>
  );
}

export function NewProduct() {
  const router = useRouter();
  return (
    <CommerceWorkspace
      title="Add product"
      description="Create a fictional product in this browser’s catalog."
    >
      <Card title={<CommerceCardTitle label="Product details" />}>
        <ProductForm
          onSave={(id) => router.push(`/apps/ecommerce/products/${id}`)}
          onCancel={() => router.push("/apps/ecommerce/products")}
        />
      </Card>
    </CommerceWorkspace>
  );
}
