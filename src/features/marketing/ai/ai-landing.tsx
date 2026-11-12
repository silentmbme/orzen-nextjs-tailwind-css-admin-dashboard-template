import { AIPromptInspiration } from "./ai-prompt-inspiration";
import { AIPerspectives } from "./ai-perspectives";
import Image from "next/image";
import { AIReferenceHero } from "./ai-reference-hero";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  Cpu,
  GitBranch,
  Layers3,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  MarketingContainer,
  MarketingSection,
  HeroAction,
} from "@/components/marketing/marketing-container";
import { AIWorkflowPreview } from "./ai-previews";
import { ActivityChart, IndustryShowcase, ReviewScene } from "./ai-scenes";
import { AIPricing } from "./ai-pricing";
import "./ai-landing.css";
export function AILanding() {
  return (
    <div className="ai-experience">
      <AIReferenceHero />
      <section id="solutions" className="ai-section">
        <MarketingContainer>
          <IndustryShowcase />
        </MarketingContainer>
      </section>
      <section id="features" className="ai-section ai-features">
        <MarketingContainer>
          <div className="ai-section-heading">
            <p className="marketing-eyebrow">One platform. Room to explore.</p>
            <h2 className="marketing-heading">
              From a spark of an idea
              <br />
              to a more useful everyday.
            </h2>
            <p className="marketing-copy">
              Thoughtful tools for the work between inspiration and execution.
            </p>
          </div>
          <div className="ai-feature-stack">
            <article className="ai-feature-panel ai-feature-panel--purple">
              <div className="ai-feature-copy">
                <span className="ai-icon">
                  <Sparkles size={22} />
                </span>
                <span className="ai-feature-number">01 / CREATE</span>
                <h3>
                  A better first draft.
                  <br />A clearer next thought.
                </h3>
                <p>
                  Start with a question. Shape the context. Explore a reusable prompt and keep your
                  team’s judgment in the conversation.
                </p>
                <Link className="ai-text-link" href="/apps/ai/prompts">
                  Explore prompt library
                  <ArrowUpRight size={15} />
                </Link>
              </div>
              <Link
                href="/apps/ai/chat"
                className="ai-feature-chat-image"
                aria-label="Explore the AI chat workspace"
              >
                <Image
                  src="/images/marketing/ai-chat-supplied.jpg"
                  alt="AI chat workspace with conversation history, prompt suggestions, and message composer"
                  width={1080}
                  height={669}
                  sizes="(max-width: 900px) 100vw, 650px"
                  quality={90}
                />
              </Link>
            </article>
            <article className="ai-feature-panel ai-feature-panel--blue">
              <div className="ai-feature-copy">
                <span className="ai-icon">
                  <Zap size={22} />
                </span>
                <span className="ai-feature-number">02 / UNDERSTAND</span>
                <h3>
                  Make activity visible.
                  <br />
                  Make decisions easier.
                </h3>
                <p>
                  See how prompts and workflows contribute to your operations. Compare activity in a
                  clear, interactive view before exploring the full analytics workspace.
                </p>
                <Link className="ai-text-link" href="/apps/ai/usage">
                  Explore usage analytics
                  <ArrowUpRight size={15} />
                </Link>
              </div>
              <ActivityChart compact />
            </article>
            <article className="ai-feature-panel ai-feature-panel--coral">
              <div className="ai-feature-copy">
                <span className="ai-icon">
                  <ShieldCheck size={22} />
                </span>
                <span className="ai-feature-number">03 / REVIEW</span>
                <h3>
                  Intelligence with
                  <br />a human point of view.
                </h3>
                <p>
                  Keep assumptions visible and handoffs intentional. Our workflow concept places a
                  review stage between a generated draft and the next decision.
                </p>
                <Link className="ai-text-link" href="/apps/ai/workflows">
                  Explore workflow controls
                  <ArrowUpRight size={15} />
                </Link>
              </div>
              <ReviewScene />
            </article>
          </div>
        </MarketingContainer>
      </section>
      <section id="workflow" className="ai-section ai-steps-section">
        <MarketingContainer>
          <div className="ai-section-heading">
            <p className="marketing-eyebrow">A simpler starting point</p>
            <h2 className="marketing-heading">
              Three steps.
              <br />A whole new way forward.
            </h2>
            <p className="marketing-copy">
              Explore the process, then try a local workflow simulation.
            </p>
          </div>
          <div className="ai-steps-grid">
            {[
              {
                icon: Cpu,
                title: "Choose your model",
                text: "Explore fictional profiles for reasoning, writing, and visual context.",
                href: "/apps/ai/models",
                visual: (
                  <div className="ai-model-tiles">
                    {["Orzen Core", "Orzen Flash", "Atlas Reason"].map((name, i) => (
                      <div key={name}>
                        <Cpu size={17} />
                        <span>{name}</span>
                        <span>{i === 2 ? "Review" : "Available"}</span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                icon: GitBranch,
                title: "Shape the workflow",
                text: "Connect the input, prompt, and review stage around a clear outcome.",
                href: "/apps/ai/workflows",
                visual: (
                  <div className="ai-network">
                    <span>
                      <Layers3 size={21} />
                    </span>
                    <i />
                    <strong>
                      <Sparkles size={26} />
                    </strong>
                    <i />
                    <span>
                      <ShieldCheck size={21} />
                    </span>
                  </div>
                ),
              },
              {
                icon: Bot,
                title: "Learn from the activity",
                text: "Explore sample requests, usage patterns, and costs in one place.",
                href: "/apps/ai/usage",
                visual: (
                  <div className="ai-donut">
                    <div>
                      <strong>180</strong>
                      <span>demo requests</span>
                    </div>
                  </div>
                ),
              },
            ].map(({ icon: Icon, title, text, href, visual }, i) => (
              <article key={title}>
                <div className={`ai-step-visual ai-step-visual-${i}`}>{visual}</div>
                <span className="ai-step-label">
                  <Icon size={13} />
                  STEP 0{i + 1}
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link href={href} className="ai-text-link">
                  Take a closer look
                  <ArrowRight size={13} />
                </Link>
              </article>
            ))}
          </div>
        </MarketingContainer>
      </section>
      <section className="ai-workflow-lab ai-handoff-section" aria-labelledby="ai-handoff-title">
        <MarketingContainer className="ai-handoff-section-content">
          <div className="ai-handoff-copy">
            <span className="ai-handoff-icon">
              <GitBranch size={24} />
            </span>
            <p className="marketing-eyebrow">Try the handoff</p>
            <h2 id="ai-handoff-title" className="marketing-heading">
              From input
              <br />
              to intention.
            </h2>
            <p className="marketing-copy mt-4">
              Choose a scenario and follow the steps. The simulation stays local, with a person at
              the final review point.
            </p>
            <div className="ai-lab-notes">
              {["Clear inputs", "Visible processing", "Human review"].map((t) => (
                <span key={t}>
                  <Check size={13} />
                  {t}
                </span>
              ))}
            </div>
            <Link className="ai-handoff-link" href="/apps/ai/workflows">
              Open the workflow studio <ArrowUpRight size={14} />
            </Link>
          </div>
          <AIWorkflowPreview />
        </MarketingContainer>
      </section>
      <MarketingSection
        id="pricing"
        eyebrow="A little room to experiment. A lot of room to grow."
        title="Simple plans. Bigger possibilities."
        description="Choose an illustrative starting point for your team. Explore every interface without a subscription."
        className="ai-pricing"
      >
        <AIPricing />
      </MarketingSection>
      <AIPerspectives />
      <AIPromptInspiration />
      <section className="ai-section ai-closing-section">
        <MarketingContainer>
          <div className="ai-closing">
            <div>
              <span className="ai-announcement">
                <Sparkles size={13} />
                Your next idea starts here
              </span>
              <h2 className="marketing-heading mt-3!">
                Bring a little more
                <br />
                intelligence to the everyday.
              </h2>
              <p className="marketing-copy">Start with a prompt. Find a clearer way forward.</p>
              <div className="ai-hero-actions justify-start!">
                <HeroAction href="/apps/ai/chat">Open AI playground</HeroAction>
                <HeroAction href="/dashboards/ai" secondary>
                  Explore dashboard
                </HeroAction>
              </div>
              <p className="ai-caption">No signup, provider keys, or payment required.</p>
            </div>
            <ReviewScene />
          </div>
        </MarketingContainer>
      </section>
    </div>
  );
}
