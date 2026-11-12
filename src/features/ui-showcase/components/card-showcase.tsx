"use client";
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Cloud,
  CreditCard,
  Download,
  FileText,
  Heart,
  Mail,
  MapPin,
  MoreHorizontal,
  Package,
  Play,
  Plus,
  Search,
  Send,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/user-avatar";

const plans = [
  { name: "Starter", price: "$19", note: "For small teams", seats: "5 seats" },
  {
    name: "Growth",
    price: "$49",
    note: "For growing teams",
    seats: "20 seats",
  },
  { name: "Scale", price: "$99", note: "For large teams", seats: "Unlimited" },
];
const metrics = [
  [CircleDollarSign, "Net revenue", "$84,320", "+12.5%", "up"],
  [ShoppingBag, "Orders", "1,248", "+8.2%", "up"],
  [Users, "Customers", "3,240", "+2.1%", "up"],
  [Target, "Refund rate", "1.4%", "-0.3%", "down"],
] as const;

function Bars() {
  return (
    <div className="flex h-16 items-end gap-1.5">
      {[34, 52, 43, 70, 58, 82, 74].map((h, i) => (
        <span
          key={i}
          className={`flex-1 rounded-t-sm ${i === 5 ? "bg-accent" : "bg-accent/20"}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}
export function CardShowcase() {
  const [period, setPeriod] = useState("12 months"),
    [plan, setPlan] = useState("Growth"),
    [favorite, setFavorite] = useState(false),
    [checked, setChecked] = useState([true, false, false]),
    [expanded, setExpanded] = useState(false);
  return (
    <div className="grid gap-3">
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface-alt p-4 sm:p-5">
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <Badge>
              <Sparkles size={11} />
              Card composition library
            </Badge>
            <h2 className="mt-3 text-[20px] font-semibold tracking-tight">
              Business widgets with real product context
            </h2>
            <p className="mt-2 text-[11px] leading-5 text-muted">
              Analytics, commerce, people, finance, and operational cards built from the shared
              design system.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download size={13} />
              Export
            </Button>
            <Button>
              <Plus size={13} />
              Create widget
            </Button>
          </div>
        </div>
        <div className="relative mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(([Icon, label, value, change, direction]) => (
            <div key={label} className="rounded-xl border border-border bg-surface/90 p-3.5">
              <div className="flex items-center justify-between">
                <span className="grid size-8 place-items-center rounded-lg bg-accent/10 text-accent">
                  <Icon size={15} />
                </span>
                <span
                  className={`inline-flex items-center text-[9px] font-medium ${direction === "up" ? "text-success" : "text-danger"}`}
                >
                  {direction === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{" "}
                  {change}
                </span>
              </div>
              <p className="mt-4 text-[9px] text-muted">{label}</p>
              <strong className="mt-1 block text-[21px] leading-none">{value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.65fr_.85fr]">
        <Card title="Revenue performance">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-accent/10 text-accent">
                  <TrendingUp size={15} />
                </span>
                <div>
                  <p className="text-[9px] text-muted">Revenue and operating target</p>
                </div>
              </div>
              <div className="mt-5 flex items-end gap-3">
                <strong className="text-[28px] leading-none">$284,621</strong>
                <Badge tone="success">+18.4%</Badge>
              </div>
            </div>
            <div className="inline-flex rounded-lg border border-border bg-surface-alt p-1">
              {["30 days", "6 months", "12 months"].map((x) => (
                <button
                  key={x}
                  onClick={() => setPeriod(x)}
                  className={`rounded-md px-2.5 py-1 text-[9px] ${period === x ? "bg-surface font-medium shadow-sm" : "text-muted"}`}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 h-52 rounded-xl border border-border bg-surface-alt/50 p-3">
            <svg
              viewBox="0 0 720 190"
              preserveAspectRatio="none"
              className="h-full w-full"
              role="img"
              aria-label={`${period} revenue chart`}
            >
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="var(--color-accent)" stopOpacity=".26" />
                  <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[28, 72, 116, 160].map((y) => (
                <line
                  key={y}
                  x1="0"
                  x2="720"
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  className="text-border"
                  strokeDasharray="3 6"
                />
              ))}
              <path
                d="M0 160 C70 145 100 72 165 105 S250 145 315 83 S405 58 465 91 S550 125 606 54 S682 58 720 24 L720 190 L0 190Z"
                fill="url(#fill)"
              />
              <path
                d="M0 160 C70 145 100 72 165 105 S250 145 315 83 S405 58 465 91 S550 125 606 54 S682 58 720 24"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="mt-4 flex justify-between text-[9px]">
            <span>
              ● <b>Revenue</b> <i className="ml-3 text-muted">● Target</i>
            </span>
            <span className="text-muted">
              Forecast confidence <b className="text-foreground">94.2%</b>
            </span>
          </div>
        </Card>
        <Card title="Corporate wallet">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mt-1 text-[12px] font-semibold">Available balance</h2>
            </div>
            <Button size="icon" variant="ghost">
              <MoreHorizontal size={15} />
            </Button>
          </div>
          <div className="relative mt-4 overflow-hidden rounded-xl bg-foreground p-4 text-surface">
            <div className="absolute -right-8 -top-8 size-28 rounded-full border-[18px] border-surface/10" />
            <div className="flex justify-between">
              <WalletCards size={21} />
              <span className="text-[9px] opacity-70">ORZEN BUSINESS</span>
            </div>
            <strong className="mt-8 block text-[22px]">$32,840.50</strong>
            <div className="mt-5 flex justify-between text-[9px] opacity-70">
              <span>•••• 4821</span>
              <span>09/29</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button>
              <Send size={13} />
              Transfer
            </Button>
            <Button variant="outline">
              <Plus size={13} />
              Add funds
            </Button>
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <div className="flex justify-between text-[9px]">
              <span>Monthly limit</span>
              <span className="text-muted">$7,160 left</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-surface-alt">
              <div className="h-full w-[64%] rounded-full bg-accent" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Weekly sales">
          <div className="flex justify-between">
            <div>
              <strong className="mt-1 block text-[20px]">$18,740</strong>
            </div>
            <Badge tone="success">+6.8%</Badge>
          </div>
          <div className="mt-4">
            <Bars />
          </div>
          <div className="mt-3 flex justify-between text-[8px] text-muted">
            <span>MON</span>
            <span>WED</span>
            <span>FRI</span>
            <span>SUN</span>
          </div>
        </Card>
        <Card title="Conversion goal">
          <div className="flex justify-between">
            <div>
              <strong className="mt-1 block text-[20px]">72%</strong>
            </div>
            <span className="grid size-9 place-items-center rounded-full bg-success/10 text-success">
              <Target size={16} />
            </span>
          </div>
          <div className="mt-5 flex gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className={`h-7 flex-1 rounded-sm ${i < 9 ? "bg-accent" : i === 9 ? "bg-accent/45" : "bg-surface-alt"}`}
              />
            ))}
          </div>
          <p className="mt-3 text-[9px] text-muted">18 more conversions to reach the goal.</p>
        </Card>
        <Card title="Storage usage">
          <div className="flex justify-between">
            <div>
              <strong className="mt-1 block text-[20px]">68.4 GB</strong>
            </div>
            <span className="grid size-9 place-items-center rounded-lg bg-blue-500/10 text-blue-500">
              <Cloud size={17} />
            </span>
          </div>
          <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-surface-alt">
            <span className="w-[42%] bg-accent" />
            <span className="w-[18%] bg-blue-500" />
            <span className="w-[9%] bg-rose-500" />
          </div>
          <p className="mt-3 text-[8px] leading-4 text-muted">
            Documents 42% · Media 18% · Other 9%
          </p>
        </Card>
        <Card title="Customer score">
          <div className="flex justify-between">
            <div>
              <strong className="mt-1 block text-[20px]">4.8</strong>
            </div>
            <Badge>1,204 reviews</Badge>
          </div>
          <div className="mt-3 text-[17px] text-amber-400">★★★★★</div>
          {[
            ["5", 82],
            ["4", 12],
            ["3", 4],
          ].map(([x, w]) => (
            <div
              key={x}
              className="mt-2 grid grid-cols-[10px_1fr_24px] items-center gap-2 text-[8px] text-muted"
            >
              <span>{x}</span>
              <div className="h-1 rounded bg-surface-alt">
                <div className="h-full rounded bg-amber-400" style={{ width: `${w}%` }} />
              </div>
              <span>{w}%</span>
            </div>
          ))}
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-[.8fr_1.2fr_.9fr]">
        <Card title="Next meeting">
          <Badge>Next meeting</Badge>
          <h2 className="mt-3 text-[13px] font-semibold">Design system review</h2>
          <p className="mt-1 text-[9px] text-muted">Align patterns before release.</p>
          <div className="mt-5 rounded-xl border border-border bg-surface-alt p-3">
            <div className="flex items-center gap-2 text-[10px]">
              <CalendarDays size={14} className="text-accent" />
              <b>Today, 2:30 PM</b>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[9px] text-muted">
              <Clock3 size={12} />
              45 min · <MapPin size={12} />
              Studio room
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <div className="flex -space-x-2">
              {["Sofia Garcia", "Alex Morgan", "Priya Shah"].map((n) => (
                <UserAvatar key={n} name={n} size={30} className="border-2 border-surface" />
              ))}
            </div>
            <Button size="sm">
              <Play size={12} />
              Join
            </Button>
          </div>
        </Card>
        <Card title="Project board">
          <div className="flex justify-between">
            <div>
              <h2 className="mt-1 text-[13px] font-semibold">Mobile application launch</h2>
            </div>
            <Badge tone="success">On track</Badge>
          </div>
          <div className="mt-4 grid gap-2">
            {[
              ["Finalize onboarding flow", "Sofia Garcia", "Today"],
              ["Review production analytics", "Daniel Kim", "Tomorrow"],
              ["Prepare release announcement", "Alex Morgan", "Nov 14"],
            ].map(([task, owner, date], i) => (
              <button
                key={task}
                className="flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-alt"
                onClick={() => setChecked((v) => v.map((x, n) => (n === i ? !x : x)))}
              >
                <span
                  className={`grid size-4 place-items-center rounded border ${checked[i] ? "border-accent bg-accent text-white" : "border-border"}`}
                >
                  {checked[i] && <Check size={10} />}
                </span>
                <span className="min-w-0 flex-1">
                  <b
                    className={`block truncate text-[10px] ${checked[i] ? "text-muted line-through" : ""}`}
                  >
                    {task}
                  </b>
                  <span className="mt-1 flex items-center gap-1 text-[8px] text-muted">
                    <UserAvatar name={owner} size={15} />
                    {owner}
                  </span>
                </span>
                <span className="text-[8px] text-muted">{date}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card title="Product snapshot">
          <div className="flex justify-between">
            <span className="grid size-12 place-items-center rounded-xl bg-accent/10 text-accent">
              <Package size={22} />
            </span>
            <Button
              size="icon"
              variant={favorite ? "destructive" : "ghost"}
              onClick={() => setFavorite(!favorite)}
            >
              <Heart size={15} fill={favorite ? "currentColor" : "none"} />
            </Button>
          </div>
          <div className="mt-5 flex gap-2">
            <Badge>Audio</Badge>
            <span className="text-[9px] text-success">In stock</span>
          </div>
          <h2 className="mt-2 text-[13px] font-semibold">Studio headphones</h2>
          <p className="mt-1 text-[9px] text-muted">Spatial audio · 32-hour battery</p>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <span className="text-[9px] text-muted line-through">$159</span>
              <b className="block text-[20px]">$129</b>
            </div>
            <Button>
              <ShoppingCart size={13} />
              Add
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.1fr_.9fr]">
        <Card
          title="Team directory"
          action={
            <Button size="sm" variant="outline">
              <Plus size={12} />
              Invite
            </Button>
          }
        >
          <div className="relative mb-4">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input className="pl-8" placeholder="Search team members" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["Sofia Garcia", "Operations lead"],
              ["Alex Morgan", "Product designer"],
              ["Priya Shah", "Growth manager"],
              ["Daniel Kim", "Engineering lead"],
            ].map(([name, role], i) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <span className="relative">
                  <UserAvatar name={name} size={36} />
                  <i
                    className={`absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-surface ${i === 1 ? "bg-accent" : "bg-success"}`}
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <b className="block truncate text-[10px]">{name}</b>
                  <span className="text-[8px] text-muted">{role}</span>
                </div>
                <Button size="icon" variant="ghost">
                  <Mail size={13} />
                </Button>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Invoice summary" action={<Badge tone="success">Paid</Badge>}>
          <div className="flex justify-between rounded-xl border border-border bg-surface-alt p-4">
            <div>
              <span className="grid size-9 place-items-center rounded-lg bg-accent/10 text-accent">
                <FileText size={17} />
              </span>
              <p className="mt-3 text-[9px] text-muted">Invoice #ORZ-2048</p>
              <h2 className="mt-1 text-[12px] font-semibold">Orzen Creative Studio</h2>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-muted">Amount paid</p>
              <strong className="mt-1 block text-[21px]">$4,820</strong>
              <p className="mt-1 text-[8px] text-muted">Nov 08, 2026</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 divide-x divide-border text-center">
            {[
              ["Issued", "Oct 25"],
              ["Method", "Visa 4821"],
              ["Ref", "TXN-8842"],
            ].map(([a, b]) => (
              <div key={a}>
                <p className="text-[8px] text-muted">{a}</p>
                <b className="text-[9px]">{b}</b>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-5 w-full">
            <CreditCard size={13} />
            View receipt
          </Button>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-[.8fr_1.2fr]">
        <Card
          title="Automation usage"
          action={
            <Badge>
              <Zap size={10} />
              Live
            </Badge>
          }
        >
          <div className="grid grid-cols-[96px_1fr] items-center gap-5">
            <div className="grid size-24 place-items-center rounded-full bg-[conic-gradient(var(--color-accent)_0_74%,var(--color-border)_74%)]">
              <span className="grid size-[70px] place-items-center rounded-full bg-surface text-center">
                <span>
                  <b className="block text-[17px]">74%</b>
                  <small className="text-[8px] text-muted">7,420 runs</small>
                </span>
              </span>
            </div>
            <div className="grid gap-3">
              {[
                ["Successful", "6,914", "text-success"],
                ["Review", "438", "text-amber-500"],
                ["Failed", "68", "text-danger"],
              ].map(([a, b, c]) => (
                <div key={a} className="flex justify-between text-[9px]">
                  <span className="text-muted">{a}</span>
                  <b className={c}>{b}</b>
                </div>
              ))}
            </div>
          </div>
          <Button variant="outline" className="mt-4 w-full">
            Open automation center <ArrowRight size={13} />
          </Button>
        </Card>
        <Card title="Choose your workspace plan" action={<Badge>{plan} selected</Badge>}>
          <div className="grid gap-2 sm:grid-cols-3">
            {plans.map((p) => (
              <button
                key={p.name}
                onClick={() => setPlan(p.name)}
                className={`relative rounded-xl border p-3.5 text-left ${plan === p.name ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border"}`}
              >
                <b className="text-[10px]">{p.name}</b>
                {plan === p.name && (
                  <span className="absolute right-3 top-3 grid size-4 place-items-center rounded-full bg-accent text-white">
                    <Check size={10} />
                  </span>
                )}
                <strong className="mt-5 block text-[20px]">
                  {p.price}
                  <small className="text-[8px] font-normal text-muted"> /mo</small>
                </strong>
                <span className="text-[8px] text-muted">{p.note}</span>
                <span className="mt-3 block border-t border-border pt-3 text-[9px]">{p.seats}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 flex w-full justify-between border-t border-border pt-4 text-[9px] text-muted"
          >
            Compare included features{" "}
            <ChevronDown size={13} className={expanded ? "rotate-180" : ""} />
          </button>
          {expanded && (
            <div className="mt-3 grid gap-2 rounded-lg bg-surface-alt p-3 sm:grid-cols-3">
              {["Analytics", "Priority support", "Automations"].map((x) => (
                <span key={x} className="flex items-center gap-2 text-[9px]">
                  <Check size={11} className="text-success" />
                  {x}
                </span>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
