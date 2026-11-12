"use client";
import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Heart, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Dialog } from "@/components/ui/dialog";
import { storeMoney, type StoreProduct } from "./data";
import { collection, StorefrontSections } from "./storefront-sections";
import { StorefrontHeader } from "./storefront-header";
import { StorefrontFooter } from "./storefront-footer";
export function EcommerceLanding() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishesOnly, setWishesOnly] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [preview, setPreview] = useState<StoreProduct | null>(null);
  const [notice, setNotice] = useState("");
  const items = collection.filter((product) => cart[product.id]);
  const itemCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const total = items.reduce((sum, product) => sum + product.price * cart[product.id], 0);
  function add(product: StoreProduct) {
    setCart((current) => ({
      ...current,
      [product.id]: Math.min(99, (current[product.id] ?? 0) + 1),
    }));
    setNotice(product.name + " added to your bag.");
  }
  function wish(product: StoreProduct) {
    const exists = wishlist.includes(product.id);
    setWishlist((current) =>
      exists ? current.filter((id) => id !== product.id) : [...current, product.id],
    );
    setNotice(product.name + (exists ? " removed from" : " saved to") + " your wishlist.");
  }
  function browse(nextCategory = "All") {
    setCategory(nextCategory);
    setWishesOnly(false);
    setQuery("");
    document.getElementById("products")?.scrollIntoView({ behavior: "instant", block: "start" });
  }
  return (
    <>
      <StorefrontHeader
        query={query}
        onQuery={setQuery}
        wishesOnly={wishesOnly}
        wishCount={wishlist.length}
        cartCount={itemCount}
        onWish={() => {
          setWishesOnly((value) => !value);
          document.getElementById("products")?.scrollIntoView({ behavior: "instant" });
        }}
        onCart={() => setCartOpen(true)}
      />
      <StorefrontSections
        query={query}
        wishlist={wishlist}
        wishesOnly={wishesOnly}
        category={category}
        setCategory={setCategory}
        onBrowse={browse}
        onWish={wish}
        onAdd={add}
        onPreview={setPreview}
        notice={notice}
      />
      <StorefrontFooter />
      <Dialog open={preview !== null} title="Product quick view" onClose={() => setPreview(null)}>
        {preview && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Image
              src={preview.image}
              alt={preview.name}
              width={360}
              height={360}
              className="aspect-square w-full rounded-lg object-cover"
            />
            <div>
              <p className="marketing-eyebrow">{preview.category}</p>
              <h2 className="text-[23px] font-medium leading-tight tracking-tight">
                {preview.name}
              </h2>
              <p className="my-4 text-[20px] font-semibold">{storeMoney(preview.price)}</p>
              <p className="text-[12px] leading-6 text-muted">{preview.description}</p>
              <p className="my-4 text-[11px]">Color: {preview.color}</p>
              <div className="grid gap-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    add(preview);
                    setPreview(null);
                  }}
                >
                  Add to demo bag
                  <Plus size={13} />
                </Button>
                <Button aria-pressed={wishlist.includes(preview.id)} onClick={() => wish(preview)}>
                  <Heart size={13} />
                  {wishlist.includes(preview.id) ? "Saved to wishlist" : "Save to wishlist"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
      <Dialog
        open={cartOpen}
        title="Your shopping bag"
        onClose={() => setCartOpen(false)}
        variant="offcanvas"
        offcanvasWidth={420}
        closeLabel="Close shopping bag"
      >
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <p className="mb-5 text-[11px] text-muted">Demo bag · {itemCount} items · no payments</p>
          {items.map((product) => (
            <div key={product.id} className="mb-4 flex gap-3 border-b border-border pb-4">
              <Image
                src={product.image}
                alt={product.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-md object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium">{product.name}</p>
                <p className="mt-1 text-[11px] text-muted">{storeMoney(product.price)} each</p>
                <div className="mt-2 flex items-center gap-2">
                  <IconButton
                    aria-label={`Decrease ${product.name}`}
                    onClick={() =>
                      setCart((current) => ({
                        ...current,
                        [product.id]: Math.max(1, current[product.id] - 1),
                      }))
                    }
                  >
                    <Minus size={12} />
                  </IconButton>
                  <span className="text-[11px]">{cart[product.id]}</span>
                  <IconButton aria-label={`Increase ${product.name}`} onClick={() => add(product)}>
                    <Plus size={12} />
                  </IconButton>
                  <IconButton
                    aria-label={`Remove ${product.name}`}
                    onClick={() =>
                      setCart((current) => {
                        const next = { ...current };
                        delete next[product.id];
                        return next;
                      })
                    }
                  >
                    <Trash2 size={13} />
                  </IconButton>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="py-10 text-center">
              <ShoppingBag size={30} className="mx-auto mb-4 text-muted" />
              <p className="text-[15px] font-medium">Room for something good.</p>
              <p className="mt-2 text-[12px] text-muted">Your demo bag is empty.</p>
            </div>
          )}
        </div>
        <div className="border-t border-border p-4">
          <p className="mb-4 flex justify-between text-[16px] font-medium" aria-live="polite">
            <span>Subtotal</span>
            <span>{storeMoney(total)}</span>
          </p>
          <p className="mb-4 text-[10px] text-muted">
            Prices are fictional. Shipping and taxes are not calculated. Checkout is not connected.
          </p>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              setCartOpen(false);
              browse();
            }}
          >
            Continue exploring
            <ArrowRight size={13} />
          </Button>
        </div>
      </Dialog>
    </>
  );
}
