"use client";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { HrTitle } from "@/features/hr/components/hr-ui";
import { addDays, employedOn, today, type HrData } from "@/features/hr/types";
export function WorkforceTrend({
  data,
  department,
  days,
}: {
  data: HrData;
  department: string;
  days: number;
}) {
  const people = data.employees.filter(
    (e) => department === "all" || e.departmentId === department,
  );
  const rows = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, -days + Math.round((days * i) / 6));
    return {
      date,
      label: new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      Employees: people.filter((e) => employedOn(e, date)).length,
    };
  });
  const change = rows[6].Employees - rows[0].Employees;
  return (
    <ChartCard
      title={<HrTitle icon={TrendingUp}>Headcount trajectory</HrTitle>}
      action={<span className="text-tiny text-muted">Last {days} days</span>}
    >
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[24px] font-semibold leading-tight">
            {rows[6].Employees}
            <span className="ml-2 text-label font-normal text-muted">people</span>
          </p>
          <p className="mt-1 text-tiny text-muted">Employment dates, including onboarding</p>
        </div>
        <span
          className={`rounded-control px-2 py-1 text-label font-medium ${change < 0 ? "bg-danger-subtle text-danger" : "bg-surface-alt text-success"}`}
        >
          {change >= 0 ? "+" : ""}
          {change} net change
        </span>
      </div>
      <div className="mt-4 h-[165px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} margin={{ left: -26, right: 12 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 4" />
            <XAxis
              dataKey="label"
              minTickGap={28}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="stepAfter"
              dataKey="Employees"
              stroke="var(--accent)"
              fill="var(--accent)"
              fillOpacity={0.12}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex justify-between border-t border-border pt-2 text-tiny text-muted">
        <span>
          Opening <strong className="ml-1 font-medium text-foreground">{rows[0].Employees}</strong>
        </span>
        <span>
          Closing <strong className="ml-1 font-medium text-foreground">{rows[6].Employees}</strong>
        </span>
      </div>
    </ChartCard>
  );
}
