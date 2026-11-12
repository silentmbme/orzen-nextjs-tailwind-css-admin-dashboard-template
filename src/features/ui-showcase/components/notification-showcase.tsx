"use client";
import { useState } from "react";
import {
  AlertTriangle,
  Archive,
  Bell,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  Info,
  MessageSquare,
  Package,
  RefreshCw,
  Settings,
  ShieldAlert,
  ShoppingBag,
  Star,
  Trash2,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";
import { UserAvatar } from "@/components/ui/user-avatar";

type Notice = {
  id: number;
  title: string;
  detail: string;
  category: string;
  read: boolean;
  priority: boolean;
  time: string;
  person?: string;
};
const seed: Notice[] = [
  {
    id: 1,
    title: "Quarterly report is ready",
    detail: "Revenue performance increased by 12.5%.",
    category: "Reports",
    read: false,
    priority: false,
    time: "4 min ago",
  },
  {
    id: 2,
    title: "Review unusual sign-in",
    detail: "New login detected from an unrecognized device.",
    category: "Security",
    read: false,
    priority: true,
    time: "18 min ago",
  },
  {
    id: 3,
    title: "Sofia mentioned you",
    detail: "Please review the revised customer handover plan.",
    category: "Team",
    read: false,
    priority: false,
    time: "42 min ago",
    person: "Sofia Garcia",
  },
  {
    id: 4,
    title: "Order #8421 was shipped",
    detail: "The customer received a tracking notification.",
    category: "Orders",
    read: true,
    priority: false,
    time: "2 hours ago",
  },
  {
    id: 5,
    title: "Workflow completed",
    detail: "Customer enrichment processed 248 records.",
    category: "System",
    read: true,
    priority: false,
    time: "Yesterday",
  },
];
const categoryIcon = (category: string) =>
  category === "Reports"
    ? FileText
    : category === "Security"
      ? ShieldAlert
      : category === "Team"
        ? Users
        : category === "Orders"
          ? Package
          : Zap;
export function NotificationShowcase() {
  const [items, setItems] = useState(seed),
    [filter, setFilter] = useState("All"),
    [toast, setToast] = useState(""),
    [banner, setBanner] = useState(true),
    [compact, setCompact] = useState(false);
  const shown = items.filter((item) => filter === "All" || item.category === filter),
    unread = items.filter((item) => !item.read).length;
  const mark = (id: number) =>
    setItems((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)));
  const remove = (id: number) => setItems((current) => current.filter((item) => item.id !== id));
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 lg:grid-cols-[220px_1fr]">
        <Card title="Notification center" action={<Badge>{items.length}</Badge>}>
          <div className="grid gap-1">
            {["All", "Reports", "Security", "Team", "Orders", "System"].map((category) => {
              const count = items.filter(
                (item) => category === "All" || item.category === category,
              ).length;
              return (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-[9px] ${filter === category ? "bg-accent/10 font-medium text-accent" : "text-muted hover:bg-surface-alt"}`}
                >
                  <span className="flex-1">{category}</span>
                  <span
                    className={`grid min-w-5 place-items-center rounded-full px-1 text-[7px] leading-5 ${filter === category ? "bg-accent text-white" : "bg-surface-alt"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[9px] text-muted hover:bg-surface-alt">
              <Settings size={12} />
              Preferences
            </button>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[9px] text-muted hover:bg-surface-alt">
              <Archive size={12} />
              Archived
            </button>
          </div>
        </Card>
        <Card
          title="Notification feed"
          action={
            <div className="flex items-center gap-2">
              <Badge tone={unread ? "danger" : "success"}>{unread} unread</Badge>
              <Button size="sm" variant="outline" onClick={() => setCompact(!compact)}>
                {compact ? "Comfortable" : "Compact"}
              </Button>
            </div>
          }
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[9px] text-muted">
              Showing {shown.length} {filter.toLowerCase()} notifications
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  setItems((current) => current.map((item) => ({ ...item, read: true })))
                }
              >
                <Check size={11} />
                Mark all read
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setItems(seed)}>
                <RefreshCw size={11} />
                Reset
              </Button>
            </div>
          </div>
          {shown.length ? (
            <div className="divide-y divide-border">
              {shown.map((item) => {
                const Icon = categoryIcon(item.category);
                return (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 ${compact ? "py-2" : "py-3"} ${!item.read ? "bg-accent/[.025]" : ""}`}
                  >
                    <span className="relative shrink-0">
                      {item.person ? (
                        <UserAvatar name={item.person} size={compact ? 30 : 36} />
                      ) : (
                        <span
                          className={`grid ${compact ? "size-[30px]" : "size-9"} place-items-center rounded-full ${item.priority ? "bg-danger/10 text-danger" : item.read ? "bg-surface-alt text-muted" : "bg-accent/10 text-accent"}`}
                        >
                          <Icon size={compact ? 13 : 15} />
                        </span>
                      )}
                      {!item.read && (
                        <i className="absolute -right-0.5 -top-0.5 size-2 rounded-full border border-surface bg-accent" />
                      )}
                    </span>
                    <button className="min-w-0 flex-1 text-left" onClick={() => mark(item.id)}>
                      <span className="flex flex-wrap items-center gap-2">
                        <b className={`text-[10px] ${item.read ? "font-medium" : "font-semibold"}`}>
                          {item.title}
                        </b>
                        {item.priority && <Badge tone="danger">Priority</Badge>}
                      </span>
                      {!compact && (
                        <p className="mt-1 text-[8px] leading-4 text-muted">{item.detail}</p>
                      )}
                      <span className="mt-1 block text-[7px] text-muted">
                        {item.category} · {item.time}
                      </span>
                    </button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Delete ${item.title}`}
                      onClick={() => remove(item.id)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid min-h-52 place-items-center text-center">
              <span>
                <Bell size={24} className="mx-auto text-muted" />
                <b className="mt-3 block text-[10px]">No notifications</b>
                <p className="mt-1 text-[8px] text-muted">This category is currently empty.</p>
              </span>
            </div>
          )}
        </Card>
      </div>

      <Card title="Toast notifications" action={<Badge>Interactive</Badge>}>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["success", CheckCircle2, "Success toast", "bg-success/10 text-success"],
            ["info", Info, "Information toast", "bg-blue-500/10 text-blue-500"],
            ["warning", AlertTriangle, "Warning toast", "bg-amber-500/10 text-amber-500"],
            ["danger", ShieldAlert, "Error toast", "bg-danger/10 text-danger"],
          ].map(([id, Icon, label, style]) => {
            const I = Icon as typeof Info;
            return (
              <button
                key={String(id)}
                onClick={() => setToast(String(id))}
                className="flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-alt"
              >
                <span className={`grid size-8 place-items-center rounded-full ${style}`}>
                  <I size={14} />
                </span>
                <span>
                  <b className="block text-[9px]">{String(label)}</b>
                  <small className="text-[7px] text-muted">Click to preview</small>
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Inline notifications">
          <div className="grid gap-2">
            <div className="flex gap-3 rounded-lg border border-success/20 bg-success/10 p-3">
              <CheckCircle2 size={15} className="shrink-0 text-success" />
              <div>
                <b className="text-[9px]">Changes published</b>
                <p className="mt-1 text-[8px] text-muted">Your workspace is now up to date.</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
              <Info size={15} className="shrink-0 text-blue-500" />
              <div>
                <b className="text-[9px]">Trial ends in 5 days</b>
                <p className="mt-1 text-[8px] text-muted">
                  Choose a plan to keep your data active.
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card title="Action notification">
          <div className="rounded-xl border border-border bg-surface-alt p-4">
            <div className="flex gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-amber-500/10 text-amber-500">
                <ShieldAlert size={16} />
              </span>
              <div>
                <b className="text-[10px]">Secure your account</b>
                <p className="mt-1 text-[8px] leading-4 text-muted">
                  Enable two-factor authentication for stronger protection.
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm">Enable now</Button>
              <Button size="sm" variant="ghost">
                Later
              </Button>
            </div>
          </div>
        </Card>
        <Card title="Progress notification">
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-accent/10 text-accent">
                <FileText size={16} />
              </span>
              <div className="flex-1">
                <b className="block text-[9px]">Exporting report</b>
                <span className="text-[7px] text-muted">72% · 14 MB of 20 MB</span>
              </div>
              <Button size="icon" variant="ghost">
                <X size={12} />
              </Button>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-surface-alt">
              <div className="h-full w-[72%] rounded-full bg-accent" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Banner notifications">
          <div className="grid gap-3">
            {banner ? (
              <div className="flex flex-wrap items-center gap-3 rounded-lg bg-foreground px-4 py-3 text-surface">
                <Star size={14} />
                <span className="flex-1 text-[9px]">
                  New dashboard widgets are available in the component library.
                </span>
                <Button size="sm" variant="secondary">
                  Explore
                </Button>
                <button onClick={() => setBanner(false)}>
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setBanner(true)}
                className="rounded-lg border border-dashed border-border py-3 text-[8px] text-muted"
              >
                Banner dismissed — click to restore
              </button>
            )}
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-3">
              <Clock3 size={14} className="text-amber-500" />
              <span className="flex-1 text-[9px]">
                <b>Maintenance scheduled.</b> Services may be interrupted Sunday at 02:00 UTC.
              </span>
              <button className="text-[8px] font-medium">Details</button>
            </div>
          </div>
        </Card>
        <Card title="Grouped notifications">
          <div className="grid gap-3">
            <div>
              <p className="mb-2 text-[8px] font-medium uppercase tracking-wider text-muted">
                Today
              </p>
              <div className="grid gap-2">
                {[
                  [MessageSquare, "4 new comments", "Quarterly planning thread"],
                  [UserPlus, "3 new members", "Joined the Orzen workspace"],
                ].map(([Icon, title, note]) => {
                  const I = Icon as typeof MessageSquare;
                  return (
                    <div
                      key={String(title)}
                      className="flex items-center gap-3 rounded-lg border border-border p-3"
                    >
                      <span className="grid size-8 place-items-center rounded-full bg-accent/10 text-accent">
                        <I size={14} />
                      </span>
                      <div className="flex-1">
                        <b className="block text-[9px]">{String(title)}</b>
                        <span className="text-[7px] text-muted">{String(note)}</span>
                      </div>
                      <i className="size-2 rounded-full bg-accent" />
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[8px] font-medium uppercase tracking-wider text-muted">
                Yesterday
              </p>
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <span className="grid size-8 place-items-center rounded-full bg-success/10 text-success">
                  <ShoppingBag size={14} />
                </span>
                <div className="flex-1">
                  <b className="block text-[9px]">8 orders completed</b>
                  <span className="text-[7px] text-muted">Daily commerce summary</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Message">
          <div className="flex gap-3">
            <UserAvatar name="Alex Morgan" size={36} />
            <div>
              <b className="text-[9px]">Alex Morgan</b>
              <p className="mt-1 text-[8px] text-muted">Sent you a new message.</p>
              <button className="mt-2 text-[8px] font-medium text-accent">Reply</button>
            </div>
          </div>
        </Card>
        <Card title="Order">
          <div className="flex gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-success/10 text-success">
              <Package size={15} />
            </span>
            <div>
              <b className="text-[9px]">Order delivered</b>
              <p className="mt-1 text-[8px] text-muted">#ORZ-8421 · 12:45 PM</p>
              <button className="mt-2 text-[8px] font-medium text-accent">Track order</button>
            </div>
          </div>
        </Card>
        <Card title="Security">
          <div className="flex gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-danger/10 text-danger">
              <ShieldAlert size={15} />
            </span>
            <div>
              <b className="text-[9px]">New sign-in</b>
              <p className="mt-1 text-[8px] text-muted">Chrome · Windows · India</p>
              <button className="mt-2 text-[8px] font-medium text-danger">Review activity</button>
            </div>
          </div>
        </Card>
        <Card title="System">
          <div className="flex gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-accent/10 text-accent">
              <Zap size={15} />
            </span>
            <div>
              <b className="text-[9px]">Automation complete</b>
              <p className="mt-1 text-[8px] text-muted">248 records processed.</p>
              <Badge tone="success" className="mt-2">
                Successful
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {toast && <Toast type={toast} onClose={() => setToast("")} />}
    </div>
  );
}
function Toast({ type, onClose }: { type: string; onClose: () => void }) {
  const config =
    type === "success"
      ? [
          CheckCircle2,
          "Export completed",
          "Your report is ready to download.",
          "text-success",
          "bg-success/10",
        ]
      : type === "warning"
        ? [
            AlertTriangle,
            "Storage almost full",
            "Only 8% of workspace storage remains.",
            "text-amber-500",
            "bg-amber-500/10",
          ]
        : type === "danger"
          ? [
              ShieldAlert,
              "Connection failed",
              "We could not synchronize your changes.",
              "text-danger",
              "bg-danger/10",
            ]
          : [
              Info,
              "New update available",
              "Version 2.8 can now be installed.",
              "text-blue-500",
              "bg-blue-500/10",
            ];
  const [Icon, title, note, color, bg] = config;
  const I = Icon as typeof Info;
  return (
    <div
      role="status"
      className="fixed bottom-5 right-5 z-50 w-[min(350px,calc(100vw-40px))] rounded-xl border border-border bg-surface p-4 shadow-xl"
    >
      <div className="flex items-start gap-3">
        <span className={`grid size-9 place-items-center rounded-full ${bg} ${color}`}>
          <I size={16} />
        </span>
        <div className="flex-1">
          <b className="text-[10px]">{String(title)}</b>
          <p className="mt-1 text-[8px] text-muted">{String(note)}</p>
        </div>
        <button onClick={onClose}>
          <X size={12} />
        </button>
      </div>
      <div className="mt-3 h-0.5 overflow-hidden rounded bg-surface-alt">
        <div
          className={`h-full w-3/4 ${type === "success" ? "bg-success" : type === "warning" ? "bg-amber-500" : type === "danger" ? "bg-danger" : "bg-blue-500"}`}
        />
      </div>
    </div>
  );
}
