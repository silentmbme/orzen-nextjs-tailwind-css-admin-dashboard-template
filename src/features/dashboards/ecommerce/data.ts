import { daysAgo, demoDate, orderTotals, type CommerceData } from "@/features/ecommerce/types";
export type ProductPerformance = ReturnType<typeof dashboardData>["products"][number];
export const chartColors = [
  "var(--accent)",
  "var(--color-trend-down)",
  "var(--color-trend-up)",
  "var(--muted)",
];
export function dashboardData(data: CommerceData, store: string, days: number) {
  const scoped = data.orders.filter((order) => store === "all" || order.storeId === store);
  const orders = scoped.filter(
    (order) => daysAgo(order.created) >= 0 && daysAgo(order.created) < days,
  );
  const previous = scoped.filter(
    (order) => daysAgo(order.created) >= days && daysAgo(order.created) < days * 2,
  );
  const revenue = (list: typeof orders) =>
    list.reduce(
      (sum, order) =>
        sum +
        (order.payment === "Paid"
          ? orderTotals(order).total -
            data.refunds
              .filter((refund) => refund.orderId === order.id && refund.status === "Completed")
              .reduce((s, r) => s + r.amount, 0)
          : 0),
      0,
    );
  const chart = Array.from({ length: 7 }, (_, index) => {
    const start = Math.floor((index * days) / 7),
      end = Math.floor(((index + 1) * days) / 7);
    const bucket = orders.filter((order) => {
      const age = daysAgo(order.created);
      return age >= start && age < end;
    });
    const priorBucket = previous.filter((order) => {
      const age = daysAgo(order.created) - days;
      return age >= start && age < end;
    });
    const name = new Date(Date.parse(demoDate) - start * 86400000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
    return {
      name,
      revenue: revenue(bucket),
      previous: revenue(priorBucket),
      orders: bucket.length,
      previousOrders: priorBucket.length,
    };
  }).reverse();
  const products = data.products
    .filter((product) => store === "all" || product.storeId === store)
    .map((product) => {
      const items = orders
        .filter((order) => order.payment === "Paid")
        .flatMap((order) => order.items)
        .filter((item) => item.productId === product.id);
      return {
        ...product,
        units: items.reduce((sum, item) => sum + item.quantity, 0),
        sales: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
      };
    })
    .sort((a, b) => b.sales - a.sales);
  return {
    orders,
    products,
    chart,
    revenue: revenue(orders),
    previous: revenue(previous),
    previousOrders: previous.length,
  };
}
