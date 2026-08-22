# Instrument Panel Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the already-live Checkpoint 1 site (one calculator, `elektroauto-vs-benzina`) into compliance with `DESIGN-GUIDANCE.md`: the new color/type system, the fixed page layout order, removal of the `AdSlot` component in favor of empty reserved-height gaps, the content-voice rule against dashes as punctuation (including in copy that shipped before this rule existed), and the site-wide legal footer plus cookie banner, so the 28 Wave 1 calculators in the next checkpoint inherit a finished, compliant system instead of needing a later restyle.

**Architecture:** Surgical retrofit of existing Tailwind v3 + `tailwind.config.ts` token mapping (not a rewrite, not a move to Tailwind v4). CSS custom properties in `styles/tokens.css` keep their existing `--color-panel-*` / `--color-accent-*` names (renaming would touch every component) but get new values and three new tiers (`surface-2`, `border-strong`, `faint`) plus a shared `--color-warn`. Fonts move from a static font-family string to `next/font/google`, which self-hosts at build time — no manual font file management. `CalculatorShell`'s JSX is reordered to the fixed vertical order in `DESIGN-GUIDANCE.md` §5; the two `AdSlot` instances are deleted and replaced with plain empty spacer `div`s. A new `Footer` and `CookieBanner` render once in the root layout, so every route gets them for free.

**Tech Stack:** Next.js 15.5.23 App Router, TypeScript, Tailwind CSS 3, `next/font/google` for self-hosted fonts, Vitest.

**Spec:** `DESIGN-GUIDANCE.md` (repo root, especially §3 color system, §4 typography, §5 layout order, §8 ad deferral, §10 "what to fix on the live site first", §11 content voice rules) and `PROJECT-OVERVIEW.md` (repo root, especially the updated §7 and §9, which now defer ads and reference this design doc).

## Global Constraints

- Keep the existing `--color-panel-*` / `--color-accent-*` CSS variable names and the `panel` / `accent` Tailwind color namespaces in `tailwind.config.ts` — do not rename across the codebase. Add new tokens only where §3 introduces a new tier.
- No dash or hyphen ("-", em dash, en dash) as punctuation, a pause, or a list marker anywhere in visible Latvian copy, whether newly written by this plan or already live from Checkpoint 1 (`DESIGN-GUIDANCE.md` §11). Legitimate hyphenated Latvian spelling (e.g. "e-pastu") is fine. A literal minus sign in an arithmetic expression (e.g. "1 942,50 € − 445,50 €" in the worked example) is not a punctuation dash and is out of scope for this rule. Code comments are not visible content and are out of scope too.
- Fonts must be genuinely self-hosted (built and served from this site's own domain, not a runtime request to fonts.googleapis.com) — `next/font/google` with `subsets: ['latin', 'latin-ext']` satisfies this; `latin-ext` is required for Latvian diacritics (ā, č, ē, ģ, ī, ķ, ļ, ņ, š, ū, ž).
- No component may hardcode a hex color — everything goes through a CSS variable or a Tailwind utility backed by one (`DESIGN-GUIDANCE.md` §3).
- The `AdSlot` component and both its use sites must be deleted, not merely hidden — `DESIGN-GUIDANCE.md` §6 and §8 are explicit that no ad component exists in this phase, only empty reserved-height gaps.
- `CalculatorShell`'s rendered order must match `DESIGN-GUIDANCE.md` §5 exactly: breadcrumb, H1, one-line intro, `{children}` (result + inputs + breakdown), reserved gap, "Kā tiek aprēķināts" explanation, FAQ, related calculators, reserved gap. The footer is site-wide (root layout), not part of `CalculatorShell`.
- Comparison semantics: the cheaper/winning option uses the category accent color; the other option uses `--color-warn` (amber); never red (`DESIGN-GUIDANCE.md` §3, "Comparison semantics").
- All privacy/terms/about/contact copy must describe only what is actually true of this site today (static hosting on Vercel, Vercel Web Analytics is cookieless, no tracking cookies yet) — no fabricated compliance claims.
- `npm run test`, `npx tsc --noEmit`, and `npm run build` must all stay green throughout.

---

### Task 1: Color tokens and Tailwind mapping

**Files:**
- Modify: `styles/tokens.css`
- Modify: `tailwind.config.ts`

**Interfaces:**
- Produces: updated values for `--color-panel-bg`, `--color-panel-surface`, `--color-panel-border`, `--color-panel-text`, `--color-panel-muted`, `--color-accent-auto`, `--color-accent-finanses`, `--color-accent-majoklis`, `--color-accent-veseliba`, `--color-accent-sports`; new `--color-panel-surface-2`, `--color-panel-border-strong`, `--color-panel-faint`, `--color-warn`. New Tailwind utilities `bg-panel-surface-2`, `border-panel-border-strong`, `text-panel-faint`, `bg-warn`/`text-warn`/`border-warn`. Consumed by Tasks 6, 7, 8, 9 and already-live components that reference the existing token names.

- [ ] **Step 1: Update `styles/tokens.css`**

Remove the two `--font-mono` / `--font-sans` lines entirely (Task 2 makes `next/font` own those two variable names via a `variable` option in `app/layout.tsx`; leaving a literal value here would fight it). Replace the rest of the file with:

```css
:root {
  --color-panel-bg: #0B0E14;
  --color-panel-surface: #0F131C;
  --color-panel-surface-2: #12161F;
  --color-panel-border: #1B212D;
  --color-panel-border-strong: #232A38;
  --color-panel-text: #E8ECF3;
  --color-panel-muted: #8A93A6;
  --color-panel-faint: #5B6579;

  --color-accent-auto: #00D3C7;
  --color-accent-finanses: #4C9AFF;
  --color-accent-majoklis: #FFB020;
  --color-accent-veseliba: #FF6B8A;
  --color-accent-sports: #7CE23F;

  --color-warn: #FFB020;
}
```

- [ ] **Step 2: Update `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: {
          bg: 'var(--color-panel-bg)',
          surface: 'var(--color-panel-surface)',
          'surface-2': 'var(--color-panel-surface-2)',
          border: 'var(--color-panel-border)',
          'border-strong': 'var(--color-panel-border-strong)',
          text: 'var(--color-panel-text)',
          muted: 'var(--color-panel-muted)',
          faint: 'var(--color-panel-faint)',
        },
        accent: {
          auto: 'var(--color-accent-auto)',
          finanses: 'var(--color-accent-finanses)',
          majoklis: 'var(--color-accent-majoklis)',
          veseliba: 'var(--color-accent-veseliba)',
          sports: 'var(--color-accent-sports)',
        },
        warn: 'var(--color-warn)',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (this alone won't reveal missing font vars yet — that's Task 2 — but confirms no TypeScript regressions from the config change).

Note: `npm run build` will likely still succeed here even with the font vars temporarily undefined, since `var(--font-mono)` with no declared custom property just falls through to the explicit fallback stack (`ui-monospace`, etc.) — not an error, just not the intended font yet. Don't chase this; Task 2 fixes it.

- [ ] **Step 4: Commit**

```bash
git add styles/tokens.css tailwind.config.ts
git commit -m "feat: adopt the instrument-panel color palette from DESIGN-GUIDANCE.md"
```

---

### Task 2: Self-hosted fonts via next/font

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: `--font-mono` and `--font-sans` CSS custom properties (self-hosted JetBrains Mono and IBM Plex Sans), consumed by `tailwind.config.ts`'s existing `fontFamily` mapping (Task 1) and therefore by every component using `font-mono`/`font-sans` classes already.

- [ ] **Step 1: Rewrite `app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Manikalkulatori.lv: kalkulatori latviešu valodā',
    template: '%s | Manikalkulatori.lv',
  },
  description:
    'Bezmaksas kalkulatori auto, finanšu, mājokļa, veselības un sporta jautājumiem latviešu valodā.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lv" className={`${jetbrainsMono.variable} ${ibmPlexSans.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
