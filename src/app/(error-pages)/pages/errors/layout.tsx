import type { ReactNode } from "react";
import { AuthThemeToggle } from "@/features/auth/components/auth-theme-toggle";

export default function ErrorPagesLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-surface-alt p-4 sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 size-[420px] rounded-full bg-accent/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-44 -right-24 size-[430px] rounded-full bg-blue-400/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[14%] top-[12%] size-2 rounded-full bg-accent/40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[16%] left-[12%] size-1.5 rounded-full bg-blue-400/50"
      />
      <div className="absolute right-4 top-4 z-20 sm:right-8 sm:top-8">
        <AuthThemeToggle />
      </div>
      <div className="relative z-10 w-full max-w-[820px]">{children}</div>
    </main>
  );
}
