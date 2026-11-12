"use client";
import Image from "next/image";
import { AILogoMarquee } from "./ai-logo-marquee";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";
import { ArrowRight, ArrowUpRight, CheckCircle2, Menu, Moon, Sparkles, Sun, X } from "lucide-react";

export function AIReferenceHero() {
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <div className="ai-reference-shell">
      <header className="ai-reference-header">
        <div className="ai-reference-header-white">
          <Link href="/landing/ai" aria-label="Orzen AI home">
            <Image
              src="/images/brand/orzen-light.svg"
              alt="Orzen"
              width={117}
              height={32}
              className="dark:hidden"
              unoptimized
            />
            <Image
              src="/images/brand/orzen-dark.svg"
              alt="Orzen"
              width={117}
              height={32}
              className="hidden dark:block"
              unoptimized
            />
          </Link>
          <nav aria-label="AI landing navigation">
            <a href="#ai-home">Home</a>
            <a href="#solutions">Solutions</a>
            <a href="#features">Features</a>
            <a href="#workflow">Workflows</a>
            <a href="#pricing">Pricing</a>
          </nav>
        </div>
        <div className="ai-reference-account">
          <button
            className="ai-reference-theme-toggle"
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <Moon size={15} className="dark:hidden" />
            <Sun size={15} className="hidden dark:block" />
          </button>
          <Link href="/login" className="ai-reference-signin">
            Sign in
          </Link>
          <Link href="/apps/ai/chat" className="ai-reference-start">
            Explore AI <ArrowUpRight size={12} />
          </Link>
          <button
            className="ai-reference-menu"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {open && (
          <nav className="ai-reference-mobile-nav" aria-label="Mobile AI navigation">
            {[
              ["Home", "ai-home"],
              ["Solutions", "solutions"],
              ["Features", "features"],
              ["Workflows", "workflow"],
              ["Pricing", "pricing"],
            ].map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>
      <section className="ai-reference-banner" id="ai-home" style={{ backgroundColor: "#211c37" }}>
        <div className="ai-reference-pattern" aria-hidden="true" />
        <div className="ai-reference-copy">
          <span className="ai-reference-badge">
            <Sparkles size={12} /> A clearer kind of AI workspace
          </span>
          <h1>
            Automate the everyday.
            <br />
            Make room for
            <br />
            <span>remarkable thinking.</span>
          </h1>
          <p>
            Bring your prompts, models, and workflows together. Turn complex work into a clear next
            step, with people at the center.
          </p>
          <div className="ai-reference-actions">
            <Link href="/apps/ai/chat">
              Explore the playground <ArrowRight size={14} />
            </Link>
            <a href="#solutions">
              See how it works <ArrowRight size={14} />
            </a>
          </div>
          <div className="ai-reference-proof">
            <span>
              <CheckCircle2 size={13} />
              One connected workspace
            </span>
            <span>
              <CheckCircle2 size={13} />
              Human-led intelligence
            </span>
          </div>
        </div>
        <div className="ai-reference-visual">
          <div className="ai-reference-dashboard">
            <div className="ai-reference-screen-bar">
              <i />
              <i />
              <i />
              <span>Orzen / AI operations</span>
            </div>
            <Image
              src="/images/marketing/ai-dashboard-preview.webp"
              alt="Orzen AI dashboard showing request activity, token analysis, and model operations"
              width={1440}
              height={1050}
              priority
              quality={90}
            />
          </div>
          <div className="ai-reference-floating">
            <span>
              <Sparkles size={14} />
              Intelligence in motion
            </span>
            <b>
              From a question.
              <br />
              To a clearer next step.
            </b>
            <div>
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <small>Prompt · Orchestrate · Understand</small>
          </div>
        </div>
      </section>
      <AILogoMarquee />
    </div>
  );
}
