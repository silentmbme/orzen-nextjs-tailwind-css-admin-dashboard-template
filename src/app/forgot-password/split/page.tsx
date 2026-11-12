import { KeyRound, ShieldCheck } from "lucide-react";
import { AuthBrand } from "@/features/auth/components/auth-brand";
import { AuthThemeToggle } from "@/features/auth/components/auth-theme-toggle";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function SplitForgotPasswordPage() {
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
              <KeyRound size={18} />
            </span>
            <h1 className="mt-5 text-[24px] font-semibold tracking-tight">Recover your account.</h1>
            <p className="mt-2 text-[12px] leading-5 text-muted">
              Enter the email associated with your workspace to continue.
            </p>
          </div>
          <ForgotPasswordForm />
        </div>
      </section>
      <section
        className="relative hidden min-h-dvh overflow-hidden bg-surface-alt lg:grid lg:place-items-center lg:p-12"
        aria-label="Account security information"
      >
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="pointer-events-none absolute -left-20 top-16 size-80 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative w-full max-w-xl rounded-2xl border border-border bg-surface/90 p-7 backdrop-blur">
          <span className="grid size-11 place-items-center rounded-xl bg-accent text-white">
            <ShieldCheck size={20} />
          </span>
          <span className="mt-8 block text-[10px] font-medium uppercase tracking-[.12em] text-accent">
            Account security
          </span>
          <h2 className="mt-2 max-w-md text-[24px] font-semibold leading-tight">
            A focused path back to your workspace.
          </h2>
          <p className="mt-3 max-w-md text-[12px] leading-5 text-muted">
            Password recovery keeps the interface clear, responsive, and consistent across light and
            dark themes.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["01", "Verify email"],
              ["02", "Reset password"],
              ["03", "Return securely"],
            ].map(([number, label]) => (
              <div key={number} className="rounded-xl border border-border bg-surface-alt p-3">
                <span className="text-[9px] font-semibold text-accent">{number}</span>
                <b className="mt-5 block text-[11px]">{label}</b>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