```

Note the title changed from an em dash to a colon separator ("Manikalkulatori.lv: kalkulatori...") as part of this same edit — this is the fix for one of the content-rule violations Task 4 audits; doing it here avoids a second pass over a file you're already rewriting.

(Tasks 8 and 9 will add `<Footer />` and `<CookieBanner />` inside `<body>`, after `{children}` — don't add them yet, just leave this as the base layout for now.)

- [ ] **Step 2: Build and verify fonts are self-hosted, not CDN-loaded**

Run: `npm run build`
Expected: PASS.

Run: `npm run start`, then in another terminal: `curl -s http://localhost:3000/ -o page.html` and inspect it (`grep -o "fonts.googleapis" page.html` should find nothing; `grep -o "/_next/static/media/[^\"']*woff2" page.html` should find at least two font file references, confirming Next self-hosted them under `/_next/static/media/`). Stop the server (Ctrl+C).

Expected: no `fonts.googleapis.com` reference anywhere in the HTML; at least one `.woff2` file served from `/_next/static/media/`.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: self-host JetBrains Mono and IBM Plex Sans via next/font"
```

---

### Task 3: Registry gains a one-line intro; fix the h1's dash

**Files:**
- Modify: `lib/registry.ts`

**Interfaces:**
- Produces: `CalculatorMeta.intro: string` — consumed by `CalculatorShell` (Task 5) as the "one-line intro" §5 position 3 requires.

- [ ] **Step 1: Add `intro` to the `CalculatorMeta` interface, populate it, and fix the h1's em dash**

In `lib/registry.ts`, add `intro: string;` to the `CalculatorMeta` interface (after `h1`), and update the one existing entry — note the `h1` field also changes here, replacing its em dash with a colon (one of the content-rule violations this plan fixes):

```ts
export interface CalculatorMeta {
  slug: string;
  category: CategorySlug;
  title: string;
  h1: string;
  intro: string;
  metaDescription: string;
  keywords: string[];
}
```

```ts
export const calculators: CalculatorMeta[] = [
  {
    slug: 'elektroauto-vs-benzina',
    category: 'auto',
    title: 'Elektroauto vs benzīna auto izmaksas',
    h1: 'Elektroauto vai benzīna auto: kas izmaksā lētāk?',
    intro: 'Ievadi savus skaitļus un uzzini, cik gadā maksā elektroauto salīdzinājumā ar benzīna auto.',
    metaDescription:
      'Salīdzini elektroauto un benzīna auto gada ekspluatācijas izmaksas pēc nobraukuma, patēriņa un enerģijas cenas.',
    keywords: ['elektroauto vs benzīns', 'elektroauto izmaksas', 'ev vs ice kalkulators'],
  },
];
```

- [ ] **Step 2: Typecheck and run the existing registry tests**

Run: `npx tsc --noEmit`
Expected: PASS — `lib/registry.test.ts` and `lib/registry.integrity.test.ts` don't construct a fake `CalculatorMeta` object, so adding a required field doesn't break them, but confirm with:

Run: `npm run test -- lib/registry.test.ts lib/registry.integrity.test.ts`
Expected: PASS, same test counts as before (8 + 3 = 11 tests).

- [ ] **Step 3: Commit**

```bash
git add lib/registry.ts
git commit -m "feat: add a one-line intro to CalculatorMeta and fix the h1's em dash"
```

---

### Task 4: Fix the remaining content-rule violations

**Files:**
- Modify: `app/[category]/[calculator]/page.tsx`
- Modify: `components/calculators/ElektroautoVsBenzinaCalculator.tsx`
- Modify: `content/faq/elektroauto-vs-benzina.md`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing new downstream — pure content edits, no signature changes.

**Context:** `DESIGN-GUIDANCE.md` §11 bans the dash as punctuation, a pause, or a list marker in visible content. That rule didn't exist when Checkpoint 1 shipped, so three files that shipped then still violate it. This task fixes the three remaining spots (the site title and the calculator's `h1` were already fixed in Tasks 2 and 3). Each fix below replaces an em dash used as a pause with either a colon (to introduce something) or a period (to split into two sentences), per §11's own guidance — never delete the dash and leave a run-on sentence.

- [ ] **Step 1: Fix the explanation paragraph in `app/[category]/[calculator]/page.tsx`**

Find this paragraph inside the `explanations` record (the first `<p>` under the `'elektroauto-vs-benzina'` key) and replace it exactly:

Before:
```tsx
      <p className="text-panel-muted">
        Kalkulators reizina tavu gada nobraukumu ar katra auto tipa patēriņu uz 100&nbsp;km un ar
        attiecīgo enerģijas cenu — atsevišķi elektroauto (kWh × €/kWh) un benzīna auto (L × €/L).
        Starpība starp abām gada summām ir tavs ietaupījums (vai papildu izmaksas), izvēloties elektroauto.
      </p>
