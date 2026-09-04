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

- Build "Mana pensija" (1st pillar) pension calculator. Ready to build.
  Personal financial calculator, same family as EV vs ICE (practical
  personal decision tool, higher search and commercial intent than the
  demographic explainers), chosen 2026-09-04 over the alternative
  worker to pensioner ratio demographic explainer direction (that idea, a
  sequel to the dzimstības kalkulators, stays as a possible future piece).

  Defaults fully verified against primary sources on 2026-09-04, see
  claude/pension-calculator-defaults-2026.md for the full verification
  pass, sources, and confidence levels. Most important finding: the 1st
  and 2nd pillar contribution split changed from 14 percent and 6 percent
  to 15 percent and 5 percent since 2025, a temporary measure upheld by
  the Constitutional Court on 2026-06-18. Do not use the old 14 percent
  and 6 percent split. Current coefficient G at age 65 is 17.76, effective
  from 2026-01-01.

  Scope decisions locked in on 2026-09-04, see the prompt below for how
  each is handled: pre-1996 insurance record (Ks) excluded from MVP
  entirely; wage growth default is a conservative 3 to 4 percent, with
  recent actuals and forecasts around 7 percent shown only as cited
  context, not the default; retirement age input is a 65 to 70 slider,
  deferral only, no early retirement; this build is 1st pillar only, with
  2nd and 3rd pillar explicitly signposted as future work.

  Prompt: "Build a personal 1st-pillar (\"Mana pensija\") pension
  calculator for manikalkulatori.lv (Next.js, Supabase, Vercel), matching
  the site's existing 'show your work' pattern established by the
  dzimstības kalkulators.

  Before writing any code: inspect the existing dzimstības kalkulators end
  to end first, its route structure, its data file format (how it stores
  sourced numbers with URL and retrieval date), its content and drift test
  setup, and its component and copy organization. Mirror those
  conventions exactly rather than inventing new ones. If any convention is
  ambiguous or inconsistent, stop and ask me rather than guessing.

  Route and page structure: follow the dzimstības kalkulators's existing
  pattern section for section, inputs, result, methodology, limitations,
  sources, FAQ. Use the same route naming convention that calculator uses,
  inspect it, don't assume a slug.

  MVP scope is 1st pillar only. Do not build 2nd pillar or 3rd pillar
  modules in this session, even though some of their numbers are well
  sourced (see the defaults doc), that is out of scope. In the limitations
  and FAQ section, explicitly signpost that 2nd pillar and 3rd pillar
  calculators are planned as future additions, so their absence reads as
  a stated scope decision, not a silent gap.

  Inputs: birth year (or current age); current gross salary (monthly or
  annual, match the site's existing input convention); existing insurance
  record (apdrošināšanas stāžs) in years, scoped to record earned since
  1996 only (see Ks note below); a wage growth assumption slider or field
  defaulting to a conservative long run value in the 3 to 4 percent
  nominal range (pick one default, for example 3.5 percent, cited as an
  assumption not a fact), with the sourced recent actual (7.7 percent in
  2025) and forecast (about 7 percent for 2026) shown nearby as cited
  reference context, clearly labeled as short term figures not to be
  extrapolated across a 30 plus year projection, and not used as the
  default; planned retirement age as a slider from 65 to 70 only (general
  old age pension is not available before 65 under current law, do not
  model early retirement in this MVP). Moving the retirement age slider
  must visibly recompute G from the cited VSAA table and recompute the
  resulting pension live.

  Ks and pre-1996 insurance record: exclude the pre-1996 Ks calculation
  entirely from MVP. Scope the existing insurance record input to years
  earned since 1996 (K only, no Ks term). If a user's birth year implies
  likely pre-1996 work history (for example born before about 1978), show
  a visible, specific limitation note near the result explaining that
  pre-1996 record is excluded and their real pension will be higher than
  this estimate, this must be an explicit, visible caveat tied to the
  actual math shown, not a generic disclaimer.

  Output: show the estimated monthly 1st pillar pension with the
  arithmetic visible, not a black box, P per month equals K divided by G
  divided by 12. Show the running numbers, accumulated indexed capital K,
  the G value used and the retirement age that produced it, and the
  resulting monthly figure. When the retirement age slider moves, visibly
  show both the new G and the recomputed P.

  Data discipline, hard rule: every number in visible copy, every default,
  rate, or FAQ claim, must trace to a row in a cited data file with an
  explicit source URL and retrieval date, in whatever format the
  dzimstības kalkulators already established, inspect it first. Use
  exactly these verified values, retrieved 2026-09-04, do not re-derive
  or re-guess:

  Retirement age 65, minimum insurance record 20 years, source
  https://lvportals.lv/e-konsultacijas/38466-pensijas-vecums-ir-65-gadi-iesniegumu-var-iesniegt-vienu-menesi-pirms-dosanas-pensija-2026

  VSAOI total 34.09 percent (23.59 percent employer plus 10.50 percent
  employee), sources
  https://gramatvedisriga.lv/lv/blog/vsaoi-rates-2026 and
  https://www.vsaa.gov.lv/en/contributions-0

  Pension contribution split: 15 percent to 1st pillar and 5 percent to
  2nd pillar out of 20 percent total, changed from the historical 14
  percent and 6 percent since 2025, upheld by the Constitutional Court
  2026-06-18, framed as a temporary about 4 year measure with no
  confirmed reversion date, flag this as a temporary rate in the
  methodology and limitations copy, sources
  https://www.lsm.lv/raksts/zinas/ekonomika/04.12.2024-1-no-pensiju-otra-limena-iemaksam-parnesis-uz-pirmo-limeni.a578779/
  and
  https://www.lsm.lv/raksts/zinas/ekonomika/18.06.2026-tiesa-pensiju-2-limena-iemaksu-likmes-termineta-samazinasana-par-vienu-procentpunktu-atbilst-satversmei.a651990/

  Coefficient G, effective from 2026-01-01: age 65 equals 17.76, 66
  equals 17.09, 67 equals 16.41, 68 equals 15.74, 69 equals 15.07, 70
  equals 14.39, pull the full 40 to 90 table from
  claude/pension-calculator-defaults-2026.md in this project, source
  https://www.vsaa.gov.lv/lv/media/5322/download

  Insurance wage index for capital indexation, latest published single
  year value: 1.1041 for 2023 contributions, VSAA has not yet published a
  2024 or 2025 index, normal 1 to 2 year lag, use the latest published
  value and note the lag, do not fabricate a placeholder, source
  https://www.vsaa.gov.lv/lv/media/7364/download?attachment=

  Recent wage growth context only, not the default: 2025 actual 7.7
  percent to 1815 euro per month average gross wage, source
  https://www.csp.gov.lv/lv/jaunums/2025-gada-videjais-atalgojums-pirms-nodoklu-nomaksas-1-815-eiro
  ; 2026 bank consensus forecast about 7 percent, source
  https://www.apollo.lv/8387615/banku-analitiki-2026-gada-latvija-gaida-darba-samaksas-kapumu-par-videji-apmeram-7

  Out of scope, do not pull in: 3rd pillar tax relief details and 2nd
  pillar historical return ranges, both deferred to a future session.

  Copy rules, hard rule: no dashes or hyphens anywhere in visible Latvian
  strings, not in body copy, FAQ, tooltips, chart labels, or number
  ranges (write 'no 1996. līdz 1999. gadam' instead of '1996.–1999.', 'no
  65 līdz 70 gadiem' instead of '65-70'). Applies to every visible string
  in every component. Copy must read as genuinely written prose matching
  the site's voice, not templated, no repeated sentence skeletons across
  FAQ entries.

  Limitations section must explicitly cover: the pre-1996 record
  exclusion, restated plainly, not just inline; the minimum pension
  guarantee mechanism is not modeled; today's G is used as an
  approximation for a future, unknowable G, it has both risen and fallen
  historically, including a Covid era drop; the result is pre income tax;
  the 15 percent and 5 percent split is temporary and not assumed to
  hold for the user's whole working life.

  Test coverage: content and copy drift tests must cover the interactive
  React component's own inline copy, not only an external content file,
  inspect and match the existing test pattern; any staleness or date
  comparison must use full commit timestamps, not day truncated dates, to
  avoid timezone or midnight off by one errors; add a check that greps
  rendered methodology, limitations, sources, and FAQ sections for non
  empty content, the last calculator shipped with an unpopulated module,
  this must not happen again silently; add a check that every numeric
  claim in visible copy has a corresponding cited data file row, flagging
  any that doesn't.

  Apply throughout, not just at the end: anything the page promises in its
  own copy must actually work; any provisional or temporary figure,
  especially the 15 percent and 5 percent split, must be visibly labeled
  as such in the copy itself, not just in a code comment; the sources
  section is load bearing, not decoration, assume every figure will be
  fact checked in public.

  Operating rules: stop and wait for my approval at each checkpoint,
  suggested checkpoints are (1) data file plus page skeleton and routing,
  (2) input UI plus live calculation logic, (3) methodology, limitations,
  sources, and FAQ content plus the tests above, (4) final QA pass, do not
  collapse or skip checkpoints; no nested subagents; one verification pass
  per unit of work, not batched at the end; the test suite is the sole
  source of truth for whether something works; leave a clean state at the
  end of every turn; report concisely, what changed, what passed, what's
  still open, no padding."

## Done

- 2026-09-04: Sabiedrība category, iedzivotaju-skaits-latvija,
  dzimstibas-kalkulators, and a three page novads pilot (Daugavpils, Jelgava,
  Varakļāni). Data verified against CSP IRS010, IRS031 and IDK010. Chart and
  accessible table shipped. Small area threshold set at 10 000 residents,
  below which derived figures are suppressed. Indexing requested. Closed.
  Out of scope from this date: copy polish, new modules, design revisions,
  additional calculation modes.
