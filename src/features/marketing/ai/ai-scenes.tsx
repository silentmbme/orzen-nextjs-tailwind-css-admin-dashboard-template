"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Check,
  ChartNoAxesCombined,
  Cpu,
  FileText,
  Users,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Select } from "@/components/ui/select";
import { seed } from "@/features/ai/seed";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
export function ActivityChart({ compact = false }: { compact?: boolean }) {
  const [period, setPeriod] = useState("Weekly");
  const data = months.map((name, i) => ({
    name: period === "Weekly" ? `D${i + 1}` : name,
    prompts: [26, 38, 31, 47, 36, 53, 44][i] * (period === "Monthly" ? 4 : 1),
    workflows: [18, 12, 22, 16, 28, 21, 32][i] * (period === "Monthly" ? 4 : 1),
  }));
  return (
    <div className={`ai-chart ${compact ? "ai-chart--compact" : ""}`}>
      <div className="ai-scene-heading">
        <span>
          <Sparkles size={14} />
          Execution activity
        </span>
        <Select
          aria-label={compact ? "Feature activity period" : "Hero activity period"}
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option>Weekly</option>
          <option>Monthly</option>
        </Select>
      </div>
      <div className="ai-chart-summary">
        <strong>
          {data
            .reduce((sum, item) => sum + item.prompts + item.workflows, 0)
            .toLocaleString("en-US")}
        </strong>
        <span>illustrative executions</span>
        <span className="ai-chart-legend">
          <i />
          Prompts <i />
          Workflows
        </span>
      </div>
      <div className="ai-chart-canvas">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart
            data={data}
            barSize={compact ? 22 : 30}
            margin={{ top: 12, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <pattern
                id={compact ? "ai-stripes-feature" : "ai-stripes-hero"}
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(35)"
              >
                <rect width="6" height="6" fill="var(--ai-purple-soft)" />
                <path d="M0 0V6" stroke="var(--accent)" strokeWidth="2" />
              </pattern>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 5" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              dy={5}
            />
            <Tooltip
              cursor={{ fill: "var(--surface-alt)" }}
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 11,
                color: "var(--foreground)",
              }}
            />
            <Bar
              name="Prompts"
              dataKey="prompts"
              stackId="activity"
              fill={`url(#${compact ? "ai-stripes-feature" : "ai-stripes-hero"})`}
              radius={[0, 0, 3, 3]}
            />
            <Bar
              name="Workflows"
              dataKey="workflows"
              stackId="activity"
              fill="var(--ai-blue)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="ai-caption">Illustrative series · filter to explore the chart</p>
    </div>
  );
}
export function HeroAnalytics() {
  const successes = seed.requests.filter((r) => r.status === "Success").length;
  return (
    <div className="ai-hero-analytics">
      <div className="ai-metric-column">
        <div className="ai-stat ai-stat--purple">
          <span className="ai-icon">
            <Workflow size={19} />
          </span>
          <p>Requests in the workspace</p>
          <strong>{seed.requests.length}</strong>
          <small>Seeded records, ready to explore</small>
        </div>
        <div className="ai-stat ai-stat--coral">
          <span className="ai-icon">
            <FileText size={19} />
          </span>
          <p>Reusable prompt templates</p>
          <strong>{String(seed.prompts.length).padStart(2, "0")}</strong>
          <small>A clearer starting point for every task</small>
        </div>
      </div>
      <div className="ai-main-analytics">
        <ActivityChart />
        <div className="ai-trust-strip">
          {[
            [String(seed.models.length), "Model profiles"],
            [String(seed.workflows.length), "Workflows"],
            [String(successes), "Sample successes"],
            ["Local", "Demo execution"],
          ].map(([n, l]) => (
            <div key={l}>
              <strong>{n}</strong>
              <span>{l}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="ai-metric-column">
        <div className="ai-stat ai-stat--night">
          <span className="ai-icon">
            <Cpu size={19} />
          </span>
          <p>One connected workspace</p>
          <strong>3 ways</strong>
          <small>Prompt. Orchestrate. Understand.</small>
          <div className="ai-dot-orbit" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="ai-stat ai-stat--pink">
          <span className="ai-icon">
            <ShieldCheck size={19} />
          </span>
          <p>The final decision</p>
          <strong>Human.</strong>
          <small>Review is part of the workflow</small>
        </div>
      </div>
    </div>
  );
}
const benefits = [
  {
    icon: Bot,
    title: "More thoughtful conversations",
    copy: "Turn customer questions into considered drafts, with the right context and a human final review.",
    href: "/apps/ai/chat",
  },
  {
    icon: FileText,
    title: "A clearer starting point",
    copy: "Keep useful prompts close at hand. Build on a shared library instead of starting from scratch.",
    href: "/apps/ai/prompts",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Visibility that makes sense",
    copy: "Understand requests, token usage, and cost in one connected view of your AI operations.",
    href: "/apps/ai/usage",
  },
  {
    icon: Users,
    title: "Better work, together",
    copy: "Give your team a shared workspace for ideas, useful context, and the next good decision.",
    href: "/apps/ai/chat",
  },
  {
    icon: Cpu,
    title: "The right model for the task",
    copy: "Explore model capabilities and choose a practical starting point for the work in front of you.",
    href: "/apps/ai/models",
  },
  {
    icon: Workflow,
    title: "A smoother path to progress",
    copy: "Connect prompts, actions, and review steps into thoughtful workflows that keep people in control.",
    href: "/apps/ai/workflows",
  },
];
export function IndustryShowcase() {
  return (
    <div className="ai-benefits-showcase border-t border-border pt-12">
      <div className="ai-benefits-heading">
        <p className="marketing-eyebrow">Built around the work</p>
        <h2 className="marketing-heading">
          Everyday advantages.
          <br />
          Remarkable possibilities.
        </h2>
        <p>
          Thoughtful capabilities that simplify your workflow
          <br className="hidden sm:block" /> and give your team more room to think.
        </p>
      </div>
      <div className="ai-benefits-grid">
        {benefits.map(({ icon: Icon, title, copy, href }, index) => (
          <Link className={"ai-benefit-item ai-benefit-tone-" + index} key={title} href={href}>
            <span className="ai-benefit-icon">
              <Icon size={22} strokeWidth={1.7} />
            </span>
            <h3>{title}</h3>
            <p>{copy}</p>
            <span className="ai-benefit-link">
              Explore the workspace <ArrowUpRight size={12} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
export function ReviewScene() {
  return (
    <div className="ai-review-scene">
      <div className="ai-review-card">
        <span className="ai-icon">
          <ShieldCheck size={21} />
        </span>
        <span className="ai-status">Review queue</span>
        <h3>
          Good automation knows
          <br />
          when to ask a human.
        </h3>
        {[
          ["Support response", "Ready for review"],
          ["Executive brief", "Draft prepared"],
          ["Code checklist", "Context required"],
        ].map(([name, state], i) => (
          <div className="ai-review-row" key={name}>
            <span className={`ai-review-dot ai-review-dot-${i}`} />
            <span>
              {name}
              <small>{state}</small>
            </span>
            <Check size={14} />
          </div>
        ))}
        <p className="ai-caption">Illustrative queue · no external actions are executed</p>
      </div>
      <div className="ai-review-stamp">
        <ShieldCheck size={19} />
        You stay in control
      </div>
    </div>
  );
}
