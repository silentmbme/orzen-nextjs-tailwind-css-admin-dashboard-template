import { ArrowUpRight, Blocks, Command, Layers3, Link2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "@/components/ui/user-avatar";
import { MarketingContainer, HeroAction } from "@/components/marketing/marketing-container";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import "./saas-effects.css";
import { SaasExperience } from "./components/experience-motion";
import { ProductCarousel } from "./components/product-carousel";
import { TestimonialsSection } from "./components/testimonials-section";
import { SaasHero } from "./components/saas-hero";
import { FeatureShowcase } from "./components/feature-showcase";
import { RevenueSection } from "./components/revenue-section";
import { RetentionSection } from "./components/retention-section";
import { WorkflowSection } from "./components/workflow-section";
import { IntegrationsSection } from "./components/integrations-section";
import { SaasPricing } from "./components/saas-pricing";

const brands = [
  {
    name: "Northline",
    icon: Blocks,
    category: "Product teams",
    detail: "A clearer revenue picture",
    href: "#revenue",
  },
  {
    name: "Forma Studio",
    icon: Command,
    category: "Creative studios",
    detail: "Every relationship in focus",
    href: "#retention",
  },
  {
    name: "Cloudwell",
    icon: Layers3,
    category: "Software businesses",
    detail: "One connected workspace",
    href: "#product-tour",
  },
  {
    name: "Olive Works",
    icon: Link2,
    category: "Service companies",
    detail: "A more thoughtful handover",
    href: "#solutions",
  },
];
const questions = [
  {
    question: "What can I explore in the live demo?",
    answer:
      "Revenue, subscriptions, customers, billing, plans, and usage. Every product link opens an existing demo page.",
  },
  {
    question: "Are these real product screens?",
    answer:
      "Yes. Captures show the existing SaaS application. Interactive previews use its fictional subscription ledger.",
  },
  {
    question: "Do I need an account or a credit card?",
    answer: "No. The demo is open. No authentication or payment is requested.",
  },
  {
    question: "Are the integrations connected?",
    answer: "No. They are clearly labeled design concepts, ready for your own implementation.",
  },
  {
    question: "How does annual demo pricing work?",
    answer:
      "Pay the equivalent of ten months. The annual total and rounded monthly equivalent are shown together. No subscription is created.",
  },
  {
    question: "What data does this page collect?",
    answer:
      "No personal details. Appearance preferences may be saved in your browser. All product records and prices are fictional.",
  },
];
export function SaasLanding() {
  return (
    <SaasExperience>
      <noscript>
        <style>{`.saas-experience .swiper-wrapper { flex-wrap: wrap!important; transform: none!important; gap: 16px; } .saas-experience .swiper-slide { width: 100%!important; }`}</style>
      </noscript>
      <SaasHero />
      <section
        id="teams"
        aria-labelledby="saas-teams-title"
        className="border-b border-border py-10 sm:py-12"
      >
        <MarketingContainer>
          <div className="grid items-center gap-7 lg:grid-cols-[.8fr_2fr]">
            <div>
              <p className="marketing-eyebrow mb-3!">Different teams. Shared momentum.</p>
              <h2
                id="saas-teams-title"
                className="text-[24px] font-medium leading-[1.2] tracking-[-0.04em] sm:text-[28px]"
              >
                Designed for teams
                <br />
                with a shared ambition.
              </h2>
              <p className="mt-3 max-w-sm text-[12px] leading-6 text-muted">
                Different ways of working. The same need for a clearer picture.
              </p>
              <div className="mt-4 flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  {["Alex Morgan", "Priya Shah", "Sofia Garcia"].map((name) => (
                    <UserAvatar
                      key={name}
                      name={name}
                      size={25}
                      className="border-2 border-surface"
                    />
                  ))}
                </div>
                <span className="text-[10px] text-muted">
                  Built around people, not just numbers.
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-border bg-surface-alt lg:grid-cols-4">
              {brands.map(({ name, icon: Icon, category, detail, href }, index) => (
                <Link
                  key={name}
                  href={href}
                  className={`group relative flex min-w-0 flex-col p-4 transition-colors hover:bg-surface focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-accent sm:p-5 ${index % 2 === 0 ? "border-r border-border" : ""} ${index < 2 ? "border-b border-border lg:border-b-0" : ""} ${index === 1 ? "lg:border-r lg:border-border" : ""}`}
                >
                  <span className="mb-5 flex items-start justify-between gap-2">
                    <span className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface text-accent transition-transform group-hover:-translate-y-1">
                      <Icon size={21} strokeWidth={1.7} />
                    </span>
                    <ArrowUpRight
                      size={13}
                      className="text-muted transition-colors group-hover:text-accent"
                    />
                  </span>
                  <span className="text-[16px] font-semibold tracking-[-0.035em]">{name}</span>
                  <span className="mt-1 text-[9px] font-medium uppercase tracking-[.08em] text-muted">
                    {category}
                  </span>
                  <span className="mt-4 border-t border-border pt-3 text-[10px] leading-5 text-muted">
                    {detail}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <p className="text-[9px] text-muted">
              Fictional demo organizations · illustrative use cases, not customer endorsements.
            </p>
            <Link
              href="#solutions"
              className="inline-flex items-center gap-1.5 text-[10px] font-medium text-accent"
            >
              Find your team’s perspective
              <ArrowRight size={12} />
            </Link>
          </div>
        </MarketingContainer>
      </section>
      <ProductCarousel />
      <FeatureShowcase />
      <RevenueSection />
      <RetentionSection />
      <WorkflowSection />
      <IntegrationsSection />
      <TestimonialsSection />
      <SaasPricing />
      <section id="faq" className="py-14 sm:py-20">
        <MarketingContainer>
          <div className="grid items-start gap-8 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="marketing-eyebrow">A few helpful details</p>
              <h2 className="marketing-heading">
                Good questions.
                <br />
                Clear answers.
              </h2>
              <p className="mt-4 max-w-xs text-[12px] leading-6 text-muted">
                The useful details, without the small print.
              </p>
              <Link
                href="/apps/saas/subscriptions"
                className="mt-5 inline-flex items-center gap-1 text-[11px] font-medium text-accent"
              >
                See the subscription workspace
                <ArrowUpRight size={12} />
              </Link>
            </div>
            <FaqAccordion items={questions} />
          </div>
        </MarketingContainer>
      </section>
      <section id="about" className="saas-night border-t border-border py-16 sm:py-20">
        <MarketingContainer>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="marketing-eyebrow">A more considered subscription business</p>
              <h2 className="marketing-heading">
                Your next chapter.
                <br />
                Already in focus.
              </h2>
              <p className="mt-4 text-[12px] leading-6 text-muted">
                See your business clearly. Move it forward together.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <HeroAction href="/dashboards/saas">Explore the demo</HeroAction>
              <HeroAction href="/apps/saas/plans" secondary>
                Compare plans
              </HeroAction>
            </div>
          </div>
          <p
            id="demo-info"
            className="mt-8 border-t border-border pt-4 text-[10px] leading-6 text-muted"
          >
            An Orzen product demonstration. All companies, prices, metrics, and integrations are
            fictional. No authentication, payments, or external integrations are connected. This
            page does not collect personal details.
          </p>
        </MarketingContainer>
      </section>
    </SaasExperience>
  );
}
