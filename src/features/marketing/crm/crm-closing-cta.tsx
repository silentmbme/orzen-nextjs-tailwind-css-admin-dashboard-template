"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Check, Mail } from "lucide-react";
import { MarketingContainer } from "@/components/marketing/marketing-container";
import { Button } from "@/components/ui/button";

export function CrmClosingCta() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="crm-closing-section" aria-labelledby="crm-closing-title">
      <MarketingContainer>
        <div className="crm-closing-panel">
          <div className="crm-closing-sheets crm-closing-sheets-left" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="crm-closing-sheets crm-closing-sheets-right" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="crm-closing-content">
            <p className="crm-closing-eyebrow">
              <span />
              Less chasing. More connecting.
            </p>
            <h2 id="crm-closing-title">
              Make your next
              <br />
              conversation count.
            </h2>
            <p>
              Bring your people, pipeline, and possibilities together.
              <br className="hidden sm:block" /> A more connected sales day starts here.
            </p>
            <form
              className="crm-closing-form"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <label className="sr-only" htmlFor="crm-closing-email">
                Your work email
              </label>
              <Mail size={16} aria-hidden="true" />
              <input
                id="crm-closing-email"
                type="email"
                autoComplete="email"
                placeholder="Your work email address"
                required
                onChange={() => setSubmitted(false)}
              />
              <Button type="submit">
                Find your next step{" "}
                <span>
                  <ArrowRight size={14} />
                </span>
              </Button>
            </form>
            <div className="crm-closing-followup" role="status">
              {submitted ? (
                <>
                  <Check size={13} /> You’re ready to explore.{" "}
                  <Link href="/dashboards/crm">
                    Open your CRM workspace <ArrowUpRight size={12} />
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboards/crm">
                    Take a look around <ArrowUpRight size={13} />
                  </Link>
                  <span>One workspace. A clearer next step.</span>
                </>
              )}
            </div>
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
