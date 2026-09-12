# Pension & retirement savings — topical authority content plan

Companion to `PROJECT-OVERVIEW.md` and `DESIGN-GUIDANCE.md`. This is a content
strategy plan, not a code implementation plan — it defines what to build and why;
implementation follows the normal calculator/content workflow once approved.

**Status (2026-09-12): the pillar and almost the entire cluster are live.**
Built and shipped: the hub (`pensija-latvija-celvedis`), `pensijas-kalkulators`
(enhanced), both articles 1 and 2 (`minimala-pensija`, `videja-pensija-latvija`
— the latter's "needs sourcing" line below is now resolved, see its own
sourcing note), calculator 3 (`pensiju-3-limena-kalkulators`), calculator 5
(`priekslaicigas-pensijas-kalkulators`) plus its comparison article
(`priekslaicigas-vs-standarta-pensija`), calculator 6
(`ieguldijumu-konta-nodoklu-kalkulators`) plus its companion article
(`etf-pamati-pensijas-uzkrajumam`), article 3 (`izdienas-pensija`), and
article 6 (`ka-izveleties-pensiju-3-limena-planu`). All wired into the hub
with bidirectional links, matching section 2's architecture.

Still open: calculator 2 (2nd-level fund projection) remains genuinely
BLOCKED on sourcing — fund-return data by risk category lives behind a
JavaScript SPA that loads asynchronously (manapensija.lv's plan-comparison
tool), confirmed unreachable by two independent attempts; needs either a
headless-browser-capable tool or a user-supplied export. Calculator 4 (the
combined all-3-levels calculator) is the only remaining not-blocked, not-yet-
built item — deliberately deferred rather than shipped with the 2nd level
missing, since a "total pension" tool quietly omitting a mandatory third of
most people's pension would read as incomplete or misleading. Article 4
(`pensiju-2-vs-3-limenis`) and article 5 (`ka-izveleties-pensiju-2-limena-
planu`) are both built and wired into the hub; neither needed the blocked
numeric fund-return data. Article 9 (coefficient G history) stays
deprioritized per its own note below.

One implementation deviation from section 5's original architecture, noted
for accuracy: article body copy ended up living as JSX directly in
`lib/articleContent.tsx` (matching the existing `explanations`/
`sourcesContent` convention for calculators in `app/[category]/[calculator]/
page.tsx`), not as `content/articles/<slug>.md` markdown files as originally
planned. This keeps one authoring convention across the whole codebase rather
than two, and was a reasonable call made during implementation, not an
oversight.

## 1. Why pension, not generic "investing"

The original idea was a general investing content push. Real keyword data
(Ahrefs free keyword generator, 2026-09-11) changed the recommendation:

- Generic investing terms ("ieguldījumi", "ieguldīšana iesācējiem", most ETF
  ticker/fund-name searches) are almost all `<100` monthly volume in Latvian —
  a genuinely small topic in this language, not just a competitive one.
- Pension terms are an order of magnitude bigger: `pensija` and `mana pensija`
  are both `>1000` volume at Easy difficulty, with a large real cluster around
  them (`prognozējamā pensija`, `priekšlaicīga pensija`, `minimālā pensija`,
  `vidējā pensija latvijā`, `izdienas pensija`, and literally `mana pensija
  kalkulators`).
- The site already has one well-built, well-sourced calculator in this space
  (`pensijas-kalkulators`, 1st-level state pension) that isn't yet using most
  of this vocabulary in its keywords/FAQ — the cheapest possible starting move.

**Pillar topic: "Pensijas un ilgtermiņa uzkrājumi Latvijā"** (pensions and
long-term savings in Latvia). This subsumes the investing angle rather than
dropping it: the two places investing content actually has real search
demand in this session's research were both retirement-adjacent (2nd/3rd
pension level fund choice, and ETF/investment-account tax treatment as a
long-term savings vehicle) — so investing content stays in scope, but framed
as "how to grow retirement savings," which is where the real searches are,
not generic "how to invest" content competing with bank blogs.

## 2. Content architecture: pillar + cluster

One pillar/hub page links down to every calculator and article below;
every calculator/article links back up to the pillar and sideways to 2-3
related pieces. This reuses the `RelatedCalculators` pattern (extended to
also list articles — see section 5) rather than inventing a new linking
mechanism.

```
Pillar: "Pensija Latvijā: pilns ceļvedis" (hub page, links to everything below)
├── 1. līmenis
│   ├── [calculator, EXISTING] pensijas-kalkulators
│   └── [article] Minimālā pensija Latvijā
│   └── [article] Vidējā pensija Latvijā
├── 2. līmenis
│   ├── [calculator, NEW] 2. līmeņa pensijas kalkulators
│   └── [article] Kā izvēlēties pensiju 2. līmeņa ieguldījumu plānu
├── 3. līmenis
│   ├── [calculator, NEW] 3. līmeņa pensijas kalkulators
│   └── [article] Kā izvēlēties pensiju 3. līmeņa plānu
├── Salīdzinājumi un kopskats
│   ├── [calculator, NEW] Kopējās pensijas kalkulators (visi 3 līmeņi)
│   ├── [calculator, NEW] Priekšlaicīgas pensionēšanās kalkulators
│   └── [article] Pensiju 2. vs 3. līmenis: atšķirības un kā izvēlēties
├── Ilgtermiņa uzkrājumi un ieguldīšana pensijai
│   ├── [calculator, NEW] Ieguldījumu konta nodokļu kalkulators
│   ├── [article] Ieguldījumu konts: kā tas darbojas un kad izdevīgs
│   └── [article] ETF pamati pensijas uzkrājumam
└── Cita (separate scheme, linked but not part of the 3-level model)
    └── [article] Izdienas pensija
```

