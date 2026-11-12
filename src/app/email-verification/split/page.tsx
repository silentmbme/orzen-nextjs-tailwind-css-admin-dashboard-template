import { CheckCircle2, MailCheck, ShieldCheck } from "lucide-react";
import { AuthBrand } from "@/features/auth/components/auth-brand";
import { AuthThemeToggle } from "@/features/auth/components/auth-theme-toggle";
import { EmailVerificationForm } from "@/features/auth/components/email-verification-form";

export default function SplitEmailVerificationPage() {
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
              <MailCheck size={18} />
            </span>
            <h1 className="mt-5 text-[24px] font-semibold tracking-tight">Check your inbox.</h1>
            <p className="mt-2 text-[12px] leading-5 text-muted">
              Enter the six-digit code sent to{" "}
              <b className="font-medium text-foreground">name@company.com</b>.
            </p>
          </div>
          <EmailVerificationForm />
        </div>
      </section>
      <section
        className="relative hidden min-h-dvh overflow-hidden bg-surface-alt lg:grid lg:place-items-center lg:p-12"
        aria-label="Verification guidance"
      >
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="pointer-events-none absolute -left-24 top-16 size-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative w-full max-w-xl">
          <span className="grid size-12 place-items-center rounded-2xl bg-accent text-white">
            <ShieldCheck size={21} />
          </span>
          <span className="mt-8 block text-[10px] font-medium uppercase tracking-[.12em] text-accent">
            Secure verification
          </span>
          <h2 className="mt-3 max-w-lg text-[26px] font-semibold leading-tight">
            One quick step before your workspace is ready.
          </h2>
          <p className="mt-3 max-w-md text-[12px] leading-5 text-muted">
            Email verification helps keep account access accurate and protected.
          </p>
          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            {[
              "Six-digit verification",
              "Keyboard and paste support",
              "Clear validation feedback",
              "Responsive in every theme",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface/85 p-3 backdrop-blur"
              >
                <CheckCircle2 size={15} className="shrink-0 text-success" />
                <span className="text-[11px] font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
