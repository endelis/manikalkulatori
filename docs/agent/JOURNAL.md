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
