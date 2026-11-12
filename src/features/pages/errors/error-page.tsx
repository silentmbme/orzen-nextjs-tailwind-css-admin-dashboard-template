import {
  AlertTriangle,
  Cloud,
  FileWarning,
  LockKeyhole,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { ErrorActions, MaintenanceCountdown } from "./error-actions";

export type ErrorCode = 400 | 403 | 404 | 500 | 503 | "maintenance" | "coming-soon";

const copy: Record<
  ErrorCode,
  { title: string; description: string; secondary?: "back" | "retry" }
> = {
  400: {
    title: "Bad Request",
    description: "The request could not be understood. Please review your input and try again.",
    secondary: "back",
  },
  403: { title: "Access Denied", description: "You do not have permission to view this resource." },
  404: {
    title: "Page Not Found",
    description: "The page you are looking for may have been moved or no longer exists.",
    secondary: "back",
  },
  500: {
    title: "Something Went Wrong",
    description: "An unexpected error occurred. Please try again later.",
    secondary: "retry",
  },
  503: {
    title: "Service Unavailable",
    description: "This service is temporarily unavailable. Please check back later.",
    secondary: "retry",
  },
  maintenance: {
    title: "We'll be right back",
    description: "This part of the workspace is undergoing maintenance. Please check back later.",
    secondary: "retry",
  },
  "coming-soon": {
    title: "Something new is on its way",
    description:
      "We're putting the finishing touches on this experience. Explore the dashboard in the meantime.",
  },
};

function PaperLines({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-2.5">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={`block h-2 rounded-full bg-slate-200/80 dark:bg-slate-600/70 ${index === count - 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}

function ErrorIllustration({ code }: { code: ErrorCode }) {
  if (code === 400)
    return (
      <div
        aria-hidden="true"
        className="relative mx-auto h-[210px] w-[280px] max-w-full sm:h-[230px]"
      >
        <div className="absolute left-8 top-5 h-40 w-32 -rotate-12 rounded-lg bg-slate-100 shadow-sm dark:bg-slate-700/60" />
        <div className="absolute left-[78px] top-3 h-44 w-36 rotate-6 rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-600 dark:bg-slate-800">
          <span className="mb-5 block h-2 w-16 rounded-full bg-slate-300 dark:bg-slate-500" />
          <PaperLines />
          <div className="mt-5 flex items-center gap-2 rounded-md bg-amber-50 p-2 text-amber-500 dark:bg-amber-500/10">
            <AlertTriangle size={15} />
            <span className="h-1.5 w-12 rounded-full bg-amber-300 dark:bg-amber-500/40" />
          </div>
        </div>
        <span className="absolute right-5 top-8 h-14 w-1 -rotate-[35deg] rounded-full bg-slate-400/70 dark:bg-slate-500" />
        <span className="absolute bottom-2 left-9 size-7 rotate-12 rounded-md border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700" />
        <FileWarning
          className="absolute bottom-3 right-3 text-slate-300 dark:text-slate-500"
          size={30}
          strokeWidth={1.4}
        />
      </div>
    );

  if (code === 403)
    return (
      <div
        aria-hidden="true"
        className="relative mx-auto h-[210px] w-[280px] max-w-full sm:h-[230px]"
      >
        <div className="absolute left-12 top-5 h-44 w-36 rounded-lg border border-slate-200/80 bg-slate-50 p-5 shadow-sm dark:border-slate-600 dark:bg-slate-800">
          <span className="mb-6 block h-2 w-16 rounded-full bg-slate-300 dark:bg-slate-500" />
          <PaperLines count={5} />
        </div>
        <div className="absolute bottom-4 right-10 grid size-24 place-items-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-700">
          <LockKeyhole size={44} className="text-slate-400 dark:text-slate-300" strokeWidth={1.5} />
        </div>
        <span className="absolute bottom-6 left-5 grid size-8 place-items-center rounded-full bg-accent/10 text-accent">
          <ShieldCheck size={18} />
        </span>
        <span className="absolute right-8 top-3 size-8 rounded-full bg-slate-100 dark:bg-slate-700/60" />
      </div>
    );

  if (code === 404)
    return (
      <div
        aria-hidden="true"
        className="relative mx-auto h-[210px] w-[280px] max-w-full sm:h-[230px]"
      >
        <div className="absolute left-7 top-8 h-36 w-28 -rotate-7 rounded-lg bg-slate-200/60 dark:bg-slate-700/50" />
        <div className="absolute left-14 top-4 h-40 w-36 rotate-3 rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-600 dark:bg-slate-800">
          <span className="mb-5 block h-2 w-16 rounded-full bg-slate-300 dark:bg-slate-500" />
          <PaperLines count={5} />
        </div>
        <span className="absolute bottom-7 right-9 grid size-20 place-items-center rounded-full border-[6px] border-slate-800 bg-white text-slate-800 shadow-sm dark:border-slate-300 dark:bg-slate-800 dark:text-slate-300">
          <Search size={37} strokeWidth={1.8} />
        </span>
        <span className="absolute bottom-1 right-5 h-12 w-3 -rotate-[35deg] rounded-full bg-slate-800 dark:bg-slate-300" />
      </div>
    );

  if (code === 500)
    return (
      <div
        aria-hidden="true"
        className="relative mx-auto h-[210px] w-[300px] max-w-full sm:h-[230px]"
      >
        <Cloud
          className="absolute left-5 top-1 text-slate-100 dark:text-slate-700/60"
          size={260}
          strokeWidth={1.3}
        />
        <div className="absolute bottom-4 left-8 flex items-end gap-2.5">
          {[72, 118, 94].map((height, index) => (
            <div
              key={index}
              style={{ height }}
              className="w-[67px] rounded-t-lg border border-slate-200/80 bg-white p-2 shadow-sm dark:border-slate-600 dark:bg-slate-800"
            >
              <div className="grid gap-2">
                {Array.from({ length: index === 1 ? 5 : 3 }, (_, row) => (
                  <span
                    key={row}
                    className="flex items-center gap-1.5 rounded-sm bg-slate-100 px-1 py-1 dark:bg-slate-700"
                  >
                    <span className="h-1 w-8 rounded-full bg-slate-300 dark:bg-slate-500" />
                    <span className="size-1 rounded-full bg-accent/70" />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <span className="absolute bottom-1 right-4 size-2 rounded-full bg-rose-400" />
      </div>
    );

  if (code === "maintenance")
    return (
      <div
        aria-hidden="true"
        className="relative mx-auto h-[210px] w-[300px] max-w-full sm:h-[230px]"
      >
        <div className="absolute left-1/2 top-4 grid size-36 -translate-x-1/2 place-items-center rounded-full border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
          <Wrench
            size={68}
            strokeWidth={1.2}
            className="rotate-[-25deg] text-slate-400 dark:text-slate-300"
          />
        </div>
        <span className="absolute bottom-8 left-7 h-3 w-[246px] rounded-full bg-slate-200 dark:bg-slate-700" />
        <span className="absolute bottom-11 left-11 h-12 w-5 bg-slate-300/70 [clip-path:polygon(50%_0,100%_100%,0_100%)] dark:bg-slate-600" />
        <span className="absolute bottom-11 right-11 h-12 w-5 bg-slate-300/70 [clip-path:polygon(50%_0,100%_100%,0_100%)] dark:bg-slate-600" />
        <span className="absolute right-4 top-14 size-3 rounded-full bg-accent/50" />
      </div>
    );

  if (code === "coming-soon")
    return (
      <div
        aria-hidden="true"
        className="relative mx-auto grid h-[210px] w-[300px] max-w-full place-items-center sm:h-[230px]"
      >
        <div className="absolute size-44 rounded-full border border-slate-200 dark:border-slate-700" />
        <div className="absolute size-32 rounded-full border border-dashed border-slate-300 dark:border-slate-600" />
        <span className="absolute left-12 top-9 size-3 rounded-full bg-accent/40" />
        <span className="absolute bottom-7 right-11 size-2 rounded-full bg-blue-400" />
        <Rocket
          size={88}
          strokeWidth={1.2}
          className="relative rotate-[30deg] text-slate-400 dark:text-slate-300"
        />
        <Sparkles size={25} strokeWidth={1.5} className="absolute right-10 top-7 text-accent/70" />
      </div>
    );

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-[210px] w-[300px] max-w-full sm:h-[230px]"
    >
      <span className="absolute bottom-3 left-8 h-7 w-3 rounded-sm bg-slate-300 dark:bg-slate-600" />
      <span className="absolute bottom-3 right-8 h-7 w-3 rounded-sm bg-slate-300 dark:bg-slate-600" />
      <div className="absolute bottom-10 left-4 flex h-14 w-[270px] items-center justify-around overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-600 dark:bg-slate-700">
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className="h-7 w-7 -rotate-45 border-l-[9px] border-t-[9px] border-white/90 dark:border-slate-500"
          />
        ))}
      </div>
      <div className="absolute bottom-[95px] left-9 h-14 w-8 bg-slate-200/60 [clip-path:polygon(50%_0,100%_100%,0_100%)] dark:bg-slate-600/80" />
      <span className="absolute bottom-[87px] left-7 h-2 w-12 rounded-full bg-slate-300 dark:bg-slate-600" />
      <div className="absolute bottom-[95px] right-10 h-20 w-0.5 bg-slate-600 dark:bg-slate-400" />
      <span className="absolute bottom-[170px] right-5 grid size-12 rotate-45 place-items-center rounded-md border border-slate-300 bg-white text-slate-500 shadow-sm dark:border-slate-500 dark:bg-slate-800 dark:text-slate-300">
        <AlertTriangle size={21} className="-rotate-45" />
      </span>
    </div>
  );
}

export function ErrorPage({ code }: { code: ErrorCode }) {
  const item = copy[code];
  return (
    <section
      aria-labelledby="error-heading"
      className="mx-auto flex min-h-[min(680px,calc(100dvh-48px))] w-full max-w-[820px] flex-col items-center justify-center text-center"
    >
      <ErrorIllustration code={code} />
      <p
        className={`mt-4 font-semibold leading-none tracking-tight text-accent ${typeof code === "number" ? "text-[6rem]" : "text-[12px] uppercase tracking-[.16em]"}`}
        aria-hidden="true"
      >
        {typeof code === "number" ? code : code === "maintenance" ? "Maintenance" : "Coming soon"}
      </p>
      <h1
        id="error-heading"
        className="mt-5 text-[clamp(19px,2.5vw,25px)] font-semibold leading-tight text-foreground"
      >
        <span className="sr-only">{typeof code === "number" ? `${code} — ` : ""}</span>
        {item.title}
      </h1>
      <p className="mt-3 max-w-[420px] text-[13px] leading-6 text-muted">{item.description}</p>
      {code === "maintenance" && <MaintenanceCountdown />}
      <div className="mt-7">
        <ErrorActions
          secondary={item.secondary}
          retryLabel={code === "maintenance" ? "Check Again" : undefined}
        />
      </div>
    </section>
  );
}
