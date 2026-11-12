"use client";
import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  CloudOff,
  Info,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";

const types = [
  {
    name: "Success",
    Icon: CheckCircle2,
    fg: "text-success",
    soft: "bg-success/10 border-success/20",
    solid: "bg-success border-success text-white",
    line: "border-success",
  },
  {
    name: "Information",
    Icon: Info,
    fg: "text-blue-600 dark:text-blue-400",
    soft: "bg-blue-500/10 border-blue-500/20",
    solid: "bg-blue-500 border-blue-500 text-white",
    line: "border-blue-500",
  },
  {
    name: "Warning",
    Icon: AlertTriangle,
    fg: "text-amber-600 dark:text-amber-400",
    soft: "bg-amber-500/10 border-amber-500/20",
    solid: "bg-amber-500 border-amber-500 text-white",
    line: "border-amber-500",
  },
  {
    name: "Danger",
    Icon: AlertCircle,
    fg: "text-danger",
    soft: "bg-danger/10 border-danger/20",
    solid: "bg-danger border-danger text-white",
    line: "border-danger",
  },
];
export function AlertShowcase() {
  const [visible, setVisible] = useState([true, true, true, true]),
    [banner, setBanner] = useState(true),
    [toast, setToast] = useState(false);
  return (
    <div className="grid gap-3">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge>
              <Sparkles size={10} />
              Alert variants
            </Badge>
            <h2 className="mt-3 text-[19px] font-semibold">
              Clear feedback for every product state
            </h2>
            <p className="mt-1 text-[10px] text-muted">
              Soft, solid, outline, accent, compact, actionable, dismissible, banner, and toast
              alerts.
            </p>
          </div>
          <Button onClick={() => setToast(true)}>
            <Bell size={13} />
            Show toast
          </Button>
        </div>
      </Card>

      <Card title="Soft alerts" action={<Badge>Default style</Badge>}>
        <div className="grid gap-2">
          {types.map(({ name, Icon, fg, soft }) => (
            <div key={name} className={`flex items-start gap-3 rounded-lg border p-3 ${soft}`}>
              <Icon size={16} className={`mt-0.5 shrink-0 ${fg}`} />
              <div className="min-w-0 flex-1">
                <b className="block text-[10px]">{name} alert</b>
                <p className="mt-1 text-[9px] leading-4 text-muted">
                  This is a contextual message with supporting information for the user.
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Solid alerts">
          <div className="grid gap-2">
            {types.map(({ name, Icon, solid }) => (
              <div key={name} className={`flex items-center gap-3 rounded-lg border p-3 ${solid}`}>
                <Icon size={15} />
                <span className="text-[9px] font-medium">{name} message with high emphasis.</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Outline alerts">
          <div className="grid gap-2">
            {types.map(({ name, Icon, fg, line }) => (
              <div
                key={name}
                className={`flex items-center gap-3 rounded-lg border bg-transparent p-3 ${line}`}
              >
                <Icon size={15} className={fg} />
                <span className="text-[9px]">
                  <b>{name}:</b> Transparent background with semantic border.
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Accent-border alerts">
          <div className="grid gap-2">
            {types.map(({ name, Icon, fg, line }) => (
              <div
                key={name}
                className={`flex items-start gap-3 rounded-r-lg border border-border border-l-[3px] bg-surface-alt p-3 ${line}`}
              >
                <Icon size={15} className={`mt-0.5 ${fg}`} />
                <div>
                  <b className="text-[10px]">{name} notification</b>
                  <p className="mt-1 text-[9px] text-muted">
                    A subtle surface with a strong semantic edge.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Compact alerts">
          <div className="grid gap-2">
            {types.map(({ name, Icon, fg, soft }) => (
              <div
                key={name}
                className={`flex items-center gap-2 rounded-md border px-2.5 py-2 ${soft}`}
              >
                <Icon size={12} className={fg} />
                <span className="text-[8px] font-medium">{name} compact message</span>
                <button className="ml-auto" aria-label={`Close ${name}`}>
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[9px] text-muted">
            Designed for tables, side panels, and dense workspace layouts.
          </p>
        </Card>
      </div>

      <Card
        title="Dismissible alerts"
        action={
          <Button size="sm" variant="outline" onClick={() => setVisible([true, true, true, true])}>
            <RefreshCw size={11} />
            Reset
          </Button>
        }
      >
        <div className="grid gap-2 md:grid-cols-2">
          {types.map(({ name, Icon, fg, soft }, index) =>
            visible[index] ? (
              <div key={name} className={`flex items-start gap-3 rounded-lg border p-3 ${soft}`}>
                <Icon size={15} className={`mt-0.5 ${fg}`} />
                <div className="flex-1">
                  <b className="text-[10px]">{name}</b>
                  <p className="mt-1 text-[8px] text-muted">This alert can be dismissed locally.</p>
                </div>
                <button
                  onClick={() =>
                    setVisible((state) => state.map((item, i) => (i === index ? false : item)))
                  }
                  aria-label={`Dismiss ${name}`}
                  className="rounded p-1 hover:bg-foreground/5"
                >
                  <X size={12} />
                </button>
              </div>
            ) : null,
          )}
        </div>
        {visible.every((item) => !item) && (
          <div className="grid place-items-center rounded-lg border border-dashed border-border py-8 text-[9px] text-muted">
            All alerts dismissed. Use Reset to restore them.
          </div>
        )}
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Action alert">
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert size={18} className="shrink-0 text-amber-500" />
              <div>
                <b className="text-[11px]">Review security settings</b>
                <p className="mt-1 text-[9px] leading-4 text-muted">
                  Two-factor authentication is not enabled for three administrators.
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm">Review now</Button>
              <Button size="sm" variant="ghost">
                Remind me later
              </Button>
            </div>
          </div>
        </Card>
        <Card title="Update available">
          <div className="rounded-xl border border-blue-500/25 bg-blue-500/10 p-4">
            <div className="flex items-start gap-3">
              <Zap size={18} className="shrink-0 text-blue-500" />
              <div>
                <b className="text-[11px]">Version 2.8 is ready</b>
                <p className="mt-1 text-[9px] leading-4 text-muted">
                  Includes performance improvements and five new widgets.
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="mt-4">
              View release notes <ArrowRight size={11} />
            </Button>
          </div>
        </Card>
        <Card title="Scheduled maintenance">
          <div className="rounded-xl border border-border bg-surface-alt p-4">
            <div className="flex items-start gap-3">
              <Clock3 size={18} className="shrink-0 text-accent" />
              <div>
                <b className="text-[11px]">Maintenance window</b>
                <p className="mt-1 text-[9px] leading-4 text-muted">
                  Services may be unavailable Sunday from 02:00–03:00 UTC.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Badge>Nov 15</Badge>
              <button className="text-[9px] text-accent">Add to calendar</button>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Banner alerts">
        <div className="grid gap-3">
          {banner ? (
            <div className="flex flex-wrap items-center gap-3 rounded-lg bg-foreground px-4 py-3 text-surface">
              <Sparkles size={15} />
              <span className="flex-1 text-[9px] font-medium">
                The new analytics workspace is available for preview.
              </span>
              <Button size="sm" variant="secondary">
                Try preview
              </Button>
              <button onClick={() => setBanner(false)} aria-label="Dismiss banner">
                <X size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setBanner(true)}
              className="rounded-lg border border-dashed border-border py-4 text-[9px] text-muted"
            >
              Banner dismissed — click to restore
            </button>
          )}
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3">
            <CloudOff size={15} className="text-danger" />
            <span className="flex-1 text-[9px]">
              <b>Connection interrupted.</b> Some changes may not be synchronized.
            </span>
            <Button size="sm" variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        <Card title="Title only">
          <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 p-3 text-[9px] font-medium text-success">
            <CheckCircle2 size={14} />
            Changes saved successfully.
          </div>
        </Card>
        <Card title="With description">
          <div className="flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
            <Info size={14} className="mt-0.5 text-blue-500" />
            <div>
              <b className="text-[9px]">Information</b>
              <p className="mt-1 text-[8px] text-muted">Additional details provide more context.</p>
            </div>
          </div>
        </Card>
        <Card title="With link">
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
            <AlertTriangle size={14} className="text-amber-500" />
            <span className="text-[9px]">Storage is almost full.</span>
            <button className="ml-auto text-[8px] font-medium underline">Manage</button>
          </div>
        </Card>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 w-[min(340px,calc(100vw-40px))] rounded-xl border border-border bg-surface p-4 shadow-xl"
        >
          <div className="flex items-start gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-success/10 text-success">
              <CheckCircle2 size={15} />
            </span>
            <div className="flex-1">
              <b className="text-[10px]">Export completed</b>
              <p className="mt-1 text-[8px] text-muted">Your report is ready to download.</p>
            </div>
            <button onClick={() => setToast(false)} aria-label="Dismiss toast">
              <X size={12} />
            </button>
          </div>
          <div className="mt-3 h-0.5 overflow-hidden rounded bg-surface-alt">
            <div className="h-full w-3/4 bg-success" />
          </div>
        </div>
      )}
    </div>
  );
}
