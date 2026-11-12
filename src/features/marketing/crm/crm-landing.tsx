import { CrmClosingCta } from "./crm-closing-cta";
import { CrmPlans, CrmQuestions } from "./crm-plans-and-faq";
import { CrmHero, CrmReferenceSections } from "./crm-scenes";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { MarketingContainer, MarketingSection } from "@/components/marketing/marketing-container";
import { DemoForm } from "@/components/marketing/demo-form";
import { PipelinePreview } from "./pipeline-preview";
import "./crm-landing.css";
export function CrmLanding() {
  return (
    <div className="crm-experience">
      <CrmHero />
      <CrmReferenceSections />
      <MarketingSection
        className="crm-pipeline-section"
        id="pipeline"
        eyebrow="Every opportunity has a story"
        title="A pipeline you can actually work with."
        description="See what needs attention, what’s moving, and what comes next. Select a demo deal and move it forward."
      >
        <PipelinePreview />
      </MarketingSection>
      <CrmPlans />
      <section id="contact" className="border-y border-border bg-surface-alt py-16">
        <MarketingContainer>
          <div className="grid gap-10 md:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="marketing-eyebrow">Start a conversation</p>
              <h2 className="marketing-heading">
                A better sales day
                <br />
                starts with a hello.
              </h2>
              <p className="marketing-copy mt-5 max-w-md">
                Explore a consultation request flow built for the demo. The form validates your
                details locally and shows a confirmation without sending them anywhere.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <UserAvatar name="Daniel Kim" size={36} />
                <p className="text-[11px] text-muted">
                  Meet the fictional Orzen team.
                  <br />A human-first product concept.
                </p>
              </div>
            </div>
            <Card className="p-6!">
              <h3 className="mb-4 text-[16px] font-medium">Let’s find your next step.</h3>
              <DemoForm kind="lead" />
            </Card>
          </div>
        </MarketingContainer>
      </section>
      <CrmQuestions />
      <CrmClosingCta />
    </div>
  );
}
