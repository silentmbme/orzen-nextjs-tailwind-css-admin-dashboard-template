"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { UserAvatar } from "@/components/ui/user-avatar";
import { IconButton } from "@/components/ui/icon-button";
import { MarketingContainer } from "@/components/marketing/marketing-container";
import "swiper/css";
const stories = [
  {
    name: "Alex Morgan",
    role: "Operations lead",
    company: "Fictional design business",
    quote: "A revenue change becomes a better conversation, not another spreadsheet.",
  },
  {
    name: "Priya Shah",
    role: "Customer success lead",
    company: "Fictional software studio",
    quote: "The relationship finally feels as visible as the renewal.",
  },
  {
    name: "Sofia Garcia",
    role: "Finance manager",
    company: "Fictional creative agency",
    quote: "One shared picture. A much more considered handover.",
  },
  {
    name: "Daniel Kim",
    role: "Product operations",
    company: "Fictional digital service",
    quote: "Less switching between views. More shared understanding.",
  },
];
export function TestimonialsSection() {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [active, setActive] = useState(0);
  const [end, setEnd] = useState(false);
  const [pages, setPages] = useState(stories.length);
  return (
    <section id="stories" className="border-y border-border bg-surface-alt py-14 sm:py-20">
      <MarketingContainer>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="marketing-eyebrow">A human perspective</p>
            <h2 className="marketing-heading">
              Built for the conversations
              <br />
              behind the work.
            </h2>
            <p className="mt-3 text-[11px] text-muted">
              Fictional testimonials, written to demonstrate the product story.
            </p>
          </div>
          <div className="flex gap-2">
            <IconButton
              aria-label="Previous testimonial"
              disabled={active === 0}
              onClick={() => swiper?.slidePrev()}
            >
              <ArrowLeft size={15} />
            </IconButton>
            <IconButton
              aria-label="Next testimonial"
              disabled={end}
              onClick={() => swiper?.slideNext()}
            >
              <ArrowRight size={15} />
            </IconButton>
          </div>
        </div>
        <Swiper
          role="region"
          tabIndex={0}
          className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          modules={[A11y, Keyboard]}
          keyboard={{ enabled: true, onlyInViewport: true }}
          onSwiper={(instance) => {
            setSwiper(instance);
            setEnd(instance.isEnd);
            setPages(instance.snapGrid.length);
          }}
          onSlideChange={(instance) => {
            setActive(instance.activeIndex);
            setEnd(instance.isEnd);
          }}
          onResize={(instance) => {
            setEnd(instance.isEnd);
            setPages(instance.snapGrid.length);
          }}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2 } }}
          speed={450}
          aria-label="Fictional customer stories"
        >
          {stories.map((story) => (
            <SwiperSlide key={story.name}>
              <figure className="m-0 flex h-full flex-col rounded-lg border border-border bg-surface p-6">
                <Quote size={22} className="mb-5 text-accent" />
                <blockquote className="min-h-[115px] flex-1 text-[22px] font-medium leading-8 tracking-tight">
                  “{story.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <UserAvatar name={story.name} size={36} />
                  <div>
                    <p className="text-[12px] font-medium">{story.name}</p>
                    <p className="mt-1 text-[10px] text-muted">
                      {story.role} · {story.company}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
        <div role="group" aria-label="Choose testimonial" className="mt-5 flex gap-2">
          {stories.slice(0, pages).map((story, index) => (
            <button
              key={story.name}
              type="button"
              aria-label={`Read ${story.name} testimonial`}
              aria-pressed={active === index}
              onClick={() => swiper?.slideTo(index)}
              className={`h-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${active === index ? "w-7 bg-accent" : "w-2 bg-border"}`}
            />
          ))}
        </div>
      </MarketingContainer>
    </section>
  );
}
