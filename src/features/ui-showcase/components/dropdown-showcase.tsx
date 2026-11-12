"use client";
import { useState } from "react";
import {
  Archive,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Copy,
  Download,
  Edit3,
  Eye,
  FileText,
  Folder,
  LayoutGrid,
  LogOut,
  Mail,
  MoreHorizontal,
  Palette,
  Plus,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Star,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/user-avatar";

const item =
  "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[9px] hover:bg-surface-alt disabled:opacity-40";
const menu =
  "absolute top-full z-30 mt-1 min-w-52 rounded-lg border border-border bg-surface p-1.5 shadow-lg";
export function DropdownShowcase() {
  const [open, setOpen] = useState(""),
    [checks, setChecks] = useState(["Email", "Desktop"]),
    [radio, setRadio] = useState("Newest"),
    [query, setQuery] = useState(""),
    [workspace, setWorkspace] = useState("Orzen Studio"),
    [status, setStatus] = useState("Available");
  const toggle = (id: string) => setOpen(open === id ? "" : id);
  const close = () => setOpen("");
  const options = [
    "Analytics report",
    "Customer directory",
    "Revenue dashboard",
    "Campaign overview",
  ].filter((x) => x.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Basic dropdown">
          <div className="relative inline-block">
            <Button aria-expanded={open === "basic"} onClick={() => toggle("basic")}>
              Actions <ChevronDown size={12} />
            </Button>
            {open === "basic" && (
              <div className={`${menu} left-0`}>
                <button className={item} onClick={close}>
                  View details
                </button>
                <button className={item} onClick={close}>
                  Duplicate record
                </button>
                <button className={item} onClick={close}>
                  Move to archive
                </button>
                <div className="my-1 border-t border-border" />
                <button className={`${item} text-danger`} onClick={close}>
                  Delete record
                </button>
              </div>
            )}
          </div>
        </Card>
        <Card title="Icon dropdown">
          <div className="relative inline-block">
            <Button
              variant="outline"
              aria-expanded={open === "icons"}
              onClick={() => toggle("icons")}
            >
              <MoreHorizontal size={14} />
              More actions
            </Button>
            {open === "icons" && (
              <div className={`${menu} left-0`}>
                {[
                  [Eye, "Preview"],
                  [Edit3, "Edit record"],
                  [Copy, "Create copy"],
                  [Share2, "Share"],
                  [Download, "Download"],
                ].map(([Icon, label]) => {
                  const I = Icon as typeof Eye;
                  return (
                    <button key={String(label)} className={item} onClick={close}>
                      <I size={13} className="text-muted" />
                      {String(label)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
        <Card title="Right-aligned">
          <div className="flex justify-end">
            <div className="relative">
              <Button
                variant="outline"
                aria-expanded={open === "right"}
                onClick={() => toggle("right")}
              >
                Options <ChevronDown size={12} />
              </Button>
              {open === "right" && (
                <div className={`${menu} right-0`}>
                  <p className="px-2.5 py-1.5 text-[8px] font-medium uppercase tracking-wider text-muted">
                    Document
                  </p>
                  <button className={item} onClick={close}>
                    <Edit3 size={13} />
                    Rename
                  </button>
                  <button className={item} onClick={close}>
                    <Folder size={13} />
                    Move
                  </button>
                  <button className={item} onClick={close}>
                    <Archive size={13} />
                    Archive
                  </button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Checkbox dropdown" action={<Badge>{checks.length} selected</Badge>}>
          <div className="relative inline-block">
            <Button
              variant="outline"
              aria-expanded={open === "check"}
              onClick={() => toggle("check")}
            >
              Notification channels <ChevronDown size={12} />
            </Button>
            {open === "check" && (
              <div className={`${menu} left-0 w-64`}>
                <p className="px-2.5 py-2 text-[8px] text-muted">
                  Choose where you receive updates.
                </p>
                {[
                  [Mail, "Email"],
                  [Bell, "Push"],
                  [LayoutGrid, "Desktop"],
                ].map(([Icon, label]) => {
                  const I = Icon as typeof Mail,
                    name = String(label),
                    active = checks.includes(name);
                  return (
                    <button
                      key={name}
                      className={item}
                      onClick={() =>
                        setChecks((v) => (active ? v.filter((x) => x !== name) : [...v, name]))
                      }
                    >
                      <span
                        className={`grid size-4 place-items-center rounded border ${active ? "border-accent bg-accent text-white" : "border-border"}`}
                      >
                        {active && <Check size={10} />}
                      </span>
                      <I size={12} className="text-muted" />
                      {name}
                    </button>
                  );
                })}
                <div className="mt-1 border-t border-border p-1">
                  <Button size="sm" className="w-full" onClick={close}>
                    Apply preferences
                  </Button>
                </div>
              </div>
            )}
          </div>
          <p className="mt-4 text-[9px] text-muted">Active: {checks.join(", ") || "None"}</p>
        </Card>
        <Card title="Radio dropdown" action={<Badge>{radio}</Badge>}>
          <div className="relative inline-block">
            <Button
              variant="outline"
              aria-expanded={open === "radio"}
              onClick={() => toggle("radio")}
            >
              Sort: {radio} <ChevronDown size={12} />
            </Button>
            {open === "radio" && (
              <div className={`${menu} left-0`}>
                {["Newest", "Oldest", "Highest value", "Lowest value"].map((label) => (
                  <button
                    key={label}
                    className={item}
                    onClick={() => {
                      setRadio(label);
                      close();
                    }}
                  >
                    <span
                      className={`grid size-4 place-items-center rounded-full border ${radio === label ? "border-accent" : "border-border"}`}
                    >
                      {radio === label && <i className="size-2 rounded-full bg-accent" />}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="mt-4 text-[9px] text-muted">Only one sorting option can be active.</p>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.1fr_.9fr]">
        <Card title="Searchable dropdown">
          <div className="relative inline-block w-full max-w-sm">
            <Button
              variant="outline"
              className="w-full justify-between!"
              aria-expanded={open === "search"}
              onClick={() => toggle("search")}
            >
              Select a page <ChevronDown size={12} />
            </Button>
            {open === "search" && (
              <div className={`${menu} left-0 w-full min-w-72`}>
                <div className="relative m-1 mb-2">
                  <Search
                    size={12}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search pages..."
                    className="pl-7"
                  />
                </div>
                <div className="max-h-44 overflow-y-auto">
                  {options.map((label, index) => (
                    <button key={label} className={item} onClick={close}>
                      <span
                        className={`grid size-7 place-items-center rounded-md ${index % 2 ? "bg-blue-500/10 text-blue-500" : "bg-accent/10 text-accent"}`}
                      >
                        <FileText size={12} />
                      </span>
                      <span>
                        <b className="block text-[9px]">{label}</b>
                        <small className="text-[7px] text-muted">Workspace page</small>
                      </span>
                    </button>
                  ))}
                  {options.length === 0 && (
                    <p className="p-4 text-center text-[8px] text-muted">No pages found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
        <Card title="Split-button dropdown">
          <div className="relative inline-flex">
            <Button className="rounded-r-none!">Create report</Button>
            <Button
              className="rounded-l-none! border-l-0! px-2!"
              aria-label="More create actions"
              onClick={() => toggle("split")}
            >
              <ChevronDown size={12} />
            </Button>
            {open === "split" && (
              <div className={`${menu} right-0`}>
                <button className={item} onClick={close}>
                  <BarChart3 size={13} />
                  Analytics report
                </button>
                <button className={item} onClick={close}>
                  <Users size={13} />
                  Customer report
                </button>
                <button className={item} onClick={close}>
                  <FileText size={13} />
                  Blank report
                </button>
                <div className="my-1 border-t border-border" />
                <button className={item} onClick={close}>
                  <Settings size={13} />
                  Manage templates
                </button>
              </div>
            )}
          </div>
          <p className="mt-4 text-[9px] text-muted">
            Primary action stays visible while secondary actions remain grouped.
          </p>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Profile dropdown">
          <div className="relative inline-block">
            <button
              onClick={() => toggle("profile")}
              aria-expanded={open === "profile"}
              className="flex items-center gap-2 rounded-lg border border-border p-1.5 pr-2"
            >
              <UserAvatar name="Sofia Garcia" size={30} />
              <span className="text-left">
                <b className="block text-[9px]">Sofia Garcia</b>
                <small className="block text-[7px] text-muted">Administrator</small>
              </span>
              <ChevronDown size={11} />
            </button>
            {open === "profile" && (
              <div className={`${menu} left-0 w-64`}>
                <div className="flex items-center gap-3 border-b border-border p-2 pb-3">
                  <UserAvatar name="Sofia Garcia" size={38} />
                  <div>
                    <b className="block text-[9px]">Sofia Garcia</b>
                    <span className="text-[7px] text-muted">sofia@orzen.dev</span>
                  </div>
                  <Badge className="ml-auto">PRO</Badge>
                </div>
                {[
                  [UserRound, "My profile"],
                  [Settings, "Account settings"],
                  [ShieldCheck, "Security"],
                ].map(([Icon, label]) => {
                  const I = Icon as typeof UserRound;
                  return (
                    <button key={String(label)} className={item} onClick={close}>
                      <I size={13} />
                      {String(label)}
                    </button>
                  );
                })}
                <div className="my-1 border-t border-border" />
                <button className={`${item} text-danger`} onClick={close}>
                  <LogOut size={13} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </Card>
        <Card title="Workspace switcher">
          <div className="relative inline-block">
            <Button variant="outline" onClick={() => toggle("workspace")}>
              <span className="grid size-5 place-items-center rounded bg-accent text-[8px] text-white">
                N
              </span>
              {workspace}
              <ChevronDown size={12} />
            </Button>
            {open === "workspace" && (
              <div className={`${menu} left-0 w-64`}>
                <p className="px-2.5 py-1.5 text-[8px] text-muted">SWITCH WORKSPACE</p>
                {[
                  ["Orzen Studio", "N", "bg-accent"],
                  ["Orzen Labs", "O", "bg-blue-500"],
                  ["Northstar Team", "NT", "bg-rose-500"],
                ].map(([name, initial, color]) => (
                  <button
                    key={name}
                    className={item}
                    onClick={() => {
                      setWorkspace(name);
                      close();
                    }}
                  >
                    <span
                      className={`grid size-7 place-items-center rounded-md text-[8px] text-white ${color}`}
                    >
                      {initial}
                    </span>
                    <span className="flex-1">{name}</span>
                    {workspace === name && <Check size={12} className="text-accent" />}
                  </button>
                ))}
                <div className="my-1 border-t border-border" />
                <button className={item} onClick={close}>
                  <Plus size={12} />
                  Create workspace
                </button>
              </div>
            )}
          </div>
        </Card>
        <Card title="Status dropdown">
          <div className="relative inline-block">
            <Button variant="outline" onClick={() => toggle("status")}>
              <i
                className={`size-2 rounded-full ${status === "Available" ? "bg-success" : status === "Busy" ? "bg-danger" : status === "Away" ? "bg-amber-500" : "bg-muted"}`}
              />
              {status}
              <ChevronDown size={12} />
            </Button>
            {open === "status" && (
              <div className={`${menu} left-0`}>
                {[
                  ["Available", "bg-success"],
                  ["Busy", "bg-danger"],
                  ["Away", "bg-amber-500"],
                  ["Appear offline", "bg-muted"],
                ].map(([label, color]) => (
                  <button
                    key={label}
                    className={item}
                    onClick={() => {
                      setStatus(label);
                      close();
                    }}
                  >
                    <i className={`size-2 rounded-full ${color}`} />
                    <span className="flex-1">{label}</span>
                    {status === label && <Check size={12} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Notification dropdown">
          <div className="relative inline-block">
            <Button
              size="icon"
              variant="outline"
              onClick={() => toggle("notifications")}
              aria-label="Open notifications"
            >
              <Bell size={15} />
              <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-danger px-1 text-[7px] leading-4 text-white">
                3
              </span>
            </Button>
            {open === "notifications" && (
              <div className={`${menu} left-0 w-[min(340px,calc(100vw-40px))]`}>
                <div className="flex items-center justify-between border-b border-border p-2 pb-3">
                  <b className="text-[10px]">Notifications</b>
                  <button className="text-[8px] text-accent">Mark all read</button>
                </div>
                {[
                  [Mail, "New message from Alex", "4 min ago"],
                  [Star, "Report reached its goal", "32 min ago"],
                  [ShieldCheck, "Security review completed", "2 hours ago"],
                ].map(([Icon, title, time]) => {
                  const I = Icon as typeof Mail;
                  return (
                    <button key={String(title)} className={`${item} py-3`} onClick={close}>
                      <span className="grid size-8 place-items-center rounded-full bg-accent/10 text-accent">
                        <I size={13} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <b className="block truncate text-[9px]">{String(title)}</b>
                        <small className="text-[7px] text-muted">{String(time)}</small>
                      </span>
                      <i className="size-1.5 rounded-full bg-accent" />
                    </button>
                  );
                })}
                <Button size="sm" variant="outline" className="mt-1 w-full">
                  View all notifications
                </Button>
              </div>
            )}
          </div>
        </Card>
        <Card title="Nested menu">
          <div className="relative inline-block">
            <Button variant="outline" onClick={() => toggle("nested")}>
              View options <ChevronDown size={12} />
            </Button>
            {open === "nested" && (
              <div className={`${menu} left-0`}>
                <button className={item}>
                  <LayoutGrid size={13} />
                  Layout
                  <span className="ml-auto">
                    <ChevronRight size={12} />
                  </span>
                </button>
                <button className={item}>
                  <Palette size={13} />
                  Theme
                  <span className="ml-auto">
                    <ChevronRight size={12} />
                  </span>
                </button>
                <button className={item}>
                  <Settings size={13} />
                  Preferences
                </button>
                <div className="my-1 border-t border-border" />
                <button className={item}>
                  <CircleHelp size={13} />
                  Help center
                </button>
              </div>
            )}
          </div>
          <p className="mt-4 text-[9px] text-muted">
            Chevron indicators communicate that more options are available.
          </p>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card title="Icon trigger">
          <div className="relative inline-block">
            <Button size="icon" variant="outline" onClick={() => toggle("more")}>
              <MoreHorizontal size={15} />
            </Button>
            {open === "more" && (
              <div className={`${menu} left-0`}>
                <button className={item} onClick={close}>
                  <Edit3 size={12} />
                  Edit
                </button>
                <button className={item} onClick={close}>
                  <Archive size={12} />
                  Archive
                </button>
                <button className={`${item} text-danger`} onClick={close}>
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </Card>
        <Card title="Disabled items">
          <div className="relative inline-block">
            <Button variant="outline" onClick={() => toggle("disabled")}>
              Permissions <ChevronDown size={12} />
            </Button>
            {open === "disabled" && (
              <div className={`${menu} left-0`}>
                <button className={item}>View records</button>
                <button className={item} disabled>
                  Edit records
                </button>
                <button className={item} disabled>
                  Delete records
                </button>
              </div>
            )}
          </div>
        </Card>
        <Card title="Section labels">
          <div className="relative inline-block">
            <Button variant="outline" onClick={() => toggle("sections")}>
              Navigate <ChevronDown size={12} />
            </Button>
            {open === "sections" && (
              <div className={`${menu} left-0`}>
                <p className="px-2.5 py-1 text-[7px] font-medium text-muted">WORKSPACE</p>
                <button className={item}>Dashboard</button>
                <button className={item}>Projects</button>
                <p className="mt-1 border-t border-border px-2.5 pb-1 pt-2 text-[7px] font-medium text-muted">
                  ACCOUNT
                </p>
                <button className={item}>Profile</button>
                <button className={item}>Settings</button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
