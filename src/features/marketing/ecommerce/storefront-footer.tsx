"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Headphones,
  Mail,
  PackageCheck,
  Sparkles,
} from "lucide-react";
import { MarketingContainer } from "@/components/marketing/marketing-container";
import { journalArticles } from "./data";

const linkClass =
  "w-fit text-[12px] leading-5 text-slate-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-400";

export function StorefrontFooter() {
  return (
    <footer
      aria-label="Storefront footer"
      className="relative isolate overflow-hidden bg-[#171520] text-slate-100"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-32 -top-40 size-[450px] rounded-full border border-white/5 bg-violet-500/5"
      />
      <MarketingContainer>
        <div className="relative flex flex-wrap items-center justify-between gap-5 border-b border-white/10 py-8 sm:py-10">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[.16em] text-violet-300">
              <Sparkles size={13} aria-hidden="true" />
              Well chosen. Well loved.
            </p>
            <h2 className="text-[22px] font-semibold leading-tight tracking-tight sm:text-[28px]">
              A little more joy.<span className="text-slate-400"> Every day.</span>
            </h2>
          </div>
          <a
            href="#products"
            className="group inline-flex items-center gap-4 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-[12px] font-medium transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-violet-400"
          >
            Explore the collection
            <ArrowUpRight
              size={15}
              aria-hidden="true"
              className="transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
            />
          </a>
        </div>
        <div className="grid gap-x-8 gap-y-9 py-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_.8fr_.8fr_1.3fr]">
          <div>
            <Image
              src="/images/brand/orzen-dark.svg"
              alt="Orzen"
              width={130}
              height={36}
              className="h-8 w-auto"
            />
            <p className="mt-4 max-w-[245px] text-[12px] leading-6 text-slate-400">
              Thoughtful objects. Fresh perspectives. Everyday essentials with a little personality.
            </p>
            <a
              href="mailto:hello@example.com"
              className="mt-5 inline-flex items-center gap-2 text-[12px] text-slate-200 hover:text-violet-300"
            >
              <Mail size={14} aria-hidden="true" />
              hello@example.com
            </a>
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[.03] p-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-violet-400/10 text-violet-300">
                <Headphones size={15} aria-hidden="true" />
              </span>
              <span>
                <strong className="block text-[11px] font-medium">
                  A little help, whenever you need it.
                </strong>
                <Link
                  href="/pages/faq"
                  className="mt-1 inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                >
                  Visit our help center
                  <ArrowRight size={11} aria-hidden="true" />
                </Link>
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[.1em] text-slate-200">
              Customer care
            </h3>
            <nav aria-label="Customer care" className="mt-5 grid gap-3">
              <Link className={linkClass} href="/pages/faq">
                Shipping & returns
              </Link>
              <Link className={linkClass} href="/pages/faq">
                FAQs & support
              </Link>
              <Link className={linkClass} href="/settings/account">
                Your account
              </Link>
              <Link className={linkClass} href="/login">
                Sign in
              </Link>
              <Link className={linkClass} href="/register">
                Create an account
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[.1em] text-slate-200">
              Discover
            </h3>
            <nav aria-label="Store collections" className="mt-5 grid gap-3">
              <a className={linkClass} href="#products">
                All essentials
              </a>
              <a className={linkClass} href="#categories">
                Our collections
              </a>
              <a className={linkClass} href="#offers">
                The weekend edit
              </a>
              <a className={linkClass} href="#journal">
                The everyday journal
              </a>
              <a className={linkClass} href="#how-it-works">
                How it works
              </a>
            </nav>
            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-violet-300/15 bg-violet-300/5 px-2.5 py-1 text-[9px] text-violet-300">
              <span className="size-1 rounded-full bg-violet-300" />
              The everyday edit
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-[.1em] text-slate-200">
                From the journal
              </h3>
              <a
                href="#journal"
                aria-label="Explore the journal"
                className="text-slate-400 hover:text-white"
              >
                <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="mt-5 space-y-4">
              {journalArticles.slice(0, 3).map((article, index) => (
                <a key={article.id} href="#journal" className="group flex items-center gap-3">
                  <Image
                    src={article.image}
                    alt=""
                    width={64}
                    height={56}
                    className="h-14 w-16 shrink-0 rounded-md object-cover"
                  />
                  <span>
                    <span className="mb-1 block text-[9px] uppercase tracking-wide text-violet-300">
                      {["Workspace", "Listening", "Design"][index]}
                    </span>
                    <strong className="block text-[11px] font-medium leading-5 text-slate-300 transition-colors group-hover:text-white">
                      {article.title}
                    </strong>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-4">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <PackageCheck size={13} className="text-violet-300" />
              Considered essentials
            </span>
            <span className="flex items-center gap-1.5">
              <Headphones size={13} className="text-violet-300" />
              Friendly support
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
              })
            }
            className="flex items-center gap-2 text-[10px] text-slate-300 hover:text-white focus-visible:outline-2 focus-visible:outline-violet-400"
          >
            Back to top
            <span className="grid size-7 place-items-center rounded-full border border-white/15">
              <ArrowUp size={12} aria-hidden="true" />
            </span>
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 py-5 text-[10px] text-slate-500">
          <span>&copy; 2026 Orzen. Crafted for the everyday.</span>
          <span>Illustrative storefront · No live payments</span>
        </div>
      </MarketingContainer>
    </footer>
  );
}
