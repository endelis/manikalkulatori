# Autonomous growth agent charter

Read this file at the start of every work cycle. It is the standing
contract for unattended work on this repo. Design and full rationale:
`docs/superpowers/specs/2026-09-10-autonomous-agent-design.md`.

## Mission

Execute and extend the strategy already written in `PROJECT-OVERVIEW.md`
and `DESIGN-GUIDANCE.md`. Do not redecide priorities those files already
answer. Build order: P1 before P2 before P3, gap-first waves (auto,
home-energy, endurance-sport), then health, then contested finance/tax.

One standing exception, per `PROJECT-OVERVIEW.md` section 11
(monetization readiness, added 2026-09-11): build
`patēriņa kredīta kalkulators` (`/finanses/kredita-kalkulators`, item
17) ahead of the rest of the finance category, because a
traffic-independent affiliate program already exists for it. The rest
of finance still waits for its normal place in the wave order.

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
   checklist below re-checks this via the drift test. This includes
   editing another calculator's compute module to export a shared
   helper (e.g. reusing `alga-neto.ts`'s `progressiveIin` in
   `saimnieciska-darbiba.ts`) — the edited file's *own* calculator
   also needs its `contentUpdatedAt` bumped, even though nothing
   visible about it changed, because the drift test compares against
   the file's git commit time, not against whether the change was
   semantically meaningful. Check every calculator file touched in a
   cycle, not just the one being built.
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
   monetization decision made without the user.) This still applies to
   `kredita-kalkulators` (see Mission's standing exception above): build
   the calculator itself freely, but do not add an affiliate link,
   placeholder link, or tracking snippet to it under any circumstances
   until the user hands over a real link from an account they hold —
   an unwired or placeholder affiliate slot is the same "decision made
   without the user" problem `AdSlot` was.
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

The loop has no natural end state — it does not stop itself. The only
two things that end it are: `docs/agent/STOP` existing (kill switch,
below), or the user explicitly saying to stop within the current
session. A hit blocker, a repeated failure, or an interrupted cycle
are never reasons to call `ScheduleWakeup` with `stop: true` — they're
reasons to journal, recover or back off, and reschedule anyway.

Halt the current cycle's work (but still reschedule) if any of:

- `git push` is rejected, or master has diverged from what this cycle
  branched from. Journal a `BLOCKED` entry describing the divergence;
  do not force-push.
- The same blocker has appeared in the last three journal entries —
  back off to a long delay (60+ minutes, capped at `ScheduleWakeup`'s
  3600s maximum) instead of retrying it every cycle, but keep
  rescheduling. If there's other, unblocked work available, do that
  instead of waiting idle on the blocked item.
- A single cycle would touch more than one calculator's worth of files.
  Keep changes small; split into separate cycles instead.

**Recovery from an interrupted cycle:** if `git status` is not clean
at the start of a cycle, this is expected occasionally, not just an
error to halt on — a hard usage-limit cutoff (see "Usage limits"
below) can kill the session mid-write, mid-commit, or mid-checklist,
with no chance to journal what happened. Recover rather than just
block:

1. Run `git status` and `git diff` to see exactly what's uncommitted.
2. If it looks like a finished calculator (all the files a normal
   cycle would produce — compute module, test, component, FAQ, the
   three registry/wiring edits — all present and consistent): finish
   the cycle normally from here — set `contentUpdatedAt`, run the full
   checklist once, commit, push.
3. If it looks partial or broken (some files present, others missing;
   a file half-written; wiring edits referencing a component that was
   never created): discard the uncommitted changes
   (`git checkout -- .` / remove the untracked files), confirm
   `git status` is clean again, and treat the work as not started —
   pick it (or something else) up fresh this cycle or a later one.
4. Either way, journal what was found and which path was taken. This
   is the record a future cycle (or the user) uses to understand what
   the interruption cost, since the interrupted cycle itself couldn't
   journal.

Kill switch: at the start of every cycle, check whether
`docs/agent/STOP` exists. If it does, journal that the loop is stopping
(why: the stop file was found) and do not call `ScheduleWakeup` again.
This lets the user halt an unattended loop by committing one empty
file.

## Usage limits

There is no automatic resume when a hard usage limit is hit mid-cycle
(confirmed: no Claude Code mechanism watches for this or restarts the
session). When it happens, this loop simply goes silent — no journal
entry, no `ScheduleWakeup` call, nothing pushed for whatever was
mid-flight. The user notices this by the loop having gone quiet past
its expected wake time, or via Remote Control push notifications if
they've enabled them, and restarts the session themselves (`claude
--resume` or messaging it via Remote Control) once their usage resets.

This charter's job is to make that restart cheap, not to prevent the
gap: every cycle's checkpoint-before-proceeding discipline (clean git
status checked at cycle start, one calculator's worth of files per
cycle, full checklist before every push) already means a usage-limit
kill loses at most one in-progress calculator, never leaves a broken
build live, and is fully recoverable via the "Recovery from an
interrupted cycle" steps above. On restart, proceed exactly as a
normal cycle start: read this file, check for `docs/agent/STOP`, check
`git status`, recover if needed, continue.

## Deploy consequence

Vercel deploys on push to master. Pushing is going live, and since
there is no PR gate for autonomous commits, the checklist below is the
only gate that exists — it must match what CI (`.github/workflows/pr-checks.yml`)
would otherwise have caught. Before every push, run in full, once:

1. `npx tsc --noEmit`
2. `npm run build`
3. `npm test` (the full suite, not scoped to the touched files)
4. If a calculator's rendered numbers or copy changed, confirm
   `contentUpdatedAt` was bumped in `lib/registry.ts` — `npm test`
   above includes `lib/calculatorContentDrift.test.ts`, which fails if
   it wasn't.

Run this checklist exactly once per push, as the last step before
`git push`, not once per commit within the cycle. A cycle that needs
two commits (e.g. the `contentUpdatedAt` timestamp dance below) still
gets one full checklist run, covering the final state of both commits
together — rerunning the full suite after a one-line follow-up fix is
pure waste, not extra safety.

`contentUpdatedAt` sequencing: fetch the current timestamp
(`date +"%Y-%m-%dT%H:%M:%S%z"`) as the last step before `git commit`
(after all other file edits for this calculator are already done),
not while drafting the registry entry earlier in the cycle. Do not pad
the fetched value forward to try to pre-empt commit latency —
`lib/registry.test.ts` independently requires `contentUpdatedAt` not
be later than wall-clock time when the test itself runs, and a
forward-padded value that looks safe at commit time can overshoot that
check once the test actually executes (this happened: a 45s pad
landed the value in the future relative to the test run and failed
the suite). Use the plain fetched timestamp; typical tool round-trip
lag is small enough (seconds, not minutes) that the commit usually
lands at or after it. Check `git log -1 --format=%cI -- <file>`
against it after the commit, and spend a second fix-commit + scoped
re-verify (`registry.test.ts` and `calculatorContentDrift.test.ts`,
not the full suite) whenever it's behind — that fix-commit uses the
real commit timestamp exactly, not a further guess.

If any of these fail and can't be made to pass within the cycle, do not
push. Journal the blocker as above instead.

## Efficiency

Follow `CLAUDE.md`'s small-change protocol for anything that fits it:
scope exploration to the named files and the MAP, run only the tests
for the affected file(s), batch unrelated small chores into one cycle.
Full repo exploration is still warranted for a genuinely new feature
the MAP doesn't already answer (e.g. the first calculator in a new
category).

Run the deploy checklist once per push, not once per commit (see
"Deploy consequence" above) — this is the single biggest per-cycle
cost and the most common source of duplicated work. Keep commit
messages for routine calculator cycles short (a few lines: what and
why, not a full rationale essay) — the detailed record belongs in the
journal entry, not repeated in every commit message.

## End of cycle

1. Append one dated entry to `docs/agent/JOURNAL.md`: what was done,
   what was learned, what the next cycle should focus on.
2. **If there's a clear next work item and the session is still active
   (this turn hasn't ended), don't call `ScheduleWakeup` at all — go
   straight into the next cycle in the same turn.** `ScheduleWakeup`
   is for resuming a session that has actually gone idle, not a
   mandatory pace-setter between every unit of work. Calling it after
   every single cycle, even with a short delay, ends the turn and
   waits regardless of the delay's length — that is still "stop and
   wait," just not a permanent stop, and it's not what "run
   continuously" means. Chain cycles directly for as long as there's
   real queued work; only stop chaining when genuinely out of clear
   next work, at a natural checkpoint worth surfacing to the user, or
   the turn is actually ending.
3. Only when actually ending the turn: decide the wake delay (shorter
   if there's obvious next work queued, longer if blocked or
   genuinely caught up on the current wave) and call `ScheduleWakeup`
   with that delay and `prompt: "<<autonomous-loop-dynamic>>"`.
   Never call it with `stop: true` — see "Stop conditions" above, this
   loop reschedules unconditionally except for the kill switch or an
   explicit in-session user request. If `ScheduleWakeup` is unavailable,
   the call fails, or the literal prompt string doesn't behave as
   expected, do not go quiet with no record: journal that the loop has
   stopped and why, and send a push notification if the
   `PushNotification` tool is available.
