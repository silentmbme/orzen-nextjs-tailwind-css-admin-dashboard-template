# Shared Tailwind migration - first execution

This pass changes the shared styling implementation only. Sales/CRM widgets, content, feature SCSS, routes, navigation data, behavior, and compositions are preserved. Dashboard-specific migration remains a separate phase.

## Runtime stylesheet ownership

- `src/styles/tailwind/tokens.css`: CSS-first Tailwind v4 `@theme static`, static values taken from the existing implementation, runtime light/dark variables, and compatible `--ui-*` aliases. No palette or typography scale was replaced.
- `src/styles/tailwind/components.css`: shared cards, metric cards, buttons, form primitives, badges, empty states, dialogs, tables, chart summaries, and chart tooltips. Repeated rules use Tailwind `@apply`; existing semantic class hooks and selector specificity remain available for feature overrides.
- `src/styles/tailwind/layout.css`: shared shell, header, sidebar/navigation, search, footer, mobile drawer, and print styles. Original inclusive breakpoints (1100px, 850px, 560px, and the 851px desktop rule) remain exact. Side-specific borders and CSS import order are deliberately preserved.
- `src/app/globals.css`: Tailwind and shared token imports. Component styles reference this theme entry without importing themselves.
- `src/app/layout.tsx`: loads globals, shared component CSS, retained feature/legacy SCSS, then the shared shell stylesheet. Both shared stylesheets use `@reference` to resolve the global theme without emitting Tailwind twice. Static theme emission preserves tokens used by runtime CSS aliases in both dev and production builds.
- `src/styles/main.scss`: retained base/legacy/dashboard compatibility rules. Feature styles remain under Sales and CRM.

Unlayered semantic component rules preserve the existing feature SCSS override contract. They are backed by Tailwind utilities rather than a second Sass component system.

## Reusable components

AppShell still composes one Sidebar, Header and Footer. SidebarNavigation, PageContainer and PageHeader extract existing DOM without adding wrappers. Card now uses exported CardHeader and CardContent. Existing Card/ChartCard/MetricCard APIs remain compatible.

Button keeps its original default, primary, ghost, small and icon appearance. It also exposes secondary, outline, destructive, large and loading states using existing tokens. IconButton delegates to Button. DataTable uses TableToolbar and TablePagination without changing table markup, text, filtering, sorting or pagination. Existing Input, Select, Badge, FormField, Dialog, EmptyState and ChartTooltip remain in use. Unused controls such as Switch, Tabs and Checkbox were not created.

## SCSS cleanup

Removed only after their Tailwind replacements passed comparisons:

- `_tokens.scss`
- `_components.scss`
- `_cards.scss`
- `_buttons.scss`
- `_forms.scss`
- `_tables.scss`
- `_navigation.scss`

`_legacy.scss`, `_mixins.scss`, remaining dashboard rules in `_layout.scss`/`_charts.scss`, and all feature SCSS are retained. Original shared SCSS is archived with the visual evidence, outside runtime source.

## Verification and reproduced commands

Before editing styles, the original production build was captured using installed Chrome through Playwright. Evidence is under `artifacts/tailwind-migration/`:

- `baseline/`: 72 screenshots and computed-style snapshots.
- `shared-layout/`: the initial failed comparison.
- `shared-layout-fixed/`: zero image or computed-style differences.
- `shared-ui/`: final zero image or computed-style differences.

The matrix covers Sales, CRM, and eight CRM application/detail views at 1440px, 768px and 390px in both themes, plus dialogs, search results, mobile navigation and recorded primary-button hover styles. Raw decoded RGBA pixels are compared without a tolerance. Core computed styles and element bounds are compared separately. These results establish equivalence in the tested Chrome environment, not across untested browsers or viewports.

The first layout migration exposed a desktop menu-button cascade-order regression and side-border color differences. Import order and side-specific border utilities were corrected before the UI migration proceeded.

Production build, TypeScript and ESLint pass. `npm run test:ui` verifies loading/disabled button behavior, Sales table search/sort/pagination/empty states, period selection, dialogs, CSV/print, page search, CRM form validation/save, persisted deal stages/themes, and mobile navigation. No Bootstrap dependency or import was found.

To compare a running server against the saved workspace baseline, in PowerShell:

```powershell
npm.cmd run build
npm.cmd run start -- --port 3000
# In a second terminal:
$env:VISUAL_BASE_URL = 'http://localhost:3000'
npm.cmd run visual:compare
npm.cmd run test:ui
```

The browser defaults to installed Chrome (`VISUAL_BROWSER=chrome`). Set `VISUAL_BASE_URL` for another port. `npm run visual:baseline` captures an initial reference; replacing an existing baseline additionally requires `UPDATE_VISUAL_BASELINE=1`. Do not replace the baseline to conceal a failed migration comparison. Screenshots/JSON are verification artifacts and are not imported by the app.

## Remaining scope

Sales-specific and CRM-specific styling is intentionally still SCSS. No dashboards were added, removed or rearranged. Further feature migration must repeat the baseline comparison. Firefox/Safari and viewport sizes outside the recorded matrix were not tested in this pass.

## Approved modal-centering correction

After the architecture migration, native dialogs were explicitly centered using the shared Tailwind-backed .ui-dialog/.ui-modal-centered rule. This corrects the pre-existing top-left positioning caused by reset margins. Sales order dialogs share the same rule. Tall modals scroll internally within viewport gutters. Run npm run test:modals against a running server; evidence is stored under artifacts/modal-centering/. Original migration baseline dialog captures predate this approved positioning correction, so modal differences against that older baseline are expected.
