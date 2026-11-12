"use client";
import { createLocalStore, uniqueIds } from "../common/store";
import { sampleAttachment, validAttachment } from "../common/attachment";
import { additionalMail } from "./sample-mail";
import type { EmailData } from "./types";
const seed: EmailData = {
  messages: [
    {
      id: "mail-1",
      from: "alex@example.com",
      sender: "Alex Morgan",
      to: "orzen@example.com",
      subject: "Planning notes for the release",
      body: "Hello team,\n\nPlease review the attached planning notes before Wednesday. Add any blockers and confirm your next actions.\n\nThanks,\nAlex",
      date: "2026-11-02T09:10:00Z",
      folder: "Inbox",
      previous: "Inbox",
      read: false,
      starred: true,
      attachments: [sampleAttachment],
    },
    {
      id: "mail-2",
      from: "priya@example.com",
      sender: "Priya Shah",
      to: "orzen@example.com",
      subject: "Design review invitation",
      body: "The next design review is scheduled for November 4. Please bring feedback on the mobile layouts.",
      date: "2026-11-01T14:00:00Z",
      folder: "Inbox",
      previous: "Inbox",
      read: false,
      starred: false,
      attachments: [],
    },
    {
      id: "mail-3",
      from: "orzen@example.com",
      sender: "Orzen Demo",
      to: "daniel@example.com",
      subject: "Re: Integration checklist",
      body: "I have reviewed the checklist and added the demo test results.",
      date: "2026-10-31T11:00:00Z",
      folder: "Sent",
      previous: "Sent",
      read: true,
      starred: false,
      attachments: [],
    },
    {
      id: "mail-4",
      from: "orzen@example.com",
      sender: "Orzen Demo",
      to: "",
      subject: "Weekly update",
      body: "Draft highlights for the upcoming team update.",
      date: "2026-11-02T08:00:00Z",
      folder: "Drafts",
      previous: "Drafts",
      read: true,
      starred: false,
      attachments: [],
    },
    {
      id: "mail-5",
      from: "sofia@example.com",
      sender: "Sofia Garcia",
      to: "orzen@example.com",
      subject: "Previous demo reminder",
      body: "This is a sample archived reminder in Trash. Restore it to return it to Inbox.",
      date: "2026-10-28T12:00:00Z",
      folder: "Trash",
      previous: "Inbox",
      read: true,
      starred: false,
      attachments: [],
    },
  ],
};
seed.messages.push(...additionalMail);
export const emailStore = createLocalStore(
  "nova-email-demo-v1",
  seed,
  (v: unknown): v is EmailData => {
    const d = v as EmailData;
    return (
      !!d &&
      Array.isArray(d.messages) &&
      uniqueIds(d.messages) &&
      d.messages.every(
        (m) =>
          [m.from, m.sender, m.to, m.subject, m.body, m.date].every((x) => typeof x === "string") &&
          Number.isFinite(Date.parse(m.date)) &&
          ["Inbox", "Sent", "Drafts", "Trash"].includes(m.folder) &&
          ["Inbox", "Sent", "Drafts"].includes(m.previous) &&
          typeof m.read === "boolean" &&
          typeof m.starred === "boolean" &&
          Array.isArray(m.attachments) &&
          m.attachments.every(validAttachment),
      )
    );
  },
);