```

After:
```tsx
      <p className="text-panel-muted">
        Kalkulators reizina tavu gada nobraukumu ar katra auto tipa patēriņu uz 100&nbsp;km un ar
        attiecīgo enerģijas cenu: elektroauto gadījumā kWh reizina ar €/kWh, benzīna auto gadījumā L
        reizina ar €/L. Starpība starp abām gada summām ir tavs ietaupījums (vai papildu izmaksas),
        izvēloties elektroauto.
      </p>
```

Everything else in that file (the second `<p>` with the worked-example intro, the `<ul>` with the three arithmetic lines, and all other code) stays exactly as it is — the `<ul>`'s minus sign ("1 942,50 € − 445,50 €") is arithmetic, not the punctuation dash this rule targets, and must not be changed.

- [ ] **Step 2: Fix the disclaimer paragraph in `components/calculators/ElektroautoVsBenzinaCalculator.tsx`**

Before:
```tsx
      <p className="text-xs text-panel-muted">
        Noklusējuma vērtības (2026. gada augusts): elektrība 0,18 €/kWh, benzīns 1,85 €/L — pielāgo tās
        savai situācijai un pašreizējām cenām.
      </p>
```

After:
```tsx
      <p className="text-xs text-panel-muted">
        Noklusējuma vērtības (2026. gada augusts): elektrība 0,18 €/kWh, benzīns 1,85 €/L. Pielāgo tās
        savai situācijai un pašreizējām cenām.
      </p>
```

- [ ] **Step 3: Fix `content/faq/elektroauto-vs-benzina.md`**

Replace the file's full contents with this (only the answers under the second and third headings changed; the first heading and its answer, and both other headings, are unchanged):

```md
### Vai elektroauto tiešām ir lētāks par benzīna auto?

Tas atkarīgs no gada nobraukuma un elektrības cenas, ko maksā par uzlādi. Lielākam nobraukumam elektroauto parasti izmaksā mazāk uz kilometru, jo elektrības cena par kWh ir zemāka nekā līdzvērtīgs daudzums benzīna.

### Kā tiek aprēķinātas gada izmaksas?

Kalkulators reizina gada nobraukumu ar patēriņu uz 100 km un ar enerģijas cenu, atsevišķi elektroauto un benzīna auto, un pieskaita jebkuras papildu gada izmaksas, ko norādi.

### Vai kalkulators ņem vērā EKII atbalstu vai apdrošināšanu?

Nē. Šis kalkulators salīdzina tikai enerģijas/degvielas izmaksas. EKII atbalsta un KASKO/OCTA izmaksas aprēķini savus kalkulatorus.
```

- [ ] **Step 4: Typecheck, run the FAQ test, and build**

Run: `npx tsc --noEmit`
Expected: PASS.

Run: `npm run test -- lib/faq.test.ts`
Expected: PASS — the test asserts the first question's exact text and that every entry has non-empty question/answer strings; it doesn't pin the second or third answer's exact wording, so this edit doesn't break it. Confirm by reading `lib/faq.test.ts` yourself before running, and if it turns out to assert exact text you're changing, that's a real conflict: stop and report BLOCKED rather than editing the test to match.

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "app/[category]/[calculator]/page.tsx" components/calculators/ElektroautoVsBenzinaCalculator.tsx content/faq/elektroauto-vs-benzina.md
git commit -m "fix: remove remaining dash-as-punctuation from live calculator copy"
```

