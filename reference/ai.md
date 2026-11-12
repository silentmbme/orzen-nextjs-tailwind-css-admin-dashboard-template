# AI operations module

Six routes use the existing admin shell, local Inter fonts, Tailwind tokens, cards, forms and dialogs. No framework, provider SDK, stylesheet, external AI call or credential was added.

| Route | Composition and interactions |
| --- | --- |
| `/dashboards/ai` | Featured inference monitor; environment/model/period filters; token/cost chart toggle; model latency leaderboard; recent request inspection; workflow/prompt activity; usage share and demo thresholds; CSV |
| `/apps/ai/chat` | Conversation sidebar, mobile history toggle, model selection, safe Markdown subset, deterministic delayed reply, copy, regeneration and confirmed clear |
| `/apps/ai/models` | Fictional technical cards and comparison; search/state/capability filters; details dialog; enabled state and protected default routing |
| `/apps/ai/prompts` | Collection rail, grid/list library, favorites, creation/editing, variables, resolved preview/copy, duplication, version snapshots and protected deletion |
| `/apps/ai/workflows` | Agent directory, selectable five-stage canvas, configuration editing, enabled state, explicit success/failure simulations, stop/recovery control and execution history |
| `/apps/ai/usage` | Detailed date/model/environment/status scope, request diagnostics, outcome trend, per-model analysis, searchable/sortable/paginated event log, inspection and CSV |

## Files

- Thin route entrypoints: `src/app/(admin)/dashboards/ai/` and `src/app/(admin)/apps/ai/`.
- Dashboard and five analytic components: `src/features/dashboards/ai/`.
- Domain models, fixtures, validation, store, hooks and six workspace components: `src/features/ai/`.
- Navigation: `src/config/navigation.ts`.
- `src/components/layout/header.tsx`: deduplicates search matches by destination when a dashboard is listed in multiple navigation groups; existing header UI is preserved.
- Tests: `scripts/verify-ai-domain.mjs` and `scripts/verify-ai.mjs`; run with `npm run test:ai` against a running production server on port 3168, or set `VISUAL_BASE_URL`.

Reused AppShell, Header, Sidebar, Footer, PageHeader, Card, ChartCard, Button, Input, Select, Badge, Dialog, DataTable and UserAvatar. AI-specific helpers are AiWorkspace, AiTitle, AiStatus, ConversationMessage and MarkdownText. The workflow canvas uses normal accessible buttons and contained horizontal scrolling.

## Data and calculations

All specifications, providers, prices, availability indicators, token counts and records are fictional. The fixed reporting date is November 2, 2026. User actions use the current UTC time of day on that date. Historical request records are retained after configuration changes.

- Estimated cost = (input tokens × model input rate + output tokens × model output rate) / 1,000,000.
- Success/error rates use request counts. Mean latency is the arithmetic mean of all scoped requests. Throughput is requests / selected calendar days.
- Dashboard filters apply to requests, model metrics, historical runs and prompt usage. Pending runs are Sandbox operations and respect model/date scope.
- Usage filters apply to all page metrics and CSV. Log search/sorting/pagination affect the table display only.
- Chat and workflow actions append related Sandbox request records. Sample token counts on new local actions are deterministic character-based estimates, not a tokenizer. No real billing or enforcement exists.
- Simulated workflow runs are manual, including those labelled Demo schedule. A local timer yields the selected success/failure scenario. Stop simulation can release a persisted Running state after reload; stopped executions create a failed zero-token request. Hiding a page within client navigation does not cancel its timer.
- Model availability is a sample state independent of whether local routing is enabled. The default model cannot be disabled; historical model entries are retained.
- Referenced prompts and workflows cannot be deleted. Prompt edits capture prior content; duplicates start their own version history.
- Markdown supports headings, bullet lines, bold and inline code. React escapes raw HTML. Arbitrary HTML, remote images and executable Markdown are not supported.
- Clipboard/popup/provider integrations are not required. Clipboard errors show a manual-copy fallback.

Local persistence key: `nova-ai-demo-v1`. Remove this key and reload to reset. Invalid saved data falls back to original samples with a warning; unavailable/full storage retains in-memory changes and reports the limitation. This is not a multi-user database or an authentication system.

## Validation

Run `npm run typecheck`, `npm run lint`, `npm run build`, then `npm run test:ai` against the running production server. Browser captures are written to `artifacts/ai/`.

Domain tests exercise relational validation, arithmetic, filters, prompt history/reference guards, workflow concurrency/success/failure/stop and chat regeneration. Browser checks exercise all six routes, CRUD/actions, copy and exports, malformed storage fallback, dialogs, eight viewport/theme combinations and external-network absence.
