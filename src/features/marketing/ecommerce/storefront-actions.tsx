"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Heart, Moon, ShoppingBag, Sun, UserRound } from "lucide-react";

export function StorefrontActions({
  wishesOnly,
  wishCount,
  cartCount,
  onWish,
  onCart,
}: {
  wishesOnly: boolean;
  wishCount: number;
  cartCount: number;
  onWish: () => void;
  onCart: () => void;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const circle =
    "grid size-9 place-items-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent/30 hover:bg-accent/5 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
  return (
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
      <Link
        href="/login"
        aria-label="Sign in"
        className="group flex items-center gap-2 rounded-full p-1 hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-accent"
      >
        <span className={circle}>
          <UserRound size={17} strokeWidth={1.7} aria-hidden="true" />
        </span>
        <span className="hidden pe-2 text-start xl:block">
          <span className="block text-[9px] leading-4 text-muted">Welcome back</span>
          <span className="block text-[11px] font-semibold leading-4">Sign in / Register</span>
        </span>
      </Link>
      <span className="mx-1 hidden h-7 border-s border-border sm:block" aria-hidden="true" />
      <button
        type="button"
        aria-label="Switch storefront theme"
        title="Switch theme"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className={circle}
      >
        <Moon size={16} aria-hidden="true" className="dark:hidden" />
        <Sun size={16} aria-hidden="true" className="hidden dark:block" />
      </button>
      <button
        type="button"
        aria-label={`Wishlist (${wishCount})`}
        title="Your wishlist"
        aria-pressed={wishesOnly}
        onClick={onWish}
        className={`${circle} relative ${wishesOnly ? "border-accent/40! bg-accent/10! text-accent!" : ""}`}
      >
        <Heart
          size={17}
          strokeWidth={1.7}
          aria-hidden="true"
          className={wishesOnly ? "fill-accent/20" : ""}
        />
        <span className="absolute -end-1 -top-1 grid h-[17px] min-w-[17px] place-items-center rounded-full border-2 border-surface bg-surface-alt px-0.5 text-[8px] font-semibold tabular-nums text-foreground">
          {wishCount > 99 ? "99+" : wishCount}
        </span>
      </button>
      <button
        type="button"
        aria-label={`Shopping bag (${cartCount})`}
        title="Open shopping bag"
        onClick={onCart}
        className="flex h-9 items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 text-accent transition-colors hover:border-accent/40 hover:bg-accent/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <ShoppingBag size={17} strokeWidth={1.7} aria-hidden="true" />
        <span className="hidden text-[11px] font-medium sm:block">My bag</span>
        <span className="grid size-[18px] place-items-center rounded-full bg-accent px-1 text-[9px] font-semibold tabular-nums text-white">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      </button>
    </div>
  );
}
