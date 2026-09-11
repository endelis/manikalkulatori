# Session plan

This file is the single source of truth for session planning and lives in the repo.

## Recurring

- EV vs ICE calculator defaults, cadence quarterly. Re-check electricity price
  including distribution and PVN, EV consumption, petrol price, comparable ICE
  consumption, annual mileage against current sources. Flag any default that
  moved more than about 5 percent, update source links, then confirm the live
  calculator uses those values. Data file: claude/ev-vs-ice-defaults-2026.md
- Demographics data refresh, twice a year. February for provisional prior year
  figures, June for final figures and the population recalculation. Re-pull
  IRS010, IRS031 and IDK010, update claude/demografijas-defaults-2026.md with
  new retrieval dates, bump contentUpdatedAt on affected pages, verify the
  chart series extends by one year, confirm every rendered number still traces
  to a data file row.

## Blocked

- SEO and content gap audit. Blocked because the Ahrefs plan does not cover
  API v3, confirmed 2026-09-04 when every endpoint returned Insufficient plan
  including the nominally free ones.

## Backlog

- 2026-10-16: Measure the demographics pages in Search Console. One check,
  then decide. Both indexed with impressions on the national page: build the
  remaining novads pages. Indexed but no impressions: authority problem, work
  on links, do not build more pages. Not indexed: diagnose before building
  anything in this category.

- Drift test coverage. The test tracks a hand maintained per calculator file
  list, so everything under lib/ and components/ is untracked. Three shared
  component bugs reached production because of this. An import graph walker
  was scoped at about half a day but rejected: it would force a
  contentUpdatedAt bump on every importing page whenever a shared utility
  changes, which would falsely signal content change to Google across the
  whole sitemap. Preferred direction: compare a hash of each page's rendered
  HTML output instead, so the test fires only when output actually changes.
  Must be resolved before building the remaining novads pages.

## Done

- 2026-09-04: Sabiedrība category, iedzivotaju-skaits-latvija,
  dzimstibas-kalkulators, and a three page novads pilot (Daugavpils, Jelgava,
  Varakļāni). Data verified against CSP IRS010, IRS031 and IDK010. Chart and
  accessible table shipped. Small area threshold set at 10 000 residents,
  below which derived figures are suppressed. Indexing requested. Closed.
  Out of scope from this date: copy polish, new modules, design revisions,
  additional calculation modes.

- 2026-09-04: "Mana pensija" (1st pillar) pension calculator,
  /finanses/pensijas-kalkulators. Built across four checkpoints (data and
  routing, input UI and live calculation, methodology and limitations and
  sources and FAQ, final QA), merged as PR #24, contentUpdatedAt
  correction as PR #25. Defaults verified against VSAA, LV portāls, CSP,
  and the Satversmes tiesa, full verification pass, sources, and decision
  log in claude/pension-calculator-defaults-2026.md. Two corrections made
  mid build: the K backfill for years without salary history was double
  counting wage growth (fixed, backfilled years now contribute flat, no
  further indexation), and the wage index series citation was upgraded
  from a single value to the full 1997 to 2024 year by year chain
  extracted directly from the source PDF. 1st pillar only, 2nd and 3rd
  pillar explicitly signposted as future work in the page's own copy, not
  a silent gap. Out of scope from this date: 2nd and 3rd pillar modules,
  copy polish, design revisions.
