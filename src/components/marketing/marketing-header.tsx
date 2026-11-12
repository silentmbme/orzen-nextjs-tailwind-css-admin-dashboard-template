"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, X } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { MarketingContainer } from "./marketing-container";
import { MarketingNavigation, marketingLinks } from "./marketing-nav";
export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isSaas = pathname === "/landing/saas";
  const isAi = pathname === "/landing/ai";
  const isCrm = pathname === "/landing/crm";
  const isFocusedLanding = isSaas || isAi || isCrm;
  const sectionLinks = isAi
    ? [
        ["Features", "features"],
        ["Pricing", "pricing"],
        ["Workflows", "workflow"],
        ["About", "faq"],
      ]
    : isCrm
      ? [
          ["Pipeline", "pipeline"],
          ["Sales rhythm", "pipeline"],
          ["Pricing", "pricing"],
          ["Contact", "contact"],
        ]
      : [
          ["Features", "features"],
          ["Solutions", "solutions"],
          ["Pricing", "pricing"],
          ["FAQ", "faq"],
        ];
  const { resolvedTheme, setTheme } = useTheme();
  const current = marketingLinks.find((link) => pathname === link.href) ?? marketingLinks[0];
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  if (pathname === "/landing/ecommerce" || pathname === "/landing/ai") return null;
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface">
      <MarketingContainer
        className={`flex items-center justify-between gap-3 ${isFocusedLanding ? "h-[64px]" : "h-[72px]"}`}
      >
        <Link href="/landing/saas" aria-label="Orzen home" className="shrink-0">
          <Image
            src="/images/brand/orzen-light.svg"
            alt="Orzen"
            width={110}
            height={30}
            unoptimized
            priority
            className="dark:hidden"
          />
          <Image
            src="/images/brand/orzen-dark.svg"
            alt="Orzen"
            width={110}
            height={30}
            unoptimized
            priority
            className="hidden dark:block"
          />
        </Link>
        {isFocusedLanding ? (
          <nav
            aria-label={
              isAi
                ? "AI product navigation"
                : isCrm
                  ? "CRM product navigation"
                  : "SaaS product navigation"
            }
            className="hidden items-center gap-1 lg:flex"
          >
            <details
              className="relative"
              onKeyDown={(event) => {
                if (event.key === "Escape") event.currentTarget.open = false;
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  event.currentTarget.open = false;
              }}
            >
              <summary className="list-none rounded-md flex items-center gap-1 px-3 py-2 text-[13px] font-medium text-accent hover:bg-surface-alt">
                Products
                <span aria-hidden="true">
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                  </svg>
                </span>
              </summary>
              <div className="absolute left-0 top-full mt-2 w-48 rounded-lg border border-border bg-surface p-2 [&_nav]:flex-col!">
                <MarketingNavigation />
              </div>
            </details>
            {sectionLinks.map(([label, id]) => (
              <a
                key={`${label}-${id}`}
                href={`#${id}`}
                className="rounded-md px-3 py-2 text-[13px] text-muted hover:bg-surface-alt hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>
        ) : (
          <div className="hidden md:block">
            <MarketingNavigation />
          </div>
        )}
        <div className="flex items-center gap-2">
          {isSaas && (
            <Link
              href="/dashboards/saas"
              className="hidden px-2 py-2 text-[13px] text-muted hover:text-foreground lg:block"
            >
              Login
            </Link>
          )}
          <IconButton
            aria-label="Switch marketing theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <Sun size={15} className="hidden dark:block" />
            <Moon size={15} className="dark:hidden" />
          </IconButton>
          <Link
            href={current.demo}
            className="ui-button ui-button--primary hidden! sm:inline-flex!"
          >
            {isAi ? "Start a demo" : "Explore demo"}
          </Link>
          <IconButton
            aria-label={open ? "Close marketing menu" : "Open marketing menu"}
            aria-expanded={open}
            aria-controls="marketing-mobile-menu"
            className={isFocusedLanding ? "lg:hidden!" : "md:hidden!"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </IconButton>
        </div>
      </MarketingContainer>
      {open && (
        <div
          id="marketing-mobile-menu"
          className={`border-t border-border p-4 ${isFocusedLanding ? "max-h-[calc(100dvh-64px)] overflow-y-auto lg:hidden" : "md:hidden"}`}
        >
          {isFocusedLanding && (
            <nav
              aria-label={
                isAi ? "AI mobile sections" : isCrm ? "CRM mobile sections" : "SaaS mobile sections"
              }
              className="mb-3 grid grid-cols-2 gap-1 border-b border-border pb-3"
            >
              {sectionLinks.map(([label, id]) => (
                <a
                  key={`${label}-${id}`}
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-[12px] hover:bg-surface-alt"
                >
                  {label}
                </a>
              ))}
            </nav>
          )}
          <MarketingNavigation onNavigate={() => setOpen(false)} />
          <Link
            href={current.demo}
            onClick={() => setOpen(false)}
            className="ui-button ui-button--primary mt-3 w-full"
          >
            Explore {current.name} demo
          </Link>
        </div>
      )}
    </header>
  );
}
