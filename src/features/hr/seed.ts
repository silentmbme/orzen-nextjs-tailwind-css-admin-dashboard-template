import {
  addDays,
  employedOn,
  isWorkday,
  round,
  today,
  type HrData,
  type Employee,
  type Attendance,
  type Candidate,
} from "./types";
const departments = [
  { id: "engineering", name: "Engineering" },
  { id: "people", name: "People & Operations" },
  { id: "product", name: "Product & Design" },
  { id: "sales", name: "Sales & Success" },
];
const names = [
  "Alex Morgan",
  "Priya Shah",
  "Daniel Kim",
  "Sofia Garcia",
  "Olivia Martin",
  "Jackson Lee",
  "Emma Davis",
  "Noah Williams",
  "Ava Taylor",
  "Lucas Clark",
  "Mia Anderson",
  "Ethan Thomas",
];
const employees: Employee[] = names.map((name, i) => ({
  id: `EMP-${String(101 + i)}`,
  name,
  email: `${name.toLowerCase().replaceAll(" ", ".")}@example.com`,
  phone: `+1 555 010 ${String(100 + i)}`,
  departmentId: departments[i % 4].id,
  designation:
    i < 4
      ? ["Engineering Lead", "People Lead", "Product Lead", "Sales Lead"][i]
      : ["Frontend Engineer", "People Specialist", "Product Designer", "Account Manager"][i % 4],
  managerId: i < 4 ? "" : `EMP-${101 + (i % 4)}`,
  joined:
    i === 10
      ? "2026-10-20"
      : i === 11
        ? "2026-11-01"
        : i === 0
          ? "2021-11-08"
          : `202${2 + (i % 3)}-${String(2 + (i % 8)).padStart(2, "0")}-12`,
  departed: i === 9 ? "2026-10-28" : "",
  birthday: `199${i % 7}-${i < 3 ? "11" : "07"}-${String(i < 3 ? 5 + i * 5 : 10 + i).padStart(2, "0")}`,
  type: i === 8 ? "Contract" : i === 6 ? "Part-time" : "Full-time",
  status: i === 9 ? "Inactive" : i === 11 ? "Onboarding" : "Active",
  salary: 4500 + (i % 4) * 850 + (i < 4 ? 1800 : 0),
  location: ["New York", "London", "Singapore"][i % 3],
}));
const leaves: HrData["leaves"] = [
  {
    id: "LV-101",
    employeeId: "EMP-108",
    type: "Annual",
    start: "2026-11-02",
    end: "2026-11-04",
    reason: "Family time",
    status: "Approved",
    decision: "Approved in demo",
    created: "2026-10-25",
  },
  {
    id: "LV-102",
    employeeId: "EMP-105",
    type: "Annual",
    start: "2026-11-05",
    end: "2026-11-06",
    reason: "Personal travel",
    status: "Pending",
    decision: "",
    created: "2026-10-30",
  },
  {
    id: "LV-103",
    employeeId: "EMP-106",
    type: "Sick",
    start: "2026-11-02",
    end: "2026-11-02",
    reason: "Recovery day",
    status: "Pending",
    decision: "",
    created: today,
  },
  {
    id: "LV-104",
    employeeId: "EMP-107",
    type: "Sick",
    start: "2026-10-15",
    end: "2026-10-16",
    reason: "Medical appointment",
    status: "Approved",
    decision: "Approved in demo",
    created: "2026-10-12",
  },
  {
    id: "LV-105",
    employeeId: "EMP-109",
    type: "Personal",
    start: "2026-10-22",
    end: "2026-10-22",
    reason: "Personal errand",
    status: "Rejected",
    decision: "Coverage unavailable for this date",
    created: "2026-10-19",
  },
];
const attendance: Attendance[] = [];
for (let day = 0; day < 33; day++) {
  const date = addDays(today, -day);
  if (!isWorkday(date)) continue;
  employees
    .filter((e) => employedOn(e, date))
    .forEach((employee, i) => {
      const leave = leaves.some(
        (l) =>
          l.employeeId === employee.id &&
          l.status === "Approved" &&
          l.start <= date &&
          l.end >= date,
      );
      const status: Attendance["status"] = leave
        ? "On leave"
        : (day + i) % 13 === 1
          ? "Absent"
          : (day + i) % 7 === 2
            ? "Late"
            : (day + i) % 5 === 3
              ? "Remote"
              : "Present";
      const working = ["Present", "Late", "Remote"].includes(status);
      attendance.push({
        id: `ATT-${employee.id}-${date}`,
        employeeId: employee.id,
        date,
        status,
        clockIn: working ? (status === "Late" ? "09:35" : "09:00") : "",
        clockOut: working ? (i % 4 === 0 ? "19:00" : "18:00") : "",
        breakMinutes: working ? 60 : 0,
        reason: leave ? "Approved leave" : "Seeded demo timesheet",
      });
    });
}
const jobs: HrData["jobs"] = [
  {
    id: "JOB-101",
    title: "Senior Frontend Engineer",
    departmentId: "engineering",
    openings: 2,
    status: "Open",
    description: "Build accessible interfaces and shared product systems.",
    created: "2026-10-01",
  },
  {
    id: "JOB-102",
    title: "People Operations Specialist",
    departmentId: "people",
    openings: 2,
    status: "Open",
    description: "Support a consistent employee experience.",
    created: "2026-10-05",
  },
  {
    id: "JOB-103",
    title: "Product Designer",
    departmentId: "product",
    openings: 1,
    status: "Open",
    description: "Shape clear workflows for growing teams.",
    created: "2026-10-10",
  },
  {
    id: "JOB-104",
    title: "Customer Success Manager",
    departmentId: "sales",
    openings: 1,
    status: "On hold",
    description: "Guide customer outcomes and onboarding.",
    created: "2026-10-15",
  },
];
const candidateNames = [
  "Liam Wilson",
  "Isabella Moore",
  "James White",
  "Amelia Lewis",
  "Oliver Hall",
  "Charlotte Young",
  "Benjamin Allen",
  "Harper King",
  "Elijah Wright",
  "Evelyn Scott",
];
const stages: Candidate["stage"][] = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
  "Applied",
  "Screening",
  "Interview",
  "Applied",
  "Offer",
];
const candidates: Candidate[] = candidateNames.map((name, i) => ({
  id: `CAN-${101 + i}`,
  name,
  email: `${name.toLowerCase().replaceAll(" ", ".")}@example.com`,
  jobId: jobs[i % 3].id,
  stage: stages[i],
  applied: addDays(today, -(i + 2)),
  source: ["Careers page", "Referral", "Job board"][i % 3],
  notes: i === 3 ? "Strong collaboration examples from the portfolio review." : "",
}));
const interviews: HrData["interviews"] = candidates
  .filter((c) => c.stage === "Interview")
  .map((candidate, i) => ({
    id: `INT-${101 + i}`,
    candidateId: candidate.id,
    employeeId: employees[i].id,
    date: addDays(today, i + 1),
    time: "10:00",
    note: "Demo team conversation",
    status: "Scheduled",
  }));
