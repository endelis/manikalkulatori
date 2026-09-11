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

Set `contentUpdatedAt` to the squash merge commit time on master, not the feature branch commit time. Branch time is earlier than the commit the drift test compares against and will fail on master.

## Local ESLint cannot be trusted from inside a worktree

If this repo is checked out as a git worktree alongside another checkout of the same
repo (e.g. a `.claude/worktrees/<name>` layout with a second `package-lock.json` in a
parent directory), Next.js infers the wrong workspace root from the duplicate lockfile
and `next/core-web-vitals` fails to resolve, so ESLint silently does nothing during
`npm run build` (`npx next lint` fails the same way directly, not specific to any one
invocation). The build still reports "Compiled successfully" and exits 0. GitHub
Actions runs a clean single checkout with no such ambiguity, so its ESLint actually
runs, which means a real lint error (most commonly `react/no-unescaped-entities`, a
literal `"` or `'` typed directly as JSX text instead of `&quot;`/`&apos;`) can pass
every local check and only fail once pushed. Until the worktree's duplicate lockfile is
cleaned up, treat `npm run build` succeeding locally as necessary but not sufficient:
grep new JSX text for stray literal quote characters by hand before pushing, or push
early and check the actual GitHub Actions log rather than trusting a long local green
streak.

## Dashes, hyphens, and the minus sign

Visible Latvian copy must never contain a dash or hyphen used as punctuation (em dash,
en dash, hyphen-minus as a connector, etc.) — that punctuation is a well known AI
generated text tell. This ban is about punctuation in prose, not about numbers. A
mathematical minus sign attached to a digit (a negative number) is not punctuation and
is not covered by the ban.

- Prefer rephrasing so the negative number does not need to appear at all: "mirušo
  bija par 47 vairāk nekā dzimušo" instead of "dabiskais pieaugums bija -47". This is
  usually also the more readable sentence, and is the first choice.
- Where a negative number must still render as a number (a table cell, a chart axis),
  use U+2212 MINUS SIGN, never U+002D HYPHEN-MINUS. Use `formatSignedNumber` from
  `lib/format.ts`, which does this.
- A dash-scan test (see `app/sabiedriba/iedzivotaju-skaits/novads-pilot.rendered.test.ts`)
  allows U+2212 only when it is immediately followed by a digit (i.e. genuinely part of
  a number), and still fails on it, and on U+002D and the other dash variants, anywhere
  else in visible text.
- A displayed mathematical formula (monospace algebraic notation, e.g.
  `tumsas_stundas(n) = 24 − gaismas_stundas(n)`) is not prose, so U+2212 used there as a
  subtraction operator between algebraic terms is also exempt, on the same footing as ×
  and ÷ already used in that notation. This only covers an actual formula display block,
  never a subtraction written out in a sentence.
- ISO date strings from a data file (`"2026-06-21"`) contain U+002D and must never be
  interpolated directly into visible copy; format them into Latvian date prose first
  (`"2026. gada 21. jūnijā"`). This is an easy one to miss once real content lands on top
  of a skeleton that only had labels; scan the built HTML, not the source, to catch it.

## Small change protocol

For a change touching one or two named files:
1. Do not explore beyond those files and this MAP. No repo wide search.
2. Run only the tests for the affected file(s) (e.g. `npx vitest run lib/registry.test.ts`), not the full suite.
3. Batch unrelated small chores into one turn instead of one per turn.
4. Report the diff. Nothing else, no narration of steps taken.

This protocol is for small, well scoped edits. It does not apply to new features, new calculators, or anything the MAP doesn't already answer, those still warrant normal exploration.
