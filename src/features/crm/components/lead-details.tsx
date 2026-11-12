"use client";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { CrmWorkspace } from "./crm-workspace";
import { RecordEditor } from "./record-editor";
import { ActivityTimeline } from "./activity-timeline";
import { useCrm } from "../hooks/use-crm";
import { crmService } from "../demo-service";
import { shortDate } from "../types";

export function LeadDetails({ id }: { id: string }) {
  const { data, ready } = useCrm();
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const lead = data.leads.find((item) => item.id === id);
  if (!lead)
    return (
      <CrmWorkspace>
        <EmptyState>
          {ready ? "This lead does not exist in the local demo." : "Loading lead..."}
          <p>
            <Link className="crm-text-link" href="/crm/leads">
              Back to leads
            </Link>
          </p>
        </EmptyState>
      </CrmWorkspace>
    );
  const company = data.companies.find((item) => item.id === lead.companyId);
  const contacts = data.contacts.filter((item) => item.companyId === lead.companyId);
  return (
    <CrmWorkspace>
      <div className="crm-detail-heading">
        <Link className="crm-text-link" href="/crm/leads">
          <ArrowLeft size={12} />
          Back to leads
        </Link>
        <Button onClick={() => setEditing(true)}>
          <Pencil size={12} />
          Edit lead
        </Button>
      </div>
      <div className="crm-detail-grid">
        <Card>
          <div className="crm-person">
            <UserAvatar name={lead.name} size={34} className="crm-person-avatar" />
            <div>
              <h2>{lead.name}</h2>
              <Badge tone={lead.status === "Converted" ? "success" : "neutral"}>
                {lead.status}
              </Badge>
            </div>
          </div>
          <dl className="crm-description-list">
            <dt>Email</dt>
            <dd>{lead.email}</dd>
            <dt>Owner</dt>
            <dd>{lead.owner}</dd>
            <dt>Source</dt>
            <dd>{lead.source}</dd>
            <dt>Created</dt>
            <dd>{shortDate(lead.created)}</dd>
            <dt>Lead score</dt>
            <dd>
              <b>{lead.score}</b> / 100
            </dd>
          </dl>
          <progress
            className="crm-progress"
            value={lead.score}
            max={100}
            aria-label="Lead qualification score"
          />
          <p className="crm-footnote">
            Demo score estimates fit and buying intent. It is editable and does not use live
            tracking.
          </p>
          <Button
            disabled={lead.status === "Converted"}
            onClick={() => {
              const values = Object.fromEntries(
                Object.entries(lead).map(([key, value]) => [key, String(value)]),
              );
              const error = crmService.save("lead", { ...values, status: "Converted" }, lead.id);
              setMessage(
                error ||
                  "Lead marked converted in the local demo. No external account was created.",
              );
            }}
          >
            Mark converted
          </Button>
          {message && (
            <p className="crm-footnote" role="status">
              {message}
            </p>
          )}
        </Card>
        <div className="crm-detail-stack">
          <Card
            title={
              <>
                <Building2 size={14} /> ACCOUNT CONTEXT
              </>
            }
            action={
              <Link className="crm-text-link" href={`/crm/companies/${lead.companyId}`}>
                Company profile
              </Link>
            }
          >
            <h2>{company?.name}</h2>
            <p className="crm-muted">
              {company?.industry} / {company?.region}
            </p>
            <div className="crm-inline-stats">
              <span>
                <b>{company?.size}</b>
                <small>employees</small>
              </span>
              <span>
                <b>{contacts.length}</b>
                <small>known contacts</small>
              </span>
              <span>
                <b>
                  {data.opportunities.filter((deal) => deal.companyId === lead.companyId).length}
                </b>
                <small>opportunities</small>
              </span>
            </div>
          </Card>
          <Card title="COMPANY CONVERSATION HISTORY">
            <ActivityTimeline
              activities={data.activities.filter((activity) =>
                contacts.some((contact) => contact.id === activity.contactId),
              )}
              contacts={data.contacts}
            />
          </Card>
        </div>
      </div>
      {editing && (
        <RecordEditor entity="lead" record={lead} open onClose={() => setEditing(false)} />
      )}
    </CrmWorkspace>
  );
}
