"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, UserRoundSearch } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { DataTable, type DataColumn } from "@/components/ui/data-table";
import { CrmWorkspace } from "./crm-workspace";
import { RecordEditor } from "./record-editor";
import { useCrm } from "../hooks/use-crm";
import { owners, type Lead } from "../types";

export function LeadsTable() {
  const { data } = useCrm();
  const [status, setStatus] = useState("All statuses");
  const [owner, setOwner] = useState("All owners");
  const [editor, setEditor] = useState<Lead | "new" | null>(null);
  const leads = data.leads.filter(
    (lead) =>
      (status === "All statuses" || lead.status === status) &&
      (owner === "All owners" || lead.owner === owner),
  );
  const columns: DataColumn<Lead>[] = [
    {
      key: "name",
      label: "Lead",
      value: (lead) => `${lead.name} ${lead.email}`,
      render: (lead) => (
        <>
          <Link href={`/crm/leads/${lead.id}`} className="crm-record-name">
            {lead.name}
          </Link>
          <span className="crm-subline">{lead.email}</span>
        </>
      ),
    },
    {
      key: "company",
      label: "Company",
      value: (lead) => data.companies.find((company) => company.id === lead.companyId)?.name || "",
      render: (lead) => (
        <Link href={`/crm/companies/${lead.companyId}`} className="crm-text-link">
          {data.companies.find((company) => company.id === lead.companyId)?.name}
        </Link>
      ),
    },
    {
      key: "score",
      label: "Score",
      value: (lead) => lead.score,
      render: (lead) => <span className="crm-score">{lead.score} / 100</span>,
    },
    {
      key: "status",
      label: "Status",
      value: (lead) => lead.status,
      render: (lead) => (
        <Badge tone={lead.status === "Converted" ? "success" : "neutral"}>{lead.status}</Badge>
      ),
    },
    { key: "source", label: "Source", value: (lead) => lead.source },
    { key: "owner", label: "Owner", value: (lead) => lead.owner },
    {
      key: "edit",
      label: "Manage",
      value: (lead) => lead.id,
      render: (lead) => (
        <Button size="sm" aria-label={`Edit lead ${lead.name}`} onClick={() => setEditor(lead)}>
          Edit
        </Button>
      ),
    },
  ];
  return (
    <CrmWorkspace>
      <div className="crm-page-heading">
        <div>
          <h2>Lead qualification</h2>
          <p>Prioritize intent, assign ownership and turn new interest into conversations.</p>
        </div>
        <Button variant="dark" onClick={() => setEditor("new")}>
          <Plus size={13} />
          Add lead
        </Button>
      </div>
      <div className="crm-lead-statuses">
        {["All statuses", "New", "Contacted", "Qualified", "Converted"].map((value) => (
          <button key={value} aria-pressed={status === value} onClick={() => setStatus(value)}>
            <span>{value === "All statuses" ? "All leads" : value}</span>
            <b>
              {
                data.leads.filter((lead) => value === "All statuses" || lead.status === value)
                  .length
              }
            </b>
          </button>
        ))}
      </div>
      <Card
        title={
          <>
            <UserRoundSearch size={14} /> LEAD WORKSPACE
          </>
        }
        action={
          <Select
            aria-label="Lead owner"
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
          >
            <option>All owners</option>
            {owners.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        }
      >
        <DataTable
          rows={leads}
          columns={columns}
          rowKey={(lead) => lead.id}
          label="Leads"
          pageSize={6}
        />
      </Card>
      {editor && (
        <RecordEditor
          key={editor === "new" ? "new" : editor.id}
          entity="lead"
          record={editor === "new" ? undefined : editor}
          open
          onClose={() => setEditor(null)}
        />
      )}
    </CrmWorkspace>
  );
}
