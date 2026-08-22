# Manikalkulatori.lv — UI / UX Design Guidance

Companion to PROJECT-OVERVIEW.md. This document defines the design system so all 50 calculator pages stay coherent, load fast, rank well, and convert. It is written to be handed to Claude Code as the design source of truth alongside the overview.

Design is not decoration here. On an SEO-and-ads project, the interface directly drives three revenue levers: bounce rate (which feeds rankings), ad viewability (which feeds RPM), and pages per session (which feeds impressions and topical authority). Every choice below serves land, answer, trust, stay.

## 1. Design principles (the non-negotiables)

Answer before interaction. The result must be visible on page load, above the fold, computed from sensible defaults. A visitor who searched "cik maksā elektroauto" sees a plausible number before touching anything. Never gate the result behind an "Aprēķināt" button.

The number is the hero. Every page has exactly one headline outcome rendered large, in a monospace figure typeface. Everything else (inputs, chrome, ads) is quieter than that number. If two things compete for attention, the number wins.

Trust is the conversion lever. These are money and health topics. Visible assumptions, a short "kā tas tiek aprēķināts" note, and a date stamp on any rate or grant figure do more for conversion and rankings than any visual flourish. Stale or unexplained equals untrusted equals bounce.

Speed is a feature. Core Web Vitals affect both SEO and ad revenue. The design must be implementable as static HTML with zero layout shift. This constrains fonts, images, and ad slots, and those constraints are the point.

Coherence across 50 pages. A visitor landing on the FTP calculator and later the KASKO calculator must feel they are on the same trusted site. One design system, applied through the registry, per-category accent only.

Distinctive, not templated. Avoid the generic calculator-site look (cluttered, grey, ad-choked, three columns of noise). That look signals low quality to both users and Google. The instrument-panel direction below is the differentiator.

## 2. Aesthetic direction: "instrument panel"

One committed concept: the site reads like a precision measurement instrument, a clean dashboard gauge, not a spreadsheet and not a generic web calculator. Calm, dark, exact. The feeling is "this tool is accurate and I can trust the reading."

Why this direction. It fits the product (readings, measurements, verdicts), it photographs well for ad viewability (high contrast around ad slots without clashing), it is memorable against grey competitor sites, and it is cheap to render fast because it relies on type, space, and one accent rather than heavy imagery.

Light-mode variant is acceptable and may test better for broad finance queries and older demographics; if built, keep the same structure, swap tokens only. Decide once, apply through tokens, do not mix per page. Default recommendation: dark instrument panel for launch, because it differentiates hardest from the incumbent.

## 3. Color system

Use CSS variables exclusively. Never hardcode a hex value in a component. One neutral base shared across the whole site, plus one accent per category defined in the registry.

Base neutrals (dark theme):

```
--bg:            #0B0E14   /* page background, near-black charcoal */
--surface:       #0F131C   /* cards, panels */
--surface-2:     #12161F   /* inputs, insets */
--border:        #1B212D   /* hairline dividers */
--border-strong: #232A38   /* input borders */
--text:          #E8ECF3   /* primary text */
--text-muted:    #8A93A6   /* labels, secondary */
--text-faint:    #5B6579   /* captions, assumptions, units */
```

Category accents (one per category, set in registry, used for the hero number, the verdict, active states, and focus rings):

```
--accent-auto:    #00D3C7   /* teal-cyan, automotive */
--accent-finance: #4C9AFF   /* blue, finances and tax */
--accent-home:    #FFB020   /* amber, home and energy */
--accent-health:  #FF6B8A   /* rose, health and body */
--accent-sport:   #7CE23F   /* lime, endurance and sport */
```

Comparison semantics. When a calculator compares two options (EV vs ICE, lease vs loan), use the category accent for the "winner" side and a warm neutral amber (`#FFB020`) for the other, so the verdict is legible at a glance without relying on red/green (colorblind-safe). Never use red for "the more expensive option"; red reads as error, not cost.

Contrast. All text must clear WCAG AA against its background. The faint tier (`--text-faint`) is for non-essential captions only; never put a real value in it.

## 4. Typography

