"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Quote, Sparkles } from "lucide-react";
import { MarketingContainer } from "@/components/marketing/marketing-container";

const stories = [
  {
    name: "Priya Shah",
    portrait: "priya-shah",
    role: "Content lead",
    discipline: "The creative perspective",
    quote: "A place for the first draft. And the thinking that makes it better.",
    text: "A shared prompt library gives the team a useful starting point. Every draft still leaves space for a different voice, a better question, and a human point of view.",
    tags: ["Shared context", "Room to create", "Human judgment"],
    href: "/apps/ai/prompts",
    action: "Explore the prompt library",
    color: "purple",
    initial: "01",
  },
  {
    name: "Daniel Kim",
    portrait: "daniel-kim",
    role: "Operations lead",
    discipline: "The operational perspective",
    quote: "Useful automation makes the next decision clearer.",
    text: "Bring the input, the model, and the review stage into one visible workflow. Keep the assumptions close and give the next teammate a clear place to begin.",
    tags: ["Clear handoffs", "Visible decisions", "Thoughtful review"],
    href: "/apps/ai/workflows",
    action: "Explore the workflow studio",
    color: "blue",
    initial: "02",
  },
  {
    name: "Sofia Garcia",
    portrait: "sofia-garcia",
    role: "Customer experience lead",
    discipline: "The customer perspective",
    quote: "A thoughtful response begins with understanding the person.",
    text: "Organize the useful details before drafting the reply. Give your team a clearer view of the conversation, with the final decision always in human hands.",
    tags: ["Customer context", "Considered replies", "People first"],
    href: "/apps/ai/chat",
    action: "Explore the conversation",
    color: "coral",
    initial: "03",
  },
];

export function AIPerspectives() {
  const [active, setActive] = useState(0);
  const story = stories[active];
  const move = (direction: number) =>
    setActive((current) => (current + direction + stories.length) % stories.length);
  return (
    <section
      className={`ai-perspectives ai-perspectives-${story.color}`}
      aria-labelledby="ai-perspectives-title"
    >
      <MarketingContainer>
        <div className="ai-perspectives-heading">
          <div>
            <p className="marketing-eyebrow">Imagine the possibilities</p>
            <h2 className="marketing-heading" id="ai-perspectives-title">
              Different perspectives.
              <br />
              <span>A shared ambition.</span>
            </h2>
          </div>
          <p>
            A workspace is only as good as
            <br />
            the people it makes room for.
          </p>
        </div>
        <div className="ai-perspectives-stage">
          <div className="ai-perspectives-portrait">
            <Image
              key={story.portrait}
              src={`/images/marketing/ai-portraits/${story.portrait}.webp`}
              alt={story.name}
              width={1000}
              height={1200}
              quality={95}
              sizes="(max-width: 700px) 90vw, 400px"
            />
            <div className="ai-perspectives-portrait-label">
              <span>THE HUMAN SIDE OF AI</span>
              <b>{story.name}</b>
              <small>{story.role}</small>
            </div>
            <span className="ai-perspectives-portrait-index">{story.initial} / 03</span>
          </div>
          <div className="ai-perspectives-story" aria-live="polite">
            <div className="ai-perspectives-story-top">
              <span>
                <Sparkles size={12} />
                {story.discipline}
              </span>
              <Quote size={27} strokeWidth={1.4} />
            </div>
            <blockquote key={story.name}>
              <h3>“{story.quote}”</h3>
              <p>{story.text}</p>
            </blockquote>
            <div className="ai-perspectives-tags">
              {story.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <Link className="ai-perspectives-link" href={story.href}>
              {story.action}
              <ArrowUpRight size={15} />
            </Link>
            <div className="ai-perspectives-story-bottom">
              <span>Illustrative team perspectives</span>
              <div>
                <button type="button" aria-label="Previous perspective" onClick={() => move(-1)}>
                  <ArrowLeft size={15} />
                </button>
                <button type="button" aria-label="Next perspective" onClick={() => move(1)}>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="ai-perspectives-selector"
          role="group"
          aria-label="Choose a team perspective"
        >
          {stories.map((item, index) => (
            <button
              type="button"
              key={item.name}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
            >
              <Image
                src={`/images/marketing/ai-portraits/${item.portrait}.webp`}
                alt=""
                width={35}
                height={35}
                className="ai-perspectives-selector-portrait"
              />
              <span>
                <b>{item.name}</b>
                <small>{item.role}</small>
              </span>
              <span className="ai-perspectives-select-index">
                0{index + 1}
                <ArrowUpRight size={13} />
              </span>
            </button>
          ))}
        </div>
      </MarketingContainer>
    </section>
  );
}
