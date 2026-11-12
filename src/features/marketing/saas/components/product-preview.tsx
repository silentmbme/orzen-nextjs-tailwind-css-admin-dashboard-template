import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
export function SaasProductPreview() {
  return (
    <figure className="m-0 overflow-hidden rounded-xl border border-border bg-surface p-1.5 sm:p-2">
      <div className="flex items-center justify-between gap-3 rounded-t-lg border border-border bg-surface-alt px-3 py-2.5">
        <span className="hidden items-center gap-1 sm:flex" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-muted/30" />
          ))}
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-muted">
          <LockKeyhole size={10} />
          Orzen / SaaS command center
        </span>
        <Link
          href="/dashboards/saas"
          className="flex items-center gap-1 text-[10px] font-medium text-accent"
        >
          Live demo
          <ArrowUpRight size={11} />
        </Link>
      </div>
      <div className="overflow-hidden rounded-b-lg border-x border-b border-border">
        <Image
          unoptimized
          src="/images/marketing/saas-dashboard-light.webp"
          alt="Actual Orzen SaaS dashboard showing recurring revenue, revenue movements, cohort retention, and plan performance"
          width={1204}
          height={680}
          priority
          className="hidden! h-auto w-full sm:block! dark:sm:hidden!"
        />
        <Image
          unoptimized
          src="/images/marketing/saas-dashboard-dark.webp"
          alt="Orzen SaaS dashboard in dark mode with revenue and retention analytics"
          width={1204}
          height={680}
          priority
          className="hidden! h-auto w-full dark:sm:block!"
        />
        <Image
          unoptimized
          src="/images/marketing/saas-dashboard-light-mobile.webp"
          alt="Mobile SaaS dashboard preview with recurring revenue and a revenue trend chart"
          width={390}
          height={770}
          priority
          className="block h-auto w-full sm:hidden! dark:hidden!"
        />
        <Image
          unoptimized
          src="/images/marketing/saas-dashboard-dark-mobile.webp"
          alt="Mobile SaaS dashboard preview in dark mode"
          width={390}
          height={770}
          priority
          className="hidden! h-auto w-full dark:block! dark:sm:hidden!"
        />
      </div>
      <figcaption className="flex flex-wrap justify-between gap-2 px-2 pb-1 pt-3 text-[9px] text-muted">
        <span>Actual product capture · fictional subscription data</span>
        <span>Revenue → retention → next action</span>
      </figcaption>
    </figure>
  );
}
