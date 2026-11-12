"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Cake,
  CalendarDays,
  Check,
  CheckCheck,
  ClipboardList,
  Clock3,
  PartyPopper,
  Sparkles,
  UserRoundPlus,
  WalletCards,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { UserAvatar } from "@/components/ui/user-avatar";
import { HrTitle } from "@/features/hr/components/hr-ui";
import { useHr } from "@/features/hr/hooks/use-hr";
import { upcoming, workforce } from "@/features/hr/selectors";
import { addDays, today, type Activity, type HrData } from "@/features/hr/types";

const formatDate = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
type Props = { data: HrData; department: string; days: number };

function PeopleMoments({ data, department }: Omit<Props, "days">) {
  const [type, setType] = useState("all");
  const people = workforce(data, department, 14).now;
  const occasions = people
    .flatMap((employee) => [
      {
        employee,
        date: upcoming(employee.birthday),
        label: "Birthday",
        years: 0,
      },
      {
        employee,
        date: upcoming(employee.joined),
        label: "Work anniversary",
        years: Number(upcoming(employee.joined).slice(0, 4)) - Number(employee.joined.slice(0, 4)),
      },
    ])
    .filter((o) => o.date <= addDays(today, 14) && (o.label === "Birthday" || o.years > 0))
    .sort((a, b) => a.date.localeCompare(b.date));
  const visible = occasions.filter((o) => type === "all" || o.label === type),
    next = visible[0];
  const remaining = next ? Math.round((Date.parse(next.date) - Date.parse(today)) / 86400000) : 0;
  return (
    <Card
      title={<HrTitle icon={Cake}>People moments</HrTitle>}
      action={<span className="text-tiny text-muted">Next 14 days</span>}
    >
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-tiny text-muted">
          <span className="mr-1 text-lg font-semibold text-foreground">{occasions.length}</span>
          upcoming milestones
        </p>
        <Select
          aria-label="People moments filter"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="all">All moments</option>
          <option>Birthday</option>
          <option>Work anniversary</option>
        </Select>
      </div>
      {next ? (
        <div className="mt-3 rounded-control border border-border bg-surface-alt p-3">
          <div className="mb-3 flex items-center justify-between gap-2 text-[10px]">
            <span className="flex items-center gap-1 font-medium uppercase tracking-wide text-accent">
              <PartyPopper size={12} />
              Up next
            </span>
            <span className="text-muted">
              {remaining === 0 ? "Today" : `In ${remaining} ${remaining === 1 ? "day" : "days"}`}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <UserAvatar name={next.employee.name} size={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-body font-medium">{next.employee.name}</p>
              <p className="mt-1 text-tiny text-muted">
                {next.label === "Birthday"
                  ? "Celebrating a birthday"
                  : `${next.years} ${next.years === 1 ? "year" : "years"} with the team`}
              </p>
            </div>
            <div className="shrink-0 text-center">
              <p className="text-[10px] uppercase text-muted">
                {formatDate(next.date).split(" ")[0]}
              </p>
              <p className="text-xl font-semibold leading-tight">{next.date.slice(8)}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-3 rounded-control border border-dashed border-border p-4 text-label text-muted">
          No matching milestones in the next 14 days.
        </p>
      )}
      <div className="mt-1 divide-y divide-border">
        {visible.slice(1, 4).map((o) => (
          <div key={`${o.employee.id}-${o.label}`} className="flex items-center gap-2 py-3">
            <UserAvatar name={o.employee.name} size={28} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-label font-medium">{o.employee.name}</p>
              <p className="mt-0.5 text-[10px] text-muted">
                {o.label}
                {o.years ? ` · ${o.years} years` : ""}
              </p>
            </div>
            <time
              dateTime={o.date}
              className="shrink-0 rounded-control bg-surface-alt px-2 py-1 text-tiny text-muted"
            >
              {formatDate(o.date)}
            </time>
          </div>
        ))}
      </div>
      <Link
        href="/apps/hr/employees"
        className="mt-2 flex items-center justify-between border-t border-border pt-3 text-tiny text-accent"
      >
        Explore employee directory
        <ArrowUpRight size={12} />
      </Link>
    </Card>
  );
}

function ActivityTimeline({ data, department, days }: Props) {
  const [kind, setKind] = useState("all");
  const start = addDays(today, -days);
  const relevant = data.activity.filter(
    (a) =>
      a.date > start &&
      a.date <= today &&
      (department === "all" ||
        data.employees.find((e) => e.id === a.employeeId)?.departmentId === department ||
        data.jobs.find((j) => j.id === data.candidates.find((c) => c.id === a.candidateId)?.jobId)
          ?.departmentId === department),
  );
  const joined: Activity[] = workforce(data, department, days)
    .hires.filter(
      (e) =>
        !relevant.some(
          (a) => a.kind === "Employee" && a.employeeId === e.id && a.date === e.joined,
        ),
    )
    .map((e) => ({
      id: `joined-${e.id}`,
      employeeId: e.id,
      candidateId: "",
      kind: "Employee",
      date: e.joined,
      message: `${e.name} joined ${data.departments.find((d) => d.id === e.departmentId)?.name}.`,
    }));
  const activities = [...relevant, ...joined]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((a) => kind === "all" || a.kind === kind);
  return (
    <Card
      className="h-full"
      title={<HrTitle icon={Sparkles}>People activity</HrTitle>}
      action={
        <Select
          aria-label="People activity filter"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          <option value="all">All activity</option>
          {["Employee", "Attendance", "Leave", "Hiring", "Payroll", "Task"].map((name) => (
            <option key={name}>{name}</option>
          ))}
        </Select>
      }
    >
      <div className="mt-3 flex items-center justify-between border-b border-border pb-3 text-tiny text-muted">
        <span>
          <strong className="mr-1 text-lg font-semibold text-foreground">
            {activities.length}
          </strong>
          events in scope
        </span>
        <span>Last {days} days</span>
      </div>
      <ol className="mt-3 max-h-[290px] overflow-y-auto pr-1">
        {activities.slice(0, 8).map((activity, index) => {
          const person =
            data.employees.find((e) => e.id === activity.employeeId) ||
            data.candidates.find((c) => c.id === activity.candidateId);
          const Icon =
            activity.kind === "Payroll"
              ? WalletCards
              : activity.kind === "Hiring"
                ? BriefcaseBusiness
                : activity.kind === "Employee"
                  ? UserRoundPlus
                  : CalendarDays;
          return (
            <li key={activity.id} className="relative flex gap-2.5 pb-5">
              {index < Math.min(activities.length, 8) - 1 && (
                <span aria-hidden className="absolute bottom-0 left-[15px] top-8 w-px bg-border" />
              )}
              <div className="relative shrink-0">
                {person ? (
                  <UserAvatar name={person.name} size={32} />
                ) : (
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface-alt text-accent">
                    <Icon size={13} />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-wide text-accent">
                    {activity.kind}
                  </span>
                  <time dateTime={activity.date} className="shrink-0 text-[10px] text-muted">
                    {formatDate(activity.date)}
                  </time>
                </div>
                <p className="mt-1 break-words text-label leading-relaxed">{activity.message}</p>
              </div>
            </li>
          );
        })}
        {!activities.length && (
          <li className="rounded-control border border-dashed border-border p-4 text-label text-muted">
            No matching activity in this reporting period.
          </li>
        )}
      </ol>
      <p className="border-t border-border pt-2 text-[10px] text-muted">
        Latest {Math.min(activities.length, 8)} events · local demo activity
      </p>
    </Card>
  );
}

function TaskDesk({ data, department }: Omit<Props, "days">) {
  const { update } = useHr();
  const [filter, setFilter] = useState("all"),
    [error, setError] = useState("");
  const tasks = data.tasks
    .filter((t) => department === "all" || t.departmentId === department)
    .sort((a, b) => Number(a.completed) - Number(b.completed) || a.due.localeCompare(b.due));
  const done = tasks.filter((t) => t.completed).length,
    percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const visible = tasks.filter(
    (t) => filter === "all" || (filter === "done" ? t.completed : !t.completed),
  );
  return (
    <Card
      title={<HrTitle icon={ClipboardList}>HR task desk</HrTitle>}
      action={
        <span className="flex items-center gap-1 text-tiny text-muted">
          <CheckCheck size={12} />
          {done}/{tasks.length} done
        </span>
      }
    >
      <div className="mt-3 rounded-control border border-border bg-surface-alt p-3">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-tiny text-muted">Team checklist progress</p>
            <p className="mt-1 text-kpi font-semibold">
              {percent}%<span className="ml-2 text-tiny font-normal text-muted">complete</span>
            </p>
          </div>
          <span className="mb-1 text-tiny text-muted">{tasks.length - done} remaining</span>
        </div>
        <div
          role="progressbar"
          aria-label="HR task completion"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-border"
        >
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <div className="my-3 flex gap-1">
        {[
          { value: "all", label: "All tasks" },
          { value: "open", label: "Open" },
          { value: "done", label: "Completed" },
        ].map((tab) => (
          <Button
            key={tab.value}
            size="sm"
            variant={filter === tab.value ? "secondary" : "ghost"}
            aria-pressed={filter === tab.value}
            onClick={() => setFilter(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div className="max-h-[200px] space-y-2 overflow-y-auto">
        {visible.map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-2 rounded-control border border-border p-3 ${task.completed ? "bg-surface-alt" : "bg-surface"}`}
          >
            <button
              type="button"
              aria-pressed={task.completed}
              aria-label={`${task.completed ? "Reopen" : "Complete"} ${task.title}`}
              onClick={() =>
                setError(
                  update((state) => {
                    const item = state.tasks.find((t) => t.id === task.id);
                    if (item) item.completed = !item.completed;
                  }),
                )
              }
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border focus-visible:outline-2 focus-visible:outline-accent ${task.completed ? "border-accent bg-accent text-white" : "border-border bg-surface hover:border-accent"}`}
            >
              {task.completed && <Check size={12} />}
            </button>
            <div className="min-w-0 flex-1">
              <p
                className={`text-label font-medium ${task.completed ? "text-muted line-through" : ""}`}
              >
                {task.title}
              </p>
              <p className="mt-1 text-[10px] text-muted">
                {data.departments.find((d) => d.id === task.departmentId)?.name}
              </p>
              <div
                className={`mt-2 flex items-center gap-1 text-[10px] ${!task.completed && task.due < today ? "text-danger" : "text-muted"}`}
              >
                <Clock3 size={10} />
                {task.completed
                  ? "Completed · due"
                  : task.due < today
                    ? "Overdue"
                    : task.due === today
                      ? "Due today"
                      : "Due"}
                <time dateTime={task.due}>{formatDate(task.due)}</time>
              </div>
            </div>
          </div>
        ))}
        {!visible.length && (
          <p className="rounded-control border border-dashed border-border p-4 text-label text-muted">
            {filter === "done"
              ? "No completed tasks yet."
              : filter === "open" && tasks.length
                ? "All tasks are complete."
                : "No tasks in this selection."}
          </p>
        )}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-label text-danger">
          {error}
        </p>
      )}
    </Card>
  );
}

export function PeopleActivity({ department, days }: { department: string; days: number }) {
  const { data } = useHr();
  return (
    <div className="grid items-start gap-widget lg:grid-cols-3">
      <PeopleMoments data={data} department={department} />
      <ActivityTimeline data={data} department={department} days={days} />
      <TaskDesk data={data} department={department} />
    </div>
  );
}
