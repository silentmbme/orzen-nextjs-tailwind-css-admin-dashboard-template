import type { Attachment } from "../common/attachment";
export type MailFolder = "Inbox" | "Sent" | "Drafts" | "Trash";
export type Mail = {
  id: string;
  from: string;
  sender: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  folder: MailFolder;
  previous: Exclude<MailFolder, "Trash">;
  read: boolean;
  starred: boolean;
  attachments: Attachment[];
};
export type EmailData = { messages: Mail[] };
