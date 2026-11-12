"use client";
import { useState } from "react";
import {
  Camera,
  Check,
  Crown,
  Mail,
  MoreHorizontal,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  UserPlus,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";
import { UserAvatar } from "@/components/ui/user-avatar";

const people = [
  "Sofia Garcia",
  "Alex Morgan",
  "Priya Shah",
  "Daniel Kim",
  "Isabella Moore",
  "Ethan Thomas",
];
const fallback = [
  { text: "NV", style: "bg-accent/12 text-accent" },
  { text: "UX", style: "bg-blue-500/12 text-blue-500" },
  { text: "PM", style: "bg-rose-500/12 text-rose-500" },
  { text: "HR", style: "bg-success/12 text-success" },
  { text: "AI", style: "bg-amber-500/12 text-amber-600 dark:text-amber-400" },
];
export function AvatarShowcase() {
  const [selected, setSelected] = useState(["Sofia Garcia", "Priya Shah"]),
    [following, setFollowing] = useState(false);
  const toggle = (name: string) =>
    setSelected((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    );
  return (
    <div className="grid gap-3">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge>
              <Sparkles size={10} />
              Avatar system
            </Badge>
            <h2 className="mt-3 text-[19px] font-semibold">People, identity, and presence</h2>
            <p className="mt-1 text-[10px] text-muted">
              Image avatars, initials, sizes, shapes, groups, statuses, badges, and interactive
              selection.
            </p>
          </div>
          <Button>
            <UserPlus size={13} />
            Invite member
          </Button>
        </div>
      </Card>

      <Card title="Avatar size scale" action={<Badge>20px–72px</Badge>}>
        <div className="flex flex-wrap items-end gap-5">
          {[
            [20, "2XS"],
            [24, "XS"],
            [32, "SM"],
            [40, "MD"],
            [48, "LG"],
            [56, "XL"],
            [72, "2XL"],
          ].map(([size, label], i) => (
            <div key={String(label)} className="grid justify-items-center gap-2">
              <UserAvatar name={people[i % people.length]} size={Number(size)} />
              <span className="text-[8px] font-medium text-muted">
                {String(label)} · {size}px
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Image avatars">
          <div className="flex flex-wrap gap-3">
            {people.map((name) => (
              <UserAvatar key={name} name={name} size={44} />
            ))}
          </div>
          <p className="mt-4 text-[9px] text-muted">
            Mapped project portraits retain consistent cropping and sizing.
          </p>
        </Card>
        <Card title="Initial fallbacks">
          <div className="flex flex-wrap gap-3">
            {fallback.map(({ text, style }) => (
              <span
                key={text}
                className={`grid size-11 place-items-center rounded-full text-[10px] font-semibold ${style}`}
              >
                {text}
              </span>
            ))}
          </div>
          <p className="mt-4 text-[9px] text-muted">
            Color-coded initials for users without profile images.
          </p>
        </Card>
        <Card title="Icon fallbacks">
          <div className="flex flex-wrap gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-surface-alt text-muted">
              <UserRound size={18} />
            </span>
            <span className="grid size-11 place-items-center rounded-full border border-border text-accent">
              <UserRound size={18} />
            </span>
            <span className="grid size-11 place-items-center rounded-lg bg-accent/10 text-accent">
              <Users size={18} />
            </span>
            <span className="grid size-11 place-items-center rounded-full bg-foreground text-surface">
              <UserRound size={18} />
            </span>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Shape variants">
          <div className="flex flex-wrap items-end gap-6">
            {[
              ["Square", "rounded-none"],
              ["Subtle", "rounded-md"],
              ["Rounded", "rounded-xl"],
              ["Circle", "rounded-full"],
            ].map(([label, shape], i) => (
              <div key={label} className="grid justify-items-center gap-2">
                <div className={`overflow-hidden ${shape}`}>
                  <UserAvatar name={people[i]} size={52} className={shape} />
                </div>
                <span className="text-[8px] text-muted">{label}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Border and ring styles">
          <div className="flex flex-wrap items-end gap-6">
            <div className="grid justify-items-center gap-2">
              <UserAvatar
                name="Sofia Garcia"
                size={52}
                className="ring-2 ring-accent ring-offset-2 ring-offset-surface"
              />
              <span className="text-[8px] text-muted">Primary ring</span>
            </div>
            <div className="grid justify-items-center gap-2">
              <UserAvatar name="Alex Morgan" size={52} className="border-2 border-success p-0.5" />
              <span className="text-[8px] text-muted">Success border</span>
            </div>
            <div className="grid justify-items-center gap-2">
              <UserAvatar
                name="Priya Shah"
                size={52}
                className="ring-2 ring-amber-400/70 ring-offset-2 ring-offset-surface"
              />
              <span className="text-[8px] text-muted">Highlight</span>
            </div>
            <div className="grid justify-items-center gap-2">
              <UserAvatar name="Daniel Kim" size={52} className="grayscale opacity-70" />
              <span className="text-[8px] text-muted">Inactive</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Presence status">
          <div className="flex justify-around py-2">
            {[
              ["Sofia Garcia", "bg-success", "Online"],
              ["Alex Morgan", "bg-amber-500", "Away"],
              ["Priya Shah", "bg-danger", "Busy"],
              ["Daniel Kim", "bg-muted", "Offline"],
            ].map(([name, color, label]) => (
              <div key={name} className="grid justify-items-center gap-2">
                <span className="relative">
                  <UserAvatar name={name} size={40} />
                  <i
                    className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-surface ${color}`}
                  />
                </span>
                <span className="text-[7px] text-muted">{label}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Counter badges">
          <div className="flex justify-around py-2">
            <span className="relative">
              <UserAvatar name="Sofia Garcia" size={44} />
              <b className="absolute -right-2 -top-1 grid min-w-5 place-items-center rounded-full bg-danger px-1 text-[7px] leading-5 text-white">
                4
              </b>
            </span>
            <span className="relative">
              <UserAvatar name="Alex Morgan" size={44} />
              <i className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-surface bg-accent" />
            </span>
            <span className="relative">
              <UserAvatar name="Priya Shah" size={44} />
              <b className="absolute -bottom-1 -right-2 rounded-full bg-foreground px-1 text-[7px] leading-4 text-surface">
                PRO
              </b>
            </span>
          </div>
        </Card>
        <Card title="Role badges">
          <div className="flex justify-around py-2">
            <span className="relative">
              <UserAvatar name="Daniel Kim" size={44} />
              <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full border-2 border-surface bg-amber-400 text-white">
                <Crown size={10} />
              </span>
            </span>
            <span className="relative">
              <UserAvatar name="Isabella Moore" size={44} />
              <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full border-2 border-surface bg-success text-white">
                <ShieldCheck size={10} />
              </span>
            </span>
            <span className="relative">
              <UserAvatar name="Ethan Thomas" size={44} />
              <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full border-2 border-surface bg-accent text-white">
                <Star size={10} />
              </span>
            </span>
          </div>
        </Card>
        <Card title="Editable avatar">
          <div className="flex items-center gap-4">
            <span className="relative">
              <UserAvatar name="Sofia Garcia" size={58} />
              <button
                aria-label="Change avatar"
                className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full border-2 border-surface bg-foreground text-surface"
              >
                <Camera size={11} />
              </button>
            </span>
            <div>
              <b className="block text-[10px]">Profile photo</b>
              <p className="mt-1 text-[8px] text-muted">JPG or PNG · 2 MB max</p>
              <button className="mt-2 text-[8px] font-medium text-accent">Change image</button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Avatar groups" action={<Badge>Stacked</Badge>}>
          <div className="grid gap-5">
            <div>
              <p className="mb-3 text-[8px] font-medium text-muted">SMALL GROUP</p>
              <div className="flex -space-x-2">
                {people.slice(0, 4).map((name) => (
                  <UserAvatar
                    key={name}
                    name={name}
                    size={32}
                    className="border-2 border-surface"
                  />
                ))}
                <span className="grid size-8 place-items-center rounded-full border-2 border-surface bg-surface-alt text-[8px] font-medium">
                  +8
                </span>
              </div>
            </div>
            <div>
              <p className="mb-3 text-[8px] font-medium text-muted">LARGE GROUP</p>
              <div className="flex -space-x-3">
                {people.map((name) => (
                  <UserAvatar
                    key={name}
                    name={name}
                    size={44}
                    className="border-[3px] border-surface"
                  />
                ))}
                <span className="grid size-11 place-items-center rounded-full border-[3px] border-surface bg-foreground text-[8px] font-medium text-surface">
                  +12
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-surface-alt p-3">
              <div className="flex -space-x-2">
                {people.slice(0, 3).map((name) => (
                  <UserAvatar
                    key={name}
                    name={name}
                    size={28}
                    className="border-2 border-surface-alt"
                  />
                ))}
              </div>
              <span className="text-[9px]">
                <b>3 members</b> are currently editing
              </span>
            </div>
          </div>
        </Card>
        <Card title="Avatar with content">
          <div className="grid gap-2">
            {[
              ["Sofia Garcia", "Operations lead", "Online", "bg-success"],
              ["Alex Morgan", "Product designer", "In a meeting", "bg-accent"],
              ["Priya Shah", "Growth manager", "Away", "bg-amber-500"],
            ].map(([name, role, status, color]) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <span className="relative">
                  <UserAvatar name={name} size={40} />
                  <i
                    className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-surface ${color}`}
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <b className="block truncate text-[10px]">{name}</b>
                  <span className="text-[8px] text-muted">
                    {role} · {status}
                  </span>
                </div>
                <Button size="icon" variant="ghost" aria-label={`Message ${name}`}>
                  <Mail size={13} />
                </Button>
                <Button size="icon" variant="ghost" aria-label={`More actions for ${name}`}>
                  <MoreHorizontal size={13} />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Profile card">
          <div className="text-center">
            <UserAvatar
              name="Sofia Garcia"
              size={64}
              className="mx-auto ring-2 ring-accent/30 ring-offset-2 ring-offset-surface"
            />
            <h2 className="mt-3 text-[12px] font-semibold">Sofia Garcia</h2>
            <p className="mt-1 text-[8px] text-muted">Operations lead · Barcelona</p>
            <div className="mt-3 flex justify-center gap-2">
              <Badge tone="success">Available</Badge>
              <Badge>Admin</Badge>
            </div>
            <Button className="mt-4 w-full" onClick={() => setFollowing(!following)}>
              {following ? (
                <>
                  <Check size={12} />
                  Following
                </>
              ) : (
                <>
                  <Plus size={12} />
                  Follow
                </>
              )}
            </Button>
          </div>
        </Card>
        <Card title="Compact profile">
          <div className="flex items-center gap-3">
            <UserAvatar name="Alex Morgan" size={48} />
            <div className="min-w-0 flex-1">
              <b className="block text-[11px]">Alex Morgan</b>
              <p className="text-[8px] text-muted">alex@orzen.dev</p>
              <div className="mt-2 flex gap-1">
                <Badge>Designer</Badge>
                <Badge tone="success">Active</Badge>
              </div>
            </div>
            <Button size="icon" variant="outline">
              <MoreHorizontal size={13} />
            </Button>
          </div>
        </Card>
        <Card title="Team invitation">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full border border-dashed border-accent bg-accent/5 text-accent">
              <UserPlus size={18} />
            </span>
            <div>
              <b className="text-[10px]">Invite collaborators</b>
              <p className="mt-1 text-[8px] text-muted">Add members to this workspace.</p>
            </div>
          </div>
          <div className="mt-4 flex -space-x-2">
            {people.slice(0, 4).map((name) => (
              <UserAvatar key={name} name={name} size={32} className="border-2 border-surface" />
            ))}
            <button className="grid size-8 place-items-center rounded-full border-2 border-surface bg-accent text-white">
              <Plus size={12} />
            </button>
          </div>
        </Card>
      </div>

      <Card title="Selectable avatar list" action={<Badge>{selected.length} selected</Badge>}>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {people.map((name, index) => {
            const active = selected.includes(name);
            return (
              <button
                key={name}
                onClick={() => toggle(name)}
                aria-pressed={active}
                className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${active ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border hover:border-accent/40"}`}
              >
                <span className="relative">
                  <UserAvatar name={name} size={38} />
                  {active && (
                    <i className="absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full border-2 border-surface bg-accent text-white">
                      <Check size={9} />
                    </i>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block truncate text-[9px]">{name}</b>
                  <small className="text-[8px] text-muted">
                    {["Operations", "Design", "Growth", "Engineering", "Support", "Finance"][index]}
                  </small>
                </span>
                {active && <X size={12} className="text-muted" />}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
