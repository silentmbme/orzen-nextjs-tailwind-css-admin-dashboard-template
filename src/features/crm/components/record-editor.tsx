"use client";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCrm } from "../hooks/use-crm";
import { crmService } from "../demo-service";
import { demoToday, owners, pipelines, stages, type CrmRecord, type Entity } from "../types";

type Field = {
  name: string;
  label: string;
  type?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string;
  optional?: boolean;
  min?: number;
  max?: number;
};
const choices = (items: readonly string[]) => items.map((value) => ({ value, label: value }));

export function RecordEditor({
  entity,
  record,
  open,
  onClose,
}: {
  entity: Entity;
  record?: CrmRecord;
  open: boolean;
  onClose: () => void;
}) {
  const { data } = useCrm();
  const initial = Object.fromEntries(
    Object.entries(record || {}).map(([key, value]) => [key, String(value)]),
  );
  const [companyId, setCompanyId] = useState(initial.companyId || data.companies[0]?.id || "");
  const [error, setError] = useState("");
  const companies = data.companies.map((company) => ({ value: company.id, label: company.name }));
  const contacts = data.contacts
    .filter((contact) => entity !== "opportunity" || contact.companyId === companyId)
    .map((contact) => ({ value: contact.id, label: contact.name }));
  const company: Field = { name: "companyId", label: "Company", options: companies };
  const owner: Field = { name: "owner", label: "Owner", options: choices(owners) };
  const contact: Field = { name: "contactId", label: "Contact", options: contacts };
  const definitions: Record<Entity, Field[]> = {
    company: [
      { name: "name", label: "Company name" },
      { name: "industry", label: "Industry" },
      { name: "website", label: "Website", type: "url", defaultValue: "https://" },
      {
        name: "size",
        label: "Employees",
        type: "number",
        min: 1,
        max: 1000000,
        defaultValue: "50",
      },
      {
        name: "region",
        label: "Region",
        options: choices(["North America", "Europe", "Asia Pacific", "Other"]),
      },
    ],
    contact: [
      { name: "name", label: "Full name" },
      { name: "email", label: "Email", type: "email" },
      { name: "title", label: "Job title" },
      company,
      { name: "phone", label: "Phone", type: "tel", optional: true },
      owner,
    ],
    lead: [
      { name: "name", label: "Full name" },
      { name: "email", label: "Email", type: "email" },
      company,
      owner,
      {
        name: "source",
        label: "Source",
        options: choices(["Website", "Referral", "Event", "Outbound"]),
      },
      {
        name: "status",
        label: "Status",
        options: choices(["New", "Contacted", "Qualified", "Converted"]),
      },
      { name: "score", label: "Lead score", type: "number", min: 0, max: 100, defaultValue: "50" },
    ],
    opportunity: [
      { name: "name", label: "Opportunity name" },
      company,
      contact,
      owner,
      {
        name: "value",
        label: "Value (USD)",
        type: "number",
        min: 1,
        max: 1000000000,
        defaultValue: "10000",
      },
      { name: "pipeline", label: "Pipeline", options: choices(pipelines) },
      { name: "stage", label: "Stage", options: choices(stages) },
      {
        name: "probability",
        label: "Probability (%)",
        type: "number",
        min: 0,
        max: 100,
        defaultValue: "20",
      },
      { name: "health", label: "Deal health", options: choices(["Healthy", "Watch", "At risk"]) },
      { name: "closeDate", label: "Expected close", type: "date", defaultValue: "2026-12-01" },
    ],
    activity: [
      { name: "title", label: "Activity title" },
      contact,
      { name: "kind", label: "Type", options: choices(["Call", "Email", "Note", "Task"]) },
      { name: "date", label: "Due date", type: "date", defaultValue: demoToday },
      { name: "notes", label: "Notes", optional: true },
    ],
    meeting: [
      { name: "title", label: "Meeting title" },
      contact,
      { name: "date", label: "Date", type: "date", defaultValue: "2026-11-05" },
      { name: "time", label: "Time (demo local time)", type: "time", defaultValue: "10:00" },
      {
        name: "duration",
        label: "Duration (minutes)",
        type: "number",
        min: 15,
        max: 480,
        defaultValue: "30",
      },
      { name: "location", label: "Location", defaultValue: "Video call" },
    ],
  };
  const fields = definitions[entity];
  return (
    <Dialog open={open} title={`${record ? "Edit" : "Add"} ${entity}`} onClose={onClose}>
      <form
        className="crm-record-form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const values = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<
            string,
            string
          >;
          if (fields.some((field) => !field.optional && !values[field.name]?.trim())) {
            setError("Complete all required fields.");
            return;
          }
          const failure = crmService.save(entity, { ...initial, ...values }, record?.id);
          if (failure) setError(failure);
          else onClose();
        }}
      >
        <p className="crm-form-hint">
          Local demo only. Required fields are marked *. Nothing is sent to a server.
        </p>
        <div className="crm-form-grid">
          {fields.map((field) => (
            <FormField
              key={field.name}
              htmlFor={`crm-${field.name}`}
              label={`${field.label}${field.optional ? "" : " *"}`}
            >
              {field.options ? (
                <Select
                  key={field.name === "contactId" ? companyId : field.name}
                  id={`crm-${field.name}`}
                  name={field.name}
                  required={!field.optional}
                  defaultValue={
                    field.name === "companyId"
                      ? companyId
                      : initial[field.name] || field.defaultValue || field.options[0]?.value || ""
                  }
                  onChange={
                    field.name === "companyId"
                      ? (event) => setCompanyId(event.target.value)
                      : undefined
                  }
                >
                  {!field.options.length && (
                    <option value="">
                      Create a {field.name === "companyId" ? "company" : "contact"} first
                    </option>
                  )}
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  id={`crm-${field.name}`}
                  name={field.name}
                  type={field.type || "text"}
                  required={!field.optional}
                  maxLength={1000}
                  min={field.min}
                  max={field.max}
                  step={field.name === "value" ? "0.01" : undefined}
                  defaultValue={initial[field.name] ?? field.defaultValue ?? ""}
                />
              )}
            </FormField>
          ))}
        </div>
        {error && (
          <p role="alert" className="crm-error">
            {error}
          </p>
        )}
        <div className="crm-form-actions">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">
            Save demo {entity}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