Two typefaces, self-hosted as subset woff2 for speed and to avoid the generic look. Do not use Inter, Roboto, Arial, or system defaults for display.

Figures (the hero number, all values, units, results): a monospace with real character. Recommended: JetBrains Mono or Space Mono, self-hosted, Latin + Latvian diacritics subset. Monospace makes numbers feel measured and instrument-like, and keeps columns of figures aligned. This is the signature of the whole design.

Labels and body (input labels, explanations, FAQ): a clean, characterful grotesque or humanist sans that is not Inter. Recommended: a self-hosted subset of something with personality but high legibility. It must carry Latvian diacritics (ā, č, ē, ģ, ī, ķ, ļ, ņ, š, ū, ž) cleanly.

Type scale (fluid, mobile-first):

```
Hero number:   clamp(2.5rem, 8vw, 4rem)   monospace, weight 700
H1 page title: clamp(1.6rem, 4vw, 2.2rem) sans, weight 700, letter-spacing -0.02em
H2 section:    1.125rem                    sans, weight 600
Body:          1rem / 1.6                  sans, weight 400
Label (caps):  0.75rem, letter-spacing 0.08em, uppercase, --text-muted
Value inline:  1.125rem                    monospace
Caption:       0.75rem                     sans, --text-faint
```

Performance rule. Subset the fonts to Latin + Latvian glyphs only, preload the two primary weights, use `font-display: swap`, and reserve line heights so swap causes no layout shift. Two files, two weights each, nothing more.

## 5. Layout and spatial system

Spacing scale (use consistently, 4px base): 4, 8, 12, 16, 20, 24, 32, 48, 64.

Page width. Content column max 720px for reading comfort on the explanation and FAQ; the calculator card itself may go to 920px on desktop for two-column comparison calculators. Center everything; generous side padding on mobile (20px minimum).

Vertical rhythm of a calculator page (top to bottom, this order is fixed for consistency and SEO):

```
1. Breadcrumb            (Sākums / Auto / Elektroauto vs benzīns)
2. H1                     the exact target query as the title
3. One-line intro        what the tool does, one sentence
4. THE RESULT CARD       verdict + hero number, above the fold
5. Inputs                grouped, live-updating
6. Breakdown             bars / table showing how the number is built
7. [reserved gap]        future in-content ad/affiliate position; empty, height reserved, built later
8. "Kā tas tiek aprēķināts"  plain-language formula + worked example
9. FAQ                   accordion, feeds FAQPage schema
10. RelatedCalculators   from registry, same + adjacent category
11. [reserved gap]       future footer ad position; empty, height reserved, built later
12. Footer               legal links, date stamp, language
```

The two reserved gaps carry no component and no visible element in this phase. They exist only so the later ad/affiliate phase inserts into pre-reserved height with zero layout shift.

The result card sits above the fold on mobile. On a comparison calculator, the two option columns sit side by side on desktop and stack on mobile, result card spanning full width above both.

Grid discipline, not grid monotony. Use an 8px grid, but allow the result card to break out visually (larger, bordered in the accent, slightly raised) so the eye lands on it first. That single grid-break is the composition; everything else stays calm.

## 6. Components (the shared library)

All components live in `components/` and are theme-driven by tokens and the per-page accent from the registry.

ResultCard. The signature component. Dark surface, 1px accent border, the verdict sentence in body sans, the hero number in large monospace accent. For comparisons, shows both figures with the winner in accent and the difference called out. Reserve its height so it never shifts.

NumberField. Label (uppercase caption tier), input in monospace, unit suffix inside the field in faint tier, accent focus ring. Large tap targets (min 44px height) for mobile. Increment/decrement optional but keep them subtle. No spinner clutter.

Breakdown. Horizontal stacked bars or a compact table showing the components of the result (depreciation, energy, upkeep). Uses accent + two neutral greys, never a rainbow. Each segment labeled with its euro value in monospace.

Faq. Accordion, accessible (button-based, keyboard operable, aria-expanded). Renders visible Q&A and emits FAQPage JSON-LD from the same content so there is never drift between what users see and what Google reads.

RelatedCalculators. Registry-driven cards, three to six, same category first then adjacent. This is the retention loop; style it as inviting but secondary to the current tool.

