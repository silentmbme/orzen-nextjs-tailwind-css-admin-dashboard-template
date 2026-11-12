"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Minus, Plus, ShoppingCart, Trash2, Truck } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";

const samples = [
  {
    id: "headphones",
    name: "Wireless headphones",
    detail: "Midnight · Audio",
    price: 89,
    quantity: 1,
  },
  {
    id: "watch",
    name: "Everyday smart watch",
    detail: "Silver · Wearables",
    price: 129,
    quantity: 1,
  },
  {
    id: "speaker",
    name: "Portable speaker",
    detail: "Graphite · Audio",
    price: 49,
    quantity: 1,
  },
];
const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
export function CartDropdown() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(samples);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 200 ? 0 : 12;
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  function quantity(id: string, delta: number) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(99, Math.max(1, item.quantity + delta)),
            }
          : item,
      ),
    );
  }
  return (
    <div
      ref={root}
      className="relative"
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget))
          setOpen(false);
      }}
    >
      <IconButton
        ref={trigger}
        aria-label="Cart"
        title={`Cart (${count} items)`}
        aria-expanded={open}
        aria-controls="header-cart"
        onClick={() => setOpen((value) => !value)}
        className="relative"
      >
        <ShoppingCart size={16} />
        {count > 0 && (
          <span
            aria-label={`${count} items in cart`}
            className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full border-2 border-surface bg-danger dark:bg-danger px-0.5 text-[9px] font-semibold leading-none text-white"
          >
            {count}
          </span>
        )}
      </IconButton>
      {open && (
        <section
          id="header-cart"
          aria-label="Shopping cart"
          className="absolute right-0 top-full z-50 mt-2 w-[380px] max-w-[calc(100vw-18px)] overflow-hidden rounded-[10px] border border-border bg-surface text-foreground shadow-sm max-[560px]:fixed max-[560px]:right-[9px] max-[560px]:top-[55px]"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[13px] font-semibold">Shopping cart</h2>
              <span
                aria-live="polite"
                className="rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent"
              >
                {count} items
              </span>
            </div>
            <span className="text-[10px] text-muted">Demo cart</span>
          </div>
          <div className="max-h-[min(300px,38dvh)] overflow-y-auto overscroll-contain">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 border-b border-border p-4 last:border-b-0">
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-surface-alt">
                  <Image
                    src={`/images/ecommerce/${item.id}.webp`}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[12px] font-medium leading-4">{item.name}</p>
                      <p className="mt-1 text-[10px] text-muted">{item.detail}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() =>
                        setItems((current) => current.filter((row) => row.id !== item.id))
                      }
                      className="rounded p-1 text-muted hover:bg-surface-alt hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center rounded-md border border-border">
                      <button
                        type="button"
                        aria-label={`Decrease ${item.name} quantity`}
                        aria-disabled={item.quantity === 1}
                        onClick={() => quantity(item.id, -1)}
                        className="grid h-6 w-6 place-items-center rounded-l-md hover:bg-surface-alt aria-disabled:opacity-40"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="min-w-5 text-center text-[11px] tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase ${item.name} quantity`}
                        aria-disabled={item.quantity === 99}
                        onClick={() => quantity(item.id, 1)}
                        className="grid h-6 w-6 place-items-center rounded-r-md hover:bg-surface-alt aria-disabled:opacity-40"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                    <span className="text-[12px] font-semibold tabular-nums">
                      {money(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="px-4 py-8 text-center">
                <ShoppingCart size={30} className="mx-auto mb-3 text-muted" />
                <p className="text-[13px] font-medium">Your cart is empty</p>
                <p className="mb-3 mt-1 text-[11px] text-muted">
                  Add the sample collection to explore cart actions.
                </p>
                <Button size="sm" onClick={() => setItems(samples)}>
                  Restore sample items
                </Button>
              </div>
            )}
          </div>
          {items.length > 0 && (
            <>
              <div className="flex items-center gap-2 border-y border-border bg-accent/5 px-4 py-2.5 text-[11px] text-accent">
                <Truck size={14} />
                {shipping === 0
                  ? "Your demo order qualifies for free shipping"
                  : `${money(200 - subtotal)} away from free shipping`}
              </div>
              <div className="grid gap-2 px-4 py-3 text-[11px]">
                <p className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </p>
                <p className="flex justify-between text-muted">
                  <span>Estimated shipping</span>
                  <span>{shipping ? money(shipping) : "Free"}</span>
                </p>
                <p
                  className="flex justify-between border-t border-border pt-2 text-[13px] font-semibold"
                  aria-live="polite"
                >
                  <span>Total</span>
                  <span>{money(subtotal + shipping)}</span>
                </p>
              </div>
            </>
          )}
          <div className="border-t border-border p-3">
            <Link
              href="/apps/ecommerce/products"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-md bg-accent px-3 py-2 text-[12px] font-medium text-white! hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Browse products <ArrowUpRight size={14} />
            </Link>
            <p className="mt-2 text-center text-[10px] text-muted">
              Simulated items & prices · no payment is collected
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
