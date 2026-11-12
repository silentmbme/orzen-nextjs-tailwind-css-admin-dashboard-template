"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, MessageSquare, Mail, Layers3 } from "lucide-react";
import { MarketingContainer } from "@/components/marketing/marketing-container";

const groups = [
  {
    label: "Your workspace",
    links: [
      ["CRM overview", "/dashboards/crm"],
      ["Leads & opportunities", "/crm/leads"],
      ["Contact directory", "/crm/contacts"],
      ["Company profiles", "/crm/companies"],
      ["Deals & pipeline", "/crm/deals"],
    ],
  },
  {
    label: "Explore the product",
    links: [
      ["How it works", "#features"],
      ["Interactive pipeline", "#pipeline"],
      ["Plans & pricing", "#pricing"],
      ["Common questions", "#faq"],
      ["Start a conversation", "#contact"],
    ],
  },
  {
    label: "More possibilities",
    links: [
      ["SaaS platform", "/landing/saas"],
      ["AI workspace", "/landing/ai"],
      ["Online store", "/landing/ecommerce"],
      ["Help & answers", "/pages/faq"],
      ["Your account", "/settings/account"],
    ],
  },
];

export function CrmFooter() {
  return (
    <footer className="crm-marketing-footer" aria-label="Orzen CRM footer">
      <MarketingContainer>
        <div className="crm-footer-top">
          <div>
            <span className="crm-footer-kicker">
              <Layers3 size={13} /> A little more connected.
            </span>
            <p>
              Your people. Your pipeline.
              <br />
              <span>A clearer way forward.</span>
            </p>
          </div>
          <Link href="/dashboards/crm" className="crm-footer-workspace">
            Explore your workspace <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="crm-footer-main">
          <div className="crm-footer-brand">
            <Link href="/landing/crm" aria-label="Orzen CRM home">
              <Image
                src="/images/brand/orzen-light.svg"
                alt="Orzen"
                width={127}
                height={35}
                unoptimized
                className="dark:hidden"
              />
              <Image
                src="/images/brand/orzen-dark.svg"
                alt="Orzen"
                width={127}
                height={35}
                unoptimized
                className="hidden dark:block"
              />
            </Link>
            <p>
              A thoughtful workspace for stronger relationships. Keep every conversation connected
              to what comes next.
            </p>
            <a className="crm-footer-contact" href="#contact">
              <span>
                <MessageSquare size={17} />
              </span>
              <div>
                <b>Let’s talk about your team</b>
                <small>Find your next step with Orzen</small>
              </div>
              <ArrowUpRight size={15} />
            </a>
          </div>
          {groups.map((group) => (
            <nav
              className="crm-footer-nav"
              key={group.label}
              aria-label={`CRM footer ${group.label}`}
            >
              <h2>{group.label}</h2>
              {group.links.map(([label, href]) => (
                <Link key={label} href={href}>
                  {label}
                  <ArrowUpRight size={11} />
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <div className="crm-footer-bottom">
          <p>© 2026 Orzen. Built around better relationships.</p>
          <div>
            <a href="#contact">
              <Mail size={12} /> Get in touch
            </a>
            <span className="crm-footer-status">
              <i /> Ready for your next chapter
            </span>
            <button
              type="button"
              aria-label="Back to top"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "instant"
                    : "smooth",
                })
              }
            >
              <ArrowUp size={15} />
            </button>
          </div>
        </div>
      </MarketingContainer>
    </footer>
  );
}