AdSlot. Not built in this phase. Ads and affiliate come around month 3. For now the shell leaves reserved gaps (see section 5) with no component. When the ad phase begins, AdSlot will render a fixed-height reserved container so insertion causes zero CLS, but it is out of scope for the current build.

Breadcrumb. Small, faint, accent on hover, emits BreadcrumbList JSON-LD.

CalculatorShell. Wraps all of the above in the fixed vertical order (including the two empty reserved gaps for future ads), injects the accent, sets the meta and schema from the registry. Every calculator page is `<CalculatorShell calc={...}>`.

## 7. Motion

Restrained, purposeful, CSS-only where possible for static delivery.

Live recompute. When an input changes, the hero number animates its value change with a short (150 to 200ms) count/tween, not a jarring snap. This reinforces the instrument feel and confirms the input registered. Respect `prefers-reduced-motion`: no tween, instant update.

Page load. One subtle staggered reveal of the result card then inputs (opacity + 6px rise, 60ms stagger). Nothing more. No scroll-jacking, no parallax, no decorative motion. Motion that delays the answer is a bug.

Hover. Inputs and related cards get a quiet border/accent transition (120ms). Focus states are visible and accent-colored for accessibility.

## 8. Ad and affiliate placement (deferred, but designed for now)

Ads are not being built yet. AdSense approval realistically comes around month 3, and affiliate blocks come once partner programs are chosen. So no AdSlot component and no ad units are built in the current phase. What matters now is that the layout is designed so ads and affiliate blocks drop in later without any restructuring and without introducing layout shift.

Rule for now: reserve the space, build nothing. In the fixed vertical order of a calculator page (section 5), the two future ad positions (in-content after the breakdown, and footer) are left as empty, unstyled gaps with a fixed reserved height in the layout, or simply as clearly marked comment placeholders in the shell. No visible element, no component, no dependency. When ads go live later, they fill the already-reserved height, so CLS stays at zero and no page needs to be touched.

When ads and affiliate are added later (do not build now), the rules will be: never between the user and the answer (nothing above the result card), always reserved height, affiliate blocks styled as first-class contextual cards in the category accent and clearly labeled, two display slots per page maximum, and all partner content visibly labeled ("Reklāma" / "Partneris"). These are recorded here so the later phase is fast, but they are out of scope for the current build.

## 9. Accessibility and mobile (both are ranking factors)

Mobile-first. Most search traffic is mobile. Design and test at 360px width first. Inputs at least 44px tall, tap targets not crowded, no horizontal scroll, result card fully visible without scrolling on a typical phone.

Keyboard and screen reader. All inputs labeled (real `<label>`, not placeholder-only). Accordion and controls operable by keyboard with visible focus. Numbers announced sensibly. Language attribute set to `lv`.

Contrast and reduced motion. AA contrast everywhere real information lives; honor `prefers-reduced-motion`. These are cheap to do at build time and expensive to retrofit.

## 10. What to fix on the current live site first

Based on the live homepage (five categories, one calculator live, rest "Drīzumā"), the immediate priorities:

First, lock the token file and the two self-hosted fonts before building more pages, so the coming 28 Wave 1 calculators inherit the system instead of needing a later restyle.

Second, build CalculatorShell and ResultCard properly, since every page depends on them; the current auto calculator should be the reference implementation of the whole design system.

Third, make the homepage category grid feel like the instrument system: dark surface cards, per-category accent, the live count per category ("1 kalkulators", "Drīzumā" as a quiet state), and a clear visual hierarchy so the live category stands out from the coming-soon ones.

Fourth, leave the two reserved gaps in the shell (see section 5) as empty height, so when ads and affiliate arrive around month 3 they slot in with zero CLS. Do not build any ad component now.

Fifth, add the legal/trust footer (privātuma politika, noteikumi, par mums, kontakti) since these are needed for AdSense anyway and they lift trust immediately.

## 11. Content writing rules (voice and anti-AI-slop)

