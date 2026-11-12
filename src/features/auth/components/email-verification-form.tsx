"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EmailVerificationForm() {
  const [code, setCode] = useState(["", "", "", "", "", ""]),
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
  const key = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !code[index] && index > 0) inputs.current[index - 1]?.focus();
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < 5) {
      event.preventDefault();
      inputs.current[index + 1]?.focus();
    }
  };
  const paste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    if (!digits.length) return;
    event.preventDefault();
    setCode(Array.from({ length: 6 }, (_, index) => digits[index] ?? ""));
    setError("");
    setMessage("");
    inputs.current[Math.min(digits.length, 6) - 1]?.focus();
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (code.some((value) => !value)) {
      setError("Enter the complete six-digit code.");
      setMessage("");
      return;
    }
    setError("");
    setMessage("Email address verified successfully.");
  };
  return (
    <form noValidate onSubmit={submit} className="grid gap-4">
      <fieldset>
        <legend className="mb-2 text-[11px] font-medium">Verification code</legend>
        <div className="grid grid-cols-6 gap-2" onPaste={paste}>
          {code.map((value, index) => (
            <Input
              key={index}
              ref={(element) => {
                inputs.current[index] = element;
              }}
              value={value}
              onChange={(event) => update(index, event.target.value)}
              onKeyDown={(event) => key(index, event)}
              aria-label={`Verification digit ${index + 1}`}
              aria-invalid={Boolean(error)}
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              className={`h-11! min-h-11! w-full px-0! text-center text-[16px]! font-semibold ${error ? "border-danger!" : "focus:border-accent!"}`}
            />
          ))}
        </div>
        {error && (
          <p role="alert" className="mt-2 text-[10px] text-danger">
            {error}
          </p>
        )}
      </fieldset>
      <Button type="submit" variant="dark" className="h-10 w-full">
        Verify email
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
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px]">
        <button
          type="button"
          onClick={() => {
            setCode(["", "", "", "", "", ""]);
            setMessage("A new verification code is ready.");
            setError("");
            inputs.current[0]?.focus();
          }}
          className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline"
        >
          <RefreshCw size={11} />
          Resend code
        </button>
        <Link href="/register" className="text-muted hover:text-foreground">
          Change email
        </Link>
      </div>
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
