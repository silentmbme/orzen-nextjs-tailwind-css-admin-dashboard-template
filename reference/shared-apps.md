# Shared applications

Exactly five routes extend the existing admin layout. Completed dashboards, global tokens, shared controls and themes are preserved. No dependency, CSS framework, backend, external messaging service or cloud storage connection was added.

| Route | Page composition |
| --- | --- |
| `/apps/calendar` | Calendar-focused month/week/day panel, date/category/search controls, upcoming event rail and event dialogs |
| `/apps/chat` | Team conversation sidebar, incoming/outgoing message bubbles, optional contact panel and compact composer |
| `/apps/email` | Mailbox rail, searchable/filterable message list, reading pane and compose dialog |
| `/apps/file-manager` | Folder navigation, breadcrumbs, storage summary, grid/list files and details/preview dialogs |
| `/apps/tasks` | Productivity filters and completion summary, table or responsive task board, details and checklist dialogs |

## Source ownership

Route entrypoints live under `src/app/(admin)/apps/`. Each application has its own types, fixtures/store and components under `src/features/shared-apps/{calendar,chat,email,file-manager,tasks}/`. Common code under `shared-apps/common/` provides a validated local store, workspace/field/title helpers and safe attachment reading/preview. Navigation changes are limited to the Shared Applications group and removing the now-implemented Email/Calendar entries from Planned.

Reused AppShell, Header, Sidebar, Footer, PageHeader, Card, Button, Input, Select, Badge, Dialog, DataTable and UserAvatar. Existing local user portraits are reused. The calendar, task board and folder navigation are implemented with normal accessible React/HTML controls; no graph, calendar or drag library is installed.

## Working demo behavior

- Calendar supports month/week/day, period navigation, Today, date selection, categories, search, create/edit/details and confirmed deletion. End must follow start. Date/time strings are displayed as entered, without timezone conversion. Calendar time is not synchronized with external providers; Today uses November 2, 2026.
- Team Chat supports contact search/switching, unread state, local sends, emoji, attachment selection/preview, copy and confirmed deletion of outgoing messages. Presence/read states are seeded examples; new messages say Saved locally. No recipient receives them. Selecting an existing conversation clears its local unread count.
- Email supports Inbox/Sent/Drafts/Starred/Trash, search, sort, unread/attachment filters, read/star toggles, safe text reading, attachments, compose/draft editing and Trash restoration. Demo send validates one email recipient, subject and body, then writes Sent locally. Trash is reversible; no permanent-mail deletion action is provided.
- File Manager supports folder/breadcrumb navigation, creation/rename, protected nonempty-folder deletion, file grid/list, search/type/sort, details, favorites, recents and browser-selected uploads. Folder cycles, invalid dates and orphaned file references are rejected. Root is protected. Metadata-only samples have no preview/download button. Downloadable examples and uploaded files contain actual available local data.
- Tasks support create/edit/details/confirmed delete, assignee/priority/status/due dates, labels, search/filter/sort, list/board, native drag-and-drop with select fallback and subtasks. Marking Done completes all subtasks; reopening a subtask moves Done back to In progress. Overdue uses the fixed demo date.

## Attachments and persistence

Accepted uploads: PNG, JPG, WebP, plain text, CSV, JSON and PDF, up to 2 MB each. Compose allows three attachments. Images render as images; text renders as escaped text, capped at 50,000 characters in preview. PDFs download to a compatible application rather than being embedded. HTML/SVG uploads are rejected. FileReader data URLs avoid object URL lifecycle leaks. No upload is sent to a server.

LocalStorage keys:

- `nova-calendar-demo-v1`
- `nova-team-chat-demo-v1`
- `nova-email-demo-v1`
- `nova-files-demo-v1`
- `nova-tasks-demo-v1`

Remove a key and reload to reset that app. Invalid storage falls back to original fixtures with a visible warning. Failed writes retain in-memory changes with a persistence warning. Storage capacity depends on the browser; this is not a database, multi-user synchronization service or an authentication system.

## Validation

Run `npm run typecheck`, `npm run lint` and `npm run build`. Start the production server on 3175, then run `npm run test:shared-apps`, or set `VISUAL_BASE_URL` to another instance. Screenshots are written under `artifacts/shared-apps/`.

Domain checks cover safe attachment types, calendar bounds, atomic rejection, contact references, mail restore, folder cycles/orphans, task/checklist consistency and quota fallback. Browser checks cover all five workflows, actual file download contents, unsafe-upload rejection, protected deletion, native task drag/drop, navigation, 40 route/theme/viewport combinations, centered dialogs and malformed storage recovery.
