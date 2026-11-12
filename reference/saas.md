# SaaS module

Exactly six routes are provided:

| Route | Composition |
| --- | --- |
| `/dashboards/saas` | Featured MRR history, revenue movement ledger, customer retention cohorts, plan performance, renewals, collections, health and recent subscriptions |
| `/apps/saas/subscriptions` | Operational register with search, status/plan/date filters, numeric sorting, pagination and detail/edit/confirmation dialogs |
| `/apps/saas/plans` | Monthly/yearly pricing cards, feature/limit comparison, create/edit dialog and guarded delete confirmation |
| `/apps/saas/customers` | Account list/detail workspace, health/plan/search filters, pagination, profile modal, activity/usage context and saved notes |
| `/apps/saas/billing` | Collection overview, invoice register/filters/export, preview/print modal and transaction/follow-up history |
| `/apps/saas/analytics` | Stacked consumption trends, adoption inspection, engagement scatter plot, rolling usage limits and completed-month retention/churn |

There are no subscription/customer/invoice detail routes. The existing AppShell and navigation render all pages. Sales, CRM and eCommerce features and global styles are preserved. SaaS uses existing theme tokens, Inter, uppercase 11px card labels with 14px Lucide icons, compact shared cards, controls, tables, dialogs, tooltips and local user portraits. All new feature styling uses Tailwind v4; no new SCSS or global theme variables were introduced.

## Demo data and definitions

The fixed snapshot is **November 1, 2026**. `src/features/saas/types.ts`, `seed.ts`, `selectors.ts` and `demo-service.ts` provide coherent customers, pricing plans, subscriptions, recurring-revenue movements, invoices, payment events and usage records. Customer/company identities, portraits, invoices and all activity are fictional demo material.

- MRR comes from the latest dated event per subscription. Yearly amounts normalize to a monthly value rounded to cents. Active subscriptions contribute MRR; trialing, paused and canceled subscriptions contribute zero. ARR is current MRR × 12, not invoice collections. Small annual rounding differences are possible; yearly invoices retain the actual yearly price.
- Revenue windows run from the selected opening date (exclusive) to the snapshot (inclusive). Opening MRR + new/resumed + expansion − contraction/pauses − churn = closing MRR. NRR follows only subscriptions with positive MRR at the opening date; new accounts are excluded. Subscriber churn divides canceled members of that opening cohort by its size.
- The cohort heatmap follows each customer's first positive-MRR month, counting that customer once even with multiple subscriptions. Retention means at least one positive-MRR agreement at completed month-end. Unavailable future months render as dashes. Month-end MRR history and completed-month retention charts remain historical; each chart labels its time scope.
- Invoice amounts and descriptions are historical snapshots. Collected totals equal paid invoices and seeded successful payment records. Outstanding includes Open and Failed invoices. Follow-ups append a zero-amount event and leave invoice/payment status unchanged.
- Usage records carry a historical plan ID. Daily active-user counts aggregate seats across workspaces, not unique people across a multi-day range. Multi-day chart buckets show user-days. API usage sums requests; storage uses the latest snapshot, not a sum. The rolling 30-day limit table compares account usage to its first current active agreement (or first agreement when none is active), independent of the chart date filter.
- Illustrative account health is At risk for failed invoices, no activity or inactivity over 14 days; Watch for inactivity over 7 days; otherwise Healthy. This is an explained demo rule, not a predictive score.

## Working actions

Subscriptions support create/edit, trial activation, plan/cycle changes, pause/resume and confirmed cancellation. Status/price changes append an MRR event; renewals may be edited. Canceled agreements cannot resume and paid agreements cannot return to trial. No proration, automated renewal, invoice generation or payment processing runs. Existing prices remain grandfathered until the plan or billing cycle changes.

Pricing plans support unique names, positive validated prices/limits, features and active/inactive status. Existing agreements and invoices are preserved when plan prices change. Any plan referenced by subscriptions or MRR history cannot be deleted; deactivate it instead. Unreferenced plans require explicit delete confirmation.

The pricing workspace includes portfolio totals, search across names/descriptions/features, availability filtering, price/MRR/name sorting, aligned pricing cards with computed yearly savings and MRR share, subscriber preview dialogs, and a comparison matrix for the visible plans. Differences-only mode hides shared limits/features; comparison export follows that mode and the active catalog filters. The highest-MRR badge is calculated from the entire portfolio rather than a marketing recommendation.

Customer notes save locally. Invoice previews use captured values and an HTML-escaped, separate print document. Print invokes browser printing; blocked popups show a clear error. Billing follow-ups never send email, retry a charge or alter invoice status. CSV exports label their demo origin and escape formula-leading text.

The local key is `nova-saas-demo-v1`. Stored schema/references are checked before rendering. Corrupt/inaccessible storage falls back to seed data with a visible warning. Quota errors keep changes in memory and display a warning. Cross-tab storage events refresh the local snapshot. Remove this key in developer tools to reset the module. This demo is not authenticated or suitable for sensitive data.

## Verification

Run `npm run typecheck`, `npm run lint`, `npm run build` and `npm run test:saas`. Set `VISUAL_BASE_URL` to a running preview URL (browser-test default `http://localhost:3161`). Installed Chrome is used through Playwright.

`verify-saas-domain.mjs` checks reference integrity, MRR reconciliation in four windows, invoice/payment totals, annual billing and lifecycle guards. `verify-saas.mjs` checks all main workflows, confirmations, persistence, CSV downloads, print-document invocation, empty/error states, mobile navigation, dialogs/Escape and six routes at 1440, 768, 390 and 320 pixels in both themes. Browser captures are saved to `artifacts/saas/`.

Remaining integration boundaries: no backend/authentication, customer messaging, payment gateway, real collection, automatic renewals, proration, tax engine, live usage ingestion or physical-printer verification. Browser printing uses the user's print dialog.
