"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Cpu, Orbit, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Explore",
    eyebrow: "For a clearer first step",
    monthly: 12,
    icon: Sparkles,
    description: "A personal space to try prompts and model concepts.",
    features: [
      "Prompt playground",
      "Model directory",
      "Saved prompt concepts",
      "Local demo history",
    ],
    detail: "1 workspace · 3 model profiles",
  },
  {
    name: "Build",
    eyebrow: "For connected thinking",
    monthly: 39,
    icon: Orbit,
    featured: true,
    description: "Turn useful ideas into visible, reviewable workflows.",
    features: [
      "Everything in Explore",
      "Workflow editor",
      "Usage overview",
      "Team review concepts",
    ],
    detail: "5 workspaces · workflow simulations",
  },
  {
    name: "Operate",
    eyebrow: "For the wider picture",
    monthly: 89,
    icon: Cpu,
    description: "An operations view for requests, costs, and handoffs.",
    features: [
      "Everything in Build",
      "Operations dashboard",
      "Request monitoring",
      "Cost analysis views",
    ],
    detail: "Unlimited workspaces · demo data",
  },
];

export function AIPricing() {
  const [yearly, setYearly] = useState(false);
  return (
    <div className="ai-pricing-shell">
      <div className="ai-pricing-topline">
        <div className="ai-pricing-toggle" role="group" aria-label="Billing period">
          <button
            type="button"
            aria-pressed={!yearly}
            className={!yearly ? "is-active" : ""}
            onClick={() => setYearly(false)}
          >
            Monthly
          </button>
          <button
            type="button"
            aria-pressed={yearly}
            className={yearly ? "is-active" : ""}
            onClick={() => setYearly(true)}
          >
            Yearly <span aria-hidden="true">Save 20%</span>
          </button>
        </div>
        <p>Illustrative plans only. No payment or subscription is created.</p>
      </div>
      <div className="ai-price-grid">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const price = yearly ? Math.round(plan.monthly * 0.8) : plan.monthly;
          return (
            <article
              key={plan.name}
              className={`ai-price-card ${plan.featured ? "ai-price-card--featured" : ""}`}
            >
              {plan.featured && <span className="ai-price-recommended">Most considered</span>}
              <div className="ai-price-card-head">
                <span className="ai-price-icon">
                  <Icon size={20} />
                </span>
                <span className="ai-price-eyebrow">{plan.eyebrow}</span>
              </div>
              <h3>{plan.name}</h3>
              <p className="ai-price-description">{plan.description}</p>
              <div className="ai-price-value">
                <strong>${price}</strong>
                <span>
                  / team
                  <br />/ month
                </span>
              </div>
              <p className="ai-price-billing">
                {yearly ? `$${price * 12} billed yearly` : "Billed monthly"}
              </p>
              <div className="ai-price-rule" />
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check size={14} />
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="ai-price-detail">{plan.detail}</p>
              <Link
                href="/dashboards/ai"
                className={`ai-price-action ${plan.featured ? "ai-price-action--featured" : ""}`}
              >
                Explore {plan.name}
                <ArrowUpRight size={15} />
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
