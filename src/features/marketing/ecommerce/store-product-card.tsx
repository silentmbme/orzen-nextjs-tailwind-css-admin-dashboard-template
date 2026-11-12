"use client";
import Image from "next/image";
import { Eye, Heart, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { storeMoney, type StoreProduct } from "./data";
export function StoreProductCard({
  product,
  wished,
  onWish,
  onAdd,
  onPreview,
}: {
  product: StoreProduct;
  wished: boolean;
  onWish: () => void;
  onAdd: () => void;
  onPreview: () => void;
}) {
  return (
    <article className="min-w-0">
      <div className="relative overflow-hidden rounded-lg border border-border bg-surface-alt">
        <button
          type="button"
          aria-label={`Quick view ${product.name}`}
          onClick={onPreview}
          className="block aspect-square w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-accent"
        >
          <Image
            src={product.image}
            alt={product.name}
            width={480}
            height={480}
            className="h-full w-full object-cover transition-transform duration-300 motion-safe:hover:scale-105"
          />
        </button>
        <span className="absolute left-3 top-3 rounded bg-surface px-2 py-1 text-[9px] font-medium">
          {product.label}
        </span>
        <IconButton
          aria-label={`${wished ? "Remove" : "Add"} ${product.name} ${wished ? "from" : "to"} wishlist`}
          aria-pressed={wished}
          onClick={onWish}
          className="absolute! right-3 top-3 bg-surface!"
        >
          <Heart size={14} className={wished ? "fill-accent text-accent" : ""} />
        </IconButton>
        <button
          type="button"
          onClick={onPreview}
          className="absolute bottom-3 right-3 flex items-center gap-1 rounded border border-border bg-surface px-2 py-1 text-[9px] hover:text-accent"
        >
          <Eye size={11} />
          Quick view
        </button>
      </div>
      <div className="py-3">
        <div
          className="mb-1.5 flex items-center gap-1 text-accent"
          aria-label="Illustrative five-star rating"
        >
          {[0, 1, 2, 3, 4].map((index) => (
            <Star key={index} size={10} fill="currentColor" aria-hidden="true" />
          ))}
        </div>
        <p className="mb-1 text-[10px] text-muted">
          {product.category} / {product.color}
        </p>
        <h3 className="text-[13px] font-medium">{product.name}</h3>
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-[13px] font-medium">
            {storeMoney(product.price)}
            <del className="ms-2 text-[10px] font-normal text-muted">
              {storeMoney(product.original)}
            </del>
          </p>
          <Button size="sm" onClick={onAdd} aria-label={`Add ${product.name} to cart`}>
            <Plus size={12} />
            Add
          </Button>
        </div>
      </div>
    </article>
  );
}
