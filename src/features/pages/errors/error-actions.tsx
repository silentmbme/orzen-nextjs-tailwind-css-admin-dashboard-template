"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorActions({
  secondary,
  retryLabel = "Reload Preview",
}: {
  secondary?: "back" | "retry";
  retryLabel?: string;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Link href="/dashboards/sales" className="ui-button ui-button--dark ui-button--lg px-5!">
        Go to Dashboard <ArrowRight size={14} aria-hidden="true" />
      </Link>
      {secondary === "back" && (
        <Button
          variant="outline" size="lg"
          onClick={() => {
            if (window.history.length > 1) router.back();
            else router.push("/dashboards/sales");
          }}
        >
          <ArrowLeft size={14} aria-hidden="true" /> Go Back
        </Button>
      )}
      {secondary === "retry" && (
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RotateCcw size={14} aria-hidden="true" /> {retryLabel}
        </Button>
      )}
    </div>
  );
}

const REMINDER_SECONDS = 10 * 60;

export function MaintenanceCountdown() {
  const [remaining, setRemaining] = useState(REMINDER_SECONDS);

  useEffect(() => {
    const deadline = Date.now() + REMINDER_SECONDS * 1000;
    const interval = window.setInterval(() => {
      setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const days = Math.floor(remaining / 86400)
    .toString()
    .padStart(2, "0");
  const hours = (Math.floor(remaining / 3600) % 24).toString().padStart(2, "0");
  const minutes = (Math.floor(remaining / 60) % 60).toString().padStart(2, "0");
  const seconds = (remaining % 60).toString().padStart(2, "0");

  const units = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <div className="mt-6 w-full max-w-[360px] rounded-lg border border-border bg-surface-alt/70 px-4 py-3">
      <p className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-muted">
        <Timer size={13} aria-hidden="true" />
        Next retry reminder
      </p>
      <div
        role="timer"
        aria-label={`${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds until retry reminder`}
        className="mt-3 grid grid-cols-4 gap-2 tabular-nums"
      >
        {units.map(({ label, value }) => (
          <div
            key={label}
            className="min-w-0 rounded-md border border-border bg-surface px-1 py-2 text-center"
          >
            <span className="block text-[18px] font-semibold leading-none text-foreground">
              {value}
            </span>
            <span className="mt-1.5 block text-[10px] font-medium uppercase tracking-wide text-muted">
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-muted">
        {remaining === 0
          ? "You can check again now."
          : "This timer does not predict when service will return."}
      </p>
    </div>
  );
}