---

### Task 5: Remove AdSlot, reorder CalculatorShell to the fixed layout

**Files:**
- Delete: `components/AdSlot.tsx`
- Modify: `components/CalculatorShell.tsx`

**Interfaces:**
- Consumes: `CalculatorMeta.intro` (Task 3).
- Produces: `CalculatorShell`'s new rendered order — no interface/prop changes, so nothing downstream needs updating.

- [ ] **Step 1: Delete `components/AdSlot.tsx`**

```bash
git rm components/AdSlot.tsx
```

- [ ] **Step 2: Rewrite `components/CalculatorShell.tsx`**

```tsx
import Link from 'next/link';
import type { CalculatorMeta, CategoryMeta } from '@/lib/registry';
import type { FaqEntry } from '@/lib/faq';
import { Faq } from './Faq';
import { RelatedCalculators } from './RelatedCalculators';

interface CalculatorShellProps {
  category: CategoryMeta;
  calculator: CalculatorMeta;
  faq: FaqEntry[];
  related: CalculatorMeta[];
  /** Plain-language formula explanation plus a worked example, required on every calculator page. */
  explanation: React.ReactNode;
  children: React.ReactNode;
}

export function CalculatorShell({
  category,
  calculator,
  faq,
  related,
  explanation,
  children,
}: CalculatorShellProps) {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-panel-muted">
        <Link href="/">Sākums</Link>
        {' / '}
        <Link href={`/${category.slug}`}>{category.title}</Link>
        {' / '}
        <span>{calculator.title}</span>
      </nav>

      <h1 className="font-mono text-2xl font-semibold">{calculator.h1}</h1>

      <p className="text-panel-muted">{calculator.intro}</p>

      {children}

      {/* Reserved for a future ad or affiliate placement (DESIGN-GUIDANCE.md sections 5 and 8).
          Kept empty and height-stable now so inserting real content later causes zero CLS. */}
      <div style={{ height: 250 }} aria-hidden="true" />

      <section aria-labelledby="explanation-heading" className="flex flex-col gap-3">
        <h2 id="explanation-heading" className="font-mono text-xl">
          Kā tiek aprēķināts
        </h2>
        {explanation}
      </section>

      <Faq items={faq} />

      <RelatedCalculators items={related} />

      {/* Reserved for a future footer ad or affiliate placement (DESIGN-GUIDANCE.md sections 5 and 8). */}
      <div style={{ height: 250 }} aria-hidden="true" />
    </main>
  );
}
```

- [ ] **Step 3: Typecheck and build**

Run: `npx tsc --noEmit`
Expected: PASS — confirms nothing else imports `AdSlot` anymore (if something does, this fails with a clear "module not found" and that call site needs fixing before continuing).

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: remove AdSlot, reorder CalculatorShell to the DESIGN-GUIDANCE.md layout"
```

---

### Task 6: Comparison-aware ResultCard tone, and the surface-2 input tier

**Files:**
- Modify: `components/ResultCard.tsx`
- Modify: `components/calculators/ElektroautoVsBenzinaCalculator.tsx`
- Modify: `components/NumberField.tsx`

**Interfaces:**
- Consumes: `--color-warn`, `--color-panel-surface-2` (Task 1).
- Produces: `ResultCard`'s new `tone: 'winner' | 'loser' | 'neutral'` prop (breaking change to its existing signature — the only caller is `ElektroautoVsBenzinaCalculator`, updated in the same task).

- [ ] **Step 1: Rewrite `components/ResultCard.tsx`**

```tsx
export type ResultCardTone = 'winner' | 'loser' | 'neutral';

interface ResultCardProps {
  label: string;
  value: string;
  tone: ResultCardTone;
  accentVar: string;
  sublabel?: string;
}

export function ResultCard({ label, value, tone, accentVar, sublabel }: ResultCardProps) {
  const color = tone === 'winner' ? accentVar : tone === 'loser' ? 'var(--color-warn)' : 'var(--color-panel-text)';

  return (
    <div className="rounded-lg border border-panel-border bg-panel-surface p-6" style={{ borderColor: color }}>
      <p className="text-sm text-panel-muted">{label}</p>
      <p className="font-mono text-4xl font-semibold" style={{ color }}>
        {value}
      </p>
      {sublabel ? <p className="mt-1 text-sm text-panel-muted">{sublabel}</p> : null}
    </div>
  );
}
```

- [ ] **Step 2: Update `components/calculators/ElektroautoVsBenzinaCalculator.tsx`**

Add a `tone` computation right after the existing `verdictLabel` computation, and pass it to `ResultCard`. This file was already edited in Task 4 (the disclaimer paragraph) — that edit and this one touch different, non-overlapping parts of the file, so apply this on top of the current file contents:

```tsx
  const verdictLabel =
    result.cheaperOption === 'ev'
      ? 'Elektroauto lētāks gadā'
      : result.cheaperOption === 'ice'
        ? 'Benzīna auto lētāks gadā'
        : 'Izmaksas ir vienādas';

  const tone: 'winner' | 'loser' | 'neutral' =
    result.cheaperOption === 'ev' ? 'winner' : result.cheaperOption === 'ice' ? 'loser' : 'neutral';
