# Public marketing pages

Exactly four public routes live under `src/app/(marketing)/landing/`: `/landing/saas`, `/landing/ai`, `/landing/crm`, and `/landing/ecommerce`. The root admin redirect and all admin routes are preserved. The marketing group never renders AppShell.

## Ownership

- `src/components/marketing/`: shared public header, responsive navigation, footer, container/section/action helpers, pricing, FAQ, demo forms, and one scoped stylesheet.
- `src/features/marketing/saas/`: SaaS product storytelling, real dashboard captures, and embedded revenue/cohort components.
- `src/features/marketing/ai/`: technical landing, deterministic prompt playground, and two workflow simulations.
- `src/features/marketing/crm/`: relationship-focused landing and editable local pipeline preview.
- `src/features/marketing/ecommerce/`: independent storefront catalog, reusable product cards, discovery controls, quick view, wishlist, and shopping bag.

Marketing uses the existing ThemeProvider, semantic tokens, Inter 400/500/600, Button, IconButton, Card, Badge, Input, Select, UserAvatar, and Dialog. It introduces no backend, dependencies, or second token system. Scoped CSS controls only marketing typography, containers, accessibility, and preview presentation. Existing local product images, portraits, and Orzen artwork are reused.

## Demo behavior

- Navigation links lead to the four landing pages and relevant existing dashboard/application demos. Mobile menu supports Escape. Theme switching persists through next-themes.
- Monthly/yearly switches update prices and annual totals (illustrative 20% saving, rounded monthly price). Native details provide keyboard-accessible FAQs.
- SaaS revenue windows, movement filters, and cohort controls reuse existing dashboard components with an isolated fictional seed. AI responses and workflow completion are deterministic and local; no provider is connected.
- CRM deals advance through stages in page memory. Reset restores the original fictional pipeline. The consultation form validates name, company, email, and consent locally.
- Store search, category filters, price sorting, featured collection selection, wishlist, quick view, add/remove, and quantity controls work in page memory. Bag subtotal reflects quantity. The newsletter form validates email and consent.
- Forms show confirmation without submitting, storing, or sending personal information. Storefront has no checkout, tax/shipping calculation, or payment service. Demo records and testimonials are explicitly fictional.

## Verification

Run a local server, then `npm.cmd run test:marketing`. Set `BASE_URL` to test a production preview instead of port 3000.

The Playwright script checks all four pages at 320, 390, 768, and 1440px in light/dark, metadata, one H1 per page, no admin shell, document overflow, mobile navigation, theme persistence, internal route responses, pricing, FAQ, previews, forms, and shopping interactions. Screenshots are written to `artifacts/marketing/`. It also checks browser console and runtime errors.

Run `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build` for source/build validation. Screenshots are review evidence, not runtime dependencies.

## SaaS premium composition

`src/features/marketing/saas/saas-landing.tsx` composes eight focused components under `components/`: `saas-hero`, `product-preview`, `feature-showcase`, `revenue-section`, `retention-section`, `workflow-section`, `integrations-section`, and `saas-pricing`.

The centered hero uses four locally captured WebP assets from the actual SaaS command center (desktop/mobile, light/dark). `artifacts/marketing/capture-saas-product.mjs` reproduces these captures. The standalone revenue and retention stories import the actual dashboard components without modifying their source or connecting to saved customer data. Pricing derives from the existing Starter/Growth/Scale demo plans and shows full annual totals and rounded monthly equivalents.

The shared marketing header/footer apply SaaS-specific composition only at `/landing/saas`. Other landing-page compositions and admin modules are preserved. No new stylesheet or design tokens were introduced for this redesign.

Run `npm.cmd run test:saas-landing` against the local server, or set `BASE_URL` for a production preview. It checks 375/768/1024/1440px in both themes, correct product captures, pricing, six keyboard-accessible FAQs, revenue/cohort interactions, internal links, and responsive navigation. Captures are written to `artifacts/marketing/saas-premium-*`.
### SaaS motion and interaction upgrade

Only the SaaS feature adds `motion` and `swiper`. `saas-effects.css` is scoped to `.saas-experience`, uses existing semantic/preset variables, and adds no global design tokens. Motion handles visible-by-default section reveals, hero staggering, cohort-cell entrances, and number transitions. CSS handles limited floating panels, accent lighting, connector paths, hover depth, and FAQ transitions. Reduced-motion disables continuous decoration and animation. Neither carousel autoplays.

`product-carousel.tsx` shows five real SaaS application captures with synchronized descriptions and highlights. `testimonials-section.tsx` supplies clearly fictional stories, navigation, pagination, touch, and keyboard support. Additional local WebP product captures are reproducible with `artifacts/marketing/capture-saas-views.mjs`.

Revenue monthly/quarterly/yearly windows derive MRR histories from the same seeded subscription ledger. Cohort selection, rate/count views, customer-health filters, integration concept details, and pricing switches update local UI. No providers, payments, or integrations are connected.

Run `npm.cmd run test:saas-experience` for eight viewport/theme checks, product and testimonial navigation, keyboard/touch input, distinct revenue periods, retention/health, integration details, pricing, FAQ, reduced-motion, and no-JavaScript content. The root remains readable without JavaScript; no-script styles make carousel slides available as a stacked layout.
### SaaS banner artwork and sharp previews

The banner background is `public/images/marketing/saas-hero-architecture.webp`, generated with the built-in imagegen tool and optimized locally to WebP. Prompt: "Use case: ads-marketing. Asset type: wide background photograph/render for the existing Orzen premium SaaS landing hero. Generate a very light, elegant architectural scene: frosted glass fins and pale ivory curved architectural panels framing the far left and right edges, subtle lavender reflections and soft daylight, premium editorial 3D photography, restrained detail. Landscape 16:9. Center 60 percent must be bright off-white, calm negative space for black typography and a separately overlaid software dashboard. Gentle depth and soft realistic shadows at edges, airy white atmosphere, no saturated blobs. No text, no logos, no computers, no screens, no dashboards, no people, no watermark. This is background artwork only; keep central area uncluttered."

Actual dashboard/application captures now use a 2x device scale and lossless WebP. Preview components serve these already-optimized captures directly to prevent a second lossy image conversion. The hero dashboard perspective transform was removed to keep small interface text crisp. Dark mode uses a restrained, masked version of the same background artwork.
### Visual-first SaaS refinement

The dark feature scene now switches between subscriptions, revenue, and billing instead of repeating explanatory panels. The workflow section is a three-stage interactive handoff with changing account, collaboration, and task visuals. Both use existing seeded records and route to implemented application pages.

Copy was shortened across the hero, revenue/retention stories, integrations, testimonials, FAQ, and closing CTA. Motion adds staggered scene entrances and a scroll-progress line; SaaS-only CSS adds pointer lighting, avatar orbit, finite chart entrances, handoff motion, and restrained closing-section depth. Existing reduced-motion and server-visible content fallbacks remain in place. No dependencies or shared/admin styles were added for this refinement.