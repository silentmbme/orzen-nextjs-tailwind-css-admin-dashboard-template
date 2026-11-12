import { CommerceCardTitle } from "@/features/ecommerce/components/commerce-ui";
import { ReceiptText, Minus, Plus, Equal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { money, orderTotals, type CommerceData, type Order } from "@/features/ecommerce/types";
export function RevenueBreakdown({ data, orders }: { data: CommerceData; orders: Order[] }) {
  const captured = orders.filter(
    (order) => order.payment === "Paid" || order.payment === "Refunded",
  );
  const subtotal = captured.reduce((sum, order) => sum + orderTotals(order).subtotal, 0);
  const discount = captured.reduce((sum, order) => sum + order.discount, 0);
  const shippingTax = captured.reduce((sum, order) => sum + order.shipping + order.tax, 0);
  const refunds = data.refunds
    .filter(
      (refund) => refund.status === "Completed" && captured.some((o) => o.id === refund.orderId),
    )
    .reduce((sum, refund) => sum + refund.amount, 0);
  const net = subtotal - discount + shippingTax - refunds;
  const rows = [
    { label: "Product subtotal", value: subtotal, icon: ReceiptText, negative: false },
    { label: "Order discounts", value: discount, icon: Minus, negative: true },
    { label: "Shipping + tax", value: shippingTax, icon: Plus, negative: false },
    { label: "Completed refunds", value: refunds, icon: Minus, negative: true },
  ];
  return (
    <Card
      title={<CommerceCardTitle label="Revenue reconciliation" />}
      action={<span className="text-tiny text-muted">USD</span>}
    >
      <div className="mt-3 space-y-1">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-2 border-b border-dashed border-border py-2.5 text-label"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full ${row.negative ? "bg-danger-subtle text-danger" : "bg-surface-alt text-muted"}`}
            >
              <row.icon size={11} />
            </span>
            <span className="flex-1 text-muted">{row.label}</span>
            <span className="font-medium tabular-nums">
              {row.negative ? "−" : ""}
              {money(row.value)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 rounded-control bg-accent/5 p-3">
        <span className="flex items-center gap-2 text-label font-medium">
          <Equal size={14} className="text-accent" />
          Net collected
        </span>
        <strong className="text-lg font-semibold">{money(net)}</strong>
      </div>
      <p className="mt-3 text-tiny text-muted">
        {captured.length} paid or fully refunded orders. Pending payments excluded. Refunds are
        attributed to the order’s period.
      </p>
    </Card>
  );
}
