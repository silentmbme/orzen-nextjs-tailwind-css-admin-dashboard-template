import { Fingerprint, KeyRound, ShieldCheck, Smartphone } from "lucide-react";
import { AuthBrand } from "@/features/auth/components/auth-brand";
import { AuthThemeToggle } from "@/features/auth/components/auth-theme-toggle";
import { TwoFactorForm } from "@/features/auth/components/two-factor-form";

export default function SplitTwoFactorPage() {
  return (
    <main className="relative grid min-h-dvh bg-surface text-foreground lg:grid-cols-[minmax(420px,.78fr)_1.22fr]">
      <div className="absolute right-4 top-4 z-30">
        <AuthThemeToggle />
      </div>
      <section className="flex min-h-dvh items-center border-r border-border px-5 py-12 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-[420px]">
          <AuthBrand />
          <div className="mb-6 mt-10">
            <span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent">
              <Fingerprint size={19} />
            </span>
            <h1 className="mt-5 text-[24px] font-semibold tracking-tight">Confirm it’s you.</h1>
            <p className="mt-2 text-[12px] leading-5 text-muted">
              Complete the additional security check to access your workspace.
            </p>
          </div>
          <TwoFactorForm />
        </div>
      </section>
      <section
        className="relative hidden min-h-dvh overflow-hidden bg-surface-alt lg:grid lg:place-items-center lg:p-12"
        aria-label="Two-factor security overview"
      >
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="pointer-events-none absolute -right-24 top-10 size-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative w-full max-w-xl">
          <span className="text-[10px] font-medium uppercase tracking-[.12em] text-accent">
            Layered account protection
          </span>
          <h2 className="mt-3 max-w-lg text-[26px] font-semibold leading-tight">
            A second check keeps workspace access protected.
          </h2>
          <p className="mt-3 max-w-md text-[12px] leading-5 text-muted">
            Use an authenticator code or a saved recovery code to complete verification.
          </p>
          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {[
              [Smartphone, "Authenticator", "Time-based six-digit codes"],
              [KeyRound, "Recovery", "Backup access codes"],
              [ShieldCheck, "Trusted device", "Optional 30-day trust"],
            ].map(([Icon, title, note]) => {
              const I = Icon as typeof Smartphone;
              return (
                <div
                  key={String(title)}
                  className="rounded-xl border border-border bg-surface/85 p-4 backdrop-blur"
                >
                  <I size={17} className="text-accent" />
                  <b className="mt-5 block text-[11px]">{String(title)}</b>
                  <p className="mt-1 text-[9px] leading-4 text-muted">{String(note)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
