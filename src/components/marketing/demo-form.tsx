"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export function DemoForm({ kind = "newsletter" }: { kind?: "newsletter" | "lead" }) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      {kind === "lead" && (
        <>
          <label className="grid gap-1.5 text-[11px]">
            Full name
            <Input
              name="fullName"
              autoComplete="name"
              required
              maxLength={80}
              pattern=".*\S.*"
              placeholder="Alex Morgan"
            />
          </label>
          <label className="grid gap-1.5 text-[11px]">
            Company
            <Input
              name="company"
              autoComplete="organization"
              required
              maxLength={100}
              pattern=".*\S.*"
              placeholder="Your company"
            />
          </label>
        </>
      )}
      <label className="grid gap-1.5 text-[11px]">
        {kind === "lead" ? "Work email" : "Email address"}
        <Input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      </label>
      <label className="flex items-start gap-2 text-[10px] leading-5 text-muted">
        <input className="mt-1" type="checkbox" required name="consent" />I understand this is a
        demo form. My details won’t be sent or saved.
      </label>
      <Button type="submit" variant="primary">
        {kind === "lead" ? "Request a demo consultation" : "Join the demo list"}
      </Button>
      {submitted && (
        <p
          role="status"
          className="flex items-start gap-2 rounded-md border border-border bg-surface-alt p-3 text-[12px]"
        >
          <CheckCircle2 size={15} className="shrink-0 text-accent" />
          Demo submission received. No message was sent and no personal details were stored.
        </p>
      )}
    </form>
  );
}
