"use client";
import { useState } from "react";
import { Activity, Clock3, StickyNote, UserRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { SaasTitle, StatusBadge } from "./saas-ui";
import { useSaas } from "../hooks/use-saas";
import { customerHealth, lifetimeValue, monthlyUsage } from "../selectors";
import { latestDate, money } from "../types";
export function CustomerDetails({ id }: { id: string }) {
  const { data, update } = useSaas(),
    customer = data.customers.find((c) => c.id === id);
  const [notes, setNotes] = useState<string | null>(null),
    [message, setMessage] = useState("");
  const subscriptions = data.subscriptions.filter((s) => s.customerId === id),
    usage = monthlyUsage(data, id),
    history = data.movements
      .filter((m) => subscriptions.some((s) => s.id === m.subscriptionId))
      .slice()
      .reverse();
  if (!customer) return <p className="text-label text-muted">Customer not found.</p>;
  return (
    <div className="min-w-0 space-y-widget">
      <Card
        title={<SaasTitle icon={UserRound}>Account profile</SaasTitle>}
        action={<StatusBadge status={customerHealth(data, id)} />}
      >
        <div className="mt-3 flex items-center gap-3">
          <UserAvatar name={customer.name} size={40} />
          <div className="min-w-0">
            <p className="font-medium">{customer.company}</p>
            <p className="text-label text-muted">{customer.name}</p>
          </div>
        </div>
        <p className="mt-3 break-all text-label text-muted">{customer.email}</p>
        <p className="mt-1 text-tiny text-muted">
          {customer.region} · Joined {customer.joined}
        </p>
        <div className="my-3 grid grid-cols-2 gap-2 rounded-control border border-border bg-surface-alt p-3">
          <div>
            <p className="text-tiny text-muted">Lifetime collected</p>
            <p className="mt-1 text-lg font-semibold">{money(lifetimeValue(data, id))}</p>
          </div>
          <div>
            <p className="text-tiny text-muted">Last active</p>
            <p className="mt-1 text-label font-medium">
              {latestDate(data.usage.filter((u) => u.customerId === id && u.activeUsers > 0)) ||
                "No activity"}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="flex flex-wrap items-center justify-between gap-2 text-label"
            >
              <span>
                {data.plans.find((p) => p.id === sub.planId)?.name} · {sub.id}
              </span>
              <StatusBadge status={sub.status} />
            </div>
          ))}
        </div>
      </Card>
      <Card title={<SaasTitle icon={Activity}>Workspace usage</SaasTitle>}>
        <div className="mt-3 grid grid-cols-3 gap-2 text-label">
          {[
            { label: "Peak seats", value: usage.seats },
            { label: "API requests", value: usage.api.toLocaleString("en-US") },
            { label: "Storage GB", value: usage.storage },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-tiny text-muted">{item.label}</p>
              <strong className="mt-1 block font-medium">{item.value}</strong>
            </div>
          ))}
        </div>
        <p className="mt-3 text-tiny text-muted">
          Rolling 30-day sample. Storage is the latest snapshot, not a sum.
        </p>
      </Card>
      <Card title={<SaasTitle icon={Clock3}>Subscription history</SaasTitle>}>
        <ol className="mt-3 max-h-48 space-y-3 overflow-y-auto">
          {history.map((event) => (
            <li key={event.id} className="border-l border-border pl-3">
              <div className="flex justify-between gap-2 text-label">
                <span>{event.kind}</span>
                <time className="text-tiny text-muted">{event.date}</time>
              </div>
              <p className="mt-1 text-tiny text-muted">{event.note}</p>
            </li>
          ))}
        </ol>
        {!history.length && <p className="mt-3 text-label text-muted">No subscription history.</p>}
      </Card>
      <Card title={<SaasTitle icon={StickyNote}>Customer notes</SaasTitle>}>
        <label className="mt-3 block text-label">
          Internal demo note
          <textarea
            aria-label="Customer notes"
            maxLength={1000}
            className="mt-1 min-h-24 w-full rounded-control border border-border bg-surface p-2 outline-accent"
            value={notes ?? customer.notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-tiny text-muted">Stored in this browser only.</span>
          <Button
            onClick={() => {
              const error = update((state) => {
                state.customers.find((c) => c.id === id)!.notes = (notes ?? customer.notes).trim();
              });
              setMessage(error || "Demo note saved.");
            }}
          >
            Save note
          </Button>
        </div>
        {message && (
          <p role="status" className="mt-2 text-label text-muted">
            {message}
          </p>
        )}
      </Card>
    </div>
  );
}
