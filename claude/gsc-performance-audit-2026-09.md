# GSC performance audit — 2026-09-06 export

Recurring monthly audit. Re-pull GSC and append a new dated section each month rather than overwriting this one, so trend lines stay visible.

Source: GSC export, filter "Web / Last 3 months," pulled 2026-09-06. Sitewide: 856 impressions, 1 click, avg. position ~47 across the tracked period.

## Read the data with one caveat first

The daily chart is flat zero from the report's start date through 2026-08-29, then impressions begin on 2026-08-30. So despite the "3 months" filter, this is really 6-7 days of real data — the site (or its GSC coverage) is brand new. One click total, sitewide. That means:

- CTR is not a usable signal yet (1 data point). Position is the only signal worth reading.
- Position values built on 5-20 impressions each will move a lot week to week. Treat everything below as directional, not final — re-pull in 4-6 weeks before trusting any position as stable.
- Being on page 4-9 of Google at day 6 against entrenched competitors (insurers, salidzini.lv-type aggregators) is not itself alarming. The question is which pages have a plausible path to page 1 and which don't.

## 1. Is the content the best given these queries?

Splitting the 13 pages with impressions into tiers by position:

### Already close (position <25) — polish, don't rebuild

- `/auto/riepu-izmers` — 36 impr, pos 32 avg but several sub-queries at 18-23 ("riepu izmēra kalkulators" @18, "riepu augstuma kalkulators" @23). Best non-trivial cluster on the site.
- `/auto/cela-izmaksas` — 8 impr, pos 13.25. Low volume but strong position.
- `/auto/degvielas-izmaksas` — 6 impr, pos 7.33. Same pattern — good position, thin volume (query itself may just be low-volume; not a content flag).
- Sabiedrība population pages (Daugavpils, Latvija total, Varakļāni) — 1 impr each, pos 7-8. Excellent position, near-zero volume because these are hyper-specific single-city queries, not because the content is weak.
- "kasko cena kalkulators" (14.5) and "kasko kalkulators" (19.6) as individual queries already sit near page 2 even though the page's average position (39.5) is dragged down by dozens of weaker variants.

### Mid-tier, genuinely contestable (position 30-55)

- `/auto/octa-kalkulators` — 278 impr, pos 44.7, but "octa salīdzinājums" (17.6) and "octa cenu salīdzinājums" (18.9) are much closer to page 1 than the page average suggests.
- `/auto/kasko-kalkulators` — 343 impr (the single biggest impression pool on the site), pos 39.5.

These two carry by far the most search demand (621 of 856 impressions, 73%) and the most realistic near-term upside if content and positioning improve — see §2 below for why they're also the two pages worth scrutinizing hardest before investing more in them as-is.

### Buried despite being legitimately good content (position 65-85)

- `/auto/uzlades-izmaksas` (EV charging cost) — 72 impr, pos 78.8. This is a real, computable calculator (price/kWh × kWh needed) matching real search intent ("elektroauto uzlādes cena" @82, "cik maksā uzlāde" @86) — yet it's on page 8-9. That gap between content quality and position is the clearest sign of an on-page or technical issue (title/H1 not matching the searched phrase, thin body copy, weak internal linking from `/auto`) rather than a content-value issue.
- `/auto/lizings-vs-kredits` — 56 impr, pos 72.4. Same story: real math (loan vs. lease), but "auto līzings vai kredīts" (77.9) and "auto kredīts vai līzings" (78.7) — the exact phrasing people type — sit on page 8, while the looser "kredīts un līzings" (41.2) does noticeably better. Suggests the page isn't using the "X vai Y" phrasing people actually search.

### Not enough data yet

- `/auto/elektroauto-vs-benzina` — 1 impression, pos 10. Too little to read.
- `/auto` category page — 35 impr, pos 68. Expected; category pages rarely outrank their own calculators.

