"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Users, Radio } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CrmWorkspace } from "@/features/crm/components/crm-workspace";
import { RecordEditor } from "@/features/crm/components/record-editor";
import { useCrm } from "@/features/crm/hooks/use-crm";
import { ageDays, pipelines } from "@/features/crm/types";
import { PipelineOverview } from "./components/pipeline-overview";
import { ConversionFunnel } from "./components/conversion-funnel";
import { DealRiskMatrix } from "./components/deal-risk-matrix";
import { DealAging } from "./components/deal-aging";
import { UpcomingFollowups } from "./components/upcoming-followups";
import { RevenueForecast } from "./components/revenue-forecast";
import { PriorityOpportunities } from "./components/priority-opportunities";
import { LeadSources } from "./components/lead-sources";
import { AccountCoverage } from "./components/account-coverage";
import "./crm-dashboard.css";

export function CrmDashboard() {
  const { data } = useCrm();
  const [pipeline, setPipeline] = useState("All pipelines");
  const [days, setDays] = useState("90");
  const [add, setAdd] = useState(false);
  const deals = data.opportunities.filter(
    (deal) =>
      (pipeline === "All pipelines" || deal.pipeline === pipeline) &&
      (days === "all" || ageDays(deal.created) <= Number(days)),
  );
  const completed = data.activities.filter((item) => item.completed).length;
  const engaged = new Set(
    data.activities.filter((item) => item.completed).map((item) => item.contactId),
  ).size;
  return (
    <CrmWorkspace>
      <div className="crm-command-center">
        <div>
          <h2>Your CRM command center</h2>
          <p>Move the right conversations forward. Demo snapshot: November 1, 2026.</p>
        </div>
        <div className="crm-command-controls">
          <Select
            aria-label="CRM pipeline"
            value={pipeline}
            onChange={(event) => setPipeline(event.target.value)}
          >
            <option>All pipelines</option>
            {pipelines.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
          <Select
            aria-label="CRM date range"
            value={days}
            onChange={(event) => setDays(event.target.value)}
          >
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All time</option>
          </Select>
          <Button variant="dark" onClick={() => setAdd(true)}>
            <Plus size={13} />
            Add opportunity
          </Button>
        </div>
      </div>
      <div className="crm-quick-access">
        <Link href="/crm/contacts">
          <Users size={13} />
          Contact directory
        </Link>
        <Link href="/crm/activities">
          <Radio size={13} />
          Activity stream
        </Link>
        <span>Filters apply to opportunity insights below.</span>
      </div>
      <PipelineOverview deals={deals} />
      <div className="crm-relationship-grid">
        <ConversionFunnel deals={deals} />
        <UpcomingFollowups data={data} />
      </div>
      <div className="crm-intelligence-grid">
        <DealRiskMatrix deals={deals} />
        <DealAging deals={deals} />
        <Card
          title={
            <>
              <Radio size={14} /> CUSTOMER ENGAGEMENT
            </>
          }
        >
          <div className="crm-engagement-score">
            <strong>
              {data.contacts.length ? Math.round((engaged / data.contacts.length) * 100) : 0}%
            </strong>
            <span>contacts with a completed touchpoint</span>
          </div>
          <div className="crm-engagement-list">
            <span>
              Engaged contacts
              <b>
                {engaged} / {data.contacts.length}
              </b>
            </span>
            <span>
              Completed activities<b>{completed}</b>
            </span>
            <span>
              Pending touchpoints<b>{data.activities.length - completed}</b>
            </span>
            <span>
              Upcoming meetings
              <b>{data.meetings.filter((meeting) => !meeting.completed).length}</b>
            </span>
          </div>
          <p className="crm-footnote">
            All contacts, activities and meetings. Completing a follow-up updates these figures.
          </p>
          <Link className="crm-bottom-link" href="/crm/activities">
            Plan the next touchpoint
          </Link>
        </Card>
      </div>
      <div className="crm-growth-grid">
        <RevenueForecast deals={deals} />
        <PriorityOpportunities deals={deals} companies={data.companies} />
      </div>
      <div className="crm-acquisition-grid">
        <AccountCoverage data={data} deals={deals} />
        <LeadSources
          leads={data.leads.filter(
            (lead) => days === "all" || ageDays(lead.created) <= Number(days),
          )}
        />
      </div>
      {add && <RecordEditor entity="opportunity" open onClose={() => setAdd(false)} />}
    </CrmWorkspace>
  );
}
