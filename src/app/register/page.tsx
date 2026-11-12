import { AuthBrand } from "@/features/auth/components/auth-brand";
import { AuthThemeToggle } from "@/features/auth/components/auth-theme-toggle";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-surface-alt px-4 py-10 text-foreground">
      <div className="pointer-events-none absolute -top-64 size-[540px] rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute right-4 top-4">
        <AuthThemeToggle />
      </div>
      <section
        className="relative w-full max-w-[430px] rounded-xl border border-card-border bg-surface p-6 sm:p-7"
        aria-labelledby="register-heading"
      >
        <div className="mb-5 text-center">
          <AuthBrand />
          <h1 id="register-heading" className="mt-5 text-[20px] font-semibold tracking-tight">
            Create your workspace
          </h1>
          <p className="mt-1.5 text-[12px] text-muted">
            Create your account and set up your workspace.
          </p>
        </div>
        <RegisterForm />
      </section>
    </main>
  );
}
