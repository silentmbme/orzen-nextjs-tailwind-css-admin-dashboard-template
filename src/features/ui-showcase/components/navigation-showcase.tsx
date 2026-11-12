"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Command,
  FileText,
  Grid2X2,
  LayoutDashboard,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Search,
  Settings,
  ShoppingBag,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";
import { UserAvatar } from "@/components/ui/user-avatar";

const navItems = ["Dashboard", "Analytics", "Customers", "Projects", "Resources"];
function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/dashboards/sales" aria-label="Orzen home" className="relative block shrink-0">
      <Image
        src={compact ? "/images/brand/orzen-compact-light.svg" : "/images/brand/orzen-light.svg"}
        alt="Orzen"
        width={compact ? 34 : 104}
        height={compact ? 34 : 30}
        className="block dark:hidden"
      />
      <Image
        src={compact ? "/images/brand/orzen-compact-dark.svg" : "/images/brand/orzen-dark.svg"}
        alt="Orzen"
        width={compact ? 34 : 104}
        height={compact ? 34 : 30}
        className="hidden dark:block"
      />
    </Link>
  );
}
export function NavigationShowcase() {
  const [active, setActive] = useState("Dashboard"),
    [mega, setMega] = useState(false),
    [mobile, setMobile] = useState(false),
    [page, setPage] = useState(2),
    [segment, setSegment] = useState("Overview"),
    [step, setStep] = useState(2);
  return (
    <div className="grid gap-3">
      <Card title="Primary horizontal navigation" action={<Badge>Desktop</Badge>}>
        <header className="relative rounded-xl border border-border bg-surface px-3">
          <div className="flex h-16 items-center gap-4">
            <Brand />
            <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActive(item);
                    if (item !== "Resources") setMega(false);
                  }}
                  className={`relative flex items-center gap-1 rounded-md px-3 py-2 text-[9px] font-medium ${active === item ? "bg-accent/10 text-accent" : "text-muted hover:bg-surface-alt hover:text-foreground"}`}
                >
                  {item}
                  {item === "Resources" && <ChevronDown size={10} />}
                </button>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-1">
              <Button size="icon" variant="ghost" aria-label="Search">
                <Search size={14} />
              </Button>
              <Button size="icon" variant="ghost" aria-label="Notifications" className="relative">
                <Bell size={14} />
                <i className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-danger" />
              </Button>
              <Button size="sm" className="hidden sm:inline-flex">
                <PlusIcon />
                Create
              </Button>
              <UserAvatar name="Sofia Garcia" size={30} />
              <Button
                size="icon"
                variant="ghost"
                className="lg:hidden"
                onClick={() => setMobile(!mobile)}
                aria-label="Toggle navigation"
              >
                {mobile ? <X size={15} /> : <Menu size={15} />}
              </Button>
            </div>
          </div>
          {mobile && (
            <nav className="grid gap-1 border-t border-border py-3 lg:hidden">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActive(item);
                    setMobile(false);
                  }}
                  className={`rounded-lg px-3 py-2 text-left text-[9px] ${active === item ? "bg-accent/10 text-accent" : "text-muted"}`}
                >
                  {item}
                </button>
              ))}
            </nav>
          )}
        </header>
        <p className="mt-3 text-[8px] text-muted">
          Active item: <b className="text-foreground">{active}</b>. Mobile navigation collapses
          below the desktop breakpoint.
        </p>
      </Card>

      <Card title="Horizontal navigation with mega menu" action={<Badge>Products</Badge>}>
        <div className="relative rounded-xl border border-border">
          <header className="flex h-14 items-center gap-4 px-3">
            <Brand />
            <nav className="hidden flex-1 justify-center gap-5 md:flex">
              {["Solutions", "Products", "Developers", "Company"].map((item) => (
                <button
                  key={item}
                  onClick={() => setMega(item === "Products" ? !mega : false)}
                  className={`flex items-center gap-1 text-[9px] font-medium ${mega && item === "Products" ? "text-accent" : "text-muted hover:text-foreground"}`}
                >
                  {item}
                  {item === "Products" && <ChevronDown size={10} />}
                </button>
              ))}
            </nav>
            <Button size="sm" variant="outline">
              Sign in
            </Button>
            <Button size="sm">Get started</Button>
          </header>
          {mega && (
            <div className="absolute inset-x-3 top-full z-30 mt-2 grid gap-4 rounded-xl border border-border bg-surface p-4 shadow-xl md:grid-cols-[1.2fr_.8fr]">
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  [LayoutDashboard, "Analytics", "Track performance in real time."],
                  [Users, "CRM", "Build stronger customer relationships."],
                  [ShoppingBag, "Commerce", "Manage products and orders."],
                  [Zap, "Automation", "Create reliable business workflows."],
                ].map(([Icon, title, note]) => {
                  const I = Icon as typeof Users;
                  return (
                    <button
                      key={String(title)}
                      className="flex gap-3 rounded-lg p-3 text-left hover:bg-surface-alt"
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                        <I size={14} />
                      </span>
                      <span>
                        <b className="block text-[9px]">{String(title)}</b>
                        <small className="text-[7px] leading-4 text-muted">{String(note)}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="rounded-lg bg-foreground p-4 text-surface">
                <Badge className="border-surface/20 bg-surface/10 text-surface">Featured</Badge>
                <h3 className="mt-3 text-[12px] font-semibold">Orzen AI workspace</h3>
                <p className="mt-2 text-[8px] leading-4 opacity-70">
                  Automate daily work with intelligent prompts and workflows.
                </p>
                <Button size="sm" variant="secondary" className="mt-4">
                  Explore AI <ArrowRight size={11} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Centered horizontal navigation">
          <div className="rounded-xl border border-border">
            <div className="flex h-14 items-center px-3">
              <Brand compact />
              <nav className="mx-auto hidden items-center gap-1 sm:flex">
                {["Home", "Features", "Pricing", "About"].map((item, index) => (
                  <button
                    key={item}
                    className={`rounded-md px-3 py-2 text-[9px] ${index === 0 ? "bg-surface-alt font-medium" : "text-muted"}`}
                  >
                    {item}
                  </button>
                ))}
              </nav>
              <Button size="sm">Start free</Button>
            </div>
          </div>
        </Card>
        <Card title="Dark horizontal navigation">
          <div className="flex min-h-14 items-center gap-3 rounded-xl bg-foreground px-3 text-surface">
            <Image src="/images/brand/orzen-dark.svg" alt="Orzen" width={94} height={28} />
            <nav className="hidden flex-1 justify-center gap-1 md:flex">
              {["Overview", "Reports", "Team"].map((item, index) => (
                <button
                  key={item}
                  className={`rounded-md px-3 py-2 text-[9px] ${index === 0 ? "bg-surface/10" : "opacity-65"}`}
                >
                  {item}
                </button>
              ))}
            </nav>
            <Button size="icon" variant="secondary">
              <Command size={13} />
            </Button>
            <UserAvatar name="Alex Morgan" size={28} />
          </div>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Underline navigation">
          <nav className="flex overflow-x-auto border-b border-border">
            {["Overview", "Analytics", "Customers", "Invoices"].map((item) => (
              <button
                key={item}
                onClick={() => setSegment(item)}
                className={`relative shrink-0 px-3 py-2 text-[9px] ${segment === item ? "font-medium text-accent" : "text-muted"}`}
              >
                {item}
                {segment === item && <i className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />}
              </button>
            ))}
          </nav>
          <p className="mt-4 text-[8px] text-muted">Selected section: {segment}</p>
        </Card>
        <Card title="Pill navigation">
          <nav className="inline-flex rounded-lg bg-surface-alt p-1">
            {["Day", "Week", "Month", "Year"].map((item, index) => (
              <button
                key={item}
                className={`rounded-md px-3 py-1.5 text-[8px] ${index === 2 ? "bg-surface font-medium shadow-sm" : "text-muted"}`}
              >
                {item}
              </button>
            ))}
          </nav>
          <p className="mt-4 text-[8px] text-muted">
            Compact period navigation for analytics cards.
          </p>
        </Card>
        <Card title="Icon navigation">
          <nav className="grid grid-cols-4 gap-1 rounded-lg border border-border p-1">
            {[
              [Grid2X2, "Board"],
              [BarChart3, "Reports"],
              [MessageSquare, "Inbox"],
              [Settings, "Settings"],
            ].map(([Icon, label], index) => {
              const I = Icon as typeof Grid2X2;
              return (
                <button
                  key={String(label)}
                  className={`grid justify-items-center gap-1 rounded-md py-2 text-[7px] ${index === 0 ? "bg-accent/10 text-accent" : "text-muted"}`}
                >
                  <I size={14} />
                  {String(label)}
                </button>
              );
            })}
          </nav>
        </Card>
      </div>

      <Card title="Horizontal workspace navigation" action={<Badge>Scrollable</Badge>}>
        <div className="flex items-center gap-3 rounded-xl border border-border px-3">
          <Brand compact />
          <nav className="flex flex-1 overflow-x-auto [scrollbar-width:none]">
            {[
              "Workspace",
              "Projects",
              "Tasks",
              "Calendar",
              "Files",
              "Reports",
              "Automations",
              "Members",
              "Settings",
            ].map((item, index) => (
              <button
                key={item}
                className={`shrink-0 border-b-2 px-3 py-4 text-[9px] ${index === 0 ? "border-accent font-medium text-accent" : "border-transparent text-muted"}`}
              >
                {item}
              </button>
            ))}
          </nav>
          <Button size="icon" variant="ghost">
            <MoreHorizontal size={14} />
          </Button>
        </div>
        <p className="mt-3 text-[8px] text-muted">
          The item row scrolls horizontally on smaller screens without overflowing the page.
        </p>
      </Card>

      <div className="grid gap-3 lg:grid-cols-[1.2fr_.8fr]">
        <Card title="Breadcrumb navigation">
          <div className="grid gap-4">
            <nav aria-label="Basic breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-[9px]">
                <li>
                  <Link href="/dashboards/sales" className="text-muted hover:text-accent">
                    Home
                  </Link>
                </li>
                <ChevronRight size={10} className="text-muted" />
                <li>
                  <button className="text-muted">UI components</button>
                </li>
                <ChevronRight size={10} className="text-muted" />
                <li aria-current="page" className="font-medium">
                  Navigation
                </li>
              </ol>
            </nav>
            <nav aria-label="Icon breadcrumb" className="rounded-lg bg-surface-alt px-3 py-2">
              <ol className="flex flex-wrap items-center gap-2 text-[8px]">
                <li>
                  <LayoutDashboard size={12} className="text-accent" />
                </li>
                <ChevronRight size={9} />
                <li>Admin</li>
                <ChevronRight size={9} />
                <li>Components</li>
                <ChevronRight size={9} />
                <li>
                  <Badge>Navigation</Badge>
                </li>
              </ol>
            </nav>
            <nav aria-label="Collapsed breadcrumb">
              <ol className="flex items-center gap-2 text-[8px]">
                <li>Projects</li>
                <ChevronRight size={9} />
                <li>
                  <button className="grid size-5 place-items-center rounded bg-surface-alt">
                    <MoreHorizontal size={11} />
                  </button>
                </li>
                <ChevronRight size={9} />
                <li>Website</li>
                <ChevronRight size={9} />
                <li className="font-medium">Navigation.tsx</li>
              </ol>
            </nav>
          </div>
        </Card>
        <Card title="Pagination">
          <div className="grid gap-5">
            <div className="flex items-center justify-center gap-1">
              <Button
                size="icon"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ArrowLeft size={12} />
              </Button>
              {[1, 2, 3, 4, 5].map((number) => (
                <Button
                  key={number}
                  size="sm"
                  variant={page === number ? "primary" : "ghost"}
                  onClick={() => setPage(number)}
                  aria-current={page === number ? "page" : undefined}
                >
                  {number}
                </Button>
              ))}
              <Button
                size="icon"
                variant="outline"
                disabled={page === 5}
                onClick={() => setPage(page + 1)}
              >
                <ArrowRight size={12} />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-[8px] text-muted">Page {page} of 5</span>
              <Button
                size="sm"
                variant="outline"
                disabled={page === 5}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Step navigation" action={<Badge>Step {step} of 4</Badge>}>
        <div className="grid grid-cols-4">
          {["Account", "Workspace", "Preferences", "Complete"].map((label, index) => {
            const number = index + 1,
              done = number < step,
              current = number === step;
            return (
              <button
                key={label}
                onClick={() => setStep(number)}
                className="relative grid justify-items-center gap-2"
              >
                <span
                  className={`relative z-10 grid size-7 place-items-center rounded-full border text-[8px] ${done ? "border-accent bg-accent text-white" : current ? "border-accent bg-surface text-accent" : "border-border bg-surface text-muted"}`}
                >
                  {done ? <Check size={10} /> : number}
                </span>
                <span
                  className={`text-[8px] ${current ? "font-medium text-accent" : "text-muted"}`}
                >
                  {label}
                </span>
                {index < 3 && (
                  <i
                    className={`absolute left-1/2 top-3.5 h-px w-full ${done ? "bg-accent" : "bg-border"}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Footer navigation">
          <nav className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              ["Product", ["Features", "Pricing", "Integrations"]],
              ["Company", ["About", "Careers", "Contact"]],
              ["Resources", ["Docs", "Help center", "Status"]],
            ].map(([title, links]) => (
              <div key={String(title)}>
                <b className="text-[9px]">{String(title)}</b>
                <div className="mt-2 grid gap-1.5">
                  {(links as string[]).map((link) => (
                    <button
                      key={link}
                      className="text-left text-[8px] text-muted hover:text-accent"
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </Card>
        <Card title="Utility navigation">
          <nav className="flex flex-wrap gap-1">
            {[
              [CircleHelp, "Help"],
              [FileText, "Docs"],
              [BriefcaseBusiness, "Careers"],
              [Settings, "Settings"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Settings;
              return (
                <Button key={String(label)} size="sm" variant="ghost">
                  <I size={11} />
                  {String(label)}
                </Button>
              );
            })}
          </nav>
        </Card>
        <Card title="Brand navigation">
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <Brand />
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost">
                Sign in
              </Button>
              <Button size="sm">Create account</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
function PlusIcon() {
  return <span className="text-[13px] leading-none">+</span>;
}
