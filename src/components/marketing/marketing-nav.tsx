"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export const marketingLinks = [
  { name: "SaaS", href: "/landing/saas", demo: "/dashboards/saas" },
  { name: "AI platform", href: "/landing/ai", demo: "/dashboards/ai" },
  { name: "CRM", href: "/landing/crm", demo: "/dashboards/crm" },
  { name: "Store", href: "/landing/ecommerce", demo: "/dashboards/ecommerce" },
];
export function MarketingNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Marketing navigation" className="flex flex-col gap-1 md:flex-row md:gap-2">
      {marketingLinks.map((link) => (
        <Link
          onClick={onNavigate}
          key={link.href}
          href={link.href}
          aria-current={pathname === link.href ? "page" : undefined}
          className={`rounded-md px-3 py-2 text-[12px] font-medium transition-colors hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-accent ${pathname === link.href ? "bg-accent/5 text-accent" : "text-muted"}`}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