```

```tsx
      <ResultCard
        label={verdictLabel}
        value={formatCurrencyEUR(Math.abs(result.annualSavings))}
        tone={tone}
        accentVar={accentVar}
        sublabel={`5 gados: ${formatCurrencyEUR(Math.abs(result.fiveYearSavings))}`}
      />
```

- [ ] **Step 3: Update `components/NumberField.tsx` to use the inputs/insets tier**

Change the input wrapper's background class from `bg-panel-surface` to `bg-panel-surface-2` (this is the only change in the file):

```tsx
      <div className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2">
```

- [ ] **Step 4: Typecheck and build**

Run: `npx tsc --noEmit`
Expected: PASS.

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Manual verification of the tone logic**

Run: `npm run start`, open `http://localhost:3000/auto/elektroauto-vs-benzina` (or `curl` it and grep). With the default inputs, EV is cheaper, so the result card's border/value color should render as `var(--color-accent-auto)` (teal), not the amber warn color. Confirm by checking the rendered inline `style` attribute in the HTML contains `color:var(--color-accent-auto)` (or the resolved hex, depending on how React serializes it) on the value `<p>`, not `var(--color-warn)`. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add components/ResultCard.tsx components/calculators/ElektroautoVsBenzinaCalculator.tsx components/NumberField.tsx
git commit -m "feat: comparison-aware ResultCard tone (accent for the cheaper option, amber for the other, never red)"
```

---

### Task 7: Noindex empty category pages

**Files:**
- Modify: `app/[category]/page.tsx`

**Interfaces:**
- Consumes: `getCalculatorsByCategory` (already imported).
- Produces: nothing new downstream.

**Context:** Four of the five category pages currently have zero calculators and render a "coming soon" message. They're already excluded from `app/sitemap.ts` and unlinked from the homepage (from Checkpoint 1's final review fix wave), but they're still statically generated and technically crawlable if a bot finds the URL some other way. This closes that gap by explicitly marking them `noindex` while they're empty, without blocking Google from indexing them automatically once Checkpoint 2 populates a category (the metadata is computed per-request from the live calculator count, so it flips back to indexable the moment `getCalculatorsByCategory` returns a non-empty array).

- [ ] **Step 1: Update `generateMetadata` in `app/[category]/page.tsx`**

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const category = getCategory(resolvedParams.category);
  if (!category) return {};

  const isEmpty = getCalculatorsByCategory(category.slug).length === 0;

  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: `/${category.slug}` },
    robots: isEmpty ? { index: false, follow: true } : undefined,
  };
}
```

- [ ] **Step 2: Typecheck and build**

Run: `npx tsc --noEmit`
Expected: PASS.

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Verify via curl**

Run: `npm run start`, then `curl -s http://localhost:3000/finanses | grep -o '<meta name="robots"[^>]*>'` — expect to find `content="noindex, follow"` (or equivalent). Then `curl -s http://localhost:3000/auto | grep -o '<meta name="robots"[^>]*>'` — expect no match (populated category, no robots meta tag at all, which means the default indexable behavior applies). Stop the server.

- [ ] **Step 4: Commit**

```bash
git add "app/[category]/page.tsx"
git commit -m "feat: noindex category pages with zero calculators"
```

---

### Task 8: Legal pages and site-wide footer

**Files:**
- Create: `app/par-mums/page.tsx`
- Create: `app/kontakti/page.tsx`
- Create: `app/privatuma-politika/page.tsx`
- Create: `app/noteikumi/page.tsx`
- Create: `components/Footer.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `SITE_URL` (already imported in `app/layout.tsx`).
- Produces: four new routes; `Footer` component rendered once, site-wide.

- [ ] **Step 1: Create `app/par-mums/page.tsx`**

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Par mums',
  description: 'Par Manikalkulatori.lv un tā uzturētāju.',
  alternates: { canonical: '/par-mums' },
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
      <h1 className="font-mono text-2xl font-semibold">Par mums</h1>
      <p className="text-panel-muted">
        Manikalkulatori.lv ir Latvijas kalkulatoru vietne. Šeit atrodami praktiski rīki auto, finanšu,
        mājokļa, veselības un sporta aprēķiniem latviešu valodā.
      </p>
      <p className="text-panel-muted">
        Vietni uztur un saturu raksta viena persona ar reālu pieredzi tēmās, ko kalkulatori aptver.
        Katrs kalkulators balstās uz pašreizējiem Latvijas datiem un tiek regulāri atjaunināts.
      </p>
      <p className="text-panel-muted">
        Ja pamani neprecizitāti vai vēlies ierosināt jaunu kalkulatoru, raksti uz kontaktu lapā norādīto
        adresi.
      </p>
    </main>
  );
}
```

- [ ] **Step 2: Create `app/kontakti/page.tsx`**

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakti',
  description: 'Kontaktinformācija Manikalkulatori.lv jautājumiem un ierosinājumiem.',
  alternates: { canonical: '/kontakti' },
};

