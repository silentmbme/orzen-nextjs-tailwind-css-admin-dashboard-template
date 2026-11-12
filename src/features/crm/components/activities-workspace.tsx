"use client";
import { useState } from "react";
import { Activity as ActivityIcon, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CrmWorkspace } from "./crm-workspace";
import { RecordEditor } from "./record-editor";
import { ActivityTimeline } from "./activity-timeline";
import { useCrm } from "../hooks/use-crm";
import { demoToday, type Activity } from "../types";

export function ActivitiesWorkspace() {
  const { data } = useCrm();
  const [kind, setKind] = useState("All types");
  const [status, setStatus] = useState("All activity");
  const [query, setQuery] = useState("");
  const [contact, setContact] = useState("all");
  const [page, setPage] = useState(0);
  const [editor, setEditor] = useState<Activity | "new" | null>(null);
  const statusMatch = (item: Activity) =>
    status === "All activity" ||
    (status === "Open" && !item.completed) ||
    (status === "Completed" && item.completed) ||
    (status === "Overdue" && !item.completed && item.date < demoToday);
  const activities = data.activities
    .filter(
      (item) =>
        statusMatch(item) &&
        (kind === "All types" || item.kind === kind) &&
        (contact === "all" || item.contactId === contact) &&
        `${item.title} ${item.notes} ${data.contacts.find((person) => person.id === item.contactId)?.name}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  const current = Math.min(page, Math.max(0, Math.ceil(activities.length / 5) - 1));
  return (
    <CrmWorkspace>
      <div className="crm-page-heading">
        <div>
          <h2>Activity workspace</h2>
          <p>Calls, emails, notes and follow-ups in one chronological record.</p>
        </div>
        <Button variant="dark" onClick={() => setEditor("new")}>
          <Plus size={13} />
          Log activity
        </Button>
      </div>
      <div className="crm-activity-layout">
        <aside>
          <Card title="YOUR WORK QUEUE">
            <div className="crm-activity-views">
              {["All activity", "Open", "Overdue", "Completed"].map((value) => (
                <button
                  key={value}
                  aria-pressed={status === value}
                  onClick={() => {
                    setStatus(value);
                    setPage(0);
                  }}
                >
                  <span>{value}</span>
                  <Badge>
                    {
                      data.activities.filter(
                        (item) =>
                          value === "All activity" ||
                          (value === "Open" && !item.completed) ||
                          (value === "Completed" && item.completed) ||
                          (value === "Overdue" && !item.completed && item.date < demoToday),
                      ).length
                    }
                  </Badge>
                </button>
              ))}
            </div>
            <p className="crm-footnote">Overdue dates use the fixed demo date: November 1, 2026.</p>
          </Card>
        </aside>
        <Card
          title={
            <>
              <ActivityIcon size={14} /> RELATIONSHIP TIMELINE
            </>
          }
          action={<Badge>{activities.length} activities</Badge>}
        >
          <div className="crm-activity-filters">
            <Input
              aria-label="Search activities"
              placeholder="Search activity or contact..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(0);
              }}
            />
            <Select
              aria-label="Activity type"
              value={kind}
              onChange={(event) => {
                setKind(event.target.value);
                setPage(0);
              }}
            >
              <option>All types</option>
              {["Call", "Email", "Note", "Task"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </Select>
            <Select
              aria-label="Activity contact"
              value={contact}
              onChange={(event) => {
                setContact(event.target.value);
                setPage(0);
              }}
            >
              <option value="all">All contacts</option>
              {data.contacts.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </Select>
          </div>
          <ActivityTimeline
            activities={activities.slice(current * 5, current * 5 + 5)}
            contacts={data.contacts}
            onEdit={setEditor}
          />
          <div className="crm-directory-pagination">
            <Button size="sm" disabled={!current} onClick={() => setPage(current - 1)}>
              Previous activities
            </Button>
            <span>
              {activities.length ? current + 1 : 0} / {Math.ceil(activities.length / 5)}
            </span>
            <Button
              size="sm"
              disabled={(current + 1) * 5 >= activities.length}
              onClick={() => setPage(current + 1)}
            >
              Next activities
            </Button>
          </div>
        </Card>
      </div>
      {editor && (
        <RecordEditor
          key={editor === "new" ? "new" : editor.id}
          entity="activity"
          record={editor === "new" ? undefined : editor}
          open
          onClose={() => setEditor(null)}
        />
      )}
    </CrmWorkspace>
  );
}