const payroll: HrData["payroll"] = [];
for (const period of ["2026-09", "2026-10", "2026-11"])
  for (const employee of employees) {
    const end = new Date(Date.UTC(2026, Number(period.slice(5)), 0)).toISOString().slice(0, 10);
    if (employee.joined > end || (employee.departed && employee.departed < `${period}-01`))
      continue;
    const status =
      period === "2026-09"
        ? "Paid"
        : period === "2026-10"
          ? Number(employee.id.slice(-1)) % 3
            ? "Paid"
            : "Reviewed"
          : "Draft";
    payroll.push({
      id: `PAY-${employee.id}-${period}`,
      employeeId: employee.id,
      period,
      base: employee.salary,
      allowances: 250,
      deductions: round(employee.salary * 0.1),
      status,
      paidOn: status === "Paid" ? end : "",
    });
  }
export const seed: HrData = {
  departments,
  employees,
  attendance,
  leaves,
  jobs,
  candidates,
  interviews,
  payroll,
  activity: [
    {
      id: "act-1",
      date: "2026-11-01",
      employeeId: "EMP-112",
      candidateId: "",
      kind: "Employee",
      message: "Ethan Thomas joined the Sales & Success team.",
    },
    {
      id: "act-2",
      date: "2026-10-28",
      employeeId: "EMP-110",
      candidateId: "",
      kind: "Employee",
      message: "Lucas Clark completed the offboarding process.",
    },
    {
      id: "act-3",
      date: "2026-10-30",
      employeeId: "",
      candidateId: "CAN-105",
      kind: "Hiring",
      message: "Oliver Hall moved to Hired for People Operations.",
    },
  ],
  tasks: [
    {
      id: "task-1",
      title: "Complete Ethan’s onboarding checklist",
      due: "2026-11-04",
      departmentId: "sales",
      completed: false,
    },
    {
      id: "task-2",
      title: "Review October payroll exceptions",
      due: "2026-11-03",
      departmentId: "people",
      completed: false,
    },
    {
      id: "task-3",
      title: "Confirm engineering interview panel",
      due: "2026-11-05",
      departmentId: "engineering",
      completed: false,
    },
  ],
};
