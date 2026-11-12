import {
  BadgeCheck,
  CalendarDays,
  Check,
  ClipboardCheck,
  Clock3,
  Code2,
  FileText,
  Flag,
  FlaskConical,
  MessageSquare,
  PencilRuler,
  Rocket,
  Send,
  Upload,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { ShowcaseCard as Card } from "@/components/ui/showcase-card";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  activity,
  changelog,
  history,
  milestones,
  roadmap,
  type TimelineStatus,
} from "./timeline-data";

const eventIcons: Record<string, LucideIcon> = {
  member: UserPlus,
  milestone: Flag,
  document: Upload,
  comment: MessageSquare,
  task: ClipboardCheck,
  research: ClipboardCheck,
  planning: CalendarDays,
  design: PencilRuler,
  development: Code2,
  testing: FlaskConical,
  launch: Rocket,
  release: Send,
  update: BadgeCheck,
};
const colors: Record<TimelineStatus, string> = {
  completed: "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  current: "border-accent/30 bg-accent/10 text-accent",
  upcoming: "border-border bg-surface-alt text-muted",
};
const stageColors = [
  "text-violet-500 bg-violet-500/10",
  "text-blue-500 bg-blue-500/10",
  "text-cyan-600 bg-cyan-500/10 dark:text-cyan-400",
  "text-rose-500 bg-rose-500/10",
  "text-amber-600 bg-amber-500/10 dark:text-amber-400",
  "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400",
];

export function TimelinePage() {
  return (
    <div className="grid min-w-0 gap-widget">
      <div>
        <PageHeader title="Timeline" />
        <p className="mt-1 text-[11px] text-muted">
          Explore chronological events, milestones and activity layouts.
        </p>
      </div>
      <ActivityTimeline />
      <AlternatingTimeline />
      <HorizontalRoadmap />
      <ProjectHistoryTimeline />
      <MinimalTimeline />
    </div>
  );
}

function SectionHeading({
  id,
  number,
  title,
  description,
}: {
  id: string;
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-3 border-b border-border pb-3">
      <span className="text-[10px] font-semibold tracking-[.08em] text-accent">{number}</span>
      <div>
        <h2 id={id} className="text-[13px] font-semibold leading-none">
          {title}
        </h2>
        <p className="mt-1 text-[11px] text-muted">{description}</p>
      </div>
    </div>
  );
}