**Bottom line on Q1**: for the calculators that are genuinely computable (tires, fuel, EV charging, lease-vs-loan), content quality isn't obviously the blocker — some of these should be ranking much better than they are and the gap points to on-page/technical fixes and internal linking, not a content rewrite. For kasko/octa, the picture is different — see below.

## 2. Does the content add real value? (KASKO/OCTA test case)

The query list itself is the evidence.

**KASKO (comprehensive/collision insurance) — no.** KASKO pricing in Latvia is set per-insurer from proprietary risk models (car value, driver profile, claims history, chosen deductible/coverage). There is no public tariff table to compute from — which is exactly why the query list is full of insurer-name searches: "gjensidige kasko kalkulators," "kasko kalkulators if," "kasko kalkulators compensa," "kasko bta kalkulators," "ergo kasko kalkulators." People aren't looking for a generic estimate — they're looking for what their specific insurer would charge, or a way to compare real quotes across insurers. A single-formula "KASKO calculator" structurally cannot satisfy that intent, no matter how well it's written. This is very likely why 343 impressions on this page convert to 0 clicks even where position isn't the worst on the site (some sub-queries sit at pos 14-20) — people scan the snippet, recognize it can't give them a real number for their insurer, and don't click, or click and bounce (not visible in this export, but consistent with 0 clicks at position 20).

**OCTA (mandatory third-party liability) — borderline, salvageable.** OCTA base tariffs and risk-class coefficients in Latvia are published by the road traffic bureau (LTAB) and are a matter of public record, unlike KASKO. That means a genuine "show your work" OCTA calculator — citing the actual coefficient table (engine size/power class, driver age and experience, no-claims bonus class, region) — is possible and would match the site's stated model. If the current page instead gives a vague single-number estimate without those cited coefficients, it has the same credibility gap as KASKO, just with a real fix available: source the LTAB coefficients and rebuild the calculation to actually be "show your work," or reposition as "how OCTA pricing works + where to get a real quote" rather than pretending to output your policy price.

The rest of the auto calculators are the opposite case — riepu izmērs (tire size is literal manufacturer spec/geometry), degvielas izmaksas and uzlades izmaksas (price/unit × consumption is real arithmetic with cited public prices), lizings-vs-kredits (loan amortization vs. lease terms is standard finance math with cited market rates), cela izmaksas — all of these have a legitimate public data source and a defensible formula. They fit the site's premise. KASKO doesn't, and OCTA needed verification.

### Update, 2026-09-06: OCTA verification result

Researched whether LTAB (Latvijas Transportlīdzekļu apdrošinātāju birojs) or any regulator publishes a citable OCTA base-tariff/coefficient table. **It does not, and OCTA turns out to be the same situation as KASKO, not a different one.**

