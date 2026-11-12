import {
  Bell,
  CreditCard,
  Eye,
  Link2,
  Monitor,
  Palette,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

export const settingsSections = [
  { id: "general", label: "General", icon: Settings2, description: "Account information" },
  {
    id: "preferences",
    label: "Preferences",
    icon: SlidersHorizontal,
    description: "Workspace defaults",
  },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Delivery channels" },
  { id: "appearance", label: "Appearance", icon: Palette, description: "Color mode" },
  { id: "security", label: "Security", icon: ShieldCheck, description: "Account protection" },
  { id: "privacy", label: "Privacy", icon: Eye, description: "Visibility settings" },
  { id: "apps", label: "Connected Apps", icon: Link2, description: "Integrations" },
  { id: "sessions", label: "Devices & Sessions", icon: Monitor, description: "Access overview" },
  { id: "billing", label: "Billing", icon: CreditCard, description: "Invoice preferences" },
  { id: "danger", label: "Danger Zone", icon: TriangleAlert, description: "Account actions" },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}>;

export type SettingsSectionId = (typeof settingsSections)[number]["id"];

export function SettingsNavigation({
  active,
  onChange,
}: {
  active: SettingsSectionId;
  onChange: (section: SettingsSectionId) => void;
}) {
  return (
    <nav
      aria-label="Account settings sections"
      className="min-w-0 rounded-[9px] border border-card-border bg-surface p-2 lg:sticky lg:top-[88px]"
    >
      <p className="hidden px-2.5 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[.06em] text-muted lg:block">
        Settings menu
      </p>
      <div className="flex gap-1 overflow-x-auto lg:grid lg:overflow-visible">
        {settingsSections.map(({ id, label, icon: Icon, description }) => (
          <button
            key={id}
            type="button"
            aria-current={active === id ? "page" : undefined}
            onClick={() => onChange(id)}
            className={`flex shrink-0 items-center gap-2.5 rounded-[7px] px-2.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-accent lg:w-full ${active === id ? "bg-accent/10 text-accent" : "text-foreground hover:bg-surface-alt"}`}
          >
            <Icon size={15} className="shrink-0" />
            <span className="min-w-0">
              <span className="block whitespace-nowrap text-[12px] font-medium">{label}</span>
              <small
                className={`hidden text-[10px] lg:block ${active === id ? "text-accent/80" : "text-muted"}`}
              >
                {description}
              </small>
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
