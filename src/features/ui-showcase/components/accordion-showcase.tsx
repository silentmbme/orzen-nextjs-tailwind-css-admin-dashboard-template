"use client";
import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  CreditCard,
  FileText,
  Folder,
  FolderOpen,
  Globe2,
  Lock,
  Mail,
  Package,
  Settings,
  ShieldCheck,
  UserRound,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";

const faq = [
  [
    "What is included in the workspace?",
    "Every plan includes dashboards, shared UI components, responsive layouts, and theme support.",
  ],
  [
    "Can I use multiple accordions?",
    "Yes. Multiple panels can remain open when the component is configured for multi-selection.",
  ],
  [
    "Does it support keyboard navigation?",
    "Accordion triggers are native buttons and work with Tab, Enter, and Space.",
  ],
  [
    "Are the styles theme-aware?",
    "All examples use centralized project tokens and work in light and dark themes.",
  ],
];
function Trigger({
  title,
  open,
  onClick,
  icon: Icon,
  badge,
  disabled = false,
}: {
  title: string;
  open: boolean;
  onClick: () => void;
  icon?: typeof Settings;
  badge?: string;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      aria-expanded={open}
      className="flex w-full items-center gap-2.5 py-3 text-left text-[10px] font-medium disabled:cursor-not-allowed disabled:opacity-45"
    >
      {Icon && <Icon size={14} className="shrink-0 text-accent" />}
      <span className="flex-1">{title}</span>
      {badge && <Badge>{badge}</Badge>}
      <ChevronDown
        size={13}
        className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
      />
    </button>
  );
}
export function AccordionShowcase() {
  const [single, setSingle] = useState(0),
    [multiple, setMultiple] = useState([0, 2]),
    [bordered, setBordered] = useState(0),
    [flush, setFlush] = useState<number | null>(0),
    [icon, setIcon] = useState(0),
    [nested, setNested] = useState(true),
    [nestedChild, setNestedChild] = useState(false),
    [action, setAction] = useState(0);
  const toggleMulti = (index: number) =>
    setMultiple((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Basic accordion" action={<Badge>Single open</Badge>}>
          <div className="divide-y divide-border">
            {faq.slice(0, 3).map(([question, answer], index) => (
              <div key={question}>
                <Trigger
                  title={question}
                  open={single === index}
                  onClick={() => setSingle(single === index ? -1 : index)}
                />
                {single === index && (
                  <p className="pb-3 pr-6 text-[9px] leading-4 text-muted">{answer}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
        <Card title="Multiple accordion" action={<Badge>{multiple.length} open</Badge>}>
          <div className="divide-y divide-border">
            {faq.slice(0, 3).map(([question, answer], index) => (
              <div key={question}>
                <Trigger
                  title={question}
                  open={multiple.includes(index)}
                  onClick={() => toggleMulti(index)}
                />
                {multiple.includes(index) && (
                  <p className="pb-3 pr-6 text-[9px] leading-4 text-muted">{answer}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Bordered accordion">
          <div className="grid gap-2">
            {faq.slice(0, 3).map(([question, answer], index) => (
              <div
                key={question}
                className={`rounded-lg border px-3 ${bordered === index ? "border-accent bg-accent/5" : "border-border"}`}
              >
                <Trigger
                  title={question}
                  open={bordered === index}
                  onClick={() => setBordered(bordered === index ? -1 : index)}
                />
                {bordered === index && (
                  <p className="border-t border-border pb-3 pt-3 text-[9px] leading-4 text-muted">
                    {answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
        <Card title="Flush accordion">
          <div className="-mx-card divide-y divide-border border-y border-border">
            {faq.slice(0, 3).map(([question, answer], index) => (
              <div key={question} className="px-card">
                <Trigger
                  title={question}
                  open={flush === index}
                  onClick={() => setFlush(flush === index ? null : index)}
                />
                {flush === index && (
                  <p className="pb-3 text-[9px] leading-4 text-muted">{answer}</p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-[8px] text-muted">
            Flush panels align with the card edges and remove individual containers.
          </p>
        </Card>
      </div>

      <Card title="Icon accordion" action={<Badge>Settings example</Badge>}>
        <div className="grid gap-2 md:grid-cols-2">
          {[
            [
              UserRound,
              "Profile settings",
              "Manage your display name, profile photo, and personal details.",
            ],
            [
              Bell,
              "Notification preferences",
              "Choose which product and account notifications you receive.",
            ],
            [
              ShieldCheck,
              "Security and privacy",
              "Configure authentication, active sessions, and privacy controls.",
            ],
            [
              CreditCard,
              "Billing information",
              "Review payment methods, invoices, and subscription details.",
            ],
          ].map(([Icon, title, content], index) => {
            const I = Icon as typeof Settings;
            return (
              <div
                key={String(title)}
                className={`rounded-lg border px-3 ${icon === index ? "border-accent/50 bg-surface-alt" : "border-border"}`}
              >
                <Trigger
                  icon={I}
                  title={String(title)}
                  open={icon === index}
                  onClick={() => setIcon(icon === index ? -1 : index)}
                />
                {icon === index && (
                  <p className="border-t border-border pb-3 pt-3 text-[9px] leading-4 text-muted">
                    {String(content)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="With badges">
          <div className="divide-y divide-border">
            <Trigger
              icon={Mail}
              title="Unread messages"
              badge="12"
              open={action === 0}
              onClick={() => setAction(0)}
            />
            {action === 0 && (
              <p className="pb-3 text-[9px] text-muted">
                Your recent conversations and inbox updates.
              </p>
            )}
            <Trigger
              icon={Package}
              title="Pending orders"
              badge="5"
              open={action === 1}
              onClick={() => setAction(1)}
            />
            {action === 1 && (
              <p className="pb-3 text-[9px] text-muted">
                Orders waiting for processing and shipment.
              </p>
            )}
            <Trigger
              icon={FileText}
              title="Draft reports"
              badge="3"
              open={action === 2}
              onClick={() => setAction(2)}
            />
            {action === 2 && (
              <p className="pb-3 text-[9px] text-muted">
                Unpublished reports saved in your workspace.
              </p>
            )}
          </div>
        </Card>
        <Card title="Disabled items">
          <div className="divide-y divide-border">
            <Trigger title="Available section" open={true} onClick={() => {}} />
            <p className="pb-3 text-[9px] text-muted">This panel is currently available.</p>
            <Trigger
              icon={Lock}
              title="Restricted section"
              open={false}
              onClick={() => {}}
              disabled
            />
            <Trigger title="Coming soon" badge="Soon" open={false} onClick={() => {}} disabled />
          </div>
        </Card>
        <Card title="Compact accordion">
          <div className="grid gap-1">
            {["Account details", "Team permissions", "API access", "Danger zone"].map(
              (title, index) => (
                <button
                  key={title}
                  className={`flex items-center justify-between rounded-md px-2.5 py-2 text-left text-[9px] ${index === 0 ? "bg-accent/10 text-accent" : "hover:bg-surface-alt"}`}
                >
                  {title}
                  <ChevronDown size={11} className={index === 0 ? "rotate-180" : ""} />
                </button>
              ),
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-[.9fr_1.1fr]">
        <Card title="Nested accordion">
          <div className="rounded-lg border border-border px-3">
            <Trigger
              icon={nested ? FolderOpen : Folder}
              title="Product resources"
              badge="4 files"
              open={nested}
              onClick={() => setNested(!nested)}
            />
            {nested && (
              <div className="mb-3 border-l border-border pl-3">
                <Trigger
                  icon={nestedChild ? FolderOpen : Folder}
                  title="Design system"
                  badge="2 files"
                  open={nestedChild}
                  onClick={() => setNestedChild(!nestedChild)}
                />
                {nestedChild && (
                  <div className="grid gap-1 pb-2 pl-6">
                    <span className="flex items-center gap-2 rounded px-2 py-1.5 text-[8px] text-muted">
                      <FileText size={11} />
                      Component inventory.pdf
                    </span>
                    <span className="flex items-center gap-2 rounded px-2 py-1.5 text-[8px] text-muted">
                      <FileText size={11} />
                      Token reference.pdf
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 py-2 text-[9px]">
                  <Folder size={12} className="text-accent" />
                  Product briefs <Badge>2</Badge>
                </div>
              </div>
            )}
          </div>
        </Card>
        <Card title="Accordion with actions">
          <div className="grid gap-2">
            {[
              [Globe2, "Production environment", "Healthy", "success"],
              [Zap, "Automations", "18 active", "accent"],
              [Settings, "Workspace configuration", "Updated today", "neutral"],
            ].map(([Icon, title, status, tone], index) => {
              const I = Icon as typeof Settings,
                open = action === index;
              return (
                <div key={String(title)} className="rounded-lg border border-border px-3">
                  <Trigger
                    icon={I}
                    title={String(title)}
                    open={open}
                    onClick={() => setAction(open ? -1 : index)}
                  />
                  {open && (
                    <div className="border-t border-border pb-3 pt-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <Badge tone={tone === "success" ? "success" : "neutral"}>
                            {String(status)}
                          </Badge>
                          <p className="mt-2 text-[8px] text-muted">
                            Manage configuration and view recent activity for this section.
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          Manage
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card
        title="FAQ accordion"
        action={
          <Badge>
            <CircleHelp size={10} />
            Help center
          </Badge>
        }
      >
        <div className="grid gap-x-6 lg:grid-cols-2">
          {faq.map(([question, answer], index) => {
            const open = multiple.includes(index);
            return (
              <div key={question} className="border-b border-border">
                <Trigger title={question} open={open} onClick={() => toggleMulti(index)} />
                {open && <p className="pb-4 pr-5 text-[9px] leading-4 text-muted">{answer}</p>}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-surface-alt p-3">
          <div>
            <b className="text-[9px]">Still need help?</b>
            <p className="mt-1 text-[8px] text-muted">
              Our support team typically replies within one business day.
            </p>
          </div>
          <Button size="sm">Contact support</Button>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        <Card title="Default open">
          <div className="rounded-lg border border-success/25 bg-success/5 px-3">
            <Trigger icon={CheckCircle2} title="Setup complete" open={true} onClick={() => {}} />
            <p className="pb-3 text-[9px] text-muted">Your workspace is configured and ready.</p>
          </div>
        </Card>
        <Card title="With leading icon">
          <div className="rounded-lg border border-border px-3">
            <Trigger icon={Settings} title="Preferences" open={false} onClick={() => {}} />
          </div>
        </Card>
        <Card title="With metadata">
          <div className="rounded-lg border border-border px-3">
            <Trigger title="Release notes" badge="v2.8.0" open={false} onClick={() => {}} />
          </div>
        </Card>
      </div>
    </div>
  );
}
