import { Clock3, LockKeyhole, ShieldCheck } from "lucide-react";
import { AuthBrand } from "@/features/auth/components/auth-brand";
import { AuthThemeToggle } from "@/features/auth/components/auth-theme-toggle";
import { LockScreenForm } from "@/features/auth/components/lock-screen-form";

export default function SplitLockScreenPage() {
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
              <LockKeyhole size={18} />
            </span>
            <h1 className="mt-5 text-[24px] font-semibold tracking-tight">Welcome back, Alex.</h1>
            <p className="mt-2 text-[12px] leading-5 text-muted">
              Your workspace was locked after a period of inactivity.
            </p>
          </div>
          <LockScreenForm />
        </div>
      </section>
      <section
        className="relative hidden min-h-dvh overflow-hidden bg-surface-alt lg:grid lg:place-items-center lg:p-12"
        aria-label="Workspace security status"
      >
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="pointer-events-none absolute -left-24 top-16 size-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative w-full max-w-xl rounded-2xl border border-border bg-surface/90 p-8 backdrop-blur">
          <span className="grid size-12 place-items-center rounded-2xl bg-accent text-white">
            <ShieldCheck size={21} />
          </span>
          <span className="mt-8 block text-[10px] font-medium uppercase tracking-[.12em] text-accent">
            Session protection
          </span>
          <h2 className="mt-3 max-w-lg text-[26px] font-semibold leading-tight">
            Your workspace stays protected while you’re away.
          </h2>
          <p className="mt-3 max-w-md text-[12px] leading-5 text-muted">
            Unlocking restores access to the current workspace without changing your account.
          </p>
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-border bg-surface-alt p-4">
            <span className="grid size-9 place-items-center rounded-lg bg-accent/10 text-accent">
              <Clock3 size={16} />
            </span>
            <span>
              <b className="block text-[11px]">Session paused</b>
              <small className="text-[9px] text-muted">Locked after 15 minutes of inactivity</small>
            </span>
            <span className="ml-auto size-2 rounded-full bg-amber-500" />
          </div>
        </div>
      </section>
    </main>
  );
}
