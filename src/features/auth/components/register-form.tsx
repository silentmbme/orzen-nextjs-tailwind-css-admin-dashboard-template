"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SocialAuthButtons } from "./social-auth-buttons";

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  terms?: string;
};
export function RegisterForm() {
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [terms, setTerms] = useState(false),
    [visible, setVisible] = useState(false),
    [errors, setErrors] = useState<Errors>({}),
    [message, setMessage] = useState("");
  const clear = (key: keyof Errors) => setErrors((value) => ({ ...value, [key]: undefined }));
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 8) next.password = "Use at least 8 characters.";
    if (confirm !== password) next.confirm = "Passwords do not match.";
    if (!terms) next.terms = "Accept the terms to continue.";
    setErrors(next);
    setMessage(Object.keys(next).length ? "" : "Registration details validated successfully.");
  };
  return (
    <form noValidate onSubmit={submit} className="grid gap-3.5">
      <FormField label="Full name" htmlFor="register-name">
        <div className="relative w-full">
          <UserRound
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            id="register-name"
            autoComplete="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clear("name");
              setMessage("");
            }}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "register-name-error" : undefined}
            placeholder="Your full name"
            className={`h-10! w-full pl-9! ${errors.name ? "border-danger!" : ""}`}
          />
        </div>
        {errors.name && (
          <span id="register-name-error" role="alert" className="text-[10px] text-danger">
            {errors.name}
          </span>
        )}
      </FormField>
      <FormField label="Email address" htmlFor="register-email">
        <div className="relative w-full">
          <Mail
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              clear("email");
              setMessage("");
            }}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            placeholder="name@company.com"
            className={`h-10! w-full pl-9! ${errors.email ? "border-danger!" : ""}`}
          />
        </div>
        {errors.email && (
          <span id="register-email-error" role="alert" className="text-[10px] text-danger">
            {errors.email}
          </span>
        )}
      </FormField>
      <FormField label="Password" htmlFor="register-password">
        <div className="relative w-full">
          <LockKeyhole
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            id="register-password"
            type={visible ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              clear("password");
              clear("confirm");
              setMessage("");
            }}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "register-password-error" : undefined}
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
        {errors.password && (
          <span id="register-password-error" role="alert" className="text-[10px] text-danger">
            {errors.password}
          </span>
        )}
      </FormField>
      <FormField label="Confirm password" htmlFor="register-confirm">
        <div className="relative w-full">
          <LockKeyhole
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <Input
            id="register-confirm"
            type={visible ? "text" : "password"}
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => {
              setConfirm(event.target.value);
              clear("confirm");
              setMessage("");
            }}
            aria-invalid={Boolean(errors.confirm)}
            aria-describedby={errors.confirm ? "register-confirm-error" : undefined}
            placeholder="Repeat your password"
            className={`h-10! w-full pl-9! ${errors.confirm ? "border-danger!" : ""}`}
          />
        </div>
        {errors.confirm && (
          <span id="register-confirm-error" role="alert" className="text-[10px] text-danger">
            {errors.confirm}
          </span>
        )}
      </FormField>
      <div>
        <label className="flex cursor-pointer items-start gap-2 text-[11px] leading-4">
          <input
            type="checkbox"
            checked={terms}
            onChange={(event) => {
              setTerms(event.target.checked);
              clear("terms");
            }}
            className="mt-0.5 size-3.5 rounded border-border accent-[var(--color-accent)]"
          />
          <span>
            I agree to the{" "}
            <Link href="/register?view=terms" className="font-medium text-accent hover:underline">
              terms and privacy policy
            </Link>
            .
          </span>
        </label>
        {errors.terms && (
          <span role="alert" className="mt-1 block text-[10px] text-danger">
            {errors.terms}
          </span>
        )}
      </div>
      <Button type="submit" variant="dark" className="h-10 w-full">
        Create account
      </Button>
      <SocialAuthButtons mode="register" />
      {message && (
        <p
          role="status"
          className="rounded-lg border border-success/20 bg-success/10 px-3 py-2 text-[10px] leading-4 text-success"
        >
          {message}
        </p>
      )}
      <p className="text-center text-[11px] text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground hover:text-accent">
          Sign in
        </Link>
      </p>
    </form>
  );
}
