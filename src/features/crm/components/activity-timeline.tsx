"use client";
import { Check, Mail, MessageSquare, Phone, SquareCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { crmService } from "../demo-service";
import { shortDate, type Activity, type Contact } from "../types";

const icons = { Call: Phone, Email: Mail, Note: MessageSquare, Task: SquareCheck };
export function ActivityTimeline({
  activities,
  contacts,
  onEdit,
}: {
  activities: Activity[];
  contacts: Contact[];
  onEdit?: (activity: Activity) => void;
}) {
  if (!activities.length) return <EmptyState>No activities match this view.</EmptyState>;
  return (
    <div className="crm-timeline">
      {[...activities]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((activity) => {
          const Icon = icons[activity.kind];
          return (
            <article key={activity.id}>
              <span className="crm-timeline-icon">
                <Icon size={14} />
              </span>
              <div>
                <div className="crm-timeline-heading">
                  <b>{activity.title}</b>
                  <Badge tone={activity.completed ? "success" : "neutral"}>
                    {activity.completed ? "Completed" : activity.kind}
                  </Badge>
                </div>
                <small>
                  {shortDate(activity.date)} /{" "}
                  {contacts.find((contact) => contact.id === activity.contactId)?.name ||
                    "Unknown contact"}
                </small>
                <p>{activity.notes || "No additional notes."}</p>
                <div className="crm-timeline-actions">
                  {onEdit && (
                    <Button size="sm" onClick={() => onEdit(activity)}>
                      Edit activity
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => crmService.toggle("activity", activity.id)}
                  >
                    <Check size={12} />
                    {activity.completed ? "Reopen" : "Mark complete"}
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
    </div>
  );
}
