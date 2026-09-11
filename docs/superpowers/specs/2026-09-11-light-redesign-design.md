# Light redesign — design spec

## Why

The live "instrument panel" dark aesthetic (`DESIGN-GUIDANCE.md` §2, shipped via
`docs/superpowers/plans/2026-08-22-instrument-panel-redesign.md`) reads as cold and
unfinished rather than trustworthy, per direct user feedback: "it seems dark, rushed
and is not necessarily a very good experience overall... it should be smooth and very
much user navigation friendly based on current 2026/2027 design patterns." This spec
replaces the dark instrument-panel direction with a light, warm, card-based design —
and adds site navigation, which does not currently exist at all (no header/nav in
`app/layout.tsx` today, only in-page breadcrumbs).

This supersedes `DESIGN-GUIDANCE.md` §2's "dark instrument panel for launch" default.
The document's other principles (answer before interaction, the number is the hero,
trust via visible assumptions, speed as a feature, one coherent system across all
pages) stay in force — only the aesthetic direction and token values change.

## Non-goals

- No font change. `IBM Plex Sans` (UI text) and `JetBrains Mono` (hero numbers only)
  stay — they already self-host via `next/font/google` and are not the problem.
- No change to any calculator's math, inputs, or copy. This is a shared-component and
  token restyle only.
- No per-calculator file edits. Confirmed by inspection: every calculator component
  (`components/calculators/*.tsx`) is built from shared primitives (`NumberField`,
  `ToggleField`, `ResultCard`, `Breakdown`) plus generic token-backed Tailwind classes
  (`text-panel-muted`, `bg-panel-surface`, etc.) — never a hardcoded hex value. Retoning
  `styles/tokens.css` and restyling the shared primitives restyles all 63 calculator
  pages at once. Because no calculator's own compute module or component file changes,
  `lib/calculatorContentDrift.test.ts` needs no `contentUpdatedAt` bumps anywhere.
- No CSS variable or Tailwind class renaming (`panel-*`, `accent-*` keep their names,
  only their values change) — same constraint the 2026-08-22 plan used, for the same
  reason: renaming would touch every consuming file for no visual benefit.
- No dark/light toggle. One committed light direction, same principle DESIGN-GUIDANCE
  already states ("decide once, apply through tokens, do not mix per page").

## Visual foundation

### Color tokens (`styles/tokens.css`)

Warm-neutral base (stone-family undertone, not cold blue-grey) so the palette reads
approachable rather than clinical white:

```
--color-panel-bg:            #FAFAF9   /* page background, warm off-white */
--color-panel-surface:       #FFFFFF   /* cards, panels */
--color-panel-surface-2:     #F3F2F0   /* inputs, insets */
--color-panel-border:        #E7E5E2   /* hairline dividers */
--color-panel-border-strong: #D6D3CE   /* input borders */
--color-panel-text:          #1C1917   /* primary text, warm near-black */
--color-panel-muted:         #57534E   /* labels, secondary text (~7:1 on bg) */
--color-panel-faint:         #78716C   /* captions, units (~4.6:1 on bg, AA for normal text) */
```

Category accents, re-tuned darker/more saturated than the dark-mode values so each
reads at proper text contrast on a white/near-white surface (the dark-mode hexes were
tuned to pop against near-black and are too light-weight for that job in reverse):

```
--color-accent-auto:        #0D9488   /* teal-600, was #00D3C7 */
--color-accent-finanses:    #2563EB   /* blue-600, was #4C9AFF */
--color-accent-majoklis:    #B45309   /* amber-700, was #FFB020 */
--color-accent-veseliba:    #DB2777   /* pink-600, was #FF6B8A */
--color-accent-sports:      #16A34A   /* green-600, was #7CE23F */
--color-accent-sabiedriba:  #7C3AED   /* violet-600, was #B18CFF */

--color-warn:                #B45309   /* same amber-700 as majoklis, kept distinct from all other accents */
```

`--color-warn` reusing majoklis's hex is a coincidence of both landing on amber-700;
keep them as two separate variables (semantically distinct: one is a category accent,
the other is "the losing option" in a comparison) even though the value matches today.

