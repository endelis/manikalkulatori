# Autonomous agent journal

Append-only. One dated entry per work cycle, newest at the bottom. New
entries append below the last entry in the file, not below this format
block.

Format:

```
## YYYY-MM-DD HH:MM

Did: <what was built/fixed/changed, with file paths>
Learned: <what worked, what didn't, anything that should change future
  priority or approach>
Next: <what the next cycle should pick up>
```

The heading may be a bare date (`## YYYY-MM-DD`) when no meaningful
time is available, optionally followed by a short parenthetical tag
(e.g. `## YYYY-MM-DD (seed)`) — both are acceptable variants of the
same format, not exceptions to it.

A `BLOCKED` entry uses the same format but starts `Did: BLOCKED —` and
states exactly what decision or access is needed from the user.

---

## 2026-09-10 (seed)

Did: set up this journal and docs/agent/CHARTER.md per
docs/superpowers/specs/2026-09-10-autonomous-agent-design.md.
Learned: Ahrefs MCP tools are attached but return "Insufficient plan"
on every endpoint including the free domain-rating lookup; no separate
GSC/GA connector exists. Research runs on WebSearch/WebFetch only until
that's revisited.
Next: start Wave 1 (auto/home-energy/endurance-sport, P1 first) per
PROJECT-OVERVIEW.md — check lib/registry.ts against the 50-calculator
list to find the first unbuilt P1 slug.

## 2026-09-11 08:15

Did: compared lib/registry.ts against PROJECT-OVERVIEW.md's 50-calculator
list. Found all Wave 1 P1 items already built (auto, home-energy, and
sport categories all have their P1 calculators live, several built well
past the original 50, e.g. majoklis material calculators, pensijas,
tumsas, dzimstibas). Built the next unbuilt P2 item: Peldēšanas CSS
kalkulators (critical swim speed), lib/calculators/peldesanas-css.ts +
.test.ts, components/calculators/PeldesanasCssCalculator.tsx,
content/faq/peldesanas-css.md, registry entries in lib/registry.ts and
components/calculators/registry.tsx, explanations block in
app/[category]/[calculator]/page.tsx. Ran full pre-push checklist
(tsc --noEmit, npm test, npm run build) clean, pushed directly to
master (commits 8a2b497, ff8c44e).
Learned: auto's remaining Wave 1 P2 gaps (uznemuma-auto,
ekspluatacijas-nodoklis) both require Latvian company-car and vehicle
tax figures, YMYL territory needing primary-source fetching per
CHARTER.md's gated rule. Picked the safer sport P2 gap
(peldesanas-css, a fixed public sports formula, no sourcing needed)
for this first-ever live cycle instead, on purpose, since it proves
the full pipeline (build, verify, push, journal, reschedule) without
YMYL risk on the very first run. Also: contentUpdatedAt set before
committing will almost always be stale by a few minutes once the
commit actually lands (git assigns the timestamp at commit time) — the
two-step pattern (commit, then `git log -1 --format=%cI -- <file>`,
then bump and commit again if needed) is the reliable way to satisfy
lib/calculatorContentDrift.test.ts, not a one-shot guess.
Next: build one of the two remaining auto Wave-1 P2 gaps
(uznemuma-auto vs personiskais auto — company vs personal car tax, or
auto ekspluatacijas nodoklis — vehicle operation tax). Both need an
official Latvian source (vid.gov.lv or equivalent) fetched directly
per CHARTER.md's YMYL sourcing rule before any figure is used; if no
acceptable primary source can be fetched and read, gate it and journal
BLOCKED rather than guess.

## 2026-09-11 08:44