Already-live adjacent calculators (`uzkrajumi`, `inflacija`, `iin-kalkulators`)
get their related-links touched up to point into this cluster too — they're
already indexed and topically adjacent, so this is close to free internal
link equity, not new content.

## 3. Calculators (6 total: 1 enhance, 5 new)

Each entry: what it computes, the keyword(s) it targets, and what needs
primary-source verification before shipping (YMYL discipline — no figure
ships without a fetched, dated, cited primary source per `CHARTER.md`'s
gated rule 3).

1. **pensijas-kalkulators (enhance, not rebuild).** Already computes the
   1st-level VSAA formula. Add to keywords/FAQ: `prognozējamā pensija`,
   `priekšlaicīga pensija` (cross-link to the dedicated calculator below,
   don't duplicate the model here), `minimālā pensija`, `vidējā pensija`,
   `mana pensija kalkulators`. No new sourcing needed — this is a metadata/
   FAQ pass like the KASKO/OCTA one, near-zero cost.

2. **2. līmeņa pensijas kalkulators (new).** Projects mandatory 2nd-level
   fund accumulation (5% of gross wage) to retirement given an assumed
   annual return, combinable with the 1st-level result. *Needs sourcing*:
   current average 2nd-level fund returns by risk category (active/balanced/
   conservative) — from Manapensija.lv's public fund data or Latvijas Banka's
   supervisory fund-performance reports, not a guessed average return.

3. **3. līmeņa pensijas kalkulators (new).** Projects voluntary 3rd-level
   contributions plus the IIN tax-relief benefit on those contributions.
   *Needs sourcing*: the exact relief cap (percentage of income and/or
   absolute annual limit) from likumi.lv's IIN law, current for 2026.

4. **Kopējās pensijas kalkulators (new, likely flagship).** Sums all three
   levels into one total projected retirement income — closest exact match
   to the `mana pensija kalkulators` search. Depends on calculators 2 and 3
   existing first (or can inline simplified versions of their logic; decide
   at implementation time based on how much duplication that avoids).

5. **Priekšlaicīgas pensionēšanās kalkulators (new).** Models the payout
   reduction for retiring up to 2 years before standard retirement age — a
   real, distinct option in Latvia's system, not a variant of calculator 1.
   *Needs sourcing*: the exact reduction formula/coefficients from likumi.lv's
   "Valsts pensiju likums."

6. **Ieguldījumu konta nodokļu kalkulators (new).** Models the tax-deferral
   benefit of an `ieguldījumu konts` vs. a regular brokerage account for
   long-term savings — the specific gap identified earlier (every competitor
   found explains this in prose; none let you model your own numbers).
   *Needs sourcing*: exact tax treatment rules from likumi.lv's IIN law
   (capital gains only taxed on withdrawal exceeding contributions, dividend
   treatment nuance already partially confirmed via WebSearch this session
   but needs a direct primary-source fetch before shipping, not a search
   summary).

## 4. Articles (9 total)

Pure informational/FAQ-style content, no calculator attached — each one
should be mineable as 3-5 FAQ-style Q&A entries plus a short body, matching
the depth of an existing calculator's FAQ, not a long-form blog essay. Every
article needs a primary source for any factual figure it states, same
discipline as the calculators.

1. **Minimālā pensija Latvijā** — what it is, current amount, who qualifies.
   Source: VSAA or likumi.lv.
2. **Vidējā pensija Latvijā** — current average, trend context. Source:
   CSP.gov.lv or VSAA's own published statistics.
3. **Izdienas pensija** — separate special-profession pension scheme
   (military, police, etc.), explicitly scoped as *not* part of the 3-level
   model above so readers don't confuse it with calculator 1. Source: the
   relevant separate law (likely "Izdienas pensiju likums" or the specific
   profession's statute).
4. **Pensiju 2. vs 3. līmenis: atšķirības un kā izvēlēties** — comparison,
   links to both level calculators.
5. **Kā izvēlēties pensiju 2. līmeņa ieguldījumu plānu** — risk-tier guidance
   (aktīvais/sabalansētais/konservatīvais). Source: Manapensija.lv's own
   fund-category descriptions.
6. **Kā izvēlēties pensiju 3. līmeņa plānu** — same idea for voluntary
   providers/plans.
7. **ETF pamati pensijas uzkrājumam** — ETF basics, deliberately framed for
   long-term retirement saving, not generic trading — reuses the one piece
   of real (if modest) ETF search volume found (`etf fondi`, Easy difficulty)
   without competing on the saturated generic "how to invest in ETFs" angle.
8. **Ieguldījumu konts: kā tas darbojas un kad izdevīgs** — companion
   explainer to calculator 6.
9. **Koeficienta G izmaiņas pa gadiem** — lowest priority; only worth
   promoting from a FAQ entry (already exists in calculator 1's FAQ) to a
   standalone article if it turns out to have its own real search volume.
   Check before building, don't build speculatively.

## 5. Architecture changes needed

This introduces a genuinely new content type (article, not calculator), so
it needs a small, deliberate extension rather than force-fitting articles
into the calculator model:

- **Registry**: add a `type: 'calculator' | 'article'` discriminant to the
  existing calculator registry (or a parallel `lib/articles.ts` following
  the exact same shape: slug, category, title, h1, intro, metaDescription,
  keywords, contentUpdatedAt) — reuse the existing flat `/category/slug`
  route namespace rather than inventing a separate `/raksti/` tree, so
  `sitemap.ts`, category-page listing, and breadcrumbs keep working with
  minimal new logic, just a branch on `type`.
- **New shared component**: `ArticleShell`, parallel to `CalculatorShell` —
  breadcrumb, H1, intro, body content, sources section, `Faq`, related
  content, no input/result components since there's nothing to calculate.
- **Body content**: follow the existing `content/faq/<slug>.md` convention
  — add `content/articles/<slug>.md` for article body copy, parsed the same
  way `lib/faq.ts` already parses FAQ files.
- **Related content**: `RelatedCalculators` needs to accept a mixed list of
  calculators and articles (both already share slug/category/title/intro
  shape) so a calculator can link to a related article and vice versa —
  likely just a prop-type widening, not a rewrite.
- **Category page**: the card grid built in the light redesign already
  renders from the registry generically; it should show articles alongside
  calculators in the same grid without changes, once the registry carries
  both types.

This is architectural (new content type, shared component, registry
change) by the same classification used for the light redesign — worth a
short implementation plan of its own before building, not ad hoc edits.

## 6. Sourcing checklist (must clear before any figure ships)

| Figure | Needed for | Primary source to fetch directly |
|---|---|---|
| Minimālā pensija amount | Article 1 | VSAA or likumi.lv |
| Vidējā pensija statistic | Article 2 | CSP.gov.lv or VSAA statistics |
| Izdienas pensija rules | Article 3 | The specific governing law |
| 2nd-level fund category returns | Calculator 2 | Manapensija.lv or Latvijas Banka supervisory data |
| 3rd-level IIN relief cap | Calculator 3 | likumi.lv IIN law, current 2026 |
| Early-retirement reduction formula | Calculator 5 | likumi.lv Valsts pensiju likums |
| Ieguldījumu konts tax treatment | Calculator 6, Article 8 | likumi.lv IIN law (direct fetch, not a search summary — this session's WebSearch answer needs re-verification against the actual article text) |

Per `CHARTER.md`'s gated rule: if a primary source can't be fetched cleanly
(the vid.gov.lv navigation-only failure mode, or a truncated likumi.lv fetch,
both hit repeatedly this session), the item stays BLOCKED and gets journaled
rather than shipped on a guessed figure.

## 7. Phasing

Given the stated goal ("100 visitors/month as a good start"), sequence for
fastest realistic signal rather than building everything before anything
ships:

**Phase 1 (highest leverage, lowest cost):** enhance `pensijas-kalkulators`'s
FAQ/keywords (near-zero new work, reuses what's already built) + build the
Kopējās pensijas kalkulators (closest match to the biggest exact-phrase
search) + articles 1 and 2 (minimālā/vidējā pensija — short, single-source,
fast to verify).

**Phase 2:** 2nd and 3rd level calculators individually, their comparison
article (4), and the priekšlaicīga pensionēšanās calculator (5).

**Phase 3:** the investing-adjacent satellite (calculator 6, articles 5, 6,
7, 8) plus the pillar hub page tying the whole cluster together, plus the
related-link touch-up on `uzkrajumi`/`inflacija`/`iin-kalkulators`.

**Phase 4 (ongoing, not a one-time build):** mine new long-tail FAQ entries
from future GSC data as it accumulates on these pages; revisit off-site
outreach (forums, directories — see the earlier research this session) once
there's a genuinely link-worthy cluster to point people at, not before.

## 8. Expectations

The domain is young (indexed since late August 2026) and Ahrefs' "Easy"
difficulty rating is relative to the whole web, not to a new domain
specifically — realistically expect months, not weeks, before ranking
meaningfully on head terms like `pensija` itself. The long-tail cluster
(`prognozējamā pensija`, `priekšlaicīga pensija`, `minimālā pensija`) is the
more plausible near-term win, the same pattern that's already worked for
this site (KASKO/OCTA didn't win on "kasko" itself first, they won on
specific long-tail queries). 100 visitors/month is a realistic 2-4 month
milestone once Phase 1-2 are live and indexed, not an immediate result.
