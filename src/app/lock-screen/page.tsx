import { LockKeyhole } from "lucide-react";
import { AuthBrand } from "@/features/auth/components/auth-brand";
import { AuthThemeToggle } from "@/features/auth/components/auth-theme-toggle";
import { LockScreenForm } from "@/features/auth/components/lock-screen-form";

export default function LockScreenPage() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-surface-alt px-4 py-10 text-foreground">
      <div className="pointer-events-none absolute -top-64 size-[540px] rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute right-4 top-4">
        <AuthThemeToggle />
      </div>
      <section
        className="relative w-full max-w-[410px] rounded-xl border border-card-border bg-surface p-6 sm:p-7"
        aria-labelledby="lock-heading"
      >
        <div className="mb-6 text-center">
          <AuthBrand />
          <span className="mx-auto mt-6 grid size-10 place-items-center rounded-xl bg-accent/10 text-accent">
            <LockKeyhole size={18} />
          </span>
          <h1 id="lock-heading" className="mt-4 text-[20px] font-semibold tracking-tight">
            Workspace locked
          </h1>
          <p className="mt-1.5 text-[12px] leading-5 text-muted">
            Enter your password to continue your session.
          </p>
        </div>
        <LockScreenForm />
      </section>
    </main>
  );
}
