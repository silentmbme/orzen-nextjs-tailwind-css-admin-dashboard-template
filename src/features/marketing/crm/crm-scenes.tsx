import { CrmTestimonialSlider } from "./crm-testimonial-slider";
import { CrmLogoMarquee } from "./crm-logo-marquee";
import {
  ArrowUpRight,
  Check,
  Target,
  CalendarCheck2,
  TrendingUp,
  Users,
  MessageSquare,
  ShieldCheck,
  Zap,
  Smartphone,
} from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import Link from "next/link";
import { MarketingContainer, HeroAction } from "@/components/marketing/marketing-container";

const capabilities = [
  {
    icon: Users,
    title: "Relationships, connected",
    copy: "Bring people, companies, and their conversations into one thoughtful workspace.",
  },
  {
    icon: MessageSquare,
    title: "Context in every conversation",
    copy: "Pick up where your teammate left off, with a shared customer story.",
  },
  {
    icon: Zap,
    title: "Momentum without the admin",
    copy: "Give every opportunity a clear owner and a purposeful next step.",
  },
  {
    icon: TrendingUp,
    title: "Signals you can act on",
    copy: "Understand pipeline movement and spot the deals that need attention.",
  },
  {
    icon: ShieldCheck,
    title: "A considered workspace",
    copy: "Keep important details organized and team responsibilities clear.",
  },
  {
    icon: Smartphone,
    title: "Ready for your sales day",
    copy: "A comfortable workspace, from your morning desk to your next meeting.",
  },
];
function Phone() {
  return (
    <div className="crm-phone">
      <div className="crm-notch" />
      <div className="flex justify-between text-[10px]">
        <b>9:41</b>
        <span>••• ▰</span>
      </div>
      <p className="mt-7 font-semibold text-accent">Orzen CRM</p>
      <h3 className="mt-2 text-[20px] font-semibold">Good morning, Alex.</h3>
      <p className="mt-1 text-[11px] text-muted">A little clarity for your sales day.</p>
      <div className="crm-phone-value">
        <small>Revenue this month</small>
        <strong>$48,250</strong>
        <span>↗ 12.8% from last month</span>
      </div>
      <div className="crm-phone-bars" role="img" aria-label="Monthly revenue trend increasing">
        {[35, 52, 43, 65, 57, 82, 72, 95].map((height, i) => (
          <i key={i} style={{ height: `${height}%` }} />
        ))}
      </div>
      <div className="my-4 flex justify-between text-[12px]">
        <b>Your next conversations</b>
        <CalendarCheck2 size={15} />
      </div>
      {["Sofia Garcia", "Daniel Kim"].map((name, i) => (
        <div className="crm-phone-person" key={name}>
          <UserAvatar name={name} size={28} />
          <div>
            <b>{name}</b>
            <small>{i ? "Proposal review · 11:30" : "Walkthrough · 10:00"}</small>
          </div>
          <ArrowUpRight size={13} />
        </div>
      ))}
    </div>
  );
}
function Revenue() {
  return (
    <div className="crm-revenue">
      <div className="flex items-center gap-3">
        <UserAvatar name="Alex Morgan" size={36} />
        <div>
          <b>Alex Morgan</b>
          <small>Account executive · Northline</small>
        </div>
        <span className="crm-live">Active</span>
      </div>
      <div className="crm-revenue-value">
        <small>Opportunity value</small>
        <strong>
          $32,450 <span>USD</span>
        </strong>
        <span className="text-accent text-[11px]">↗ 18.6% this quarter</span>
      </div>
      <div className="crm-revenue-bottom">
        <div>
          <small>Revenue won</small>
          <b>$24,800</b>
        </div>
        <div>
          <small>In negotiation</small>
          <b>$7,650</b>
        </div>
      </div>
    </div>
  );
}
function Heading({ label, title, copy }: { label: string; title: string; copy: string }) {
  return (
    <div className="crm-centered-heading">
      <p className="marketing-eyebrow">{label}</p>
      <h2 className="marketing-heading">{title}</h2>
      <p className="marketing-copy mt-4">{copy}</p>
    </div>
  );
}
export function CrmHero() {
  return (
    <>
      <section className="crm-reference-hero">
        <MarketingContainer>
          <div className="crm-hero-copy">
            <p className="crm-pill">A clearer way to grow</p>
            <h1>
              Great relationships.
              <br />
              <span>Extraordinary possibilities.</span>
            </h1>
            <p>
              Bring your people, pipeline, and next steps together.
              <br className="hidden sm:block" /> Make every sales conversation count.
            </p>
            <div className="crm-hero-actions">
              <HeroAction href="/dashboards/crm">Explore your workspace</HeroAction>
              <a href="#pipeline">
                See how it works <ArrowUpRight size={15} />
              </a>
            </div>
            <div className="crm-hero-proof">
              <Check size={13} /> One connected workspace <span>•</span> Built around your team
            </div>
          </div>
          <div className="crm-hero-composition">
            <div className="crm-hero-side">
              <div className="crm-hero-team-card">
                <div className="crm-hero-team-portraits">
                  <UserAvatar name="Sofia Garcia" size={42} />
                  <UserAvatar name="Daniel Kim" size={42} />
                  <UserAvatar name="Priya Shah" size={42} />
                </div>
                <div>
                  <b>Great people. Shared momentum.</b>
                  <span>Your team, a little more connected.</span>
                </div>
                <span className="crm-hero-team-live">
                  <i />
                  Together
                </span>
              </div>
              <div className="crm-target-card">
                <Target size={23} />
                <small>Monthly target</small>
                <strong>
                  84.6<span>%</span>
                </strong>
                <p>More of the right opportunities.</p>
                <div className="crm-phone-bars">
                  {[32, 48, 38, 66, 57, 82, 95].map((height, i) => (
                    <i key={i} style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
              <div className="crm-scene-chip">
                <UserAvatar name="Priya Shah" size={28} />
                <span>
                  New connection made<b>Just now</b>
                </span>
                <Check size={15} />
              </div>
            </div>
            <Phone />
            <div className="crm-hero-side">
              <div className="crm-hero-contact-card">
                <UserAvatar name="Sofia Garcia" size={58} />
                <div>
                  <span className="crm-hero-contact-label">Your next conversation</span>
                  <b>Sofia Garcia</b>
                  <small>Operations lead · Forma Studio</small>
                </div>
                <span className="crm-hero-contact-check">
                  <Check size={14} />
                </span>
              </div>
              <Revenue />
              <div className="crm-scene-chip">
                <CalendarCheck2 size={22} />
                <span>
                  Your next meeting<b>Today, 10:00 AM</b>
                </span>
              </div>
            </div>
          </div>
        </MarketingContainer>
      </section>
      <CrmLogoMarquee />
    </>
  );
}
export function CrmReferenceSections() {
  return (
    <>
      <section className="crm-section" id="features">
        <MarketingContainer>
          <Heading
            label="Your process. Beautifully connected."
            title="Give every opportunity a clear path."
            copy="A thoughtful sales rhythm, from the first hello to the next big milestone."
          />
          <div className="crm-setup">
            <div>
              {capabilities.slice(0, 3).map(({ icon: Icon, title, copy }) => (
                <article className="crm-setup-item" key={title}>
                  <Icon size={18} />
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
            <div className="crm-setup-phone">
              <Phone />
            </div>
            <div>
              {capabilities.slice(3).map(({ icon: Icon, title, copy }) => (
                <article className="crm-setup-item" key={title}>
                  <Icon size={18} />
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </MarketingContainer>
      </section>
      <section className="crm-section crm-focus-section">
        <MarketingContainer className="grid items-center gap-12 lg:grid-cols-2">
          <div className="crm-focus-scene">
            <div className="crm-project-card">
              <b>Quarterly priorities</b>
              {["Northline expansion", "Forma onboarding", "Cedar partnership"].map((x, i) => (
                <div className="crm-project-row" key={x}>
                  <Check size={14} />
                  <span>{x}</span>
                  <small>{["Won", "Review", "Active"][i]}</small>
                </div>
              ))}
            </div>
            <div className="crm-member-card">
              <b>Your people, in sync</b>
              {["Sofia Garcia", "Alex Morgan", "Priya Shah"].map((name, i) => (
                <div key={name}>
                  <UserAvatar name={name} size={32} />
                  <span>
                    <b>{name}</b>
                    <small>{["Account lead", "Sales manager", "Customer success"][i]}</small>
                  </span>
                  <i />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="marketing-eyebrow">Focus on what moves you forward</p>
            <h2 className="marketing-heading">
              Less chasing updates.
              <br />
              More meaningful progress.
            </h2>
            <p className="marketing-copy mt-5">
              Turn scattered conversations into a shared, actionable view of every relationship.
              Give your team the space to do their best work.
            </p>
            <div className="crm-focus-benefits">
              {[
                "Clear ownership",
                "Thoughtful follow-ups",
                "Customer context",
                "A purposeful next step",
              ].map((x) => (
                <span key={x}>
                  <Check size={15} />
                  {x}
                </span>
              ))}
            </div>
            <HeroAction href="/dashboards/crm">Meet your next opportunity</HeroAction>
          </div>
        </MarketingContainer>
      </section>
      <section className="crm-network">
        <MarketingContainer>
          <Heading
            label="A connected sales day"
            title="Small connections. Bigger possibilities."
            copy="The right people, the right context, and a shared view of what comes next."
          />
          <div className="crm-network-scene">
            <svg viewBox="0 0 1000 320" preserveAspectRatio="none" aria-hidden="true">
              <path d="M180 80 H270 Q300 80 300 110 V140 Q300 160 325 160 H500 M820 80 H730 Q700 80 700 110 V140 Q700 160 675 160 H500 M180 240 H270 Q300 240 300 210 V180 Q300 160 325 160 H500 M820 240 H730 Q700 240 700 210 V180 Q700 160 675 160 H500" />
              <path
                className="crm-network-flow"
                d="M180 80 H270 Q300 80 300 110 V140 Q300 160 325 160 H500 M820 80 H730 Q700 80 700 110 V140 Q700 160 675 160 H500 M180 240 H270 Q300 240 300 210 V180 Q300 160 325 160 H500 M820 240 H730 Q700 240 700 210 V180 Q700 160 675 160 H500"
              />
            </svg>
            <Revenue />
            {["Sofia Garcia", "Priya Shah", "Daniel Kim", "Alex Morgan"].map((name, i) => (
              <div className={`crm-network-person crm-np-${i}`} key={name}>
                <UserAvatar name={name} size={36} />
                <div className="crm-network-person-copy">
                  <b>{name}</b>
                  <span>
                    {["New connection", "Proposal sent", "Deal won", "Follow-up ready"][i]}
                  </span>
                </div>
                <span className="crm-network-check">
                  <Check size={12} />
                </span>
              </div>
            ))}
          </div>
        </MarketingContainer>
      </section>
      <section className="crm-section">
        <MarketingContainer>
          <Heading
            label="Thoughtfully equipped"
            title="Everything you need to stay in the flow."
            copy="Useful tools. Clear information. More room for the work that matters."
          />
          <div className="crm-feature-grid">
            {capabilities.map(({ icon: Icon, title, copy }, i) => (
              <article key={title}>
                <span className={`crm-feature-icon crm-tone-${i % 4}`}>
                  <Icon size={20} />
                </span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <Link href="/dashboards/crm" aria-label={`Explore ${title}`}>
                  <ArrowUpRight size={17} />
                </Link>
              </article>
            ))}
          </div>
        </MarketingContainer>
      </section>
      <CrmTestimonialSlider />
    </>
  );
}
