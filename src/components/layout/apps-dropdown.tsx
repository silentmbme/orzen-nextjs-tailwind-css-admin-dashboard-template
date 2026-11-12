"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Bot, BriefcaseBusiness, Grid2X2, ShoppingBag, Users } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { navigation } from "@/config/navigation";

const descriptions: Record<string, string> = {
  Calendar: "Meetings & events",
  Chat: "Team conversations",
  Email: "Your inbox",
  "File Manager": "Files & assets",
  "Task Management": "Boards & projects",
  "AI Chat": "Ideas & assistance",
};
const tones = [
  "bg-accent/10 text-accent",
  "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "bg-violet-500/10 text-violet-600 dark:text-violet-400",
];
const apps = [
  ...navigation
    .flatMap((group) => group.items)
    .filter(
      (item) => item.ready && item.href.startsWith("/apps/") && item.href.split("/").length === 3,
    ),
  { label: "AI Chat", href: "/apps/ai/chat", icon: Bot },
];
const workspaces = [
  { label: "CRM", href: "/dashboards/crm", icon: Users },
  { label: "Commerce", href: "/dashboards/ecommerce", icon: ShoppingBag },
  { label: "People", href: "/dashboards/hr", icon: BriefcaseBusiness },
];

export function AppsDropdown() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  const close = () => setOpen(false);
  return (
    <div
      ref={root}
      className="relative"
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      <IconButton
        ref={trigger}
        aria-label="Apps"
        title="Apps"
        aria-expanded={open}
        aria-controls="header-apps"
        onClick={() => setOpen((value) => !value)}
      >
        <Grid2X2 size={16} />
      </IconButton>
      {open && (
        <section
          id="header-apps"
          aria-label="Apps launcher"
          className="absolute end-0 top-full z-50 mt-2 w-[360px] max-w-[calc(100vw-18px)] overflow-hidden rounded-[10px] border border-border bg-surface text-foreground shadow-sm max-[560px]:fixed max-[560px]:end-[9px] max-[560px]:top-[55px]"
        >
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <span className="grid size-9 place-items-center rounded-lg bg-accent/10 text-accent">
              <Grid2X2 size={18} aria-hidden="true" />
            </span>
            <div className="flex-1">
              <h2 className="text-[13px] font-semibold">Your workspace, connected</h2>
              <p className="mt-0.5 text-[11px] text-muted">Everything you need, one click away.</p>
            </div>
          </div>
          <div className="max-h-[min(430px,calc(100dvh-230px))] overflow-y-auto overscroll-contain border-t border-border">
            <nav aria-label="Quick launch apps" className="grid grid-cols-3 gap-1 p-2">
              {apps.map((app) => {
                const Icon = app.icon;
                return (
                  <Link
                    key={app.href}
                    href={app.href}
                    onClick={close}
                    className="group flex min-w-0 flex-col items-center rounded-lg px-1 py-3 text-center transition-colors hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                  >
                    <span
                      className={`mb-2 grid size-10 place-items-center rounded-xl ${tones[apps.indexOf(app) % tones.length]}`}
                    >
                      <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <strong className="max-w-full truncate text-[11px] font-medium">
                      {app.label === "Task Management"
                        ? "Tasks"
                        : app.label === "File Manager"
                          ? "Files"
                          : app.label}
                    </strong>
                    <span className="mt-1 text-[10px] leading-4 text-muted">
                      {descriptions[app.label]}
                    </span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-border bg-surface-alt/40 p-3">
              <p className="mb-2 px-1 text-[10px] font-medium uppercase tracking-wider text-muted">
                Business workspaces
              </p>
              <nav aria-label="Business workspaces" className="grid grid-cols-3 gap-1.5">
                {workspaces.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={close}
                    className="flex items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-1 py-2 text-[11px] font-medium hover:border-accent/40 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <Icon size={13} aria-hidden="true" />
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <Link
            href="/settings/account"
            onClick={close}
            className="flex items-center justify-between border-t border-border px-4 py-3 text-[11px] font-medium text-muted hover:bg-surface-alt hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
          >
            <span>Workspace settings</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </section>
      )}
    </div>
  );
}
