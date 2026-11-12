"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  ChevronRight,
  ContactRound,
  LogOut,
  MessageSquare,
  Moon,
  Settings2,
  UserRound,
} from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { IconButton } from "@/components/ui/icon-button";

const links = [
  { label: "Public profile", href: "/settings/profile", icon: ContactRound },
  { label: "My profile", href: "/settings/profile", icon: UserRound },
  { label: "My account", href: "/settings/account", icon: Settings2 },
  { label: "Team workspace", href: "/apps/chat", icon: MessageSquare },
];

export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const { resolvedTheme, setTheme } = useTheme();
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
  const row =
    "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-start text-[12px] font-medium hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-accent";
  return (
    <div
      ref={root}
      className="relative"
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget))
          setOpen(false);
      }}
    >
      <IconButton
        ref={trigger}
        aria-label="User profile"
        title="User profile"
        aria-expanded={open}
        aria-controls="header-profile"
        onClick={() => setOpen((value) => !value)}
        className="rounded-full! p-0! overflow-hidden"
      >
        <UserAvatar name="Alex Morgan" size={28} />
      </IconButton>
      {open && (
        <section
          id="header-profile"
          aria-label="User account"
          className="absolute right-0 top-full z-50 mt-2 w-[290px] max-w-[calc(100vw-18px)] overflow-hidden rounded-[10px] border border-border bg-surface text-foreground shadow-sm max-[560px]:fixed max-[560px]:right-[9px] max-[560px]:top-[55px]"
        >
          <div className="flex items-center gap-3 border-b border-border p-4">
            <span className="rounded-full border-2 border-success p-0.5">
              <UserAvatar name="Alex Morgan" size={36} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold">Alex Morgan</p>
              <p className="mt-0.5 truncate text-[11px] text-muted">alex@example.com</p>
            </div>
            <span className="rounded border border-accent/20 bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
              Pro
            </span>
          </div>
          <nav aria-label="Profile navigation" className="p-1.5">
            {links.map(({ label, href, icon: Icon }) => (
              <Link key={label} href={href} className={row} onClick={() => setOpen(false)}>
                <Icon size={17} aria-hidden="true" className="text-muted" />
                {label}
                <ChevronRight size={14} aria-hidden="true" className="ms-auto text-muted" />
              </Link>
            ))}
          </nav>
          <div className="border-t border-border p-3">
            <div className="mb-3 flex items-center gap-3 px-1">
              <Moon size={17} aria-hidden="true" className="text-muted" />
              <span className="flex-1 text-[12px] font-medium">Dark mode</span>
              <button
                type="button"
                role="switch"
                aria-label="Profile dark mode"
                aria-checked={resolvedTheme === "dark"}
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className={`relative h-[18px] w-[30px] rounded-full focus-visible:outline-2 focus-visible:outline-accent ${resolvedTheme === "dark" ? "bg-accent" : "bg-border"}`}
              >
                <span
                  className={`absolute left-[3px] top-[3px] h-3 w-3 rounded-full bg-white transition-transform motion-reduce:transition-none ${resolvedTheme === "dark" ? "translate-x-3" : ""}`}
                />
              </button>
            </div>
            <Link href="/login" onClick={() => setOpen(false)} className="ui-button w-full">
              <LogOut size={14} aria-hidden="true" />
              Log out
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
