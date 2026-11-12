"use client";
import { Building2 } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { HrTitle } from "@/features/hr/components/hr-ui";
import { currentEmployees, palette } from "@/features/hr/selectors";
import type { HrData } from "@/features/hr/types";
export function DepartmentDistribution({ data, department }: { data: HrData; department: string }) {
  const employees = currentEmployees(data, department);
  const teams = data.departments
    .filter((d) => department === "all" || d.id === department)
    .map((d) => ({
      name: d.name,
      value: employees.filter((e) => e.departmentId === d.id).length,
      color: palette[data.departments.indexOf(d) % palette.length],
    }));
  return (
    <Card title={<HrTitle icon={Building2}>Teams & employment mix</HrTitle>}>
      <div className="relative mx-auto mt-1 h-[145px] w-full max-w-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={teams}
              dataKey="value"
              nameKey="name"
              innerRadius={46}
              outerRadius={63}
              paddingAngle={4}
              stroke="var(--surface)"
              cornerRadius={3}
              isAnimationActive={false}
            >
              {teams.map((t) => (
                <Cell key={t.name} fill={t.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <strong className="text-kpi font-semibold">{employees.length}</strong>
          <span className="text-[10px] text-muted">EMPLOYEES</span>
        </div>
      </div>
      <div className="space-y-2">
        {teams.map((team) => (
          <div key={team.name} className="flex items-center gap-2 text-tiny">
            <i className="h-2 w-2 shrink-0 rounded-sm" style={{ background: team.color }} />
            <span className="min-w-0 flex-1">{team.name}</span>
            <span className="text-muted">
              {employees.length ? Math.round((team.value / employees.length) * 100) : 0}%
            </span>
            <strong className="w-4 text-right font-medium">{team.value}</strong>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3">
        {["Full-time", "Part-time", "Contract"].map((type) => (
          <div key={type}>
            <p className="text-tiny text-muted">{type}</p>
            <p className="mt-1 text-lg font-semibold">
              {employees.filter((e) => e.type === type).length}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
