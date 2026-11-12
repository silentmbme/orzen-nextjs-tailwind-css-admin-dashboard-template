"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SocialAuthButtons } from "./social-auth-buttons";

type Errors = { email?: string; password?: string };
export function LoginForm() {
  const [email, setEmail] = useState("demo@orzen.dev"),
    [password, setPassword] = useState("demo1234"),
    [remember, setRemember] = useState(true),
    [visible, setVisible] = useState(false),
    [errors, setErrors] = useState<Errors>({}),
    [message, setMessage] = useState("");
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must contain at least 6 characters.";
    setErrors(next);
    setMessage(Object.keys(next).length ? "" : "Sign-in details validated successfully.");
  };
  return (
    <form noValidate onSubmit={submit} className="grid gap-4">
      <FormField label="Email address" htmlFor="login-email">
        <div className="relative w-full">
          <Mail
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors((value) => ({ ...value, email: undefined }));
              setMessage("");
            }}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            className={`h-10! w-full pl-9! ${errors.email ? "border-danger!" : ""}`}
          />
        </div>
        {errors.email && (
          <span id="login-email-error" role="alert" className="text-[10px] text-danger">
            {errors.email}
          </span>
        )}
      </FormField>
      <FormField label="Password" htmlFor="login-password">
        <div className="relative w-full">
          <LockKeyhole
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            id="login-password"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrors((value) => ({ ...value, password: undefined }));
              setMessage("");
            }}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            className={`h-10! w-full px-9! ${errors.password ? "border-danger!" : ""}`}
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
        {errors.password && (
          <span id="login-password-error" role="alert" className="text-[10px] text-danger">
            {errors.password}
          </span>
        )}
      </FormField>
      <div className="flex items-center justify-between gap-3 text-[11px]">
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="size-3.5 rounded border-border accent-[var(--color-accent)]"
          />
          <span>Remember me</span>
        </label>
        <Link href="/login?view=forgot" className="font-medium text-accent hover:underline">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" variant="dark" className="h-10 w-full">
        Sign in
      </Button>
      <SocialAuthButtons mode="login" />
      {message && (
        <p
          role="status"
          className="rounded-lg border border-success/20 bg-success/10 px-3 py-2 text-[10px] leading-4 text-success"
        >
          {message}
        </p>
      )}
      <p className="text-center text-[11px] text-muted">
        New to the workspace?{" "}
        <Link href="/login?view=register" className="font-medium text-foreground hover:text-accent">
          Create an account
        </Link>
      </p>
    </form>
  );
}