Every text/background pairing above gets a contrast check with a real checker during
QA (not just this spec's arithmetic) before shipping — call this out explicitly in
the implementation plan's verification step.

### Shape and elevation

- Cards and inputs: `rounded-xl` (12px) or `rounded-2xl` (16px) for the primary result
  card — no new Tailwind config needed, both are stock utilities.
- Replace hairline-border-only cards with a soft single-layer shadow (`shadow-sm`,
  stock Tailwind utility) plus a thin border in `--color-panel-border` for definition
  at low elevation — border alone read as "unfinished," shadow adds the missing depth
  cue without going heavy.
- More vertical rhythm: increase the shell's outer gap (`gap-6` → `gap-8`) and card
  internal padding (`p-6` → `p-7` or `p-8` on the hero `ResultCard`) for breathing room.

### `html { color-scheme }`

`app/globals.css` line 8 changes from `color-scheme: dark` to `color-scheme: light` —
this affects native form control rendering (number input spinners, etc.) and must
change or inputs will render with dark-theme native chrome on a light page.

## Navigation

No site header/nav exists today — `app/layout.tsx` renders only `{children}` and the
`Footer`. Add:

### `components/SiteNav.tsx` (new)

- Sticky top bar (`sticky top-0 z-10`), white surface, bottom hairline border.
- Left: site wordmark "Manikalkulatori.lv", links to `/`.
- Right (desktop): the 6 category links from `lib/registry.ts`'s `categories` array,
  plain text links, active category (if on a category or calculator page) gets its
  accent color as underline — no mega-menu, no dropdown; 6 items is a normal horizontal
  nav, a mega-menu would be over-engineering for this scale.
- Mobile (`< sm`): category links collapse into a hamburger-triggered panel. This is
  the only interactive piece, so it is the only part of `SiteNav` needing `'use client'`
  — split into `SiteNav` (server) rendering the static bar plus a small
  `MobileNavToggle` (client) island for the hamburger/panel, so the nav doesn't force
  the whole header into a client bundle.
- Wire into `app/layout.tsx`, rendered before `{children}`.

### Breadcrumbs

Keep the existing breadcrumb pattern in `CalculatorShell.tsx` and `app/[category]/page.tsx`
— restyle typography only (smaller, `--color-panel-faint`), no structural change. With
`SiteNav` now present, breadcrumbs stop being the only wayfinding and become a
secondary "you are here" cue, which is the right division of labor.

### Homepage (`app/page.tsx`)

Currently a 2-column grid of category cards with a plain header — keep that structure
(it is already close to the target), apply the new card treatment (shadow, rounded-xl,
more padding), and add one short intro sentence contextualizing the site (it currently
jumps straight from H1 to the grid with only a one-line description — acceptable as-is,
no new content section needed here, this is a restyle not a content rewrite).

### Category page (`app/[category]/page.tsx`)

Currently a plain `<ul>` of underlined text links. Replace with a card grid (same
visual language as the homepage's category cards, one card per calculator: title plus
first ~80 characters of its `intro` as a one-line description) — this is the
"navigation friendly" fix the user specifically flagged: scanning a grid of described
cards is materially easier than scanning a bare link list, especially for categories
with 8+ calculators.

### Related calculators (`components/RelatedCalculators.tsx`)

Same treatment as the category grid but smaller/denser (2-3 cards, not a full grid) —
consistent card language across all three "browse calculators" surfaces (home,
category, related) rather than three different visual patterns for the same job.

## Shared component changes

No new abstractions beyond `SiteNav`/`MobileNavToggle` — YAGNI applies; the category
and related-calculator cards are similar but not identical (different data shown), so
each stays inline in its own page/component rather than forcing a shared `Card`
component that would need props for two different content shapes.

Files touched, all restyle-only (props/logic unchanged unless noted):

- `styles/tokens.css` — full value swap (above)
- `app/globals.css` — `color-scheme: light`
- `tailwind.config.ts` — no structural change needed; stock `rounded-xl`/`shadow-sm`
  cover the new shapes
- `components/CalculatorShell.tsx` — outer spacing, breadcrumb typography
- `components/Footer.tsx` — light surface, border, spacing
- `components/Faq.tsx` — card shadow/radius on `<details>`, spacing
- `components/RelatedCalculators.tsx` — card grid (structural: list → grid)
- `components/ResultCard.tsx` — shadow, radius, padding
- `components/NumberField.tsx` — radius, border-strong contrast on light bg
- `components/ToggleField.tsx` — same
- `components/Breakdown.tsx` — radius, shadow
- `components/SiteNav.tsx` — new
- `components/MobileNavToggle.tsx` — new (client island)
- `app/layout.tsx` — render `SiteNav`
- `app/page.tsx` — card treatment, intro line
- `app/[category]/page.tsx` — list → card grid

## Testing / verification

- `npx tsc --noEmit`, `npm run build`, `npm test` (full suite) — same bar as every
  other push per `CHARTER.md`'s deploy checklist. No `contentUpdatedAt` bumps expected
  (see Non-goals); if the drift test unexpectedly fails on a calculator file, that is a
  signal a change leaked into a per-calculator file and should be reverted to a shared
  file instead, not worked around with a bump.
- Manual contrast check (real checker, not eyeballing) on: body text, muted text,
  faint/caption text, and each of the 6 category accents, all against both
  `--color-panel-bg` and `--color-panel-surface`.
- Manual visual QA via the `run` skill: start the dev server, check the homepage, one
  category page, one calculator page (with a comparison-tone `ResultCard`, e.g.
  `elektroauto-vs-benzina`, to see the warn-color path), and mobile width (~400px) for
  the nav hamburger and card grids.
- No dash-scan or new-copy concerns — this spec introduces no new visible Latvian
  prose beyond the category-page card descriptions, which reuse each calculator's
  existing `intro` field verbatim (already dash-clean, already tested).
