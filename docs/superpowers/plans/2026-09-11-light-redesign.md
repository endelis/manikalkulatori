# Light Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dark "instrument panel" aesthetic with a light, warm, card-based
design, and add site-wide navigation (which does not exist today), across all 63 live
calculator pages without touching any per-calculator file.

**Architecture:** Every calculator page is built from shared primitives
(`NumberField`, `ToggleField`, `ResultCard`, `Breakdown`, `CalculatorShell`, `Faq`,
`RelatedCalculators`) plus CSS custom properties in `styles/tokens.css` consumed
through `tailwind.config.ts`'s `panel`/`accent`/`warn` color namespaces. Retoning the
tokens and restyling the ~9 shared components/pages restyles the whole site at once.
One new component (`SiteNav`, with a small `MobileNavToggle` client island) adds
navigation that plugs into `app/layout.tsx`.

**Tech Stack:** Next.js 15.5.23 App Router, TypeScript, Tailwind CSS 3, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-11-light-redesign-design.md`

## Global Constraints

- No font change: keep `IBM Plex Sans` (UI text) and `JetBrains Mono` (hero numbers
  only, via `font-mono`).
- No calculator-specific file (`lib/calculators/*.ts`, `components/calculators/*.tsx`)
  may be touched by this plan — if a task seems to need one, stop and re-check against
  the spec's Non-goals before proceeding.
- No `contentUpdatedAt` bump anywhere in `lib/registry.ts` — this plan changes no
  calculator's rendered numbers or copy, only shared chrome.
- Keep all existing CSS variable and Tailwind class names (`panel-*`, `accent-*`,
  `warn`) — change values only, never rename.
- No dash or hyphen used as punctuation in any new visible Latvian copy (`CLAUDE.md`
  "Dashes, hyphens, and the minus sign"). This plan introduces exactly one new piece of
  copy (the homepage intro sentence in Task 11) — write it dash-clean.
- `npx tsc --noEmit`, `npm run build`, and `npm test` (full suite) must stay green
  throughout; run all three once at the end per `CHARTER.md`'s deploy-checklist
  pattern, not after every task.

---

### Task 1: Color tokens and light color scheme

**Files:**
- Modify: `styles/tokens.css`
- Modify: `app/globals.css:8`

**Interfaces:**
- Produces: new values for every `--color-panel-*` and `--color-accent-*` variable,
  consumed by every component in Tasks 2-11 via existing Tailwind classes
  (`bg-panel-surface`, `text-panel-muted`, etc.) — no class names change, so this task
  alone will make every existing page render with (incorrectly laid out, but correctly
  colored) light tokens, useful as a visual checkpoint before the later tasks fix
  layout/shape.

- [ ] **Step 1: Replace `styles/tokens.css`**

```css
:root {
  --color-panel-bg: #FAFAF9;
  --color-panel-surface: #FFFFFF;
  --color-panel-surface-2: #F3F2F0;
  --color-panel-border: #E7E5E2;
  --color-panel-border-strong: #D6D3CE;
  --color-panel-text: #1C1917;
  --color-panel-muted: #57534E;
  --color-panel-faint: #78716C;

  --color-accent-auto: #0D9488;
  --color-accent-finanses: #2563EB;
  --color-accent-majoklis: #B45309;
  --color-accent-veseliba: #DB2777;
  --color-accent-sports: #16A34A;
  --color-accent-sabiedriba: #7C3AED;

  --color-warn: #B45309;
}
```

- [ ] **Step 2: Update `app/globals.css`**

Change line 8 from:
```css
html {
  color-scheme: dark;
}
```
to:
```css
html {
  color-scheme: light;
}
```

- [ ] **Step 3: Verify the build still compiles**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed with no errors (this task only changes CSS variable values,
no TypeScript or JSX changes).

- [ ] **Step 4: Commit**

```bash
git add styles/tokens.css app/globals.css
git commit -m "style: retone tokens.css to light color scheme"
```

---

### Task 2: Restyle CalculatorShell (spacing, breadcrumb)

**Files:**
- Modify: `components/CalculatorShell.tsx`

**Interfaces:**
- Consumes: nothing new (same props as today: `category`, `calculator`, `faq`,
  `related`, `explanation`, `limitations`, `sources`, `children`)
- Produces: no interface change — every calculator component that renders inside
  `<CalculatorShell>` keeps working unmodified.

- [ ] **Step 1: Update the outer spacing and breadcrumb classes**

In `components/CalculatorShell.tsx`, change the `<main>` className from
`"mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8"` to
`"mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10"`, and change the breadcrumb `<nav>`
className from `"text-sm text-panel-muted"` to `"text-sm text-panel-faint"` (breadcrumbs
are now a secondary wayfinding cue now that `SiteNav` exists — Task 9 — so they drop one
tone level).

Full updated component:

```tsx
import Link from 'next/link';
import type { CalculatorMeta, CategoryMeta } from '@/lib/registry';
import type { FaqEntry } from '@/lib/faq';
import { Faq } from './Faq';
import { RelatedCalculators } from './RelatedCalculators';

// Ads launch around month 3 (see DESIGN-GUIDANCE.md sections 5 and 8). This constant is
// the single place to restore real reserved height across every calculator page at once
// when that happens — until then there's no zero-CLS benefit to holding empty space open.
const RESERVED_AD_HEIGHT = 0;

interface CalculatorShellProps {
  category: CategoryMeta;
  calculator: CalculatorMeta;
  faq: FaqEntry[];
  related: CalculatorMeta[];
  /** Plain-language formula explanation plus a worked example, required on every calculator page. */
  explanation: React.ReactNode;
  /**
   * Optional "Ko šis kalkulators neņem vērā" section, rendered between the explanation
   * and sources when provided. Omit entirely (do not pass the prop) for a calculator
   * that has nothing to disclose; existing calculators that predate this prop render
   * exactly as before.
   */
  limitations?: React.ReactNode;
  /**
   * Optional "Avoti" section, rendered between limitations and FAQ when provided, for
   * calculators that cite real external sources for their default values. Omit for a
   * calculator with no cited constants.
   */
  sources?: React.ReactNode;
  children: React.ReactNode;
}