Confirmed via the actual governing law (*Sauszemes transportlīdzekļu īpašnieku civiltiesiskās atbildības obligātās apdrošināšanas likums*, [likumi.lv/ta/id/87547](https://likumi.lv/ta/id/87547-sauszemes-transportlidzeklu-ipasnieku-civiltiesiskas-atbildibas-obligatas-apdrosinasanas-likums)), Article 12(1): *"Apdrošināšanas prēmijas apmēru nosaka apdrošinātājs, ievērojot transportlīdzekļa veidu, lietošanas mērķi un citus risku ietekmējošus faktorus"* — the insurer sets the premium, not the state. OCTA is a free market. LTAB's actual role is claims handling, the Guarantee Fund (compensates victims of uninsured/unidentified vehicles), and maintaining the shared Bonus-Malus (no-claims) class history across insurers — it does not publish pricing coefficients. Bonus-Malus *class assignment* is standardized via a shared LTAB formula, but each insurer applies its own proprietary multiplier per class, and its own scales for engine power, driver age, experience, region, and vehicle age. Nothing published by a government body, LTAB, or Latvijas Vēstnesis/likumi.lv gives those multipliers — everything describing "what affects your OCTA price" on insurer or aggregator sites is marketing copy, not a citable table.

One genuine, citable fact does exist: Article 15(1) sets statutory minimum coverage limits insurers must provide — up to €6,450,000 for personal injury and up to €1,300,000 for property damage, per claim. Real, current, and worth stating on an explainer page, just not a price.

**Revised recommendation**: reposition OCTA the same way as KASKO, not differently. A coefficient-based "compute your OCTA price" tool would be fabricating numbers no regulator or insurer publishes.

## Staged improvement plan

**Stage 0 — Decide the KASKO/OCTA question (this week, no code)**
Resolved 2026-09-06: LTAB does not publish citable OCTA coefficients (see update above), so OCTA needs the same treatment as KASKO, not a rebuild. Decisions made:
- **KASKO**: rebuild as a buyer's guide. Sunset the "calculator" framing entirely, replace it with what drives KASKO price, deductible tradeoffs, which insurers to compare, cited industry ranges. Keep the URL, redirect/merge content so impressions aren't wasted.
- **OCTA**: same as KASKO — rebuild as a buyer's guide. Sunset the "calculator" framing, replace it with OCTA mechanics (mandatory coverage, insurer-set pricing, Bonus-Malus class history via LTAB, the Guarantee Fund, the statutory coverage limits: €6.45M injury / €1.3M property per claim). Keep the URL, redirect/merge content.

Both decisions finalized 2026-09-06. Execution starts at Stage 1.

**Stage 1 — Fix the two highest-demand pages (kasko, octa)**
Once Stage 0 is decided: rebuild OCTA's calculation on cited LTAB coefficients if available; rewrite KASKO per the chosen option above. Add FAQ sections addressing the named-insurer queries directly ("Vai KASKO cena atšķiras starp BTA, Gjensidige, If, Compensa, ERGO?" etc.) even if the honest answer is "yes, significantly, here's why" — this matches real search intent and is legitimate content, not keyword stuffing. This pair alone represents 73% of tracked impressions, so it's the highest-leverage single change on the site.

**Stage 2 — Rescue the buried-but-legitimate calculators**
`/auto/uzlades-izmaksas` and `/auto/lizings-vs-kredits`: audit title tag, H1, and first-paragraph copy against the exact phrasing people search ("elektroauto uzlādes cena," "auto līzings vai kredīts") — these look like on-page targeting gaps, not content gaps. Add/strengthen internal links from `/auto` and from related calculators (e.g., link uzlades-izmaksas from elektroauto-vs-benzina and vice versa). Check indexation/crawl date — if these are recently published, some of the position gap may just be a new-page ranking delay that closes on its own in 4-8 weeks.

**Stage 3 — Push the near-page-1 cluster over the line**
`/auto/riepu-izmers` is the best-performing genuine calculator on the site. Small effort here (expand FAQ, add a couple more tire-size edge cases, get an internal link or two from higher-traffic pages once kasko/octa are fixed) could realistically reach page 1 sooner than any other page.

**Stage 4 — Scale the proven low-competition template**
The Sabiedrība population pages (Daugavpils, Latvija, Varakļāni) rank position 7-8 with almost no content investment and no competition — this is the cheapest win visible in the whole dataset. Template is validated; the fix is coverage, not quality. Generating equivalent pages for more Latvian pilsētas/novadi is a pure volume play with a proven per-page template, likely the best effort-to-result ratio in this plan even though absolute traffic per page is small.

**Stage 5 — Hold and re-measure**
`/auto/degvielas-izmaksas`, `/auto/cela-izmaksas`, `/auto/elektroauto-vs-benzina`: already positioned well, too little data to act on. No changes — re-pull GSC in 4-6 weeks and revisit.

## One more thing worth noting

`/auto/ekii-atbalsts` is the only page with a click at all (18 impr, pos 49.4, 5.6% CTR) despite a worse average position than kasko/octa. Whatever title/meta description is on that page is working — worth checking what it says and applying the same title-writing approach (specific, benefit-forward) to the kasko/octa rewrites in Stage 1.