export default function ContactPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
      <h1 className="font-mono text-2xl font-semibold">Kontakti</h1>
      <p className="text-panel-muted">
        Jautājumus, ierosinājumus un labojumus sūti uz e-pastu: mail@endelis.co
      </p>
      <p className="text-panel-muted">Atbildi parasti saņemsi dažu darba dienu laikā.</p>
    </main>
  );
}
```

- [ ] **Step 3: Create `app/privatuma-politika/page.tsx`**

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privātuma politika',
  description: 'Kā Manikalkulatori.lv apstrādā datus.',
  alternates: { canonical: '/privatuma-politika' },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
      <h1 className="font-mono text-2xl font-semibold">Privātuma politika</h1>
      <p className="text-panel-muted">
        Šī privātuma politika apraksta, kādus datus Manikalkulatori.lv apstrādā un kā tie tiek izmantoti.
      </p>
      <h2 className="font-mono text-xl">Mitināšana</h2>
      <p className="text-panel-muted">
        Vietne darbojas uz Vercel infrastruktūras. Vercel apstrādā standarta servera žurnālus (IP
        adresi, pieprasījuma laiku, pārlūkprogrammas veidu) drošības un darbības nodrošināšanai.
      </p>
      <h2 className="font-mono text-xl">Analītika</h2>
      <p className="text-panel-muted">
        Apmeklējumu statistikai izmantojam Vercel Web Analytics. Šis rīks neizmanto sīkdatnes un
        neuzkrāj personu identificējošu informāciju, tikai apkopotus, anonimizētus datus par lapu
        apmeklējumiem.
      </p>
      <h2 className="font-mono text-xl">Sīkdatnes</h2>
      <p className="text-panel-muted">
        Šobrīd vietne nelieto izsekošanas vai reklāmas sīkdatnes. Ja nākotnē tiks pievienotas reklāmas,
        piemēram, Google AdSense, šī politika tiks atjaunināta un apmeklētājiem tiks lūgta piekrišana
        pirms sīkdatņu izmantošanas.
      </p>
      <h2 className="font-mono text-xl">Kalkulatoru dati</h2>
      <p className="text-panel-muted">
        Kalkulatoros ievadītie skaitļi tiek apstrādāti tikai tavā pārlūkprogrammā un netiek nosūtīti vai
        saglabāti serverī.
      </p>
      <h2 className="font-mono text-xl">Kontakti</h2>
      <p className="text-panel-muted">
        Jautājumus par datu apstrādi vari sūtīt uz kontaktu lapā norādīto e-pastu.
      </p>
      <p className="text-sm text-panel-faint">Šī politika pēdējo reizi atjaunināta 2026. gada augustā.</p>
    </main>
  );
}
```

- [ ] **Step 4: Create `app/noteikumi/page.tsx`**

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lietošanas noteikumi',
  description: 'Manikalkulatori.lv lietošanas noteikumi.',
  alternates: { canonical: '/noteikumi' },
};

export default function TermsPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
      <h1 className="font-mono text-2xl font-semibold">Lietošanas noteikumi</h1>
      <p className="text-panel-muted">Lietojot Manikalkulatori.lv, tu piekrīti šiem noteikumiem.</p>
      <ol className="list-decimal space-y-2 pl-5 text-panel-muted">
        <li>
          Kalkulatoru rezultāti ir orientējoši. Tie balstās uz tavis ievadītajiem datiem un vispārīgām
          formulām, nevis individuālu finanšu vai juridisku konsultāciju.
        </li>
        <li>
          Pirms svarīgu finanšu lēmumu pieņemšanas pārbaudi skaitļus pie attiecīgā pakalpojumu sniedzēja
          vai speciālista.
        </li>
        <li>
          Vietnes saturu drīkst brīvi lasīt un izmantot personīgām vajadzībām. Satura kopēšana citās
          vietnēs bez atsauces nav atļauta.
        </li>
        <li>
          Vietnes uzturētājs neuzņemas atbildību par zaudējumiem, kas radušies, paļaujoties tikai uz
          kalkulatoru rezultātiem.
        </li>
        <li>Noteikumi var tikt laiku pa laikam atjaunināti. Aktuālā versija vienmēr pieejama šajā lapā.</li>
      </ol>
    </main>
  );
}
```

- [ ] **Step 5: Create `components/Footer.tsx`**

```tsx
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mx-auto mt-16 flex max-w-3xl flex-col gap-3 border-t border-panel-border px-4 py-8 text-sm text-panel-muted">
      <nav aria-label="Juridiskā informācija" className="flex flex-wrap gap-x-4 gap-y-2">
        <Link href="/par-mums" className="hover:text-panel-text">
          Par mums
        </Link>
        <Link href="/kontakti" className="hover:text-panel-text">
          Kontakti
        </Link>
        <Link href="/privatuma-politika" className="hover:text-panel-text">
          Privātuma politika
        </Link>
        <Link href="/noteikumi" className="hover:text-panel-text">
          Lietošanas noteikumi
        </Link>
      </nav>
      <p>Manikalkulatori.lv, {new Date().getFullYear()}.</p>
    </footer>
  );
}
```

- [ ] **Step 6: Wire `Footer` into `app/layout.tsx`**

Add the import and render it after `{children}`, inside `<body>`:

```tsx
import { Footer } from '@/components/Footer';
```

```tsx
      <body className="min-h-screen antialiased">
        {children}
        <Footer />
      </body>
