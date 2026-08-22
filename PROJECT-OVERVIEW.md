# Manikalkulatori.lv — Baltic Calculator Hub

A programmatic SEO project. Each calculator is one indexed page targeting one high‑intent Latvian‑language query. The site earns via display ads and affiliate placements. Goal: positive ROI within 3 months of SEO ramp.

## 1. Concept

A single-domain hub of financial, automotive, endurance, and everyday calculators for the Latvian market, where competition is thin and cost-per-click is meaningful. Every page is static, fast, and self-contained. Users land from search, get their number instantly, and see contextual ads or affiliate links (insurance, leasing, solar, energy, gear).

The moat is language plus locality: Latvian-language calculators for Latvian tax rates, grants (EKII), insurers (BTA, BALTA), and providers, built with genuine first-hand knowledge rather than scraped generic templates.

### Competitive reality and the wedge

The incumbent is kalkulatori.lv: a live, actively maintained hub running since 2017, roughly 40 calculators in Latvian, Russian, and English. A nine-year-old domain carries real authority, and it already owns the generic finance and math queries (salary, VAT, loan, fractions, unit conversions). A frontal fight for the word "kalkulators" against that domain is not winnable early.

The wedge is that its coverage is broad and shallow, with entire high-value categories missing. It has no automotive calculators (no EV vs ICE, KASKO, OCTA, EKII, lease vs loan, fuel cost), no home-energy calculators (no solar payback, heat pump, heating comparison, electricity bill), and no endurance-sport calculators (no pace, triathlon, FTP, heart-rate zones). These are exactly the categories with the highest ad and affiliate value, and they are precisely where first-hand experience (KONA, EKII, SEB leasing, BTA KASKO, triathlon training) produces authentic content that outranks templates.

Strategy: enter through the gaps, not the incumbent's strengths. Build authority in categories where kalkulatori.lv is absent, then expand toward the contested generic queries later, from a position of established authority rather than a standing start. The domain name is broad enough to hold the full 50-calculator hub, but the entry is deliberately narrow.

## 2. Success criteria

1. 50 pages indexed within 6 weeks of launch.
2. First AdSense/affiliate revenue within 8 to 12 weeks.
3. Hosting cost at or near zero (Vercel Hobby tier).
4. Positive monthly ROI (revenue exceeds domain + any incidental cost) by month 3.

## 3. Tech stack

Frontend and framework: Next.js 15 (App Router), TypeScript, static generation (SSG) with selective ISR.
Styling: Tailwind CSS, no component library, custom design tokens.
Data: mostly none. Calculators are pure client-side math. Supabase only if saved-calculation or contact features are added later.
Hosting: Vercel (Hobby tier), git-push deploys, automatic TLS and preview deployments, no server to manage.
Analytics: Vercel Web Analytics (included, privacy-friendly, zero setup) to avoid Google Analytics bloat; revisit Plausible/Umami Cloud later only if deeper funnel analysis is needed.
Monetization: Google AdSense plus affiliate links; later a lightweight ad manager for direct deals.

## 4. Repository shape

```
kalkulators/
  app/
    layout.tsx
    page.tsx                      // hub homepage, category grid
    [category]/
      page.tsx                    // category index
      [calculator]/
        page.tsx                  // individual calculator page
    sitemap.ts
    robots.ts
  components/
    CalculatorShell.tsx           // shared layout, ad slots, breadcrumb
    NumberField.tsx
    ResultCard.tsx
    Breakdown.tsx
    Faq.tsx                       // renders JSON-LD FAQ schema
    RelatedCalculators.tsx
    AdSlot.tsx
  lib/
    calculators/                  // one file per calculator: inputs, compute, meta
    format.ts                     // lv-LV number/currency formatting
    schema.ts                     // JSON-LD builders
    registry.ts                   // central list of all calculators (SSOT)
  content/
    faq/                          // per-calculator FAQ markdown
  styles/
    tokens.css
```

Central registry principle: every calculator is registered once in `lib/registry.ts` with slug, category, title, meta description, keywords, and a reference to its compute module. Sitemap, category pages, internal links, and the homepage grid all read from this single source. Adding a calculator = adding one registry entry plus one compute module.

## 5. The first 50 calculators

Grouped by category. Priority column: P1 build first (highest intent or first-hand content), P2 next, P3 fill-out for topical authority.

### Auto and transport (12)

