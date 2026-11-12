"use client";
import { CrmFooter } from "@/features/marketing/crm/crm-footer";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowUp, Layers3, LayoutDashboard, Sparkles } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { MarketingContainer } from "./marketing-container";
export function MarketingFooter() {
  const pathname = usePathname();
  const storefront = pathname === "/landing/ecommerce";
  if (storefront) return null;
  if (pathname === "/landing/crm") return <CrmFooter />;
  if (pathname === "/landing/ai") return <AiFooter />;
  if (pathname === "/landing/saas")
    return (
      <footer aria-label="Orzen SaaS footer" className="border-t border-border bg-surface">
        <MarketingContainer className="pb-5 pt-10 sm:pt-12">
          <div className="mb-8 flex items-center justify-between gap-4 border-b border-border pb-5">
            <p className="text-[19px] font-medium tracking-tight sm:text-[23px]">
              A clearer business.
              <span className="text-muted"> A shared next step.</span>
            </p>
            <IconButton
              aria-label="Back to top"
              title="Back to top"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "instant"
                    : "smooth",
                })
              }
            >
              <ArrowUp size={15} />
            </IconButton>
          </div>
          <div className="grid gap-9 lg:grid-cols-[1.15fr_2fr]">
            <div>
              <Link href="/landing/saas" aria-label="Orzen home">
                <Image
                  src="/images/brand/orzen-light.svg"
                  alt="Orzen"
                  width={116}
                  height={32}
                  unoptimized
                  className="dark:hidden"
                />
                <Image
                  src="/images/brand/orzen-dark.svg"
                  alt="Orzen"
                  width={116}
                  height={32}
                  unoptimized
                  className="hidden dark:block"
                />
              </Link>
              <p className="mt-4 max-w-xs text-[12px] leading-6 text-muted">
                The business behind your subscriptions,
                <br />
                beautifully in focus.
              </p>
              <Link
                href="/dashboards/saas"
                className="group mt-5 flex max-w-[310px] items-center gap-3 rounded-lg border border-border bg-surface-alt p-2.5 hover:border-accent/40"
              >
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded border border-border">
                  <Image
                    src="/images/marketing/saas-dashboard-light.webp"
                    alt=""
                    width={160}
                    height={90}
                    className="h-full w-full object-cover object-top dark:hidden"
                  />
                  <Image
                    src="/images/marketing/saas-dashboard-dark.webp"
                    alt=""
                    width={160}
                    height={90}
                    className="hidden h-full w-full object-cover object-top dark:block"
                  />
                </div>
                <span className="flex-1">
                  <span className="block text-[10px] text-muted">Take a closer look</span>
                  <span className="mt-1 block text-[12px] font-medium">Inside the workspace</span>
                </span>
                <ArrowUpRight
                  size={15}
                  className="me-1 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
              <p className="mt-3 inline-flex items-center gap-1.5 text-[9px] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Orzen / Connected business workspace
              </p>
            </div>
            <div className="grid grid-cols-2 gap-7 sm:grid-cols-3">
              {[
                {
                  label: "Product",
                  links: [
                    ["Features", "#features"],
                    ["Revenue intelligence", "#revenue"],
                    ["Customer retention", "#retention"],
                    ["Integrations", "#integrations"],
                    ["Pricing", "#pricing"],
                  ],
                },
                {
                  label: "Workspace",
                  links: [
                    ["SaaS dashboard", "/dashboards/saas"],
                    ["Subscriptions", "/apps/saas/subscriptions"],
                    ["Customers", "/apps/saas/customers"],
                    ["Billing & invoices", "/apps/saas/billing"],
                    ["Usage analytics", "/apps/saas/analytics"],
                  ],
                },
                {
                  label: "Explore",
                  links: [
                    ["AI platform", "/landing/ai"],
                    ["CRM product", "/landing/crm"],
                    ["Orzen Objects", "/landing/ecommerce"],
                    ["About Orzen", "#about"],
                    ["Questions & answers", "#faq"],
                  ],
                },
              ].map((group) => (
                <nav key={group.label} aria-label={`Footer ${group.label}`}>
                  <h2 className="mb-4 text-[12px] font-semibold uppercase tracking-[.12em]">
                    {group.label}
                  </h2>
                  <ul className="grid gap-3">
                    {group.links.map(([label, href]) => (
                      <li key={label}>
                        <Link
                          href={href}
                          className="text-[12px] text-muted transition-colors hover:text-accent!"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-2 rounded-lg border border-border bg-surface-alt p-2 sm:grid-cols-3">
            {[
              {
                icon: LayoutDashboard,
                label: "Built for clarity",
                text: "A connected product experience",
              },
              {
                icon: Layers3,
                label: "One design family",
                text: "Light, dark, and considered details",
              },
              {
                icon: Sparkles,
                label: "Explore at your pace",
                text: "No account or payment required",
              },
            ].map(({ icon: Icon, label, text }) => (
              <div key={label} className="flex items-center gap-2.5 px-2 py-2">
                <Icon
                  size={15}
                  className="shrink-0 text-accent p-2 border border-border rounded w-9 h-9"
                />
                <span>
                  <span className="block text-[12px] font-medium">{label}</span>
                  <span className="mt-0.5 block text-[12px] text-muted">{text}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 text-[12px] text-muted border-t border-border pt-5">
            <span>&copy; 2026 Orzen &middot; Built for focused work</span>
            <nav aria-label="Demo information" className="flex flex-wrap gap-4">
              <Link href="#demo-info" className="hover:text-accent!">
                Demo terms
              </Link>
              <Link href="#demo-info" className="hover:text-accent!">
                Privacy in this demo
              </Link>
              <Link href="#demo-info" className="hover:text-accent!">
                Usage information
              </Link>
            </nav>
          </div>
        </MarketingContainer>
      </footer>
    );
  return (
    <footer className="border-t border-border bg-surface">
      <MarketingContainer className="py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <p className="text-[22px] font-semibold tracking-tight">
              {storefront ? (
                <>
                  Considered objects.
                  <br />
                  Everyday companions.
                </>
              ) : (
                <>
                  A little more clarity.
                  <br />A lot more possibility.
                </>
              )}
            </p>
            <p className="mt-3 max-w-sm text-[12px] leading-6 text-muted">
              {storefront
                ? "Orzen Objects is a fictional edit of audio, wearables, and things that make room for everyday rituals. Explore the collection and try a local shopping bag."
                : "Orzen brings teams, customer relationships, commerce, and AI-assisted work into one considered product experience."}
            </p>
          </div>
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider">Explore</p>
            {[
              ["SaaS", "saas"],
              ["AI platform", "ai"],
              ["CRM", "crm"],
              ["Store", "ecommerce"],
            ].map(([label, route]) => (
              <Link
                key={route}
                href={`/landing/${route}`}
                className="mb-2 block text-[12px] text-muted hover:text-accent"
              >
                {label}
              </Link>
            ))}
          </div>
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider">
              See it in action
            </p>
            {[
              ["SaaS workspace", "saas"],
              ["AI operations", "ai"],
              ["Sales pipeline", "crm"],
              ["Commerce dashboard", "ecommerce"],
            ].map(([label, route]) => (
              <Link
                key={route}
                href={`/dashboards/${route}`}
                className="mb-2 flex items-center gap-1 text-[12px] text-muted hover:text-accent"
              >
                {label}
                <ArrowUpRight size={11} />
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-[12px] text-muted">
          <span>&copy; 2026 Orzen &middot; Built for connected workspaces</span>
        </div>
      </MarketingContainer>
    </footer>
  );
}

function AiFooter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const groups = [
    {
      label: "Product",
      links: [
        ["Prompt playground", "/apps/ai/chat"],
        ["Model directory", "/apps/ai/models"],
        ["Workflow studio", "/apps/ai/workflows"],
        ["Usage analytics", "/apps/ai/usage"],
      ],
    },
    {
      label: "Resources",
      links: [
        ["AI dashboard", "/dashboards/ai"],
        ["AI landing", "/landing/ai"],
        ["SaaS platform", "/landing/saas"],
        ["CRM workspace", "/landing/crm"],
      ],
    },
    {
      label: "Explore",
      links: [
        ["Features", "#features"],
        ["Workflows", "#workflow"],
        ["Pricing", "#pricing"],
        ["Prompt inspiration", "#prompt-ideas"],
      ],
    },
  ];
  return (
    <footer aria-label="Orzen AI footer" className="ai-marketing-footer">
      <MarketingContainer className="py-12 sm:py-14">
        <div className="ai-footer-grid">
          <div className="ai-footer-intro">
            <Link href="/landing/ai" aria-label="Orzen AI home">
              <Image
                src="/images/brand/orzen-light.svg"
                alt="Orzen"
                width={118}
                height={32}
                unoptimized
                className="dark:hidden"
              />
              <Image
                src="/images/brand/orzen-dark.svg"
                alt="Orzen"
                width={118}
                height={32}
                unoptimized
                className="hidden dark:block"
              />
            </Link>
            <p>Clearer tools for the space between a question and a good decision.</p>
            <span className="ai-footer-demo">
              <Sparkles size={12} /> Guided product preview
            </span>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <label htmlFor="ai-footer-email">A small note from the studio</label>
              <div>
                <input
                  id="ai-footer-email"
                  value={email}
                  type="email"
                  required
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                />
                <button type="submit">Join</button>
              </div>
              {submitted && <p role="status">Demo subscription saved in this browser only.</p>}
            </form>
          </div>
          <div className="ai-footer-links">
            {groups.map((group) => (
              <nav key={group.label} aria-label={`AI footer ${group.label}`}>
                <h2>{group.label}</h2>
                <ul>
                  {group.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href}>
                        {label}
                        <ArrowUpRight size={11} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="ai-footer-bottom">
          <span>&copy; 2026 Orzen &middot; Thoughtful AI, practical outcomes</span>
          <span>Fictional model data. No provider, payment, or message is connected.</span>
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
              })
            }
          >
            Back to top <ArrowUp size={12} />
          </button>
        </div>
      </MarketingContainer>
    </footer>
  );
}
