"use client";
import { useState, type FormEvent } from "react";
import { CalendarClock, CalendarDays, PieChart, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { TablePagination } from "@/components/ui/table-pagination";
import { HrWorkspace } from "./hr-workspace";
import { HrField, HrStatus, HrTitle } from "./hr-ui";
import { TeamCalendar } from "./team-calendar";
import { LeaveDecisionDialog, LeaveRequestCard } from "./leave-request-card";
import { useHr } from "../hooks/use-hr";
import { requestLeave } from "../demo-service";
import { currentEmployees, leaveBalance } from "../selectors";
import { leaveQuotas, today, workdays, type Leave } from "../types";
function LeaveForm({
  employeeId,
  onClose,
  onSaved,
}: {
  employeeId: string;
  onClose: () => void;
  onSaved: (employee: string, date: string) => void;
}) {
  const { data } = useHr(),
    [draft, setDraft] = useState<Leave>({
      id: "",
      employeeId,
      type: "Annual",
      start: today,
      end: today,
      reason: "",
      status: "Pending",
      decision: "",
      created: today,
    }),
    [error, setError] = useState("");
  const balance = leaveBalance(data, draft.employeeId, draft.type),
    employee = data.employees.find((e) => e.id === draft.employeeId);
  function save(event: FormEvent) {
    event.preventDefault();
    const error = requestLeave(draft);
    if (error) setError(error);
    else onSaved(draft.employeeId, draft.start);
  }
  return (
    <form onSubmit={save} className="space-y-3">
      <HrField label="Employee *">
        <Select
          aria-label="Leave employee"
          value={draft.employeeId}
          onChange={(e) => setDraft({ ...draft, employeeId: e.target.value })}
        >
          {data.employees
            .filter((e) => e.status !== "Inactive")
            .map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
        </Select>
      </HrField>
      <HrField label="Leave type">
        <Select
          aria-label="Leave type"
          value={draft.type}
          onChange={(e) => setDraft({ ...draft, type: e.target.value as Leave["type"] })}
        >
          {Object.keys(leaveQuotas).map((type) => (
            <option key={type}>{type}</option>
          ))}
        </Select>
      </HrField>
      <div className="grid gap-3 sm:grid-cols-2">
        <HrField label="Leave starts *">
          <Input
            required
            type="date"
            min={employee?.joined}
            max="2026-12-31"
            value={draft.start}
            onChange={(e) => setDraft({ ...draft, start: e.target.value })}
          />
        </HrField>
        <HrField label="Leave ends *">
          <Input
            required
            type="date"
            min={draft.start}
            max="2026-12-31"
            value={draft.end}
            onChange={(e) => setDraft({ ...draft, end: e.target.value })}
          />
        </HrField>
      </div>
      <HrField label="Leave reason *">
        <Input
          required
          maxLength={250}
          value={draft.reason}
          onChange={(e) => setDraft({ ...draft, reason: e.target.value })}
        />
      </HrField>
      <p className="rounded-control border border-border bg-surface-alt p-3 text-label">
        {workdays(draft.start, draft.end)} weekdays requested · {balance.remaining}{" "}
        {draft.type.toLowerCase()} days available
      </p>
      <p className="text-tiny text-muted">
        Generic 2026 demo allowances. Weekends are excluded; local holidays and employment rules are
        not modeled.
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
        <Button type="submit">Submit demo leave</Button>
      </div>
    </form>
  );
}
export function LeaveRequestList() {
  const { data } = useHr(),
    [status, setStatus] = useState("Pending"),
    [department, setDepartment] = useState("all"),
    [employeeId, setEmployeeId] = useState("all"),
    [from, setFrom] = useState(""),
    [to, setTo] = useState(""),
    [query, setQuery] = useState(""),
    [page, setPage] = useState(0),
    [month, setMonth] = useState(today.slice(0, 7)),
    [day, setDay] = useState(today),
    [creating, setCreating] = useState(false),
    [history, setHistory] = useState("");
  const [decision, setDecision] = useState<{ id: string; status: "Approved" | "Rejected" } | null>(
    null,
  );
  const eligible = currentEmployees(data, department).filter(
      (e) => employeeId === "all" || e.id === employeeId,
    ),
    invalidRange = !!from && !!to && from > to;
  const base = data.leaves.filter(
    (l) =>
      (department === "all" ||
        data.employees.find((e) => e.id === l.employeeId)?.departmentId === department) &&
      (employeeId === "all" || l.employeeId === employeeId) &&
      (!from || l.end >= from) &&
      (!to || l.start <= to) &&
      !invalidRange &&
      `${l.id} ${l.reason} ${data.employees.find((e) => e.id === l.employeeId)?.name}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const requests = base.filter((l) => status === "all" || l.status === status),
    current = Math.min(page, Math.max(0, Math.ceil(requests.length / 4) - 1));
  const balances = (Object.keys(leaveQuotas) as (keyof typeof leaveQuotas)[]).map((type) => ({
    type,
    quota: eligible.reduce((sum, e) => sum + leaveBalance(data, e.id, type).quota, 0),
    booked: eligible.reduce((sum, e) => sum + leaveBalance(data, e.id, type).booked, 0),
    remaining: eligible.reduce((sum, e) => sum + leaveBalance(data, e.id, type).remaining, 0),
  }));
  return (
    <HrWorkspace
      title="Leave management"
      description="A request queue, team calendar and weekday allowance workspace."
      actions={
        <Button
          disabled={!currentEmployees(data, department).length}
          onClick={() => setCreating(true)}
        >
          <Plus size={13} />
          Request leave
        </Button>
      }
    >
      <div className="flex flex-wrap gap-2">
        <Select
          aria-label="Leave department filter"
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setEmployeeId("all");
            setPage(0);
          }}
        >
          <option value="all">All departments</option>
          {data.departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Leave employee filter"
          value={employeeId}
          onChange={(e) => {
            setEmployeeId(e.target.value);
            setPage(0);
          }}
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
        <Input
          aria-label="Leave from date"
          type="date"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            setPage(0);
          }}
        />
        <Input
          aria-label="Leave to date"
          type="date"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            setPage(0);
          }}
        />
        <Button
          variant="ghost"
          onClick={() => {
            setFrom("");
            setTo("");
            setQuery("");
            setStatus("Pending");
            setDepartment("all");
            setEmployeeId("all");
            setPage(0);
          }}
        >
          Reset filters
        </Button>
      </div>
      {invalidRange && (
        <p role="alert" className="text-label text-danger">
          The start filter must not be after the end filter.
        </p>
      )}
      <div className="grid items-start gap-widget xl:grid-cols-[minmax(0,1fr)_350px]">
        <Card
          title={<HrTitle icon={CalendarClock}>Leave request queue</HrTitle>}
          action={<span className="text-tiny text-muted">{requests.length} matching requests</span>}
        >
          <div className="my-3 flex flex-wrap gap-1">
            {["Pending", "Approved", "Rejected", "all"].map((value) => (
              <Button
                key={value}
                size="sm"
                variant={status === value ? "secondary" : "ghost"}
                aria-pressed={status === value}
                onClick={() => {
                  setStatus(value);
                  setPage(0);
                }}
              >
                {value === "all" ? "All requests" : value}
                <span className="text-tiny text-muted">
                  {base.filter((l) => value === "all" || l.status === value).length}
                </span>
              </Button>
            ))}
          </div>
          <Input
            aria-label="Search leave requests"
            placeholder="Search employee, reason or request ID…"
            className="mb-3 w-full"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
          />
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {requests.slice(current * 4, current * 4 + 4).map((request) => (
              <div key={request.id} className="min-w-0">
                <LeaveRequestCard
                  request={request}
                  onDecide={(id, status) => setDecision({ id, status })}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1"
                  onClick={() => setHistory(request.employeeId)}
                >
                  Employee leave history
                </Button>
              </div>
            ))}
          </div>
          {!requests.length && <EmptyState>No leave requests match this selection.</EmptyState>}
          <TablePagination
            label="Leave requests"
            count={requests.length}
            currentPage={current}
            pageCount={Math.max(1, Math.ceil(requests.length / 4))}
            pageSize={4}
            onPageChange={setPage}
          />
        </Card>
        <div className="min-w-0 space-y-widget">
          <Card title={<HrTitle icon={CalendarDays}>Team leave calendar</HrTitle>}>
            <Input
              aria-label="Leave calendar month"
              type="month"
              value={month}
              min="2026-01"
              max="2026-12"
              className="my-3 w-full"
              onChange={(e) => {
                if (e.target.value) setMonth(e.target.value);
              }}
            />
            <TeamCalendar
              data={data}
              month={month}
              selected={day}
              department={department}
              employeeId={employeeId}
              mode="leave"
              onSelect={(date) => {
                setDay(date);
                setFrom(date);
                setTo(date);
                setStatus("all");
                setPage(0);
              }}
            />
          </Card>
          <Card title={<HrTitle icon={PieChart}>Balances & request mix</HrTitle>}>
            <p className="mt-2 text-tiny text-muted">
              {employeeId === "all"
                ? `${eligible.length} current employees · combined allowance`
                : "Selected current employee allowance"}
            </p>
            <div className="mt-3 space-y-3">
              {balances.map((balance) => (
                <div key={balance.type}>
                  <div className="flex justify-between text-label">
                    <span>{balance.type}</span>
                    <span className="font-medium">
                      {balance.remaining} / {balance.quota} left
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-surface-alt">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{
                        width: `${balance.quota ? (balance.booked / balance.quota) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-tiny text-muted">
                    {balance.booked} approved weekdays ·{" "}
                    {base.filter((l) => l.type === balance.type).length} filtered requests
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3 border-t border-border pt-2 text-tiny text-muted">
              Balance uses all approved 2026 leave, independent of queue date/status filters.
              Pending requests do not reduce allowance.
            </p>
          </Card>
        </div>
      </div>
      <Dialog open={creating} title="Request demo leave" onClose={() => setCreating(false)}>
        {creating && (
          <LeaveForm
            employeeId={
              employeeId !== "all" && eligible.some((e) => e.id === employeeId)
                ? employeeId
                : eligible[0]?.id || currentEmployees(data)[0]?.id || ""
            }
            onClose={() => setCreating(false)}
            onSaved={(employee, start) => {
              setCreating(false);
              setEmployeeId(employee);
              setDepartment("all");
              setStatus("Pending");
              setFrom("");
              setTo("");
              setQuery("");
              setMonth(start.slice(0, 7));
              setDay(start);
            }}
          />
        )}
      </Dialog>
      {decision && (
        <LeaveDecisionDialog
          key={`${decision.id}-${decision.status}`}
          {...decision}
          onClose={() => setDecision(null)}
        />
      )}
      <Dialog open={!!history} title="Employee leave history" onClose={() => setHistory("")}>
        <p className="text-label font-medium">
          {data.employees.find((e) => e.id === history)?.name}
        </p>
        <div className="[&_table]:min-w-[500px]">
          <DataTable
            label="Employee leave history"
            rows={data.leaves.filter((l) => l.employeeId === history)}
            rowKey={(l) => l.id}
            columns={[
              { key: "type", label: "Type", value: (l) => l.type },
              { key: "start", label: "Starts", value: (l) => l.start },
              { key: "end", label: "Ends", value: (l) => l.end },
              {
                key: "status",
                label: "Status",
                value: (l) => l.status,
                render: (l) => <HrStatus status={l.status} />,
              },
              { key: "decision", label: "Decision", value: (l) => l.decision || "Pending" },
            ]}
          />
        </div>
      </Dialog>
    </HrWorkspace>
  );
}
