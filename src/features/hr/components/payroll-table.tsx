"use client";
import { useState } from "react";
import { ArrowDownToLine, CalendarDays, ScrollText, WalletCards } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { UserAvatar } from "@/components/ui/user-avatar";
import { HrWorkspace } from "./hr-workspace";
import { HrStatus, HrTitle } from "./hr-ui";
import { PayslipPreview } from "./payslip-preview";
import { useHr } from "../hooks/use-hr";
import { exportCsv, updatePayroll } from "../demo-service";
import { money, payrollTotals, type Payroll } from "../types";
export function PayrollTable() {
  const { data } = useHr(),
    periods = [...new Set(data.payroll.map((p) => p.period))].sort().reverse();
  const [period, setPeriod] = useState("2026-10"),
    [department, setDepartment] = useState("all"),
    [status, setStatus] = useState("all"),
    [preview, setPreview] = useState(""),
    [confirm, setConfirm] = useState<{ id: string; status: Payroll["status"] } | null>(null),
    [message, setMessage] = useState("");
  const scoped = data.payroll.filter(
      (p) =>
        p.period === period &&
        (department === "all" ||
          data.employees.find((e) => e.id === p.employeeId)?.departmentId === department),
    ),
    rows = scoped.filter((p) => status === "all" || p.status === status);
  const gross = scoped.reduce((sum, p) => sum + payrollTotals(p).gross, 0),
    deductions = scoped.reduce((sum, p) => sum + p.deductions, 0),
    net = scoped.reduce((sum, p) => sum + payrollTotals(p).net, 0);
  function change() {
    if (!confirm) return;
    const error = updatePayroll(confirm.id, confirm.status);
    setMessage(
      error ||
        `Payroll marked ${confirm.status.toLowerCase()} locally. No bank instruction or payment was sent.`,
    );
    if (!error) setConfirm(null);
  }
  return (
    <HrWorkspace
      title="Payroll"
      description="Fictional compensation snapshots and payroll review operations."
      actions={
        <>
          <Select
            aria-label="Payroll period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {periods.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Select>
          <Select
            aria-label="Payroll department"
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
          <Button
            disabled={!scoped.length}
            onClick={() =>
              exportCsv(
                `payroll-${period}`,
                scoped.map((p) => ({
                  employee: data.employees.find((e) => e.id === p.employeeId)?.name || p.employeeId,
                  employeeId: p.employeeId,
                  period: p.period,
                  base: p.base,
                  allowances: p.allowances,
                  gross: payrollTotals(p).gross,
                  deductions: p.deductions,
                  net: payrollTotals(p).net,
                  status: p.status,
                })),
              )
            }
          >
            <ArrowDownToLine size={13} />
            Export payroll run
          </Button>
        </>
      }
    >
      <Card
        title={<HrTitle icon={WalletCards}>Payroll run summary</HrTitle>}
        action={
          <span className="text-tiny text-muted">
            {period} · {scoped.length} captured records
          </span>
        }
      >
        <div className="mt-3 grid gap-4 sm:grid-cols-[1.2fr_1fr]">
          <div className="rounded-control border border-border bg-surface-alt p-3">
            <p className="text-tiny text-muted">Net payroll · fictional USD</p>
            <p className="mt-1 text-[24px] font-semibold">{money(net)}</p>
            <p className="mt-2 text-tiny text-muted">
              {scoped.filter((p) => p.status === "Paid").length} paid ·{" "}
              {scoped.filter((p) => p.status === "Reviewed").length} reviewed ·{" "}
              {scoped.filter((p) => p.status === "Draft").length} draft
            </p>
          </div>
          <dl className="space-y-3 py-2 text-label">
            <div className="flex justify-between">
              <dt className="text-muted">Total gross pay</dt>
              <dd className="font-medium">{money(gross)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Estimated deductions</dt>
              <dd className="font-medium">{money(deductions)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <dt className="text-muted">Net payroll</dt>
              <dd className="font-semibold">{money(net)}</dd>
            </div>
          </dl>
        </div>
        <p className="mt-3 text-tiny text-muted">
          Totals and exports follow period/department, independent of register status/search.
          Generic fixed demo amounts; no country-specific taxes, statutory deductions or salary
          proration.
        </p>
      </Card>
      {message && (
        <p
          role="status"
          className="rounded-control border border-border bg-surface p-3 text-label text-muted"
        >
          {message}
        </p>
      )}
      <Card
        title={<HrTitle icon={ScrollText}>Compensation register</HrTitle>}
        action={
          <Select
            aria-label="Payroll status filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All payroll states</option>
            {["Draft", "Reviewed", "Paid"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        }
      >
        <div className="[&_table]:min-w-[940px]">
          <DataTable
            label="Payroll"
            rows={rows}
            rowKey={(p) => p.id}
            pageSize={6}
            columns={[
              {
                key: "employee",
                label: "Employee",
                value: (p) =>
                  `${data.employees.find((e) => e.id === p.employeeId)?.name} ${p.employeeId}`,
                render: (p) => {
                  const employee = data.employees.find((e) => e.id === p.employeeId)!;
                  return (
                    <div className="flex items-center gap-2">
                      <UserAvatar name={employee.name} size={28} />
                      <span className="font-medium">
                        {employee.name}
                        <span className="mt-1 block text-tiny font-normal text-muted">
                          {employee.id}
                        </span>
                      </span>
                    </div>
                  );
                },
              },
              {
                key: "base",
                label: "Base pay",
                value: (p) => p.base,
                render: (p) => money(p.base),
              },
              {
                key: "allowances",
                label: "Allowances",
                value: (p) => p.allowances,
                render: (p) => money(p.allowances),
              },
              {
                key: "gross",
                label: "Gross",
                value: (p) => payrollTotals(p).gross,
                render: (p) => money(payrollTotals(p).gross),
              },
              {
                key: "deductions",
                label: "Deductions",
                value: (p) => p.deductions,
                render: (p) => money(p.deductions),
              },
              {
                key: "net",
                label: "Net pay",
                value: (p) => payrollTotals(p).net,
                render: (p) => (
                  <strong className="font-medium">{money(payrollTotals(p).net)}</strong>
                ),
              },
              {
                key: "status",
                label: "State",
                value: (p) => p.status,
                render: (p) => <HrStatus status={p.status} />,
              },
              {
                key: "actions",
                label: "Manage",
                value: (p) => p.id,
                render: (p) => (
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => setPreview(p.id)}>
                      Payslip
                    </Button>
                    {p.status !== "Paid" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setConfirm({
                            id: p.id,
                            status: p.status === "Draft" ? "Reviewed" : "Paid",
                          })
                        }
                      >
                        {p.status === "Draft" ? "Review" : "Mark demo paid"}
                      </Button>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Card>
      <Card title={<HrTitle icon={CalendarDays}>Payroll history</HrTitle>}>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {periods.map((value) => {
            const records = data.payroll.filter(
              (p) =>
                p.period === value &&
                (department === "all" ||
                  data.employees.find((e) => e.id === p.employeeId)?.departmentId === department),
            );
            return (
              <button
                key={value}
                aria-pressed={value === period}
                onClick={() => setPeriod(value)}
                className={`rounded-control border p-3 text-left ${value === period ? "border-accent bg-accent/5" : "border-border bg-surface-alt"}`}
              >
                <p className="text-label font-medium">{value}</p>
                <p className="mt-2 text-lg font-semibold">
                  {money(records.reduce((sum, p) => sum + payrollTotals(p).net, 0))}
                </p>
                <p className="mt-1 text-tiny text-muted">
                  {records.length} records · {records.filter((p) => p.status === "Paid").length}{" "}
                  marked paid
                </p>
              </button>
            );
          })}
        </div>
        <ol className="mt-4 space-y-2 border-t border-border pt-3">
          {data.activity
            .filter(
              (a) =>
                a.kind === "Payroll" &&
                (department === "all" ||
                  data.employees.find((e) => e.id === a.employeeId)?.departmentId === department),
            )
            .slice(0, 4)
            .map((a) => (
              <li key={a.id} className="flex justify-between gap-3 text-label">
                <span>{a.message}</span>
                <time className="shrink-0 text-tiny text-muted">{a.date}</time>
              </li>
            ))}
        </ol>
      </Card>
      {preview && <PayslipPreview key={preview} id={preview} onClose={() => setPreview("")} />}
      <Dialog open={!!confirm} title="Confirm demo payroll update" onClose={() => setConfirm(null)}>
        {confirm && (
          <div className="space-y-3">
            <p className="text-label">Mark this payroll record {confirm.status.toLowerCase()}?</p>
            <p className="text-label text-muted">
              This updates only the local demo ledger. It does not transfer money, validate taxes or
              contact an employee or bank.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirm(null)}>
                Keep current state
              </Button>
              <Button onClick={change}>Confirm {confirm.status.toLowerCase()}</Button>
            </div>
          </div>
        )}
      </Dialog>
    </HrWorkspace>
  );
}
