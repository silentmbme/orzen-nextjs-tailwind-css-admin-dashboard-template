import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  UserCheck,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { HrTitle } from "@/features/hr/components/hr-ui";
import { workforce } from "@/features/hr/selectors";
import type { HrData } from "@/features/hr/types";
export function WorkforceOverview({
  data,
  department,
  days,
}: {
  data: HrData;
  department: string;
  days: number;
}) {
  const view = workforce(data, department, days);
  const metrics = [
    {
      label: "Active employees",
      value: view.now.filter((e) => e.status === "Active").length,
      note: "Current employment status",
      icon: UserCheck,
    },
    {
      label: "New hires",
      value: view.hires.length,
      note: `Over the last ${days} days`,
      icon: UserPlus,
    },
    {
      label: "On leave today",
      value: view.onLeave.length,
      note: "Approved or recorded leave",
      icon: CalendarClock,
    },
    {
      label: "Departures",
      value: view.departures.length,
      note: `Over the last ${days} days`,
      icon: ArrowDownRight,
    },
  ];
  return (
    <Card
      title={<HrTitle icon={UsersRound}>Workforce command center</HrTitle>}
      action={
        <span className="flex items-center gap-1.5 text-tiny text-muted">
          <i className="h-1.5 w-1.5 rounded-full bg-success" />
          Current people snapshot
        </span>
      }
    >
      <div className="mt-3 grid gap-3 xl:grid-cols-[0.65fr_2fr]">
        <div className="rounded-control border border-border bg-surface-alt p-4">
          <p className="text-label text-muted">Total current employees</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="text-[24px] font-semibold leading-none">{view.now.length}</span>
            <span
              className={`flex items-center gap-1 text-label font-medium ${view.growth !== null && view.growth < 0 ? "text-danger" : "text-success"}`}
            >
              {view.growth !== null && view.growth < 0 ? (
                <ArrowDownRight size={14} />
              ) : (
                <ArrowUpRight size={14} />
              )}
              {view.growth === null
                ? "New team"
                : `${view.growth >= 0 ? "+" : ""}${view.growth.toFixed(1)}%`}
            </span>
            <span className="text-tiny text-muted">vs. period start</span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex -space-x-2">
              {view.now.slice(0, 5).map((employee) => (
                <UserAvatar
                  key={employee.id}
                  name={employee.name}
                  size={27}
                  className="border-2 border-surface-alt"
                />
              ))}
            </div>
            <span className="text-tiny text-muted">{view.opening.length} at opening</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {metrics.map(({ label, value, note, icon: Icon }) => (
            <div key={label} className="flex flex-col rounded-control border border-border p-3">
              <div className="mb-3 flex items-center justify-between gap-1">
                <span className="text-tiny text-muted">{label}</span>
                <Icon
                  size={14}
                  className="shrink-0 w-8 h-8 p-[0.45rem] border border-border rounded-full"
                />
              </div>
              <p className="text-kpi font-semibold leading-tight">{value}</p>
              <p className="mt-2 text-[10px] text-muted">{note}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-tiny text-muted">
        Opening {view.opening.length} + {view.hires.length} hires − {view.departures.length}{" "}
        departures = {view.now.length} current employees. Includes onboarding and leave.
      </p>
    </Card>
  );
}
