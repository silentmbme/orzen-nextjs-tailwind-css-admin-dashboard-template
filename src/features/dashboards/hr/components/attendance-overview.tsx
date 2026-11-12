"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarCheck2 } from "lucide-react";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { Button } from "@/components/ui/button";
import { HrTitle } from "@/features/hr/components/hr-ui";
import { attendanceAt } from "@/features/hr/selectors";
import {
  addDays,
  attendanceStatuses,
  employedOn,
  isWorkday,
  today,
  type HrData,
} from "@/features/hr/types";
const colors = [
  "var(--accent)",
  "var(--color-trend-down)",
  "var(--color-trend-up)",
  "var(--muted)",
  "var(--color-positive-text)",
];
export function AttendanceOverview({ data, department }: { data: HrData; department: string }) {
  const [focus, setFocus] = useState("all");
  const rows = Array.from({ length: 7 }, (_, index) => addDays(today, index - 6))
    .filter(isWorkday)
    .map((date) => {
      const people = data.employees.filter(
        (e) => employedOn(e, date) && (department === "all" || e.departmentId === department),
      );
      const row: Record<string, string | number> = {
        date,
        name: new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
          weekday: "short",
          timeZone: "UTC",
        }),
      };
      attendanceStatuses.forEach((status) => {
        row[status] = people.filter((e) => attendanceAt(data, e, date)?.status === status).length;
      });
      return row;
    });
  const current = rows.at(-1)!;
  const working = Number(current.Present) + Number(current.Late) + Number(current.Remote);
  const eligible = data.employees.filter(
    (e) => employedOn(e, today) && (department === "all" || e.departmentId === department),
  ).length;
  return (
    <ChartCard
      title={<HrTitle icon={CalendarCheck2}>Attendance operations</HrTitle>}
      action={
        <Link href="/apps/hr/attendance" className="text-tiny text-accent">
          Open timesheet →
        </Link>
      }
    >
      <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="text-kpi font-semibold">
            {eligible ? Math.round((working / eligible) * 100) : 0}%
          </span>
          <span className="ml-2 text-label text-muted">working today</span>
        </div>
        <span className="text-tiny text-muted">
          {working} working / {eligible} employed
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {attendanceStatuses.map((status, index) => (
          <Button
            key={status}
            variant={focus === status ? "secondary" : "ghost"}
            size="sm"
            aria-pressed={focus === status}
            onClick={() => setFocus(focus === status ? "all" : status)}
          >
            <i className="h-1.5 w-1.5 rounded-full" style={{ background: colors[index] }} />
            {status}
            <strong className="font-medium">{current[status]}</strong>
          </Button>
        ))}
      </div>
      <div className="mt-3 h-[200px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} margin={{ left: -24, right: 8 }}>
            <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 4" />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            {attendanceStatuses
              .filter((s) => focus === "all" || focus === s)
              .map((status) => (
                <Area
                  key={status}
                  type="linear"
                  dataKey={status}
                  stackId="attendance"
                  fill={colors[attendanceStatuses.indexOf(status)]}
                  fillOpacity={0.22}
                  stroke={colors[attendanceStatuses.indexOf(status)]}
                  strokeWidth={1.5}
                  animationDuration={400}
                />
              ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-tiny text-muted">
        Five workday snapshots across the last seven calendar days. Buttons show today’s counts and
        isolate a status. Missing records are not automatically treated as absent.
      </p>
    </ChartCard>
  );
}
