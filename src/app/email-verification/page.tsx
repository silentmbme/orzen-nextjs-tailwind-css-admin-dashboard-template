import { MailCheck } from "lucide-react";
import { AuthBrand } from "@/features/auth/components/auth-brand";
import { AuthThemeToggle } from "@/features/auth/components/auth-theme-toggle";
import { EmailVerificationForm } from "@/features/auth/components/email-verification-form";

export default function EmailVerificationPage() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-surface-alt px-4 py-10 text-foreground">
      <div className="pointer-events-none absolute -top-64 size-[540px] rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute right-4 top-4">
        <AuthThemeToggle />
      </div>
      <section
        className="relative w-full max-w-[420px] rounded-xl border border-card-border bg-surface p-6 sm:p-7"
        aria-labelledby="verification-heading"
      >
        <div className="mb-6 text-center">
          <AuthBrand />
          <span className="mx-auto mt-6 grid size-10 place-items-center rounded-xl bg-accent/10 text-accent">
            <MailCheck size={18} />
          </span>
          <h1 id="verification-heading" className="mt-4 text-[20px] font-semibold tracking-tight">
            Verify your email
          </h1>
          <p className="mt-1.5 text-[12px] leading-5 text-muted">
            Enter the six-digit code sent to{" "}
            <b className="font-medium text-foreground">name@company.com</b>.
          </p>
        </div>
        <EmailVerificationForm />
      </section>
    </main>
  );
}
