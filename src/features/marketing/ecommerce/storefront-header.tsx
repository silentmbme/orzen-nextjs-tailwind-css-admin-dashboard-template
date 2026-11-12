"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { MarketingContainer } from "@/components/marketing/marketing-container";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { StorefrontActions } from "./storefront-actions";
export function StorefrontHeader({
  query,
  onQuery,
  wishesOnly,
  wishCount,
  cartCount,
  onWish,
  onCart,
}: {
  query: string;
  onQuery: (value: string) => void;
  wishesOnly: boolean;
  wishCount: number;
  cartCount: number;
  onWish: () => void;
  onCart: () => void;
}) {
  const [menu, setMenu] = useState(false);
  return (
    <header className="relative z-20 bg-surface text-foreground">
      <div className="border-b border-border bg-surface-alt/60 py-2 text-center text-[10px] text-muted">
        Thoughtful essentials. A fresh perspective on the everyday.
        <span className="ms-2 text-accent">Discover the new edit</span>
      </div>
      <MarketingContainer className="flex flex-wrap items-center justify-between gap-3 py-4">
        <Link href="/landing/ecommerce" aria-label="Orzen Objects home">
          <Image
            src="/images/brand/orzen-light.svg"
            alt="Orzen"
            width={130}
            height={36}
            className="h-8 w-auto dark:hidden"
          />
          <Image
            src="/images/brand/orzen-dark.svg"
            alt="Orzen"
            width={130}
            height={36}
            className="hidden h-8 w-auto dark:block"
          />
        </Link>
        <div className="relative order-3 w-full md:order-none md:max-w-[380px]">
          <label htmlFor="store-search" className="sr-only">
            Search store products
          </label>
          <Search
            size={14}
            className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            id="store-search"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Find your next everyday favorite..."
            className="w-full bg-surface-alt/40! ps-9!"
          />
        </div>
        <StorefrontActions
          wishesOnly={wishesOnly}
          wishCount={wishCount}
          cartCount={cartCount}
          onWish={onWish}
          onCart={onCart}
        />
      </MarketingContainer>
      <div className="border-y border-accent/10 bg-accent/10">
        <MarketingContainer className="flex min-h-10 items-center justify-between gap-3">
          <a
            href="#categories"
            className="flex items-center gap-2 border-e border-accent/20 pe-4 text-[11px] font-semibold"
          >
            <Menu size={14} />
            Browse categories
          </a>
          <nav
            aria-label="Store navigation"
            className="hidden flex-1 items-center gap-6 text-[11px] font-medium sm:flex"
          >
            {[
              ["Home", "#"],
              ["Shop", "#products"],
              ["Collections", "#categories"],
              ["Journal", "#journal"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="hover:text-accent">
                {label}
              </a>
            ))}
          </nav>
          <a
            href="#offers"
            className="hidden items-center gap-1 text-[11px] font-medium text-accent sm:flex"
          >
            The weekend edit
            <ArrowUpRight size={12} />
          </a>
          <IconButton
            aria-label={menu ? "Close store menu" : "Open store menu"}
            aria-expanded={menu}
            aria-controls="store-mobile-menu"
            className="sm:hidden!"
            onClick={() => setMenu((value) => !value)}
          >
            {menu ? <X size={15} /> : <Menu size={15} />}
          </IconButton>
        </MarketingContainer>
        {menu && (
          <nav
            id="store-mobile-menu"
            aria-label="Mobile store navigation"
            className="grid gap-1 border-t border-border bg-surface p-3 sm:hidden"
          >
            {[
              ["Shop", "#products"],
              ["Collections", "#categories"],
              ["Journal", "#journal"],
              ["Offers", "#offers"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenu(false)}
                className="rounded-md px-3 py-2 text-[12px] hover:bg-surface-alt"
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
