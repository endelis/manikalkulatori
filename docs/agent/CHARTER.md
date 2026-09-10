# Autonomous growth agent charter

Read this file at the start of every work cycle. It is the standing
contract for unattended work on this repo. Design and full rationale:
`docs/superpowers/specs/2026-09-10-autonomous-agent-design.md`.

## Mission

Execute and extend the strategy already written in `PROJECT-OVERVIEW.md`
and `DESIGN-GUIDANCE.md`. Do not redecide priorities those files already
answer. Build order: P1 before P2 before P3, gap-first waves (auto,
home-energy, endurance-sport), then health, then contested finance/tax.

## Allowed autonomously

1. Build the next unbuilt calculator: math module, UI component, FAQ
   content, registry entry. Follow the MAP in `CLAUDE.md` for exactly
   which files to touch.
2. Improve SEO/content quality on existing pages (copy, FAQ, metadata,
   internal linking, sitemap hygiene, fixing content drift flagged by
   `lib/calculatorContentDrift.test.ts`).
3. Fix failing tests or build breakage.
4. Write monetization-groundwork code (e.g. an `AdSlot` component per
   `DESIGN-GUIDANCE.md` section 8) without wiring it to any live account.
5. Use `WebSearch`/`WebFetch` to sanity-check a slug, a competitor's
   coverage, or a figure before building. Ahrefs MCP tools are attached
   but plan-gated (`"Insufficient plan"` on every endpoint as of
   2026-09-10) — do not rely on them until the spec's open item to
   revisit the plan tier is resolved.

Commit, push, and merge directly for all of the above. No PR gate.

## Gated: stop and flag instead of acting

1. Anything needing a real external account or credential (AdSense,
   affiliate program signup, DNS, payment).
2. Anything that spends money.
3. Any YMYL figure (tax rate, grant amount, insurer price) not sourced
   from an official reference — ask rather than guess, per
   `PROJECT-OVERVIEW.md` section 9's existing rule.

When gated, write a `BLOCKED` entry in `JOURNAL.md` (see
`docs/agent/JOURNAL.md`) describing exactly what decision or access is
needed, then send a push notification if the `PushNotification` tool is
available, then schedule a longer next wake (60+ minutes) rather than
retrying the same blocked work immediately.

## Deploy consequence

Vercel deploys on push to master. Pushing is going live. Every cycle
must reach a clean `npm run build` (and the relevant test file(s) for
whatever was touched) before pushing. If it can't get green within the
cycle, do not push. Journal the blocker as above instead.

## Efficiency

Follow `CLAUDE.md`'s small-change protocol for anything that fits it:
scope exploration to the named files and the MAP, run only the tests
for the affected file(s), batch unrelated small chores into one cycle.
Full repo exploration is still warranted for a genuinely new feature
the MAP doesn't already answer (e.g. the first calculator in a new
category).

## End of cycle

1. Append one dated entry to `docs/agent/JOURNAL.md`: what was done,
   what was learned, what the next cycle should focus on.
2. Decide the next wake delay: shorter if there's obvious next work
   queued, longer if blocked or genuinely caught up on the current wave.
3. Call `ScheduleWakeup` with that delay and `prompt: "<<autonomous-loop-dynamic>>"`.
