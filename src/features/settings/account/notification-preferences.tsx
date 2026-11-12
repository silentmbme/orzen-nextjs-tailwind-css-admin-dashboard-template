import { Bell, BriefcaseBusiness, Megaphone, ShieldCheck, UsersRound } from "lucide-react";
import { ShowcaseCard as Card } from "@/components/ui/showcase-card";

export type NotificationKey = "account" | "projects" | "team" | "security" | "product";
export type NotificationValues = Record<NotificationKey, boolean>;

const rows = [
  {
    key: "account",
    title: "Account notifications",
    description: "Updates to your account and workspace membership.",
    icon: Bell,
    color: "text-violet-500 bg-violet-500/10",
  },
  {
    key: "projects",
    title: "Project activity",
    description: "Mentions, assignments, and project milestones.",
    icon: BriefcaseBusiness,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    key: "team",
    title: "Team updates",
    description: "New members, shared comments, and team activity.",
    icon: UsersRound,
    color: "text-rose-500 bg-rose-500/10",
  },
  {
    key: "security",
    title: "Security alerts",
    description: "Sign-in and important account security notices.",
    icon: ShieldCheck,
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    key: "product",
    title: "Product announcements",
    description: "Feature news and release highlights.",
    icon: Megaphone,
    color: "text-amber-500 bg-amber-500/10",
  },
] as const;

export function SettingsSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-[20px] w-[34px] shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${checked ? "bg-accent" : "bg-border"}`}
    >
      <span
        className={`absolute left-[3px] top-[3px] size-[14px] rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none ${checked ? "translate-x-[14px]" : ""}`}
      />
    </button>
  );
}

export function NotificationPreferences({
  values,
  onChange,
}: {
  values: NotificationValues;
  onChange: (key: NotificationKey, value: boolean) => void;
}) {
  return (
    <Card title="Notification channels" icon={Bell}>
      <p className="mb-3 text-[12px] text-muted">
        Choose which updates appear in your account preferences.
      </p>
      <div className="divide-y divide-border">
        {rows.map(({ key, title, description, icon: Icon, color }) => (
          <div key={key} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span className={`grid size-8 shrink-0 place-items-center rounded-md ${color}`}>
              <Icon size={14} />
            </span>
            <div className="min-w-0 flex-1">
              <b className="block text-[12px] font-medium">{title}</b>
              <p className="mt-0.5 text-[11px] leading-4 text-muted">{description}</p>
            </div>
            <SettingsSwitch
              checked={values[key]}
              onChange={(value) => onChange(key, value)}
              label={`${title} notifications`}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
