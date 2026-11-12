"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useTheme } from "next-themes";
import {
  Bell,
  Check,
  CreditCard,
  Download,
  Eye,
  KeyRound,
  Laptop,
  LockKeyhole,
  Monitor,
  Moon,
  Palette,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sun,
  Trash2,
  TriangleAlert,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ShowcaseCard as Card } from "@/components/ui/showcase-card";
import { ConnectedApps, type AppConnections, type AppId } from "./connected-apps";
import {
  NotificationPreferences,
  SettingsSwitch,
  type NotificationKey,
  type NotificationValues,
} from "./notification-preferences";
import {
  SettingsNavigation,
  settingsSections,
  type SettingsSectionId,
} from "./settings-navigation";

type General = { name: string; email: string; language: string; timezone: string; country: string };
type Preferences = {
  workspace: string;
  date: string;
  time: string;
  currency: string;
  week: string;
  compact: boolean;
};
type Billing = {
  email: string;
  company: string;
  address: string;
  language: string;
  delivery: string;
};
type Privacy = {
  profile: string;
  activity: boolean;
  contact: boolean;
  analytics: boolean;
  communications: boolean;
};
type Security = { signInAlerts: boolean; deviceReview: boolean };
type DemoAction =
  | "Deactivate account"
  | "Delete account"
  | "Export account data"
  | "Sign out device"
  | "Update password"
  | "Recovery options"
  | null;

const initialGeneral: General = {
  name: "Alex Morgan",
  email: "alex.morgan@orzen.dev",
  language: "English",
  timezone: "Europe/London",
  country: "United Kingdom",
};
const initialPreferences: Preferences = {
  workspace: "Orzen Studio",
  date: "DD/MM/YYYY",
  time: "24-hour",
  currency: "USD ($)",
  week: "Monday",
  compact: false,
};
const initialBilling: Billing = {
  email: "billing@orzen.dev",
  company: "Orzen Studio",
  address: "42 Westbridge Street, London",
  language: "English",
  delivery: "Email PDF",
};
const initialPrivacy: Privacy = {
  profile: "Team members",
  activity: true,
  contact: false,
  analytics: true,
  communications: false,
};
const initialSecurity: Security = { signInAlerts: true, deviceReview: true };
const initialNotifications: NotificationValues = {
  account: true,
  projects: true,
  team: true,
  security: true,
  product: false,
};
const initialConnections: AppConnections = {
  github: true,
  slack: true,
  drive: false,
  teams: false,
};