1. Elektroauto vs benzīna auto izmaksas — EV vs ICE total cost. `/auto/elektroauto-vs-benzina`. P1
2. KASKO kalkulators — KASKO cost estimate. `/auto/kasko-kalkulators`. P1
3. OCTA cenu salīdzinājums — mandatory motor insurance estimate. `/auto/octa-kalkulators`. P1
4. Līzings vs kredīts auto — lease vs loan. `/auto/lizings-vs-kredits`. P1
5. EKII atbalsta kalkulators — EV grant net price. `/auto/ekii-atbalsts`. P1
6. Degvielas izmaksas gadā — annual fuel cost. `/auto/degvielas-izmaksas`. P1
7. Elektroauto uzlādes izmaksas — home vs public charging. `/auto/uzlades-izmaksas`. P2
8. Auto nolietojums — depreciation by age and mileage. `/auto/nolietojums`. P2
9. Uzņēmuma auto vs personīgais — company vs personal car tax. `/auto/uznemuma-auto`. P2
10. Riepu izmēra kalkulators — tyre size and speedo error. `/auto/riepu-izmers`. P3
11. Ceļa izmaksas kalkulators — trip cost per journey. `/auto/cela-izmaksas`. P3
12. Auto ekspluatācijas nodoklis — vehicle operation tax. `/auto/ekspluatacijas-nodoklis`. P2

### Finances and tax (14)

13. Alga neto no bruto — gross to net salary. `/finanses/alga-neto`. P1
14. Alga bruto no neto — net to gross reverse. `/finanses/alga-bruto`. P1
15. Hipotēkas maksājums — mortgage monthly payment. `/finanses/hipotekas-maksajums`. P1
16. Hipotēkas pārmaksa — overpayment savings. `/finanses/hipotekas-parmaksa`. P1
17. Patēriņa kredīta kalkulators — consumer loan cost. `/finanses/kredita-kalkulators`. P1
18. Uzkrājumu kalkulators — compound savings growth. `/finanses/uzkrajumi`. P2
19. Nekustamā īpašuma nodoklis — property tax by municipality. `/finanses/ipasuma-nodoklis`. P2
20. Iedzīvotāju ienākuma nodoklis — personal income tax. `/finanses/iin-kalkulators`. P2
21. PVN kalkulators — VAT add and extract. `/finanses/pvn-kalkulators`. P1
22. Saimnieciskās darbības nodokļi — sole trader taxes. `/finanses/saimnieciska-darbiba`. P2
23. Mikrouzņēmuma nodoklis — micro-enterprise tax. `/finanses/mun-kalkulators`. P2
24. Atvaļinājuma naudas kalkulators — vacation pay. `/finanses/atvalinajuma-nauda`. P2
25. Slimības naudas kalkulators — sick pay. `/finanses/slimibas-nauda`. P3
26. Inflācijas kalkulators — purchasing power over time. `/finanses/inflacija`. P3

### Home and energy (8)

27. Solāro paneļu atmaksa — solar payback period. `/majoklis/solaru-atmaksa`. P1
28. Siltumsūkņa atmaksa — heat pump payback. `/majoklis/siltumsukna-atmaksa`. P2
29. Elektrības rēķina kalkulators — electricity bill estimate. `/majoklis/elektribas-rekins`. P1
30. Apkures izmaksu salīdzinājums — heating fuel comparison. `/majoklis/apkures-izmaksas`. P2
31. Malkas daudzuma kalkulators — firewood volume needed. `/majoklis/malkas-daudzums`. P3
32. Krāsas daudzuma kalkulators — paint quantity for a room. `/majoklis/krasas-daudzums`. P3
33. Flīžu daudzuma kalkulators — tile quantity. `/majoklis/flizu-daudzums`. P3
34. Betona daudzuma kalkulators — concrete volume. `/majoklis/betona-daudzums`. P3

### Health and body (8)

35. ĶMI kalkulators — BMI. `/veseliba/kmi-kalkulators`. P1
36. Kaloriju norma (BMR/TDEE) — daily calorie need. `/veseliba/kaloriju-norma`. P1
37. Ķermeņa tauku procents — body fat estimate. `/veseliba/tauku-procents`. P2
38. Ūdens patēriņa norma — daily water intake. `/veseliba/udens-norma`. P3
39. Ideālā svara kalkulators — ideal weight range. `/veseliba/idealais-svars`. P2
40. Grūtniecības termiņš — due date calculator. `/veseliba/grutniecibas-termins`. P2
41. Ovulācijas kalkulators — ovulation window. `/veseliba/ovulacija`. P2
42. Alkohola promiļu kalkulators — blood alcohol estimate. `/veseliba/promiles`. P2

