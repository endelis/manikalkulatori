# Session plan

## Done

- 2026-09-04: Sabiedrība category, iedzivotaju-skaits-latvija,
  dzimstibas-kalkulators. Built, reviewed, data verified against CSP IRS010,
  IRS031 and IDK010, chart and accessible table shipped, indexing requested.
  Closed. Out of scope from this date: copy polish, new modules, design
  revisions, additional calculation modes.

## Recurring

- Refresh demographics data. Cadence: twice a year, February for provisional
  prior year figures, June for final figures and the population
  recalculation. Prompt: re-pull IRS010, IRS031 and IDK010 for the new
  reference year, update claude/demografijas-defaults-2026.md with new
  retrieval dates, bump contentUpdatedAt on both pages, verify the chart
  series extends by one year, confirm no rendered number falls outside its
  data file row.

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
