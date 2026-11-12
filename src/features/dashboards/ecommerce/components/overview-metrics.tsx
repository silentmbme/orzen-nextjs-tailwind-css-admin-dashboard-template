import Link from "next/link";
import { Box, DollarSign, ShoppingCart, UsersRound, EllipsisVertical } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { downloadReport } from "@/features/ecommerce/demo-service";
import { daysAgo, money, type CommerceData } from "@/features/ecommerce/types";
import type { dashboardData } from "../data";

export function OverviewMetrics({
  data,
  view,
  store,
  days,
}: {
  data: CommerceData;
  view: ReturnType<typeof dashboardData>;
  store: string;
  days: number;
}) {
  const catalog = data.products.filter(
    (product) => (store === "all" || product.storeId === store) && daysAgo(product.created) >= 0,
  );
  const priorOrders = data.orders.filter(
    (order) =>
      (store === "all" || order.storeId === store) &&
      daysAgo(order.created) >= days &&
      daysAgo(order.created) < days * 2,
  );
  const metrics = [
    {
      label: "Total products",
      value: catalog.length,
      previous: catalog.filter((product) => daysAgo(product.created) >= days).length,
      display: String(catalog.length),
      icon: Box,
      href: "/apps/ecommerce/products",
      detail:
        "Current catalog count, including drafts and archived listings, versus the catalog at the start of the selected period.",
    },
    {
      label: "Total revenue",
      value: view.revenue,
      previous: view.previous,
      display: money(view.revenue),
      icon: DollarSign,
      href: "/apps/ecommerce/orders",
      detail:
        "Net collected in this period versus the previous equal-length period; completed refunds deducted.",
    },
    {
      label: "Total orders",
      value: view.orders.length,
      previous: priorOrders.length,
      display: String(view.orders.length),
      icon: ShoppingCart,
      href: "/apps/ecommerce/orders",
      detail:
        "All orders placed in this period, including cancellations, versus the previous equal-length period.",
    },
    {
      label: "Customers",
      value: new Set(view.orders.map((order) => order.customerId)).size,
      previous: new Set(priorOrders.map((order) => order.customerId)).size,
      display: String(new Set(view.orders.map((order) => order.customerId)).size),
      icon: UsersRound,
      href: "/apps/ecommerce/customers",
      detail:
        "Unique customers with orders in this period versus the previous equal-length period.",
    },
  ];
  return (
    <div
      className="grid gap-widget sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Store overview metrics"
    >
      {metrics.map((metric) => {
        const change = metric.previous
          ? ((metric.value - metric.previous) / metric.previous) * 100
          : null;
        const trend =
          change === null
            ? metric.value
              ? "New"
              : "0.0%"
            : `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
        return (
          <div key={metric.label} title={metric.detail}>
            <MetricCard
              variant="inset"
              label={metric.label}
              value={metric.display}
              change={trend}
              up={change === null || change >= 0}
              icon={metric.icon}
              comparison={`Last ${days} days`}
              action={
                <details className="group relative">
                  <summary
                    aria-label={`${metric.label} options`}
                    className="flex h-5 w-5 cursor-pointer list-none items-center justify-center rounded-sm text-muted hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden"
                  >
                    <EllipsisVertical size={14} />
                  </summary>
                  <div className="absolute right-0 top-7 z-20 w-44 rounded-control border border-border bg-surface p-1 text-label shadow-sm">
                    <Link
                      href={metric.href}
                      className="block rounded-sm px-2 py-2 hover:bg-surface-alt"
                    >
                      View related records
                    </Link>
                    <button
                      className="w-full rounded-sm px-2 py-2 text-left hover:bg-surface-alt"
                      onClick={(event) => {
                        downloadReport(metric.label.toLowerCase().replaceAll(" ", "-"), [
                          {
                            metric: metric.label,
                            current: metric.value,
                            previous: metric.previous,
                            periodDays: days,
                            store,
                            definition: metric.detail,
                          },
                        ]);
                        event.currentTarget.closest("details")?.removeAttribute("open");
                      }}
                    >
                      Export metric CSV
                    </button>
                  </div>
                </details>
              }
            />
          </div>
        );
      })}
    </div>
  );
}
