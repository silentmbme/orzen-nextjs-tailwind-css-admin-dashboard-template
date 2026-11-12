import Image from "next/image";
import { ArrowRight, Check, Sparkles, TrendingUp, Users, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MarketingContainer, HeroAction } from "@/components/marketing/marketing-container";
import { SaasProductPreview } from "./product-preview";
import { Card } from "@/components/ui/card";
import { seed } from "@/features/saas/seed";
import { revenueMetrics } from "@/features/saas/selectors";
import { money } from "@/features/saas/types";
export function SaasHero() {
  const metrics = revenueMetrics(seed, 30);
  return (
    <section className="saas-hero border-b border-border pb-10 pt-12 sm:pt-16">
      <div className="saas-hero-art" aria-hidden="true">
        <Image
          src="/images/marketing/saas-hero-architecture.webp"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
      </div>
      <MarketingContainer>
        <div className="mx-auto max-w-[820px] text-center">
          <Badge className="gap-2! rounded-full! px-3! py-1.5! text-[12px]!">
            <span className="saas-pulse h-1.5 w-1.5 rounded-full bg-accent" />
            <Sparkles size={11} className="text-accent" />
            The subscription workspace, brought into focus
            <ArrowRight size={11} />
          </Badge>
          <h1 className="mt-6 text-[38px] font-medium leading-[1.08] tracking-[-0.055em] sm:text-[54px] lg:text-[66px]">
            See what drives growth.
            <br className="hidden sm:block" />
            <span className="text-accent"> Know what to do next.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[570px] text-[14px] leading-7 text-muted">
            Revenue signals. Customer context. One clear next move.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <HeroAction href="/dashboards/saas">Explore the live demo</HeroAction>
            <HeroAction href="#product-tour" secondary>
              See the product
            </HeroAction>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px] text-muted">
            {["No account required", "Real product screens", "Light & dark, considered"].map(
              (text) => (
                <span key={text} className="flex items-center gap-1.5">
                  <Check size={14} className="text-accent" />
                  {text}
                </span>
              ),
            )}
          </div>
        </div>
        <div id="showcase" className="relative mx-auto mt-12 max-w-[1100px] pb-3 lg:mt-16">
          <div className="saas-preview-shadow rounded-2xl border border-border bg-surface-alt p-2 sm:p-3">
            <SaasProductPreview />
          </div>
          <Card
            className="saas-float absolute! -left-4 top-24 hidden! w-[178px] p-3! lg:block!"
            aria-label="Revenue signal"
          >
            <div className="flex justify-between text-[9px] text-muted">
              <span>Recurring momentum</span>
              <TrendingUp size={12} />
            </div>
            <p className="mt-2 text-[21px] font-semibold tracking-tight">
              {money(metrics.closing)}
            </p>
            <svg
              viewBox="0 0 150 40"
              role="img"
              aria-label="Illustrative revenue growth"
              className="mt-2 h-9 w-full"
            >
              <path
                d="M0 35L22 32L40 34L62 20L82 24L104 12L126 16L150 3"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
              />
            </svg>
            <p className="mt-1 text-[9px] text-muted">From the demo subscription ledger</p>
          </Card>
          <Card
            className="saas-float-delayed absolute! -right-4 top-40 hidden! w-[175px] p-3! lg:block!"
            aria-label="Subscription growth signal"
          >
            <Users size={17} className="mb-2 text-accent" />
            <p className="text-[11px] font-medium">Every subscription counts.</p>
            <p className="mt-2 text-[22px] font-semibold">
              {seed.subscriptions.filter((sub) => sub.status === "Active").length}
              <span className="ms-1 text-[9px] font-normal text-muted">active in the demo</span>
            </p>
            <div className="mt-3 flex gap-1" aria-hidden="true">
              {[24, 36, 30, 46, 39, 54, 60].map((height, index) => (
                <span
                  key={index}
                  className="w-3 rounded-sm bg-accent/25"
                  style={{ height: height / 3 }}
                />
              ))}
            </div>
          </Card>
          <Card
            className="saas-float absolute! -right-4 bottom-12 hidden! w-[210px] p-3! lg:block!"
            aria-label="Retention signal"
          >
            <div className="flex gap-2">
              <ShieldCheck size={18} className="shrink-0 text-accent" />
              <div>
                <p className="text-[11px] font-medium">Retention has a story.</p>
                <p className="mt-1 text-[9px] leading-5 text-muted">
                  Paid cohorts, customer context,
                  <br />
                  and a clearer next conversation.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </MarketingContainer>
    </section>
  );
}