Did: BLOCKED — attempted to build auto ekspluatacijas-nodoklis
(vehicle operation tax). Fetched the CO2-band rate table directly from
two primary sources: https://www.csdd.lv/transportlidzeklu-ekspluatacijas-nodoklis-likmes-no-01.01.2021/likme-vieglais-tl-kravas-tl-lidz-3500-kg-pirma-registracija-no-01-01-2021
and https://www.fm.gov.lv/lv/transportlidzekla-ekspluatacijas-nodokla-likmes
(both fetched 2026-09-11). Both agree on the same flat CO2-band table
(0 EUR up to 50 g/km through 834 EUR at 401+ g/km, plus a 330 EUR
surcharge for engine displacement over 3500 cm3 and a 10% discount for
gas-equipped vehicles), for passenger cars first registered from
01.01.2021 under the WLTP CO2 system.
Did NOT ship it: the fm.gov.lv page states it was last updated
29.12.2024 and does not confirm 2026 rates specifically, and an
earlier WebSearch turned up a claim of a distinct CO2-per-tonne
component (10 EUR/tonne in 2025, 20 EUR/tonne in 2026) that neither
primary source's fetched content mentions at all — I cannot rule out
that this changes the effective 2026 amount, and a general search
summary is not sufficient to resolve a conflict between it and two
fetched primary sources. Per CHARTER.md's gated rule 3, shipping a
YMYL tax figure I'm not fully confident is current is worse than not
shipping it.
Learned: for Latvian vehicle/company tax topics specifically, "fetch
the primary source" is necessary but not always sufficient when a
source page doesn't state its own effective year clearly, or when
budget-law changes (mentioned in news/ministry announcements) haven't
propagated into the reference page yet. A WebSearch hit describing a
rate change is a lead to verify, never itself sufficient to overturn
or confirm what a fetched primary source shows.
Next: either (a) the user manually confirms the correct 2026 CO2-per-tonne
mechanism (or its absence) via likumi.lv's actual statute text for
Transportlīdzekļa ekspluatācijas nodokļa likums, which would settle
this decisively, or (b) a future cycle tries likumi.lv directly next
time, since it's the actual codified law text rather than an
agency's summary page. Until then, skip ekspluatacijas-nodoklis and
try the other Wave-1 P2 gap (uznemuma-auto vs personiskais auto) or a
non-YMYL SEO/content-quality task instead.

## 2026-09-11 09:55

Did: resolved last cycle's BLOCKED item. Fetched likumi.lv directly
(the actual statute, Transportlīdzekļa ekspluatācijas nodokļa un
uzņēmumu vieglo transportlīdzekļu nodokļa likums) for both the CO2
rate table (Art. 4) and the surcharge/discount provisions (Art. 4 §7:
330 EUR for engines over 3500 cm3; Art. 7 §5.1: 90% of the total for
gas-equipped vehicles). The statute confirms no per-tonne CO2
component exists and no amendment has changed these rates since
2021-01-01, as of the law's own 2025-11-01 update — resolving the
ambiguity that blocked last cycle. Built the calculator: lib/calculators/ekspluatacijas-nodoklis.ts
+ .test.ts, components/calculators/EkspluatacijasNodoklaCalculator.tsx,
content/faq/ekspluatacijas-nodoklis.md, registry entries in
lib/registry.ts and components/calculators/registry.tsx, explanations
block in app/[category]/[calculator]/page.tsx. Full pre-push checklist
clean, pushed to master (commits 8a8b1cf, e00e809).
Learned: the earlier block was the right call, not overcaution — the
actual statute (likumi.lv) settled a conflict that two agency-summary
pages (csdd.lv, fm.gov.lv) could not, since neither stated its own
effective year clearly. For Latvian tax/legal YMYL figures, likumi.lv
should be the first source tried, not the last, when an agency page's
currency is in doubt. Also: this confirms the CHARTER's gate-first,
verify-before-shipping approach works as intended across two cycles —
worth keeping, not loosening.
Next: check lib/registry.ts against PROJECT-OVERVIEW.md's 50-calculator
list again for the next unbuilt gap. Wave 1 (auto/home-energy/sport)
should now be fully built except uznemuma-auto vs personiskais auto
(company vs personal car tax, auto P2) — likely the next YMYL-gated
candidate; try likumi.lv first this time rather than agency summary
pages, given what worked this cycle. If that's also fully resolved,
move to Wave 2 (health category) or a content-quality/SEO pass on
existing pages.

## 2026-09-11 10:26

