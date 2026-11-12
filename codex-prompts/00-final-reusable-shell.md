# Codex Phase 00 — Audit reusable shell + SCSS foundation

You are working INSIDE the provided Nova Admin starter. Do NOT create a new Next.js project.

Read these files first:
- README.md
- reference/dashboard-reference.webp
- src/components/layout/{app-shell,sidebar,header,footer}.tsx
- src/components/ui/*
- src/styles/{main,_legacy,_layout,_components,_tokens,_mixins}.scss
- src/config/navigation.ts

PRIMARY GOAL: Preserve the screenshot-inspired compact layout, font sizing, typography, 1px outlined cards, slim sidebar, and subtle light and dark palette while making the entire project consistently reusable.

NON-NEGOTIABLE ARCHITECTURE:
1. One shared AppShell composed from Sidebar, Header and Footer. All admin routes inherit it via the (admin) layout.
2. Sidebar is data-driven from src/config/navigation.ts, supports nested groups as needed, mobile overlay and active links. Don't add unimplemented clickable links.
3. Header handles route title, page search, theme selection and meaningful controls; no direct DOM style mutations.
4. Footer is reusable and compact, and can be configured without touching every page.
5. One shared Card, Button, Input, Select, Badge, FormField and EmptyState; add MetricCard, ChartCard, Dialog, DataTable only when needed. Domain widgets compose these primitives rather than copy their structure.
6. SCSS partials for tokens, mixins, components and layout; Tailwind utilities mainly for layout. Keep theme CSS variables as a single source of truth and avoid selector collisions.
7. Implement BOTH light and dark modes with matching density and contrast. Do not change the overall brand shell during later features.
8. Audit _legacy.scss incrementally. Remove CSS only after migrating it and confirming no regressions; do not rewrite everything at once.
9. All dashboard routes Sales, CRM, eCommerce, SaaS, HR and AI should REUSE the same shell. Marketing pages use a separate layout.
10. Do not create empty placeholder routes or duplicate header/sidebar/footer implementations.

FIRST RUN: npm install, npm run typecheck, npm run lint, npm run build. Resolve any actual errors, preserve visual styling, and report results. The starter archive includes no node_modules or package-lock.json; create and commit a lockfile after a clean install.

PHASE STOP: Only audit and polish the existing Sales dashboard and shared shell. Do not generate other dashboards until this passes review.
