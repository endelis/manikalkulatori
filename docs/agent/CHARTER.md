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
4. Use `WebSearch`/`WebFetch` to sanity-check a slug, a competitor's
   coverage, or a figure before building. Ahrefs MCP tools are attached
   but plan-gated (`"Insufficient plan"` on every endpoint as of
   2026-09-10) — do not rely on them until the spec's open item to
   revisit the plan tier is resolved.
5. Any change to a calculator's rendered numbers or copy must bump that
   calculator's `contentUpdatedAt` in `lib/registry.ts` in the same
   commit, per `CLAUDE.md`'s "Sitemap dates" rule. The pre-push
   checklist below re-checks this via the drift test.
6. Any visible Latvian copy written (FAQ content, calculator copy,
   metadata) must follow `CLAUDE.md`'s dash/hyphen ban (no em dash, en
   dash, or hyphen-minus used as punctuation — see that section for the
   rephrasing-first rule and `formatSignedNumber` for negative numbers)
   and `DESIGN-GUIDANCE.md` section 11's voice rules. Both are binding,
   not optional style advice.

Commit, push, and merge directly for all of the above. No PR gate.

## Gated: stop and flag instead of acting

1. Anything needing a real external account or credential (AdSense,
   affiliate program signup, DNS, payment).
2. Anything that spends money.
3. Any YMYL figure (tax rate, grant amount, insurer price) not sourced
   from an official reference — ask rather than guess, per
   `PROJECT-OVERVIEW.md` section 10 ("YMYL caution"; section 9 is a
   one-time bootstrap prompt, not standing policy). "Sourced from an
   official reference" means: fetched directly from an acceptable
   primary source (e.g. vid.gov.lv, likumi.lv, csp.gov.lv, or the
   issuing ministry/agency's own site), not merely turned up by it. A
   `WebSearch`/`WebFetch` result is never sufficient on its own to
   satisfy this bar — it can point at where to look, but the agent must
   fetch and read the primary source itself, then record that source's
   URL and the retrieval date alongside the figure. If no acceptable
   primary source can be fetched, treat the figure as unsourced and
   gate it.
4. Monetization groundwork of any kind. Per `DESIGN-GUIDANCE.md` section
   8, no `AdSlot` component and no ad/affiliate element are built in
   this phase — monetization is deferred to month 3. The reserved-height
   gaps already in `CalculatorShell` stay empty; do not fill them, and
   do not add a new component for this purpose. (This was tried once
   and deliberately reverted — see
   `docs/superpowers/plans/2026-08-22-instrument-panel-redesign.md`
   Task 5 — because a scaffold that exists "unwired" is still a
   monetization decision made without the user.)
5. Editing the legal pages: `app/privatuma-politika/`, `app/noteikumi/`,
   `app/kontakti/`, `app/par-mums/`. Legal/GDPR consequence, not the
   agent's call.
6. Touching cookie-consent or analytics wiring: `lib/cookieConsent.ts`,
   `components/CookieBanner.tsx`, `components/GoogleAnalytics.tsx`.
7. Changing the slug of an already-published calculator in
   `lib/registry.ts` — breaks live indexed URLs, no redirect story.
8. Deleting or bulk-rewriting existing shipped content.

When gated, write a `BLOCKED` entry in `JOURNAL.md` (see
`docs/agent/JOURNAL.md`) describing exactly what decision or access is
needed, then send a push notification if the `PushNotification` tool is
available, then schedule a longer next wake (60+ minutes) rather than
retrying the same blocked work immediately.

## Stop conditions

Halt and journal a `BLOCKED` entry instead of proceeding if any of:

- `git status` is not clean at the start of a cycle.
- `git push` is rejected, or master has diverged from what this cycle
  branched from.
- The same blocker has appeared in the last three journal entries —
  back off and stop rescheduling rather than retry forever.
- A single cycle would touch more than one calculator's worth of files.
  Keep changes small; split into separate cycles instead.

Kill switch: at the start of every cycle, check whether
`docs/agent/STOP` exists. If it does, journal that the loop is stopping
(why: the stop file was found) and do not call `ScheduleWakeup` again.
This lets the user halt an unattended loop by committing one empty
file.

## Deploy consequence

Vercel deploys on push to master. Pushing is going live, and since
there is no PR gate for autonomous commits, the checklist below is the
only gate that exists — it must match what CI (`.github/workflows/pr-checks.yml`)
would otherwise have caught. Before every push, run in full, every
cycle:

1. `npx tsc --noEmit`
2. `npm run build`
3. `npm test` (the full suite, not scoped to the touched files)
4. If a calculator's rendered numbers or copy changed, confirm
   `contentUpdatedAt` was bumped in `lib/registry.ts` — `npm test`
   above includes `lib/calculatorContentDrift.test.ts`, which fails if
   it wasn't.

If any of these fail and can't be made to pass within the cycle, do not
push. Journal the blocker as above instead.

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
   If `ScheduleWakeup` is unavailable, the call fails, or the literal
   prompt string doesn't behave as expected, do not go quiet with no
   record: journal that the loop has stopped and why, and send a push
   notification if the `PushNotification` tool is available.
