"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Dialog } from "@/components/ui/dialog";
import type { Product } from "../types";
export function ProductGallery({ product }: { product: Product }) {
  const [selected, setSelected] = useState(0),
    [expanded, setExpanded] = useState(false);
  const index = Math.min(selected, product.images.length - 1);
  const src = product.images[index] || "/images/ecommerce/headphones.webp";
  const move = (direction: number) =>
    setSelected((index + direction + product.images.length) % product.images.length);
  return (
    <div
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <div className="relative overflow-hidden rounded-control border border-border bg-surface-alt">
        <button
          onClick={() => setExpanded(true)}
          aria-label="Enlarge product image"
          className="relative block aspect-square max-h-[420px] w-full focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
        >
          <Image
            src={src}
            alt={`${product.name} · photo ${index + 1}`}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            unoptimized={src.startsWith("data:")}
            className="object-contain"
          />
        </button>
        <span className="pointer-events-none absolute left-3 top-3 rounded-control border border-border bg-surface px-2 py-1 text-tiny text-muted">
          {index + 1} / {product.images.length}
        </span>
        <Button
          size="sm"
          variant="outline"
          className="absolute! right-3 bottom-3"
          onClick={() => setExpanded(true)}
        >
          <Expand size={12} />
          Enlarge
        </Button>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-tiny text-muted">
          <ImageIcon size={12} />
          {product.images.length} catalog image{product.images.length === 1 ? "" : "s"}
        </p>
        <div className="flex gap-1">
          <IconButton
            variant="ghost"
            aria-label="Previous product photo"
            disabled={product.images.length < 2}
            onClick={() => move(-1)}
          >
            <ChevronLeft size={14} />
          </IconButton>
          <IconButton
            variant="ghost"
            aria-label="Next product photo"
            disabled={product.images.length < 2}
            onClick={() => move(1)}
          >
            <ChevronRight size={14} />
          </IconButton>
        </div>
      </div>
      {product.images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {product.images.map((photo, photoIndex) => (
            <button
              key={photoIndex}
              aria-label={`View photo ${photoIndex + 1}`}
              aria-pressed={photoIndex === index}
              onClick={() => setSelected(photoIndex)}
              className={`shrink-0 rounded-control border p-1 focus-visible:outline-2 focus-visible:outline-accent ${photoIndex === index ? "border-accent" : "border-border"}`}
            >
              <Image
                src={photo}
                alt=""
                width={52}
                height={52}
                unoptimized={photo.startsWith("data:")}
                className="h-13 w-13 rounded-sm object-contain"
              />
            </button>
          ))}
        </div>
      )}
      <Dialog
        open={expanded}
        title={`${product.name} · ${index + 1}/${product.images.length}`}
        onClose={() => setExpanded(false)}
      >
        <Image
          src={src}
          alt={product.name}
          width={640}
          height={640}
          unoptimized={src.startsWith("data:")}
          className="max-h-[60vh] w-full rounded-control object-contain"
        />
        <div className="mt-3 flex items-center justify-between">
          <Button variant="outline" disabled={product.images.length < 2} onClick={() => move(-1)}>
            <ChevronLeft size={13} />
            Previous photo
          </Button>
          <Button variant="outline" disabled={product.images.length < 2} onClick={() => move(1)}>
            Next photo
            <ChevronRight size={13} />
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
