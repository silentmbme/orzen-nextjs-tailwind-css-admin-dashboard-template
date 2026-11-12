import Image from "next/image";
import { ArrowUpRight, Layers3 } from "lucide-react";
import { MarketingContainer } from "@/components/marketing/marketing-container";

const companies = [
  { name: "Notion", slug: "notion", category: "Knowledge & notes" },
  { name: "Figma", slug: "figma", category: "Design collaboration" },
  { name: "HubSpot", slug: "hubspot", category: "Customer relationships" },
  { name: "Dropbox", slug: "dropbox", category: "Files & collaboration" },
  { name: "Zoom", slug: "zoom", category: "Team conversations" },
  { name: "Linear", slug: "linear", category: "Projects & planning" },
];

export function CrmLogoMarquee() {
  return (
    <section className="crm-logo-section" aria-labelledby="crm-logo-heading">
      <MarketingContainer>
        <div className="crm-logo-heading">
          <div>
            <span className="crm-logo-eyebrow">
              <Layers3 size={13} /> A connected ecosystem
            </span>
            <h2 id="crm-logo-heading">
              A shared ambition.
              <br />
              <span>A more connected way to work.</span>
            </h2>
          </div>
          <p>
            From the first idea to the next conversation.
            <br />
            Inspired by the tools your team knows.
          </p>
        </div>
        <div
          className="crm-logo-window"
          tabIndex={0}
          aria-label="Company logos. Focus or hover to pause animation."
        >
          <div className="crm-logo-track">
            {[0, 1].map((copy) => (
              <div
                className="crm-logo-group"
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
              >
                {companies.map((company) => (
                  <div className={`crm-logo-tile crm-logo-${company.slug}`} key={company.slug}>
                    <div className="crm-logo-mark">
                      <Image
                        src={`/images/marketing/crm/logos/${company.slug}.svg`}
                        width={28}
                        height={28}
                        loading="eager"
                        alt=""
                      />
                    </div>
                    <div>
                      <span className="crm-logo-name">{company.name}</span>
                      <small>{company.category}</small>
                    </div>
                    <ArrowUpRight size={13} className="crm-logo-arrow" aria-hidden="true" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="crm-logo-caption">
          <span>
            <i /> Familiar tools. Fresh possibilities.
          </span>
          <span>One thoughtful workspace for your sales day.</span>
        </div>
      </MarketingContainer>
    </section>
  );
}
