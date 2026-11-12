"use client";
import { useState } from "react";
import {
  Bell,
  Check,
  CheckCircle2,
  Clock3,
  Flame,
  Info,
  Lock,
  Mail,
  Plus,
  ShieldCheck,
  Star,
  Tag,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";

const colors = [
  {
    name: "Primary",
    solid: "bg-accent border-accent text-white",
    soft: "bg-accent/10 border-transparent text-accent",
    outline: "bg-transparent border-accent/45 text-accent",
    dot: "bg-accent",
  },
  {
    name: "Success",
    solid: "bg-success border-success text-white",
    soft: "bg-success/10 border-transparent text-success",
    outline: "bg-transparent border-success/45 text-success",
    dot: "bg-success",
  },
  {
    name: "Danger",
    solid: "bg-danger border-danger text-white",
    soft: "bg-danger/10 border-transparent text-danger",
    outline: "bg-transparent border-danger/45 text-danger",
    dot: "bg-danger",
  },
  {
    name: "Warning",
    solid: "bg-amber-500 border-amber-500 text-white",
    soft: "bg-amber-500/10 border-transparent text-amber-600 dark:text-amber-400",
    outline: "bg-transparent border-amber-500/45 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  {
    name: "Info",
    solid: "bg-blue-500 border-blue-500 text-white",
    soft: "bg-blue-500/10 border-transparent text-blue-600 dark:text-blue-400",
    outline: "bg-transparent border-blue-500/45 text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  {
    name: "Neutral",
    solid: "bg-foreground border-foreground text-surface",
    soft: "bg-surface-alt border-transparent text-foreground",
    outline: "bg-transparent border-border text-muted",
    dot: "bg-muted",
  },
];
const base = "inline-flex items-center gap-1 border px-2 py-1 text-[9px] font-medium leading-none";
export function BadgeShowcase() {
  const [tags, setTags] = useState(["Design", "Dashboard", "Priority", "Research"]),
    [selected, setSelected] = useState(["All"]),
    [count, setCount] = useState(6);
  const toggle = (item: string) =>
    setSelected(
      item === "All"
        ? ["All"]
        : selected.includes(item)
          ? selected.filter((x) => x !== item)
          : [...selected.filter((x) => x !== "All"), item],
    );
  return (
    <div className="grid gap-3">
      <Card title="Color and style matrix" action={<Badge>6 colors · 3 styles</Badge>}>
        <div className="overflow-x-auto">
          <div className="min-w-[620px]">
            <div className="grid grid-cols-[120px_repeat(3,1fr)] gap-3 border-b border-border pb-2 text-[8px] font-medium uppercase tracking-wider text-muted">
              <span>Color</span>
              <span>Solid</span>
              <span>Soft</span>
              <span>Outline</span>
            </div>
            {colors.map((color) => (
              <div
                key={color.name}
                className="grid grid-cols-[120px_repeat(3,1fr)] items-center gap-3 border-b border-border py-3 last:border-0"
              >
                <span className="flex items-center gap-2 text-[9px] font-medium">
                  <i className={`size-2 rounded-full ${color.dot}`} />
                  {color.name}
                </span>
                <span>
                  <span className={`${base} rounded-md ${color.solid}`}>{color.name}</span>
                </span>
                <span>
                  <span className={`${base} rounded-md ${color.soft}`}>{color.name}</span>
                </span>
                <span>
                  <span className={`${base} rounded-md ${color.outline}`}>{color.name}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Solid badges">
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <span key={c.name} className={`${base} rounded-md ${c.solid}`}>
                {c.name}
              </span>
            ))}
          </div>
          <p className="mt-4 text-[9px] leading-4 text-muted">
            High-emphasis labels for important states and compact calls to attention.
          </p>
        </Card>
        <Card title="Soft badges">
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <span key={c.name} className={`${base} rounded-md ${c.soft}`}>
                {c.name}
              </span>
            ))}
          </div>
          <p className="mt-4 text-[9px] leading-4 text-muted">
            Low-emphasis tinted surfaces suitable for tables and dense cards.
          </p>
        </Card>
        <Card title="Outline badges">
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <span key={c.name} className={`${base} rounded-md ${c.outline}`}>
                {c.name}
              </span>
            ))}
          </div>
          <p className="mt-4 text-[9px] leading-4 text-muted">
            Transparent variants that preserve the surrounding card surface.
          </p>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Pill badges">
          <div className="flex flex-wrap gap-2">
            <span className={`${base} rounded-full bg-accent text-white border-accent`}>
              Primary
            </span>
            <span className={`${base} rounded-full border-transparent bg-success/10 text-success`}>
              Completed
            </span>
            <span className={`${base} rounded-full border-danger/40 text-danger`}>Blocked</span>
            <span className={`${base} rounded-full border-border bg-surface-alt`}>Neutral</span>
          </div>
        </Card>
        <Card title="Dot badges">
          <div className="flex flex-wrap gap-2">
            {[
              ["Online", "bg-success"],
              ["Pending", "bg-amber-500"],
              ["Busy", "bg-danger"],
              ["Offline", "bg-muted"],
            ].map(([label, dot]) => (
              <span key={label} className={`${base} rounded-full border-border bg-surface`}>
                <i className={`size-1.5 rounded-full ${dot}`} />
                {label}
              </span>
            ))}
          </div>
        </Card>
        <Card title="Icon badges">
          <div className="flex flex-wrap gap-2">
            <span className={`${base} rounded-md border-transparent bg-success/10 text-success`}>
              <CheckCircle2 size={11} />
              Verified
            </span>
            <span className={`${base} rounded-md border-transparent bg-accent/10 text-accent`}>
              <Zap size={11} />
              Automated
            </span>
            <span
              className={`${base} rounded-md border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400`}
            >
              <Star size={11} />
              Featured
            </span>
            <span className={`${base} rounded-md border-border`}>
              <Lock size={11} />
              Private
            </span>
          </div>
        </Card>
        <Card title="Status badges">
          <div className="grid grid-cols-2 gap-2">
            <span
              className={`${base} justify-center rounded-md border-transparent bg-success/10 text-success`}
            >
              <Check size={11} />
              Active
            </span>
            <span
              className={`${base} justify-center rounded-md border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400`}
            >
              <Clock3 size={11} />
              Pending
            </span>
            <span
              className={`${base} justify-center rounded-md border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-400`}
            >
              <Info size={11} />
              Review
            </span>
            <span
              className={`${base} justify-center rounded-md border-transparent bg-danger/10 text-danger`}
            >
              <X size={11} />
              Inactive
            </span>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Sizes" action={<Badge>Compact scale</Badge>}>
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded border border-accent bg-accent px-1.5 py-0.5 text-[7px] font-medium text-white">
                Extra small
              </span>
              <span className="inline-flex rounded-md border border-accent bg-accent px-2 py-1 text-[9px] font-medium text-white">
                Small
              </span>
              <span className="inline-flex rounded-md border border-accent bg-accent px-2.5 py-1.5 text-[10px] font-medium text-white">
                Medium
              </span>
              <span className="inline-flex rounded-lg border border-accent bg-accent px-3 py-2 text-[11px] font-medium text-white">
                Large
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex size-4 items-center justify-center rounded-full bg-danger text-[7px] text-white">
                2
              </span>
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[8px] leading-5 text-white">
                12
              </span>
              <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-danger px-1.5 text-[8px] leading-6 text-white">
                99+
              </span>
            </div>
          </div>
        </Card>
        <Card title="Shape variants">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`${base} rounded-none border-accent bg-accent text-white`}>
              Square
            </span>
            <span className={`${base} rounded border-accent bg-accent text-white`}>Subtle</span>
            <span className={`${base} rounded-md border-accent bg-accent text-white`}>Default</span>
            <span className={`${base} rounded-lg border-accent bg-accent text-white`}>Rounded</span>
            <span className={`${base} rounded-full border-accent bg-accent text-white`}>Pill</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="grid size-7 place-items-center rounded-md bg-accent text-[9px] font-semibold text-white">
              N
            </span>
            <span className="grid size-7 place-items-center rounded-full bg-success text-[9px] font-semibold text-white">
              <Check size={12} />
            </span>
            <span className="grid size-7 place-items-center rounded-lg border border-border bg-surface-alt">
              <Star size={12} />
            </span>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card
          title="Notification badges"
          action={
            <button onClick={() => setCount(0)} className="text-[9px] text-accent">
              Clear
            </button>
          }
        >
          <div className="flex items-center justify-around py-3">
            <span className="relative grid size-10 place-items-center rounded-lg border border-border">
              <Bell size={17} />
              {count > 0 && (
                <b className="absolute -right-2 -top-2 grid min-w-5 place-items-center rounded-full bg-danger px-1 text-[8px] leading-5 text-white">
                  {count}
                </b>
              )}
            </span>
            <span className="relative grid size-10 place-items-center rounded-lg border border-border">
              <Mail size={17} />
              <i className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-surface bg-success" />
            </span>
            <span className="relative grid size-10 place-items-center rounded-lg border border-border">
              <UserRound size={17} />
              <b className="absolute -bottom-1 -right-2 rounded-full bg-accent px-1.5 text-[8px] leading-4 text-white">
                +9
              </b>
            </span>
          </div>
        </Card>
        <Card title="Avatar badges">
          <div className="flex items-center gap-5 py-3">
            <span className="relative grid size-10 place-items-center rounded-full bg-accent/10 text-accent">
              <UserRound size={17} />
              <i className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-surface bg-success" />
            </span>
            <span className="relative grid size-10 place-items-center rounded-full bg-blue-500/10 text-blue-500">
              <UserRound size={17} />
              <i className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-surface bg-amber-500" />
            </span>
            <span className="relative grid size-10 place-items-center rounded-full bg-surface-alt text-muted">
              <UserRound size={17} />
              <i className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-surface bg-muted" />
            </span>
            <span className="relative grid size-10 place-items-center rounded-full bg-rose-500/10 text-rose-500">
              <UserRound size={17} />
              <b className="absolute -right-2 -top-1 rounded-full bg-foreground px-1 text-[7px] leading-4 text-surface">
                PRO
              </b>
            </span>
          </div>
        </Card>
        <Card title="Counter badges">
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Tasks", "24", "bg-accent"],
              ["Alerts", "8", "bg-danger"],
              ["Updates", "99+", "bg-success"],
            ].map(([label, value, color]) => (
              <div key={label} className="rounded-lg border border-border p-3 text-center">
                <span
                  className={`mx-auto grid min-w-6 place-items-center rounded-full px-1 text-[8px] leading-6 text-white ${color}`}
                >
                  {value}
                </span>
                <b className="mt-2 block text-[9px]">{label}</b>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card
          title="Removable tags"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTags([...tags, `Tag ${tags.length + 1}`])}
            >
              <Plus size={11} />
              Add
            </Button>
          }
        >
          <div className="flex min-h-14 flex-wrap content-start gap-2 rounded-lg border border-dashed border-border bg-surface-alt p-3">
            {tags.length ? (
              tags.map((tag, i) => (
                <span
                  key={tag}
                  className={`${base} rounded-md ${i % 3 === 0 ? "border-accent/25 bg-accent/10 text-accent" : i % 3 === 1 ? "border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-400" : "border-border bg-surface"}`}
                >
                  <Tag size={10} />
                  {tag}
                  <button
                    aria-label={`Remove ${tag}`}
                    onClick={() => setTags(tags.filter((x) => x !== tag))}
                  >
                    <X size={10} />
                  </button>
                </span>
              ))
            ) : (
              <span className="m-auto text-[9px] text-muted">No tags remaining</span>
            )}
          </div>
        </Card>
        <Card
          title="Selectable tags"
          action={<span className="text-[9px] text-muted">{selected.length} selected</span>}
        >
          <div className="flex flex-wrap gap-2">
            {["All", "Design", "Development", "Marketing", "Research"].map((item) => (
              <button
                key={item}
                onClick={() => toggle(item)}
                className={`${base} rounded-full transition ${selected.includes(item) ? "border-accent bg-accent text-white" : "border-border bg-surface"}`}
              >
                {selected.includes(item) && <Check size={10} />} {item}
              </button>
            ))}
          </div>
          <p className="mt-4 text-[9px] text-muted">
            Selection updates locally and supports multiple tags.
          </p>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card title="Security">
          <div className="flex flex-wrap gap-2">
            <span className={`${base} rounded-md border-transparent bg-success/10 text-success`}>
              <ShieldCheck size={11} />
              Verified
            </span>
            <span className={`${base} rounded-md border-transparent bg-accent/10 text-accent`}>
              <Lock size={11} />
              Encrypted
            </span>
            <span className={`${base} rounded-md border-border`}>
              <UserRound size={11} />
              Private
            </span>
          </div>
        </Card>
        <Card title="Trending">
          <div className="flex flex-wrap gap-2">
            <span
              className={`${base} rounded-full border-transparent bg-orange-500/10 text-orange-500`}
            >
              <Flame size={11} />
              Trending
            </span>
            <span
              className={`${base} rounded-full border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400`}
            >
              <Star size={11} />
              Popular
            </span>
            <span className={`${base} rounded-full border-transparent bg-accent/10 text-accent`}>
              <Zap size={11} />
              New
            </span>
          </div>
        </Card>
        <Card title="Label combinations">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex overflow-hidden rounded-md border border-border text-[9px]">
              <b className="bg-surface-alt px-2 py-1">BUILD</b>
              <i className="bg-success px-2 py-1 font-medium not-italic text-white">PASSING</i>
            </span>
            <span className="inline-flex overflow-hidden rounded-md border border-border text-[9px]">
              <b className="bg-surface-alt px-2 py-1">VERSION</b>
              <i className="bg-accent px-2 py-1 font-medium not-italic text-white">2.8.0</i>
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
