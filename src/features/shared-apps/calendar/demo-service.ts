"use client";
import { createLocalStore, isDate, uniqueIds } from "../common/store";
import { categories, type CalendarData } from "./types";
const seed: CalendarData = {
  events: [
    {
      id: "event-1",
      title: "Product planning",
      start: "2026-11-02T09:30",
      end: "2026-11-02T10:30",
      category: "Meeting",
      location: "Studio room",
      notes: "Discuss priorities and owners for the next release.",
    },
    {
      id: "event-2",
      title: "Design review",
      start: "2026-11-04T14:00",
      end: "2026-11-04T15:00",
      category: "Meeting",
      location: "Design room",
      notes: "Review the compact workspace layouts.",
    },
    {
      id: "event-3",
      title: "Writing time",
      start: "2026-11-06T10:00",
      end: "2026-11-06T12:00",
      category: "Focus",
      location: "Desk",
      notes: "Prepare release documentation.",
    },
    {
      id: "event-4",
      title: "Release checklist",
      start: "2026-11-12T15:00",
      end: "2026-11-12T16:00",
      category: "Deadline",
      location: "",
      notes: "Confirm final review items.",
    },
  ],
};
export const calendarStore = createLocalStore(
  "nova-calendar-demo-v1",
  seed,
  (v: unknown): v is CalendarData => {
    const d = v as CalendarData;
    return (
      !!d &&
      Array.isArray(d.events) &&
      uniqueIds(d.events) &&
      d.events.every(
        (e) =>
          typeof e.title === "string" &&
          !!e.title.trim() &&
          categories.includes(e.category) &&
          typeof e.location === "string" &&
          typeof e.notes === "string" &&
          isDate(e.start?.slice(0, 10)) &&
          isDate(e.end?.slice(0, 10)) &&
          /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/.test(e.start) &&
          /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/.test(e.end) &&
          e.end > e.start,
      )
    );
  },
);