Did: built uznemuma-auto-nodoklis (company light vehicle tax, UVTN),
the last auto Wave-1 P2 gap. Went to likumi.lv first this time (per
last cycle's lesson) and it worked cleanly on the first fetch: Art.
10-14 give the full rate structure (flat 15/25 EUR for electric/plug-in
hybrid, power-band rates for other post-2009 vehicles, flat 60 EUR
otherwise), confirmed in force since 2023-07-01 with the next
amendment not until 2027-01-01. Deliberately scoped to the UVTN itself,
not a full "company vs personal" comparison — the employee
benefit-in-kind side is a separate, more complex topic, left
unaddressed rather than guessed at. lib/calculators/uznemuma-auto-nodoklis.ts
+ .test.ts, components/calculators/UznemumaAutoNodoklaCalculator.tsx,
content/faq/uznemuma-auto-nodoklis.md, registry entries, explanations
block. Full checklist clean, pushed (commits fad9cd0, c7d9e48).
Learned: re-verified the full slug list against PROJECT-OVERVIEW.md's
50-calculator list properly this time (not just skimming). Auto (12/12)
and home-energy (8/8) are now fully built. Sport is NOT fully done as
earlier journal entries assumed — 5 of 8 built (skriesanas-temps,
triatlona-planotajs, peldesanas-css, ftp-zonas, sirdsdarbibas-zonas),
missing vo2max (P3), maratona-laika-prognoze (P2), trenina-kalorijas
(P3). Worth double-checking registry against the full list on every
"what's next" check, not just trusting a prior cycle's summary.
Next: build maratona-laika-prognoze (marathon time prediction from a
shorter race result, e.g. Riegel's formula) — pure math, no YMYL
sourcing needed, same safe category as peldesanas-css. After that,
vo2max and trenina-kalorijas (both P3, also non-YMYL) close out sport
and all of Wave 1. Then Wave 2 (health category, 8 calculators).

## 2026-09-11 10:56

Did: built maratona-laika-prognoze (marathon/half-marathon/10K time
predictor). Uses the Riegel formula (T2 = T1 * (D2/D1)^1.06), a
well-established public running-science formula, no external sourcing
needed. Reference distance and time as inputs, radio-select target
distance (10km/half/full), predicted time and pace as outputs.
lib/calculators/maratona-laika-prognoze.ts + .test.ts,
components/calculators/MaratonaLaikaPrognozesCalculator.tsx,
content/faq/maratona-laika-prognoze.md, registry entries, explanations
block. Full checklist clean, pushed (commits 3e7ab69, 6cfa1ca).
Learned: nothing new procedurally — this cycle confirmed the by-now
routine shape (non-YMYL calculator: research formula, mirror an
existing sibling's file pattern, ship in one cycle; contentUpdatedAt
needs the two-step commit-then-bump dance every time, no exception
seen yet).
Next: sport category has 6 of 8 built (skriesanas-temps,
triatlona-planotajs, peldesanas-css, ftp-zonas, sirdsdarbibas-zonas,
maratona-laika-prognoze). Two P3 gaps remain: vo2max (VO2max estimate)
and trenina-kalorijas (workout calorie burn) — both non-YMYL, same
safe pattern. Either finishes Wave 1 entirely. After that: Wave 2
(health category, 8 calculators, per PROJECT-OVERVIEW.md) or a
content-quality/SEO pass on already-shipped pages.

## 2026-09-11 11:25

Did: built vo2max (VO2max estimate from the Cooper 12-minute run
test: VO2max = (distance_m - 504.9) / 44.73). Added generic fitness-band
labels (zems/zemāks nekā vidēji/vidējs/labs/izcils), explicitly stated
in the FAQ as not adjusted for age or sex, to avoid implying more
precision than the formula actually gives. lib/calculators/vo2max.ts +
.test.ts, components/calculators/Vo2maxCalculator.tsx,
content/faq/vo2max.md, registry entries, explanations block. Full
checklist clean, pushed (commits 2684417, 9070b56).
Learned: nothing new — routine non-YMYL cycle, same shape as the last
two.
Next: sport category has 7 of 8 built. Only trenina-kalorijas
(workout calorie burn, P3, non-YMYL) remains to close out Wave 1
entirely (all of auto, home-energy, and sport). After that: Wave 2
(health category, 8 calculators, per PROJECT-OVERVIEW.md) or a
content-quality/SEO pass on already-shipped pages — worth actually
reading PROJECT-OVERVIEW.md's Wave 2 list in full next time rather
than assuming, given the Wave-1-completeness miscount two cycles ago.
