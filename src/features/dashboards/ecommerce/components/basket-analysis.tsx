import Link from "next/link";
import { ShoppingBasket, ShoppingBag, Layers3, ArrowRight, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CommerceCardTitle, ProductThumb } from "@/features/ecommerce/components/commerce-ui";
import { money, orderTotals, type Order, type Product } from "@/features/ecommerce/types";
export function BasketAnalysis({ orders, products }: { orders: Order[]; products: Product[] }) {
  const paid = orders.filter((order) => order.payment === "Paid");
  const quantity = (order: Order) => order.items.reduce((sum, item) => sum + item.quantity, 0);
  const units = paid.reduce((sum, order) => sum + quantity(order), 0);
  const multi = paid.filter((order) => quantity(order) > 1).length;
  const bands = [1, 2, 3].map((size) => ({
    size,
    count: paid.filter((order) => (size === 3 ? quantity(order) >= 3 : quantity(order) === size))
      .length,
  }));
  const combos = new Map<string, { ids: string[]; count: number }>();
  paid.forEach((order) => {
    const unique = [...new Map(order.items.map((item) => [item.productId, item])).values()];
    for (let i = 0; i < unique.length; i++)
      for (let j = i + 1; j < unique.length; j++) {
        const key = [unique[i].productId, unique[j].productId].sort().join("|");
        const current = combos.get(key);
        combos.set(key, {
          ids: [unique[i].productId, unique[j].productId],
          count: (current?.count || 0) + 1,
        });
      }
  });
  const pair = [...combos.values()].sort((a, b) => b.count - a.count)[0];
  return (
    <Card
      title={<CommerceCardTitle label="Basket intelligence" />}
      action={<ShoppingBasket size={15} className="text-muted" />}
    >
      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-tiny text-muted">Units per paid order</p>
          <strong className="text-kpi font-semibold">
            {paid.length ? (units / paid.length).toFixed(1) : "0.0"}
          </strong>
        </div>
        <div className="text-right">
          <span className="text-lg font-semibold">
            {paid.length ? ((multi / paid.length) * 100).toFixed(0) : 0}%
          </span>
          <p className="text-tiny text-muted">multi-item baskets</p>
        </div>
      </div>
      <div className="my-4 grid grid-cols-3 divide-x divide-border">
        {bands.map((band) => (
          <div key={band.size} className="px-2 text-center first:pl-0 last:pr-0">
            <div className="flex h-5 justify-center text-accent">
              {Array.from({ length: band.size }, (_, index) => (
                <ShoppingBag key={index} size={15} className={index ? "-ml-1" : ""} />
              ))}
            </div>
            <p className="mt-1 text-label font-medium">{band.count} orders</p>
            <p className="mt-1 text-tiny text-muted">
              {band.size === 3 ? "3+ items" : `${band.size} item${band.size > 1 ? "s" : ""}`}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-control border border-dashed border-border bg-surface-alt p-3">
        <p className="flex items-center gap-1.5 text-tiny font-medium">
          <Layers3 size={12} />
          Frequently bought together
        </p>
        {pair ? (
          <>
            <div className="mt-3 grid grid-cols-[1fr_20px_1fr] items-start gap-2">
              {pair.ids.map((id, index) => {
                const product = products.find((p) => p.id === id);
                return (
                  product && (
                    <div
                      key={id}
                      className={index ? "col-start-3 row-start-1" : "col-start-1 row-start-1"}
                    >
                      <Link
                        className="flex flex-col items-center gap-1.5 text-center text-tiny"
                        href={`/apps/ecommerce/products/${id}`}
                      >
                        <ProductThumb product={product} />
                        <span>{product.name}</span>
                      </Link>
                    </div>
                  )
                );
              })}
              <Plus size={14} className="col-start-2 row-start-1 mt-3 text-muted" />
            </div>
            <p className="mt-2 text-center text-tiny text-muted">
              {pair.count} shared order{pair.count === 1 ? "" : "s"} in this period
            </p>
          </>
        ) : (
          <p className="mt-2 text-tiny text-muted">No multi-product combinations in this period.</p>
        )}
      </div>
      <div className="mt-3 flex justify-between text-tiny">
        <span className="text-muted">
          Average subtotal{" "}
          {money(
            paid.length ? paid.reduce((s, o) => s + orderTotals(o).subtotal, 0) / paid.length : 0,
          )}
        </span>
        <Link
          href="/apps/ecommerce/orders"
          aria-label="Explore baskets in orders"
          className="text-accent"
        >
          <ArrowRight size={14} />
        </Link>
      </div>
    </Card>
  );
}