```

- [ ] **Step 7: Typecheck and build**

Run: `npx tsc --noEmit`
Expected: PASS.

Run: `npm run build`
Expected: PASS — check the route list includes `/par-mums`, `/kontakti`, `/privatuma-politika`, `/noteikumi` as new static routes.

- [ ] **Step 8: Commit**

```bash
git add app/par-mums app/kontakti app/privatuma-politika app/noteikumi components/Footer.tsx app/layout.tsx
git commit -m "feat: add legal pages and a site-wide footer"
```

---

### Task 9: Cookie consent banner

**Files:**
- Create: `lib/cookieConsent.ts`
- Create: `components/CookieBanner.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `hasCookieConsent(): boolean`, `setCookieConsent(): void` (pure `localStorage` wrappers, no test required — this project's testing convention, established in Checkpoint 1, is unit tests for calculator compute modules only; UI/utility code is gated by typecheck, build, and manual verification, which this task follows in Step 3).

**Context:** The site sets no tracking cookies today (Vercel Web Analytics is cookieless). This banner is honest about that current state and exists so the consent mechanism is already wired and tested before AdSense (which will need it) arrives later.

- [ ] **Step 1: Create `lib/cookieConsent.ts`**

```ts
const STORAGE_KEY = 'manikalkulatori-cookie-consent';

export function hasCookieConsent(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    // Storage unavailable (private browsing, disabled storage) — treat as
    // already acknowledged rather than blocking the page on a banner that
    // can never be dismissed.
    return true;
  }
}

export function setCookieConsent(): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // Same fallback as above: if storage is unavailable, the banner will
    // simply reappear on the next visit, which is an acceptable outcome.
  }
}
```

- [ ] **Step 2: Create `components/CookieBanner.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { hasCookieConsent, setCookieConsent } from '@/lib/cookieConsent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasCookieConsent());
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-panel-border bg-panel-surface px-4 py-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-panel-muted">
          Šī vietne pašlaik neizmanto izsekošanas sīkdatnes. Analītikai izmantojam Vercel Web Analytics,
          kas nesaglabā sīkdatnes tavā ierīcē. Vairāk lasi{' '}
          <a
            href="/privatuma-politika"
            className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
          >
            privātuma politikā
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            setCookieConsent();
            setVisible(false);
          }}
          className="shrink-0 rounded-md border border-panel-border-strong px-4 py-2 text-sm font-semibold text-panel-text hover:border-panel-text"
        >
          Sapratu
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Wire `CookieBanner` into `app/layout.tsx`**

Add the import and render it after `<Footer />`:

```tsx
import { CookieBanner } from '@/components/CookieBanner';
```

```tsx
      <body className="min-h-screen antialiased">
        {children}
        <Footer />
        <CookieBanner />
      </body>
```

- [ ] **Step 4: Typecheck and build**

Run: `npx tsc --noEmit`
Expected: PASS.

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Manual verification**

Run: `npm run start`, open `http://localhost:3000/` in a way you can inspect (or `curl` the HTML — the banner is a client component so its visibility logic runs in the browser, but confirm the component's markup/script is present in the bundle and no build/console errors occur). Note in your report that full interactive verification (banner appears on first visit, dismiss button hides it and persists across reload) needs a real browser, which you don't have — say so explicitly rather than claiming it, consistent with this project's established practice from Checkpoint 1's verification task. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add lib/cookieConsent.ts components/CookieBanner.tsx app/layout.tsx
git commit -m "feat: add an honest cookie consent banner ahead of future ad cookies"
```

---

### Task 10: End-to-end verification gate

**Files:** none (verification only).

**Context:** This task folds in three specific checks the project owner asked for on top of the normal build/test gate: (1) a robots/noindex/canonical audit across the live page types, (2) confirming the calculator page still has its explanation, worked example, and FAQ after the Task 5 reorder, and (3) confirming the footer and cookie banner are actually wired in and reachable. It also confirms the dash fixes from Tasks 2 through 4 are actually live.

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: PASS — same test files as before this plan (nothing in this plan added a new `*.test.ts` file; Task 3 confirmed the registry tests still pass with the new `intro` field, and Task 4 confirmed the FAQ test still passes with the edited answers).

- [ ] **Step 2: Typecheck the whole project**

Run: `npx tsc --noEmit`
Expected: PASS, no errors.

- [ ] **Step 3: Full production build**

Run: `npm run build`
Expected: PASS. Route list includes: `/`, all 5 category routes, `/auto/elektroauto-vs-benzina`, `/sitemap.xml`, `/robots.txt`, `/par-mums`, `/kontakti`, `/privatuma-politika`, `/noteikumi`, plus the existing custom 404 — all static, nothing dynamic.

- [ ] **Step 4: robots / noindex / canonical audit**

Run: `npm run start`, then for each of these paths, `curl -s http://localhost:3000/<path>` and grep for `<link rel="canonical"` and `<meta name="robots"`:
- `/` — canonical present (`/`), no robots meta tag (default indexable).
- `/auto` — canonical present (`/auto`), no robots meta tag (populated category, default indexable).
- `/finanses` (or any empty category) — canonical present (`/finanses`), robots meta tag present with `noindex` (Task 7).
- `/auto/elektroauto-vs-benzina` — canonical present (`/auto/elektroauto-vs-benzina`), no robots meta tag.
- `/par-mums`, `/kontakti`, `/privatuma-politika`, `/noteikumi` — each has its own canonical, no robots meta tag.

Also fetch `/robots.txt` and confirm it still allows `/` and references `/sitemap.xml`, and fetch `/sitemap.xml` and confirm it still lists exactly the homepage, the one populated category (`/auto`), and the one calculator (empty categories correctly absent, per Checkpoint 1's existing behavior — this plan didn't touch `app/sitemap.ts`, just confirm it's still correct).

- [ ] **Step 5: Explanation, worked example, FAQ, and dash-fix presence on the live calculator page**

`curl -s http://localhost:3000/auto/elektroauto-vs-benzina` and confirm all of the following are present in the HTML:
- The heading "Kā tiek aprēķināts".
- The worked-example figures `445,50` and `1 942,50` and `1 497,00` (the three sourced-defaults figures from Checkpoint 1, unchanged by this plan).
- The FAQ heading and at least one question from `content/faq/elektroauto-vs-benzina.md`.
- Exactly 3 `<script type="application/ld+json">` blocks (unchanged from Checkpoint 1).
- The one-line intro from Task 3 ("Ievadi savus skaitļus...").
- The h1 reading "Elektroauto vai benzīna auto: kas izmaksā lētāk?" (colon, not em dash).

Also confirm the DOM order is correct: the explanation section now comes after the (invisible) first reserved gap and before the FAQ, matching `DESIGN-GUIDANCE.md` §5 — check that the heading "Kā tiek aprēķināts" appears in the HTML source AFTER the calculator's `NumberField` inputs and BEFORE the FAQ heading.

Then confirm no em dash (—) or en dash (–) appears anywhere in the page's visible text: `curl -s http://localhost:3000/auto/elektroauto-vs-benzina | grep -c '—\|–'` should report `0`. If it reports anything nonzero, find where and fix it before completing this task (report BLOCKED with specifics if the source isn't obvious).

- [ ] **Step 6: Footer and cookie banner wiring**

`curl -s http://localhost:3000/` and confirm the footer's four links (`/par-mums`, `/kontakti`, `/privatuma-politika`, `/noteikumi`) and the cookie banner's "Sapratu" button text are present in the page HTML (the banner's visibility is client-side JS-driven, but its markup should be in the initial HTML either way since it's rendered unconditionally by React before the `useEffect` hides it — confirm this is the actual behavior you observe, and note if it differs). Confirm the footer appears on a non-homepage route too (e.g. `/auto/elektroauto-vs-benzina`) since it's rendered from the root layout, not per-page.

Stop the server when done with Steps 4 through 6.

- [ ] **Step 7: Final commit**

```bash
git add -A
git status
git commit -m "chore: instrument panel redesign complete" --allow-empty
```

(Use `--allow-empty` only if Step 6's checks surfaced no code changes; otherwise commit the real fix first.)

---

## Self-Review Notes

- **Spec coverage:** color/type system (§3, §4 → Tasks 1, 2), fixed layout order (§5 → Task 5), AdSlot removal / reserved gaps (§6, §8 → Task 5), comparison semantics never-red rule (§3 → Task 6), content-voice dash rule including pre-existing violations (§11 → Tasks 2, 3, 4, verified in Task 10), noindex audit (project owner's explicit ask → Task 7, verified in Task 10), explanation/example/FAQ still present after the reorder (project owner's explicit ask → verified in Task 10), legal footer + cookie banner (project owner's explicit ask → Tasks 8, 9). The homepage category grid (§10 point 3) is already correct from Checkpoint 1's fix wave and inherits the new tokens automatically with no code change needed — verified visually as part of Task 10's manual checks rather than given its own task, since there's nothing to build.
- **Deferred, not in this plan:** actual AdSense/affiliate integration (still explicitly out of scope per `DESIGN-GUIDANCE.md` §8), Google Search Console setup and sitemap submission (handled separately, outside this plan, since it's an external-service task with no code to write).
- **Placeholder scan:** no TBDs; every step contains complete, runnable file contents or exact verification commands.
- **Type consistency:** `ResultCardTone` (Task 6) is used only by `ResultCard` and `ElektroautoVsBenzinaCalculator`, both updated in the same task. `CalculatorMeta.intro` (Task 3) is read only by `CalculatorShell` (Task 5), which receives the whole `calculator` object, not the field individually, so no signature drift is possible.
- **Sequencing check for files touched by more than one task:** `components/calculators/ElektroautoVsBenzinaCalculator.tsx` is touched by Task 4 (disclaimer paragraph) and Task 6 (tone/ResultCard call) — confirmed the two edits target different, non-overlapping regions of the file, so applying them in task order (4 then 6) is safe and neither task's shown "before" snippet goes stale. `app/layout.tsx` is touched by Tasks 2, 8, and 9, each adding one more piece (fonts, then Footer, then CookieBanner) without removing what the previous task added — confirmed each task's snippet only shows the specific lines it adds, not a full-file rewrite that could silently drop an earlier task's work.
