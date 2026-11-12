"use client";
import { useState } from "react";
import { Printer } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { HrStatus } from "./hr-ui";
import { useHr } from "../hooks/use-hr";
import { money, payrollTotals, type HrData, type Payroll } from "../types";
const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!,
  );
export function payslipDocument(data: HrData, payroll: Payroll) {
  const employee = data.employees.find((e) => e.id === payroll.employeeId)!,
    totals = payrollTotals(payroll);
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(payroll.id)} · Demo payslip</title><style>body{font:13px Arial,sans-serif;color:#111;margin:48px;line-height:1.5}h1{font-size:24px}table{width:100%;border-collapse:collapse;margin:30px 0}td,th{text-align:left;padding:12px;border-bottom:1px solid #ddd}small{color:#555}.total{text-align:right;font-size:20px}@media print{body{margin:20mm}}</style></head><body><small>ORZEN · FICTIONAL DEMO PAYSLIP</small><h1>${escapeHtml(employee.name)}</h1><p>${escapeHtml(employee.id)} · ${escapeHtml(employee.designation)}<br>Period ${escapeHtml(payroll.period)} · ${payroll.status}</p><table><tbody><tr><th>Base salary</th><td>${money(payroll.base)}</td></tr><tr><th>Allowances</th><td>${money(payroll.allowances)}</td></tr><tr><th>Gross pay</th><td>${money(totals.gross)}</td></tr><tr><th>Estimated deductions</th><td>${money(payroll.deductions)}</td></tr></tbody></table><p class="total">Net pay ${money(totals.net)} USD</p><small>Fictional demo amounts only. This is not a bank transfer, official payroll calculation or country-specific tax document. Marking a record paid does not move money.</small></body></html>`;
}
export function PayslipPreview({ id, onClose }: { id: string; onClose: () => void }) {
  const { data } = useHr(),
    [error, setError] = useState(""),
    record = data.payroll.find((p) => p.id === id),
    employee = data.employees.find((e) => e.id === record?.employeeId);
  function print() {
    if (!record) return;
    const preview = window.open("", "_blank", "width=850,height=900");
    if (!preview) {
      setError("Allow the print preview popup and try again.");
      return;
    }
    preview.document.open();
    preview.document.write(payslipDocument(data, record));
    preview.document.close();
    preview.focus();
    preview.print();
  }
  return (
    <Dialog open title="Demo payslip" onClose={onClose}>
      {record && employee ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <UserAvatar name={employee.name} size={40} />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{employee.name}</p>
              <p className="mt-1 text-tiny text-muted">
                {employee.id} · {employee.designation}
              </p>
            </div>
            <HrStatus status={record.status} />
          </div>
          <div className="rounded-control border border-border bg-surface-alt p-3 text-label">
            <p className="font-medium">Pay period {record.period}</p>
            <p className="mt-1 text-tiny text-muted">{record.id}</p>
            <p className="mt-1 text-tiny text-muted">
              {record.paidOn ? `Marked paid ${record.paidOn}` : "No paid date recorded"}
            </p>
          </div>
          <dl className="space-y-2.5 text-label">
            {[
              ["Base salary", record.base],
              ["Allowances", record.allowances],
              ["Gross pay", payrollTotals(record).gross],
              ["Estimated deductions", record.deductions],
            ].map(([label, amount]) => (
              <div key={String(label)} className="flex justify-between gap-2">
                <dt className="text-muted">{label}</dt>
                <dd className="font-medium">{money(Number(amount))}</dd>
              </div>
            ))}
          </dl>
          <div className="flex justify-between rounded-control bg-accent/5 p-3">
            <span className="font-medium">Net pay · USD</span>
            <strong className="text-lg font-semibold">{money(payrollTotals(record).net)}</strong>
          </div>
          <p className="text-tiny text-muted">
            Captured demo pay amounts. No bank integration, automatic proration or country-specific
            tax calculation.
          </p>
          <details className="text-label">
            <summary className="cursor-pointer text-accent">Employee payroll history</summary>
            <div className="mt-2 space-y-2">
              {data.payroll
                .filter((p) => p.employeeId === employee.id)
                .sort((a, b) => b.period.localeCompare(a.period))
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between gap-2 border-t border-border pt-2 text-tiny"
                  >
                    <span>
                      {p.period} · {p.status}
                    </span>
                    <span>{money(payrollTotals(p).net)}</span>
                  </div>
                ))}
            </div>
          </details>
          {error && (
            <p role="alert" className="text-label text-danger">
              {error}
            </p>
          )}
          <div className="flex justify-end">
            <Button onClick={print}>
              <Printer size={13} />
              Print demo payslip
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-muted">Payslip not available.</p>
      )}
    </Dialog>
  );
}