export function AccountSettingsPage() {
  const [active, setActive] = useState<SettingsSectionId>("general");
  const [general, setGeneral] = useState(initialGeneral);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [billing, setBilling] = useState(initialBilling);
  const [privacy, setPrivacy] = useState(initialPrivacy);
  const [security, setSecurity] = useState(initialSecurity);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [connections, setConnections] = useState(initialConnections);
  const [feedback, setFeedback] = useState("");
  const [dialog, setDialog] = useState<DemoAction>(null);
  const { theme, setTheme } = useTheme();
  const activeLabel = settingsSections.find((item) => item.id === active)?.label ?? "General";
  const note = (message: string) => setFeedback(message);
  const save = (event: FormEvent, area: string) => {
    event.preventDefault();
    note(`${area} changes applied to this preview.`);
  };
  const reset = () => {
    setGeneral(initialGeneral);
    setPreferences(initialPreferences);
    setBilling(initialBilling);
    setPrivacy(initialPrivacy);
    setSecurity(initialSecurity);
    setNotifications(initialNotifications);
    setConnections(initialConnections);
    note("Preview settings reset to their defaults.");
  };

  return (
    <div className="grid min-w-0 gap-widget">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="Account Settings" />
          <p className="mt-1 text-[11px] text-muted">
            Manage your workspace defaults, preferences, and account controls.
          </p>
        </div>
      </div>
      <div className="grid min-w-0 items-start gap-widget lg:grid-cols-[218px_minmax(0,1fr)] xl:grid-cols-[238px_minmax(0,1fr)]">
        <SettingsNavigation
          active={active}
          onChange={(section) => {
            setActive(section);
            setFeedback("");
          }}
        />
        <div className="grid min-w-0 gap-widget">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-[15px] font-semibold">{activeLabel}</h2>
              <p className="mt-0.5 text-[11px] text-muted">
                {settingsSections.find((item) => item.id === active)?.description}
              </p>
            </div>
            <Badge>Account workspace</Badge>
          </div>
          {feedback && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/[.06] px-3 py-2 text-[11px] text-emerald-700 dark:text-emerald-300"
            >
              <Check size={13} />
              {feedback}
            </div>
          )}

          {active === "general" && (
            <Card title="Account information" icon={UserRound}>
              <form onSubmit={(event) => save(event, "Account information")} className="grid gap-4">
                <p className="text-[12px] text-muted">
                  The details shown throughout your workspace and account preview.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Display name" htmlFor="account-name">
                    <Input
                      id="account-name"
                      required
                      value={general.name}
                      onChange={(event) => setGeneral({ ...general, name: event.target.value })}
                      className="w-full"
                    />
                  </Field>
                  <Field label="Email address" htmlFor="account-email">
                    <Input
                      id="account-email"
                      type="email"
                      required
                      value={general.email}
                      onChange={(event) => setGeneral({ ...general, email: event.target.value })}
                      className="w-full"
                    />
                  </Field>
                  <Field label="Language" htmlFor="account-language">
                    <Select
                      id="account-language"
                      value={general.language}
                      onChange={(event) => setGeneral({ ...general, language: event.target.value })}
                      className="w-full"
                    >
                      <option>English</option>
                      <option>French</option>
                      <option>Spanish</option>
                      <option>German</option>
                    </Select>
                  </Field>
                  <Field label="Timezone" htmlFor="account-timezone">
                    <Select
                      id="account-timezone"
                      value={general.timezone}
                      onChange={(event) => setGeneral({ ...general, timezone: event.target.value })}
                      className="w-full"
                    >
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Asia/Kolkata">Kolkata (IST)</option>
                      <option value="America/New_York">New York (ET)</option>
                      <option value="Asia/Singapore">Singapore (SGT)</option>
                    </Select>
                  </Field>
                  <Field label="Country / region" htmlFor="account-country">
                    <Select
                      id="account-country"
                      value={general.country}
                      onChange={(event) => setGeneral({ ...general, country: event.target.value })}
                      className="w-full"
                    >
                      <option>United Kingdom</option>
                      <option>India</option>
                      <option>United States</option>
                      <option>Singapore</option>
                    </Select>
                  </Field>
                </div>
                <FormActions
                  onReset={() => {
                    setGeneral(initialGeneral);
                    note("Account information reset.");
                  }}
                />
              </form>
            </Card>
          )}

          {active === "preferences" && (
            <Card title="Workspace preferences" icon={SlidersHorizontal}>
              <form onSubmit={(event) => save(event, "Preferences")} className="grid gap-4">
                <p className="text-[12px] text-muted">
                  Set the defaults used by this workspace preview.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Default workspace" htmlFor="pref-workspace">
                    <Select
                      id="pref-workspace"
                      value={preferences.workspace}
                      onChange={(event) =>
                        setPreferences({ ...preferences, workspace: event.target.value })
                      }
                      className="w-full"
                    >
                      <option>Orzen Studio</option>
                      <option>Product Team</option>
                      <option>Operations</option>
                    </Select>
                  </Field>
                  <Field label="Date format" htmlFor="pref-date">
                    <Select
                      id="pref-date"
                      value={preferences.date}
                      onChange={(event) =>
                        setPreferences({ ...preferences, date: event.target.value })
                      }
                      className="w-full"
                    >
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </Select>
                  </Field>
                  <Field label="Time format" htmlFor="pref-time">
                    <Select
                      id="pref-time"
                      value={preferences.time}
                      onChange={(event) =>
                        setPreferences({ ...preferences, time: event.target.value })
                      }
                      className="w-full"
                    >
                      <option>24-hour</option>
                      <option>12-hour</option>
                    </Select>
                  </Field>
                  <Field label="Currency display" htmlFor="pref-currency">
                    <Select
                      id="pref-currency"
                      value={preferences.currency}
                      onChange={(event) =>
                        setPreferences({ ...preferences, currency: event.target.value })
                      }
                      className="w-full"
                    >
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>INR (₹)</option>
                    </Select>
                  </Field>
                  <Field label="Week starts on" htmlFor="pref-week">
                    <Select
                      id="pref-week"
                      value={preferences.week}
                      onChange={(event) =>
                        setPreferences({ ...preferences, week: event.target.value })
                      }
                      className="w-full"
                    >
                      <option>Monday</option>
                      <option>Sunday</option>
                    </Select>
                  </Field>
                </div>
                <SettingRow
                  title="Compact interface"
                  description="Use denser workspace layouts where available."
                  icon={Monitor}
                  checked={preferences.compact}
                  onChange={(value) => setPreferences({ ...preferences, compact: value })}
                />
                <FormActions
                  onReset={() => {
                    setPreferences(initialPreferences);
                    note("Preferences reset.");
                  }}
                />
              </form>
            </Card>
          )}

          {active === "notifications" && (
            <>
              <NotificationPreferences
                values={notifications}
                onChange={(key: NotificationKey, value) => {
                  setNotifications({ ...notifications, [key]: value });
                  note("Notification preference updated in this preview.");
                }}
              />
              <Card title="Delivery summary" icon={Bell}>
                <div className="grid gap-2 sm:grid-cols-2">
                  <SummaryItem title="Email digest" detail="Daily summary · 9:00 AM" />
                  <SummaryItem
                    title="In-app alerts"
                    detail={`${Object.values(notifications).filter(Boolean).length} categories enabled`}
                  />
                </div>
              </Card>
            </>
          )}

          {active === "appearance" && (
            <Card title="Color mode" icon={Palette}>
              <p className="mb-4 text-[12px] text-muted">
                Select the global interface appearance. This updates the existing app theme.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {(
                  [
                    { value: "light", title: "Light", icon: Sun },
                    { value: "dark", title: "Dark", icon: Moon },
                    { value: "system", title: "System", icon: Monitor },
                  ] as const
                ).map(({ value, title, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={theme === value}
                    onClick={() => setTheme(value)}
                    className={`rounded-lg border p-3 text-left focus-visible:outline-2 focus-visible:outline-accent ${theme === value ? "border-accent bg-accent/5" : "border-border hover:border-accent/40"}`}
                  >
                    <div
                      className={`mb-3 h-16 rounded-md border p-2 ${value === "dark" ? "border-slate-700 bg-slate-900" : value === "system" ? "border-border bg-gradient-to-r from-white to-slate-900" : "border-border bg-white"}`}
                    >
                      <div
                        className={`h-2 w-3/4 rounded-sm ${value === "dark" ? "bg-slate-600" : "bg-slate-200"}`}
                      />
                      <div
                        className={`mt-2 h-6 rounded-sm ${value === "dark" ? "bg-slate-700" : "bg-slate-100"}`}
                      />
                    </div>
                    <span className="flex items-center gap-2 text-[12px] font-medium">
                      <Icon size={14} />
                      {title}
                      {theme === value && <Check size={13} className="ml-auto text-accent" />}
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {active === "security" && (
            <>
              <Card title="Security overview" icon={ShieldCheck}>
                <div className="grid gap-2 sm:grid-cols-2">
                  <SummaryItem title="Password" detail="Update form preview" icon={KeyRound} />
                  <SummaryItem
                    title="Two-factor authentication"
                    detail="Enabled preview"
                    icon={ShieldCheck}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => setDialog("Update password")}>
                    Update password
                  </Button>
                  <Button variant="ghost" onClick={() => setDialog("Recovery options")}>
                    Recovery options
                  </Button>
                </div>
                <p className="mt-3 text-[10px] text-muted">
                  Security actions are interface previews; no credentials are collected or changed.
                </p>
              </Card>
              <Card title="Security preferences" icon={LockKeyhole}>
                <SettingRow
                  title="Sign-in alerts"
                  description="Show an alert for a new sign-in preview."
                  icon={Bell}
                  checked={security.signInAlerts}
                  onChange={(value) => setSecurity({ ...security, signInAlerts: value })}
                />
                <SettingRow
                  title="Device review reminders"
                  description="Remind me to review the devices listed below."
                  icon={Laptop}
                  checked={security.deviceReview}
                  onChange={(value) => setSecurity({ ...security, deviceReview: value })}
                />
              </Card>
              <Card title="Recent security activity" icon={ShieldCheck}>
                <div className="divide-y divide-border">
                  <ActivityLine title="Password reviewed" time="Nov 8 · London" />
                  <ActivityLine title="Two-factor preference checked" time="Nov 4 · London" />
                  <ActivityLine title="New device preview" time="Oct 29 · Manchester" />
                </div>
              </Card>
            </>
          )}

          {active === "privacy" && (
            <Card title="Privacy controls" icon={Eye}>
              <div className="mb-4">
                <Field label="Profile visibility" htmlFor="privacy-profile">
                  <Select
                    id="privacy-profile"
                    value={privacy.profile}
                    onChange={(event) => setPrivacy({ ...privacy, profile: event.target.value })}
                    className="w-full sm:max-w-xs"
                  >
                    <option>Team members</option>
                    <option>Workspace members</option>
                    <option>Only me</option>
                  </Select>
                </Field>
                <p className="mt-1 text-[10px] text-muted">
                  Controls who can view your profile in this preview.
                </p>
              </div>
              <SettingRow
                title="Activity visibility"
                description="Show your recent contributions to teammates."
                icon={Eye}
                checked={privacy.activity}
                onChange={(value) => setPrivacy({ ...privacy, activity: value })}
              />
              <SettingRow
                title="Contact information"
                description="Show phone and email on your profile."
                icon={UserRound}
                checked={privacy.contact}
                onChange={(value) => setPrivacy({ ...privacy, contact: value })}
              />
              <SettingRow
                title="Usage analytics"
                description="Include your activity in workspace insights."
                icon={SlidersHorizontal}
                checked={privacy.analytics}
                onChange={(value) => setPrivacy({ ...privacy, analytics: value })}
              />
              <SettingRow
                title="Communications"
                description="Allow optional workspace messages."
                icon={Bell}
                checked={privacy.communications}
                onChange={(value) => setPrivacy({ ...privacy, communications: value })}
              />
            </Card>
          )}

          {active === "apps" && (
            <ConnectedApps
              connections={connections}
              onChange={(id: AppId, connected) => {
                setConnections({ ...connections, [id]: connected });
                note(
                  `${id === "drive" ? "Google Drive" : id === "teams" ? "Microsoft Teams" : id === "github" ? "GitHub" : "Slack"} ${connected ? "connected" : "disconnected"} in the preview.`,
                );
              }}
            />
          )}

          {active === "sessions" && (
            <Card
              title="Devices & sessions"
              icon={Monitor}
              action={<Badge>Fictional devices</Badge>}
            >
              <p className="mb-3 text-[12px] text-muted">
                Review sample sessions and the available action layout.
              </p>
              <div className="divide-y divide-border">
                <Device
                  icon={Laptop}
                  title="Chrome on Windows"
                  location="London, United Kingdom"
                  time="Active now"
                  current
                />
                <Device
                  icon={Smartphone}
                  title="Safari on iPhone"
                  location="Manchester, United Kingdom"
                  time="Yesterday"
                  onSignOut={() => setDialog("Sign out device")}
                />
                <Device
                  icon={Monitor}
                  title="Edge on Windows"
                  location="Bristol, United Kingdom"
                  time="Nov 2"
                  onSignOut={() => setDialog("Sign out device")}
                />
              </div>
              <p className="mt-3 text-[10px] text-muted">
                Session information is illustrative; no device is detected or signed out.
              </p>
            </Card>
          )}

          {active === "billing" && (
            <Card title="Billing preferences" icon={CreditCard}>
              <form onSubmit={(event) => save(event, "Billing preferences")} className="grid gap-4">
                <p className="text-[12px] text-muted">
                  Configure the sample details used on invoice previews. No payment information is
                  needed.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Billing email" htmlFor="billing-email">
                    <Input
                      id="billing-email"
                      type="email"
                      required
                      value={billing.email}
                      onChange={(event) => setBilling({ ...billing, email: event.target.value })}
                      className="w-full"
                    />
                  </Field>
                  <Field label="Company name" htmlFor="billing-company">
                    <Input
                      id="billing-company"
                      value={billing.company}
                      onChange={(event) => setBilling({ ...billing, company: event.target.value })}
                      className="w-full"
                    />
                  </Field>
                  <Field label="Billing address" htmlFor="billing-address">
                    <Input
                      id="billing-address"
                      value={billing.address}
                      onChange={(event) => setBilling({ ...billing, address: event.target.value })}
                      className="w-full"
                    />
                  </Field>
                  <Field label="Invoice language" htmlFor="billing-language">
                    <Select
                      id="billing-language"
                      value={billing.language}
                      onChange={(event) => setBilling({ ...billing, language: event.target.value })}
                      className="w-full"
                    >
                      <option>English</option>
                      <option>French</option>
                      <option>Spanish</option>
                    </Select>
                  </Field>
                  <Field label="Invoice delivery" htmlFor="billing-delivery">
                    <Select
                      id="billing-delivery"
                      value={billing.delivery}
                      onChange={(event) => setBilling({ ...billing, delivery: event.target.value })}
                      className="w-full"
                    >
                      <option>Email PDF</option>
                      <option>Workspace only</option>
                      <option>Both</option>
                    </Select>
                  </Field>
                </div>
                <FormActions
                  onReset={() => {
                    setBilling(initialBilling);
                    note("Billing preferences reset.");
                  }}
                />
              </form>
            </Card>
          )}

          {active === "danger" && (
            <>
              <Card title="Account data" icon={Download}>
                <ActionRow
                  title="Export account data"
                  description="Preview a request to export account information."
                  icon={Download}
                  action="Preview export"
                  onClick={() => setDialog("Export account data")}
                />
              </Card>
              <Card title="Danger zone" icon={TriangleAlert} className="border-rose-500/25">
                <ActionRow
                  title="Deactivate account"
                  description="Preview a temporary deactivation confirmation."
                  icon={TriangleAlert}
                  action="Deactivate"
                  onClick={() => setDialog("Deactivate account")}
                />
                <div className="border-t border-border">
                  <ActionRow
                    title="Delete account"
                    description="Preview a permanent deletion confirmation."
                    icon={Trash2}
                    action="Delete account"
                    onClick={() => setDialog("Delete account")}
                  />
                </div>
              </Card>
            </>
          )}

          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={reset}>
              Reset all preview settings
            </Button>
          </div>
        </div>
      </div>
      <Dialog
        open={dialog !== null}
        title={`${dialog ?? "Account action"} · preview`}
        onClose={() => setDialog(null)}
      >
        <div className="grid gap-4">
          <p className="text-[12px] leading-5 text-muted">
            This is a design preview. No account, password, session, or data will be changed.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button
              variant={
                dialog === "Delete account" || dialog === "Deactivate account"
                  ? "destructive"
                  : "primary"
              }
              onClick={() => {
                note(`${dialog} preview closed. No account changes were made.`);
                setDialog(null);
              }}
            >
              Continue preview
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="grid min-w-0 gap-1.5 text-[11px] font-medium">
      {label}
      {children}
    </label>
  );
}
function FormActions({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
      <Button variant="ghost" onClick={onReset}>
        Reset
      </Button>
      <Button type="submit" variant="dark">
        Save changes
      </Button>
    </div>
  );
}
function SettingRow({
  title,
  description,
  icon: Icon,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 border-t border-border py-3 first:border-t-0">
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-accent/10 text-accent">
        <Icon size={14} />
      </span>
      <div className="min-w-0 flex-1">
        <b className="text-[12px] font-medium">{title}</b>
        <p className="mt-0.5 text-[11px] leading-4 text-muted">{description}</p>
      </div>
      <SettingsSwitch label={title} checked={checked} onChange={onChange} />
    </div>
  );
}
function SummaryItem({
  title,
  detail,
  icon: Icon,
}: {
  title: string;
  detail: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border p-3">
      {Icon && <Icon size={15} className="text-accent" />}
      <div>
        <b className="block text-[11px]">{title}</b>
        <span className="text-[10px] text-muted">{detail}</span>
      </div>
    </div>
  );
}
function ActivityLine({ title, time }: { title: string; time: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 text-[11px] first:pt-0 last:pb-0">
      <span className="inline-flex items-center gap-2">
        <i className="size-1.5 rounded-full bg-emerald-500" />
        {title}
      </span>
      <span className="text-[10px] text-muted">{time}</span>
    </div>
  );
}
function Device({
  icon: Icon,
  title,
  location,
  time,
  current,
  onSignOut,
}: {
  icon: LucideIcon;
  title: string;
  location: string;
  time: string;
  current?: boolean;
  onSignOut?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent/10 text-accent">
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <b className="block text-[12px]">{title}</b>
        <span className="text-[10px] text-muted">
          {location} · {time}
        </span>
      </div>
      {current ? (
        <Badge tone="success">Current preview</Badge>
      ) : (
        <Button size="sm" variant="outline" onClick={onSignOut}>
          Sign out
        </Button>
      )}
    </div>
  );
}
function ActionRow({
  title,
  description,
  icon: Icon,
  action,
  onClick,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-rose-500/10 text-rose-500">
        <Icon size={14} />
      </span>
      <div className="min-w-0 flex-1">
        <b className="block text-[12px]">{title}</b>
        <p className="text-[10px] text-muted">{description}</p>
      </div>
      <Button size="sm" variant="outline" onClick={onClick}>
        {action}
      </Button>
    </div>
  );
}
