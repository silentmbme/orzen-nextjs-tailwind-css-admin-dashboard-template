"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { IconButton } from "@/components/ui/icon-button";
import { MarketingContainer } from "@/components/marketing/marketing-container";
import "swiper/css";
const views = [
  {
    title: "Subscription Analytics",
    image: "dashboard",
    summary: "Understand recurring revenue and what is changing behind the headline.",
    features: ["MRR movement", "Paid retention", "Plan performance"],
    href: "/dashboards/saas",
  },
  {
    title: "Customer Management",
    image: "customers",
    summary: "Keep the account, subscription, and customer relationship in the same conversation.",
    features: ["Customer directory", "Account context", "Subscription history"],
    href: "/apps/saas/customers",
  },
  {
    title: "Billing & Invoices",
    image: "billing",
    summary: "Give billing decisions the context of the business behind each payment.",
    features: ["Invoice overview", "Payment status", "Local invoice preview"],
    href: "/apps/saas/billing",
  },
  {
    title: "Usage Analytics",
    image: "analytics",
    summary: "See how the demo workspace uses seats, API capacity, and storage.",
    features: ["Usage trends", "Plan allowances", "Customer activity"],
    href: "/apps/saas/analytics",
  },
  {
    title: "Pricing Plans",
    image: "plans",
    summary: "Compare the existing product plans and explore their allowance details.",
    features: ["Plan comparison", "Billing cycles", "Capacity details"],
    href: "/apps/saas/plans",
  },
];
export function ProductCarousel() {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [active, setActive] = useState(0);
  const view = views[active];
  return (
    <section id="product-tour" className="border-b border-border py-14 sm:py-20">
      <MarketingContainer>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-xl">
            <p className="marketing-eyebrow">One connected product</p>
            <h2 className="marketing-heading">
              Five views.
              <br />
              One connected business.
            </h2>
          </div>
          <div className="flex gap-2">
            <IconButton
              aria-label="Previous product view"
              disabled={active === 0}
              onClick={() => swiper?.slidePrev()}
            >
              <ArrowLeft size={16} />
            </IconButton>
            <IconButton
              aria-label="Next product view"
              disabled={active === views.length - 1}
              onClick={() => swiper?.slideNext()}
            >
              <ArrowRight size={16} />
            </IconButton>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface-alt p-2 sm:p-4">
          <Swiper
            role="region"
            tabIndex={0}
            className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            modules={[A11y, Keyboard]}
            keyboard={{ enabled: true, onlyInViewport: true }}
            onSwiper={setSwiper}
            onSlideChange={(instance) => setActive(instance.activeIndex)}
            speed={450}
            spaceBetween={20}
            slidesPerView={1}
            a11y={{
              containerMessage: "SaaS product screenshots",
              slideLabelMessage: "View {{index}} of {{slidesLength}}",
            }}
            aria-label="SaaS product screenshots"
          >
            {views.map((item) => (
              <SwiperSlide key={item.image}>
                <div className="overflow-hidden rounded-lg border border-border bg-surface">
                  <div className="flex justify-between gap-2 border-b border-border px-3 py-2 text-[9px] text-muted">
                    <span>Orzen / {item.title}</span>
                    <span>Actual product capture</span>
                  </div>
                  {["light", "dark"].map((theme) => (
                    <div
                      key={theme}
                      className={theme === "dark" ? "hidden dark:block" : "dark:hidden"}
                    >
                      <Image
                        unoptimized
                        src={`/images/marketing/saas-${item.image}-${theme}.webp`}
                        alt={`${item.title} in the existing Orzen SaaS application (${theme} appearance)`}
                        width={1204}
                        height={item.image === "dashboard" ? 680 : 600}
                        sizes="(max-width: 768px) 100vw, 1100px"
                        className="hidden h-auto w-full sm:block"
                      />
                      <Image
                        unoptimized
                        src={`/images/marketing/saas-${item.image}-${theme}-mobile.webp`}
                        alt={`Mobile ${item.title} product view`}
                        width={390}
                        height={item.image === "dashboard" ? 770 : 650}
                        sizes="100vw"
                        className="h-auto w-full sm:hidden"
                      />
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="mt-5 grid items-start gap-4 lg:grid-cols-[1fr_1fr]">
          <div aria-live="polite">
            <p className="text-[10px] text-muted">0{active + 1} / 05</p>
            <h3 className="mt-1 text-[21px] font-medium tracking-tight">{view.title}</h3>
            <p className="mt-2 max-w-md text-[12px] leading-6 text-muted">{view.summary}</p>
          </div>
          <div>
            <ul className="flex flex-wrap gap-2">
              {view.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-2 text-[10px]"
                >
                  <Check size={11} className="text-accent" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={view.href}
              className="mt-4 inline-flex items-center gap-1 text-[11px] font-medium text-accent"
            >
              Open {view.title} demo
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Choose product view">
          {views.map((item, index) => (
            <button
              key={item.image}
              type="button"
              onClick={() => swiper?.slideTo(index)}
              aria-label={`Show ${item.title}`}
              aria-pressed={active === index}
              className={`h-2 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${active === index ? "w-8 bg-accent" : "w-3 bg-border hover:bg-accent/40"}`}
            />
          ))}
        </div>
        <noscript>
          <div className="mt-5 grid gap-2">
            {views.map((item) => (
              <Link key={item.image} href={item.href}>
                {item.title} — {item.summary}
              </Link>
            ))}
          </div>
        </noscript>
      </MarketingContainer>
    </section>
  );
}
