"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  MessageSquare,
  Sparkles,
  Terminal,
} from "lucide-react";
import { MarketingContainer } from "@/components/marketing/marketing-container";

const prompts = [
  {
    icon: FileText,
    category: "Writing & clarity",
    title: "Give your next idea a shape.",
    prompt:
      "Turn these project notes into a concise brief with an objective, audience, key milestones, and open questions.",
    tag: "Project brief",
    href: "/apps/ai/prompts",
  },
  {
    icon: MessageSquare,
    category: "Customer conversations",
    title: "Make every reply more thoughtful.",
    prompt:
      "Draft a warm, clear reply to this customer question. Acknowledge the concern, suggest a useful next step, and flag any missing context.",
    tag: "Customer reply",
    href: "/apps/ai/chat",
  },
  {
    icon: Terminal,
    category: "Product & engineering",
    title: "See the details worth a second look.",
    prompt:
      "Review this code for readability and edge cases. Explain your assumptions and suggest focused improvements without changing its intent.",
    tag: "Code review",
    href: "/apps/ai/chat",
  },
];

export function AIPromptInspiration() {
  const [copied, setCopied] = useState<number | null>(null);
  const [error, setError] = useState(false);
  async function copyPrompt(index: number) {
    try {
      await navigator.clipboard.writeText(prompts[index].prompt);
      setCopied(index);
      setError(false);
    } catch {
      setError(true);
    }
  }
  return (
    <section
      className="ai-prompt-inspiration ai-section"
      id="prompt-ideas"
      aria-labelledby="ai-prompt-ideas-title"
    >
      <MarketingContainer>
        <div className="ai-prompt-ideas-heading">
          <div>
            <p className="marketing-eyebrow">A spark for your next step</p>
            <h2 className="marketing-heading" id="ai-prompt-ideas-title">
              Good things start
              <br />
              with a useful question.
            </h2>
          </div>
          <div>
            <p>
              Skip the blank page. Pick a starting point,
              <br />
              add your context, and make it your own.
            </p>
            <Link href="/apps/ai/prompts">
              Browse the prompt library <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
        <div className="ai-prompt-ideas-grid">
          {prompts.map(({ icon: Icon, ...item }, index) => (
            <article className={`ai-prompt-idea ai-prompt-idea-${index}`} key={item.title}>
              <div className="ai-prompt-idea-top">
                <span>
                  <Icon size={20} />
                </span>
                <small>0{index + 1} / GET INSPIRED</small>
              </div>
              <p className="ai-prompt-idea-category">{item.category}</p>
              <h3>{item.title}</h3>
              <div className="ai-prompt-text">
                <Sparkles size={12} />
                <p>{item.prompt}</p>
              </div>
              <div className="ai-prompt-idea-actions">
                <span>{item.tag}</span>
                <button
                  type="button"
                  onClick={() => copyPrompt(index)}
                  aria-label={`Copy ${item.tag.toLowerCase()} prompt`}
                >
                  {copied === index ? <Check size={13} /> : <Copy size={13} />}
                  {copied === index ? "Copied" : "Copy prompt"}
                </button>
              </div>
              <Link className="ai-prompt-idea-explore" href={item.href}>
                Explore this workspace <ArrowUpRight size={13} />
              </Link>
            </article>
          ))}
        </div>
        {error && (
          <p role="status" className="ai-prompt-copy-status">
            Copy is unavailable. Select the prompt text to copy it.
          </p>
        )}
      </MarketingContainer>
    </section>
  );
}