function ActivityTimeline() {
  return (
    <Card title="Activity timeline" icon={CalendarDays} action={<Badge>Latest updates</Badge>}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
        <ol className="min-w-0">
          {activity.map((event, index) => {
            const Icon = eventIcons[event.type];
            return (
              <li
                key={event.id}
                className="relative grid grid-cols-[34px_minmax(0,1fr)] gap-3 pb-4 last:pb-0"
              >
                {index < activity.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[16px] top-8 w-px bg-border"
                  />
                )}
                <span
                  aria-hidden="true"
                  className={`relative z-10 grid size-[33px] place-items-center rounded-full border ${colors[event.status]}`}
                >
                  <Icon size={14} />
                </span>
                <div className="min-w-0 border-b border-border pb-3 last:border-0">
                  <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                    <h3 className="text-[12px] font-semibold">{event.title}</h3>
                    <time className="inline-flex items-center gap-1 text-[10px] text-muted">
                      <Clock3 size={10} />
                      {event.date}
                    </time>
                  </div>
                  <p className="mt-1 text-[11px] leading-5 text-muted">{event.description}</p>
                  {(event.actor || event.attachment) && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {event.actor && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] text-muted">
                          <UserAvatar name={event.actor} size={19} />
                          {event.actor}
                        </span>
                      )}
                      {event.attachment && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-alt px-2 py-1 text-[10px]">
                          <FileText size={11} className="text-accent" />
                          {event.attachment}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
        <aside className="h-fit rounded-lg border border-border bg-surface-alt/70 p-3">
          <span className="text-[10px] font-semibold uppercase tracking-[.06em] text-muted">
            In focus
          </span>
          <div className="mt-3 border-l-2 border-accent pl-3">
            <b className="text-[11px]">Mobile experience launch</b>
            <p className="mt-1 text-[10px] leading-4 text-muted">
              Review activity from the design and operations team this week.
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="text-[10px] text-muted">Team involved</span>
            <span className="flex -space-x-2">
              {["Sofia Garcia", "Alex Morgan", "Priya Shah", "Daniel Kim"].map((name) => (
                <UserAvatar key={name} name={name} size={25} className="border-2 border-surface" />
              ))}
            </span>
          </div>
        </aside>
      </div>
    </Card>
  );
}

function AlternatingTimeline() {
  return (
    <section
      aria-labelledby="alternating-heading"
      className="min-w-0 rounded-card border border-card-border bg-surface p-card"
    >
      <SectionHeading
        id="alternating-heading"
        number="02"
        title="Alternating timeline"
        description="Six phases, arranged around a centered delivery rail."
      />
      <div className="relative mx-auto max-w-4xl py-1">
        <span
          aria-hidden="true"
          className="absolute bottom-7 left-[15px] top-6 w-px bg-border md:left-1/2"
        />
        <ol className="grid gap-4">
          {milestones.map((event, index) => {
            const Icon = eventIcons[event.type];
            return (
              <li
                key={event.id}
                className={`relative flex pl-11 md:pl-0 ${index % 2 ? "md:justify-end" : "md:justify-start"}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-[15px] top-4 z-10 grid size-[30px] -translate-x-1/2 place-items-center rounded-full border-4 border-surface md:left-1/2 ${stageColors[index]}`}
                >
                  <Icon size={13} />
                </span>
                <article
                  className={`relative w-full rounded-lg border bg-surface p-3.5 md:w-[calc(50%-32px)] ${event.status === "current" ? "border-accent/45 bg-accent/[.035]" : "border-border"}`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-7 hidden h-px w-5 bg-border md:block ${index % 2 ? "-left-5" : "-right-5"}`}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[.06em] text-muted">
                      Phase {String(index + 1).padStart(2, "0")}
                    </span>
                    <time className="text-[10px] text-muted">{event.date}</time>
                  </div>
                  <h3 className="mt-2 text-[13px] font-semibold">{event.title}</h3>
                  <p className="mt-1 text-[11px] leading-5 text-muted">{event.description}</p>
                  <span
                    className={`mt-2 inline-flex items-center gap-1.5 text-[10px] font-medium ${event.status === "current" ? "text-accent" : "text-muted"}`}
                  >
                    <i
                      className={`size-1.5 rounded-full ${event.status === "completed" ? "bg-emerald-500" : event.status === "current" ? "bg-accent" : "bg-border"}`}
                    />
                    {event.status === "current"
                      ? "In progress"
                      : event.status === "completed"
                        ? "Completed"
                        : "Upcoming"}
                  </span>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function HorizontalRoadmap() {
  return (
    <Card
      title="Horizontal roadmap"
      icon={Flag}
      action={<Badge>Stage 04 / 06</Badge>}
      className="min-w-0"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-muted">
          Follow the product release from research to launch.
        </p>
        <span className="inline-flex items-center gap-2 text-[10px] text-muted">
          <i className="size-1.5 rounded-full bg-emerald-500" />
          Completed <i className="ml-2 size-1.5 rounded-full bg-accent" />
          Current <i className="ml-2 size-1.5 rounded-full bg-border" />
          Upcoming
        </span>
      </div>
      <div
        className="max-w-full overflow-x-auto rounded-lg border border-border bg-surface-alt/40 p-4"
        tabIndex={0}
        role="region"
        aria-label="Scrollable release roadmap"
      >
        <ol className="relative grid min-w-[820px] grid-cols-6 gap-2">
          <span
            aria-hidden="true"
            className="absolute left-[8.3%] right-[8.3%] top-[43px] h-px bg-border"
          />
          <span
            aria-hidden="true"
            className="absolute left-[8.3%] top-[43px] h-px w-[50%] bg-accent"
          />
          {roadmap.map((event, index) => {
            const Icon = eventIcons[event.type];
            return (
              <li key={event.id} className="relative min-w-0 text-center">
                <time className="block text-[10px] font-medium text-muted">{event.date}</time>
                <span
                  aria-hidden="true"
                  className={`relative z-10 mx-auto mt-3 grid size-8 place-items-center rounded-full border-2 border-surface ${event.status === "completed" ? "bg-accent text-white" : event.status === "current" ? "bg-surface text-accent ring-2 ring-accent" : "bg-surface text-muted ring-1 ring-border"}`}
                >
                  {event.status === "completed" ? <Check size={14} /> : <Icon size={13} />}
                </span>
                <div
                  className={`mt-4 rounded-md border p-2.5 ${event.status === "current" ? "border-accent/45 bg-surface" : "border-border bg-surface"}`}
                >
                  <span className="text-[9px] font-semibold uppercase tracking-[.05em] text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 text-[11px] font-semibold">{event.title}</h3>
                  <p className="mt-1 text-[10px] leading-4 text-muted">{event.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-alt">
          <div className="h-full w-[58%] rounded-full bg-accent" />
        </div>
        <span className="text-[10px] font-medium text-muted">58% complete</span>
      </div>
    </Card>
  );
}

function ProjectHistoryTimeline() {
  return (
    <section aria-labelledby="history-heading" className="min-w-0">
      <SectionHeading
        id="history-heading"
        number="04"
        title="Project history"
        description="A grouped audit-style view with owners and supporting files."
      />
      <ol className="grid gap-3">
        {history.map((group) => (
          <li
            key={group.label}
            className="grid min-w-0 gap-2 sm:grid-cols-[142px_minmax(0,1fr)] sm:gap-4"
          >
            <div className="pt-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-[.04em]">
                {group.label}
              </h3>
              <time className="mt-1 block text-[10px] text-muted">{group.date}</time>
            </div>
            <div className="min-w-0 rounded-lg border border-card-border bg-surface px-3">
              {group.events.map((event) => {
                const Icon = eventIcons[event.type];
                return (
                  <article
                    key={event.id}
                    className="flex gap-3 border-b border-border py-3 last:border-b-0"
                  >
                    <span
                      aria-hidden="true"
                      className={`grid size-8 shrink-0 place-items-center rounded-md border ${colors[event.status]}`}
                    >
                      <Icon size={13} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                        <h4 className="text-[11px] font-semibold">{event.title}</h4>
                        <time className="text-[9px] text-muted">{event.date}</time>
                      </div>
                      <p className="mt-0.5 text-[10px] leading-4 text-muted">{event.description}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-muted">
                        {event.actor && (
                          <span className="inline-flex items-center gap-1">
                            <UserAvatar name={event.actor} size={18} />
                            {event.actor}
                          </span>
                        )}
                        {event.attachment && (
                          <span className="inline-flex items-center gap-1 rounded border border-border bg-surface-alt px-1.5 py-0.5">
                            <FileText size={10} />
                            {event.attachment}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function MinimalTimeline() {
  return (
    <section aria-labelledby="minimal-heading" className="min-w-0 py-2">
      <SectionHeading
        id="minimal-heading"
        number="05"
        title="Minimal timeline"
        description="An editorial changelog with date, release, and concise context."
      />
      <ol className="max-w-4xl">
        {changelog.map((event, index) => (
          <li
            key={event.id}
            className="grid grid-cols-[82px_16px_minmax(0,1fr)] gap-3 sm:grid-cols-[145px_16px_minmax(0,1fr)] sm:gap-5"
          >
            <time className="pt-1 text-[10px] text-muted">{event.date}</time>
            <span className="relative flex justify-center pt-2">
              <i
                aria-hidden="true"
                className="relative z-10 size-[5px] rounded-full bg-foreground"
              />
              {index < changelog.length - 1 && (
                <i
                  aria-hidden="true"
                  className="absolute bottom-0 left-1/2 top-4 w-px -translate-x-1/2 bg-border"
                />
              )}
            </span>
            <div
              className={`pb-6 pt-0.5 ${index < changelog.length - 1 ? "border-b border-border" : ""}`}
            >
              <h3 className="text-[12px] font-semibold">{event.title}</h3>
              <p className="mt-1 max-w-2xl text-[11px] leading-5 text-muted">{event.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
