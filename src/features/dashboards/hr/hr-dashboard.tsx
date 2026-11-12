"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { HrWorkspace } from "@/features/hr/components/hr-workspace";
import { EmployeeForm } from "@/features/hr/components/employee-form";
import { useHr } from "@/features/hr/hooks/use-hr";
import { WorkforceOverview } from "./components/workforce-overview";
import { AttendanceOverview } from "./components/attendance-overview";
import { DepartmentDistribution } from "./components/department-distribution";
import { LeaveApprovals } from "./components/leave-approvals";
import { RecruitmentSummary } from "./components/recruitment-summary";
import { PeopleActivity } from "./components/people-activity";
import { WorkforceTrend } from "./components/workforce-trend";
import { CoveragePlanner, PayrollReadiness, NewJoiners } from "./components/operations-insights";
export function HrDashboard() {
  const { data } = useHr(),
    [department, setDepartment] = useState("all"),
    [period, setPeriod] = useState("30"),
    [adding, setAdding] = useState(false);
  return (
    <HrWorkspace
      title="People operations"
      description="Your workforce, daily coverage and next people decisions."
      actions={
        <>
          <Select
            aria-label="HR department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="all">All departments</option>
            {data.departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
          <Select
            aria-label="HR reporting period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {[7, 30, 90].map((n) => (
              <option key={n} value={n}>
                Last {n} days
              </option>
            ))}
          </Select>
          <Link href="/apps/hr/leave" className="ui-button ui-button--outline">
            Leave approvals
          </Link>
          <Button variant="dark" onClick={() => setAdding(true)}>
            <Plus size={13} />
            Add employee
          </Button>
        </>
      }
    >
      <WorkforceOverview data={data} department={department} days={Number(period)} />
      <div className="grid items-stretch gap-widget xl:grid-cols-[minmax(0,1fr)_310px]">
        <AttendanceOverview data={data} department={department} />
        <DepartmentDistribution data={data} department={department} />
      </div>
      <div className="grid items-start gap-widget lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <LeaveApprovals data={data} department={department} days={Number(period)} />
        <RecruitmentSummary data={data} department={department} days={Number(period)} />
      </div>
      <div className="grid items-stretch gap-widget lg:grid-cols-2">
        <WorkforceTrend data={data} department={department} days={Number(period)} />
        <CoveragePlanner data={data} department={department} />
      </div>
      <div className="grid items-stretch gap-widget lg:grid-cols-2">
        <PayrollReadiness data={data} department={department} />
        <NewJoiners data={data} department={department} days={Number(period)} />
      </div>
      <PeopleActivity department={department} days={Number(period)} />
      <Dialog open={adding} title="Add demo employee" onClose={() => setAdding(false)}>
        {adding && <EmployeeForm onClose={() => setAdding(false)} />}
      </Dialog>
    </HrWorkspace>
  );
}
