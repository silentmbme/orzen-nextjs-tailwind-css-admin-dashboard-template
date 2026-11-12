"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Maximize,
  Minimize,
  Settings2,
  ShoppingCart,
  Mail,
  CalendarDays,
  FolderOpen,
  Users,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { CustomizationPanel } from "./customization-panel";
import { IconButton } from "@/components/ui/icon-button";
import { Dialog } from "@/components/ui/dialog";
import { AppsDropdown } from "./apps-dropdown";
import { CartDropdown } from "./cart-dropdown";
import { ProfileDropdown } from "./profile-dropdown";

type Panel = "Customization";
const alerts = [
  {
    id: "order",
    title: "New order ready for review",
    text: "Order #NV-2048 is waiting for fulfilment.",
    href: "/apps/ecommerce/orders",
    category: "Commerce",
    time: "2 min ago",
    group: "Today",
    icon: ShoppingCart,
    tone: "text-accent bg-accent/10",
  },
  {
    id: "mail",
    title: "Daniel shared the release review",
    text: "Validation results and next steps are in your inbox.",
    href: "/apps/email",
    category: "Workspace",
    time: "12 min ago",
    group: "Today",
    icon: Mail,
    tone: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  },
  {
    id: "task",
    title: "Your task review is due today",
    text: "Check mobile layouts before the next release.",
    href: "/apps/tasks",
    category: "Workspace",
    time: "35 min ago",
    group: "Today",
    icon: CheckCheck,
    tone: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  },
  {
    id: "meeting",
    title: "Team planning starts soon",
    text: "Review your agenda and upcoming meetings.",
    href: "/apps/calendar",
    category: "Workspace",
    time: "1 hr ago",
    group: "Today",
    icon: CalendarDays,
    tone: "text-orange-600 dark:text-orange-400 bg-orange-500/10",
  },
  {
    id: "lead",
    title: "New lead assigned to your team",
    text: "A website enquiry is ready for a follow-up.",
    href: "/crm/leads",
    category: "Commerce",
    time: "Yesterday",
    group: "Earlier",
    icon: Users,
    tone: "text-pink-600 dark:text-pink-400 bg-pink-500/10",
  },
  {
    id: "files",
    title: "Project files are ready",
    text: "Browse the latest shared documents and assets.",
    href: "/apps/file-manager",
    category: "Workspace",
    time: "Yesterday",
    group: "Earlier",
    icon: FolderOpen,
    tone: "text-accent bg-accent/10",
  },
];

