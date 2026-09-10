# Autonomous growth agent — design

Date: 2026-09-10

## Goal

Manikalkulatori.lv is not yet monetized. `PROJECT-OVERVIEW.md` and
`DESIGN-GUIDANCE.md` already define the long-game strategy: a 50-calculator
build order in three gap-first waves, an SEO playbook, YMYL caution, and ads
deferred to month 3. This design sets up a standing, self-paced autonomous
agent that executes and extends that strategy while the user is away,
without inventing a new strategy from scratch.

Not time-bound. No fixed end date, no fixed daily quota. The agent works,
verifies, commits, records what it learned, and decides itself when to work
again.

## Non-goals

- Does not decide the monetization strategy from zero; it executes the one
  already written down and reports findings, it doesn't replace it.
- Does not create or use any external account, spend any money, or activate
  ads/affiliate integrations. Those stay gated behind explicit user action.
- Does not attempt to meter or enforce a hard token/usage budget — no tool
  exposes that. Efficiency is achieved by scoping work tightly per cycle,
  not by tracking a percentage.

## Components

### 1. `docs/agent/CHARTER.md` — standing instructions

Read at the start of every cycle. Contents:

- Mission: execute `PROJECT-OVERVIEW.md`'s build order (P1 before P2 before
  P3, gap-first waves: auto/home-energy/sport, then health, then contested
  finance/tax) and `DESIGN-GUIDANCE.md`'s rules. Those files are the source
  of truth; the agent does not redecide priorities they already answer.
- Allowed autonomously: build the next unbuilt calculator (math + UI + FAQ +
  registry entry, per the MAP in `CLAUDE.md`), improve SEO/content quality
  on existing pages, fix tests/build/content-drift issues, write
  monetization-groundwork code (e.g. an `AdSlot` component per
  DESIGN-GUIDANCE.md section 8) without wiring it to a live account, and
  general-web research (see "External research" below) to sanity-check a
  slug, a competitor's coverage, or a figure before building. Commit, push,
  and merge directly — no PR gate for code.
- Gated, must stop and flag instead of acting: anything needing a real
  external account or credential (AdSense, affiliate program signup, DNS),
  anything that spends money, any YMYL figure (tax rate, grant amount,
  insurer price) it cannot source from an official reference — ask rather
  than guess, per `PROJECT-OVERVIEW.md` section 9's existing rule.
- Deploy consequence: Vercel deploys on push to master, so pushing is going
  live. Every cycle must reach a clean `npm run build` (and relevant tests)
  before pushing. If it can't get green, it does not push broken code; it
  journals the blocker and sends a push notification instead.
- Efficiency: follow the existing small-change protocol in `CLAUDE.md` and
  the user's efficiency-workflow preference (scoped work, `npm run build` as
  the one check, no speculative repo-wide exploration) for anything that
  fits it; full exploration is still warranted for genuinely new features,
  same as today.

### 2. `docs/agent/JOURNAL.md` — append-only learning log

One dated entry per cycle: what was done, what was learned (dead ends,
build failures and their cause, which SEO/content approach to prefer next
time), and what the next cycle should focus on. This is the durable
"learns and improves" mechanism — it survives context compaction and
session restarts, unlike conversation memory, and unlike the user's
personal memory system (which is explicitly for cross-conversation facts
about the user/project, not a rolling work log).

### 3. Loop mechanism

The `loop` skill in autonomous, self-paced mode (`ScheduleWakeup` with a
dynamic delay, no fixed cron): each wake reads `CHARTER.md` and the tail of
`JOURNAL.md`, does one work unit, verifies, commits if green, appends a
journal entry, then schedules its own next wake — sooner if there's obvious
next work, longer if blocked or waiting.

### 4. Resilience to usage limits

Confirmed via the Claude Code guide: there is no automatic resume when a
hard usage limit is hit mid-cycle, and Remote Control push notifications are
not tied to usage limits specifically (they fire when Claude judges
something needs the user, or on requested actions). Given that:

- Every cycle is already a checkpoint: build verified and committed before
  moving on, journal entry written after. A limit hit mid-cycle loses at
  most one unfinished unit of work, never leaves a broken build live.
- The user will enable Remote Control push notifications ("push when Claude
  decides") via `/config` themselves — this is an interactive account-level
  toggle, not something scriptable from here — so a stalled loop has a
  reasonable chance of surfacing to their phone even without limit-specific
  alerting.
- Resuming after a stall is manual (`claude --resume` or messaging the
  session via Remote Control), not automatic. This is accepted, not solved.

### 5. External research

Checked what's actually available: an Ahrefs MCP connection is attached and
does expose real Google Search Console endpoints (`gsc-keywords`,
`gsc-page-history`, `gsc-performance-history`, etc.) plus site-explorer and
keyword-research tools that would directly serve competitor-gap analysis
against kalkulatori.lv and demand validation for new calculators. Every
endpoint, including the free domain-rating lookup, currently returns
`"Insufficient plan"` — this is an Ahrefs plan-tier limit, not a permissions
issue. No separate Google Search Console or Google Analytics connector is
attached at all.

Decision: for now, the agent uses general `WebSearch`/`WebFetch` for
research each cycle where it's relevant — checking what kalkulatori.lv or
other competitors actually show for a target query, sanity-checking keyword
ideas, confirming current tax/grant figures before building a finance
calculator. This has no real search-volume or ranking numbers behind it, so
findings from it are directional, not authoritative, and get recorded in
`JOURNAL.md` as such. Revisit Ahrefs (upgrade + link GSC) once there's
traffic or budget to justify it; when that happens, the CHARTER should be
updated to prefer Ahrefs data over WebSearch impressions for anything it
covers.

## Open items for the user

- Enable Remote Control push notifications via `/config` (their action, not
  this agent's).
- Revisit the Ahrefs plan tier later if real keyword/GSC data becomes worth
  the cost.
