import { AuthBrand } from "@/features/auth/components/auth-brand";
import { AuthThemeToggle } from "@/features/auth/components/auth-theme-toggle";
import { DashboardPreview } from "@/features/auth/components/dashboard-preview";
import { LoginForm } from "@/features/auth/components/login-form";

export default function SplitLoginPage() {
  return (
    <main className="relative grid min-h-dvh bg-surface text-foreground lg:grid-cols-[minmax(420px,.78fr)_1.22fr]">
      <div className="absolute right-4 top-4 z-30">
        <AuthThemeToggle />
      </div>
      <section className="flex min-h-dvh items-center border-r border-border px-5 py-12 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-[410px]">
          <AuthBrand />
          <div className="mb-6 mt-10">
            <span className="text-[10px] font-medium uppercase tracking-[.12em] text-accent">
              Business workspace
            </span>
            <h1 className="mt-2 text-[24px] font-semibold tracking-tight">Welcome back.</h1>
            <p className="mt-2 text-[12px] leading-5 text-muted">
              Access your dashboards, customer operations, and team workflows.
            </p>
          </div>
          <LoginForm />
        </div>
      </section>
      <section
        className="relative hidden min-h-dvh overflow-hidden bg-surface-alt lg:grid lg:place-items-center lg:p-10 xl:p-16"
        aria-label="Dashboard preview"
      >
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="pointer-events-none absolute -left-24 top-10 size-80 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 size-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative w-full">
          <div className="mx-auto mb-8 max-w-xl text-center">
            <span className="text-[10px] font-medium uppercase tracking-[.12em] text-accent">
              Clarity at every layer
            </span>
            <h2 className="mt-2 text-[22px] font-semibold">
              Your operating picture, ready when you are.
            </h2>
            <p className="mt-2 text-[11px] leading-5 text-muted">
              A focused workspace for revenue, customers, and delivery performance.
            </p>
          </div>
          <DashboardPreview />
        </div>
      </section>
    </main>
  );
}
