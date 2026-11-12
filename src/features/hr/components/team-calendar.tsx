import { attendanceAt } from "../selectors";
import { datesBetween, employedOn, isWorkday, today, type HrData } from "../types";
export function TeamCalendar({
  data,
  month,
  selected,
  onSelect,
  department = "all",
  employeeId = "all",
  mode = "attendance",
}: {
  data: HrData;
  month: string;
  selected: string;
  onSelect: (date: string) => void;
  department?: string;
  employeeId?: string;
  mode?: "attendance" | "leave";
}) {
  const safeMonth = /^\d{4}-(0[1-9]|1[0-2])$/.test(month) ? month : today.slice(0, 7),
    [year, value] = safeMonth.split("-").map(Number);
  const first = `${safeMonth}-01`,
    last = new Date(Date.UTC(year, value, 0)).toISOString().slice(0, 10),
    offset = (new Date(`${first}T12:00:00Z`).getUTCDay() + 6) % 7;
  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center text-tiny text-muted">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <span key={day} className="py-2">
            {day}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }, (_, index) => (
          <span key={`blank-${index}`} />
        ))}
        {datesBetween(first, last).map((date) => {
          const employees = data.employees.filter(
            (e) =>
              employedOn(e, date) &&
              (department === "all" || e.departmentId === department) &&
              (employeeId === "all" || e.id === employeeId),
          );
          const requests = data.leaves.filter(
            (l) =>
              l.status !== "Rejected" &&
              l.start <= date &&
              l.end >= date &&
              employees.some((e) => e.id === l.employeeId) &&
              isWorkday(date),
          );
          const approved = requests.filter((l) => l.status === "Approved").length,
            recorded = employees.filter((e) => attendanceAt(data, e, date)).length,
            working = employees.filter((e) =>
              ["Present", "Late", "Remote"].includes(attendanceAt(data, e, date)?.status || ""),
            ).length;
          const label =
            mode === "leave"
              ? requests.length
                ? `${requests.length} off`
                : "—"
              : recorded
                ? `${working}/${employees.length}`
                : isWorkday(date)
                  ? "No log"
                  : "Off";
          return (
            <button
              key={date}
              aria-label={`${date}: ${mode === "leave" ? `${requests.length} leave requests` : `${working} working, ${recorded} recorded`}`}
              aria-pressed={selected === date}
              onClick={() => onSelect(date)}
              className={`flex h-14 min-w-0 flex-col items-center justify-center rounded-control border text-tiny focus-visible:outline-2 focus-visible:outline-accent ${selected === date ? "border-accent bg-accent/10" : date === today ? "border-accent/40 bg-surface-alt" : "border-border bg-surface"}`}
            >
              <span className={date > today ? "text-muted" : "font-medium"}>
                {Number(date.slice(-2))}
              </span>
              <span
                className={`mt-1 text-[9px] ${mode === "leave" && approved ? "text-accent" : "text-muted"}`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-tiny text-muted">
        {mode === "leave"
          ? "Weekday requests include pending and approved leave. Purple labels include approved requests."
          : "Working / employed headcount. Present, late and remote count as working; missing logs are not absences."}
      </p>
    </div>
  );
}
