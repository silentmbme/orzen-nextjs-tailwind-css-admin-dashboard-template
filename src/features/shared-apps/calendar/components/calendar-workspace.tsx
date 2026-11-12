"use client";
import { useState, type FormEvent } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { AppField, AppTitle, SharedWorkspace } from "../../common/workspace";
import { dateLabel, offsetDate, today, uid } from "../../common/store";
import { calendarStore } from "../demo-service";
import { CalendarView, eventColors, eventsOn } from "./calendar-view";
import { categories, type CalendarEvent } from "../types";
function EventForm({
  event,
  date,
  time = "09:00",
  onClose,
}: {
  event?: CalendarEvent;
  date: string;
  time?: string;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<CalendarEvent>(
      event || {
        id: "",
        title: "",
        start: `${date}T${time}`,
        end: new Date(Date.parse(`${date}T${time}:00Z`) + 3600000).toISOString().slice(0, 16),
        category: "Meeting",
        location: "",
        notes: "",
      },
    ),
    [error, setError] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    if (draft.end <= draft.start) {
      setError("End must be after the start.");
      return;
    }
    const error = calendarStore.update((d) => {
      const saved = { ...draft, id: draft.id || uid(), title: draft.title.trim() },
        i = d.events.findIndex((e) => e.id === saved.id);
      if (i < 0) d.events.push(saved);
      else d.events[i] = saved;
    });
    if (error) setError(error);
    else onClose();
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <AppField label="Event title *">
        <Input
          required
          maxLength={100}
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </AppField>
      <div className="grid gap-3 sm:grid-cols-2">
        <AppField label="Event starts *">
          <Input
            required
            type="datetime-local"
            value={draft.start}
            onChange={(e) => setDraft({ ...draft, start: e.target.value })}
          />
        </AppField>
        <AppField label="Event ends *">
          <Input
            required
            type="datetime-local"
            value={draft.end}
            onChange={(e) => setDraft({ ...draft, end: e.target.value })}
          />
        </AppField>
      </div>
      <AppField label="Event category">
        <Select
          value={draft.category}
          onChange={(e) =>
            setDraft({ ...draft, category: e.target.value as CalendarEvent["category"] })
          }
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </AppField>
      <AppField label="Location">
        <Input
          maxLength={100}
          value={draft.location}
          onChange={(e) => setDraft({ ...draft, location: e.target.value })}
        />
      </AppField>
      <AppField label="Event notes">
        <textarea
          className="min-h-20 rounded-control border border-border bg-surface p-2 outline-accent"
          maxLength={2000}
          value={draft.notes}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
        />
      </AppField>
      {error && (
        <p role="alert" className="text-label text-danger">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save demo event</Button>
      </div>
    </form>
  );
}
export function CalendarWorkspace() {
  const { data, warning, update } = calendarStore.useStore();
  const [date, setDate] = useState(today),
    [view, setView] = useState("Month"),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("all"),
    [edit, setEdit] = useState<string | null>(null),
    [selected, setSelected] = useState(""),
    [remove, setRemove] = useState(false),
    [error, setError] = useState(""),
    [time, setTime] = useState("09:00"),
    [agenda, setAgenda] = useState("day");
  const first = `${date.slice(0, 7)}-01`,
    weekday = (new Date(`${first}T12:00:00Z`).getUTCDay() + 6) % 7;
  const start =
    view === "Month"
      ? offsetDate(first, -weekday)
      : view === "Week"
        ? offsetDate(date, -((new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7))
        : date;
  const days = Array.from({ length: view === "Month" ? 42 : view === "Week" ? 7 : 1 }, (_, i) =>
    offsetDate(start, i),
  );
  const events = data.events
    .filter(
      (e) =>
        `${e.title} ${e.location} ${e.notes}`.toLowerCase().includes(query.toLowerCase()) &&
        (category === "all" || e.category === category),
    )
    .sort((a, b) => a.start.localeCompare(b.start));
  const event = data.events.find((e) => e.id === selected),
    agendaEvents =
      agenda === "day"
        ? eventsOn(events, date)
        : events.filter((e) => e.end >= `${today}T00:00`).slice(0, 8);
  function create(day = date, at = "09:00") {
    setDate(day);
    setTime(at);
    setEdit("new");
    setError("");
  }
  function open(id: string) {
    setSelected(id);
    setRemove(false);
    setError("");
  }
  function navigate(step: number) {
    if (view === "Month") {
      const d = new Date(`${first}T12:00:00Z`);
      d.setUTCMonth(d.getUTCMonth() + step);
      setDate(d.toISOString().slice(0, 10));
    } else setDate(offsetDate(date, step * (view === "Week" ? 7 : 1)));
  }
  return (
    <SharedWorkspace
      title="Calendar"
      description="Plan meetings, protect focus time and keep your team schedule in view."
      warning={warning}
      actions={
        <Button onClick={() => create()}>
          <Plus size={13} />
          Create event
        </Button>
      }
    >
      <div className="grid items-start gap-widget xl:grid-cols-[minmax(0,1fr)_280px]">
        <Card
          title={<AppTitle icon={CalendarDays}>Schedule</AppTitle>}
          action={
            <div className="flex gap-1 rounded-control border border-border bg-surface-alt p-0.5">
              {["Month", "Week", "Day"].map((v) => (
                <Button
                  key={v}
                  size="sm"
                  aria-pressed={v === view}
                  variant={v === view ? "secondary" : "ghost"}
                  onClick={() => setView(v)}
                >
                  {v}
                </Button>
              ))}
            </div>
          }
        >
          <div className="my-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-[20px] font-semibold leading-tight">
                {new Date(`${first}T12:00:00Z`).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </h2>
              <p className="mt-1 text-[10px] text-muted">
                {view === "Month"
                  ? "Month at a glance"
                  : view === "Week"
                    ? `${dateLabel(start)} – ${dateLabel(days[6])}`
                    : dateLabel(date)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="outline" onClick={() => setDate(today)}>
                Today
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Previous calendar period"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft size={15} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Next calendar period"
                onClick={() => navigate(1)}
              >
                <ChevronRight size={15} />
              </Button>
            </div>
          </div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Input
              aria-label="Search calendar events"
              placeholder="Search events, notes or locations…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1"
            />
            <Input
              aria-label="Calendar selected date"
              type="date"
              value={date}
              onChange={(e) => {
                if (e.target.value) setDate(e.target.value);
              }}
            />
            <Select
              aria-label="Calendar category filter"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </div>
          <CalendarView
            days={days}
            view={view}
            date={date}
            events={events}
            onDate={(day) => {
              setDate(day);
              setView("Day");
            }}
            onCreate={create}
            onOpen={open}
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(category === c ? "all" : c)}
                aria-pressed={category === c}
                className="inline-flex items-center gap-1.5 text-[10px] text-muted"
              >
                <i className="h-1.5 w-1.5 rounded-full" style={{ background: eventColors[c] }} />
                {c}
              </button>
            ))}
          </div>
          {!events.length && <p className="mt-3 text-label text-muted">No matching events.</p>}
        </Card>
        <div className="space-y-widget">
          <Card
            title={<AppTitle icon={Clock3}>Your agenda</AppTitle>}
            action={<span className="text-[10px] text-muted">{agendaEvents.length} events</span>}
          >
            <div className="mt-3 flex items-center gap-3 rounded-control border border-border bg-surface-alt p-3">
              <div className="text-center">
                <span className="block text-[10px] uppercase text-accent">
                  {new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
                    month: "short",
                    timeZone: "UTC",
                  })}
                </span>
                <strong className="mt-1 block text-[24px] font-semibold leading-none">
                  {Number(date.slice(8))}
                </strong>
              </div>
              <div className="border-l border-border pl-3">
                <p className="text-label font-medium">
                  {new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
                    weekday: "long",
                    timeZone: "UTC",
                  })}
                </p>
                <p className="mt-1 text-[10px] text-muted">
                  {date === today ? "Demo today" : "Selected day"}
                </p>
              </div>
            </div>
            <div className="my-3 flex gap-1">
              <Button
                size="sm"
                variant={agenda === "day" ? "secondary" : "ghost"}
                aria-pressed={agenda === "day"}
                onClick={() => setAgenda("day")}
              >
                Selected day
              </Button>
              <Button
                size="sm"
                variant={agenda === "upcoming" ? "secondary" : "ghost"}
                aria-pressed={agenda === "upcoming"}
                onClick={() => setAgenda("upcoming")}
              >
                Upcoming
              </Button>
            </div>
            <div className="max-h-[450px] space-y-2 overflow-y-auto">
              {agendaEvents.map((e) => (
                <button
                  key={e.id}
                  onClick={() => open(e.id)}
                  className="w-full rounded-control border border-border p-3 text-left hover:border-accent"
                >
                  <span className="flex items-center gap-1.5 text-[10px] text-muted">
                    <i
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: eventColors[e.category] }}
                    />
                    {e.category}
                    <span className="ml-auto">
                      {agenda === "upcoming" ? e.start.slice(5, 10) : e.start.slice(11)}
                    </span>
                  </span>
                  <p className="mt-2 text-label font-medium">{e.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-muted">
                    <Clock3 size={10} />
                    {e.start.slice(11)} – {e.end.slice(11)}
                  </p>
                  {e.location && (
                    <p className="mt-2 flex items-center gap-1 text-[10px] text-muted">
                      <MapPin size={10} />
                      {e.location}
                    </p>
                  )}
                </button>
              ))}
              {!agendaEvents.length && (
                <div className="rounded-control border border-dashed border-border p-4 text-center">
                  <CalendarDays size={24} className="mx-auto text-muted" />
                  <p className="mt-2 text-label text-muted">No events in this agenda.</p>
                  <Button size="sm" variant="ghost" className="mt-2" onClick={() => create()}>
                    Schedule something
                  </Button>
                </div>
              )}
            </div>
          </Card>
          <Card title={<AppTitle icon={CalendarDays}>Event categories</AppTitle>}>
            <div className="mt-3 space-y-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(category === c ? "all" : c)}
                  aria-pressed={category === c}
                  className={`flex w-full items-center gap-2 rounded-control p-2 text-left text-label ${category === c ? "bg-surface-alt" : "hover:bg-surface-alt"}`}
                >
                  <i className="h-2 w-2 rounded-sm" style={{ background: eventColors[c] }} />
                  <span className="flex-1">{c}</span>
                  <span className="text-[10px] text-muted">
                    {
                      data.events.filter(
                        (e) => e.category === c && e.start.slice(0, 7) === date.slice(0, 7),
                      ).length
                    }
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-3 border-t border-border pt-3 text-[10px] text-muted">
              Counts show events starting in the displayed month. Local demo time; dates are not
              timezone-converted.
            </p>
          </Card>
        </div>
      </div>
      <Dialog
        open={edit !== null}
        title={edit === "new" ? "Create event" : "Edit event"}
        onClose={() => setEdit(null)}
      >
        {edit !== null && (
          <EventForm
            key={edit + date + time}
            date={date}
            time={time}
            event={data.events.find((e) => e.id === edit)}
            onClose={() => setEdit(null)}
          />
        )}
      </Dialog>
      <Dialog
        open={!!event}
        title={remove ? "Delete event?" : "Event details"}
        onClose={() => setSelected("")}
      >
        {event && (
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-control bg-surface-alt px-2 py-1 text-tiny">
              <i
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: eventColors[event.category] }}
              />
              {event.category}
            </span>
            <h2 className="text-[20px] font-semibold leading-snug">{event.title}</h2>
            <div className="rounded-control border border-border bg-surface-alt p-3">
              <p className="flex items-center gap-2 text-label">
                <CalendarDays size={14} className="text-accent" />
                {dateLabel(event.start)}
              </p>
              <p className="mt-2 flex items-center gap-2 text-label">
                <Clock3 size={14} className="text-muted" />
                {event.start.slice(11)} →{" "}
                {event.end.slice(0, 10) !== event.start.slice(0, 10)
                  ? dateLabel(event.end) + " "
                  : ""}
                {event.end.slice(11)}
              </p>
              {event.location && (
                <p className="mt-2 flex items-center gap-2 text-label">
                  <MapPin size={14} className="text-muted" />
                  {event.location}
                </p>
              )}
            </div>
            <p className="whitespace-pre-wrap text-label leading-relaxed text-muted">
              {event.notes || "No event notes added."}
            </p>
            {error && (
              <p role="alert" className="text-label text-danger">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2 border-t border-border pt-3">
              {remove ? (
                <>
                  <Button variant="outline" onClick={() => setRemove(false)}>
                    Keep event
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const err = update((d) => {
                        d.events = d.events.filter((e) => e.id !== selected);
                      });
                      setError(err);
                      if (!err) setSelected("");
                    }}
                  >
                    Confirm delete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEdit(event.id);
                      setSelected("");
                    }}
                  >
                    Edit event
                  </Button>
                  <Button variant="destructive" onClick={() => setRemove(true)}>
                    Delete event
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </SharedWorkspace>
  );
}
