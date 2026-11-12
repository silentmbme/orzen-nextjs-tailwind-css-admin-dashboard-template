"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, Check, KeyRound, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TwoFactorForm() {
  const [code, setCode] = useState(["", "", "", "", "", ""]),
    [recovery, setRecovery] = useState(""),
    [useRecovery, setUseRecovery] = useState(false),
    [remember, setRemember] = useState(true),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    inputs = useRef<Array<HTMLInputElement | null>>([]);
  const update = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1),
      next = [...code];
    next[index] = digit;
    setCode(next);
    setError("");
    setMessage("");
    if (digit && index < 5) inputs.current[index + 1]?.focus();
  };
  const paste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    if (!digits.length) return;
    event.preventDefault();
    setCode(Array.from({ length: 6 }, (_, index) => digits[index] ?? ""));
    setError("");
    inputs.current[Math.min(digits.length, 6) - 1]?.focus();
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (useRecovery) {
      if (!/^[A-Za-z0-9-]{8,}$/.test(recovery.trim())) {
        setError("Enter a valid recovery code.");
        setMessage("");
        return;
      }
    } else if (code.some((value) => !value)) {
      setError("Enter the complete six-digit code.");
      setMessage("");
      return;
    }
    setError("");
    setMessage("Identity confirmed successfully.");
  };
  const switchMode = () => {
    setUseRecovery((value) => !value);
    setError("");
    setMessage("");
  };
  return (
    <form noValidate onSubmit={submit} className="grid gap-4">
      {useRecovery ? (
        <div>
          <label htmlFor="recovery-code" className="mb-2 block text-[11px] font-medium">
            Recovery code
          </label>
          <div className="relative w-full">
            <KeyRound
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <Input
              id="recovery-code"
              autoFocus
              value={recovery}
              onChange={(event) => {
                setRecovery(event.target.value.toUpperCase());
                setError("");
                setMessage("");
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "two-factor-error" : undefined}
              placeholder="XXXX-XXXX-XXXX"
              className={`h-10! w-full pl-9! font-mono uppercase tracking-wider ${error ? "border-danger!" : ""}`}
            />
          </div>
        </div>
      ) : (
        <fieldset>
          <legend className="mb-2 flex items-center gap-2 text-[11px] font-medium">
            <Smartphone size={12} className="text-accent" />
            Authenticator code
          </legend>
          <div className="grid grid-cols-6 gap-2" onPaste={paste}>
            {code.map((value, index) => (
              <Input
                key={index}
                ref={(element) => {
                  inputs.current[index] = element;
                }}
                value={value}
                onChange={(event) => update(index, event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && !code[index] && index > 0)
                    inputs.current[index - 1]?.focus();
                  if (event.key === "ArrowLeft" && index > 0) {
                    event.preventDefault();
                    inputs.current[index - 1]?.focus();
                  }
                  if (event.key === "ArrowRight" && index < 5) {
                    event.preventDefault();
                    inputs.current[index + 1]?.focus();
                  }
                }}
                aria-label={`Authenticator digit ${index + 1}`}
                aria-invalid={Boolean(error)}
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                className={`h-11! min-h-11! w-full px-0! text-center text-[16px]! font-semibold ${error ? "border-danger!" : "focus:border-accent!"}`}
              />
            ))}
          </div>
        </fieldset>
      )}
      {error && (
        <p id="two-factor-error" role="alert" className="text-[10px] text-danger">
          {error}
        </p>
      )}
      <label className="flex cursor-pointer items-center gap-2 text-[11px]">
        <input
          type="checkbox"
          checked={remember}
          onChange={(event) => setRemember(event.target.checked)}
          className="size-3.5 rounded border-border accent-[var(--color-accent)]"
        />
        <span>Trust this device for 30 days</span>
      </label>
      <Button type="submit" variant="dark" className="h-10 w-full">
        Verify identity
      </Button>
      {message && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-3 py-2 text-[10px] text-success"
        >
          <Check size={12} />
          {message}
        </p>
      )}
      <button
        type="button"
        onClick={switchMode}
        className="text-[11px] font-medium text-accent hover:underline"
      >
        {useRecovery ? "Use authenticator code" : "Use a recovery code instead"}
      </button>
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
