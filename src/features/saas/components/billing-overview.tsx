"use client";
import { useState } from "react";
import { ArrowDownToLine, CreditCard, ReceiptText, ScrollText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { SaasWorkspace } from "./saas-workspace";
import { SaasTitle, StatusBadge } from "./saas-ui";
import { InvoicePreview } from "./invoice-preview";
import { useSaas } from "../hooks/use-saas";
import { exportCsv } from "../demo-service";
import { money, today } from "../types";
export function BillingOverview() {
  const { data, update } = useSaas(),
    [status, setStatus] = useState("all"),
    [preview, setPreview] = useState(""),
    [message, setMessage] = useState("");
  const invoices = data.invoices.filter((i) => status === "all" || i.status === status);
  const collected = data.invoices
      .filter((i) => i.status === "Paid")
      .reduce((s, i) => s + i.amount, 0),
    outstanding = data.invoices
      .filter((i) => i.status === "Open" || i.status === "Failed")
      .reduce((s, i) => s + i.amount, 0);
  const failed = data.invoices.filter((i) => i.status === "Failed"),
    overdue = data.invoices.filter((i) => ["Open", "Failed"].includes(i.status) && i.due < today);
  function followup(id: string) {
    const error = update((state) => {
      if (
        state.payments.some(
          (p) => p.invoiceId === id && p.status === "Follow-up" && p.date === today,
        )
      )
        throw new Error("A demo follow-up is already logged today.");
      state.payments.unshift({
        id: crypto.randomUUID(),
        invoiceId: id,
        date: today,
        amount: 0,
        status: "Follow-up",
        note: "Simulated follow-up logged locally. No email, retry or charge was sent.",
      });
    });
    setMessage(error || "Demo follow-up logged. No reminder, charge or payment retry was sent.");
  }
  return (
    <SaasWorkspace
      title="Billing & invoices"
      description="Invoice records, collections and local follow-up activity."
      actions={
        <Button
          disabled={!invoices.length}
          onClick={() =>
            exportCsv(
              "saas-invoices",
              invoices.map((i) => ({
                invoice: i.id,
                subscription: i.subscriptionId,
                date: i.date,
                due: i.due,
                amount: i.amount,
                status: i.status,
              })),
            )
          }
        >
          <ArrowDownToLine size={13} />
          Export invoice view
        </Button>
      }
    >
      <div className="grid gap-widget lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Card title={<SaasTitle icon={CreditCard}>Collection ledger</SaasTitle>}>
          <p className="mt-3 text-tiny text-muted">Total collected · all invoice dates</p>
          <strong className="mt-1 block text-[24px] font-semibold">{money(collected)}</strong>
          <div className="my-3 flex h-2 overflow-hidden rounded-full bg-surface-alt">
            <span
              className="bg-accent"
              style={{ width: `${(collected / Math.max(collected + outstanding, 1)) * 100}%` }}
            />
            <span
              className="bg-trend-down"
              style={{ width: `${(outstanding / Math.max(collected + outstanding, 1)) * 100}%` }}
            />
          </div>
          <div className="flex justify-between gap-2 text-tiny text-muted">
            <span>{data.invoices.filter((i) => i.status === "Paid").length} paid invoices</span>
            <span>{money(outstanding)} outstanding</span>
          </div>
        </Card>
        <Card title={<SaasTitle icon={ReceiptText}>Payment attention</SaasTitle>}>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-tiny text-muted">Failed payments</p>
              <p className="mt-1 text-kpi font-semibold">{failed.length}</p>
              <p className="text-tiny text-danger">
                {money(failed.reduce((s, i) => s + i.amount, 0))}
              </p>
            </div>
            <div>
              <p className="text-tiny text-muted">Overdue invoices</p>
              <p className="mt-1 text-kpi font-semibold">{overdue.length}</p>
              <p className="text-tiny text-muted">As of {today}</p>
            </div>
          </div>
          <p className="mt-3 text-tiny text-muted">
            Outstanding includes open and failed invoices. Follow-ups do not alter payment status.
          </p>
        </Card>
      </div>
      <Card
        title={<SaasTitle icon={ReceiptText}>Invoice register</SaasTitle>}
        action={
          <Select
            aria-label="Invoice status filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All invoices</option>
            {["Paid", "Open", "Failed", "Voided"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        }
      >
        {message && (
          <p role="status" className="mt-2 text-label text-muted">
            {message}
          </p>
        )}
        <div className="[&_table]:min-w-[880px]">
          <DataTable
            label="SaaS invoices"
            rows={[...invoices].sort((a, b) => b.date.localeCompare(a.date))}
            rowKey={(i) => i.id}
            pageSize={6}
            columns={[
              {
                key: "id",
                label: "Invoice",
                value: (i) => i.id,
                render: (i) => (
                  <button className="text-accent" onClick={() => setPreview(i.id)}>
                    {i.id}
                  </button>
                ),
              },
              {
                key: "customer",
                label: "Customer",
                value: (i) =>
                  data.customers.find((c) => c.id === i.customerId)?.company || "Unknown",
              },
              { key: "sub", label: "Subscription", value: (i) => i.subscriptionId },
              { key: "date", label: "Issued", value: (i) => i.date },
              { key: "due", label: "Due", value: (i) => i.due },
              {
                key: "amount",
                label: "Amount",
                value: (i) => i.amount,
                render: (i) => money(i.amount),
              },
              {
                key: "status",
                label: "Status",
                value: (i) => i.status,
                render: (i) => <StatusBadge status={i.status} />,
              },
              {
                key: "actions",
                label: "Actions",
                value: (i) => i.id,
                render: (i) => (
                  <div className="flex gap-1">
                    <Button variant="outline" onClick={() => setPreview(i.id)}>
                      Preview
                    </Button>
                    {["Failed", "Open"].includes(i.status) && (
                      <Button
                        variant="ghost"
                        disabled={data.payments.some(
                          (p) =>
                            p.invoiceId === i.id && p.date === today && p.status === "Follow-up",
                        )}
                        onClick={() => followup(i.id)}
                      >
                        Log demo follow-up
                      </Button>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Card>
      <Card title={<SaasTitle icon={ScrollText}>Transaction & follow-up history</SaasTitle>}>
        <div className="[&_table]:min-w-[740px]">
          <DataTable
            label="SaaS payments"
            rows={[...data.payments].sort((a, b) => b.date.localeCompare(a.date))}
            rowKey={(p) => p.id}
            pageSize={5}
            columns={[
              { key: "date", label: "Date", value: (p) => p.date },
              { key: "invoice", label: "Invoice", value: (p) => p.invoiceId },
              {
                key: "status",
                label: "Event",
                value: (p) => p.status,
                render: (p) => <StatusBadge status={p.status} />,
              },
              {
                key: "amount",
                label: "Attempted / collected",
                value: (p) => p.amount,
                render: (p) => money(p.amount),
              },
              {
                key: "note",
                label: "Note",
                value: (p) => p.note,
                render: (p) => (
                  <span className="block max-w-[320px] whitespace-normal text-tiny text-muted">
                    {p.note}
                  </span>
                ),
              },
            ]}
          />
        </div>
      </Card>
      {preview && <InvoicePreview key={preview} id={preview} onClose={() => setPreview("")} />}
    </SaasWorkspace>
  );
}
