"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { MarketingContainer } from "@/components/marketing/marketing-container";

const stories = [
  {
    name: "Alex Morgan",
    role: "Sales director",
    company: "Northline",
    title: "A clearer picture, every morning.",
    quote:
      "We start the day knowing which conversations matter and where we can make the biggest difference. Everyone has a clear next step.",
    detail: "Clarity across the pipeline",
    color: "purple",
  },
  {
    name: "Sofia Garcia",
    role: "Operations lead",
    company: "Forma Studio",
    title: "Good handovers build trust.",
    quote:
      "The next person has the context they need to keep every customer conversation moving. Our customers feel remembered, every time.",
    detail: "Connected customer conversations",
    color: "blue",
  },
  {
    name: "Daniel Kim",
    role: "Account manager",
    company: "Cedar Labs",
    title: "A pipeline that feels purposeful.",
    quote:
      "We spend less time collecting updates and more time finding the right next step. It brings a little more intention to the whole sales day.",
    detail: "More room for meaningful work",
    color: "coral",
  },
  {
    name: "Priya Shah",
    role: "Customer success",
    company: "Olive Works",
    title: "Room for stronger relationships.",
    quote:
      "Small details stay with the customer story, so we can show up prepared. It makes collaboration feel natural, even across a growing team.",
    detail: "Better context, stronger relationships",
    color: "pink",
  },
];

export function CrmTestimonialSlider() {
  const [active, setActive] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const touchStart = useRef<number | null>(null);
  const move = (direction: number) =>
    setActive((current) => (current + direction + stories.length) % stories.length);

  useEffect(() => {
    if (interacting) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = window.setInterval(() => {
      if (!document.hidden && !media.matches)
        setActive((current) => (current + 1) % stories.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [interacting, active]);

  return (
    <section className="crm-section crm-stories-section" aria-labelledby="crm-stories-title">
      <MarketingContainer>
        <div className="crm-stories-heading">
          <div>
            <p className="marketing-eyebrow">Different teams. Shared ambition.</p>
            <h2 className="marketing-heading" id="crm-stories-title">
              Good work starts
              <br />
              with great relationships.
            </h2>
          </div>
          <div className="crm-stories-intro">
            <p>
              A little clarity. A stronger connection.
              <br />
              Explore the people behind our customer story previews.
            </p>
            <div className="crm-stories-avatars">
              {stories.map((story) => (
                <UserAvatar key={story.name} name={story.name} size={28} />
              ))}
              <span>
                Different perspectives.
                <br />
                <b>One connected workspace.</b>
              </span>
            </div>
          </div>
        </div>
        <div
          className="crm-stories-carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer story previews"
          onMouseEnter={() => setInteracting(true)}
          onMouseLeave={() => setInteracting(false)}
          onFocusCapture={() => setInteracting(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false);
          }}
          onTouchStart={(event) => {
            touchStart.current = event.touches[0].clientX;
            setInteracting(true);
          }}
          onTouchEnd={(event) => {
            if (touchStart.current !== null) {
              const distance = touchStart.current - event.changedTouches[0].clientX;
              if (Math.abs(distance) > 45) move(distance > 0 ? 1 : -1);
            }
            touchStart.current = null;
            setInteracting(false);
          }}
        >
          <div className="crm-stories-window">
            <div
              className="crm-stories-track"
              style={{ "--story-index": active } as React.CSSProperties}
            >
              {[...stories, stories[0]].map((story, index) => (
                <figure
                  className={`crm-story-card crm-story-${story.color}`}
                  key={`${story.name}-${index}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${(index % stories.length) + 1} of ${stories.length}`}
                  aria-hidden={index !== active && index !== active + 1}
                >
                  <div className="crm-story-card-top">
                    <span>{story.company}</span>
                    <div aria-label="5 out of 5 stars">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star size={11} fill="currentColor" key={i} />
                      ))}
                    </div>
                  </div>
                  <Quote
                    className="crm-story-quote-icon"
                    size={27}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <blockquote>
                    <h3>{story.title}</h3>
                    <p>{story.quote}</p>
                  </blockquote>
                  <figcaption>
                    <UserAvatar name={story.name} size={44} />
                    <div>
                      <b>{story.name}</b>
                      <span>{story.role}</span>
                    </div>
                  </figcaption>
                  <div className="crm-story-takeaway">
                    <i />
                    {story.detail}
                  </div>
                </figure>
              ))}
            </div>
          </div>
          <div className="crm-stories-controls">
            <div className="crm-stories-dots" aria-label="Choose a customer story">
              {stories.map((story, index) => (
                <button
                  type="button"
                  key={story.name}
                  className={index === active ? "is-active" : ""}
                  aria-label={`Show ${story.name}'s story`}
                  aria-pressed={index === active}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
            <span className="crm-stories-count">
              0{active + 1}
              <span> / 0{stories.length}</span>
            </span>
            <div className="crm-stories-arrows">
              <button type="button" onClick={() => move(-1)} aria-label="Previous customer story">
                <ArrowLeft size={16} />
              </button>
              <button type="button" onClick={() => move(1)} aria-label="Next customer story">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
