"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

type Errors = { password?: string; confirm?: string };
export function ResetPasswordForm() {
  const [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [visible, setVisible] = useState(false),
    [errors, setErrors] = useState<Errors>({}),
    [saved, setSaved] = useState(false);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Errors = {};
    if (password.length < 8) next.password = "Use at least 8 characters.";
    if (confirm !== password) next.confirm = "Passwords do not match.";
    setErrors(next);
    setSaved(!Object.keys(next).length);
  };
  const clear = (key: keyof Errors) => {
    setErrors((value) => ({ ...value, [key]: undefined }));
    setSaved(false);
  };
  return (
    <form noValidate onSubmit={submit} className="grid gap-4">
      <FormField label="New password" htmlFor="reset-password">
        <div className="relative w-full">
          <LockKeyhole
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            id="reset-password"
            type={visible ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              clear("password");
              clear("confirm");
            }}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "reset-password-error" : "password-requirements"}
            placeholder="At least 8 characters"
            className={`h-10! w-full px-9! ${errors.password ? "border-danger!" : ""}`}
          />
          <button
            type="button"
            aria-label={visible ? "Hide passwords" : "Show passwords"}
            aria-pressed={visible}
            onClick={() => setVisible((value) => !value)}
            className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-accent"
          >
            {visible ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {errors.password ? (
          <span id="reset-password-error" role="alert" className="text-[10px] text-danger">
            {errors.password}
          </span>
        ) : (
          <span id="password-requirements" className="text-[10px] text-muted">
            Use 8 or more characters.
          </span>
        )}
      </FormField>
      <FormField label="Confirm new password" htmlFor="reset-confirm">
        <div className="relative w-full">
          <LockKeyhole
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            id="reset-confirm"
            type={visible ? "text" : "password"}
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => {
              setConfirm(event.target.value);
              clear("confirm");
            }}
            aria-invalid={Boolean(errors.confirm)}
            aria-describedby={errors.confirm ? "reset-confirm-error" : undefined}
            placeholder="Repeat your new password"
            className={`h-10! w-full pl-9! ${errors.confirm ? "border-danger!" : ""}`}
          />
        </div>
        {errors.confirm && (
          <span id="reset-confirm-error" role="alert" className="text-[10px] text-danger">
            {errors.confirm}
          </span>
        )}
      </FormField>
      <Button type="submit" variant="dark" className="h-10 w-full">
        Reset password
      </Button>
      {saved && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-3 py-2 text-[10px] leading-4 text-success"
        >
          <Check size={12} />
          Password details validated successfully.
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
