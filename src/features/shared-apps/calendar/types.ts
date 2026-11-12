export const categories = ["Meeting", "Focus", "Personal", "Deadline"] as const;
export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  category: (typeof categories)[number];
  location: string;
  notes: string;
};
export type CalendarData = { events: CalendarEvent[] };
