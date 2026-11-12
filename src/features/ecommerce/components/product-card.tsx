import Image from "next/image";
import Link from "next/link";
import { Pencil, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InventoryIndicator, OrderStatusBadge } from "./commerce-ui";
import { money, stores, type Product } from "../types";

export function ProductCard({
  product,
  category,
  onEdit,
}: {
  product: Product;
  category: string;
  onEdit: () => void;
}) {
  const discount =
    product.compareAt > product.price
      ? Math.round((1 - product.price / product.compareAt) * 100)
      : 0;
  return (
    <Card className="overflow-hidden p-0!" aria-label={product.name}>
      <Link
        href={`/apps/ecommerce/products/${product.id}`}
        className="group block focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
      >
        <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-surface-alt">
          <Image
            src={product.images[0] || "/images/ecommerce/headphones.webp"}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized={product.images[0]?.startsWith("data:")}
          />
          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            <OrderStatusBadge status={product.status} />
            {discount > 0 && (
              <Badge className="border-accent/20! bg-surface! text-accent!">−{discount}%</Badge>
            )}
          </div>
        </div>
        <div className="space-y-2 p-3">
          <div className="flex items-center justify-between gap-2 text-tiny text-muted">
            <span className="truncate">{category}</span>
            <span className="shrink-0">
              {stores.find((store) => store.id === product.storeId)?.name}
            </span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-h-9 line-clamp-2 text-body font-medium leading-[18px] group-hover:text-accent">
              {product.name}
            </h3>
            <ArrowUpRight
              size={14}
              className="mt-0.5 shrink-0 text-muted group-hover:text-accent"
            />
          </div>
          <p className="truncate text-tiny text-muted">SKU · {product.sku}</p>
          <div className="flex flex-wrap items-baseline gap-2 pt-1">
            <strong className="text-lg font-semibold tracking-tight">{money(product.price)}</strong>
            {product.compareAt > product.price && (
              <del className="text-label text-muted">{money(product.compareAt)}</del>
            )}
            <span className="ml-auto text-tiny text-muted">USD</span>
          </div>
        </div>
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2.5">
        <InventoryIndicator product={product} />
        <Button size="sm" variant="outline" onClick={onEdit} aria-label={`Edit ${product.name}`}>
          <Pencil size={12} />
          Edit
        </Button>
      </div>
    </Card>
  );
}
