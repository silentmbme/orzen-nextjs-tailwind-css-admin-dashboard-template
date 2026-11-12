"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/user-avatar";

export function LockScreenForm() {
  const [password, setPassword] = useState(""),
    [visible, setVisible] = useState(false),
    [error, setError] = useState(""),
    [unlocked, setUnlocked] = useState(false);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) {
      setError("Enter your password to continue.");
      setUnlocked(false);
      return;
    }
    setError("");
    setUnlocked(true);
  };
  return (
    <form noValidate onSubmit={submit} className="grid gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-alt p-3">
        <span className="relative">
          <UserAvatar name="Alex Morgan" size={44} />
          <i className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-surface-alt bg-success" />
        </span>
        <span className="min-w-0">
          <b className="block truncate text-[12px]">Alex Morgan</b>
          <span className="block truncate text-[10px] text-muted">alex@orzen.dev</span>
        </span>
        <span className="ml-auto rounded-md border border-border bg-surface px-2 py-1 text-[9px] text-muted">
          Locked
        </span>
      </div>
      <FormField label="Password" htmlFor="lock-password">
        <div className="relative w-full">
          <LockKeyhole
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            id="lock-password"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
              setUnlocked(false);
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "lock-password-error" : undefined}
            placeholder="Enter your password"
            className={`h-10! w-full px-9! ${error ? "border-danger!" : ""}`}
          />
          <button
            type="button"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            onClick={() => setVisible((value) => !value)}
            className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-accent"
          >
            {visible ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {error && (
          <span id="lock-password-error" role="alert" className="text-[10px] text-danger">
            {error}
          </span>
        )}
      </FormField>
      <Button type="submit" variant="dark" className="h-10 w-full">
        Unlock workspace
      </Button>
      {unlocked && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-3 py-2 text-[10px] text-success"
        >
          <Check size={12} />
          Workspace access confirmed.
        </p>
      )}
      <div className="flex items-center justify-between gap-3 text-[11px]">
        <Link href="/forgot-password" className="font-medium text-accent hover:underline">
          Forgot password?
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-muted hover:text-foreground"
        >
          <ArrowLeft size={11} />
          Switch account
        </Link>
      </div>
    </form>
  );
}