export function HeaderTools() {
  const [panel, setPanel] = useState<Panel | null>(null);
  const [readIds, setReadIds] = useState<string[]>(["files"]);
  const [notificationFilter, setNotificationFilter] = useState("All");
  const unreadCount = alerts.filter((alert) => !readIds.includes(alert.id)).length;
  const filteredAlerts = alerts.filter(
    (alert) =>
      notificationFilter === "All" ||
      (notificationFilter === "Unread"
        ? !readIds.includes(alert.id)
        : alert.category === notificationFilter),
  );
  const markRead = (id: string) => setReadIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notificationsOpen) return;
    function dismiss(event: PointerEvent) {
      if (!notificationsRef.current?.contains(event.target as Node)) setNotificationsOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        bellRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [notificationsOpen]);
  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
      setNotice("");
    } catch {
      setNotice("Fullscreen is unavailable in this browser window.");
    }
  }
  return (
    <>
      <div
        ref={notificationsRef}
        className="relative"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setNotificationsOpen(false);
        }}
      >
        <IconButton
          ref={bellRef}
          aria-label="Notifications"
          title="Notifications"
          aria-expanded={notificationsOpen}
          aria-controls="header-notifications"
          onClick={() => setNotificationsOpen((value) => !value)}
          className="relative"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-accent" />
          )}
        </IconButton>
        {notificationsOpen && (
          <section
            id="header-notifications"
            aria-label="Notifications"
            className="absolute right-0 top-full z-50 mt-2 w-[390px] max-w-[calc(100vw-18px)] overflow-hidden rounded-[10px] border border-border bg-surface text-foreground shadow-sm max-[560px]:fixed max-[560px]:right-[9px] max-[560px]:top-[55px]"
          >
            <div className="flex items-center justify-between gap-2 px-4 pb-3 pt-4">
              <div className="flex items-center gap-2">
                <h2 className="text-[13px] font-semibold">Notifications</h2>
                <span
                  className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent"
                  aria-live="polite"
                >
                  {unreadCount} new
                </span>
              </div>
              <IconButton
                variant="ghost"
                aria-label="Mark all read"
                title="Mark all read"
                onClick={() => setReadIds(alerts.map((alert) => alert.id))}
              >
                <CheckCheck size={16} />
              </IconButton>
            </div>
            <div
              className="flex gap-1 border-b border-border px-3 pb-3"
              role="group"
              aria-label="Filter notifications"
            >
              {["All", "Unread", "Workspace", "Commerce"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={notificationFilter === filter}
                  onClick={() => setNotificationFilter(filter)}
                  className={`rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent ${notificationFilter === filter ? "bg-accent/10 text-accent" : "text-muted hover:bg-surface-alt hover:text-foreground"}`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="max-h-[min(440px,60dvh)] overflow-y-auto overscroll-contain">
              {filteredAlerts.length === 0 && (
                <div className="px-5 py-10 text-center">
                  <CheckCheck size={28} className="mx-auto mb-3 text-accent" />
                  <p className="text-[12px] font-medium">You’re all caught up</p>
                  <p className="mt-1 text-[11px] text-muted">No unread notifications to review.</p>
                </div>
              )}
              {["Today", "Earlier"].map((group) => {
                const items = filteredAlerts.filter((alert) => alert.group === group);
                return (
                  items.length > 0 && (
                    <div key={group}>
                      <p className="bg-surface-alt px-4 py-2 text-[10px] font-medium uppercase tracking-wide text-muted">
                        {group}
                      </p>
                      {items.map((alert) => {
                        const isRead = readIds.includes(alert.id);
                        return (
                          <div
                            key={alert.id}
                            className={`flex items-start gap-1 border-b border-border px-3 py-3 last:border-b-0 hover:bg-surface-alt ${!isRead ? "bg-accent/[0.025]" : ""}`}
                          >
                            <Link
                              href={alert.href}
                              onClick={() => {
                                markRead(alert.id);
                                setNotificationsOpen(false);
                              }}
                              className="flex min-w-0 flex-1 gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-accent"
                            >
                              <span
                                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${alert.tone}`}
                              >
                                <alert.icon size={16} />
                              </span>
                              <div className="min-w-0">
                                <p
                                  className={`text-[12px] leading-4 ${isRead ? "font-normal" : "font-semibold"}`}
                                >
                                  {alert.title}
                                </p>
                                <p className="mt-1 text-[11px] leading-[17px] text-muted">
                                  {alert.text}
                                </p>
                                <p className="mt-2 flex items-center gap-1.5 text-[10px] text-muted">
                                  <span>{alert.category}</span>
                                  <span aria-hidden="true">·</span>
                                  <span>{alert.time}</span>
                                </p>
                              </div>
                            </Link>
                            <button
                              type="button"
                              aria-label={
                                isRead ? `Mark unread: ${alert.title}` : `Mark read: ${alert.title}`
                              }
                              title={isRead ? "Mark unread" : "Mark read"}
                              onClick={() =>
                                isRead
                                  ? setReadIds((ids) => ids.filter((id) => id !== alert.id))
                                  : markRead(alert.id)
                              }
                              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-accent hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-accent"
                            >
                              {isRead ? (
                                <Check size={12} className="text-muted" />
                              ) : (
                                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )
                );
              })}
            </div>
            <div className="flex items-center justify-between border-t border-border bg-surface-alt px-4 py-3">
              <span className="text-[10px] text-muted">Demo activity · this session</span>
              <Link
                href="/apps/tasks"
                onClick={() => setNotificationsOpen(false)}
                className="flex items-center gap-1 text-[11px] font-medium text-accent hover:underline"
              >
                Open workspace <ArrowUpRight size={12} />
              </Link>
            </div>
          </section>
        )}
      </div>
      <IconButton
        aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        title="Fullscreen"
        onClick={toggleFullscreen}
      >
        {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
      </IconButton>
      <AppsDropdown />
      <CartDropdown />
      <IconButton
        aria-label="Customization"
        title="Customization"
        onClick={() => setPanel("Customization")}
      >
        <Settings2 size={16} />
      </IconButton>
      <ProfileDropdown />
      {notice && (
        <Dialog open title="Fullscreen" onClose={() => setNotice("")}>
          <p role="status">{notice}</p>
        </Dialog>
      )}
      <CustomizationPanel open={panel === "Customization"} onClose={() => setPanel(null)} />
    </>
  );
}
