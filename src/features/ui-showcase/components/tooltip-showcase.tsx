"use client";
import { useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Copy,
  Info,
  Keyboard,
  Link2,
  MapPin,
  MoreHorizontal,
  Settings,
  Share2,
  ShieldCheck,
  Star,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { UserAvatar } from "@/components/ui/user-avatar";

const tip =
  "pointer-events-none absolute z-30 hidden whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[8px] font-medium text-surface shadow-lg group-hover:block group-focus-within:block";
export function TooltipShowcase() {
  const [popover, setPopover] = useState(""),
    [copied, setCopied] = useState(false),
    [confirmed, setConfirmed] = useState(false),
    [color, setColor] = useState("Purple"),
    [notifications, setNotifications] = useState(true);
  const toggle = (id: string) => setPopover(popover === id ? "" : id);
  const close = () => setPopover("");
  return (
    <div className="grid gap-3">
      <Card title="Tooltip positions" action={<Badge>Hover or focus</Badge>}>
        <div className="flex min-h-32 flex-wrap items-center justify-center gap-4 overflow-visible">
          {["Top", "Right", "Bottom", "Left"].map((position) => (
            <span key={position} className="group relative inline-flex">
              <Button variant="outline">{position}</Button>
              <span
                role="tooltip"
                className={`${tip} ${position === "Top" ? "bottom-full left-1/2 mb-2 -translate-x-1/2" : position === "Bottom" ? "left-1/2 top-full mt-2 -translate-x-1/2" : position === "Left" ? "right-full top-1/2 mr-2 -translate-y-1/2" : "left-full top-1/2 ml-2 -translate-y-1/2"}`}
              >
                {position} tooltip
                <span
                  className={`absolute size-1.5 rotate-45 bg-foreground ${position === "Top" ? "-bottom-0.5 left-1/2 -translate-x-1/2" : position === "Bottom" ? "-top-0.5 left-1/2 -translate-x-1/2" : position === "Left" ? "-right-0.5 top-1/2 -translate-y-1/2" : "-left-0.5 top-1/2 -translate-y-1/2"}`}
                />
              </span>
            </span>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Dark tooltips">
          <div className="flex flex-wrap gap-3">
            {[
              [Info, "Information"],
              [Settings, "Settings"],
              [Share2, "Share"],
              [Trash2, "Delete"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Info;
              return (
                <span key={String(label)} className="group relative inline-flex">
                  <Button size="icon" variant="outline" aria-label={String(label)}>
                    <I size={14} />
                  </Button>
                  <span
                    role="tooltip"
                    className={`${tip} bottom-full left-1/2 mb-2 -translate-x-1/2`}
                  >
                    {String(label)}
                  </span>
                </span>
              );
            })}
          </div>
        </Card>
        <Card title="Light tooltips">
          <div className="flex flex-wrap gap-3">
            {[
              [Bell, "Notifications"],
              [Star, "Favorite"],
              [Link2, "Copy link"],
              [MoreHorizontal, "More"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Bell;
              return (
                <span key={String(label)} className="group relative inline-flex">
                  <Button size="icon" variant="ghost" aria-label={String(label)}>
                    <I size={14} />
                  </Button>
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1 text-[8px] text-foreground shadow-lg group-hover:block group-focus-within:block"
                  >
                    {String(label)}
                  </span>
                </span>
              );
            })}
          </div>
        </Card>
        <Card title="Shortcut tooltips">
          <div className="flex flex-wrap gap-3">
            {[
              ["Search", "⌘ K"],
              ["Save", "⌘ S"],
              ["Preview", "⌘ P"],
            ].map(([label, key]) => (
              <span key={label} className="group relative inline-flex">
                <Button variant="outline">{label}</Button>
                <span
                  role="tooltip"
                  className={`${tip} bottom-full left-1/2 mb-2 flex -translate-x-1/2 items-center gap-2`}
                >
                  {label}
                  <kbd className="rounded bg-surface/15 px-1 text-[7px]">{key}</kbd>
                </span>
              </span>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-[8px] text-muted">
            <Keyboard size={11} />
            Keyboard hints improve discoverability.
          </p>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Text and multiline tooltips">
          <div className="flex flex-wrap items-center gap-5">
            <span className="group relative inline-flex">
              <button className="text-[9px] font-medium text-accent underline decoration-dotted underline-offset-4">
                Monthly recurring revenue
              </button>
              <span
                role="tooltip"
                className={`${tip} bottom-full left-0 mb-2 w-56 whitespace-normal leading-4`}
              >
                Revenue expected every month from active subscriptions, excluding one-time payments.
              </span>
            </span>
            <span className="group relative inline-flex">
              <Badge>
                <CircleHelp size={10} />
                What is this?
              </Badge>
              <span
                role="tooltip"
                className={`${tip} bottom-full left-1/2 mb-2 w-52 -translate-x-1/2 whitespace-normal text-center leading-4`}
              >
                This value is calculated from synchronized billing data and refreshes every hour.
              </span>
            </span>
          </div>
        </Card>
        <Card title="Status tooltips">
          <div className="flex flex-wrap gap-4">
            {[
              ["Online", "bg-success", "Last active now"],
              ["Away", "bg-amber-500", "Idle for 10 minutes"],
              ["Busy", "bg-danger", "Notifications paused"],
              ["Offline", "bg-muted", "Last active yesterday"],
            ].map(([label, color, description]) => (
              <span
                key={label}
                className="group relative inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-1.5 text-[9px]"
              >
                <i className={`size-2 rounded-full ${color}`} />
                {label}
                <span
                  role="tooltip"
                  className={`${tip} bottom-full left-1/2 mb-2 -translate-x-1/2`}
                >
                  {description}
                </span>
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Basic popover">
          <div className="relative inline-block">
            <Button aria-expanded={popover === "basic"} onClick={() => toggle("basic")}>
              Open popover <ChevronDown size={12} />
            </Button>
            {popover === "basic" && (
              <div className="absolute left-0 top-full z-30 mt-2 w-64 rounded-lg border border-border bg-surface p-3 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <b className="text-[10px]">Popover title</b>
                    <p className="mt-1 text-[8px] leading-4 text-muted">
                      More detailed contextual content than a tooltip.
                    </p>
                  </div>
                  <button onClick={close}>
                    <X size={12} />
                  </button>
                </div>
                <Button size="sm" className="mt-3" onClick={close}>
                  Got it
                </Button>
              </div>
            )}
          </div>
        </Card>
        <Card title="Form popover">
          <div className="relative inline-block">
            <Button
              variant="outline"
              aria-expanded={popover === "form"}
              onClick={() => toggle("form")}
            >
              Quick settings <Settings size={12} />
            </Button>
            {popover === "form" && (
              <div className="absolute left-0 top-full z-30 mt-2 w-72 rounded-lg border border-border bg-surface p-3 shadow-lg">
                <b className="text-[10px]">Display settings</b>
                <div className="mt-3 grid gap-3">
                  <label className="grid gap-1 text-[8px]">
                    Theme color
                    <Select value={color} onChange={(e) => setColor(e.target.value)}>
                      <option>Purple</option>
                      <option>Blue</option>
                      <option>Coral</option>
                    </Select>
                  </label>
                  <label className="flex items-center justify-between text-[9px]">
                    Notifications
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={`relative h-5 w-9 rounded-full ${notifications ? "bg-accent" : "bg-border"}`}
                    >
                      <i
                        className={`absolute top-0.5 size-4 rounded-full bg-white transition ${notifications ? "left-[18px]" : "left-0.5"}`}
                      />
                    </button>
                  </label>
                  <Button size="sm" onClick={close}>
                    Apply settings
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
        <Card title="Confirmation popover">
          <div className="relative inline-block">
            <Button
              variant="destructive"
              aria-expanded={popover === "confirm"}
              onClick={() => toggle("confirm")}
            >
              <Trash2 size={12} />
              Delete
            </Button>
            {popover === "confirm" && (
              <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-lg border border-border bg-surface p-3 shadow-lg">
                <b className="text-[10px]">Delete this record?</b>
                <p className="mt-1 text-[8px] leading-4 text-muted">
                  This local demonstration can be safely confirmed.
                </p>
                <div className="mt-3 flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={close}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setConfirmed(true);
                      close();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
          {confirmed && (
            <p className="mt-3 flex items-center gap-1 text-[8px] text-success">
              <Check size={10} />
              Record removed locally.
            </p>
          )}
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Profile popover">
          <div className="relative inline-block">
            <button
              onClick={() => toggle("profile")}
              className="flex items-center gap-2 rounded-lg border border-border p-2 text-left"
            >
              <UserAvatar name="Sofia Garcia" size={34} />
              <span>
                <b className="block text-[9px]">Sofia Garcia</b>
                <small className="text-[7px] text-muted">Operations lead</small>
              </span>
            </button>
            {popover === "profile" && (
              <div className="absolute left-0 top-full z-30 mt-2 w-72 rounded-xl border border-border bg-surface p-4 shadow-lg">
                <div className="flex items-start gap-3">
                  <UserAvatar name="Sofia Garcia" size={46} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <b className="text-[10px]">Sofia Garcia</b>
                      <ShieldCheck size={12} className="text-accent" />
                    </div>
                    <p className="text-[8px] text-muted">Operations lead · Barcelona</p>
                    <Badge tone="success" className="mt-2">
                      Available
                    </Badge>
                  </div>
                </div>
                <p className="mt-3 text-[8px] leading-4 text-muted">
                  Coordinates customer operations and owns the quarterly delivery roadmap.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="flex-1">
                    <UserPlus size={11} />
                    Connect
                  </Button>
                  <Button size="sm" variant="outline">
                    <Link2 size={11} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
        <Card title="Event popover">
          <div className="relative inline-block">
            <button
              onClick={() => toggle("event")}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface-alt p-3 text-left"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-accent/10 text-accent">
                <CalendarDays size={16} />
              </span>
              <span>
                <b className="block text-[9px]">Design system review</b>
                <small className="text-[7px] text-muted">Today · 2:30 PM</small>
              </span>
            </button>
            {popover === "event" && (
              <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-xl border border-border bg-surface p-4 shadow-lg">
                <div className="flex justify-between">
                  <Badge>Meeting</Badge>
                  <button onClick={close}>
                    <X size={12} />
                  </button>
                </div>
                <h3 className="mt-3 text-[11px] font-semibold">Design system review</h3>
                <div className="mt-3 grid gap-2 text-[8px] text-muted">
                  <span className="flex items-center gap-2">
                    <Clock3 size={11} />
                    Today, 2:30–3:15 PM
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={11} />
                    Studio room · Floor 4
                  </span>
                </div>
                <div className="mt-4 flex -space-x-2">
                  {["Sofia Garcia", "Alex Morgan", "Priya Shah"].map((name) => (
                    <UserAvatar
                      key={name}
                      name={name}
                      size={28}
                      className="border-2 border-surface"
                    />
                  ))}
                </div>
                <Button size="sm" className="mt-4 w-full">
                  Join meeting
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card title="Copy tooltip">
          <span className="group relative inline-flex">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText("ORZEN-DEMO");
                setCopied(true);
              }}
            >
              <Copy size={12} />
              {copied ? "Copied" : "Copy code"}
            </Button>
            <span role="tooltip" className={`${tip} bottom-full left-1/2 mb-2 -translate-x-1/2`}>
              {copied ? "Copied to clipboard" : "Copy ORZEN-DEMO"}
            </span>
          </span>
        </Card>
        <Card title="Disabled tooltip">
          <span className="group relative inline-flex">
            <Button disabled>Unavailable action</Button>
            <span role="tooltip" className={`${tip} bottom-full left-1/2 mb-2 -translate-x-1/2`}>
              You do not have permission
            </span>
          </span>
        </Card>
        <Card title="Validation tooltip">
          <div className="relative max-w-60">
            <Input defaultValue="invalid-email" className="border-danger pr-7" />
            <span className="group absolute right-2 top-1/2 -translate-y-1/2">
              <Info size={13} className="text-danger" />
              <span role="tooltip" className={`${tip} bottom-full right-0 mb-2`}>
                Enter a valid email address
              </span>
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