export function CalculatorShell({
  category,
  calculator,
  faq,
  related,
  explanation,
  limitations,
  sources,
  children,
}: CalculatorShellProps) {
  return (
    <main
      className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10"
      style={{ '--accent': category.accentVar } as React.CSSProperties}
    >
      <nav aria-label="Breadcrumb" className="text-sm text-panel-faint">
        <Link href="/">Sākums</Link>
        {' / '}
        <Link href={`/${category.slug}`}>{category.title}</Link>
        {' / '}
        <span>{calculator.title}</span>
      </nav>

      <h1 className="font-sans text-h1">{calculator.h1}</h1>

      <p className="text-panel-muted">{calculator.intro}</p>

      {children}

      {/* Reserved for a future ad or affiliate placement (DESIGN-GUIDANCE.md sections 5 and 8).
          Kept empty and height-stable now so inserting real content later causes zero CLS. */}
      <div style={{ height: RESERVED_AD_HEIGHT }} aria-hidden="true" />

      <section aria-labelledby="explanation-heading" className="flex flex-col gap-3">
        <h2 id="explanation-heading" className="font-sans text-h2">
          Kā tiek aprēķināts
        </h2>
        {explanation}
      </section>

      {limitations ? (
        <section aria-labelledby="limitations-heading" className="flex flex-col gap-3">
          <h2 id="limitations-heading" className="font-sans text-h2">
            Ko šis kalkulators neņem vērā
          </h2>
          {limitations}
        </section>
      ) : null}

      {sources ? (
        <section aria-labelledby="sources-heading" className="flex flex-col gap-3">
          <h2 id="sources-heading" className="font-sans text-h2">
            Avoti
          </h2>
          {sources}
        </section>
      ) : null}

      <Faq items={faq} />

      <RelatedCalculators items={related} />

      {/* Reserved for a future footer ad or affiliate placement (DESIGN-GUIDANCE.md sections 5 and 8). */}
      <div style={{ height: RESERVED_AD_HEIGHT }} aria-hidden="true" />
    </main>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/CalculatorShell.tsx
git commit -m "style: more breathing room and secondary breadcrumb tone in CalculatorShell"
```

---

### Task 3: Restyle Footer

**Files:**
- Modify: `components/Footer.tsx`

**Interfaces:**
- No props, no interface change.

- [ ] **Step 1: Replace `components/Footer.tsx`**

```tsx
'use client';

import Link from 'next/link';
import { reopenCookieBanner } from '@/lib/cookieConsent';

export function Footer() {
  return (
    <footer className="mx-auto mt-16 flex max-w-2xl flex-col gap-3 border-t border-panel-border px-4 py-10 text-sm text-panel-faint">
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
        <button type="button" onClick={reopenCookieBanner} className="hover:text-panel-text">
          Sīkdatņu iestatījumi
        </button>
      </nav>
      <p>Manikalkulatori.lv, {new Date().getFullYear()}.</p>
    </footer>
  );
}
```

(Only the `<footer>` className changed: `text-panel-muted` → `text-panel-faint`,
`py-8` → `py-10`, to match the new secondary-tone/spacing convention from Task 2.)

- [ ] **Step 2: Commit**

```bash
git add components/Footer.tsx
git commit -m "style: match Footer spacing and tone to the light redesign"
```

---

### Task 4: Restyle Faq

**Files:**
- Modify: `components/Faq.tsx`

**Interfaces:**
- No prop change (`FaqProps { items: FaqEntry[] }` stays identical).

- [ ] **Step 1: Replace `components/Faq.tsx`**

```tsx
import type { FaqEntry } from '@/lib/faq';

interface FaqProps {
  items: FaqEntry[];
}

export function Faq({ items }: FaqProps) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="flex flex-col gap-4">
      <h2 id="faq-heading" className="font-sans text-h2">
        Biežāk uzdotie jautājumi
      </h2>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <details
            key={item.question}
            className="rounded-xl border border-panel-border bg-panel-surface p-5 shadow-sm"
          >
            <summary className="cursor-pointer font-medium">{item.question}</summary>
            <p className="mt-2 text-sm text-panel-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
```

(Changes: `rounded-md` → `rounded-xl`, `p-4` → `p-5`, added `shadow-sm`.)

- [ ] **Step 2: Commit**

```bash
git add components/Faq.tsx
git commit -m "style: card treatment for Faq entries"
```

---

### Task 5: Restyle ResultCard

**Files:**
- Modify: `components/ResultCard.tsx`

**Interfaces:**
- No prop change (`ResultCardProps` identical: `label`, `value`, `tone`, `accentVar`,
  `sublabel`).

- [ ] **Step 1: Replace `components/ResultCard.tsx`**

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
    <div className="reveal rounded-2xl border bg-panel-surface p-7 shadow-sm" style={{ borderColor: color }}>
      <p className="text-sm text-panel-muted">{label}</p>
      <p className="font-mono text-hero" style={{ color }}>
        {value}
      </p>
      {sublabel ? <p className="mt-1 text-sm text-panel-muted">{sublabel}</p> : null}
    </div>
  );
}
```

(Changes: `rounded-lg` → `rounded-2xl`, `p-6` → `p-7`, added `shadow-sm`.)

- [ ] **Step 2: Commit**

```bash
git add components/ResultCard.tsx
git commit -m "style: elevate ResultCard with shadow and larger radius"
```

---

### Task 6: Restyle NumberField and ToggleField

**Files:**
- Modify: `components/NumberField.tsx`
- Modify: `components/ToggleField.tsx`

**Interfaces:**
- No prop changes to either component.

- [ ] **Step 1: Replace `components/NumberField.tsx`**

```tsx
'use client';

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberField({ id, label, value, onChange, unit, min = 0, max, step = 1 }: NumberFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-label uppercase text-panel-muted">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-xl border border-panel-border-strong bg-panel-surface-2 px-3 py-2.5 transition-colors duration-[120ms] focus-within:border-panel-text">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          className="w-full bg-transparent font-mono text-lg text-panel-text outline-none"
          value={Number.isNaN(value) ? '' : value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            const next = event.target.valueAsNumber;
            onChange(Number.isNaN(next) ? 0 : next);
          }}
        />
        {unit ? <span className="text-sm text-panel-muted">{unit}</span> : null}
      </div>
    </div>
  );
}
```

(Changes: `rounded-md` → `rounded-xl`, `border-panel-border` → `border-panel-border-strong`
as the resting state — on a light surface a hairline `--color-panel-border` disappears
against `--color-panel-surface-2`, so the input needs the stronger border to read as an
input at rest, not just on interaction; `py-2` → `py-2.5`; added
`focus-within:border-panel-text` so focus is visible beyond the global `:focus-visible`
outline.)

- [ ] **Step 2: Replace `components/ToggleField.tsx`**

```tsx
'use client';

interface ToggleFieldProps {
  id: string;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  trueLabel: string;
  falseLabel: string;
}

export function ToggleField({ id, label, value, onChange, trueLabel, falseLabel }: ToggleFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <span id={`${id}-label`} className="text-label uppercase text-panel-muted">
        {label}
      </span>
      <div role="group" aria-labelledby={`${id}-label`} className="flex gap-2">
        <button
          type="button"
          aria-pressed={!value}
          onClick={() => onChange(false)}
          className={`flex-1 rounded-xl border px-3 py-2.5 text-sm transition-colors duration-[120ms] ${
            !value
              ? 'border-panel-border-strong bg-panel-surface-2 text-panel-text'
              : 'border-panel-border bg-panel-surface text-panel-muted'
          }`}
        >
          {falseLabel}
        </button>
        <button
          type="button"
          aria-pressed={value}
          onClick={() => onChange(true)}
          className={`flex-1 rounded-xl border px-3 py-2.5 text-sm transition-colors duration-[120ms] ${
            value
              ? 'border-panel-border-strong bg-panel-surface-2 text-panel-text'
              : 'border-panel-border bg-panel-surface text-panel-muted'
          }`}
        >
          {trueLabel}
        </button>
      </div>
    </div>
  );
}
```

(Changes: `rounded-md` → `rounded-xl`, `py-2` → `py-2.5`, matching `NumberField`.)

- [ ] **Step 3: Commit**

```bash
git add components/NumberField.tsx components/ToggleField.tsx
git commit -m "style: stronger resting borders and larger radius for input controls"
```

---

### Task 7: Restyle Breakdown

**Files:**
- Modify: `components/Breakdown.tsx`

**Interfaces:**
- No prop change (`BreakdownProps { rows: BreakdownRow[] }` identical).

- [ ] **Step 1: Replace `components/Breakdown.tsx`**

```tsx
interface BreakdownRow {
  label: string;
  value: string;
}

interface BreakdownProps {
  rows: BreakdownRow[];
}

export function Breakdown({ rows }: BreakdownProps) {
  return (
    <dl className="divide-y divide-panel-border rounded-xl border border-panel-border bg-panel-surface shadow-sm">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
          <dt className="text-sm text-panel-muted">{row.label}</dt>
          <dd className="font-mono text-value text-panel-text">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
```

(Changes: `rounded-lg` → `rounded-xl`, added `shadow-sm`, `py-2` → `py-2.5`.)

- [ ] **Step 2: Commit**

```bash
git add components/Breakdown.tsx
git commit -m "style: card treatment for Breakdown rows"
```

---

### Task 8: RelatedCalculators as a card grid

**Files:**
- Modify: `components/RelatedCalculators.tsx`

**Interfaces:**
- No prop change (`RelatedCalculatorsProps { items: CalculatorMeta[] }` identical).
- `CalculatorMeta` (from `lib/registry.ts`) already has `.slug`, `.category`, `.title`,
  `.intro` — all used below, none new.

- [ ] **Step 1: Replace `components/RelatedCalculators.tsx`**

```tsx
import Link from 'next/link';
import type { CalculatorMeta } from '@/lib/registry';

interface RelatedCalculatorsProps {
  items: CalculatorMeta[];
}

export function RelatedCalculators({ items }: RelatedCalculatorsProps) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="flex flex-col gap-3">
      <h2 id="related-heading" className="font-sans text-h2">
        Saistītie kalkulatori
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/${item.category}/${item.slug}`}
            className="flex flex-col gap-1 rounded-xl border border-panel-border bg-panel-surface p-4 shadow-sm transition-shadow duration-[120ms] hover:shadow"
          >
            <span className="font-medium text-panel-text">{item.title}</span>
            <span className="text-sm text-panel-faint">{item.intro}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: no errors (no new fields used beyond existing `CalculatorMeta` properties).

- [ ] **Step 3: Commit**

```bash
git add components/RelatedCalculators.tsx
git commit -m "feat: card grid for RelatedCalculators instead of a link list"
```

---

### Task 9: Add SiteNav

**Files:**
- Create: `components/SiteNav.tsx`
- Create: `components/MobileNavToggle.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `categories` array from `lib/registry.ts` (`{ slug, title, accentVar }[]`,
  already exported today).
- Produces: `SiteNav` (server component, default export style matches the codebase's
  named-export convention: `export function SiteNav()`), rendered with no props.
  `MobileNavToggle` takes one prop: `categories: { slug: string; title: string }[]`.

- [ ] **Step 1: Create `components/MobileNavToggle.tsx`**

This is the only client-interactive piece of the nav — an isolated island so `SiteNav`
itself can stay a server component.

```tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

interface MobileNavToggleProps {
  categories: { slug: string; title: string }[];
}

export function MobileNavToggle({ categories }: MobileNavToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-panel-border text-panel-text"
      >
        <span className="sr-only">Izvēlne</span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open ? (
        <div
          id="mobile-nav-panel"
          className="absolute inset-x-0 top-full flex flex-col gap-1 border-t border-panel-border bg-panel-surface p-4 shadow-sm"
        >
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-panel-text hover:bg-panel-surface-2"
            >
              {category.title}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Create `components/SiteNav.tsx`**

```tsx
import Link from 'next/link';
import { categories } from '@/lib/registry';
import { MobileNavToggle } from './MobileNavToggle';

export function SiteNav() {
  return (
    <header className="sticky top-0 z-10 border-b border-panel-border bg-panel-surface">
      <div className="relative mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-sans text-lg font-semibold text-panel-text">
          Manikalkulatori.lv
        </Link>
        <nav aria-label="Kategorijas" className="hidden gap-5 sm:flex">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className="text-sm text-panel-muted transition-colors duration-[120ms] hover:text-panel-text"
            >
              {category.title}
            </Link>
          ))}
        </nav>
        <MobileNavToggle categories={categories.map(({ slug, title }) => ({ slug, title }))} />
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Wire `SiteNav` into `app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { CookieBanner } from '@/components/CookieBanner';
import { Footer } from '@/components/Footer';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { SiteNav } from '@/components/SiteNav';
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
      <body className="min-h-screen antialiased">
        <SiteNav />
        {children}
        <Footer />
        <Analytics />
        <GoogleAnalytics />
        <CookieBanner />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed. `SiteNav` is a new server component with no client hooks of
its own; `MobileNavToggle` carries the `'use client'` boundary correctly.

- [ ] **Step 5: Commit**

```bash
git add components/SiteNav.tsx components/MobileNavToggle.tsx app/layout.tsx
git commit -m "feat: add site-wide navigation header"
```

---

### Task 10: Restyle the homepage

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- No new exports; `HomePage` stays a default export with no props (Next.js page
  convention).
- Uses `categories` and `getCalculatorsByCategory` from `lib/registry.ts` and
  `pluralizeKalkulatori` from `lib/format.ts` — all already imported today, no new
  functions needed.

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { categories, getCalculatorsByCategory } from '@/lib/registry';
import { pluralizeKalkulatori } from '@/lib/format';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="font-sans text-h1">Manikalkulatori.lv</h1>
        <p className="text-panel-muted">
          Bezmaksas kalkulatori auto, finanšu, mājokļa, veselības un sporta jautājumiem latviešu valodā.
          Katrs kalkulators parāda rezultātu uzreiz, bez reģistrēšanās.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map((category) => {
          const count = getCalculatorsByCategory(category.slug).length;
          const cardClassName =
            'flex flex-col gap-1 rounded-2xl border border-panel-border bg-panel-surface p-6 shadow-sm transition-shadow duration-[120ms]';

          // Categories without calculators are shown but not linked — an empty category
          // page is thin content, so we do not send visitors (or crawlers) there yet.
          if (count === 0) {
            return (
              <div key={category.slug} className={`${cardClassName} opacity-60`}>
                <h2 className="font-mono text-lg" style={{ color: category.accentVar }}>
                  {category.title}
                </h2>
                <p className="text-sm text-panel-muted">{category.description}</p>
                <p className="text-xs text-panel-faint">Drīzumā</p>
              </div>
            );
          }

          return (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className={`${cardClassName} hover:shadow`}
              style={{ borderColor: category.accentVar }}
            >
              <h2 className="font-mono text-lg" style={{ color: category.accentVar }}>
                {category.title}
              </h2>
              <p className="text-sm text-panel-muted">{category.description}</p>
              <p className="text-xs text-panel-faint">{pluralizeKalkulatori(count)}</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
```

(Changes: `gap-8`→ kept but outer `py-12` kept, added one dash-clean intro sentence
"Katrs kalkulators parāda rezultātu uzreiz, bez reģistrēšanās." — restates the
"answer before interaction" principle for visitors, not just crawlers; card treatment
`rounded-lg` → `rounded-2xl`, `p-5` → `p-6`, added `shadow-sm`/`hover:shadow`; the
"Drīzumā"/count captions move from `text-panel-muted` to `text-panel-faint` to match
the new muted/faint convention from Task 2.)

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "style: card treatment and intro line for the homepage"
```

---

### Task 11: Category page as a card grid

**Files:**
- Modify: `app/[category]/page.tsx`

**Interfaces:**
- No new exports; same `generateStaticParams`/`generateMetadata`/default export shape.
- Uses `CalculatorMeta.intro` (already exists) for the card description — truncated to
  the first 80 characters at a word boundary, matching the spec's "first ~80 characters
  of its `intro`" instruction.

- [ ] **Step 1: Add a small truncation helper and replace the calculator list with a card grid**

Replace the full contents of `app/[category]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { categories, getCalculatorsByCategory, getCategory } from '@/lib/registry';

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

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

function truncateAtWord(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  const category = getCategory(resolvedParams.category);
  if (!category) notFound();

  const categoryCalculators = getCalculatorsByCategory(category.slug);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-panel-faint">
        <Link href="/">Sākums</Link>
        {' / '}
        <span>{category.title}</span>
      </nav>

      <header className="flex flex-col gap-2">
        <h1 className="font-sans text-h1" style={{ color: category.accentVar }}>
          {category.title}
        </h1>
        <p className="text-panel-muted">{category.description}</p>
      </header>

      {categoryCalculators.length === 0 ? (
        <p className="rounded-xl border border-panel-border bg-panel-surface p-5 text-panel-muted shadow-sm">
          Šajā kategorijā drīzumā būs pieejami kalkulatori.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categoryCalculators.map((calculator) => (
            <Link
              key={calculator.slug}
              href={`/${category.slug}/${calculator.slug}`}
              className="flex flex-col gap-1 rounded-2xl border border-panel-border bg-panel-surface p-5 shadow-sm transition-shadow duration-[120ms] hover:shadow"
            >
              <span className="font-medium text-panel-text">{calculator.title}</span>
              <span className="text-sm text-panel-faint">{truncateAtWord(calculator.intro, 80)}</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed; `generateStaticParams` still produces the same 6 category
routes as before, so the build's static page count should be unchanged from the
pre-task baseline.

- [ ] **Step 3: Commit**

```bash
git add "app/[category]/page.tsx"
git commit -m "feat: card grid for category pages instead of a link list"
```

---

### Task 12: Full verification pass

**Files:** none (verification only)

**Interfaces:** none.

- [ ] **Step 1: Run the full deploy checklist**

Run in order:
```bash
npx tsc --noEmit
npm run build
npm test
```
Expected: all three succeed. `npm test` should show the same total test count as
before this plan started (no test was added or removed) — if
`lib/calculatorContentDrift.test.ts` fails on any calculator, that means a change
leaked into a per-calculator file somewhere in Tasks 1-11 and must be found and
reverted to a shared file instead (see Global Constraints).

- [ ] **Step 2: Manual contrast check**

Using a contrast checker (e.g. WebAIM's), verify against both `#FAFAF9`
(`--color-panel-bg`) and `#FFFFFF` (`--color-panel-surface`):
- `--color-panel-text` (#1C1917) — expect well over AA (near-black on near-white).
- `--color-panel-muted` (#57534E) — expect AA pass for normal text (≥4.5:1).
- `--color-panel-faint` (#78716C) — expect AA pass for normal text (≥4.5:1); if it
  falls short, darken this token slightly (e.g. to `#6B6560`) and re-check — it is used
  for real caption/label text, not decorative-only content, so it must clear 4.5:1, not
  the lower 3:1 bar for large text or non-text UI elements.
- Each of the 6 `--color-accent-*` values as text color on both backgrounds — expect
  AA pass; if any falls short, darken that one value by another step (e.g. `-600` →
  `-700` in the Tailwind palette it was drawn from) and re-check.

If any token needs adjustment, edit `styles/tokens.css` again and re-run Step 1.

- [ ] **Step 3: Manual visual QA with the dev server**

Use the `run` skill (or `npm run dev` directly) and check in a browser:
- Homepage (`/`) — category card grid renders, hover states work.
- One category page with several calculators (`/auto`) — card grid, descriptions
  truncate sensibly.
- One calculator page with a comparison-tone result
  (`/auto/elektroauto-vs-benzina`) — confirms the `winner`/`loser`/`neutral`
  `ResultCard` tones (accent green/teal vs `--color-warn` amber) are distinguishable
  and legible on the new light surface.
- `SiteNav` on both desktop width and a ~400px mobile width — the hamburger opens the
  category panel and each link navigates and closes the panel.
- Resize through the mobile breakpoint to confirm no horizontal scroll appears anywhere
  (`CLAUDE.md`/responsive expectations already required this; the redesign must not
  regress it).

- [ ] **Step 4: Push**

```bash
git push origin master
```

(Each task already committed individually; this step ships whichever commits from
Tasks 1-11 have not yet been pushed, in one batch, after this verification pass
confirms the combined result is correct — matches `CHARTER.md`'s "run the checklist
once per push, not once per commit" guidance.)

---

## Self-review notes

- **Spec coverage:** color tokens (Task 1), shape/elevation (Tasks 3-8, 10-11),
  `color-scheme` (Task 1), navigation (Task 9), breadcrumb tone (Task 2), homepage
  (Task 10), category page (Task 11), related calculators (Task 8), testing/contrast/QA
  (Task 12) — every spec section maps to a task.
- **No calculator files touched** — confirmed no task in this plan modifies anything
  under `lib/calculators/` or `components/calculators/`.
- **Type consistency** — `SiteNav` and `MobileNavToggle` prop shapes match between
  their definition (Task 9 Step 1-2) and call site (`SiteNav` passing
  `categories.map(({ slug, title }) => ({ slug, title }))` into
  `MobileNavToggle`'s `{ slug: string; title: string }[]`).
