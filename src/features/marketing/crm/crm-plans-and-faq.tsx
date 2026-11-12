"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ContactRound,
  GitBranch,
  Users,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  CircleHelp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { MarketingContainer, HeroAction } from "@/components/marketing/marketing-container";
import { FaqAccordion } from "@/components/marketing/faq-accordion";

const plans = [
  {
    name: "Contact",
    icon: ContactRound,
    price: 15,
    label: "Start with the essentials",
    description: "A shared customer memory for your next chapter.",
    features: [
      "Lead and contact directories",
      "Connected company profiles",
      "Shared activity history",
    ],
    note: "For small teams finding their rhythm",
    color: "blue",
  },
  {
    name: "Pipeline",
    icon: GitBranch,
    price: 29,
    label: "Build your sales momentum",
    description: "A clear process for every opportunity teammate.",
    features: [
      "Everything in Contact",
      "Visual deal board",
      "Purposeful follow-up planning",
      "Pipeline analytics",
    ],
    note: "For teams ready to move forward",
    color: "purple",
    featured: true,
  },
  {
    name: "Relationship",
    icon: Users,
    price: 59,
    label: "Bring the full story together",
    description: "A fuller view across your customer journey.",
    features: [
      "Everything in Pipeline",
      "Team performance views",
      "Connected account overviews",
      "Advanced reporting concept",
    ],
    note: "For growing, connected organizations",
    color: "coral",
  },
];
const questions = [
  {
    question: "Can I explore the CRM before choosing a plan?",
    answer:
      "Yes. Every plan links to the existing CRM workspace, where you can explore the dashboard, contacts, and opportunity views. These are illustrative plans; selecting one does not start a subscription or billing.",
  },
  {
    question: "How does the interactive pipeline work?",
    answer:
      "Select a deal to review its value, owner, and next step. Use the action in its preview to move it forward. Reset restores the original pipeline. Changes stay in this page's demo state.",
  },
  {
    question: "What changes with yearly billing?",
    answer:
      "Yearly pricing applies a 20% discount to the monthly seat price, rounded to the nearest dollar. The annual total is shown beneath each price so you can compare both options clearly.",
  },
  {
    question: "Are email and phone systems connected?",
    answer:
      "The template includes customer-management interfaces. Email delivery, telephony, authentication, and live integrations require your own services and backend.",
  },
  {
    question: "Does the consultation form send my information?",
    answer:
      "The form validates your entries in the browser and displays a confirmation. It does not send or store your details.",
  },
  {
    question: "Can my team use the workspace on mobile?",
    answer:
      "Yes. The workspace adapts to smaller screens, and the pipeline scrolls within its panel so that each stage remains accessible.",
  },
];

export function CrmPlans() {
  const [yearly, setYearly] = useState(false);
  return (
    <section
      className="crm-section crm-plans-section"
      id="pricing"
      aria-labelledby="crm-plans-title"
    >
      <MarketingContainer>
        <div className="crm-plans-heading">
          <p className="marketing-eyebrow">Room for better relationships</p>
          <h2 className="marketing-heading" id="crm-plans-title">
            The right plan.
            <br />
            <span>A little more possibility.</span>
          </h2>
          <p>
            A clear starting point for your team.
            <br />
            Choose the space you need to build stronger relationships.
          </p>
        </div>
        <div className="crm-plan-billing">
          <div role="group" aria-label="Billing period">
            <Button
              size="sm"
              variant={yearly ? "ghost" : "default"}
              aria-pressed={!yearly}
              onClick={() => setYearly(false)}
            >
              Monthly
            </Button>
            <Button
              size="sm"
              variant={yearly ? "default" : "ghost"}
              aria-pressed={yearly}
              onClick={() => setYearly(true)}
            >
              Yearly
            </Button>
          </div>
          <span>
            <Sparkles size={12} /> Save 20% yearly
          </span>
        </div>
        <div className="crm-plan-grid">
          {plans.map(({ icon: Icon, ...plan }) => {
            const price = yearly ? Math.round(plan.price * 0.8) : plan.price;
            return (
              <Card
                key={plan.name}
                className={`crm-plan-card crm-plan-${plan.color} ${plan.featured ? "is-featured" : ""}`}
              >
                <div className="crm-plan-card-top">
                  <span className="crm-plan-icon">
                    <Icon size={21} />
                  </span>
                  {plan.featured ? (
                    <span className="crm-plan-popular">
                      <Sparkles size={10} /> Most popular
                    </span>
                  ) : (
                    <span className="crm-plan-index">{plan.name === "Contact" ? "01" : "03"}</span>
                  )}
                </div>
                <h3>{plan.name}</h3>
                <p className="crm-plan-description">{plan.description}</p>
                <div className="crm-plan-price" aria-live="polite">
                  <strong>${price}</strong>
                  <span>/ seat / month</span>
                </div>
                <p className="crm-plan-invoice">
                  {yearly ? `$${price * 12} per seat, billed yearly` : "Per seat, billed monthly"}
                </p>
                <HeroAction href="/dashboards/crm" secondary={!plan.featured}>
                  Explore {plan.name}
                </HeroAction>
                <div className="crm-plan-includes">
                  <span>
                    {plan.featured ? "Your next stage of growth" : "A thoughtful set of essentials"}
                  </span>
                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <Check size={14} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>
        <div className="crm-plan-footnote">
          <span>
            <ShieldCheck size={14} /> Clear prices. A shared customer view.
          </span>
          <span>Illustrative plans · no payment is created.</span>
        </div>
      </MarketingContainer>
    </section>
  );
}

export function CrmQuestions() {
  return (
    <section
      className="crm-section crm-questions-section"
      id="faq"
      aria-labelledby="crm-questions-title"
    >
      <MarketingContainer>
        <div className="crm-questions-layout">
          <div className="crm-questions-intro">
            <span className="crm-questions-icon">
              <CircleHelp size={24} />
            </span>
            <p className="marketing-eyebrow">Before the first conversation</p>
            <h2 className="marketing-heading" id="crm-questions-title">
              A little clarity.
              <br />A confident next step.
            </h2>
            <p className="crm-questions-copy">
              The practical details, all in one place. Get to know your workspace before you make
              your next move.
            </p>
            <div className="crm-questions-support">
              <div className="crm-questions-people">
                <UserAvatar name="Sofia Garcia" size={32} />
                <UserAvatar name="Alex Morgan" size={32} />
                <UserAvatar name="Daniel Kim" size={32} />
              </div>
              <h3>Have something else in mind?</h3>
              <p>Start with a conversation about your team.</p>
              <a href="#contact">
                <MessageSquare size={14} /> Let’s find your next step <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
          <div className="crm-questions-list">
            <div className="crm-questions-list-label">
              <span>Good questions. Clear answers.</span>
              <span>01 — 06</span>
            </div>
            <FaqAccordion items={questions} />
            <Link className="crm-questions-demo" href="/dashboards/crm">
              Prefer to explore for yourself?{" "}
              <span>
                Open the CRM workspace <ArrowUpRight size={13} />
              </span>
            </Link>
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
