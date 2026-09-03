# Manikalkulatori.lv — repo guide

See PROJECT-OVERVIEW.md and DESIGN-GUIDANCE.md for product and design context. This file is operational: where things live and how to make small changes without over-exploring.

## MAP

- Root layout, `<html>`/`<body>`, fonts: `app/layout.tsx`
- Third party scripts and analytics tags: `components/GoogleAnalytics.tsx` (gtag, loaded only after cookie consent), `@vercel/analytics` wired directly in `app/layout.tsx`. Add new third party scripts as a component here or a sibling component, never inline in a page.
- Cookie consent state and events: `lib/cookieConsent.ts`; banner UI: `components/CookieBanner.tsx`
- Site config (canonical URL, etc.): `lib/site.ts`
- Calculator registry, single source of truth for slugs/titles/metadata/`contentUpdatedAt`: `lib/registry.ts`
- Calculator math (pure functions, one file per calculator): `lib/calculators/<slug>.ts`
- Calculator UI components, one per calculator, mapped by slug: `components/calculators/<Name>Calculator.tsx`, registered in `components/calculators/registry.tsx`
- Sitemap: `app/sitemap.ts` (reads `contentUpdatedAt` from the registry, never `Date.now()` or git). Robots: `app/robots.ts`
- Category and calculator routes: `app/[category]/page.tsx`, `app/[category]/[calculator]/page.tsx`
- Homepage: `app/page.tsx`. Footer/legal nav: `components/Footer.tsx`
- Legal pages (Latvian copy lives here): `app/privatuma-politika/page.tsx`, `app/noteikumi/page.tsx`, `app/par-mums/page.tsx`, `app/kontakti/page.tsx`
- FAQ markdown content per calculator: `content/faq/<slug>.md`
- Design tokens: `styles/tokens.css`
- Tests: colocated as `<file>.test.ts` next to the code they cover, e.g. `lib/registry.test.ts`, `lib/calculators/<slug>.test.ts`. No separate `tests/` tree except `tests/smoke.test.ts`.

Anyone adding a one line script tag or tracking pixel: read this MAP, edit `components/GoogleAnalytics.tsx` or add a sibling component next to it, wire it into `app/layout.tsx`. Nothing else needs touching.

## Sitemap dates

Every calculator carries a hand maintained `contentUpdatedAt` (ISO date) in `lib/registry.ts`. `app/sitemap.ts` reads it directly. When you change a calculator's rendered numbers or copy, bump its `contentUpdatedAt` in the same commit. `lib/calculatorContentDrift.test.ts` checks this against git history and fails if a calculator's compute module or component changed more recently than its recorded `contentUpdatedAt`.

## Small change protocol

For a change touching one or two named files:
1. Do not explore beyond those files and this MAP. No repo wide search.
2. Run only the tests for the affected file(s) (e.g. `npx vitest run lib/registry.test.ts`), not the full suite.
3. Batch unrelated small chores into one turn instead of one per turn.
4. Report the diff. Nothing else, no narration of steps taken.

This protocol is for small, well scoped edits. It does not apply to new features, new calculators, or anything the MAP doesn't already answer, those still warrant normal exploration.
