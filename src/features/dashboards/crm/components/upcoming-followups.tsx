import Link from "next/link";
import { CalendarClock, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { crmService } from "@/features/crm/demo-service";
import { demoToday, shortDate, type CrmData } from "@/features/crm/types";

export function UpcomingFollowups({ data }: { data: CrmData }) {
  const items = [
    ...data.activities
      .filter((item) => !item.completed)
      .map((item) => ({ ...item, entity: "activity" as const, detail: item.kind })),
    ...data.meetings
      .filter((item) => !item.completed)
      .map((item) => ({
        ...item,
        entity: "meeting" as const,
        detail: `${item.time} / ${item.duration} min`,
      })),
  ]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);
  return (
    <Card
      title={
        <>
          <CalendarClock size={14} /> NEXT CONVERSATIONS
        </>
      }
      action={
        <Link href="/crm/meetings" className="crm-text-link">
          Schedule
        </Link>
      }
    >
      <div className="crm-followups">
        {items.length ? (
          items.map((item) => (
            <div key={item.id}>
              <div className="crm-date-tile">
                <b>{item.date.slice(-2)}</b>
                <small>{shortDate(item.date).split(" ")[0]}</small>
              </div>
              <div>
                <b>{item.title}</b>
                <small>
                  {data.contacts.find((contact) => contact.id === item.contactId)?.name} /{" "}
                  {item.detail}
                </small>
                {item.date < demoToday && <Badge tone="danger">Overdue</Badge>}
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Complete ${item.title}`}
                onClick={() => crmService.toggle(item.entity, item.id)}
              >
                <Check size={14} />
              </Button>
            </div>
          ))
        ) : (
          <EmptyState>You are all caught up. Schedule a new conversation.</EmptyState>
        )}
      </div>
      <Link className="crm-bottom-link" href="/crm/activities">
        View activity workspace
      </Link>
    </Card>
  );
}
