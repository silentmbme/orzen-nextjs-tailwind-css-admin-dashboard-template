import {
  addDays,
  employedOn,
  isWorkday,
  leaveQuotas,
  today,
  workdays,
  type HrData,
  type Attendance,
  type Employee,
} from "./types";
export const palette = [
  "var(--accent)",
  "var(--color-trend-down)",
  "var(--color-trend-up)",
  "var(--muted)",
];
export const currentEmployees = (data: HrData, department = "all") =>
  data.employees.filter(
    (e) => employedOn(e, today) && (department === "all" || e.departmentId === department),
  );
export function attendanceAt(
  data: HrData,
  employee: Employee,
  date: string,
): Attendance | undefined {
  const record = data.attendance.find((a) => a.employeeId === employee.id && a.date === date);
  if (
    isWorkday(date) &&
    data.leaves.some(
      (l) =>
        l.employeeId === employee.id && l.status === "Approved" && l.start <= date && l.end >= date,
    )
  )
    return {
      id: record?.id || `leave-${employee.id}-${date}`,
      employeeId: employee.id,
      date,
      status: "On leave",
      clockIn: "",
      clockOut: "",
      breakMinutes: 0,
      reason: "Approved leave",
    };
  return record;
}
export function leaveBalance(data: HrData, employeeId: string, type: keyof typeof leaveQuotas) {
  const booked = data.leaves
    .filter(
      (l) =>
        l.employeeId === employeeId &&
        l.type === type &&
        l.status === "Approved" &&
        l.start.startsWith(today.slice(0, 4)),
    )
    .reduce((sum, l) => sum + workdays(l.start, l.end), 0);
  return { quota: leaveQuotas[type], booked, remaining: leaveQuotas[type] - booked };
}
export function workforce(data: HrData, department: string, days: number) {
  const selected = data.employees.filter(
      (e) => department === "all" || e.departmentId === department,
    ),
    start = addDays(today, -days);
  const now = selected.filter((e) => employedOn(e, today)),
    opening = selected.filter((e) => employedOn(e, start));
  return {
    now,
    opening,
    hires: selected.filter((e) => e.joined > start && e.joined <= today),
    departures: selected.filter((e) => e.departed && e.departed > start && e.departed <= today),
    growth: opening.length ? ((now.length - opening.length) / opening.length) * 100 : null,
    onLeave: now.filter((e) => attendanceAt(data, e, today)?.status === "On leave"),
  };
}
export function upcoming(date: string) {
  const year = Number(today.slice(0, 4));
  let next = `${year}-${date.slice(5)}`;
  if (next < today) next = `${year + 1}-${date.slice(5)}`;
  return next;
}
