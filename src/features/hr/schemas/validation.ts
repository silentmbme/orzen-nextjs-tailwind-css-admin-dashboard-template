import {
  attendanceStatuses,
  candidateStages,
  leaveQuotas,
  type HrData,
  type Employee,
} from "../types";
type Row = Record<string, unknown>;
const text = (value: unknown): value is string => typeof value === "string";
const number = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;
const date = (value: unknown) =>
  text(value) && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value));
const fields = (row: Row, keys: string[]) => keys.every((key) => text(row[key]));
const one = (value: unknown, choices: readonly string[]) => text(value) && choices.includes(value);
const array = (value: unknown, check: (row: Row) => boolean) =>
  Array.isArray(value) &&
  value.every((row) => row && typeof row === "object" && check(row)) &&
  new Set(value.map((row) => row.id)).size === value.length;
export function validHrData(value: unknown): value is HrData {
  if (!value || typeof value !== "object") return false;
  const d = value as Record<string, unknown>;
  if (!array(d.departments, (r) => fields(r, ["id", "name"]))) return false;
  if (
    !array(
      d.employees,
      (r) =>
        fields(r, [
          "id",
          "name",
          "email",
          "phone",
          "departmentId",
          "designation",
          "managerId",
          "location",
          "departed",
        ]) &&
        date(r.joined) &&
        date(r.birthday) &&
        (!r.departed || date(r.departed)) &&
        number(r.salary) &&
        one(r.status, ["Active", "Onboarding", "Inactive"]) &&
        one(r.type, ["Full-time", "Part-time", "Contract"]),
    )
  )
    return false;
  if (
    !array(
      d.attendance,
      (r) =>
        fields(r, ["id", "employeeId", "clockIn", "clockOut", "reason"]) &&
        date(r.date) &&
        one(r.status, attendanceStatuses) &&
        number(r.breakMinutes),
    )
  )
    return false;
  if (
    !array(
      d.leaves,
      (r) =>
        fields(r, ["id", "employeeId", "reason", "decision"]) &&
        date(r.start) &&
        date(r.end) &&
        date(r.created) &&
        one(r.type, Object.keys(leaveQuotas)) &&
        one(r.status, ["Pending", "Approved", "Rejected"]),
    )
  )
    return false;
  if (
    !array(
      d.jobs,
      (r) =>
        fields(r, ["id", "title", "departmentId", "description"]) &&
        date(r.created) &&
        number(r.openings) &&
        Number.isInteger(r.openings) &&
        r.openings > 0 &&
        one(r.status, ["Open", "On hold", "Closed"]),
    )
  )
    return false;
  if (
    !array(
      d.candidates,
      (r) =>
        fields(r, ["id", "name", "email", "jobId", "source", "notes"]) &&
        date(r.applied) &&
        one(r.stage, candidateStages),
    )
  )
    return false;
  if (
    !array(
      d.interviews,
      (r) =>
        fields(r, ["id", "candidateId", "employeeId", "time", "note"]) &&
        date(r.date) &&
        one(r.status, ["Scheduled", "Completed", "Canceled"]),
    )
  )
    return false;
  if (
    !array(
      d.payroll,
      (r) =>
        fields(r, ["id", "employeeId", "period", "paidOn"]) &&
        /^\d{4}-\d{2}$/.test(String(r.period)) &&
        [r.base, r.allowances, r.deductions].every(number) &&
        Number(r.deductions) <= Number(r.base) + Number(r.allowances) &&
        one(r.status, ["Draft", "Reviewed", "Paid"]),
    )
  )
    return false;
  if (
    !array(
      d.activity,
      (r) =>
        fields(r, ["id", "employeeId", "candidateId", "message"]) &&
        date(r.date) &&
        one(r.kind, ["Employee", "Attendance", "Leave", "Hiring", "Payroll", "Task"]),
    )
  )
    return false;
  if (
    !array(
      d.tasks,
      (r) =>
        fields(r, ["id", "title", "departmentId"]) &&
        date(r.due) &&
        typeof r.completed === "boolean",
    )
  )
    return false;
  const data = value as HrData,
    employee = (id: string) => data.employees.some((e) => e.id === id),
    department = (id: string) => data.departments.some((d) => d.id === id),
    candidate = (id: string) => data.candidates.some((c) => c.id === id);
  return (
    data.employees.every(
      (e) =>
        department(e.departmentId) &&
        (!e.managerId || (employee(e.managerId) && e.managerId !== e.id)),
    ) &&
    [...data.attendance, ...data.leaves, ...data.payroll].every((r) => employee(r.employeeId)) &&
    data.jobs.every((j) => department(j.departmentId)) &&
    data.candidates.every((c) => data.jobs.some((j) => j.id === c.jobId)) &&
    data.interviews.every((i) => candidate(i.candidateId) && employee(i.employeeId)) &&
    data.activity.every(
      (a) =>
        (!a.employeeId || employee(a.employeeId)) && (!a.candidateId || candidate(a.candidateId)),
    ) &&
    data.tasks.every((t) => department(t.departmentId))
  );
}
export function employeeError(input: Employee, data: HrData) {
  if (!input.name.trim() || !input.designation.trim() || !input.location.trim())
    return "Name, designation and location are required.";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) ||
    data.employees.some(
      (e) => e.id !== input.id && e.email.toLowerCase() === input.email.toLowerCase(),
    )
  )
    return "Enter a valid, unique employee email.";
  if (!data.departments.some((d) => d.id === input.departmentId))
    return "Select a valid department.";
  if (
    !date(input.joined) ||
    !date(input.birthday) ||
    input.birthday >= input.joined ||
    input.joined > "2026-11-02"
  )
    return "Enter a valid birthday before joining, and a joining date no later than the demo date.";
  if (!number(input.salary) || input.salary <= 0)
    return "Enter a positive fictional monthly salary.";
  if (
    input.status === "Inactive" &&
    (!date(input.departed) || input.departed < input.joined || input.departed > "2026-11-02")
  )
    return "Inactive employees require a departure date between joining and the demo date.";
  const seen = new Set([input.id]);
  let manager = input.managerId;
  while (manager) {
    if (seen.has(manager)) return "Manager assignments cannot form a cycle.";
    seen.add(manager);
    const person = data.employees.find((e) => e.id === manager);
    if (!person) return "Select a valid manager.";
    manager = person.managerId;
  }
  return "";
}
