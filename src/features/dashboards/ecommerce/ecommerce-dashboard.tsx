"use client";
import { CommerceCardTitle } from "@/features/ecommerce/components/commerce-ui";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpRight,
  MessageSquare,
  RotateCcw,
  CreditCard,
  PackageCheck,
  CircleCheck,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommerceWorkspace } from "@/features/ecommerce/components/commerce-workspace";
import { OrdersTable } from "@/features/ecommerce/components/orders-table";
import { useCommerce } from "@/features/ecommerce/hooks/use-commerce";
import { downloadReport } from "@/features/ecommerce/demo-service";
import { money, stores } from "@/features/ecommerce/types";
import { dashboardData } from "./data";
import { RevenuePerformance } from "./components/revenue-performance";
import { OrderFulfilment } from "./components/order-fulfilment";
import { TopProducts } from "./components/top-products";
import { CategorySales } from "./components/category-sales";
import { CustomerInsights } from "./components/customer-insights";
import { InventoryAlerts } from "./components/inventory-alerts";
import { OrderValueDistribution } from "./components/order-value-distribution";
import { BasketAnalysis } from "./components/basket-analysis";
import { RevenueBreakdown } from "./components/revenue-breakdown";
import { OverviewMetrics } from "./components/overview-metrics";
export function EcommerceDashboard() {
  const { data } = useCommerce();
  const [store, setStore] = useState("all"),
    [days, setDays] = useState("30");
  const view = dashboardData(data, store, Number(days));
  const refunds = data.refunds.filter(
    (refund) =>
      view.orders.some((order) => order.id === refund.orderId) &&
      ["Requested", "Approved"].includes(refund.status),
  );
  const operations = [
    {
      label: "Review moderation",
      description: "Unpublished feedback · all stores",
      count: data.reviews.filter((r) => r.status === "Pending").length,
      icon: MessageSquare,
      href: "/apps/ecommerce/reviews",
    },
    {
      label: "Payment follow-up",
      description: "Pending payment · selected period",
      count: view.orders.filter((o) => o.payment === "Pending" && o.status !== "Cancelled").length,
      icon: CreditCard,
      href: "/apps/ecommerce/orders",
    },
    {
      label: "Dispatch queue",
      description: "Ready to ship · selected period",
      count: view.orders.filter((o) => o.status === "Ready to ship").length,
      icon: PackageCheck,
      href: "/apps/ecommerce/orders",
    },
    {
      label: "Refund requests",
      description: "Awaiting approval · all stores",
      count: data.refunds.filter((r) => r.status === "Requested").length,
      icon: RotateCcw,
      href: "/apps/ecommerce/refunds",
    },
    {
      label: "Low stock alerts",
      description: "Products running low · all stores",
      count: data.products.filter((p) => p.stock <= 10).length,
      icon: AlertTriangle,
      href: "/apps/ecommerce/products",
    },
  ];
  return (
    <CommerceWorkspace
      title="eCommerce overview"
      description="Your store’s performance, buying patterns and fulfilment priorities."
      actions={
        <>
          <Select aria-label="Store" value={store} onChange={(e) => setStore(e.target.value)}>
            <option value="all">All stores</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <Select aria-label="Date range" value={days} onChange={(e) => setDays(e.target.value)}>
            {[7, 30, 90].map((n) => (
              <option key={n} value={n}>
                Last {n} days
              </option>
            ))}
          </Select>
          <Button variant="dark" onClick={() => downloadReport("commerce-report", view.chart)}>
            <ArrowDownToLine size={13} />
            Export report
          </Button>
        </>
      }
    >
      <OverviewMetrics data={data} view={view} store={store} days={Number(days)} />
      <div className="grid items-stretch gap-widget xl:grid-cols-[minmax(0,1fr)_340px]">
        <RevenuePerformance {...view} />
        <OrderFulfilment orders={view.orders} />
      </div>
      <div className="grid items-stretch gap-widget md:grid-cols-12">
        <div className="min-w-0 md:col-span-7 xl:col-span-7 [&>section]:h-full">
          <TopProducts products={view.products} />
        </div>
        <div className="min-w-0 md:col-span-5 xl:col-span-5 [&>section]:h-full">
          <CustomerInsights data={data} orders={view.orders} />
        </div>
      </div>
      <div className="grid items-stretch gap-widget lg:grid-cols-3">
        <OrderValueDistribution orders={view.orders} />
        <BasketAnalysis orders={view.orders} products={view.products} />
        <RevenueBreakdown orders={view.orders} data={data} />
      </div>
      <div className="grid items-start gap-widget xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card
          title={<CommerceCardTitle label="Recent orders" />}
          action={
            <Link
              href="/apps/ecommerce/orders"
              className="inline-flex items-center gap-1 text-tiny text-accent"
            >
              All orders
              <ArrowUpRight size={12} />
            </Link>
          }
        >
          <div className="mt-2">
            <OrdersTable orders={view.orders} data={data} />
          </div>
        </Card>
        <InventoryAlerts products={view.products} days={Number(days)} />
      </div>
      <div className="grid gap-widget lg:grid-cols-3">
        <CategorySales products={view.products} categories={data.categories} />
        <Card
          title={<CommerceCardTitle label="Returns & refunds" />}
          action={
            <Link href="/apps/ecommerce/refunds" className="text-tiny text-accent">
              Review requests →
            </Link>
          }
        >
          <div className="my-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-subtle text-danger">
              <RotateCcw size={18} />
            </span>
            <div>
              <p className="text-kpi font-semibold">
                {money(refunds.reduce((sum, r) => sum + r.amount, 0))}
              </p>
              <p className="text-tiny text-muted">Open requests · selected order period</p>
            </div>
            <Badge className="ml-auto">{refunds.length} requests</Badge>
          </div>
          <div className="divide-y divide-border">
            {refunds.map((refund) => (
              <Link
                href="/apps/ecommerce/refunds"
                key={refund.id}
                className="flex items-start justify-between gap-3 py-2.5 text-label"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    {refund.orderId}
                    <span className="ml-2 text-tiny font-normal text-muted">{refund.created}</span>
                  </p>
                  <p className="mt-1 truncate text-tiny text-muted">{refund.reason}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="font-medium">{money(refund.amount)}</span>
                  <p className="mt-1 text-tiny text-accent">{refund.status}</p>
                </div>
              </Link>
            ))}
            {!refunds.length && (
              <p className="py-4 text-label text-muted">No open refunds in this period.</p>
            )}
          </div>
        </Card>
        <Card
          title={<CommerceCardTitle label="Operations action center" />}
          action={<span className="text-tiny text-muted">Local demo queues</span>}
        >
          <div className="mt-3 divide-y divide-border">
            {operations.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control border border-border bg-surface-alt text-muted group-hover:text-accent">
                  <item.icon size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-label font-medium">{item.label}</p>
                  <p className="mt-1 text-tiny text-muted">{item.description}</p>
                </div>
                <span className="text-lg font-semibold">{item.count}</span>
                {item.count ? (
                  <AlertCircle size={13} className="text-danger" />
                ) : (
                  <CircleCheck size={13} className="text-success" />
                )}
                <ArrowUpRight size={12} className="text-muted" />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </CommerceWorkspace>
  );
}
