import { AuthBrand } from "@/features/auth/components/auth-brand";
import { AuthThemeToggle } from "@/features/auth/components/auth-theme-toggle";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-surface-alt px-4 py-10 text-foreground">
      <div className="pointer-events-none absolute -top-64 size-[540px] rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute right-4 top-4">
        <AuthThemeToggle />
      </div>
      <section
        className="relative w-full max-w-[410px] rounded-xl border border-card-border bg-surface p-6 sm:p-7"
        aria-labelledby="login-heading"
      >
        <div className="mb-6 text-center">
          <AuthBrand />
          <h1 id="login-heading" className="mt-6 text-[20px] font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1.5 text-[12px] text-muted">
            Sign in to continue to your business workspace.
          </p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
