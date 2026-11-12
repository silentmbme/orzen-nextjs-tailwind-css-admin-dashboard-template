"use client";
import { useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  Grid2X2,
  LayoutList,
  Mail,
  MessageSquare,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";

const mainTabs = ["Overview", "Analytics", "Activity", "Settings"];
function Panel({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-alt p-4">
      <h3 className="text-[11px] font-semibold">{title}</h3>
      <p className="mt-1 text-[9px] leading-4 text-muted">{description}</p>
    </div>
  );
}
export function TabsShowcase() {
  const [underline, setUnderline] = useState("Overview"),
    [pill, setPill] = useState("Monthly"),
    [boxed, setBoxed] = useState("Preview"),
    [vertical, setVertical] = useState("Profile"),
    [icon, setIcon] = useState("Grid"),
    [step, setStep] = useState(1),
    [compact, setCompact] = useState("All"),
    [disabled, setDisabled] = useState("Active");
  const keyNav = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    tabs: string[],
    active: string,
    setter: (value: string) => void,
  ) => {
    const index = tabs.indexOf(active);
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      setter(tabs[(index + 1) % tabs.length]);
    if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      setter(tabs[(index - 1 + tabs.length) % tabs.length]);
  };
  return (
    <div className="grid gap-3">
      <Card title="Underline tabs" action={<Badge>Default</Badge>}>
        <div role="tablist" className="flex overflow-x-auto border-b border-border">
          {mainTabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={underline === tab}
              onClick={() => setUnderline(tab)}
              onKeyDown={(event) => keyNav(event, mainTabs, underline, setUnderline)}
              className={`relative shrink-0 px-4 py-2.5 text-[10px] font-medium transition ${underline === tab ? "text-accent" : "text-muted hover:text-foreground"}`}
            >
              {tab}
              {underline === tab && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-accent" />
              )}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="pt-4">
          <Panel
            title={`${underline} content`}
            description={`This panel changes when the ${underline.toLowerCase()} tab is selected. Arrow keys move between tabs.`}
          />
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Pill tabs">
          <div className="inline-flex flex-wrap rounded-lg bg-surface-alt p-1">
            {["Daily", "Weekly", "Monthly", "Yearly"].map((tab) => (
              <button
                key={tab}
                onClick={() => setPill(tab)}
                className={`rounded-md px-3 py-1.5 text-[9px] font-medium ${pill === tab ? "bg-surface text-foreground shadow-sm" : "text-muted"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ["Revenue", "$84.3k"],
              ["Orders", "1,248"],
              ["Growth", "+12.5%"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-border p-3">
                <span className="text-[8px] text-muted">{label}</span>
                <b className="mt-1 block text-[12px]">{value}</b>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[9px] text-muted">Showing {pill.toLowerCase()} performance.</p>
        </Card>
        <Card title="Boxed tabs">
          <div className="flex border border-border rounded-lg p-1">
            {[
              [Code2, "Code"],
              [FileText, "Preview"],
              [Activity, "Console"],
            ].map(([Icon, tab]) => {
              const I = Icon as typeof Code2;
              return (
                <button
                  key={String(tab)}
                  onClick={() => setBoxed(String(tab))}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[9px] ${boxed === tab ? "bg-accent text-white" : "text-muted hover:bg-surface-alt"}`}
                >
                  <I size={12} />
                  {String(tab)}
                </button>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg border border-border bg-surface-alt p-4 font-mono text-[9px] text-muted">
            {boxed === "Code"
              ? '<Tabs defaultValue="preview" />'
              : boxed === "Console"
                ? "No errors found. Ready."
                : "Component preview is active."}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Icon tabs">
          <div className="grid grid-cols-3 gap-1 rounded-lg border border-border p-1">
            {[
              [Grid2X2, "Grid"],
              [LayoutList, "List"],
              [BarChart3, "Chart"],
            ].map(([Icon, tab]) => {
              const I = Icon as typeof Grid2X2;
              return (
                <button
                  key={String(tab)}
                  onClick={() => setIcon(String(tab))}
                  className={`grid justify-items-center gap-1 rounded-md py-2 text-[8px] ${icon === tab ? "bg-accent/10 text-accent" : "text-muted"}`}
                >
                  <I size={15} />
                  {String(tab)}
                </button>
              );
            })}
          </div>
          <Panel
            title={`${icon} view`}
            description={`Records are displayed using the ${icon.toLowerCase()} layout.`}
          />
        </Card>
        <Card title="Tabs with counters">
          <div className="flex flex-wrap gap-1 border-b border-border">
            {[
              [Mail, "Inbox", 12],
              [MessageSquare, "Comments", 8],
              [Bell, "Alerts", 3],
            ].map(([Icon, label, count], index) => {
              const I = Icon as typeof Mail;
              return (
                <button
                  key={String(label)}
                  className={`flex items-center gap-1.5 border-b-2 px-2.5 py-2 text-[9px] ${index === 0 ? "border-accent text-accent" : "border-transparent text-muted"}`}
                >
                  <I size={12} />
                  {String(label)}
                  <span
                    className={`rounded-full px-1.5 text-[7px] leading-4 ${index === 0 ? "bg-accent text-white" : "bg-surface-alt"}`}
                  >
                    {String(count)}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-[9px] text-muted">
            Counters communicate unread or pending items.
          </p>
        </Card>
        <Card title="Compact tabs">
          <div className="flex flex-wrap gap-2">
            {["All", "Active", "Paused", "Archived"].map((tab) => (
              <button
                key={tab}
                onClick={() => setCompact(tab)}
                className={`rounded-full border px-2.5 py-1 text-[8px] ${compact === tab ? "border-accent bg-accent text-white" : "border-border"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-surface-alt p-3">
            <span className="text-[9px]">{compact} records</span>
            <Badge>
              {compact === "All" ? 128 : compact === "Active" ? 92 : compact === "Paused" ? 24 : 12}
            </Badge>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-[.75fr_1.25fr]">
        <Card title="Vertical tabs">
          <div className="grid grid-cols-[110px_1fr] gap-3">
            <div
              role="tablist"
              aria-orientation="vertical"
              className="grid content-start gap-1 border-r border-border pr-3"
            >
              {[
                [UserRound, "Profile"],
                [Users, "Team"],
                [ShieldCheck, "Security"],
                [Settings, "Preferences"],
              ].map(([Icon, tab]) => {
                const I = Icon as typeof UserRound;
                return (
                  <button
                    key={String(tab)}
                    onClick={() => setVertical(String(tab))}
                    className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-[9px] ${vertical === tab ? "bg-accent/10 font-medium text-accent" : "text-muted"}`}
                  >
                    <I size={12} />
                    {String(tab)}
                  </button>
                );
              })}
            </div>
            <div className="min-w-0 py-1">
              <h3 className="text-[11px] font-semibold">{vertical}</h3>
              <p className="mt-1 text-[9px] leading-4 text-muted">
                Manage your {vertical.toLowerCase()} settings and workspace preferences here.
              </p>
              <Button size="sm" className="mt-4">
                Save changes
              </Button>
            </div>
          </div>
        </Card>
        <Card title="Scrollable responsive tabs">
          <div className="flex overflow-x-auto border-b border-border [scrollbar-width:none]">
            {[
              "Overview",
              "Customers",
              "Invoices",
              "Subscriptions",
              "Usage",
              "Payments",
              "Integrations",
              "Audit log",
            ].map((tab, index) => (
              <button
                key={tab}
                className={`shrink-0 border-b-2 px-3 py-2 text-[9px] ${index === 0 ? "border-accent text-accent" : "border-transparent text-muted"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              ["Customers", "3,240"],
              ["MRR", "$42,860"],
              ["Churn", "1.8%"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-border bg-surface-alt p-3">
                <span className="text-[8px] text-muted">{label}</span>
                <b className="mt-1 block text-[13px]">{value}</b>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[8px] text-muted">
            Tabs remain horizontally scrollable on small screens without page overflow.
          </p>
        </Card>
      </div>

      <Card title="Step tabs" action={<Badge>Step {step} of 4</Badge>}>
        <div className="grid grid-cols-4">
          {["Account", "Profile", "Team", "Finish"].map((label, index) => {
            const number = index + 1,
              complete = number < step,
              active = number === step;
            return (
              <button
                key={label}
                onClick={() => setStep(number)}
                className="relative grid justify-items-center gap-2"
              >
                <span
                  className={`relative z-10 grid size-7 place-items-center rounded-full border text-[9px] font-medium ${complete ? "border-accent bg-accent text-white" : active ? "border-accent bg-surface text-accent" : "border-border bg-surface text-muted"}`}
                >
                  {complete ? <Check size={11} /> : number}
                </span>
                <span className={`text-[8px] ${active ? "font-medium text-accent" : "text-muted"}`}>
                  {label}
                </span>
                {index < 3 && (
                  <span
                    className={`absolute left-1/2 top-3.5 h-px w-full ${complete ? "bg-accent" : "bg-border"}`}
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-5 rounded-lg border border-border bg-surface-alt p-4">
          <h3 className="text-[11px] font-semibold">
            {
              ["Account details", "Complete your profile", "Invite your team", "Setup complete"][
                step - 1
              ]
            }
          </h3>
          <p className="mt-1 text-[9px] text-muted">
            Step content is updated locally as you move through the workflow.
          </p>
          <div className="mt-4 flex justify-between">
            <Button
              size="sm"
              variant="outline"
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
            >
              <ChevronLeft size={11} />
              Previous
            </Button>
            <Button size="sm" disabled={step === 4} onClick={() => setStep(step + 1)}>
              Next
              <ChevronRight size={11} />
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Disabled tab">
          <div className="flex border-b border-border">
            {["Active", "History", "Locked"].map((tab) => (
              <button
                key={tab}
                disabled={tab === "Locked"}
                onClick={() => setDisabled(tab)}
                className={`border-b-2 px-3 py-2 text-[9px] ${disabled === tab ? "border-accent text-accent" : "border-transparent text-muted"} disabled:cursor-not-allowed disabled:opacity-40`}
              >
                {tab}
              </button>
            ))}
          </div>
          <p className="mt-4 text-[9px] text-muted">
            Selected: {disabled}. Locked content cannot be opened.
          </p>
        </Card>
        <Card title="Full-width tabs">
          <div className="grid grid-cols-3 rounded-lg bg-surface-alt p-1">
            {["Today", "Week", "Month"].map((tab, index) => (
              <button
                key={tab}
                className={`rounded-md py-2 text-[9px] ${index === 0 ? "bg-surface font-medium shadow-sm" : "text-muted"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </Card>
        <Card title="Minimal tabs">
          <div className="flex gap-5">
            {["Details", "Reviews", "Support"].map((tab, index) => (
              <button
                key={tab}
                className={`text-[9px] font-medium ${index === 0 ? "text-foreground" : "text-muted"}`}
              >
                {tab}
                {index === 1 && <sup className="ml-1 text-accent">24</sup>}
              </button>
            ))}
          </div>
          <div className="mt-4 h-px bg-border" />
          <p className="mt-3 text-[9px] text-muted">
            Text-only navigation for lightweight layouts.
          </p>
        </Card>
      </div>
    </div>
  );
}
