export const today = "2026-11-02";
export const attendanceStatuses = ["Present", "Absent", "Late", "On leave", "Remote"] as const;
export const candidateStages = ["Applied", "Screening", "Interview", "Offer", "Hired"] as const;
export const leaveQuotas = { Annual: 20, Sick: 10, Personal: 5 } as const;
export type Department = { id: string; name: string };
export type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  designation: string;
  managerId: string;
  joined: string;
  departed: string;
  birthday: string;
  type: "Full-time" | "Part-time" | "Contract";
  status: "Active" | "Onboarding" | "Inactive";
  salary: number;
  location: string;
};
export type Attendance = {
  id: string;
  employeeId: string;
  date: string;
  status: (typeof attendanceStatuses)[number];
  clockIn: string;
  clockOut: string;
  breakMinutes: number;
  reason: string;
};
export type Leave = {
  id: string;
  employeeId: string;
  type: keyof typeof leaveQuotas;
  start: string;
  end: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  decision: string;
  created: string;
};
export type Job = {
  id: string;
  title: string;
  departmentId: string;
  openings: number;
  status: "Open" | "On hold" | "Closed";
  description: string;
  created: string;
};
export type Candidate = {
  id: string;
  name: string;
  email: string;
  jobId: string;
  stage: (typeof candidateStages)[number];
  applied: string;
  source: string;
  notes: string;
};
export type Interview = {
  id: string;
  candidateId: string;
  employeeId: string;
  date: string;
  time: string;
  note: string;
  status: "Scheduled" | "Completed" | "Canceled";
};
export type Payroll = {
  id: string;
  employeeId: string;
  period: string;
  base: number;
  allowances: number;
  deductions: number;
  status: "Draft" | "Reviewed" | "Paid";
  paidOn: string;
};
export type Activity = {
  id: string;
  date: string;
  employeeId: string;
  candidateId: string;
  message: string;
  kind: "Employee" | "Attendance" | "Leave" | "Hiring" | "Payroll" | "Task";
};
export type HrTask = {
  id: string;
  title: string;
  due: string;
  departmentId: string;
  completed: boolean;
};
export type HrData = {
  departments: Department[];
  employees: Employee[];
  attendance: Attendance[];
  leaves: Leave[];
  jobs: Job[];
  candidates: Candidate[];
  interviews: Interview[];
  payroll: Payroll[];
  activity: Activity[];
  tasks: HrTask[];
};
export const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
export const round = (value: number) => Math.round(value * 100) / 100;
export const addDays = (date: string, days: number) =>
  new Date(Date.parse(date) + days * 86400000).toISOString().slice(0, 10);
export const age = (date: string) => Math.floor((Date.parse(today) - Date.parse(date)) / 86400000);
export const isWorkday = (date: string) =>
  ![0, 6].includes(new Date(`${date}T12:00:00Z`).getUTCDay());
export function datesBetween(start: string, end: string) {
  const days = Math.round((Date.parse(end) - Date.parse(start)) / 86400000);
  if (!Number.isFinite(days) || days < 0 || days > 366) return [];
  return Array.from({ length: days + 1 }, (_, i) => addDays(start, i));
}
export const workdays = (start: string, end: string) =>
  datesBetween(start, end).filter(isWorkday).length;
export const employedOn = (employee: Employee, date: string) =>
  employee.joined <= date && (!employee.departed || employee.departed > date);
export const payrollTotals = (record: Payroll) => ({
  gross: round(record.base + record.allowances),
  net: round(record.base + record.allowances - record.deductions),
});
export function workHours(record: Attendance) {
  if (!["Present", "Late", "Remote"].includes(record.status) || !record.clockIn || !record.clockOut)
    return { hours: 0, overtime: 0 };
  const minutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };
  const hours = Math.max(
    0,
    (minutes(record.clockOut) - minutes(record.clockIn) - record.breakMinutes) / 60,
  );
  return { hours: round(hours), overtime: round(Math.max(0, hours - 8)) };
}
