# Orzen Compact Starter

A clean, **original** sales dashboard foundation inspired by the *visual characteristics* (compact scale, light borders, restrained charts) of the supplied reference, without copying its branding or exact composition.

## Status
- Public marketing pages are implemented at `/landing/saas`, `/landing/ai`, `/landing/crm`, and `/landing/ecommerce`, with a separate shared marketing layout. See [the marketing guide](reference/marketing.md).
- Implemented: Sales Overview with 12 widgets, weekly/monthly/yearly revenue and targets, calculated channel distribution, interactive heatmap, product chart, searchable/sortable/paginated orders and detail dialogs, top products, regions and sales team targets. Dashboard actions export demo CSV and reset filters.
- CRM is implemented: command center, leads, lead details, contacts, companies, company profiles, deals/Kanban, activities and meetings.
- eCommerce is implemented: operations dashboard, products, product details/editor, categories, orders/tracking, inventory, customer profiles, coupons, review moderation and refunds. See [the module guide](reference/ecommerce.md).
- SaaS is implemented: subscription analytics dashboard and five inner pages for subscriptions, pricing plans, customers, billing/invoices and usage analytics. See [the SaaS module guide](reference/saas.md).
- HR is implemented: people operations dashboard, employee directory/profiles, attendance calendar/timesheets, leave requests, recruitment and payroll. See [the HR module guide](reference/hr.md).
- AI is implemented: operations dashboard, deterministic chat, fictional model directory, prompt templates, workflow simulations and request usage monitoring. See [the AI module guide](reference/ai.md).
- Shared applications are implemented: Calendar, team Chat, Email, File Manager and Task Management. See [the shared apps guide](reference/shared-apps.md).
- Other business apps remain planned. Disabled menu items are marked Soon.
- No backend, authentication or live database. All data is simulated.

## Requirements
Node.js compatible with Next.js 16, npm, internet access for installing packages.

## Run
```bash
npm install
npm run dev
```
Then visit http://localhost:3000 and open `/dashboards/sales`.

## Quality commands
```bash
npm run typecheck
npm run lint
npm run build
```

**Verification:** Dependencies are installed and `package-lock.json` is included. Lint, TypeScript and the production build pass. Chrome checks cover 320, 390, 768, 1024, 1280 and 1440px in both themes, plus period filters, page search, mobile navigation and theme persistence.

## Architecture
- `src/app`: route layouts / entrypoints
- `src/components`: shell and shared UI
- `src/features`: domain dashboards and data
- `src/config`: navigation schema
- `src/providers`: theme switching
- `src/app/globals.css`: Tailwind v4 import; centralized design tokens live in `src/styles/tailwind/tokens.css`

## Typography
Inter Latin weights 400, 500 and 600 are bundled locally through @fontsource/inter and loaded by Sales, CRM and eCommerce. No runtime font service or build-time font download is required. Existing global typography rules and theme tokens are preserved.

## Next
Read `codex-prompts/README.md`; attach your reference screenshot to the first prompt. Do not ask Codex to implement every application at once.


## Tailwind shared components

Shared tokens, shell and UI primitives now use Tailwind CSS v4 with CSS-first configuration in src/styles/tailwind/. Existing semantic classes preserve dashboard overrides and current appearance. Sales/CRM feature styles now use Tailwind-backed CSS. The SCSS entrypoint and partials have been replaced by src/styles/base.css. Theme variables, gradients, keyframes, and complex selectors remain CSS.

Reusable components include Card/CardHeader/CardContent, MetricCard, ChartCard, Button/IconButton, Input, Select, Badge, FormField, Dialog, EmptyState, DataTable/TableToolbar/TablePagination and ChartTooltip. SidebarNavigation, PageContainer and PageHeader are shared by the existing shell. No unused control library was generated.

See [Tailwind migration and visual verification](docs/tailwind-migration.md) for stylesheet ownership, removed/retained SCSS, commands and measured results. The final 72-capture Chrome comparison reports zero pixel and core computed-style differences in both themes at desktop, tablet and mobile sizes. Run npm run visual:compare and npm run test:ui against a running server.

## Final reusable layout architecture

- `src/components/layout/app-shell.tsx`: single stateful admin shell; sidebar + header + content + footer.
- `src/components/layout/sidebar.tsx`: shared navigation from `src/config/navigation.ts`, responsive mobile drawer.
- `src/components/layout/header.tsx`: route-aware heading, page search, theme toggle, print/export demo.
- `src/components/layout/footer.tsx`: compact reusable footer.
- `src/styles/tailwind/layout.css`: shared shell styling; `src/styles/base.css` retains dashboard compatibility rules.
- `src/components/ui/*`: reusable Tailwind-backed cards, buttons, forms, badges, dialogs and tables.

**Begin with `codex-prompts/00-final-reusable-shell.md`, followed by existing numbered prompts.**

Scope: shared foundation, Sales and CRM. Data is simulated. Header export opens the browser print dialog. Unimplemented navigation remains disabled.

## CRM module

Routes: /dashboards/crm, /crm/leads, /crm/leads/[id], /crm/contacts, /crm/companies, /crm/companies/[id], /crm/deals, /crm/activities and /crm/meetings.

Dashboard widgets live in src/features/dashboards/crm/. Domain components, typed records, seed data, validation schemas and the local demo service live in src/features/crm/. Routes remain thin App Router entry points under the existing admin layout. CRM uses the shared shell and original typography/theme values. The shared Dialog is a native modal with keyboard dismissal and focus handling.

The CRM command center uses a horizontal stage workspace, cumulative conversion path, selectable risk matrix, age bands and upcoming touchpoints. These are distinct from Sales' KPI/chart composition. The lead inbox, split contact directory, company portfolio/profile, Kanban board, activity timeline and weekly agenda have purpose-specific layouts.

Working demo features include search, filters, sorting and pagination; create/edit forms for all six record types; validated relationships, numbers, URLs, emails and dates; deal drag/drop and accessible stage selectors; activity/meeting completion; linked company/lead details; cross-tab local storage updates; and empty/storage-error fallback states.

Demo data is stored only in this browser in the CRM demo store. If storage is blocked, in-memory edits continue with a warning. The schema validates saved data before loading it. The fixed demo date is November 1, 2026 so date-dependent examples are reproducible. Pipeline stage conversions are inferred from current stage positions, not historical cohort analytics. Meetings do not send invitations; emails/calls are logged records, not integrations. There is no backend, authentication or external CRM connection.

CRM validation: npm run typecheck, npm run lint and npm run build all pass. Production Chrome checks covered nine CRM views at 320, 390, 768 and 1440px in light/dark themes (72 combinations), with no page overflow or hydration/runtime errors. Interaction checks covered all six record editors, input validation, lead conversion, numeric table sorting/pagination, Kanban drag/drop and stage changes, filtering, agenda navigation, completion, reload/cross-tab persistence, malformed/blocked storage handling, mobile navigation and Sales regression checks. Reference captures are saved in reference/crm-verification/. Browser automation used Playwright with installed Chrome; Firefox/Safari were not tested.
# orzen-nextjs-tailwind-css-admin-dashboard-template
