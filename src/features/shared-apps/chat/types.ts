import type { Attachment } from "../common/attachment";
export type Contact = {
  id: string;
  name: string;
  role: string;
  email: string;
  status: "Available" | "Away";
  unread: number;
};
export type TeamMessage = {
  id: string;
  contactId: string;
  own: boolean;
  text: string;
  time: string;
  status: "Read" | "Saved locally";
  attachment: Attachment | null;
};
export type ChatData = { contacts: Contact[]; messages: TeamMessage[] };
