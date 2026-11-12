"use client";
import { Building2, CalendarClock, UserRound } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { HrStatus, HrTitle } from "./hr-ui";
import { useHr } from "../hooks/use-hr";
import { leaveBalance } from "../selectors";
import { leaveQuotas, money } from "../types";
export function EmployeeDetails({
  id,
  onClose,
  onEdit,
}: {
  id: string;
  onClose: () => void;
  onEdit: () => void;
}) {
  const { data } = useHr(),
    employee = data.employees.find((e) => e.id === id);
  return (
    <Dialog open title="Employee profile" onClose={onClose}>
      {employee ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <UserAvatar name={employee.name} size={48} />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{employee.name}</p>
              <p className="mt-1 text-label text-muted">{employee.designation}</p>
              <p className="mt-1 text-tiny text-muted">{employee.id}</p>
            </div>
            <HrStatus status={employee.status} />
          </div>
          <Card title={<HrTitle icon={UserRound}>Contact & employment</HrTitle>}>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-label">
              {[
                ["Email", employee.email],
                ["Phone", employee.phone || "Not supplied"],
                ["Joined", employee.joined],
                ["Employment type", employee.type],
                ["Birthday", employee.birthday],
                ["Location", employee.location],
                [
                  "Manager",
                  data.employees.find((e) => e.id === employee.managerId)?.name || "Not assigned",
                ],
                [
                  "Department",
                  data.departments.find((d) => d.id === employee.departmentId)?.name || "Unknown",
                ],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-tiny text-muted">{label}</dt>
                  <dd className="mt-1 break-words">{value}</dd>
                </div>
              ))}
            </dl>
            {employee.departed && (
              <p className="mt-3 text-label text-muted">Departed {employee.departed}</p>
            )}
          </Card>
          <Card title={<HrTitle icon={CalendarClock}>2026 leave balances</HrTitle>}>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(Object.keys(leaveQuotas) as (keyof typeof leaveQuotas)[]).map((type) => {
                const balance = leaveBalance(data, id, type);
                return (
                  <div key={type}>
                    <p className="text-tiny text-muted">{type}</p>
                    <strong className="mt-1 block text-lg font-semibold">
                      {balance.remaining}
                      <span className="text-tiny font-normal text-muted"> / {balance.quota}</span>
                    </strong>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-tiny text-muted">
              Demo weekday allowances; only approved requests reduce balances.
            </p>
          </Card>
          <Card title={<HrTitle icon={Building2}>Compensation snapshot</HrTitle>}>
            <p className="mt-3 text-lg font-semibold">
              {money(employee.salary)}
              <span className="ml-1 text-tiny font-normal text-muted">fictional monthly base</span>
            </p>
            <p className="mt-2 text-tiny text-muted">
              Existing payroll records retain their captured amounts.
            </p>
          </Card>
          <div className="flex justify-end">
            <Button onClick={onEdit}>Edit employee</Button>
          </div>
        </div>
      ) : (
        <p className="text-muted">Employee unavailable.</p>
      )}
    </Dialog>
  );
}
