import Image from "next/image";
import { ArrowUpRight, Layers3 } from "lucide-react";

const tools = [
  { name: "Notion", description: "Knowledge, connected", slug: "notion" },
  { name: "Figma", description: "Ideas into experiences", slug: "figma" },
  { name: "HubSpot", description: "Relationships that grow", slug: "hubspot" },
  {
    name: "Dropbox",
    description: "A shared source of context",
    slug: "dropbox",
  },
  { name: "Zoom", description: "Better conversations", slug: "zoom" },
  { name: "Linear", description: "Momentum for every team", slug: "linear" },
];

export function AILogoMarquee() {
  return (
    <section className="ai-ecosystem" aria-labelledby="ai-ecosystem-title">
      <div className="ai-ecosystem-heading">
        <div>
          <span className="ai-ecosystem-eyebrow">
            <Layers3 size={13} /> A connected way to work
          </span>
          <h2 id="ai-ecosystem-title">
            Familiar tools.
            <br />
            <span>A world of possibilities.</span>
          </h2>
        </div>
        <p>
          Bring a little more intelligence to your everyday.
          <br />
          Inspired by the tools your team already knows.
        </p>
      </div>
      <div
        className="ai-ecosystem-window"
        tabIndex={0}
        aria-label="Company logos. Hover or focus to pause scrolling."
      >
        <div className="ai-ecosystem-track">
          {[0, 1].map((copy) => (
            <div
              className="ai-ecosystem-group"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {tools.map((tool) => (
                <div className={`ai-ecosystem-card ai-ecosystem-${tool.slug}`} key={tool.slug}>
                  <span className="ai-ecosystem-mark">
                    <Image
                      src={`/images/marketing/crm/logos/${tool.slug}.svg`}
                      alt=""
                      width={28}
                      height={28}
                      loading="eager"
                    />
                  </span>
                  <div>
                    <b>{tool.name}</b>
                    <small>{tool.description}</small>
                  </div>
                  <ArrowUpRight size={12} className="ai-ecosystem-arrow" aria-hidden="true" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
