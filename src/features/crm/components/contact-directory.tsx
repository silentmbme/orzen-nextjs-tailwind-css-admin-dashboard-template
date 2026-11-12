"use client";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { CrmWorkspace } from "./crm-workspace";
import { RecordEditor } from "./record-editor";
import { ActivityTimeline } from "./activity-timeline";
import { useCrm } from "../hooks/use-crm";
import type { Contact } from "../types";

export function ContactDirectory() {
  const { data } = useCrm();
  const [query, setQuery] = useState("");
  const [companyId, setCompanyId] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [editor, setEditor] = useState<Contact | "new" | null>(null);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("asc");
  const contacts = data.contacts
    .filter(
      (contact) =>
        (companyId === "all" || contact.companyId === companyId) &&
        `${contact.name} ${contact.email} ${contact.title}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name) * (sort === "asc" ? 1 : -1));
  const current = Math.min(page, Math.max(0, Math.ceil(contacts.length / 6) - 1));
  const visible = contacts.slice(current * 6, current * 6 + 6);
  const contact = visible.find((item) => item.id === selected) || visible[0];
  return (
    <CrmWorkspace>
      <div className="crm-page-heading">
        <div>
          <h2>Contact directory</h2>
          <p>A connected address book with conversation context.</p>
        </div>
        <Button variant="dark" onClick={() => setEditor("new")}>
          <Plus size={13} />
          Add contact
        </Button>
      </div>
      <div className="crm-contact-layout">
        <Card
          title={
            <>
              <Users size={14} /> DIRECTORY
            </>
          }
        >
          <div className="crm-contact-filters">
            <Input
              aria-label="Search contacts"
              placeholder="Search name, email or role..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(0);
              }}
            />
            <Select
              aria-label="Contact company"
              value={companyId}
              onChange={(event) => {
                setCompanyId(event.target.value);
                setPage(0);
              }}
            >
              <option value="all">All companies</option>
              {data.companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
            <Select
              aria-label="Contact sort"
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setPage(0);
              }}
            >
              <option value="asc">Name A–Z</option>
              <option value="desc">Name Z–A</option>
            </Select>
          </div>
          <div className="crm-contact-list">
            {visible.length ? (
              visible.map((item) => (
                <button
                  key={item.id}
                  aria-pressed={contact?.id === item.id}
                  onClick={() => setSelected(item.id)}
                >
                  <UserAvatar name={item.name} size={34} className="crm-person-avatar" />
                  <span>
                    <b>{item.name}</b>
                    <small>{item.title}</small>
                    <small>
                      {data.companies.find((company) => company.id === item.companyId)?.name}
                    </small>
                  </span>
                </button>
              ))
            ) : (
              <EmptyState>No contacts match your search.</EmptyState>
            )}
          </div>
          <div className="crm-directory-pagination">
            <Button size="sm" disabled={!current} onClick={() => setPage(current - 1)}>
              Previous contacts
            </Button>
            <span>
              {contacts.length ? current + 1 : 0} / {Math.ceil(contacts.length / 6)}
            </span>
            <Button
              size="sm"
              disabled={(current + 1) * 6 >= contacts.length}
              onClick={() => setPage(current + 1)}
            >
              Next contacts
            </Button>
          </div>
        </Card>
        <div className="crm-detail-stack">
          {contact ? (
            <>
              <Card
                title="RELATIONSHIP PROFILE"
                action={
                  <Button size="sm" onClick={() => setEditor(contact)}>
                    <Pencil size={12} />
                    Edit contact
                  </Button>
                }
              >
                <div className="crm-contact-hero">
                  <UserAvatar name={contact.name} size={34} className="crm-person-avatar" />
                  <h2>{contact.name}</h2>
                  <p>{contact.title}</p>
                </div>
                <dl className="crm-description-list">
                  <dt>Email</dt>
                  <dd>{contact.email}</dd>
                  <dt>Phone</dt>
                  <dd>{contact.phone}</dd>
                  <dt>Company</dt>
                  <dd>
                    <Link className="crm-text-link" href={`/crm/companies/${contact.companyId}`}>
                      {data.companies.find((company) => company.id === contact.companyId)?.name}
                    </Link>
                  </dd>
                  <dt>Relationship owner</dt>
                  <dd>{contact.owner}</dd>
                </dl>
              </Card>
              <Card title="RECENT TOUCHPOINTS">
                <ActivityTimeline
                  activities={data.activities.filter(
                    (activity) => activity.contactId === contact.id,
                  )}
                  contacts={data.contacts}
                />
              </Card>
            </>
          ) : (
            <Card>
              <EmptyState>Select or create a contact to see their relationship profile.</EmptyState>
            </Card>
          )}
        </div>
      </div>
      {editor && (
        <RecordEditor
          key={editor === "new" ? "new" : editor.id}
          entity="contact"
          record={editor === "new" ? undefined : editor}
          open
          onClose={() => setEditor(null)}
        />
      )}
    </CrmWorkspace>
  );
}
