"use client";
import { useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { offsetDate, today } from "../../common/store";
import type { CalendarEvent } from "../types";
export const eventColors = {
  Meeting: "var(--accent)",
  Focus: "var(--color-trend-up)",
  Personal: "var(--color-trend-down)",
  Deadline: "var(--muted)",
};
type Props = {
  days: string[];
  view: string;
  date: string;
  events: CalendarEvent[];
  onDate: (date: string) => void;
  onCreate: (date: string, time?: string) => void;
  onOpen: (id: string) => void;
};
const timeLabel = (day: string) =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
export const eventsOn = (events: CalendarEvent[], day: string) =>
  events.filter((e) => e.start < `${offsetDate(day, 1)}T00:00` && e.end > `${day}T00:00`);
export function CalendarView({ days, view, date, events, onDate, onCreate, onOpen }: Props) {
  const scroll = useRef<HTMLDivElement>(null),
    first = days[0];
  useEffect(() => {
    if (view !== "Month" && scroll.current) scroll.current.scrollTop = 8 * 48;
  }, [view, first]);
  if (view === "Month")
    return (
      <div className="overflow-x-auto rounded-control border border-border">
        <div className="min-w-[650px]">
          <div className="grid grid-cols-7 bg-surface-alt text-center text-[10px] font-medium uppercase tracking-wide text-muted">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d} className="py-2.5">
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-border">
            {days.map((day) => {
              const items = eventsOn(events, day);
              return (
                <div
                  key={day}
                  className={`min-h-[116px] min-w-0 p-2 ${day.slice(0, 7) !== date.slice(0, 7) ? "bg-surface-alt" : "bg-surface"} ${day === date ? "ring-1 ring-inset ring-accent/40" : ""}`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <button
                      aria-label={`View day ${day}`}
                      onClick={() => onDate(day)}
                      className={`grid h-6 w-6 place-items-center rounded-full text-tiny ${day === today ? "bg-accent font-medium text-white" : "text-muted hover:bg-surface-alt"}`}
                    >
                      {Number(day.slice(8))}
                    </button>
                    <button
                      aria-label={`Add event on ${day}`}
                      onClick={() => onCreate(day)}
                      className="rounded p-1 text-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                  {items.slice(0, 2).map((e) => (
                    <button
                      key={e.id}
                      onClick={() => onOpen(e.id)}
                      className="mb-1 w-full rounded-control border-l-2 px-1.5 py-1.5 text-left"
                      style={{
                        borderColor: eventColors[e.category],
                        background: `color-mix(in srgb, ${eventColors[e.category]} 9%, var(--surface))`,
                      }}
                    >
                      <span className="block text-[9px] text-muted">
                        {e.start.slice(0, 10) === day ? e.start.slice(11) : "Continued"}
                      </span>
                      <span className="mt-0.5 block break-words text-[11px] font-medium">
                        {e.title}
                      </span>
                    </button>
                  ))}
                  {items.length > 2 && (
                    <button onClick={() => onDate(day)} className="mt-1 text-[10px] text-accent">
                      +{items.length - 2} more · view day
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  return (
    <div ref={scroll} className="max-h-[550px] overflow-auto rounded-control border border-border">
      <div style={{ minWidth: view === "Week" ? 720 : 260 }}>
        <div
          className="sticky top-0 z-20 grid border-b border-border bg-surface"
          style={{ gridTemplateColumns: `46px repeat(${days.length},minmax(0,1fr))` }}
        >
          <div className="self-end pb-2 text-center text-[9px] text-muted">Time</div>
          {days.map((day) => (
            <button
              key={day}
              onClick={() => onCreate(day)}
              className="border-l border-border py-2 text-center"
            >
              <span className="block text-[10px] text-muted">{timeLabel(day)}</span>
              <span
                className={`mx-auto mt-1 grid h-7 w-7 place-items-center rounded-full text-body ${day === today ? "bg-accent text-white" : ""}`}
              >
                {Number(day.slice(8))}
              </span>
            </button>
          ))}
        </div>
        <div
          className="grid"
          style={{ gridTemplateColumns: `46px repeat(${days.length},minmax(0,1fr))` }}
        >
          <div className="relative bg-surface-alt" style={{ height: 24 * 48 }}>
            {Array.from({ length: 24 }, (_, h) => (
              <span
                key={h}
                className="absolute right-2 text-[9px] text-muted"
                style={{ top: h * 48 + 4 }}
              >
                {String(h).padStart(2, "0")}:00
              </span>
            ))}
          </div>
          {days.map((day) => {
            const placed: { event: CalendarEvent; start: number; end: number; lane: number }[] = [],
              lanes: number[] = [];
            eventsOn(events, day).forEach((event) => {
              const start =
                  event.start.slice(0, 10) < day
                    ? 0
                    : Number(event.start.slice(11, 13)) * 60 + Number(event.start.slice(14, 16)),
                end =
                  event.end.slice(0, 10) > day
                    ? 1440
                    : Number(event.end.slice(11, 13)) * 60 + Number(event.end.slice(14, 16));
              let lane = lanes.findIndex((end) => end <= start);
              if (lane < 0) lane = lanes.length;
              lanes[lane] = end;
              placed.push({ event, start, end, lane });
            });
            return (
              <div
                key={day}
                className="relative border-l border-border bg-surface"
                style={{ height: 24 * 48 }}
              >
                {Array.from({ length: 24 }, (_, h) => (
                  <button
                    key={h}
                    aria-label={`Add event on ${day} at ${String(h).padStart(2, "0")}:00`}
                    onClick={() => onCreate(day, `${String(h).padStart(2, "0")}:00`)}
                    className="absolute left-0 w-full border-t border-border hover:bg-surface-alt"
                    style={{ top: h * 48, height: 48 }}
                  />
                ))}
                {placed.map(({ event, start, end, lane }) => (
                  <button
                    key={event.id}
                    onClick={() => onOpen(event.id)}
                    className="absolute z-10 overflow-hidden rounded-control border-l-2 px-2 py-1 text-left text-[10px]"
                    style={{
                      top: (start / 60) * 48 + 1,
                      height: Math.max(22, ((end - start) / 60) * 48 - 2),
                      left: `calc(${(lane / Math.max(1, lanes.length)) * 100}% + 2px)`,
                      width: `calc(${100 / Math.max(1, lanes.length)}% - 4px)`,
                      borderColor: eventColors[event.category],
                      background: `color-mix(in srgb, ${eventColors[event.category]} 16%, var(--surface))`,
                    }}
                  >
                    <span className="block font-medium">{event.title}</span>
                    <span className="mt-0.5 block text-[9px] text-muted">
                      {event.start.slice(11)} – {event.end.slice(11)}
                    </span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
