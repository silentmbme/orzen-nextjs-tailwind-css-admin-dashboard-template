"use client";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { StatusBadge } from "./saas-ui";
import { SubscriptionForm } from "./subscription-form";
import { useSaas } from "../hooks/use-saas";
import { saveSubscription } from "../demo-service";
import { money, rate, type SubscriptionStatus } from "../types";
export function SubscriptionDetailsDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const { data } = useSaas(),
    [editing, setEditing] = useState(false),
    [confirm, setConfirm] = useState<SubscriptionStatus | null>(null),
    [message, setMessage] = useState("");
  const sub = data.subscriptions.find((s) => s.id === id),
    customer = data.customers.find((c) => c.id === sub?.customerId),
    plan = data.plans.find((p) => p.id === sub?.planId);
  const history = data.movements
    .filter((m) => m.subscriptionId === id)
    .slice()
    .reverse();
  function change() {
    if (!sub || !confirm) return;
    const error = saveSubscription({ ...sub, status: confirm });
    if (error) setMessage(error);
    else {
      setMessage(
        `Subscription ${confirm.toLowerCase()} in the local demo. No customer or billing service was contacted.`,
      );
      setConfirm(null);
    }
  }
  return (
    <Dialog
      open
      title={editing ? "Edit subscription" : sub ? sub.id : "Subscription unavailable"}
      onClose={onClose}
    >
      {sub && customer ? (
        editing ? (
          <SubscriptionForm subscription={sub} onClose={() => setEditing(false)} />
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <UserAvatar name={customer.name} size={40} />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{customer.company}</p>
                <p className="text-label text-muted">{customer.name}</p>
              </div>
              <StatusBadge status={sub.status} />
            </div>
            <dl className="grid grid-cols-2 gap-3 rounded-control border border-border bg-surface-alt p-3 text-label">
              {[
                ["Plan", plan?.name || "Unknown"],
                ["Recurring amount", `${money(sub.amount)} / ${sub.cycle.toLowerCase()}`],
                ["Renewal", sub.renewal],
                [
                  "Current MRR",
                  sub.status === "Active" ? money(rate(sub.amount, sub.cycle)) : money(0),
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-tiny text-muted">{label}</dt>
                  <dd className="mt-1 font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-2">
              {sub.status !== "Canceled" && (
                <Button variant="outline" onClick={() => setEditing(true)}>
                  Edit / change plan
                </Button>
              )}
              {sub.status === "Active" && (
                <Button variant="outline" onClick={() => setConfirm("Paused")}>
                  Pause
                </Button>
              )}
              {["Paused", "Trialing"].includes(sub.status) && (
                <Button onClick={() => setConfirm("Active")}>
                  {sub.status === "Trialing" ? "Activate trial" : "Resume"}
                </Button>
              )}
              {sub.status !== "Canceled" && (
                <Button variant="destructive" onClick={() => setConfirm("Canceled")}>
                  Cancel subscription
                </Button>
              )}
            </div>
            {confirm && (
              <div className="space-y-3 rounded-control border border-border p-3">
                <p className="text-label font-medium">
                  {confirm === "Canceled"
                    ? "Cancel this subscription?"
                    : confirm === "Paused"
                      ? "Pause this subscription?"
                      : "Activate this subscription?"}
                </p>
                <p className="text-tiny text-muted">
                  This updates demo status and recurring revenue immediately. Existing invoices and
                  payments remain unchanged. Cancellation cannot be resumed.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setConfirm(null)}>
                    Keep current status
                  </Button>
                  <Button
                    variant={confirm === "Canceled" ? "destructive" : "primary"}
                    onClick={change}
                  >
                    Confirm{" "}
                    {confirm === "Canceled"
                      ? "cancellation"
                      : confirm === "Paused"
                        ? "pause"
                        : "activation"}
                  </Button>
                </div>
              </div>
            )}
            {message && (
              <p role="status" className="text-label text-muted">
                {message}
              </p>
            )}
            <div className="border-t border-border pt-3">
              <p className="text-label font-medium">Subscription history</p>
              <ol className="mt-2 max-h-52 space-y-3 overflow-y-auto">
                {history.map((event) => (
                  <li key={event.id} className="border-l border-border pl-3">
                    <div className="flex justify-between gap-2 text-label">
                      <span>{event.kind}</span>
                      <span className="text-tiny text-muted">{event.date}</span>
                    </div>
                    <p className="mt-1 text-tiny text-muted">{event.note}</p>
                    <p className="mt-1 text-tiny">
                      MRR {money(event.before)} → {money(event.after)}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )
      ) : (
        <p className="text-label text-muted">This subscription is not available.</p>
      )}
    </Dialog>
  );
}
