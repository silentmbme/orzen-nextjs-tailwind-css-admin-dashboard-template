# Step 00 — SCSS & reusable components mandate

Work INSIDE the existing Nova starter. Do not reinitialize or replace the project. First inspect `src/styles/main.scss`, `_tokens.scss`, `_mixins.scss`, `_components.scss`, `_legacy.scss`, and `src/components/ui`.

## Requirements
1. Use Tailwind CSS v4 for utilities/layout and **SCSS** for reusable component styling and theme design tokens. Keep `@import "tailwindcss"` inside `src/app/globals.css`; Sass is imported separately in root layout.
2. Reuse `Card`, `Button`, `Input`, `Select`, `Badge`, `FormField`, `EmptyState` in `src/components/ui`; extend them conservatively when a real feature needs it.
3. Move visual-reference legacy selectors from `_legacy.scss` into organized partials by feature **incrementally only**; never redesign all pages or duplicate stylesheet declarations.
4. Create only genuinely reusable components: `MetricCard`, `ChartCard`, `DataTable`, `Modal`, `Dropdown`, `Tabs`, `Avatar`, `Skeleton`, `PageHeader`, `StatusBadge`, `ConfirmDialog` when needed. Keep domain widgets in feature directories.
5. Keep compact ~13px typography, 11px labels, 22px KPI values, 9px outlined cards, ~10px gutters, almost no shadows. The reference picture in `reference/dashboard-reference.webp` is the styling guide, not branding or a composition to copy.
6. Semantic variables in one location; dark theme adjusts surfaces and accents without arbitrary per-page overrides.
7. Preserve existing Sales UI, light/dark switching, responsive sidebar and all functional interactions. All dashboard/app pages use shared card, button, input, selector and table primitives.
8. Do not create unused files, duplicate cards/buttons, CSS-in-JS themes, extra component libraries, giant one-file pages, dead demo click handlers or premature routes.
9. Verify `npm install`, `npm run typecheck`, `npm run lint`, `npm run build`; fix genuine failures. Report actual results without claiming unrun tests.

## First task
Audit starter, apply only SCSS/component-system improvements needed to polish existing Sales dashboard, validate, and stop. Do not generate the other five dashboards until asked.
