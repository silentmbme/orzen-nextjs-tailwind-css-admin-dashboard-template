"use client";
import { useState } from "react";
import { Blocks, Database, FileSpreadsheet, Mail, Webhook } from "lucide-react";
import { MarketingContainer } from "@/components/marketing/marketing-container";
const concepts = [
  {
    icon: Mail,
    name: "Email",
    category: "Communicate",
    text: "Bring customer conversations into the account context. A design concept; no email provider is connected.",
    position: "left-[2%] top-3",
  },
  {
    icon: Webhook,
    name: "Webhooks",
    category: "Automate",
    text: "Imagine event-driven handoffs between your own services. No webhook is configured or executed in this demo.",
    position: "right-[2%] top-3",
  },
  {
    icon: Database,
    name: "Data workspace",
    category: "Organize",
    text: "A shared customer record could connect your business tools. This node illustrates a possible architecture only.",
    position: "left-[2%] bottom-3",
  },
  {
    icon: FileSpreadsheet,
    name: "Reporting",
    category: "Analyze",
    text: "Give reporting a coherent source of account context. No external reporting integration is connected.",
    position: "right-[2%] bottom-3",
  },
];
export function IntegrationsSection() {
  const [active, setActive] = useState(0);
  const concept = concepts[active];
  return (
    <section id="integrations" className="saas-integrations border-y border-border py-14 sm:py-20">
      <MarketingContainer>
        <div className="grid items-center gap-8 lg:grid-cols-[.85fr_1.2fr]">
          <div>
            <p className="marketing-eyebrow">Room for your ecosystem</p>
            <h2 className="marketing-heading">
              Connected by context.
              <br />
              Designed around you.
            </h2>
            <p className="mt-4 max-w-md text-[13px] leading-7 text-muted">
              One workspace. The connections you choose.
            </p>
            <p className="mt-4 text-[10px] text-muted">
              Integration concepts only. No partner brands or connected external services.
            </p>
          </div>
          <div className="min-w-0 rounded-xl border border-border bg-surface p-3 sm:p-5">
            <div className="relative h-[310px] sm:h-[340px]">
              <svg
                viewBox="0 0 500 340"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full"
              >
                <path
                  d="M100 55L250 170L400 55M100 285L250 170L400 285"
                  fill="none"
                  stroke="var(--accent)"
                  strokeOpacity=".4"
                  strokeWidth="1.5"
                  className="saas-connector"
                />
              </svg>
              <div className="absolute left-1/2 top-1/2 z-10 flex w-[120px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-xl border border-accent/30 bg-surface-alt px-3 py-4 text-center">
                <Blocks size={24} className="text-accent" />
                <p className="text-[12px] font-medium">Orzen</p>
                <p className="text-[9px] text-muted">Shared context</p>
              </div>
              {concepts.map(({ icon: Icon, name, category, position }, index) => (
                <button
                  type="button"
                  key={name}
                  aria-pressed={active === index}
                  aria-describedby="integration-detail"
                  title={`Explore ${name} integration concept`}
                  onClick={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  className={`saas-node absolute z-10 flex w-[118px] flex-col items-center gap-1.5 rounded-lg border bg-surface px-2 py-3 focus-visible:outline-2 focus-visible:outline-accent sm:w-[145px] ${position} ${active === index ? "border-accent/60" : "border-border"}`}
                >
                  <Icon size={18} className="text-accent" />
                  <span className="text-[11px] font-medium">{name}</span>
                  <span className="text-[9px] text-muted">{category}</span>
                </button>
              ))}
            </div>
            <div
              id="integration-detail"
              role="status"
              className="min-h-24 rounded-lg border border-border bg-surface-alt p-3"
            >
              <p className="text-[11px] font-medium">
                {concept.name} / {concept.category}
              </p>
              <p className="mt-1 text-[10px] leading-5 text-muted">{concept.text}</p>
            </div>
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