### Endurance and sport (8)

43. Skriešanas tempa kalkulators — running pace and splits. `/sports/skriesanas-temps`. P1
44. Triatlona plānotājs — triathlon split planner. `/sports/triatlona-planotajs`. P1
45. Peldēšanas CSS — critical swim speed. `/sports/peldesanas-css`. P2
46. FTP treniņu zonas — cycling power zones. `/sports/ftp-zonas`. P2
47. Sirdsdarbības zonas — heart rate zones. `/sports/pulsa-zonas`. P1
48. VO2max aprēķins — VO2max estimate. `/sports/vo2max`. P3
49. Maratona laika prognoze — race time predictor. `/sports/maratona-laiks`. P2
50. Kaloriju patēriņš treniņā — workout calorie burn. `/sports/trenina-kalorijas`. P3

### Build order (gap-first)

Priority is reassigned around the competitor gap, not raw search volume. The generic finance and tax calculators (salary, VAT, loan, sick pay, income tax) where kalkulatori.lv already ranks are deliberately pushed to the end. The first wave is only categories where the incumbent is absent, so new pages can index and rank without fighting a nine-year-old domain.

Wave 1, weeks 1 to 3 — the gaps. Build the full automotive category (all 12), the full home-energy category (all 8), and the full endurance-sport category (all 8), plus the shell, registry, sitemap, and JSON-LD. That is 28 calculators in categories with zero incumbent competition and the highest ad/affiliate value. This is where the project earns its first rankings and first revenue.

Wave 2, weeks 4 to 5 — differentiated health and near-gaps. The health category (8), where the incumbent has only BMI and calories, so most of these are open. Ship deeper, better-explained versions.

Wave 3, weeks 6 onward — contested generics, done better. Only now build the finance and tax calculators (14) that compete directly with kalkulatori.lv. By this point the site has authority from waves 1 and 2, and these pages win on freshness, current-dated 2026 figures, clearer explanations, and better UX rather than on domain age. Do not lead with these.

Within each wave, build the calculators where you have first-hand experience first (EV vs ICE, EKII, KASKO, lease vs loan, solar payback, triathlon, FTP), because those explanations will be authentic and rank hardest.

## 6. Pillar A — Backend and architecture

The backend is deliberately thin; the discipline is in structure, not services.

Static-first. Every calculator page is statically generated at build time. Math runs client-side in the browser, so there is no per-request server cost and pages serve instantly from cache. This is what keeps hosting free and rankings fast.

Single source of truth. `lib/registry.ts` holds every calculator's metadata. Nothing about a calculator is duplicated. The sitemap, homepage grid, category pages, breadcrumbs, and related-calculator blocks are all derived from the registry at build time. This prevents the classic programmatic-SEO failure where pages, sitemaps, and internal links drift out of sync.

Compute modules are pure. Each calculator's logic lives in `lib/calculators/<slug>.ts` as a pure function: inputs in, structured result out. No side effects, no DOM. This makes them trivially unit-testable and reusable (a compute module can power both the page and, later, an API endpoint or embeddable widget).

Deployment. Vercel builds and deploys directly from the Git repo: push to main deploys to production, every branch/PR gets its own preview URL, TLS and CDN are automatic. Because the site is static, rollback is instant (redeploy any previous build from the dashboard).

Observability. Vercel Web Analytics gives privacy-friendly traffic data without Google Analytics weight, with zero infrastructure to run. Log which calculators convert (ad clicks, affiliate outbound) to decide where to deepen content.