The text on every page (intros, "kā tas tiek aprēķināts" explanations, FAQ answers, category descriptions) must read as written by a Latvian practitioner, not generated by an AI. This matters for two reasons: it matches the site owner's voice, and AI-sounding boilerplate is a quality and ranking risk on YMYL topics where Google rewards genuine expertise.

Hard rule, no dash or hyphen as a structuring or stylistic character. Do not use the dash character ("-") or an em/en dash as a bullet marker, as a sentence-joining pause, or as a substitute for a comma, colon, or parenthesis anywhere in visible content. This is the single clearest tell of AI-generated Latvian text and it must never appear. Instead:
1. For lists, use proper numbered lists or checkboxes, or write the items as plain prose ("piemēram: x, y un z").
2. For a pause or aside, use a comma, a colon, or start a new sentence.
3. Hyphenated Latvian compound words that are genuinely spelled with a hyphen in standard orthography are fine; the ban is on the dash as punctuation or list structure, not on legitimate spelling.

Further voice rules for all copy:
1. Write plain, information-dense Latvian. State the fact, then move on. No filler, no throat-clearing, no "šajā rakstā mēs apskatīsim" style openers.
2. Avoid AI-typical connectors and hedging ("turklāt", "ir svarīgi atzīmēt, ka", "kopumā", "būtībā") when they add nothing. Cut them.
3. No marketing fluff or hype. The tool proves its value; the copy does not need to sell it.
4. Use concrete Latvian figures and real local context (actual rates, actual providers, real euro amounts) rather than generic examples. First-hand specificity is what separates this from templated competitors and what ranks.
5. Vary sentence length and structure. Uniform, evenly-weighted sentences are an AI tell; real writing has rhythm.
6. Prefer the active voice and direct address where natural.

This rule applies to everything Claude Code generates for the site and to any content drafted for it later. If content is drafted elsewhere, it passes the same check before publishing: no dash as punctuation or structure, plain practitioner Latvian, concrete local specifics.

## 12. Design tokens starter (drop into styles/tokens.css)

```css
:root {
  /* base */
  --bg: #0B0E14;
  --surface: #0F131C;
  --surface-2: #12161F;
  --border: #1B212D;
  --border-strong: #232A38;
  --text: #E8ECF3;
  --text-muted: #8A93A6;
  --text-faint: #5B6579;

  /* accents (page sets --accent to one of these via registry) */
  --accent-auto: #00D3C7;
  --accent-finance: #4C9AFF;
  --accent-home: #FFB020;
  --accent-health: #FF6B8A;
  --accent-sport: #7CE23F;
  --accent: var(--accent-auto); /* default, overridden per page */
  --warn: #FFB020; /* "other option" in comparisons */

  /* spacing */
  --s1: 4px;  --s2: 8px;  --s3: 12px; --s4: 16px;
  --s5: 20px; --s6: 24px; --s7: 32px; --s8: 48px; --s9: 64px;

  /* radius */
  --r-sm: 6px; --r-md: 8px; --r-lg: 12px;

  /* type */
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --font-sans: "YourSans", system-ui, sans-serif; /* self-hosted, not Inter */

  /* elevation */
  --shadow-card: 0 1px 0 rgba(255,255,255,0.02), 0 8px 24px rgba(0,0,0,0.4);
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

## 13. Design acceptance checklist (run per page before shipping)

1. Result is visible above the fold on 360px width, computed from defaults, no button needed.
2. Exactly one hero number, monospace, in the category accent.
3. Live recompute works and animates (or instant under reduced-motion).
4. Assumptions and a date stamp on any rate/grant figure are visible.
5. "Kā tas tiek aprēķināts" note plus one worked example present.
6. FAQ visible content matches emitted FAQPage schema.
7. Reserved gaps present where future ads go (empty, height reserved); no ad component built; nothing above the result.
8. Related calculators block present, registry-driven.
9. All inputs have real labels; keyboard and focus states work; contrast AA.
10. Uses only tokens and the page accent; no hardcoded colors; fonts subset and preloaded.
11. No layout shift on load or on ad insertion (CLS ~0).
12. Page feels part of the same site as every other calculator.
13. No dash or hyphen used as punctuation, pause, or list marker anywhere in visible content; copy reads as plain practitioner Latvian, not AI-generated.
