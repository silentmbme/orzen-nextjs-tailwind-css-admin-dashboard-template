# HR management

The HR module uses the existing admin shell, navigation, themes, local Inter font and Tailwind design tokens. No global style or theme changes are required.

## Routes

| Route | Features |
| --- | --- |
| `/dashboards/hr` | Workforce reconciliation, weekly attendance chart and working rate, department donut and employment mix, headcount trajectory, interactive seven-workday availability planner, payroll readiness, new-joiner spotlight, leave approvals, recruitment summary, upcoming milestones, activity and actionable tasks |
| `/apps/hr/employees` | Searchable, sortable, paginated directory; grid view; department/status filters; profiles; validated create/edit and protected deletion |
| `/apps/hr/attendance` | Calendar, date/department/employee filters, timesheet, clock adjustments with reason, hours/overtime and history |
| `/apps/hr/leave` | Filtered approval queue, team calendar, balances, weekday counts, requests, decisions and history |
| `/apps/hr/recruitment` | Position editing, candidate creation, five-stage applicant board, drag-and-drop and select controls, profiles and conflict-checked interview scheduling |
| `/apps/hr/payroll` | Period/department totals, searchable payroll register, salary breakdowns, reviewed/paid confirmations, history, CSV export and printable payslips |

## Source and reuse

Dashboard components live in `src/features/dashboards/hr/`. Domain types, fixtures, selectors, validation, persistence, hooks and operational components live in `src/features/hr/`. The six route files are thin entry points. HR links are configured in `src/config/navigation.ts`.

Shared components include Card, ChartCard, Button, Input, Select, Dialog, DataTable, TablePagination, EmptyState, ChartTooltip and UserAvatar. Portraits reuse the existing local sales-team images. HR-specific heading, status, field and workspace helpers keep presentation consistent within the module.

## Demo rules

- The fixed snapshot is November 2, 2026. People, compensation, contact details and actions are fictional. No invitations, payments or server requests are sent.
- Local changes use `nova-hr-demo-v1`. Remove that localStorage key and reload to reset. Malformed storage falls back to original fixtures with a visible warning; failed writes retain changes in memory with a warning.
- Foreign keys and record shape are validated before accepting saved state. Employees referenced by attendance, leave, payroll, interviews or reporting relationships cannot be deleted. Manager cycles are rejected.
- Headcount reconciles opening employees + hires - departures. Departure is the first day no longer employed.
- Leave uses 2026 weekday quotas: Annual 20, Sick 10, Personal 5. No holiday calendar or accrual rules are modeled. Pending requests reserve no balance; approval checks balance again and immediately overlays attendance. Approved leave cannot be overwritten with a working shift.
- Timesheets support same-day shifts. Hours subtract breaks; overtime is hours above eight, solely a demo rule.
- Applicants move one adjacent stage at a time. Hired is final; filling capacity closes a position. Hiring does not automatically create an employee. Interviews reject simultaneous interviewer/candidate conflicts.
- Gross pay = captured base + allowances. Net pay = gross - deductions. Payroll advances Draft → Reviewed → Paid through confirmations. Employee salary edits preserve historical snapshots; new employees do not automatically generate payroll. There is no proration, statutory calculation or banking integration.
- CSV exports escape formula-like text. Payslips use escaped printable HTML in a separate window; blocked popups show an actionable error.

## Verification

Run `npm run typecheck`, `npm run lint` and `npm run build`. Start production on port 3163 and run `npm run test:hr`, or set `VISUAL_BASE_URL` to another running instance.

Domain checks cover references, workforce reconciliation, leave/attendance linkage, overlap and balance guards, manager cycles, deletion safety, hiring/interview guards and payroll arithmetic/transitions. Chrome checks cover employee CRUD, persistence, attendance corrections, leave approval, real candidate drag-and-drop, accessible stage controls, payroll confirmations, export and print. All six routes are checked at 320, 390, 768 and 1440 pixels in light and dark themes, with centered-dialog checks and screenshots under `artifacts/hr/`.
