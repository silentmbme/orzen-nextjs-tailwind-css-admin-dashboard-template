import { seed } from "./seed";
import { attendanceAt, leaveBalance } from "./selectors";
import { employeeError, validHrData } from "./schemas/validation";
import {
  candidateStages,
  datesBetween,
  employedOn,
  leaveQuotas,
  today,
  workdays,
  workHours,
  type Attendance,
  type Candidate,
  type Employee,
  type HrData,
  type Interview,
  type Job,
  type Leave,
  type Payroll,
} from "./types";
const key = "nova-hr-demo-v1",
  initial = { data: seed, warning: "" };
let snapshot = initial,
  initialized = false;
const listeners = new Set<() => void>(),
  notify = () => listeners.forEach((listener) => listener());
function load() {
  try {
    const raw = localStorage.getItem(key),
      value: unknown = raw ? JSON.parse(raw) : structuredClone(seed);
    if (!validHrData(value)) throw new Error();
    snapshot = { data: value, warning: "" };
  } catch {
    snapshot = {
      data: structuredClone(seed),
      warning:
        "Saved HR data could not be loaded. Showing the original demo; the next save replaces it.",
    };
  }
}
export const hrStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    if (!initialized) {
      initialized = true;
      load();
      queueMicrotask(notify);
      window.addEventListener("storage", (event) => {
        if (event.key === key) {
          load();
          notify();
        }
      });
    }
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => snapshot,
  getServerSnapshot: () => initial,
  update(change: (data: HrData) => void) {
    try {
      const data = structuredClone(snapshot.data);
      change(data);
      if (!validHrData(data)) throw new Error("This change contains invalid HR demo records.");
      let warning = "";
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch {
        warning =
          "Storage is unavailable or full. Changes are kept in memory for this session only.";
      }
      snapshot = { data, warning };
      notify();
      return "";
    } catch (error) {
      return error instanceof Error ? error.message : "The change could not be saved.";
    }
  },
};
function audit(
  data: HrData,
  kind: HrData["activity"][number]["kind"],
  message: string,
  employeeId = "",
  candidateId = "",
) {
  data.activity.unshift({
    id: crypto.randomUUID(),
    date: today,
    kind,
    message,
    employeeId,
    candidateId,
  });
}
export function saveEmployee(input: Employee) {
  return hrStore.update((data) => {
    const invalid = employeeError(input, data);
    if (invalid) throw new Error(invalid);
    const saved = {
      ...input,
      id: input.id || `EMP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      name: input.name.trim(),
      email: input.email.trim(),
      departed: input.status === "Inactive" ? input.departed : "",
    };
    if (
      saved.departed &&
      data.leaves.some(
        (l) => l.employeeId === saved.id && l.status === "Approved" && l.end >= saved.departed,
      )
    )
      throw new Error(
        "Resolve approved leave on or after departure before deactivating this employee.",
      );
    const index = data.employees.findIndex((e) => e.id === saved.id);
    if (index >= 0) data.employees[index] = saved;
    else data.employees.unshift(saved);
    audit(
      data,
      "Employee",
      `${saved.name}: employee profile ${index >= 0 ? "updated" : "created"}.`,
      saved.id,
    );
  });
}
export function employeeReferenced(data: HrData, id: string) {
  return (
    [...data.attendance, ...data.leaves, ...data.payroll, ...data.interviews].some(
      (row) => row.employeeId === id,
    ) || data.employees.some((e) => e.managerId === id)
  );
}
export function deleteEmployee(id: string) {
  return hrStore.update((data) => {
    if (employeeReferenced(data, id))
      throw new Error(
        "Referenced employees cannot be deleted. Set an appropriate inactive/departure status instead.",
      );
    data.employees = data.employees.filter((e) => e.id !== id);
    data.activity = data.activity.filter((a) => a.employeeId !== id);
  });
}
export function saveAttendance(input: Attendance) {
  return hrStore.update((data) => {
    const employee = data.employees.find((e) => e.id === input.employeeId);
    if (!employee || !employedOn(employee, input.date) || input.date > today)
      throw new Error("Adjust attendance only for an employed person on or before the demo date.");
    if (!input.reason.trim()) throw new Error("An adjustment reason is required.");
    if (
      attendanceAt(data, employee, input.date)?.status === "On leave" &&
      data.leaves.some(
        (l) =>
          l.employeeId === employee.id &&
          l.status === "Approved" &&
          l.start <= input.date &&
          l.end >= input.date,
      ) &&
      input.status !== "On leave"
    )
      throw new Error("Approved leave cannot be overwritten by a working attendance status.");
    const working = ["Present", "Late", "Remote"].includes(input.status);
    if (
      working &&
      (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.clockIn) ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.clockOut) ||
        input.clockOut <= input.clockIn ||
        !Number.isInteger(input.breakMinutes) ||
        input.breakMinutes < 0 ||
        !workHours(input).hours)
    )
      throw new Error("Enter valid same-day clock times and a break shorter than the shift.");
    const saved = {
      ...input,
      id:
        data.attendance.find((a) => a.employeeId === input.employeeId && a.date === input.date)
          ?.id || crypto.randomUUID(),
      clockIn: working ? input.clockIn : "",
      clockOut: working ? input.clockOut : "",
      breakMinutes: working ? input.breakMinutes : 0,
      reason: input.reason.trim(),
    };
    const index = data.attendance.findIndex((a) => a.id === saved.id);
    if (index >= 0) data.attendance[index] = saved;
    else data.attendance.unshift(saved);
    audit(
      data,
      "Attendance",
      `${employee.name}: ${input.date} attendance adjusted to ${input.status}. ${input.reason.trim()}`,
      employee.id,
    );
  });
}
export function requestLeave(input: Leave) {
  return hrStore.update((data) => {
    const employee = data.employees.find((e) => e.id === input.employeeId);
    if (!employee || employee.status === "Inactive" || input.start < employee.joined)
      throw new Error("Select a currently employed person and dates after joining.");
    if (
      !datesBetween(input.start, input.end).length ||
      !workdays(input.start, input.end) ||
      !input.start.startsWith("2026-") ||
      !input.end.startsWith("2026-")
    )
      throw new Error("Choose an ordered 2026 date range containing at least one weekday.");
    if (!input.reason.trim() || !(input.type in leaveQuotas))
      throw new Error("Choose a leave type and enter a reason.");
    if (
      data.leaves.some(
        (l) =>
          l.employeeId === input.employeeId &&
          l.status !== "Rejected" &&
          l.start <= input.end &&
          l.end >= input.start,
      )
    )
      throw new Error("These dates overlap an existing pending or approved request.");
    if (
      workdays(input.start, input.end) > leaveBalance(data, input.employeeId, input.type).remaining
    )
      throw new Error("Requested weekdays exceed the remaining demo balance.");
    data.leaves.unshift({
      ...input,
      id: crypto.randomUUID(),
      status: "Pending",
      decision: "",
      created: today,
    });
    audit(
      data,
      "Leave",
      `${employee.name}: ${input.type.toLowerCase()} leave requested.`,
      employee.id,
    );
  });
}
export function decideLeave(id: string, status: "Approved" | "Rejected", reason: string) {
  return hrStore.update((data) => {
    const leave = data.leaves.find((l) => l.id === id);
    if (!leave || leave.status !== "Pending")
      throw new Error("Only pending requests can be decided.");
    if (!reason.trim()) throw new Error("Enter a decision note.");
    if (
      status === "Approved" &&
      !data.employees.some(
        (e) => e.id === leave.employeeId && employedOn(e, leave.start) && employedOn(e, leave.end),
      )
    )
      throw new Error("Leave must fall within employment dates.");
    if (
      status === "Approved" &&
      workdays(leave.start, leave.end) > leaveBalance(data, leave.employeeId, leave.type).remaining
    )
      throw new Error("The remaining balance is insufficient for approval.");
    leave.status = status;
    leave.decision = reason.trim();
    audit(
      data,
      "Leave",
      `${leave.type} leave ${status.toLowerCase()}: ${reason.trim()}`,
      leave.employeeId,
    );
  });
}
export function saveJob(input: Job) {
  return hrStore.update((data) => {
    if (
      !input.title.trim() ||
      !input.description.trim() ||
      !data.departments.some((d) => d.id === input.departmentId) ||
      !Number.isInteger(input.openings) ||
      input.openings < 1
    )
      throw new Error("Enter a title, description, department and positive whole opening count.");
    const hired = data.candidates.filter((c) => c.jobId === input.id && c.stage === "Hired").length;
    if (input.openings < hired || (input.status === "Open" && hired >= input.openings))
      throw new Error("Openings must exceed hired candidates to keep this position open.");
    const saved = {
        ...input,
        id: input.id || crypto.randomUUID(),
        created: input.id ? input.created : today,
      },
      index = data.jobs.findIndex((j) => j.id === saved.id);
    if (index < 0) data.jobs.unshift(saved);
    else data.jobs[index] = saved;
    audit(data, "Hiring", `${saved.title}: position ${index < 0 ? "created" : "updated"}.`);
  });
}
export function addCandidate(input: Candidate) {
  return hrStore.update((data) => {
    const job = data.jobs.find((j) => j.id === input.jobId);
    if (
      !job ||
      job.status !== "Open" ||
      !input.name.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) ||
      data.candidates.some(
        (c) => c.jobId === input.jobId && c.email.toLowerCase() === input.email.toLowerCase(),
      )
    )
      throw new Error("Enter a name, unique applicant email and an open position.");
    const id = crypto.randomUUID();
    data.candidates.unshift({ ...input, id, stage: "Applied", applied: today });
    audit(data, "Hiring", `${input.name} applied for ${job.title}.`, "", id);
  });
}
export function moveCandidate(id: string, stage: Candidate["stage"]) {
  return hrStore.update((data) => {
    const candidate = data.candidates.find((c) => c.id === id);
    if (!candidate) throw new Error("Candidate not found.");
    const current = candidateStages.indexOf(candidate.stage),
      next = candidateStages.indexOf(stage);
    if (current === 4 || Math.abs(next - current) !== 1)
      throw new Error("Move one stage at a time. Hired candidates are final.");
    const job = data.jobs.find((j) => j.id === candidate.jobId)!;
    if (job.status !== "Open") throw new Error("Reopen this position before moving candidates.");
    candidate.stage = stage;
    if (
      stage === "Hired" &&
      data.candidates.filter((c) => c.jobId === job.id && c.stage === "Hired").length >=
        job.openings
    )
      job.status = "Closed";
    audit(data, "Hiring", `${candidate.name} moved to ${stage}.`, "", id);
  });
}
export function scheduleInterview(input: Interview) {
  return hrStore.update((data) => {
    const candidate = data.candidates.find((c) => c.id === input.candidateId),
      employee = data.employees.find((e) => e.id === input.employeeId);
    if (
      !candidate ||
      !["Screening", "Interview"].includes(candidate.stage) ||
      !employee ||
      employee.status === "Inactive" ||
      input.date < today ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time)
    )
      throw new Error(
        "Choose a screened/interview candidate, active interviewer and valid future date/time.",
      );
    if (data.jobs.find((j) => j.id === candidate.jobId)?.status !== "Open")
      throw new Error("Interviews require an open position.");
    if (
      data.interviews.some(
        (i) =>
          i.status === "Scheduled" &&
          i.date === input.date &&
          i.time === input.time &&
          (i.employeeId === input.employeeId || i.candidateId === input.candidateId),
      )
    )
      throw new Error("This interviewer or candidate already has an interview at that time.");
    if (candidate.stage === "Screening") candidate.stage = "Interview";
    data.interviews.unshift({ ...input, id: crypto.randomUUID(), status: "Scheduled" });
    audit(
      data,
      "Hiring",
      `${candidate.name}: interview scheduled for ${input.date} ${input.time}. No invitation was sent.`,
      "",
      candidate.id,
    );
  });
}
export function updatePayroll(id: string, status: Payroll["status"]) {
  return hrStore.update((data) => {
    const record = data.payroll.find((p) => p.id === id);
    if (
      !record ||
      !(
        (record.status === "Draft" && status === "Reviewed") ||
        (record.status === "Reviewed" && status === "Paid")
      )
    )
      throw new Error("Payroll must move from Draft to Reviewed to Paid.");
    record.status = status;
    record.paidOn = status === "Paid" ? today : "";
    audit(
      data,
      "Payroll",
      `${record.period}: payroll marked ${status.toLowerCase()} in demo. No bank instruction was sent.`,
      record.employeeId,
    );
  });
}
export function exportCsv(name: string, rows: Record<string, string | number>[]) {
  const keys = Object.keys(rows[0] || {}),
    quote = (v: unknown) =>
      `"${(typeof v === "number" ? String(v) : String(v ?? "").replace(/^[=+@-]/, "'$&")).replaceAll('"', '""')}"`;
  const url = URL.createObjectURL(
    new Blob(
      [
        [keys, ...rows.map((r) => keys.map((k) => r[k]))]
          .map((row) => row.map(quote).join(","))
          .join("\r\n"),
      ],
      { type: "text/csv;charset=utf-8" },
    ),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}-demo.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
