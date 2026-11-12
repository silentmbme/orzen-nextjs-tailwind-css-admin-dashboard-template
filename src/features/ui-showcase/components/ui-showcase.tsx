"use client";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Clipboard,
  Download,
  Edit3,
  Filter,
  Heart,
  MoreHorizontal,
  Package,
  Plus,
  Save,
  Send,
  Share2,
  ShoppingCart,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { ShowcaseSection as S } from "./showcase-section";
import { CardShowcase } from "./card-showcase";
import { BadgeShowcase } from "./badge-showcase";
import { AlertShowcase } from "./alert-showcase";
import { AvatarShowcase } from "./avatar-showcase";
import { TabsShowcase } from "./tabs-showcase";
import { AccordionShowcase } from "./accordion-showcase";
import { ModalShowcase } from "./modal-showcase";
import { DropdownShowcase } from "./dropdown-showcase";
import { TooltipShowcase } from "./tooltip-showcase";
import { ProgressShowcase } from "./progress-showcase";
import { SkeletonShowcase } from "./skeleton-showcase";
import { NotificationShowcase } from "./notification-showcase";
import { NavigationShowcase } from "./navigation-showcase";
import { showcaseMeta, type ShowcaseSlug } from "../types";
const grid = "grid gap-3 sm:grid-cols-2 xl:grid-cols-3";
export function UIShowcase({ kind }: { kind: ShowcaseSlug }) {
  const m = showcaseMeta[kind];
  return (
    <div className="ui-showcase-page grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title={m.title} />
          <p className="mt-1 text-[11px] text-muted">{m.description}</p>
        </div>
        <Badge>Interactive examples</Badge>
      </div>
      <Examples kind={kind} />
    </div>
  );
}
function Examples({ kind }: { kind: ShowcaseSlug }) {
  switch (kind) {
    case "buttons":
      return <Buttons />;
    case "cards":
      return <Cards />;
    case "badges":
      return <Badges />;
    case "alerts":
      return <Alerts />;
    case "avatars":
      return <Avatars />;
    case "tabs":
      return <Tabs />;
    case "accordions":
      return <Accordions />;
    case "modals":
      return <Modals />;
    case "dropdowns":
      return <Dropdowns />;
    case "tooltips":
      return <Tooltips />;
    case "progress":
      return <Progress />;
    case "skeletons":
      return <Skeletons />;
    case "notifications":
      return <Notifications />;
    case "navigation":
      return <Navigation />;
  }
}
function Buttons() {
  const [load, setLoad] = useState(false),
    [copy, setCopy] = useState(false),
    [liked, setLiked] = useState(false),
    [confirm, setConfirm] = useState(false),
    [mode, setMode] = useState("Preview"),
    variants = ["primary", "dark", "secondary", "outline", "ghost", "destructive"] as const;
  return (
    <>
      <S title="Button system" description="Compare every shared variant across product actions.">
        <div className="overflow-x-auto">
          <div className="min-w-[650px]">
            <div className="grid grid-cols-[130px_repeat(3,1fr)] gap-2 border-b border-border pb-2 text-[9px] uppercase tracking-wider text-muted">
              <span>Variant</span>
              <span>Default</span>
              <span>With icon</span>
              <span>Disabled</span>
            </div>
            {variants.map((v, i) => (
              <div
                key={v}
                className="grid grid-cols-[130px_repeat(3,1fr)] items-center gap-2 border-b border-border py-2 last:border-0"
              >
                <span className="text-[10px] font-medium capitalize">{v}</span>
                <Button variant={v}>{i === 5 ? "Delete" : "Continue"}</Button>
                <Button variant={v}>
                  {i === 5 ? <Trash2 size={14} /> : <ArrowRight size={14} />}{" "}
                  {i === 5 ? "Remove" : "Next step"}
                </Button>
                <Button variant={v} disabled>
                  Unavailable
                </Button>
              </div>
            ))}
          </div>
        </div>
      </S>
      <div className={grid}>
        <S title="Sizes & hierarchy">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button>Medium</Button>
            <Button size="lg">Large action</Button>
          </div>
          <div className="mt-4 rounded-lg border border-border bg-surface-alt p-3">
            <b className="text-[10px]">Invite your team</b>
            <p className="mt-1 text-[9px] text-muted">One primary action with a quiet escape.</p>
            <div className="mt-3 flex gap-2">
              <Button variant="primary">
                <Send size={14} />
                Send invites
              </Button>
              <Button variant="ghost">Not now</Button>
            </div>
          </div>
        </S>
        <S title="Icon action toolbar">
          <div className="inline-flex rounded-lg border border-border bg-surface p-1">
            {[
              [Edit3, "Edit"],
              [Share2, "Share"],
              [Download, "Download"],
              [MoreHorizontal, "More actions"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Edit3;
              return (
                <Button
                  key={String(label)}
                  size="icon"
                  variant="ghost"
                  aria-label={String(label)}
                  title={String(label)}
                >
                  <I size={14} />
                </Button>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button>
              <Plus size={14} />
              Add record
            </Button>
            <Button variant="outline">
              <Filter size={14} />
              Filter
            </Button>
            <Button variant="ghost">
              <SlidersHorizontal size={14} />
              Configure
            </Button>
          </div>
        </S>
        <S title="Async & disabled states">
          <div className="flex flex-wrap gap-2">
            <Button
              loading={load}
              onClick={() => {
                setLoad(true);
                setTimeout(() => setLoad(false), 1100);
              }}
            >
              {load ? "Publishing" : "Publish changes"}
            </Button>
            <Button disabled>
              <Save size={14} />
              No changes
            </Button>
            <Button variant="outline" disabled>
              Permission required
            </Button>
          </div>
          <p aria-live="polite" className="mt-3 text-[9px] text-muted">
            {load
              ? "Local publishing simulation is running."
              : "Ready to simulate an asynchronous action."}
          </p>
        </S>
        <S title="Grouped & split controls">
          <div className="inline-flex rounded-lg border border-border p-1">
            {["Edit", "Preview", "Code"].map((x) => (
              <Button
                key={x}
                size="sm"
                variant={mode === x ? "primary" : "ghost"}
                className="border-0!"
                aria-pressed={mode === x}
                onClick={() => setMode(x)}
              >
                {x}
              </Button>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-muted">
            Current mode: <b className="text-foreground">{mode}</b>
          </p>
          <div className="mt-4 inline-flex">
            <Button className="rounded-r-none!">Create report</Button>
            <Button className="rounded-l-none! border-l-0! px-2!" aria-label="More report actions">
              <ChevronDown size={13} />
            </Button>
          </div>
        </S>
        <S title="Commerce actions">
          <div className="rounded-lg border border-border bg-surface-alt p-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-accent/10 text-accent">
                <Package size={20} />
              </span>
              <div className="flex-1">
                <b className="text-[11px]">Studio headphones</b>
                <p className="text-[9px] text-muted">In stock · $129</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="primary" className="flex-1">
                <ShoppingCart size={14} />
                Add to cart
              </Button>
              <Button
                size="icon"
                variant={liked ? "destructive" : "outline"}
                aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={liked}
                onClick={() => setLiked(!liked)}
              >
                <Heart size={14} fill={liked ? "currentColor" : "none"} />
              </Button>
            </div>
          </div>
        </S>
        <S title="Copy, navigation & confirmation">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <ArrowLeft size={14} />
              Previous
            </Button>
            <Button variant="primary">
              Continue
              <ArrowRight size={14} />
            </Button>
            <Button
              onClick={async () => {
                await navigator.clipboard.writeText("ORZEN-DEMO");
                setCopy(true);
              }}
            >
              <Clipboard size={14} />
              {copy ? "Code copied" : "Copy code"}
            </Button>
          </div>
          <div className="mt-4 rounded-lg border border-danger/25 bg-danger-subtle p-3">
            <b className="text-[10px]">Remove demo workspace?</b>
            <p className="mt-1 text-[9px] text-muted">This example changes local state only.</p>
            <div className="mt-3 flex gap-2">
              {confirm ? (
                <>
                  <Button size="sm" variant="destructive" onClick={() => setConfirm(false)}>
                    <Check size={13} />
                    Confirm removal
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirm(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="destructive" onClick={() => setConfirm(true)}>
                  <Trash2 size={13} />
                  Remove workspace
                </Button>
              )}
            </div>
          </div>
        </S>
      </div>
    </>
  );
}
function Cards() {
  return <CardShowcase />;
}
function Badges() {
  return <BadgeShowcase />;
}
function Alerts() {
  return <AlertShowcase />;
}
function Avatars() {
  return <AvatarShowcase />;
}
function Tabs() {
  return <TabsShowcase />;
}
function Accordions() {
  return <AccordionShowcase />;
}
function Modals() {
  return <ModalShowcase />;
}
function Dropdowns() {
  return <DropdownShowcase />;
}
function Tooltips() {
  return <TooltipShowcase />;
}
function Progress() {
  return <ProgressShowcase />;
}
function Skeletons() {
  return <SkeletonShowcase />;
}
function Notifications() {
  return <NotificationShowcase />;
}
function Navigation() {
  return <NavigationShowcase />;
}