Future extension without rework. If saved calculations, user accounts, or an embeddable-widget business emerge, Supabase drops in for auth and storage (Vercel's Supabase integration wires up env vars automatically), and the pure compute modules already double as an API. Nothing built now needs to be undone.

## 7. Pillar B — Frontend UI and UX

The product's job is: land, answer, trust, stay. Design serves that funnel.

Instant answer, no friction. The result is visible above the fold before any input change; sensible defaults mean the page already shows a plausible number on load. No sign-up, no "calculate" button gating the result where a live recompute will do. Every input updates the result immediately.

One clear verdict. Each calculator surfaces a single headline outcome (the monthly payment, the cheaper option, the pace) in large monospace numerals, with the detailed breakdown below it. Numbers are the hero of the page; labels and chrome stay quiet.

Design identity, not template. A consistent visual system across all 50 pages builds recognition and trust, which matters for both return visits and ad viewability. Dark instrument-panel aesthetic, one accent per domain, monospace for figures, restrained motion. Avoid the generic calculator-site look (cluttered, ad-choked, untrustworthy) because trust is the conversion lever.

Trust signals. Every page states its assumptions plainly, shows a short "how this is calculated" note, and dates the tax rates or grant figures it uses. For Latvian financial and tax calculators, being visibly current and correct is the differentiator over stale competitors.

Speed and accessibility as ranking and revenue factors. Core Web Vitals directly affect both SEO and ad revenue. Target: static HTML, no layout shift (reserve ad slot heights so ads don't push content), lazy-load below-fold ads, system-adjacent fonts or self-hosted subsets. Keyboard-navigable inputs, visible focus, reduced-motion respected, mobile-first since most search traffic is mobile.

Ad placement that does not destroy UX. Reserve fixed-height ad slots in the layout so they never cause layout shift. Place one ad after the result and one in the related-calculators footer, not between the user and their answer. Good UX and ad viewability align; interstitial-style greed kills both rankings and repeat visits.

Retention loop. Every calculator ends with a related-calculators block (from the registry) and a category link, turning one-query visitors into multi-page sessions. This raises pages-per-session, ad impressions, and topical authority simultaneously.

## 8. Pillar C — SEO strategy for maximum growth

The entire project is an SEO play; this is the growth engine.

One page, one intent. Each calculator targets exactly one primary query and its close variants. Slugs, H1, title, and meta description all mirror the real Latvian search phrase. Do not merge two intents onto one page; two intents means two pages and twice the surface area.

Programmatic scale with editorial quality. Fifty pages from a shared template give scale, but each page carries genuine unique content: the calculator itself, a plain-language explanation of the formula, a worked example using realistic Latvian figures, and a short FAQ. Thin programmatic pages get filtered by Google; a working tool plus real explanation is exactly what escapes that filter.

Structured data everywhere. Every page ships JSON-LD: `WebApplication` or `SoftwareApplication` for the calculator, `BreadcrumbList` for hierarchy, and `FAQPage` for the FAQ. FAQ schema wins rich results and pulls extra SERP real estate, lifting click-through without ranking higher.

Internal linking as topical authority. The registry-driven related-calculators blocks and category hubs create a dense internal link graph. Category pages act as pillar pages; individual calculators are the cluster. This concentrates authority and helps new pages get discovered and indexed fast.

Technical foundation. Auto-generated `sitemap.xml` from the registry, submitted to Search Console day one. Clean `robots.txt`. Canonical tags. Fast static delivery for Core Web Vitals. Latvian `hl`/`lang` correctly set. This is the baseline that lets 50 pages get crawled and indexed within weeks rather than months.

Keyword selection discipline. Prioritize queries with genuine intent and thin competition: Latvian-specific tax, grant, and insurance calculators where global sites do not compete and local sites are stale. Use search-suggest and competitor gaps to confirm each slug maps to real demand before building. Better to ship 50 pages that each own a real query than 200 that target nothing.

Content freshness as a moat. Tax rates, grant amounts, and insurer prices change yearly. Updating figures and stamping the page with a current date is cheap for you and expensive for absent competitors, and Google rewards freshness on money-topic (YMYL) pages. A yearly refresh pass keeps the whole hub ranking.

Compounding, not spiking. Programmatic SEO compounds: each indexed page adds authority that helps the next rank. The 3-month ROI target is realistic because pages published in week 2 are maturing while week-6 pages are still indexing. Keep publishing and refreshing; do not stop at 50 if the model proves out.

Off-page, lightweight. Seed a handful of links from your existing properties (@endelis, northraceradar) to the sport calculators and the homepage to speed initial indexing. Beyond that, the strategy is content-led; the tools earn links naturally when they are genuinely the best Latvian answer to a query.

## 9. Exact Claude Code opening prompt

Paste the following into Claude Code from an empty project directory. It assumes this file is available in the repo as `PROJECT-OVERVIEW.md`.

---

```
Read PROJECT-OVERVIEW.md in full before writing any code. It is the single source of truth for this project. Build it in the order below and stop for my review at each checkpoint.

PROJECT: Manikalkulatori.lv, a Latvian-language calculator hub for programmatic SEO. Next.js 15 App Router, TypeScript, Tailwind, static generation. Deployed to Vercel (Hobby tier), git-push deploys. Do not add a database, auth, or any server-side data fetching. All calculator math runs client-side in pure functions.

ARCHITECTURE RULES (non-negotiable):
1. lib/registry.ts is the single source of truth. Every calculator is registered once with: slug, category, title, h1, metaDescription, keywords[], accentColor, and a dynamic import of its compute module. The sitemap, homepage grid, category pages, breadcrumbs, and related-calculators blocks must all derive from this registry. Never hardcode a calculator list anywhere else.
2. Each calculator's math lives in lib/calculators/<slug>.ts as a pure, exported, unit-testable function: typed inputs in, typed structured result out. No DOM, no side effects.
3. Pages are statically generated. Use generateStaticParams from the registry. No ISR unless I ask.
4. Every page ships JSON-LD: SoftwareApplication for the tool, BreadcrumbList, and FAQPage. Put the builders in lib/schema.ts.
5. All numbers formatted via lib/format.ts using lv-LV locale and EUR.
6. Reserve fixed-height ad slots (components/AdSlot.tsx) so ads never cause layout shift. AdSlot renders a placeholder for now.

DESIGN:
Dark instrument-panel aesthetic. Charcoal background, one accent color per category (defined in the registry), monospace for all figures, clean sans for labels. Result headline is the hero, large, above the fold, updates live on every input change with sensible defaults so a plausible number shows on load. No "calculate" button. Mobile-first. Reserve ad-slot heights. Visible focus states, reduced-motion respected. Follow the UI/UX pillar in the overview.

BUILD ORDER AND CHECKPOINTS:

Checkpoint 1 — Foundation. Set up the Next.js project, Tailwind, tokens, the registry type and an empty registry, lib/format.ts, lib/schema.ts, and the shared components: CalculatorShell, NumberField, ResultCard, Breakdown, Faq, RelatedCalculators, AdSlot. Build the dynamic routes app/[category]/[calculator]/page.tsx and app/[category]/page.tsx and the homepage, all driven by the (still small) registry. Add sitemap.ts and robots.ts. Wire up one real calculator end to end: elektroauto-vs-benzina (EV vs ICE), using the formula from the overview. Show me the running site with that one page working before continuing.

Checkpoint 2 — Wave 1, the competitor gaps. Build the full automotive category (12), home-energy category (8), and endurance-sport category (8): 28 calculators total. These are the categories where the incumbent kalkulatori.lv has nothing, so they are the priority. One compute module and one registry entry each, plus a short FAQ and worked example per page. Within this wave, build the first-hand-experience calculators first (EV vs ICE, EKII, KASKO, lease vs loan, fuel cost, solar payback, running pace, triathlon, FTP, heart-rate zones). Validate JSON-LD. Show me the three category pages populating.

Checkpoint 3 — Wave 2, health category (8).

Checkpoint 4 — Wave 3, the contested finance and tax category (14). These compete directly with the incumbent, so they come last, after the site has authority. Then a final pass: internal linking via related-calculators, sitemap completeness, Core Web Vitals check, and connecting the repo to Vercel for production deploys.

For every calculator, take the exact slug, title, and category from the overview's list of 50. Ask me before inventing any formula whose Latvian tax rate, grant amount, or rate I have not specified; do not guess YMYL financial figures. Write a unit test for each compute module.

Start with Checkpoint 1.
```

---

## 10. Notes and open decisions

Domain: register a Latvian-market domain (a `.lv` reads as local and trustworthy for these queries). Needed before AdSense approval.
Ad network: apply to AdSense once ~20 pages are live with real content; consider Ezoic or a direct insurer/leasing affiliate deal once traffic proves out.
YMYL caution: financial and tax calculators are "your money or your life" topics in Google's eyes. Accuracy, current-dated figures, and clear assumptions are not optional; they are the ranking requirement.
First-hand content advantage: pages 1 to 6, 9, 13, 15, 16, 27, and 43 to 47 map to things you have direct recent experience with (KONA, EKII, SEB leasing, KASKO, Endelis taxes, triathlon prep). Write those explanations yourself; they will read as authentic and outrank templated competitors.
