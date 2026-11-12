"use client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "./saas-ui";
import { useSaas } from "../hooks/use-saas";
import { planError } from "../schemas/validation";
import type { Plan } from "../types";
export function PlanForm({ plan, onClose }: { plan?: Plan; onClose: () => void }) {
  const { data, update } = useSaas(),
    [draft, setDraft] = useState<Plan>(
      plan || {
        id: "",
        name: "",
        description: "",
        monthly: 29,
        yearly: 290,
        seats: 5,
        api: 10000,
        storage: 20,
        features: ["Core workspace"],
        active: true,
      },
    ),
    [features, setFeatures] = useState(plan?.features.join("\n") || "Core workspace"),
    [error, setError] = useState("");
  function save(event: FormEvent) {
    event.preventDefault();
    const saved = {
      ...draft,
      name: draft.name.trim(),
      description: draft.description.trim(),
      features: [
        ...new Set(
          features
            .split("\n")
            .map((f) => f.trim())
            .filter(Boolean),
        ),
      ],
    };
    const invalid = planError(saved, data);
    if (invalid) {
      setError(invalid);
      return;
    }
    const error = update((state) => {
      const next = { ...saved, id: saved.id || crypto.randomUUID() },
        index = state.plans.findIndex((p) => p.id === next.id);
      if (index < 0) state.plans.push(next);
      else state.plans[index] = next;
    });
    if (error) setError(error);
    else onClose();
  }
  return (
    <form className="space-y-3" onSubmit={save}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Plan name *">
          <Input
            required
            maxLength={40}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        </Field>
        <Field label="Description *">
          <Input
            required
            maxLength={150}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
        </Field>
        {(["monthly", "yearly", "seats", "api", "storage"] as const).map((key) => (
          <Field
            key={key}
            label={
              {
                monthly: "Monthly price ($) *",
                yearly: "Yearly price ($) *",
                seats: "Seat limit *",
                api: "Monthly API limit *",
                storage: "Storage limit (GB) *",
              }[key]
            }
          >
            <Input
              required
              type="number"
              min={key === "monthly" || key === "yearly" ? 0.01 : 1}
              step={key === "monthly" || key === "yearly" || key === "storage" ? ".01" : "1"}
              value={draft[key]}
              onChange={(e) => setDraft({ ...draft, [key]: Number(e.target.value) })}
            />
          </Field>
        ))}
      </div>
      <Field label="Features · one per line *">
        <textarea
          required
          maxLength={1000}
          className="min-h-24 rounded-control border border-border bg-surface p-2 outline-accent"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
        />
      </Field>
      <label className="flex items-center gap-2 text-label">
        <input
          type="checkbox"
          checked={draft.active}
          onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
          className="accent-accent"
        />
        Available for new subscriptions
      </label>
      <p className="text-tiny text-muted">
        Price changes apply to new agreements and plan/cycle changes. Existing subscription prices
        and historical invoices are preserved.
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
        <Button type="submit">Save demo plan</Button>
      </div>
    </form>
  );
}
