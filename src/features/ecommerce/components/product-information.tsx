"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ClipboardCopy,
  Layers3,
  Pencil,
  Store,
  Warehouse,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommerceCardTitle, OrderStatusBadge } from "./commerce-ui";
import { money, stores, type Product } from "../types";

export function ProductInformation({
  product,
  category,
  onEdit,
}: {
  product: Product;
  category: string;
  onEdit: () => void;
}) {
  const [notice, setNotice] = useState("");
  const store = stores.find((item) => item.id === product.storeId);
  const savings = Math.max(0, product.compareAt - product.price);
  const low = product.stock <= product.reorderLevel;
  async function copySku() {
    try {
      await navigator.clipboard.writeText(product.sku);
      setNotice("SKU copied to clipboard.");
    } catch {
      setNotice("Clipboard unavailable. Select and copy the SKU above.");
    }
  }
  return (
    <Card
      title={<CommerceCardTitle label="Product information" />}
      action={<OrderStatusBadge status={product.status} />}
    >
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge>{category}</Badge>
        <span className="inline-flex items-center gap-1 text-tiny text-muted">
          <Store size={11} />
          {store?.name}
        </span>
      </div>
      <p className="mt-2 text-[18px] font-semibold leading-snug tracking-tight">{product.name}</p>
      <div className="mt-2 flex items-center gap-2 text-tiny">
        <span className="text-muted">SKU</span>
        <span className="min-w-0 break-all font-medium tracking-wide">{product.sku}</span>
        <button
          onClick={copySku}
          aria-label="Copy product SKU"
          className="shrink-0 rounded-sm p-1 text-muted hover:bg-surface-alt hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
        >
          {notice === "SKU copied to clipboard." ? (
            <Check size={12} className="text-success" />
          ) : (
            <ClipboardCopy size={12} />
          )}
        </button>
      </div>
      <p className="mt-3 text-body leading-relaxed text-muted">{product.description}</p>

      <div className="my-4 overflow-hidden rounded-control border border-border bg-surface-alt">
        <div className="flex flex-wrap items-start justify-between gap-3 p-3">
          <div>
            <p className="text-tiny text-muted">Selling price</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <strong className="text-[24px] font-semibold leading-tight tracking-tight">
                {money(product.price)}
              </strong>
              <span className="text-tiny text-muted">USD / unit</span>
            </div>
          </div>
          {savings > 0 && (
            <div className="text-right">
              <Badge tone="success">
                {Math.round((savings / product.compareAt) * 100)}% below compare-at
              </Badge>
              <p className="mt-2 text-tiny text-success">{money(savings)} less per unit</p>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2">
          <p className="text-tiny text-muted">
            Compare-at price{" "}
            <span className="ml-1.5 font-medium text-foreground">
              {product.compareAt > 0 ? <del>{money(product.compareAt)}</del> : "Not set"}
            </span>
          </p>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Pencil size={11} />
            Update pricing
          </Button>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-border pb-4 text-label">
        <div className="flex min-w-0 gap-2">
          <Layers3 size={13} className="mt-0.5 shrink-0 text-muted" />
          <div className="min-w-0">
            <dt className="text-tiny text-muted">Collection</dt>
            <dd className="mt-1 break-words">
              <Link href="/apps/ecommerce/categories" className="font-medium text-accent">
                {category}
              </Link>
            </dd>
          </div>
        </div>
        <div className="flex min-w-0 gap-2">
          <CalendarDays size={13} className="mt-0.5 shrink-0 text-muted" />
          <div>
            <dt className="text-tiny text-muted">Added to catalog</dt>
            <dd className="mt-1 font-medium">{product.created}</dd>
          </div>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1.5 text-label font-medium">
          <Warehouse size={13} className="text-muted" />
          Inventory position
        </p>
        <span
          className={`inline-flex items-center gap-1.5 text-tiny ${low ? "text-danger" : "text-success"}`}
        >
          <i className={`h-1.5 w-1.5 rounded-full ${low ? "bg-danger" : "bg-success"}`} />
          {product.stock === 0 ? "Out of stock" : low ? "Reorder needed" : "Healthy stock"}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 divide-x divide-border rounded-control border border-border bg-surface-alt py-3">
        <div className="px-3">
          <p className="text-tiny text-muted">Available to sell</p>
          <p className="mt-1 text-lg font-semibold">
            {product.stock}
            <span className="ml-1 text-tiny font-normal text-muted">units</span>
          </p>
        </div>
        <div className="px-3">
          <p className="text-tiny text-muted">Reorder at</p>
          <p className="mt-1 text-lg font-semibold">
            {product.reorderLevel}
            <span className="ml-1 text-tiny font-normal text-muted">units</span>
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-tiny text-muted">
          {low
            ? "At or below the configured reorder level."
            : `${product.stock - product.reorderLevel} units above reorder level.`}
        </p>
        <Link
          href="/apps/ecommerce/inventory"
          className="inline-flex items-center gap-1 text-label font-medium text-accent"
        >
          Manage stock
          <ArrowUpRight size={12} />
        </Link>
      </div>
      <p className="mt-2 text-tiny text-muted">
        Current stock snapshot · tax and shipping calculated on orders.
      </p>
      {notice && (
        <p role="status" className="mt-2 text-tiny text-muted">
          {notice}
        </p>
      )}
    </Card>
  );
}
