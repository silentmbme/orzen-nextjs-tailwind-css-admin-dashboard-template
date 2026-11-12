import { CheckCircle2, ShieldCheck } from "lucide-react";
import { AuthBrand } from "@/features/auth/components/auth-brand";
import { AuthThemeToggle } from "@/features/auth/components/auth-theme-toggle";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export default function SplitResetPasswordPage() {
  return (
    <main className="relative grid min-h-dvh bg-surface text-foreground lg:grid-cols-[minmax(420px,.78fr)_1.22fr]">
      <div className="absolute right-4 top-4 z-30">
        <AuthThemeToggle />
      </div>
      <section className="flex min-h-dvh items-center border-r border-border px-5 py-12 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-[410px]">
          <AuthBrand />
          <div className="mb-6 mt-10">
            <span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent">
              <ShieldCheck size={18} />
            </span>
            <h1 className="mt-5 text-[24px] font-semibold tracking-tight">Secure your account.</h1>
            <p className="mt-2 text-[12px] leading-5 text-muted">
              Create a new password to return to your workspace.
            </p>
          </div>
          <ResetPasswordForm />
        </div>
      </section>
      <section
        className="relative hidden min-h-dvh overflow-hidden bg-surface-alt lg:grid lg:place-items-center lg:p-12"
        aria-label="Password guidance"
      >
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="pointer-events-none absolute -right-24 top-16 size-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative w-full max-w-xl rounded-2xl border border-border bg-surface/90 p-8 backdrop-blur">
          <span className="text-[10px] font-medium uppercase tracking-[.12em] text-accent">
            Password guidance
          </span>
          <h2 className="mt-3 text-[25px] font-semibold leading-tight">
            Strong credentials. Clear safeguards.
          </h2>
          <p className="mt-3 max-w-md text-[12px] leading-5 text-muted">
            Use a unique password and keep your account recovery details current.
          </p>
          <div className="mt-8 grid gap-3">
            {[
              "Use at least 8 characters",
              "Avoid reused passwords",
              "Keep recovery access current",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface-alt p-3"
              >
                <span className="grid size-7 place-items-center rounded-full bg-success/10 text-success">
                  <CheckCircle2 size={13} />
                </span>
                <span className="text-[11px] font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
