"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState(""),
    [error, setError] = useState(""),
    [sent, setSent] = useState(false);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      setSent(false);
      return;
    }
    setError("");
    setSent(true);
  };
  return (
    <form noValidate onSubmit={submit} className="grid gap-4">
      <FormField label="Email address" htmlFor="recovery-email">
        <div className="relative w-full">
          <Mail
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            id="recovery-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
              setSent(false);
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "recovery-email-error" : undefined}
            placeholder="name@company.com"
            className={`h-10! w-full pl-9! ${error ? "border-danger!" : ""}`}
          />
        </div>
        {error && (
          <span id="recovery-email-error" role="alert" className="text-[10px] text-danger">
            {error}
          </span>
        )}
      </FormField>
      <Button type="submit" variant="dark" className="h-10 w-full">
        Send reset instructions
      </Button>
      {sent && (
        <p
          role="status"
          className="rounded-lg border border-success/20 bg-success/10 px-3 py-2 text-[10px] leading-4 text-success"
        >
          Reset instructions are ready for {email}.
        </p>
      )}
      <Link
        href="/login"
        className="mx-auto inline-flex items-center gap-1.5 text-[11px] font-medium text-muted hover:text-foreground"
      >
        <ArrowLeft size={12} />
        Back to sign in
      </Link>
    </form>
  );
}
