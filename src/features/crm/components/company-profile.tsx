"use client";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Building2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { CrmWorkspace } from "./crm-workspace";
import { RecordEditor } from "./record-editor";
import { ActivityTimeline } from "./activity-timeline";
import { useCrm } from "../hooks/use-crm";
import { currency, isOpenDeal, type Company } from "../types";

export function CompaniesPage() {
  const { data } = useCrm();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All regions");
  const [order, setOrder] = useState("name");
  const [page, setPage] = useState(0);
  const [add, setAdd] = useState(false);
  const companies = data.companies
    .filter(
      (company) =>
        (region === "All regions" || company.region === region) &&
        `${company.name} ${company.industry}`.toLowerCase().includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => (order === "size" ? b.size - a.size : a.name.localeCompare(b.name)));
  const current = Math.min(page, Math.max(0, Math.ceil(companies.length / 5) - 1));
  return (
    <CrmWorkspace>
      <div className="crm-page-heading">
        <div>
          <h2>Companies</h2>
          <p>Understand each account, its people and its commercial potential.</p>
        </div>
        <Button variant="dark" onClick={() => setAdd(true)}>
          <Plus size={13} />
          Add company
        </Button>
      </div>
      <div className="crm-filter-bar">
        <Input
          aria-label="Search companies"
          placeholder="Search company or industry..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(0);
          }}
        />
        <Select
          aria-label="Company region"
          value={region}
          onChange={(event) => {
            setRegion(event.target.value);
            setPage(0);
          }}
        >
          <option>All regions</option>
          {[...new Set(data.companies.map((company) => company.region))].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </Select>
        <Select
          aria-label="Company sort"
          value={order}
          onChange={(event) => {
            setOrder(event.target.value);
            setPage(0);
          }}
        >
          <option value="name">Name A–Z</option>
          <option value="size">Largest first</option>
        </Select>
      </div>
      <Card
        title={
          <>
            <Building2 size={14} /> COMPANY RELATIONSHIPS
          </>
        }
        action={<Badge>{companies.length} accounts</Badge>}
      >
        <div className="crm-company-list">
          {companies.slice(current * 5, current * 5 + 5).map((company) => {
            const open = data.opportunities.filter(
              (deal) => deal.companyId === company.id && isOpenDeal(deal),
            );
            return (
              <div key={company.id}>
                <span className="crm-company-mark">
                  {company.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div>
                  <Link className="crm-record-name" href={`/crm/companies/${company.id}`}>
                    {company.name}
                  </Link>
                  <small>
                    {company.industry} / {company.region} / {company.size} employees
                  </small>
                </div>
                <span>
                  <b>
                    {data.contacts.filter((contact) => contact.companyId === company.id).length}
                  </b>
                  <small>contacts</small>
                </span>
                <span>
                  <b>{currency(open.reduce((sum, deal) => sum + deal.value, 0))}</b>
                  <small>open pipeline</small>
                </span>
                <Link className="crm-text-link" href={`/crm/companies/${company.id}`}>
                  View account <ArrowUpRight size={12} />
                </Link>
              </div>
            );
          })}
          {!companies.length && <EmptyState>No companies match this view.</EmptyState>}
        </div>
        <div className="crm-directory-pagination">
          <Button size="sm" disabled={!current} onClick={() => setPage(current - 1)}>
            Previous companies
          </Button>
          <span>
            {companies.length ? current + 1 : 0} / {Math.ceil(companies.length / 5)}
          </span>
          <Button
            size="sm"
            disabled={(current + 1) * 5 >= companies.length}
            onClick={() => setPage(current + 1)}
          >
            Next companies
          </Button>
        </div>
      </Card>
      {add && <RecordEditor entity="company" open onClose={() => setAdd(false)} />}
    </CrmWorkspace>
  );
}

export function CompanyProfile({ id }: { id: string }) {
  const { data, ready } = useCrm();
  const [editing, setEditing] = useState(false);
  const company: Company | undefined = data.companies.find((item) => item.id === id);
  if (!company)
    return (
      <CrmWorkspace>
        <EmptyState>
          {ready ? "This company does not exist in the local demo." : "Loading company..."}
          <p>
            <Link href="/crm/companies" className="crm-text-link">
              Back to companies
            </Link>
          </p>
        </EmptyState>
      </CrmWorkspace>
    );
  const contacts = data.contacts.filter((contact) => contact.companyId === company.id);
  const deals = data.opportunities.filter((deal) => deal.companyId === company.id);
  return (
    <CrmWorkspace>
      <div className="crm-detail-heading">
        <Link className="crm-text-link" href="/crm/companies">
          <ArrowLeft size={12} />
          Company portfolio
        </Link>
        <Button onClick={() => setEditing(true)}>Edit company</Button>
      </div>
      <Card>
        <div className="crm-account-heading">
          <span className="crm-company-mark">
            {company.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div>
            <span className="crm-eyebrow">COMPANY PROFILE</span>
            <h2>{company.name}</h2>
            <p>
              {company.industry} / {company.region} / {company.size} employees
            </p>
          </div>
          <span className="crm-muted">{company.website}</span>
        </div>
        <div className="crm-inline-stats">
          <span>
            <b>{currency(deals.filter(isOpenDeal).reduce((sum, deal) => sum + deal.value, 0))}</b>
            <small>open pipeline</small>
          </span>
          <span>
            <b>
              {currency(
                deals
                  .filter((deal) => deal.stage === "Won")
                  .reduce((sum, deal) => sum + deal.value, 0),
              )}
            </b>
            <small>won value</small>
          </span>
          <span>
            <b>{contacts.length}</b>
            <small>key contacts</small>
          </span>
        </div>
      </Card>
      <div className="crm-account-grid">
        <Card
          title="BUYING COMMITTEE"
          action={
            <Link className="crm-text-link" href="/crm/contacts">
              Contact directory
            </Link>
          }
        >
          <div className="crm-account-contacts">
            {contacts.map((contact) => (
              <div key={contact.id}>
                <UserAvatar name={contact.name} size={34} className="crm-person-avatar" />
                <span>
                  <b>{contact.name}</b>
                  <small>{contact.title}</small>
                  <small>{contact.email}</small>
                </span>
              </div>
            ))}
            {!contacts.length && (
              <EmptyState>No contacts yet. Add one in the contact directory.</EmptyState>
            )}
          </div>
        </Card>
        <Card title="ACCOUNT OPPORTUNITIES">
          <div className="crm-account-deals">
            {deals.map((deal) => (
              <Link key={deal.id} href={`/crm/deals?deal=${deal.id}`}>
                <span>
                  <b>{deal.name}</b>
                  <small>{deal.owner}</small>
                </span>
                <Badge>{deal.stage}</Badge>
                <strong>{currency(deal.value)}</strong>
              </Link>
            ))}
            {!deals.length && <EmptyState>No opportunities linked to this company.</EmptyState>}
          </div>
        </Card>
      </div>
      <Card title="RELATIONSHIP ACTIVITY">
        <ActivityTimeline
          activities={data.activities.filter((activity) =>
            contacts.some((contact) => contact.id === activity.contactId),
          )}
          contacts={data.contacts}
        />
      </Card>
      {editing && (
        <RecordEditor entity="company" record={company} open onClose={() => setEditing(false)} />
      )}
    </CrmWorkspace>
  );
}
