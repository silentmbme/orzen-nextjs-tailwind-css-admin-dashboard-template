"use client";
import { createLocalStore, uniqueIds } from "../common/store";
import { sampleAttachment, validAttachment } from "../common/attachment";
import type { ChatData } from "./types";
const seed: ChatData = {
  contacts: [
    {
      id: "alex",
      name: "Alex Morgan",
      role: "Product lead",
      email: "alex@example.com",
      status: "Available",
      unread: 2,
    },
    {
      id: "priya",
      name: "Priya Shah",
      role: "Design lead",
      email: "priya@example.com",
      status: "Away",
      unread: 1,
    },
    {
      id: "daniel",
      name: "Daniel Kim",
      role: "Engineer",
      email: "daniel@example.com",
      status: "Available",
      unread: 0,
    },
    {
      id: "sofia",
      name: "Sofia Garcia",
      role: "Operations",
      email: "sofia@example.com",
      status: "Available",
      unread: 0,
    },
  ],
  messages: [
    {
      id: "team-1",
      contactId: "alex",
      own: false,
      text: "Morning! Can you review the planning notes?",
      time: "2026-11-02T09:00:00Z",
      status: "Read",
      attachment: sampleAttachment,
    },
    {
      id: "team-2",
      contactId: "alex",
      own: true,
      text: "Absolutely. I will share the next steps here.",
      time: "2026-11-02T09:02:00Z",
      status: "Read",
      attachment: null,
    },
    {
      id: "team-3",
      contactId: "alex",
      own: false,
      text: "Great, thank you! The release review is on Wednesday.",
      time: "2026-11-02T09:05:00Z",
      status: "Read",
      attachment: null,
    },
    {
      id: "team-4",
      contactId: "priya",
      own: false,
      text: "The design review is ready when you are.",
      time: "2026-11-02T10:00:00Z",
      status: "Read",
      attachment: null,
    },
  ],
};
export const chatStore = createLocalStore(
  "nova-team-chat-demo-v1",
  seed,
  (v: unknown): v is ChatData => {
    const d = v as ChatData;
    return (
      !!d &&
      Array.isArray(d.contacts) &&
      Array.isArray(d.messages) &&
      uniqueIds(d.contacts) &&
      uniqueIds(d.messages) &&
      d.contacts.every(
        (c) =>
          typeof c.name === "string" &&
          typeof c.role === "string" &&
          typeof c.email === "string" &&
          ["Available", "Away"].includes(c.status) &&
          Number.isInteger(c.unread) &&
          c.unread >= 0,
      ) &&
      d.messages.every(
        (m) =>
          d.contacts.some((c) => c.id === m.contactId) &&
          typeof m.own === "boolean" &&
          typeof m.text === "string" &&
          Number.isFinite(Date.parse(m.time)) &&
          ["Read", "Saved locally"].includes(m.status) &&
          (!m.attachment || validAttachment(m.attachment)),
      )
    );
  },
);
