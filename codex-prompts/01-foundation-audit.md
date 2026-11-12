# 01 Foundation Audit

PHASE 1 — STARTER VALIDATION AND DESIGN FOUNDATION
Inspect the existing Nova Compact Starter ZIP after extraction, rather than reinitializing another project. Install packages and generate/commit a lockfile. Fix any version and TypeScript incompatibilities. Review the reference screenshot at identical screen size. Set up Inter via next/font/google if reliable, or preserve the documented fallback if offline. Improve tokens and accessibility without changing the compact visual character. Audit mobile sidebar, theme switching and responsive overflow. Do not build extra dashboards yet.

GENERAL NON-NEGOTIABLE RULES:
- Review README.md and the attached UI reference screenshot first.
- Maintain the existing 13px compact body typography, 11px card labels, 20px headings, minimal outlines, 9px card radii and ~10px grid gaps.
- Keep the light theme visually close in density, hierarchy and polish to the reference; create a deliberate dark theme with equivalent quality.
- Maintain originality: no copying logo, branding, exact composition or proprietary assets from reference.
- Preserve existing app shell, navigation conventions, tokens and current working pages.
- Use existing components before adding dependencies or creating new helpers.
- Only build the requested phase; no fake placeholder routes or non-functional buttons.
- Demo actions must work locally or be explicitly labelled as demonstration-only.
- Run npm run typecheck, npm run lint and npm run build, fixing errors; report only checks actually executed.
- Enumerate all modified files and stop after this phase.
