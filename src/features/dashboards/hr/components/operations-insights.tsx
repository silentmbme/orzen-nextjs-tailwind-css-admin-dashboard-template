"use client";
import { useState } from "react";
import Link from "next/link";
import { CalendarRange, ChevronRight, UserRoundPlus, WalletCards } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { UserAvatar } from "@/components/ui/user-avatar";
import { HrTitle, HrStatus } from "@/features/hr/components/hr-ui";
import { workforce } from "@/features/hr/selectors";
import {
  addDays,
  employedOn,
  isWorkday,
  money,
  payrollTotals,
  today,
  type HrData,
} from "@/features/hr/types";
type Props = { data: HrData; department: string; days: number };
export function CoveragePlanner({ data, department }: Omit<Props, "days">) {
  const dates = Array.from({ length: 9 }, (_, i) => addDays(today, i))
    .filter(isWorkday)
    .slice(0, 7);
  const [selected, setSelected] = useState(today);
  const teams = data.departments.filter((d) => department === "all" || d.id === department);
  const cells = teams.map((team) => ({
    team,
    days: dates.map((date) => {
      const people = data.employees.filter(
        (e) => e.departmentId === team.id && employedOn(e, date),
      );
      const off = people.filter((e) =>
        data.leaves.some(
          (l) =>
            l.employeeId === e.id && l.status === "Approved" && l.start <= date && l.end >= date,
        ),
      ).length;
      return { date, total: people.length, off };
    }),
  }));
  const off = data.employees.filter(
    (e) =>
      employedOn(e, selected) &&
      (department === "all" || e.departmentId === department) &&
      data.leaves.some(
        (l) =>
          l.employeeId === e.id &&
          l.status === "Approved" &&
          l.start <= selected &&
          l.end >= selected,
      ),
  );
  return (
    <Card
      title={<HrTitle icon={CalendarRange}>Team availability planner</HrTitle>}
      action={
        <Link href="/apps/hr/leave" className="text-tiny text-accent">
          Manage leave <ChevronRight size={11} className="inline" />
        </Link>
      }
    >
      <p className="mt-2 text-tiny text-muted">
        Next seven workdays · approved leave only. Select a day for details.
      </p>
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[440px]">
          <div className="grid grid-cols-[130px_repeat(7,minmax(0,1fr))] gap-1">
            <span className="self-end pb-1 text-tiny text-muted">Department</span>
            {dates.map((date) => (
              <span key={date} className="pb-1 text-center text-tiny text-muted">
                {date.slice(8)}
                <span className="block text-[9px]">
                  {new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
                    weekday: "short",
                    timeZone: "UTC",
                  })}
                </span>
              </span>
            ))}
          </div>
          {cells.map(({ team, days }) => (
            <div
              key={team.id}
              className="mt-1 grid grid-cols-[130px_repeat(7,minmax(0,1fr))] items-center gap-1"
            >
              <span className="pr-2 text-tiny">{team.name}</span>
              {days.map((cell) => (
                <button
                  key={cell.date}
                  aria-label={`${team.name}, ${cell.date}: ${cell.off} on leave of ${cell.total}`}
                  aria-pressed={selected === cell.date}
                  onClick={() => setSelected(cell.date)}
                  className={`h-9 rounded-control border text-tiny transition-colors focus-visible:outline-2 focus-visible:outline-accent ${selected === cell.date ? "border-accent" : "border-transparent"} ${cell.off ? "bg-accent/15 text-accent" : "bg-surface-alt text-muted"}`}
                >
                  {cell.off ? `${cell.off} off` : "—"}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
        <div className="flex -space-x-2">
          {off.slice(0, 4).map((e) => (
            <UserAvatar key={e.id} name={e.name} size={24} className="border-2 border-surface" />
          ))}
        </div>
        <p role="status" className="text-tiny text-muted">
          {selected}:{" "}
          {off.length
            ? `${off.map((e) => e.name).join(", ")} on approved leave`
            : "No approved leave in this scope"}
        </p>
      </div>
    </Card>
  );
}
export function PayrollReadiness({ data, department }: Omit<Props, "days">) {
  const periods = [...new Set(data.payroll.map((p) => p.period))].sort().reverse();
  const [period, setPeriod] = useState(periods[0] || "");
  const records = data.payroll.filter(
    (p) =>
      p.period === period &&
      (department === "all" ||
        data.employees.find((e) => e.id === p.employeeId)?.departmentId === department),
  );
  const gross = records.reduce((sum, p) => sum + payrollTotals(p).gross, 0),
    net = records.reduce((sum, p) => sum + payrollTotals(p).net, 0);
  const ready = records.filter((p) => p.status !== "Draft").length,
    percent = records.length ? Math.round((ready / records.length) * 100) : 0;
  return (
    <Card
      title={<HrTitle icon={WalletCards}>Payroll readiness</HrTitle>}
      action={
        <Select
          aria-label="Dashboard payroll period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          {periods.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </Select>
      }
    >
      <div className="mt-4 flex items-center gap-4">
        <div
          className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full"
          style={{ background: `conic-gradient(var(--accent) ${percent}%, var(--border) 0)` }}
        >
          <div className="grid h-20 w-20 place-content-center rounded-full bg-surface text-center">
            <span className="text-[22px] font-semibold">{percent}%</span>
            <span className="text-[9px] text-muted">REVIEWED OR PAID</span>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-tiny text-muted">Captured net payroll</p>
          <p className="mt-1 break-words text-xl font-semibold">{money(net)}</p>
          <p className="mt-1 text-tiny text-muted">
            {ready} of {records.length} records past draft
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 border-y border-border py-3">
        {["Draft", "Reviewed", "Paid"].map((status) => (
          <div key={status}>
            <p className="text-tiny text-muted">{status}</p>
            <p className="mt-1 text-lg font-semibold">
              {records.filter((p) => p.status === status).length}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-tiny text-muted">
        <span>Gross {money(gross)}</span>
        <Link className="text-accent" href="/apps/hr/payroll">
          Review payroll →
        </Link>
      </div>
      <p className="mt-2 text-tiny text-muted">Local demo ledger · no payment is sent.</p>
    </Card>
  );
}
export function NewJoiners({ data, department, days }: Props) {
  const hires = workforce(data, department, days).hires.sort((a, b) =>
    b.joined.localeCompare(a.joined),
  );
  return (
    <Card
      title={<HrTitle icon={UserRoundPlus}>New joiner spotlight</HrTitle>}
      action={
        <Link href="/apps/hr/employees" className="text-tiny text-accent">
          Directory →
        </Link>
      }
    >
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-kpi font-semibold">{hires.length}</span>
        <span className="text-tiny text-muted">joined in the last {days} days</span>
      </div>
      <div className="mt-3 divide-y divide-border">
        {hires.slice(0, 4).map((e) => (
          <div key={e.id} className="flex items-center gap-2 py-3">
            <UserAvatar name={e.name} size={34} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-label font-medium">{e.name}</p>
              <p className="truncate text-tiny text-muted">{e.designation}</p>
              <p className="mt-1 text-tiny text-muted">Joined {e.joined}</p>
            </div>
            <HrStatus status={e.status} />
          </div>
        ))}
        {!hires.length && (
          <p className="py-4 text-label text-muted">No new hires in this reporting period.</p>
        )}
      </div>
    </Card>
  );
}
