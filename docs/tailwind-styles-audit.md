# Tailwind v4 stylesheet audit

Updated 2026-11-11.

- Converted 5,036 declarations across nine stylesheets to Tailwind v4 @apply utilities, preserving selector specificity, source order, media queries, and important flags.
- Compiled SCSS nesting and focus mixins into CSS, migrated four entrypoints, and removed eight SCSS source files.
- src/styles/base.css replaces main.scss and its compatibility partials. Sales, CRM workspace, and CRM dashboard import adjacent .css files.
- Stylesheets using @apply reference the central globals.css theme. Tokens and presets remain centralized in src/styles/tailwind.
- Custom properties, gradients, background images, animations/keyframes, masks, complex values, and third-party selectors remain native CSS as supported by Tailwind v4.
- Existing shared Tailwind component and layout files were preserved.

Validation: production build and TypeScript passed. Shared UI interactions passed. Seven modal types centered on desktop and mobile in both themes. Eight representative routes rendered without runtime errors; browser results in artifacts/style-migration-browser-results.json. Screenshot differences include animation timing and are not proof of exact pixel parity. Sales mobile recheck after layout settled measured 390px document width at a 390px viewport.

## Remaining utility migration

Converted the remaining 754 ordinary declarations across 12 stylesheets to Tailwind arbitrary-property utilities, including backgrounds, masks, transforms, transitions, animation usage, logical positioning, and SVG properties. No ordinary declarations remain outside Tailwind definitions and keyframes. CSS custom properties and keyframe definitions remain native CSS. Production build, shared UI tests, and light/dark responsive checks on the four landing pages and Sales dashboard passed.
