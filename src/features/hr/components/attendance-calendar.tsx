"use client";
import { useState, type FormEvent } from "react";
import { CalendarDays, Clock3, History } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { UserAvatar } from "@/components/ui/user-avatar";
import { HrWorkspace } from "./hr-workspace";
import { HrField, HrStatus, HrTitle } from "./hr-ui";
import { TeamCalendar } from "./team-calendar";
import { useHr } from "../hooks/use-hr";
import { saveAttendance } from "../demo-service";
import { attendanceAt } from "../selectors";
import {
  attendanceStatuses,
  datesBetween,
  employedOn,
  isWorkday,
  today,
  workHours,
  type Attendance,
} from "../types";
function AttendanceEditor({
  record,
  name,
  onClose,
}: {
  record: Attendance;
  name: string;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState({ ...record, reason: "" }),
    [error, setError] = useState("");
  const working = ["Present", "Late", "Remote"].includes(draft.status);
  function save(event: FormEvent) {
    event.preventDefault();
    const error = saveAttendance(draft);
    if (error) setError(error);
    else onClose();
  }
  return (
    <form onSubmit={save} className="space-y-3">
      <p className="text-label text-muted">
        {name} · {record.date}
      </p>
      <HrField label="Attendance status">
        <Select
          aria-label="Attendance adjustment status"
          value={draft.status}
          onChange={(e) => setDraft({ ...draft, status: e.target.value as Attendance["status"] })}
        >
          {attendanceStatuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </Select>
      </HrField>
      <div className="grid gap-3 sm:grid-cols-2">
        <HrField label="Clock-in">
          <Input
            type="time"
            disabled={!working}
            required={working}
            value={draft.clockIn}
            onChange={(e) => setDraft({ ...draft, clockIn: e.target.value })}
          />
        </HrField>
        <HrField label="Clock-out">
          <Input
            type="time"
            disabled={!working}
            required={working}
            value={draft.clockOut}
            onChange={(e) => setDraft({ ...draft, clockOut: e.target.value })}
          />
        </HrField>
        <HrField label="Break minutes">
          <Input
            type="number"
            min={0}
            step={1}
            disabled={!working}
            value={draft.breakMinutes}
            onChange={(e) => setDraft({ ...draft, breakMinutes: Number(e.target.value) })}
          />
        </HrField>
      </div>
      <HrField label="Adjustment reason *">
        <Input
          required
          maxLength={200}
          value={draft.reason}
          onChange={(e) => setDraft({ ...draft, reason: e.target.value })}
        />
      </HrField>
      <p className="text-tiny text-muted">
        Same-day shifts only. Approved leave cannot be overwritten. A manual leave attendance mark
        does not book a leave allowance.
      </p>
      {error && (
        <p role="alert" className="text-label text-danger">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save demo attendance</Button>
      </div>
    </form>
  );
}
export function AttendanceCalendar() {
  const { data } = useHr(),
    [date, setDate] = useState(today),
    [month, setMonth] = useState(today.slice(0, 7)),
    [department, setDepartment] = useState("all"),
    [employeeId, setEmployeeId] = useState("all"),
    [history, setHistory] = useState("");
  const [editing, setEditing] = useState<Attendance | null>(null);
  const employees = data.employees.filter(
    (e) =>
      (department === "all" || e.departmentId === department) &&
      (employeeId === "all" || e.id === employeeId) &&
      employedOn(e, date),
  );
  const rows = employees.map((employee) => ({
    employee,
    record: attendanceAt(data, employee, date),
  }));
  const person = data.employees.find((e) => e.id === history),
    historyDates = new Set([
      ...data.attendance.filter((a) => a.employeeId === history).map((a) => a.date),
      ...data.leaves
        .filter((l) => l.employeeId === history && l.status === "Approved")
        .flatMap((l) => datesBetween(l.start, l.end).filter((d) => d <= today && isWorkday(d))),
    ]);
  const historyRows = person
    ? [...historyDates]
        .sort()
        .reverse()
        .flatMap((date) => {
          const record = attendanceAt(data, person, date);
          return record ? [record] : [];
        })
    : [];
  return (
    <HrWorkspace
      title="Attendance"
      description="Calendar-based coverage, timesheets and reasoned local corrections."
      actions={
        <>
          <Input
            aria-label="Attendance date"
            type="date"
            min="2026-01-01"
            max="2026-12-31"
            value={date}
            onChange={(e) => {
              if (e.target.value) {
                setDate(e.target.value);
                setMonth(e.target.value.slice(0, 7));
              }
            }}
          />
          <Select
            aria-label="Attendance department"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setEmployeeId("all");
            }}
          >
            <option value="all">All departments</option>
            {data.departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
        </>
      }
    >
      <Card>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[...attendanceStatuses, "Unmarked"].map((status) => (
            <div key={status}>
              <p className="text-tiny text-muted">{status}</p>
              <p className="mt-1 text-kpi font-semibold">
                {rows.filter((row) => (row.record?.status || "Unmarked") === status).length}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 border-t border-border pt-2 text-tiny text-muted">
          {date} · {employees.length} employed people in scope. Future dates show approved leave or
          unmarked records.
        </p>
      </Card>
      <div className="grid items-start gap-widget xl:grid-cols-[340px_minmax(0,1fr)]">
        <Card title={<HrTitle icon={CalendarDays}>Attendance calendar</HrTitle>}>
          <Input
            aria-label="Attendance month"
            type="month"
            min="2026-01"
            max="2026-12"
            value={month}
            className="my-3 w-full"
            onChange={(e) => {
              if (e.target.value) {
                setMonth(e.target.value);
                setDate(`${e.target.value}-01`);
              }
            }}
          />
          <TeamCalendar
            data={data}
            month={month}
            selected={date}
            onSelect={setDate}
            department={department}
            employeeId={employeeId}
          />
        </Card>
        <Card
          title={<HrTitle icon={Clock3}>Daily timesheet</HrTitle>}
          action={
            <Select
              aria-label="Attendance employee filter"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            >
              <option value="all">All employees</option>
              {data.employees
                .filter((e) => department === "all" || e.departmentId === department)
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
            </Select>
          }
        >
          <div className="[&_table]:min-w-[780px]">
            <DataTable
              label="Attendance"
              rows={rows}
              rowKey={(r) => r.employee.id}
              pageSize={6}
              columns={[
                {
                  key: "employee",
                  label: "Employee",
                  value: (r) => `${r.employee.name} ${r.employee.id}`,
                  render: (r) => (
                    <div className="flex items-center gap-2">
                      <UserAvatar name={r.employee.name} size={28} />
                      <span>
                        {r.employee.name}
                        <small className="mt-1 block text-tiny text-muted">{r.employee.id}</small>
                      </span>
                    </div>
                  ),
                },
                {
                  key: "status",
                  label: "Status",
                  value: (r) => r.record?.status || "Unmarked",
                  render: (r) => <HrStatus status={r.record?.status || "Unmarked"} />,
                },
                { key: "in", label: "Clock-in", value: (r) => r.record?.clockIn || "—" },
                { key: "out", label: "Clock-out", value: (r) => r.record?.clockOut || "—" },
                {
                  key: "hours",
                  label: "Hours",
                  value: (r) => (r.record ? workHours(r.record).hours : 0),
                  render: (r) => (r.record ? workHours(r.record).hours.toFixed(2) : "—"),
                },
                {
                  key: "overtime",
                  label: "Overtime",
                  value: (r) => (r.record ? workHours(r.record).overtime : 0),
                  render: (r) => (r.record ? `${workHours(r.record).overtime.toFixed(2)}h` : "—"),
                },
                {
                  key: "actions",
                  label: "Manage",
                  value: (r) => r.employee.id,
                  render: (r) => (
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={date > today}
                        onClick={() =>
                          setEditing(
                            r.record || {
                              id: "",
                              employeeId: r.employee.id,
                              date,
                              status: "Present",
                              clockIn: "09:00",
                              clockOut: "18:00",
                              breakMinutes: 60,
                              reason: "",
                            },
                          )
                        }
                      >
                        Adjust
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Attendance history for ${r.employee.name}`}
                        onClick={() => setHistory(r.employee.id)}
                      >
                        <History size={13} />
                      </Button>
                    </div>
                  ),
                },
              ]}
            />
          </div>
          <p className="mt-3 text-tiny text-muted">
            Hours = clock-out − clock-in − break. Overtime is the amount over eight hours; this is a
            demo rule, not employment-law logic.
          </p>
        </Card>
      </div>
      <Dialog
        open={!!editing}
        title="Manual attendance adjustment"
        onClose={() => setEditing(null)}
      >
        {editing && (
          <AttendanceEditor
            key={editing.id || editing.employeeId}
            record={editing}
            name={data.employees.find((e) => e.id === editing.employeeId)?.name || "Employee"}
            onClose={() => setEditing(null)}
          />
        )}
      </Dialog>
      <Dialog open={!!person} title="Employee attendance history" onClose={() => setHistory("")}>
        {person && (
          <>
            <p className="text-label font-medium">{person.name}</p>
            <DataTable
              label="Attendance history"
              rows={historyRows}
              rowKey={(r) => r.id}
              columns={[
                { key: "date", label: "Date", value: (r) => r.date },
                {
                  key: "status",
                  label: "Status",
                  value: (r) => r.status,
                  render: (r) => <HrStatus status={r.status} />,
                },
                { key: "hours", label: "Hours", value: (r) => workHours(r).hours },
                { key: "reason", label: "Reason", value: (r) => r.reason },
              ]}
            />
          </>
        )}
      </Dialog>
    </HrWorkspace>
  );
}
