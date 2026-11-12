"use client";
import { UserAvatar } from "@/components/ui/user-avatar";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Settings2, ShieldCheck, UserRound } from "lucide-react";
import { SidebarNavigation } from "./sidebar-navigation";

export type SidebarProps = { open: boolean; collapsed?: boolean; onNavigate: () => void };
export function Sidebar({ open, collapsed = false, onNavigate }: SidebarProps) {
  return (
    <aside
      id="admin-sidebar"
      className={`sidebar ${open ? "sidebar-open" : ""} ${collapsed ? "sidebar-collapsed" : ""}`}
      aria-label="Main sidebar"
    >
      <Link href="/dashboards/sales" aria-label="Orzen home" className="brand" onClick={onNavigate}>
        <Image
          src="/images/brand/orzen-light.svg"
          alt=""
          width={169}
          height={46}
          unoptimized
          priority
          className="sidebar-logo-full h-[30px] w-auto dark:hidden"
        />
        <Image
          src="/images/brand/orzen-dark.svg"
          alt=""
          width={169}
          height={46}
          unoptimized
          priority
          className="sidebar-logo-full hidden h-[30px] w-auto dark:block"
        />
        <Image
          src="/images/brand/orzen-compact-light.svg"
          alt=""
          width={46}
          height={46}
          unoptimized
          className="sidebar-logo-compact sidebar-logo-light"
        />
        <Image
          src="/images/brand/orzen-compact-dark.svg"
          alt=""
          width={46}
          height={46}
          unoptimized
          className="sidebar-logo-compact sidebar-logo-dark"
        />
      </Link>
      <SidebarNavigation onNavigate={onNavigate} />
      <div className="profile flex-col! items-stretch! gap-0! overflow-hidden bg-surface-alt/60 p-0!">
        <Link
          href="/settings/profile"
          onClick={onNavigate}
          className="group flex min-w-0 items-center gap-2.5 p-3 transition-colors hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
          aria-label="Open Alex Morgan's profile"
        >
          <span className="relative shrink-0">
            <UserAvatar name="Alex Morgan" size={36} className="ring-2 ring-surface" />
            <span className="absolute -bottom-0.5 -end-0.5 grid size-3.5 place-items-center rounded-full border-2 border-surface bg-success">
              <span className="sr-only">Available</span>
            </span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-semibold text-foreground">
              Alex Morgan
            </span>
            <span className="mt-0.5 flex items-center gap-1 text-[10px] text-muted">
              <ShieldCheck size={11} aria-hidden="true" />
              Workspace admin
            </span>
          </span>
          <ArrowUpRight
            size={14}
            aria-hidden="true"
            className="shrink-0 text-muted transition-colors group-hover:text-accent"
          />
        </Link>
        <div className="grid grid-cols-2 border-t border-border bg-surface/60">
          <Link
            href="/settings/profile"
            onClick={onNavigate}
            className="flex items-center justify-center gap-1.5 border-e border-border px-2 py-2 text-[11px] text-muted hover:bg-surface-alt hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
          >
            <UserRound size={12} aria-hidden="true" />
            Profile
          </Link>
          <Link
            href="/settings/account"
            onClick={onNavigate}
            className="flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] text-muted hover:bg-surface-alt hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
          >
            <Settings2 size={12} aria-hidden="true" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}
