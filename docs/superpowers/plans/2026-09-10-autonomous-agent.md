# Autonomous Growth Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the standing charter, journal, and self-paced loop that let an autonomous agent execute the existing `PROJECT-OVERVIEW.md` build strategy on this repo unattended.

**Architecture:** Two new markdown files under `docs/agent/` (`CHARTER.md`: standing instructions read every cycle; `JOURNAL.md`: append-only dated learning log) plus one `CLAUDE.md` MAP line pointing to them, then a final task that starts the `loop` skill in autonomous self-paced mode with a prompt that references the charter.

**Tech Stack:** Markdown docs, git, the `loop` skill (`ScheduleWakeup`, dynamic self-paced mode).

**Spec:** `docs/superpowers/specs/2026-09-10-autonomous-agent-design.md`

## Global Constraints

- Every cycle must reach a clean `npm run build` (and relevant tests) before pushing; Vercel deploys on push to master, so pushing is going live. (spec: "Deploy consequence")
- Gated, must stop and flag rather than act: any external account/credential, anything spending money, any YMYL figure not sourced from an official reference. (spec: CHARTER component)
- No PR gate for code — commit, push, and merge directly. (spec: CHARTER component)
- External research uses `WebSearch`/`WebFetch` only for now (Ahrefs is plan-gated); findings are directional, recorded as such in `JOURNAL.md`. (spec: "External research")
- Follow `CLAUDE.md`'s small-change protocol and existing efficiency-workflow memory for work that fits it; full exploration still applies to genuinely new features. (spec: CHARTER component)
- Visible Latvian copy the agent writes must follow `CLAUDE.md`'s dash/hyphen ban and `DESIGN-GUIDANCE.md` section 11's voice rules.

---

### Task 1: Create `docs/agent/CHARTER.md`

**Files:**
- Create: `docs/agent/CHARTER.md`

**Interfaces:**
- Consumes: nothing (this is the first file).
- Produces: the standing-instructions document that every future loop cycle (Task 4 onward) reads before doing work. Later tasks and future agent cycles reference it by path `docs/agent/CHARTER.md`.

- [ ] **Step 1: Write the file**

```markdown
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
```

- [ ] **Step 2: Verify it reads correctly**

Read the file back and confirm every section referenced in the spec's
"CHARTER.md" component is present: mission, allowed-autonomously,
gated, deploy consequence, efficiency, end-of-cycle. Confirm no
placeholder text (`TBD`, `TODO`) is present.

- [ ] **Step 3: Commit**

```bash
git add docs/agent/CHARTER.md
git commit -m "docs: add autonomous agent charter

Standing instructions read every loop cycle: mission, autonomy
boundaries, deploy consequence, and end-of-cycle protocol, per
docs/superpowers/specs/2026-09-10-autonomous-agent-design.md.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Create `docs/agent/JOURNAL.md`

**Files:**
- Create: `docs/agent/JOURNAL.md`

**Interfaces:**
- Consumes: nothing directly, but its format must match what `CHARTER.md`'s "End of cycle" section (Task 1) tells future cycles to write into it.
- Produces: the append-only log. Later tasks (Task 4) instruct the loop to append here every cycle in this exact entry format.

- [ ] **Step 1: Write the file with a format header and a seed entry**

```markdown
# Autonomous agent journal

Append-only. One dated entry per work cycle, newest at the bottom.
Format:

```
## YYYY-MM-DD HH:MM

Did: <what was built/fixed/changed, with file paths>
Learned: <what worked, what didn't, anything that should change future
  priority or approach>
Next: <what the next cycle should pick up>
```

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
```

- [ ] **Step 2: Verify it reads correctly**

Read the file back and confirm the format block and seed entry are
both present and the seed entry's "Next" line names a concrete,
actionable first task for Task 4 to pick up.

- [ ] **Step 3: Commit**

```bash
git add docs/agent/JOURNAL.md
git commit -m "docs: add autonomous agent journal with seed entry

Append-only learning log the loop writes to every cycle; seeded with
today's setup entry and the Wave 1 starting point.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: Point `CLAUDE.md`'s MAP at the new docs

**Files:**
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing consumed by later tasks; this is purely discoverability so a future session (autonomous or interactive) operating under the small-change protocol finds `docs/agent/` without a repo-wide search.

- [ ] **Step 1: Add one line to the MAP section**

Add this line to the bulleted list in the `## MAP` section of
`CLAUDE.md`, alongside the other one-line pointers (e.g. near the
sitemap/robots line):

```
- Autonomous agent standing instructions and work log: `docs/agent/CHARTER.md`, `docs/agent/JOURNAL.md`. Design: `docs/superpowers/specs/2026-09-10-autonomous-agent-design.md`.
```

- [ ] **Step 2: Verify**

Read `CLAUDE.md` back and confirm the new line sits inside the `## MAP`
bulleted list (not inside "Small change protocol" or any other
section), and that the rest of the file is unchanged.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: point CLAUDE.md MAP at the autonomous agent docs

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: Start the self-paced autonomous loop

**Files:**
- None created or modified — this task invokes a skill and a tool, it does not touch the filesystem beyond what the loop's first cycle does on its own.

**Interfaces:**
- Consumes: `docs/agent/CHARTER.md` (Task 1) and `docs/agent/JOURNAL.md` (Task 2's seed "Next" line) as the loop's own inputs.
- Produces: an active `ScheduleWakeup` registration for this session, running the `loop` skill in autonomous dynamic mode.

- [ ] **Step 1: Invoke the loop skill in autonomous mode**

Call the `Skill` tool with `skill: "loop"` and no interval — autonomous,
self-paced mode — so it establishes the recurring pattern. If the skill
asks for the recurring instruction, supply:

```
Read docs/agent/CHARTER.md, then the last few entries of
docs/agent/JOURNAL.md for continuity. Do one work unit from the current
wave (per CHARTER.md's "Allowed autonomously" and "Mission" sections).
Verify per CHARTER.md's "Deploy consequence" section before pushing.
Append a journal entry per CHARTER.md's "End of cycle" section, then
self-schedule the next wake per that same section.
```

- [ ] **Step 2: Confirm the first wakeup is scheduled**

Use `ScheduleWakeup` with `action` semantics as directed by the loop
skill's own instructions (the loop skill drives this call directly;
this step is confirming it happened, not calling it a second time).
Check the tool's response confirms a delay and reason were recorded.

- [ ] **Step 3: Report to the user**

State in chat: the loop is running, its first wake delay and reason,
and where to look for progress (`docs/agent/JOURNAL.md`, `git log`).
No commit for this task — nothing new is added to the working tree.

---

## Self-review notes

- Spec coverage: CHARTER.md content (Task 1) covers every bullet in the
  spec's "CHARTER.md" component. JOURNAL.md (Task 2) matches the spec's
  format description. CLAUDE.md MAP pointer (Task 3) satisfies the
  project's own MAP-driven discoverability convention. Loop start
  (Task 4) satisfies the spec's "Loop mechanism" component. Remote
  Control push notifications and the Ahrefs plan upgrade are the user's
  own actions per the spec's "Open items" and are not implementation
  tasks here.
- No placeholders: all four tasks contain literal file content or exact
  tool-call instructions, not descriptions of what to write.
- Type/name consistency: `docs/agent/CHARTER.md` and
  `docs/agent/JOURNAL.md` paths and the journal entry format are
  identical across Tasks 1, 2, and 4.
