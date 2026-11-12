import { createElement, type ReactNode } from "react";
import {
  BellRing,
  CalendarDays,
  ChartNoAxesCombined,
  CloudUpload,
  Code2,
  Gauge,
  LayoutPanelTop,
  ListCollapse,
  ListFilter,
  MousePointerClick,
  Palette,
  PanelTop,
  PanelRight,
  ScanLine,
  Tags,
  TextCursorInput,
  UserRound,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import { Card as BaseCard, type CardProps } from "@/components/ui/card";

export type ShowcaseCardProps = CardProps & { icon?: LucideIcon };

function iconForTitle(title: ReactNode): LucideIcon {
  const value = typeof title === "string" ? title.toLowerCase() : "";

  if (/chart|trend|series|revenue|metric|distribution/.test(value)) return ChartNoAxesCombined;
  if (/input|field|editor|text|validation|form/.test(value)) return TextCursorInput;
  if (/select|dropdown|filter|option|menu/.test(value)) return ListFilter;
  if (/upload|file|dropzone|media|image/.test(value)) return CloudUpload;
  if (/progress|status|loading|usage|score/.test(value)) return Gauge;
  if (/notification|alert|toast|message/.test(value)) return BellRing;
  if (/button|action|control|toolbar/.test(value)) return MousePointerClick;
  if (/badge|tag|label|chip/.test(value)) return Tags;
  if (/tab|segment/.test(value)) return PanelTop;
  if (/accordion|collapse|faq/.test(value)) return ListCollapse;
  if (/navigation|breadcrumb|pagination|sidebar/.test(value)) return Waypoints;
  if (/skeleton|placeholder|loading/.test(value)) return ScanLine;
  if (/avatar|profile|user|team|people/.test(value)) return UserRound;
  if (/modal|drawer|popover|tooltip|overlay/.test(value)) return PanelRight;
  if (/date|time|calendar|schedule/.test(value)) return CalendarDays;
  if (/color|theme|style|appearance/.test(value)) return Palette;
  if (/code|html|markdown|json/.test(value)) return Code2;
  return LayoutPanelTop;
}

export function ShowcaseCard({ title, icon, className = "", ...props }: ShowcaseCardProps) {
  const Icon = icon ?? iconForTitle(title);
  const heading = title ? (
    <span className="inline-flex min-w-0 items-center gap-1.5 uppercase tracking-[0.04em]">
      {createElement(Icon, {
        "aria-hidden": true,
        className: "size-3.5 shrink-0 text-accent",
        strokeWidth: 1.8,
      })}
      <span className="min-w-0 truncate">{title}</span>
    </span>
  ) : undefined;

  return <BaseCard className={`showcase-card ${className}`.trim()} title={heading} {...props} />;
}

export { ShowcaseCard as Card };
