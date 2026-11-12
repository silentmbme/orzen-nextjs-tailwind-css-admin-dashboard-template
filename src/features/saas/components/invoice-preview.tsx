"use client";
import { useState } from "react";
import { Printer } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./saas-ui";
import { useSaas } from "../hooks/use-saas";
import { money, type SaasData, type Invoice } from "../types";
const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!,
  );
export function invoiceDocument(data: SaasData, invoice: Invoice) {
  const customer = data.customers.find((c) => c.id === invoice.customerId)!;
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(invoice.id)} · Demo invoice</title><style>body{font:13px Arial,sans-serif;color:#111;margin:48px;line-height:1.5}h1{font-size:24px}table{width:100%;border-collapse:collapse;margin:32px 0}td,th{text-align:left;padding:12px;border-bottom:1px solid #ddd}small{color:#555}.total{text-align:right;font-size:20px}@media print{body{margin:20mm}}</style></head><body><small>ORZEN · FICTIONAL DEMO INVOICE</small><h1>${escapeHtml(invoice.id)}</h1><p>Issued ${invoice.date} · Due ${invoice.due} · ${invoice.status}</p><h3>Bill to</h3><p>${escapeHtml(customer.company)}<br>${escapeHtml(customer.name)}<br>${escapeHtml(customer.email)}</p><table><thead><tr><th>Subscription</th><th>Service description</th><th>Amount</th></tr></thead><tbody><tr><td>${escapeHtml(invoice.subscriptionId)}</td><td>${escapeHtml(invoice.description)}</td><td>${money(invoice.amount)}</td></tr></tbody></table><p class="total">Total ${money(invoice.amount)} USD</p><small>Demonstration record only. No payment gateway, bank transfer or tax calculation is integrated. This printout is not a real payment request.</small></body></html>`;
}
export function InvoicePreview({ id, onClose }: { id: string; onClose: () => void }) {
  const { data } = useSaas(),
    [error, setError] = useState("");
  const invoice = data.invoices.find((i) => i.id === id),
    customer = data.customers.find((c) => c.id === invoice?.customerId);
  function print() {
    if (!invoice) return;
    const preview = window.open("", "_blank", "width=850,height=900");
    if (!preview) {
      setError("Allow this browser’s print preview popup and try again.");
      return;
    }
    preview.document.open();
    preview.document.write(invoiceDocument(data, invoice));
    preview.document.close();
    preview.focus();
    preview.print();
  }
  return (
    <Dialog open title="Invoice preview" onClose={onClose}>
      {invoice && customer ? (
        <div className="space-y-4">
          <div className="flex justify-between gap-2">
            <div>
              <p className="text-tiny text-muted">ORZEN · DEMO INVOICE</p>
              <p className="mt-1 text-lg font-semibold">{invoice.id}</p>
            </div>
            <div>
              <StatusBadge status={invoice.status} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-control border border-border bg-surface-alt p-3 text-label">
            <div>
              <p className="text-tiny text-muted">Bill to</p>
              <p className="mt-1 font-medium">{customer.company}</p>
              <p className="text-muted">{customer.name}</p>
              <p className="mt-1 break-all text-tiny text-muted">{customer.email}</p>
            </div>
            <div>
              <p>Issued {invoice.date}</p>
              <p className="mt-1">Due {invoice.due}</p>
              <p className="mt-2 text-tiny text-muted">{invoice.subscriptionId}</p>
            </div>
          </div>
          <div className="flex items-start justify-between gap-3 border-b border-border py-3 text-label">
            <span>{invoice.description}</span>
            <strong className="shrink-0 font-medium">{money(invoice.amount)}</strong>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Total USD</span>
            <span>{money(invoice.amount)}</span>
          </div>
          <p className="text-tiny text-muted">
            Fictional subscription charge. No gateway or tax integration. Preview does not request
            or collect payment.
          </p>
          {error && (
            <p role="alert" className="text-label text-danger">
              {error}
            </p>
          )}
          <div className="flex justify-end">
            <Button onClick={print}>
              <Printer size={13} />
              Print demo invoice
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-muted">Invoice not found.</p>
      )}
    </Dialog>
  );
}
