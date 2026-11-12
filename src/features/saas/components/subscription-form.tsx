"use client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Field } from "./saas-ui";
import { useSaas } from "../hooks/use-saas";
import { saveSubscription } from "../demo-service";
import { addDays, money, today, type Subscription } from "../types";
export function SubscriptionForm({
  subscription,
  onClose,
}: {
  subscription?: Subscription;
  onClose: () => void;
}) {
  const { data } = useSaas(),
    [error, setError] = useState("");
  const [draft, setDraft] = useState<Subscription>(
    subscription || {
      id: "",
      customerId: data.customers[0]?.id || "",
      planId: data.plans.find((p) => p.active)?.id || "",
      cycle: "Monthly",
      status: "Trialing",
      amount: 0,
      created: today,
      renewal: addDays(today, 14),
    },
  );
  const plan = data.plans.find((p) => p.id === draft.planId);
  const quoted =
    subscription && draft.planId === subscription.planId && draft.cycle === subscription.cycle
      ? subscription.amount
      : draft.cycle === "Yearly"
        ? plan?.yearly || 0
        : plan?.monthly || 0;
  function submit(event: FormEvent) {
    event.preventDefault();
    const error = saveSubscription(draft);
    if (error) setError(error);
    else onClose();
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Customer *">
          <Select
            aria-label="Subscription customer"
            disabled={!!subscription}
            value={draft.customerId}
            onChange={(e) => setDraft({ ...draft, customerId: e.target.value })}
          >
            {data.customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company} · {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Plan *">
          <Select
            aria-label="Subscription plan"
            value={draft.planId}
            onChange={(e) => setDraft({ ...draft, planId: e.target.value })}
          >
            {data.plans.map((p) => (
              <option key={p.id} value={p.id} disabled={!p.active && p.id !== subscription?.planId}>
                {p.name}
                {p.active ? "" : " (inactive)"}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Billing cycle">
          <Select
            aria-label="Billing cycle"
            value={draft.cycle}
            onChange={(e) => setDraft({ ...draft, cycle: e.target.value as Subscription["cycle"] })}
          >
            <option>Monthly</option>
            <option>Yearly</option>
          </Select>
        </Field>
        <Field label="Subscription status">
          <Select
            aria-label="Subscription status"
            value={draft.status}
            onChange={(e) =>
              setDraft({ ...draft, status: e.target.value as Subscription["status"] })
            }
          >
            {(subscription
              ? ["Active", "Trialing", "Paused", "Canceled"]
              : ["Trialing", "Active"]
            ).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Field label="Next renewal *">
          <Input
            required
            aria-label="Next renewal"
            type="date"
            min={today}
            value={draft.renewal}
            onChange={(e) => setDraft({ ...draft, renewal: e.target.value })}
          />
        </Field>
      </div>
      <div className="rounded-control border border-border bg-surface-alt p-3">
        <p className="text-label font-medium">
          {money(quoted)} / {draft.cycle.toLowerCase()}
        </p>
        <p className="mt-1 text-tiny text-muted">
          Existing prices are retained until the plan or cycle changes. Status/plan changes affect
          demo MRR; invoices are not generated or prorated.
        </p>
      </div>
      {error && (
        <p role="alert" className="text-label text-danger">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save demo subscription</Button>
      </div>
    </form>
  );
}
