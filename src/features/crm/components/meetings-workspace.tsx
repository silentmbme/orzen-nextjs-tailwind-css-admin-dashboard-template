"use client";
import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { CrmWorkspace } from "./crm-workspace";
import { RecordEditor } from "./record-editor";
import { useCrm } from "../hooks/use-crm";
import { crmService } from "../demo-service";
import { demoToday, shortDate, type Meeting } from "../types";

export function MeetingsWorkspace() {
  const { data } = useCrm();
  const [week, setWeek] = useState(0);
  const [day, setDay] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All meetings");
  const [editor, setEditor] = useState<Meeting | "new" | null>(null);
  const dates = Array.from({ length: 7 }, (_, i) =>
    new Date(Date.parse(`${demoToday}T12:00:00Z`) + (week * 7 + i) * 86400000)
      .toISOString()
      .slice(0, 10),
  );
  const inWeek = data.meetings.filter((meeting) => dates.includes(meeting.date));
  const meetings = inWeek
    .filter(
      (meeting) =>
        (!day || meeting.date === day) &&
        (status === "All meetings" ||
          (status === "Upcoming" && !meeting.completed) ||
          (status === "Completed" && meeting.completed)) &&
        `${meeting.title} ${meeting.location} ${data.contacts.find((contact) => contact.id === meeting.contactId)?.name}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  return (
    <CrmWorkspace>
      <div className="crm-page-heading">
        <div>
          <h2>Meetings & agenda</h2>
          <p>A local demo calendar. Times are illustrative; no invitations are sent.</p>
        </div>
        <Button variant="dark" onClick={() => setEditor("new")}>
          <Plus size={13} />
          Schedule meeting
        </Button>
      </div>
      <Card
        title={
          <>
            <CalendarDays size={14} /> WEEKLY AGENDA
          </>
        }
        action={
          <div className="crm-week-actions">
            <Button
              size="icon"
              aria-label="Previous week"
              onClick={() => {
                setWeek(week - 1);
                setDay(null);
              }}
            >
              <ChevronLeft size={13} />
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setWeek(0);
                setDay(null);
              }}
            >
              Demo week
            </Button>
            <Button
              size="icon"
              aria-label="Next week"
              onClick={() => {
                setWeek(week + 1);
                setDay(null);
              }}
            >
              <ChevronRight size={13} />
            </Button>
          </div>
        }
      >
        <div className="crm-week-heading">
          <h3>
            {shortDate(dates[0])} – {shortDate(dates[6])}, {dates[0].slice(0, 4)}
          </h3>
          <Button size="sm" variant="ghost" onClick={() => setDay(null)}>
            Show whole week
          </Button>
        </div>
        <div className="crm-week-strip">
          {dates.map((date) => (
            <button
              key={date}
              aria-pressed={day === date}
              onClick={() => setDay(day === date ? null : date)}
              aria-label={`Meetings on ${date}`}
            >
              <small>
                {new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
                  weekday: "short",
                  timeZone: "UTC",
                })}
              </small>
              <b>{date.slice(-2)}</b>
              <span>{inWeek.filter((meeting) => meeting.date === date).length} meetings</span>
            </button>
          ))}
        </div>
      </Card>
      <div className="crm-meeting-tools">
        <Input
          aria-label="Search meetings"
          placeholder="Search meeting, contact or location..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select
          aria-label="Meeting status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option>All meetings</option>
          <option>Upcoming</option>
          <option>Completed</option>
        </Select>
        <span>{meetings.length} scheduled conversations</span>
      </div>
      <div className="crm-meeting-agenda">
        {meetings.length ? (
          meetings.map((meeting) => (
            <Card key={meeting.id}>
              <div className="crm-meeting-row">
                <div className="crm-meeting-time">
                  <b>{meeting.time}</b>
                  <small>{shortDate(meeting.date)}</small>
                  <small>{meeting.duration} min</small>
                </div>
                <div>
                  <Badge tone={meeting.completed ? "success" : "neutral"}>
                    {meeting.completed ? "Completed" : "Scheduled"}
                  </Badge>
                  <h3>{meeting.title}</h3>
                  <p>{data.contacts.find((contact) => contact.id === meeting.contactId)?.name}</p>
                  <small>
                    <MapPin size={11} />
                    {meeting.location}
                  </small>
                </div>
                <div className="crm-meeting-actions">
                  <Button size="sm" onClick={() => setEditor(meeting)}>
                    Edit meeting
                  </Button>
                  <Button size="sm" onClick={() => crmService.toggle("meeting", meeting.id)}>
                    {meeting.completed ? "Reopen meeting" : "Complete meeting"}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <EmptyState>
              No meetings match this week and filters. Select another day or schedule a demo
              meeting.
            </EmptyState>
          </Card>
        )}
      </div>
      {editor && (
        <RecordEditor
          key={editor === "new" ? "new" : editor.id}
          entity="meeting"
          record={editor === "new" ? undefined : editor}
          open
          onClose={() => setEditor(null)}
        />
      )}
    </CrmWorkspace>
  );
}
