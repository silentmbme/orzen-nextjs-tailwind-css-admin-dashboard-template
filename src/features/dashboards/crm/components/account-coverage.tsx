"use client";
import { useState } from "react";
import Link from "next/link";
import { Network } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ageDays,
  demoToday,
  currency,
  isOpenDeal,
  type CrmData,
  type Opportunity,
} from "@/features/crm/types";

export function AccountCoverage({ data, deals }: { data: CrmData; deals: Opportunity[] }) {
  const [view, setView] = useState("attention");
  const accounts = data.companies
    .filter((company) => deals.some((deal) => deal.companyId === company.id))
    .map((company) => {
      const contacts = data.contacts.filter((contact) => contact.companyId === company.id);
      const touched = data.activities.some(
        (activity) =>
          activity.completed &&
          activity.date <= demoToday &&
          ageDays(activity.date) <= 30 &&
          contacts.some((contact) => contact.id === activity.contactId),
      );
      const value = deals
        .filter((deal) => deal.companyId === company.id && isOpenDeal(deal))
        .reduce((sum, deal) => sum + deal.value, 0);
      return { ...company, contacts: contacts.length, touched, value };
    })
    .sort((a, b) => b.value - a.value);
  const covered = accounts.filter((account) => account.touched).length;
  const visible = accounts.filter((account) => view === "all" || !account.touched);
  return (
    <Card
      className="crm-account-coverage"
      title={
        <>
          <Network size={14} /> ACCOUNT COVERAGE
        </>
      }
      action={
        <Select
          aria-label="Account coverage view"
          value={view}
          onChange={(event) => setView(event.target.value)}
        >
          <option value="attention">Needs a touchpoint</option>
          <option value="all">All accounts</option>
        </Select>
      }
    >
      <div className="crm-coverage-summary">
        <strong>{accounts.length ? Math.round((covered / accounts.length) * 100) : 0}%</strong>
        <div>
          <b>
            {covered} of {accounts.length} accounts engaged
          </b>
          <small>Completed touchpoint within 30 days</small>
        </div>
      </div>
      <div className="crm-coverage-list">
        {visible.length ? (
          visible.map((account) => (
            <Link key={account.id} href={`/crm/companies/${account.id}`}>
              <span className="crm-coverage-mark">
                {account.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <span>
                <b>{account.name}</b>
                <small>
                  {account.contacts} contacts / {currency(account.value)} open pipeline
                </small>
              </span>
              <Badge tone={account.touched ? "success" : "neutral"}>
                {account.touched ? "Engaged" : "Follow up"}
              </Badge>
            </Link>
          ))
        ) : (
          <EmptyState>
            {accounts.length
              ? "All selected accounts have a recent touchpoint."
              : "No accounts linked to the selected opportunities."}
          </EmptyState>
        )}
      </div>
      <p className="crm-footnote">
        Accounts linked to the filtered opportunities. Coverage uses completed activities in the 30
        days before the fixed demo date.
      </p>
    </Card>
  );
}
