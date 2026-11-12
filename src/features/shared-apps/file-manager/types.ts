import type { Attachment } from "../common/attachment";
export type Folder = { id: string; parentId: string | null; name: string };
export type LocalFile = {
  id: string;
  folderId: string;
  name: string;
  type: string;
  size: number;
  modified: string;
  favorite: boolean;
  attachment: Attachment | null;
};
export type FileData = { folders: Folder[]; files: LocalFile[] };
