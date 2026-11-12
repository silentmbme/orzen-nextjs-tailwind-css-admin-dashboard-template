"use client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { validateCoupon } from "../schemas/validation";
import { useCommerce } from "../hooks/use-commerce";
import type { Coupon } from "../types";
export function CouponForm({ coupon, onClose }: { coupon?: Coupon; onClose: () => void }) {
  const { data, update } = useCommerce();
  const [draft, setDraft] = useState<Coupon>(
      coupon || {
        id: "",
        code: "",
        kind: "Percentage",
        value: 10,
        minSpend: 0,
        maxUses: 100,
        uses: 0,
        expires: "2026-12-31",
        status: "Active",
      },
    ),
    [error, setError] = useState("");
  function save(event: FormEvent) {
    event.preventDefault();
    const message = validateCoupon(draft, data);
    if (message) {
      setError(message);
      return;
    }
    update((state) => {
      const item = { ...draft, id: draft.id || crypto.randomUUID() };
      const index = state.coupons.findIndex((c) => c.id === item.id);
      if (index >= 0) state.coupons[index] = item;
      else state.coupons.unshift(item);
    });
    onClose();
  }
  return (
    <form onSubmit={save} className="space-y-3">
      <label className="block space-y-1 text-label">
        Coupon code *
        <Input
          required
          maxLength={24}
          value={draft.code}
          onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase().trim() })}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-label">
          Discount type
          <Select
            aria-label="Discount type"
            value={draft.kind}
            onChange={(e) => setDraft({ ...draft, kind: e.target.value as Coupon["kind"] })}
          >
            <option>Percentage</option>
            <option>Fixed</option>
          </Select>
        </label>
        {(["value", "minSpend", "maxUses"] as const).map((key) => (
          <label key={key} className="space-y-1 text-label">
            {
              {
                value: draft.kind === "Percentage" ? "Discount (%) *" : "Discount ($) *",
                minSpend: "Minimum spend ($)",
                maxUses: "Usage limit *",
              }[key]
            }
            <Input
              required
              type="number"
              min={key === "minSpend" ? 0 : key === "maxUses" ? Math.max(draft.uses, 1) : 0.01}
              step={key === "maxUses" ? "1" : "0.01"}
              value={draft[key]}
              onChange={(e) => setDraft({ ...draft, [key]: Number(e.target.value) })}
            />
          </label>
        ))}
        <label className="space-y-1 text-label">
          Expiration *
          <Input
            required
            type="date"
            value={draft.expires}
            onChange={(e) => setDraft({ ...draft, expires: e.target.value })}
          />
        </label>
        <label className="space-y-1 text-label">
          Status
          <Select
            aria-label="Status"
            value={draft.status}
            onChange={(e) => setDraft({ ...draft, status: e.target.value as Coupon["status"] })}
          >
            <option>Active</option>
            <option>Paused</option>
          </Select>
        </label>
      </div>
      <p className="text-tiny text-muted">
        {draft.uses} uses recorded. Coupons are managed locally and are not applied to historical
        orders.
      </p>
      {error && (
        <p role="alert" className="text-danger">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save demo coupon</Button>
      </div>
    </form>
  );
}
