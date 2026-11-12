# 09 Final Audit

PHASE 9 — MARKETPLACE RELEASE AUDIT
Review every route and advertised feature. Perform npm ci from the committed lockfile, lint, typecheck, build and responsive screenshot checks in both themes. Review console errors, keyboard navigation, accessible form labels, licensing, attribution and security. Prepare README, customization instructions, version/changelog, rights-cleared media, and a clean client source ZIP. Remove only proven unused files. Never claim untested functionality or checks passed. Provide a release-blocker report and final manual marketplace checklist.

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
