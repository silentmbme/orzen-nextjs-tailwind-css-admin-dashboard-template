"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  FileCheck2,
  HelpCircle,
  ShieldCheck,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";
import { Input } from "@/components/ui/input";

const fieldLabel = "grid gap-1.5 text-[9px] font-medium";
function emailValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function passwordScore(value: string) {
  return [
    value.length >= 8,
    /[A-Z]/.test(value),
    /[a-z]/.test(value),
    /\d/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ].filter(Boolean).length;
}

export function ValidationExamples() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState("25");
  const [fileMessage, setFileMessage] = useState<{
    tone: "neutral" | "error" | "success";
    text: string;
  }>({ tone: "neutral", text: "PDF, PNG or JPG up to 2 MB." });
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "alex@company",
    password: "short",
    confirm: "",
  });
  const score = passwordScore(password);
  const strength = ["Very weak", "Very weak", "Weak", "Medium", "Strong", "Very strong"][score];
  const requirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "Upper and lowercase", met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { text: "At least one number", met: /\d/.test(password) },
    { text: "At least one symbol", met: /[^A-Za-z0-9]/.test(password) },
  ];
  const usernameState = useMemo(() => {
    if (!username)
      return { tone: "neutral", text: "3–20 characters; letters, numbers, and underscores." };
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username))
      return { tone: "error", text: "Use 3–20 letters, numbers, or underscores." };
    if (["admin", "support", "orzen"].includes(username.toLowerCase()))
      return { tone: "error", text: "This predefined demo username is already taken." };
    return { tone: "success", text: "Valid format and available in this local demo." };
  }, [username]);
  const phoneValid = /^\+?[0-9 ()-]{7,18}$/.test(phone);
  const quantityNumber = Number(quantity);
  const quantityValid = quantity !== "" && quantityNumber >= 10 && quantityNumber <= 100;
  const errors = submitted
    ? [
        { id: "summary-name", label: "Full name", invalid: form.name.trim().length < 2 },
        { id: "summary-email", label: "Email", invalid: !emailValid(form.email) },
        { id: "summary-password", label: "Password", invalid: passwordScore(form.password) < 3 },
        {
          id: "summary-confirm",
          label: "Confirm password",
          invalid: form.confirm !== form.password || !form.confirm,
        },
      ].filter((item) => item.invalid)
    : [];
  const tone = (value: string) =>
    value === "error" ? "text-danger" : value === "success" ? "text-success" : "text-muted";
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 lg:grid-cols-[1.1fr_.9fr]">
        <Card title="Interactive password strength" action={<Badge>{strength}</Badge>}>
          <div className="grid gap-4">
            <label className={fieldLabel}>
              Password
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  className="pr-9!"
                  aria-describedby="password-strength"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </label>
            <div id="password-strength">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((item) => (
                  <span
                    key={item}
                    className={`h-1.5 flex-1 rounded-full ${item <= score ? (score <= 2 ? "bg-danger" : score === 3 ? "bg-amber-500" : "bg-success") : "bg-surface-alt"}`}
                  />
                ))}
              </div>
              <p className="mt-2 text-[8px] text-muted">
                Local heuristic only; this is not a security guarantee.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {requirements.map((item) => (
                <span
                  key={item.text}
                  className={`flex items-center gap-2 text-[8px] ${item.met ? "text-success" : "text-muted"}`}
                >
                  <span
                    className={`grid size-4 place-items-center rounded-full ${item.met ? "bg-success/10" : "bg-surface-alt"}`}
                  >
                    {item.met ? <Check size={9} /> : "·"}
                  </span>
                  {item.text}
                </span>
              ))}
            </div>
            <label className={fieldLabel}>
              Confirm password
              <Input
                type="password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                aria-invalid={Boolean(confirm && confirm !== password) || undefined}
                className={
                  confirm ? (confirm === password ? "border-success!" : "border-danger!") : ""
                }
              />
              <span
                className={`text-[8px] font-normal ${!confirm ? "text-muted" : confirm === password ? "text-success" : "text-danger"}`}
              >
                {!confirm
                  ? "Re-enter the same password."
                  : confirm === password
                    ? "Passwords match."
                    : "Passwords do not match."}
              </span>
            </label>
          </div>
        </Card>

        <Card title="Username and phone validation">
          <div className="grid gap-5">
            <label className={fieldLabel}>
              Username
              <Input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Choose a username"
                aria-invalid={usernameState.tone === "error" || undefined}
                className={
                  usernameState.tone === "error"
                    ? "border-danger!"
                    : usernameState.tone === "success"
                      ? "border-success!"
                      : ""
                }
              />
              <span className={`text-[8px] font-normal ${tone(usernameState.tone)}`}>
                {usernameState.text}
              </span>
            </label>
            <label className={fieldLabel}>
              Phone number
              <div className="flex">
                <span className="grid place-items-center rounded-l-lg border border-r-0 border-border bg-surface-alt px-3 text-[8px]">
                  +1
                </span>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="555 014 2280"
                  className={`rounded-l-none! ${phone ? (phoneValid ? "border-success!" : "border-danger!") : ""}`}
                />
              </div>
              <span
                className={`text-[8px] font-normal ${!phone ? "text-muted" : phoneValid ? "text-success" : "text-danger"}`}
              >
                {!phone
                  ? "Basic format validation only; optional field."
                  : phoneValid
                    ? "Phone format looks valid."
                    : "Use 7–18 digits and common separators."}
              </span>
            </label>
            <label className={fieldLabel}>
              Seat quantity · 10 to 100
              <Input
                type="number"
                min="10"
                max="100"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                aria-invalid={!quantityValid}
                className={quantityValid ? "border-success!" : "border-danger!"}
              />
              <span
                className={`text-[8px] font-normal ${quantityValid ? "text-success" : "text-danger"}`}
              >
                {quantityValid ? "Quantity is within range." : "Enter a value between 10 and 100."}
              </span>
            </label>
          </div>
        </Card>
      </div>

      <Card title="Inline validation and error summary">
        <div className="grid gap-5 lg:grid-cols-[.7fr_1.3fr]">
          {submitted && (
            <aside
              role="alert"
              aria-labelledby="error-summary-title"
              className={`rounded-xl border p-4 ${errors.length ? "border-danger/30 bg-danger/5" : "border-success/30 bg-success/5"}`}
            >
              <div className="flex gap-2">
                {errors.length ? (
                  <AlertCircle size={15} className="text-danger" />
                ) : (
                  <CheckCircle2 size={15} className="text-success" />
                )}
                <div>
                  <b id="error-summary-title" className="text-[9px]">
                    {errors.length
                      ? `${errors.length} fields need attention`
                      : "Local validation complete"}
                  </b>
                  <p className="mt-1 text-[8px] text-muted">
                    {errors.length
                      ? "Review the fields listed below."
                      : "All showcased field rules currently pass."}
                  </p>
                </div>
              </div>
              {errors.length > 0 && (
                <ul className="mt-3 grid gap-1.5">
                  {errors.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => document.getElementById(item.id)?.focus()}
                        className="text-[8px] text-danger underline underline-offset-2"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          )}
          <form
            className={`grid gap-4 sm:grid-cols-2 ${!submitted ? "lg:col-span-2" : ""}`}
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
            noValidate
          >
            {(
              [
                ["name", "Full name", "text"],
                ["email", "Email", "email"],
                ["password", "Password", "password"],
                ["confirm", "Confirm password", "password"],
              ] as const
            ).map(([key, fieldName, type]) => {
              const item = errors.find((error) => error.id === `summary-${key}`);
              return (
                <label key={key} className={fieldLabel}>
                  {fieldName}
                  {key === "name" && " *"}
                  <Input
                    id={`summary-${key}`}
                    type={type}
                    value={form[key]}
                    onChange={(event) =>
                      setForm((value) => ({ ...value, [key]: event.target.value }))
                    }
                    aria-invalid={Boolean(item) || undefined}
                    aria-describedby={item ? `summary-${key}-error` : undefined}
                    className={item ? "border-danger!" : submitted ? "border-success!" : ""}
                  />
                  {item && (
                    <span
                      id={`summary-${key}-error`}
                      className="text-[8px] font-normal text-danger"
                    >
                      Please enter a valid {fieldName.toLowerCase()}.
                    </span>
                  )}
                </label>
              );
            })}
            <div className="flex justify-end gap-2 sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", email: "alex@company", password: "short", confirm: "" });
                }}
              >
                Reset demo
              </Button>
              <Button type="submit">Validate locally</Button>
            </div>
          </form>
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Tooltip validation guidance">
          <div className="grid gap-4">
            <label className={fieldLabel}>
              Workspace slug{" "}
              <details className="relative inline-block">
                <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-[8px] text-accent">
                  <HelpCircle size={11} />
                  View requirements
                </summary>
                <div className="mt-2 rounded-lg border border-border bg-surface-alt p-3 text-[8px] font-normal text-muted">
                  Use 3–32 lowercase letters, numbers, or hyphens. Requirements remain keyboard
                  accessible.
                </div>
              </details>
              <Input placeholder="northstar-team" />
            </label>
            <label className={fieldLabel}>
              API callback URL
              <div className="flex items-center gap-2">
                <Input type="url" placeholder="https://app.example.com/callback" />
                <button
                  type="button"
                  aria-label="Callback URL help"
                  className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <HelpCircle size={13} />
                </button>
              </div>
              <span className="text-[8px] font-normal text-muted">
                HTTPS is recommended for production callbacks.
              </span>
            </label>
          </div>
        </Card>

        <Card title="Local file validation">
          <label className="grid cursor-pointer place-items-center rounded-xl border border-dashed border-border bg-surface-alt p-6 text-center hover:border-accent">
            <UploadCloud size={20} className="text-accent" />
            <b className="mt-2 text-[9px]">Choose a document</b>
            <span className="mt-1 text-[8px] text-muted">PDF, PNG or JPG up to 2 MB</span>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return setFileMessage({ tone: "neutral", text: "No file selected." });
                const validType = ["application/pdf", "image/png", "image/jpeg"].includes(
                  file.type,
                );
                if (!validType)
                  return setFileMessage({
                    tone: "error",
                    text: "Unsupported file type. Choose PDF, PNG or JPG.",
                  });
                if (file.size > 2 * 1024 * 1024)
                  return setFileMessage({
                    tone: "error",
                    text: "File is larger than the 2 MB local limit.",
                  });
                setFileMessage({ tone: "success", text: `${file.name} passes the local checks.` });
              }}
            />
          </label>
          <div
            role="status"
            className={`mt-3 flex items-center gap-2 rounded-lg border p-3 text-[8px] ${fileMessage.tone === "error" ? "border-danger/30 bg-danger/5 text-danger" : fileMessage.tone === "success" ? "border-success/30 bg-success/5 text-success" : "border-border text-muted"}`}
          >
            {fileMessage.tone === "success" ? (
              <FileCheck2 size={13} />
            ) : fileMessage.tone === "error" ? (
              <XCircle size={13} />
            ) : (
              <ShieldCheck size={13} />
            )}{" "}
            {fileMessage.text}
          </div>
        </Card>
      </div>

      <Card title="Multi-step validation preview" action={<Badge>Visual preview</Badge>}>
        <div className="grid gap-4">
          <div className="flex">
            {[
              { n: 1, label: "Account", state: "done" },
              { n: 2, label: "Profile", state: "current" },
              { n: 3, label: "Billing", state: "error" },
              { n: 4, label: "Review", state: "upcoming" },
            ].map((step, index) => (
              <div key={step.n} className="relative flex flex-1 flex-col items-center text-center">
                <span
                  className={`relative z-10 grid size-7 place-items-center rounded-full border text-[8px] ${step.state === "done" ? "border-success bg-success text-white" : step.state === "current" ? "border-accent bg-accent text-white" : step.state === "error" ? "border-danger bg-surface text-danger" : "border-border bg-surface text-muted"}`}
                >
                  {step.state === "done" ? (
                    <Check size={11} />
                  ) : step.state === "error" ? (
                    "!"
                  ) : (
                    step.n
                  )}
                </span>
                {index < 3 && (
                  <i
                    className={`absolute left-1/2 top-3.5 h-px w-full ${step.state === "done" ? "bg-success" : "bg-border"}`}
                  />
                )}
                <b className="mt-2 text-[8px]">{step.label}</b>
                <small
                  className={`text-[7px] ${step.state === "error" ? "text-danger" : "text-muted"}`}
                >
                  {step.state === "done"
                    ? "Complete"
                    : step.state === "current"
                      ? "In progress"
                      : step.state === "error"
                        ? "2 errors"
                        : "Upcoming"}
                </small>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-[8px] text-muted">
            This is a visual stepper preview only. The complete Form Wizard is intentionally outside
            this page.
          </div>
        </div>
      </Card>
    </div>
  );
}
