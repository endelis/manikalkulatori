# Checkpoint 1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Next.js 15 foundation for manikalkulatori.lv — registry, formatting, JSON-LD, shared UI shell, static routing, sitemap/robots — and wire up exactly one real calculator (`elektroauto-vs-benzina`, EV vs. ICE annual cost) end to end, matching Checkpoint 1 of `PROJECT-OVERVIEW.md` §9.

**Architecture:** Fully static Next.js 15 App Router site. `lib/registry.ts` is the single source of truth for calculator/category metadata (slug, title, meta description, keywords, FAQ slug) — nothing about a calculator is hardcoded a second time anywhere else. Compute lives in `lib/calculators/<slug>.ts` as pure, dependency-free functions (inputs in, typed result out); a small parallel `components/calculators/registry.tsx` maps a slug to its interactive UI component, since each calculator has a different input shape that the data-only registry deliberately does not encode. Category and calculator pages are generated via `generateStaticParams` reading the registry; sitemap/robots are generated from the same registry.

**Tech Stack:** Next.js 15 (App Router, TypeScript, `output: 'standalone'`), Tailwind CSS 3, Vitest for unit tests, no database/auth/server-side fetching — all math runs client-side.

**Spec:** `PROJECT-OVERVIEW.md` (repo root) — see especially §3 (tech stack), §4 (repo shape), §6 (backend/architecture pillar), §7 (UI/UX pillar), §8 (SEO pillar), §9 Checkpoint 1.

**Scope note:** This plan covers **Checkpoint 1 only** (foundation + the single `elektroauto-vs-benzina` calculator). Per the spec's own instruction ("stop for my review at each checkpoint"), Checkpoints 2–4 (the remaining 49 calculators) get their own follow-up plans once this one is built and reviewed. The `PROJECT-OVERVIEW.md` repo-shape diagram names the app folder `kalkulators/`; this plan treats the existing `manikalkulatori.lv/` directory (which already holds `PROJECT-OVERVIEW.md`) as the repo root itself rather than nesting one level deeper, since that's where the spec file already lives.

**Architecture rule resolution:** §4's tree comment says calculator files hold "inputs, compute, meta," but §6/§9 state the non-negotiable rule that `lib/registry.ts` is the single source of truth for metadata and that compute modules are pure functions with "no side effects, no DOM." This plan follows §6/§9 (the explicit architecture rule) over the looser §4 tree comment: metadata lives only in `lib/registry.ts`, compute modules export pure functions only.

## Global Constraints

- Next.js 15, App Router, TypeScript, static generation only — no ISR unless explicitly requested later.
- Tailwind CSS, no component library, custom design tokens (CSS variables in `styles/tokens.css`).
- No database, no auth, no server-side data fetching. All calculator math runs client-side in pure functions.
- `lib/registry.ts` is the single source of truth. Sitemap, homepage grid, category pages, breadcrumbs, and related-calculator blocks must all derive from it. Never hardcode a calculator list anywhere else.
- Each calculator's math lives in `lib/calculators/<slug>.ts` as a pure, exported, unit-testable function: typed inputs in, typed structured result out. No DOM, no side effects.
- Pages are statically generated via `generateStaticParams` from the registry.
- Every calculator page ships JSON-LD: `SoftwareApplication`, `BreadcrumbList`, `FAQPage` (builders in `lib/schema.ts`).
- All numbers formatted via `lib/format.ts` using `lv-LV` locale and EUR.
- Ad slots (`components/AdSlot.tsx`) reserve a fixed height so they never cause layout shift; placeholder content only for now.
- Dark instrument-panel aesthetic: charcoal background, one accent color per category, monospace for figures, clean sans for labels.
- The result headline updates live on every input change with sensible defaults visible on load; no "Calculate" button.
- Mobile-first, visible focus states, `prefers-reduced-motion` respected.
- Do not invent or assert any Latvian tax rate, grant amount, or insurer rate not given in the spec. `elektroauto-vs-benzina` sidesteps this: every price/consumption figure is a user-editable input with a labeled default, never asserted as an authoritative current rate.
- Write a unit test for each compute module.
- Since the site is 100% static, `npm run build` succeeding (all routes prerendered) is the correctness gate for pages/routes; Vitest covers pure-logic modules (`format`, `schema`, `registry`, `faq`, compute modules). `npx tsc --noEmit` gates component/prop typing before routes exist to consume them.

---

### Task 1: Project scaffolding & tooling

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `next-env.d.ts`
- Create: `.eslintrc.json`
- Create: `.gitignore`
- Create: `vitest.config.ts`
- Test: `tests/smoke.test.ts`

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `start`, `lint`, `test`, `test:watch`; path alias `@/*` → repo root (used by every later task's imports).

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "manikalkulatori",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.0",
    "eslint-config-next": "^15.1.0",
    "postcss": "^8.5.0",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Write `next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
};

export default nextConfig;
```

- [ ] **Step 4: Write `next-env.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

- [ ] **Step 5: Write `.eslintrc.json`**

```json
{
  "extends": "next/core-web-vitals"
}
```

- [ ] **Step 6: Write `.gitignore`**

```
/node_modules
/.next/
/out/
/build
/coverage
.DS_Store
*.pem
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.env*.local
*.tsbuildinfo
```

- [ ] **Step 7: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

- [ ] **Step 8: Write the toolchain smoke test**

```ts
// tests/smoke.test.ts
import { describe, expect, it } from 'vitest';

describe('toolchain smoke test', () => {
  it('runs TypeScript and Vitest together', () => {
    const value: number = 1 + 1;
    expect(value).toBe(2);
  });
});
```

- [ ] **Step 9: Install dependencies**

Run: `npm install`
Expected: installs without errors.

- [ ] **Step 10: Run the smoke test**

Run: `npm run test`
Expected: PASS — `tests/smoke.test.ts` passes.

- [ ] **Step 11: Initialize git and commit**

```bash
git init
git add package.json tsconfig.json next.config.mjs next-env.d.ts .eslintrc.json .gitignore vitest.config.ts tests/smoke.test.ts PROJECT-OVERVIEW.md
git commit -m "chore: scaffold Next.js 15 + TypeScript + Tailwind + Vitest"
```

---

### Task 2: Tailwind, design tokens, root layout

**Files:**
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `styles/tokens.css`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx` (temporary placeholder — replaced in Task 11)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: CSS variables (`--color-panel-bg`, `--color-panel-surface`, `--color-panel-border`, `--color-panel-text`, `--color-panel-muted`, `--color-accent-auto`, `--color-accent-finanses`, `--color-accent-majoklis`, `--color-accent-veseliba`, `--color-accent-sports`, `--font-mono`, `--font-sans`) and matching Tailwind utilities (`bg-panel-surface`, `text-panel-muted`, `border-panel-border`, etc.) used by every component task below.

- [ ] **Step 1: Write `tailwind.config.ts`**

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
          border: 'var(--color-panel-border)',
          text: 'var(--color-panel-text)',
          muted: 'var(--color-panel-muted)',
        },
        accent: {
          auto: 'var(--color-accent-auto)',
          finanses: 'var(--color-accent-finanses)',
          majoklis: 'var(--color-accent-majoklis)',
          veseliba: 'var(--color-accent-veseliba)',
          sports: 'var(--color-accent-sports)',
        },
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

- [ ] **Step 2: Write `postcss.config.js`**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 3: Write `styles/tokens.css`**

```css
:root {
  --color-panel-bg: #0b0e11;
  --color-panel-surface: #14181d;
  --color-panel-border: #232a31;
  --color-panel-text: #e6e9ec;
  --color-panel-muted: #8b95a1;

  --color-accent-auto: #4fd1c5;
  --color-accent-finanses: #f6ad55;
  --color-accent-majoklis: #68d391;
  --color-accent-veseliba: #fc8181;
  --color-accent-sports: #63b3ed;

  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

- [ ] **Step 4: Write `app/globals.css`**

```css
@import '../styles/tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  color-scheme: dark;
}

body {
  background-color: var(--color-panel-bg);
  color: var(--color-panel-text);
  font-family: var(--font-sans);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

:focus-visible {
  outline: 2px solid var(--color-accent-auto);
  outline-offset: 2px;
}
```

- [ ] **Step 5: Write `app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://manikalkulatori.lv'),
  title: {
    default: 'Manikalkulatori.lv — kalkulatori latviešu valodā',
    template: '%s | Manikalkulatori.lv',
  },
  description:
    'Bezmaksas kalkulatori auto, finanšu, mājokļa, veselības un sporta jautājumiem latviešu valodā.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lv">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Write a temporary placeholder homepage**

```tsx
// app/page.tsx — temporary, replaced in Task 11
export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="font-mono text-2xl">Manikalkulatori.lv</h1>
      <p className="text-panel-muted">Foundation scaffold running.</p>
    </main>
  );
}
```

- [ ] **Step 7: Verify the build**

Run: `npm run build`
Expected: PASS — builds the single placeholder route with no CSS/type errors.

- [ ] **Step 8: Commit**

```bash
git add tailwind.config.ts postcss.config.js styles/tokens.css app/globals.css app/layout.tsx app/page.tsx
git commit -m "feat: add Tailwind, design tokens, and root layout"
```

---

### Task 3: `lib/format.ts` — lv-LV number formatting

**Files:**
- Create: `lib/format.ts`
- Test: `lib/format.test.ts`

**Interfaces:**
- Produces: `formatCurrencyEUR(value: number, opts?: { maximumFractionDigits?: number }): string`, `formatNumber(value: number, decimals?: number): string`, `formatPercent(value: number, decimals?: number): string` — used by every calculator UI component and `Breakdown`/`ResultCard` consumers from Task 8 onward.

- [ ] **Step 1: Write the failing tests**

```ts
// lib/format.test.ts
import { describe, expect, it } from 'vitest';
import { formatCurrencyEUR, formatNumber, formatPercent } from './format';

describe('formatCurrencyEUR', () => {
  it('formats a whole euro amount with the euro sign', () => {
    const result = formatCurrencyEUR(1234);
    expect(result).toContain('€');
    expect(result).toMatch(/1[\s ]234,00/);
  });

  it('formats a fractional amount with two decimals by default', () => {
    expect(formatCurrencyEUR(9.5)).toMatch(/9,50/);
  });

  it('respects a custom maximumFractionDigits', () => {
    const result = formatCurrencyEUR(9.567, { maximumFractionDigits: 0 });
    expect(result).toContain('10');
    expect(result).not.toMatch(/,\d/);
  });
});

describe('formatNumber', () => {
  it('formats an integer with thousands separators and no decimals by default', () => {
    expect(formatNumber(12345)).toMatch(/12[\s ]345/);
  });

  it('formats with the requested number of decimals', () => {
    expect(formatNumber(12.3, 2)).toMatch(/12,30/);
  });
});

describe('formatPercent', () => {
  it('formats a percentage value with one decimal by default', () => {
    expect(formatPercent(42.5)).toMatch(/42,5\s?%/);
  });

  it('formats with a custom decimal count', () => {
    expect(formatPercent(7, 0)).toMatch(/7\s?%/);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test -- lib/format.test.ts`
Expected: FAIL with "Cannot find module './format'"

- [ ] **Step 3: Write the implementation**

```ts
// lib/format.ts
export function formatCurrencyEUR(value: number, opts?: { maximumFractionDigits?: number }): string {
  return new Intl.NumberFormat('lv-LV', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: opts?.maximumFractionDigits ?? 2,
  }).format(value);
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('lv-LV', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return new Intl.NumberFormat('lv-LV', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test -- lib/format.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/format.ts lib/format.test.ts
git commit -m "feat: add lv-LV number and currency formatting"
```

---

### Task 4: `lib/schema.ts` — JSON-LD builders

**Files:**
- Create: `lib/schema.ts`
- Test: `lib/schema.test.ts`

**Interfaces:**
- Produces: `buildSoftwareApplicationSchema(input: { name: string; description: string; url: string; category: string })`, `buildBreadcrumbSchema(items: { name: string; url: string }[])`, `buildFaqSchema(items: { question: string; answer: string }[])` — consumed by `app/[category]/[calculator]/page.tsx` in Task 10.

- [ ] **Step 1: Write the failing tests**

```ts
// lib/schema.test.ts
import { describe, expect, it } from 'vitest';
import { buildBreadcrumbSchema, buildFaqSchema, buildSoftwareApplicationSchema } from './schema';

describe('buildSoftwareApplicationSchema', () => {
  it('builds a schema.org SoftwareApplication node', () => {
    const schema = buildSoftwareApplicationSchema({
      name: 'Elektroauto vs benzīna auto izmaksas',
      description: 'Salīdzini elektroauto un benzīna auto ekspluatācijas izmaksas.',
      url: 'https://manikalkulatori.lv/auto/elektroauto-vs-benzina',
      category: 'FinanceApplication',
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('SoftwareApplication');
    expect(schema.name).toBe('Elektroauto vs benzīna auto izmaksas');
    expect(schema.url).toBe('https://manikalkulatori.lv/auto/elektroauto-vs-benzina');
    expect(schema.offers).toEqual({ '@type': 'Offer', price: '0', priceCurrency: 'EUR' });
  });
});

describe('buildBreadcrumbSchema', () => {
  it('builds an ordered BreadcrumbList', () => {
    const schema = buildBreadcrumbSchema([
      { name: 'Sākums', url: 'https://manikalkulatori.lv' },
      { name: 'Auto', url: 'https://manikalkulatori.lv/auto' },
    ]);

    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Sākums',
      item: 'https://manikalkulatori.lv',
    });
    expect(schema.itemListElement[1].position).toBe(2);
  });
});

describe('buildFaqSchema', () => {
  it('builds a FAQPage schema from question/answer pairs', () => {
    const schema = buildFaqSchema([
      { question: 'Kas ir EKII atbalsts?', answer: 'Valsts atbalsts elektroauto iegādei.' },
    ]);

    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity[0]).toEqual({
      '@type': 'Question',
      name: 'Kas ir EKII atbalsts?',
      acceptedAnswer: { '@type': 'Answer', text: 'Valsts atbalsts elektroauto iegādei.' },
    });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test -- lib/schema.test.ts`
Expected: FAIL with "Cannot find module './schema'"

- [ ] **Step 3: Write the implementation**

```ts
// lib/schema.ts
export interface SoftwareApplicationSchemaInput {
  name: string;
  description: string;
  url: string;
  category: string;
}

export function buildSoftwareApplicationSchema(input: SoftwareApplicationSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: input.name,
    description: input.description,
    url: input.url,
    applicationCategory: input.category,
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface FaqSchemaItem {
  question: string;
  answer: string;
}

export function buildFaqSchema(items: FaqSchemaItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test -- lib/schema.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/schema.ts lib/schema.test.ts
git commit -m "feat: add JSON-LD schema builders"
```

---

### Task 5: `lib/registry.ts` — categories, calculators, helpers

**Files:**
- Create: `lib/registry.ts`
- Test: `lib/registry.test.ts`

**Interfaces:**
- Consumes: nothing (pure data module).
- Produces: `CategorySlug`, `CategoryMeta`, `CalculatorMeta` types; `categories: CategoryMeta[]`; `calculators: CalculatorMeta[]`; `getCategory(slug)`, `getCalculatorsByCategory(categorySlug)`, `getCalculator(categorySlug, calculatorSlug)`, `getRelatedCalculators(current, limit?)` — consumed by every page/component task from Task 8 onward.

- [ ] **Step 1: Write the failing tests**

```ts
// lib/registry.test.ts
import { describe, expect, it } from 'vitest';
import {
  calculators,
  categories,
  getCalculator,
  getCalculatorsByCategory,
  getCategory,
  getRelatedCalculators,
} from './registry';

describe('getCategory', () => {
  it('finds a category by slug', () => {
    expect(getCategory('auto')?.title).toBe('Auto un transports');
  });

  it('returns undefined for an unknown slug', () => {
    expect(getCategory('nezinams')).toBeUndefined();
  });
});

describe('getCalculatorsByCategory', () => {
  it('returns only calculators in the given category', () => {
    const result = getCalculatorsByCategory('auto');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((calc) => calc.category === 'auto')).toBe(true);
  });
});

describe('getCalculator', () => {
  it('finds a calculator by category and slug', () => {
    const calc = getCalculator('auto', 'elektroauto-vs-benzina');
    expect(calc?.title).toBe('Elektroauto vs benzīna auto izmaksas');
  });

  it('returns undefined when the category does not match', () => {
    expect(getCalculator('finanses', 'elektroauto-vs-benzina')).toBeUndefined();
  });
});

describe('getRelatedCalculators', () => {
  it('excludes the current calculator itself', () => {
    const current = calculators[0];
    const related = getRelatedCalculators(current);
    expect(related.every((calc) => calc.slug !== current.slug)).toBe(true);
  });

  it('respects the limit argument', () => {
    const current = calculators[0];
    const related = getRelatedCalculators(current, 0);
    expect(related).toHaveLength(0);
  });
});

describe('categories', () => {
  it('defines exactly the five top-level categories from the spec', () => {
    expect(categories.map((c) => c.slug).sort()).toEqual(
      ['auto', 'finanses', 'majoklis', 'sports', 'veseliba'].sort(),
    );
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test -- lib/registry.test.ts`
Expected: FAIL with "Cannot find module './registry'"

- [ ] **Step 3: Write the implementation**

```ts
// lib/registry.ts
export type CategorySlug = 'auto' | 'finanses' | 'majoklis' | 'veseliba' | 'sports';

export interface CategoryMeta {
  slug: CategorySlug;
  title: string;
  description: string;
  accentVar: string;
}

export interface CalculatorMeta {
  slug: string;
  category: CategorySlug;
  title: string;
  h1: string;
  metaDescription: string;
  keywords: string[];
}

export const categories: CategoryMeta[] = [
  {
    slug: 'auto',
    title: 'Auto un transports',
    description: 'Kalkulatori auto izmaksām, apdrošināšanai un līzingam.',
    accentVar: 'var(--color-accent-auto)',
  },
  {
    slug: 'finanses',
    title: 'Finanses un nodokļi',
    description: 'Algas, kredītu un nodokļu kalkulatori.',
    accentVar: 'var(--color-accent-finanses)',
  },
  {
    slug: 'majoklis',
    title: 'Mājoklis un enerģija',
    description: 'Solāro paneļu, apkures un elektrības kalkulatori.',
    accentVar: 'var(--color-accent-majoklis)',
  },
  {
    slug: 'veseliba',
    title: 'Veselība un ķermenis',
    description: 'ĶMI, kaloriju un veselības kalkulatori.',
    accentVar: 'var(--color-accent-veseliba)',
  },
  {
    slug: 'sports',
    title: 'Izturība un sports',
    description: 'Skriešanas, riteņbraukšanas un peldēšanas kalkulatori.',
    accentVar: 'var(--color-accent-sports)',
  },
];

export const calculators: CalculatorMeta[] = [
  {
    slug: 'elektroauto-vs-benzina',
    category: 'auto',
    title: 'Elektroauto vs benzīna auto izmaksas',
    h1: 'Elektroauto vai benzīna auto — kas izmaksā lētāk?',
    metaDescription:
      'Salīdzini elektroauto un benzīna auto gada ekspluatācijas izmaksas pēc nobraukuma, patēriņa un enerģijas cenas.',
    keywords: ['elektroauto vs benzīns', 'elektroauto izmaksas', 'ev vs ice kalkulators'],
  },
];

export function getCategory(slug: string): CategoryMeta | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getCalculatorsByCategory(categorySlug: string): CalculatorMeta[] {
  return calculators.filter((calculator) => calculator.category === categorySlug);
}

export function getCalculator(categorySlug: string, calculatorSlug: string): CalculatorMeta | undefined {
  return calculators.find(
    (calculator) => calculator.category === categorySlug && calculator.slug === calculatorSlug,
  );
}

export function getRelatedCalculators(current: CalculatorMeta, limit = 4): CalculatorMeta[] {
  return calculators
    .filter((calculator) => calculator.category === current.category && calculator.slug !== current.slug)
    .slice(0, limit);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test -- lib/registry.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/registry.ts lib/registry.test.ts
git commit -m "feat: add calculator/category registry as single source of truth"
```

---

### Task 6: `lib/calculators/elektroauto-vs-benzina.ts` — EV vs ICE compute module

**Files:**
- Create: `lib/calculators/elektroauto-vs-benzina.ts`
- Test: `lib/calculators/elektroauto-vs-benzina.test.ts`

**Interfaces:**
- Produces: `EvVsIceInput`, `EvVsIceResult` types and `computeEvVsIce(input: EvVsIceInput): EvVsIceResult` — consumed by `components/calculators/ElektroautoVsBenzinaCalculator.tsx` in Task 9.

- [ ] **Step 1: Write the failing tests**

```ts
// lib/calculators/elektroauto-vs-benzina.test.ts
import { describe, expect, it } from 'vitest';
import { computeEvVsIce } from './elektroauto-vs-benzina';

describe('computeEvVsIce', () => {
  it('picks the EV as cheaper when energy cost per km is lower', () => {
    const result = computeEvVsIce({
      annualDistanceKm: 15000,
      evConsumptionKwhPer100km: 17,
      electricityPricePerKwh: 0.2,
      iceConsumptionLPer100km: 6.5,
      fuelPricePerLiter: 1.65,
    });

    expect(result.evAnnualEnergyCost).toBeCloseTo(510, 5);
    expect(result.iceAnnualFuelCost).toBeCloseTo(1608.75, 5);
    expect(result.cheaperOption).toBe('ev');
    expect(result.annualSavings).toBeCloseTo(1098.75, 5);
    expect(result.fiveYearSavings).toBeCloseTo(5493.75, 5);
  });

  it('picks the ICE car as cheaper when its total cost is lower', () => {
    const result = computeEvVsIce({
      annualDistanceKm: 5000,
      evConsumptionKwhPer100km: 17,
      electricityPricePerKwh: 0.5,
      iceConsumptionLPer100km: 4,
      fuelPricePerLiter: 1.2,
    });

    expect(result.cheaperOption).toBe('ice');
    expect(result.annualSavings).toBeLessThan(0);
  });

  it('reports equal when annual total costs match within a cent', () => {
    const result = computeEvVsIce({
      annualDistanceKm: 10000,
      evConsumptionKwhPer100km: 20,
      electricityPricePerKwh: 0.1,
      iceConsumptionLPer100km: 5,
      fuelPricePerLiter: 0.4,
    });

    expect(result.evAnnualEnergyCost).toBeCloseTo(result.iceAnnualFuelCost, 5);
    expect(result.cheaperOption).toBe('equal');
  });

  it('adds optional annual extra costs to each side before comparing', () => {
    const result = computeEvVsIce({
      annualDistanceKm: 10000,
      evConsumptionKwhPer100km: 20,
      electricityPricePerKwh: 0.1,
      iceConsumptionLPer100km: 5,
      fuelPricePerLiter: 0.4,
      evAnnualExtraCosts: 300,
      iceAnnualExtraCosts: 0,
    });

    expect(result.evAnnualTotalCost).toBeCloseTo(result.evAnnualEnergyCost + 300, 5);
    expect(result.cheaperOption).toBe('ice');
  });

  it('returns all zeros and equal for zero annual distance', () => {
    const result = computeEvVsIce({
      annualDistanceKm: 0,
      evConsumptionKwhPer100km: 17,
      electricityPricePerKwh: 0.2,
      iceConsumptionLPer100km: 6.5,
      fuelPricePerLiter: 1.65,
    });

    expect(result.evAnnualEnergyCost).toBe(0);
    expect(result.iceAnnualFuelCost).toBe(0);
    expect(result.cheaperOption).toBe('equal');
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test -- lib/calculators/elektroauto-vs-benzina.test.ts`
Expected: FAIL with "Cannot find module './elektroauto-vs-benzina'"

- [ ] **Step 3: Write the implementation**

```ts
// lib/calculators/elektroauto-vs-benzina.ts
export interface EvVsIceInput {
  annualDistanceKm: number;
  evConsumptionKwhPer100km: number;
  electricityPricePerKwh: number;
  iceConsumptionLPer100km: number;
  fuelPricePerLiter: number;
  evAnnualExtraCosts?: number;
  iceAnnualExtraCosts?: number;
}

export interface EvVsIceResult {
  evAnnualEnergyCost: number;
  iceAnnualFuelCost: number;
  evAnnualTotalCost: number;
  iceAnnualTotalCost: number;
  annualSavings: number;
  cheaperOption: 'ev' | 'ice' | 'equal';
  fiveYearSavings: number;
}

export function computeEvVsIce(input: EvVsIceInput): EvVsIceResult {
  const evAnnualExtraCosts = input.evAnnualExtraCosts ?? 0;
  const iceAnnualExtraCosts = input.iceAnnualExtraCosts ?? 0;

  const evAnnualEnergyCost =
    (input.annualDistanceKm / 100) * input.evConsumptionKwhPer100km * input.electricityPricePerKwh;
  const iceAnnualFuelCost =
    (input.annualDistanceKm / 100) * input.iceConsumptionLPer100km * input.fuelPricePerLiter;

  const evAnnualTotalCost = evAnnualEnergyCost + evAnnualExtraCosts;
  const iceAnnualTotalCost = iceAnnualFuelCost + iceAnnualExtraCosts;

  const annualSavings = iceAnnualTotalCost - evAnnualTotalCost;

  let cheaperOption: EvVsIceResult['cheaperOption'] = 'equal';
  if (annualSavings > 0.005) cheaperOption = 'ev';
  else if (annualSavings < -0.005) cheaperOption = 'ice';

  return {
    evAnnualEnergyCost,
    iceAnnualFuelCost,
    evAnnualTotalCost,
    iceAnnualTotalCost,
    annualSavings,
    cheaperOption,
    fiveYearSavings: annualSavings * 5,
  };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test -- lib/calculators/elektroauto-vs-benzina.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/calculators/elektroauto-vs-benzina.ts lib/calculators/elektroauto-vs-benzina.test.ts
git commit -m "feat: add EV vs ICE annual cost compute module"
```

---

### Task 7: `lib/faq.ts` loader + FAQ content for `elektroauto-vs-benzina`

**Files:**
- Create: `content/faq/elektroauto-vs-benzina.md`
- Create: `lib/faq.ts`
- Test: `lib/faq.test.ts`

**Interfaces:**
- Produces: `FaqEntry { question: string; answer: string }`, `loadFaq(slug: string): FaqEntry[]` — consumed by `components/Faq.tsx` (Task 8) and `app/[category]/[calculator]/page.tsx` (Task 10).

- [ ] **Step 1: Write the FAQ content file**

```md
### Vai elektroauto tiešām ir lētāks par benzīna auto?

Tas atkarīgs no gada nobraukuma un elektrības cenas, ko maksā par uzlādi. Lielākam nobraukumam elektroauto parasti izmaksā mazāk uz kilometru, jo elektrības cena par kWh ir zemāka nekā līdzvērtīgs daudzums benzīna.

### Kā tiek aprēķinātas gada izmaksas?

Kalkulators reizina gada nobraukumu ar patēriņu uz 100 km un ar enerģijas cenu — atsevišķi elektroauto un benzīna auto — un pieskaita jebkuras papildu gada izmaksas, ko norādi.

### Vai kalkulators ņem vērā EKII atbalstu vai apdrošināšanu?

Nē — šis kalkulators salīdzina tikai enerģijas/degvielas izmaksas. EKII atbalsta un KASKO/OCTA izmaksas aprēķini savus kalkulatorus.
```

Save as: `content/faq/elektroauto-vs-benzina.md`

- [ ] **Step 2: Write the failing tests**

```ts
// lib/faq.test.ts
import { describe, expect, it } from 'vitest';
import { loadFaq } from './faq';

describe('loadFaq', () => {
  it('parses the elektroauto-vs-benzina FAQ file into question/answer pairs', () => {
    const entries = loadFaq('elektroauto-vs-benzina');

    expect(entries.length).toBeGreaterThanOrEqual(3);
    expect(entries[0].question).toBe('Vai elektroauto tiešām ir lētāks par benzīna auto?');
    expect(entries[0].answer.length).toBeGreaterThan(0);
    entries.forEach((entry) => {
      expect(entry.question.length).toBeGreaterThan(0);
      expect(entry.answer.length).toBeGreaterThan(0);
    });
  });

  it('throws when the FAQ file does not exist', () => {
    expect(() => loadFaq('does-not-exist')).toThrow();
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm run test -- lib/faq.test.ts`
Expected: FAIL with "Cannot find module './faq'"

- [ ] **Step 4: Write the implementation**

```ts
// lib/faq.ts
import fs from 'node:fs';
import path from 'node:path';

export interface FaqEntry {
  question: string;
  answer: string;
}

export function loadFaq(slug: string): FaqEntry[] {
  const filePath = path.join(process.cwd(), 'content', 'faq', `${slug}.md`);
  const raw = fs.readFileSync(filePath, 'utf-8');

  return raw
    .split(/^### /m)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [question, ...rest] = block.split('\n');
      return {
        question: question.trim(),
        answer: rest.join('\n').trim(),
      };
    });
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm run test -- lib/faq.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add content/faq/elektroauto-vs-benzina.md lib/faq.ts lib/faq.test.ts
git commit -m "feat: add FAQ markdown loader and elektroauto-vs-benzina FAQ content"
```

---

### Task 8: Shared presentational components

**Files:**
- Create: `components/NumberField.tsx`
- Create: `components/ResultCard.tsx`
- Create: `components/Breakdown.tsx`
- Create: `components/AdSlot.tsx`
- Create: `components/Faq.tsx`
- Create: `components/RelatedCalculators.tsx`
- Create: `components/CalculatorShell.tsx`

**Interfaces:**
- Consumes: `CategoryMeta`, `CalculatorMeta` from `lib/registry.ts` (Task 5); `FaqEntry` from `lib/faq.ts` (Task 7).
- Produces: `NumberField`, `ResultCard`, `Breakdown`, `AdSlot`, `Faq`, `RelatedCalculators`, `CalculatorShell` components consumed by Task 9 (calculator UI) and Task 10 (routes).

- [ ] **Step 1: Write `components/NumberField.tsx`**

```tsx
'use client';

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  step?: number;
}

export function NumberField({ id, label, value, onChange, unit, min = 0, step = 1 }: NumberFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm text-panel-muted">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface px-3 py-2">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          className="w-full bg-transparent font-mono text-lg text-panel-text outline-none"
          value={Number.isNaN(value) ? '' : value}
          min={min}
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

- [ ] **Step 2: Write `components/ResultCard.tsx`**

```tsx
interface ResultCardProps {
  label: string;
  value: string;
  accentVar: string;
  sublabel?: string;
}

export function ResultCard({ label, value, accentVar, sublabel }: ResultCardProps) {
  return (
    <div className="rounded-lg border border-panel-border bg-panel-surface p-6" style={{ borderColor: accentVar }}>
      <p className="text-sm text-panel-muted">{label}</p>
      <p className="font-mono text-4xl font-semibold" style={{ color: accentVar }}>
        {value}
      </p>
      {sublabel ? <p className="mt-1 text-sm text-panel-muted">{sublabel}</p> : null}
    </div>
  );
}
```

- [ ] **Step 3: Write `components/Breakdown.tsx`**

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
    <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">{row.label}</dt>
          <dd className="font-mono text-sm text-panel-text">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
```

- [ ] **Step 4: Write `components/AdSlot.tsx`**

```tsx
interface AdSlotProps {
  minHeight: number;
  label?: string;
}

export function AdSlot({ minHeight, label = 'Reklāma' }: AdSlotProps) {
  return (
    <div
      className="flex items-center justify-center rounded-md border border-dashed border-panel-border text-xs text-panel-muted"
      style={{ minHeight }}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}
```

- [ ] **Step 5: Write `components/Faq.tsx`**

```tsx
import type { FaqEntry } from '@/lib/faq';

interface FaqProps {
  items: FaqEntry[];
}

export function Faq({ items }: FaqProps) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="flex flex-col gap-4">
      <h2 id="faq-heading" className="font-mono text-xl">
        Biežāk uzdotie jautājumi
      </h2>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <details key={item.question} className="rounded-md border border-panel-border bg-panel-surface p-4">
            <summary className="cursor-pointer font-medium">{item.question}</summary>
            <p className="mt-2 text-sm text-panel-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Write `components/RelatedCalculators.tsx`**

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
      <h2 id="related-heading" className="font-mono text-xl">
        Saistītie kalkulatori
      </h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/${item.category}/${item.slug}`}
              className="text-panel-text underline decoration-panel-border underline-offset-4 hover:decoration-current"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 7: Write `components/CalculatorShell.tsx`**

```tsx
import Link from 'next/link';
import type { CalculatorMeta, CategoryMeta } from '@/lib/registry';
import type { FaqEntry } from '@/lib/faq';
import { AdSlot } from './AdSlot';
import { Faq } from './Faq';
import { RelatedCalculators } from './RelatedCalculators';

interface CalculatorShellProps {
  category: CategoryMeta;
  calculator: CalculatorMeta;
  faq: FaqEntry[];
  related: CalculatorMeta[];
  children: React.ReactNode;
}

export function CalculatorShell({ category, calculator, faq, related, children }: CalculatorShellProps) {
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

      {children}

      <AdSlot minHeight={250} />

      <Faq items={faq} />

      <RelatedCalculators items={related} />

      <AdSlot minHeight={250} />
    </main>
  );
}
```

- [ ] **Step 8: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS — no type errors across the new components.

- [ ] **Step 9: Commit**

```bash
git add components/NumberField.tsx components/ResultCard.tsx components/Breakdown.tsx components/AdSlot.tsx components/Faq.tsx components/RelatedCalculators.tsx components/CalculatorShell.tsx
git commit -m "feat: add shared calculator UI shell components"
```

---

### Task 9: Calculator UI component + UI registry

**Files:**
- Create: `components/calculators/ElektroautoVsBenzinaCalculator.tsx`
- Create: `components/calculators/registry.tsx`

**Interfaces:**
- Consumes: `computeEvVsIce` from `lib/calculators/elektroauto-vs-benzina.ts` (Task 6); `formatCurrencyEUR`, `formatNumber` from `lib/format.ts` (Task 3); `NumberField`, `ResultCard`, `Breakdown` from Task 8.
- Produces: `ElektroautoVsBenzinaCalculator` component; `getCalculatorComponent(slug: string): ComponentType | undefined` — consumed by `app/[category]/[calculator]/page.tsx` in Task 10.

- [ ] **Step 1: Write `components/calculators/ElektroautoVsBenzinaCalculator.tsx`**

```tsx
'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatCurrencyEUR, formatNumber } from '@/lib/format';
import { computeEvVsIce } from '@/lib/calculators/elektroauto-vs-benzina';

const DEFAULT_INPUT = {
  annualDistanceKm: 15000,
  evConsumptionKwhPer100km: 17,
  electricityPricePerKwh: 0.2,
  iceConsumptionLPer100km: 6.5,
  fuelPricePerLiter: 1.65,
};

export function ElektroautoVsBenzinaCalculator() {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => computeEvVsIce(input), [input]);

  const verdictLabel =
    result.cheaperOption === 'ev'
      ? 'Elektroauto lētāks gadā'
      : result.cheaperOption === 'ice'
        ? 'Benzīna auto lētāks gadā'
        : 'Izmaksas ir vienādas';

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label={verdictLabel}
        value={formatCurrencyEUR(Math.abs(result.annualSavings))}
        accentVar="var(--color-accent-auto)"
        sublabel={`5 gados: ${formatCurrencyEUR(Math.abs(result.fiveYearSavings))}`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField
          id="annualDistanceKm"
          label="Gada nobraukums"
          unit="km"
          value={input.annualDistanceKm}
          step={500}
          onChange={(value) => setInput((prev) => ({ ...prev, annualDistanceKm: value }))}
        />
        <NumberField
          id="evConsumptionKwhPer100km"
          label="Elektroauto patēriņš"
          unit="kWh/100km"
          value={input.evConsumptionKwhPer100km}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, evConsumptionKwhPer100km: value }))}
        />
        <NumberField
          id="electricityPricePerKwh"
          label="Elektrības cena"
          unit="€/kWh"
          value={input.electricityPricePerKwh}
          step={0.01}
          onChange={(value) => setInput((prev) => ({ ...prev, electricityPricePerKwh: value }))}
        />
        <NumberField
          id="iceConsumptionLPer100km"
          label="Benzīna auto patēriņš"
          unit="L/100km"
          value={input.iceConsumptionLPer100km}
          step={0.1}
          onChange={(value) => setInput((prev) => ({ ...prev, iceConsumptionLPer100km: value }))}
        />
        <NumberField
          id="fuelPricePerLiter"
          label="Degvielas cena"
          unit="€/L"
          value={input.fuelPricePerLiter}
          step={0.01}
          onChange={(value) => setInput((prev) => ({ ...prev, fuelPricePerLiter: value }))}
        />
      </div>

      <p className="text-xs text-panel-muted">
        Noklusējuma vērtības ir orientējošas — pielāgo tās savai situācijai un pašreizējām cenām.
      </p>

      <Breakdown
        rows={[
          { label: 'Elektroauto enerģijas izmaksas / gadā', value: formatCurrencyEUR(result.evAnnualEnergyCost) },
          { label: 'Benzīna auto degvielas izmaksas / gadā', value: formatCurrencyEUR(result.iceAnnualFuelCost) },
          { label: 'Gada nobraukums', value: `${formatNumber(input.annualDistanceKm)} km` },
        ]}
      />
    </div>
  );
}
```

- [ ] **Step 2: Write `components/calculators/registry.tsx`**

```tsx
import type { ComponentType } from 'react';
import { ElektroautoVsBenzinaCalculator } from './ElektroautoVsBenzinaCalculator';

export const calculatorComponents: Record<string, ComponentType> = {
  'elektroauto-vs-benzina': ElektroautoVsBenzinaCalculator,
};

export function getCalculatorComponent(slug: string): ComponentType | undefined {
  return calculatorComponents[slug];
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/calculators/ElektroautoVsBenzinaCalculator.tsx components/calculators/registry.tsx
git commit -m "feat: add elektroauto-vs-benzina calculator UI and UI registry"
```

---

### Task 10: Dynamic routes — category and calculator pages

**Files:**
- Create: `app/[category]/page.tsx`
- Create: `app/[category]/[calculator]/page.tsx`

**Interfaces:**
- Consumes: `categories`, `calculators`, `getCategory`, `getCalculatorsByCategory`, `getCalculator`, `getRelatedCalculators` from `lib/registry.ts`; `loadFaq` from `lib/faq.ts`; `buildSoftwareApplicationSchema`, `buildBreadcrumbSchema`, `buildFaqSchema` from `lib/schema.ts`; `CalculatorShell` from Task 8; `getCalculatorComponent` from Task 9.

- [ ] **Step 1: Write `app/[category]/page.tsx`**

```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { categories, getCalculatorsByCategory, getCategory } from '@/lib/registry';

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const category = getCategory(params.category);
  if (!category) return {};
  return { title: category.title, description: category.description };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = getCategory(params.category);
  if (!category) notFound();

  const categoryCalculators = getCalculatorsByCategory(category.slug);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-panel-muted">
        <Link href="/">Sākums</Link>
        {' / '}
        <span>{category.title}</span>
      </nav>

      <h1 className="font-mono text-2xl font-semibold" style={{ color: category.accentVar }}>
        {category.title}
      </h1>
      <p className="text-panel-muted">{category.description}</p>

      <ul className="flex flex-col gap-2">
        {categoryCalculators.map((calculator) => (
          <li key={calculator.slug}>
            <Link
              href={`/${category.slug}/${calculator.slug}`}
              className="text-panel-text underline decoration-panel-border underline-offset-4 hover:decoration-current"
            >
              {calculator.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 2: Write `app/[category]/[calculator]/page.tsx`**

```tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { calculators, getCalculator, getCategory, getRelatedCalculators } from '@/lib/registry';
import { loadFaq } from '@/lib/faq';
import { buildBreadcrumbSchema, buildFaqSchema, buildSoftwareApplicationSchema } from '@/lib/schema';
import { CalculatorShell } from '@/components/CalculatorShell';
import { getCalculatorComponent } from '@/components/calculators/registry';

interface PageParams {
  category: string;
  calculator: string;
}

export function generateStaticParams() {
  return calculators.map((calculator) => ({
    category: calculator.category,
    calculator: calculator.slug,
  }));
}

export function generateMetadata({ params }: { params: PageParams }): Metadata {
  const calculator = getCalculator(params.category, params.calculator);
  if (!calculator) return {};
  return {
    title: calculator.title,
    description: calculator.metaDescription,
    keywords: calculator.keywords,
  };
}

export default function CalculatorPage({ params }: { params: PageParams }) {
  const category = getCategory(params.category);
  const calculator = getCalculator(params.category, params.calculator);
  if (!category || !calculator) notFound();

  const faq = loadFaq(calculator.slug);
  const related = getRelatedCalculators(calculator);
  const CalculatorComponent = getCalculatorComponent(calculator.slug);
  if (!CalculatorComponent) notFound();

  const url = `https://manikalkulatori.lv/${category.slug}/${calculator.slug}`;

  const softwareSchema = buildSoftwareApplicationSchema({
    name: calculator.title,
    description: calculator.metaDescription,
    url,
    category: 'FinanceApplication',
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Sākums', url: 'https://manikalkulatori.lv' },
    { name: category.title, url: `https://manikalkulatori.lv/${category.slug}` },
    { name: calculator.title, url },
  ]);

  const faqSchema = buildFaqSchema(faq);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <CalculatorShell category={category} calculator={calculator} faq={faq} related={related}>
        <CalculatorComponent />
      </CalculatorShell>
    </>
  );
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add "app/[category]/page.tsx" "app/[category]/[calculator]/page.tsx"
git commit -m "feat: add registry-driven category and calculator routes"
```

---

### Task 11: Homepage, sitemap, robots

**Files:**
- Modify: `app/page.tsx` (replace Task 2's placeholder)
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

**Interfaces:**
- Consumes: `categories`, `calculators`, `getCalculatorsByCategory` from `lib/registry.ts`.

- [ ] **Step 1: Replace `app/page.tsx` with the real homepage**

```tsx
import Link from 'next/link';
import { categories, getCalculatorsByCategory } from '@/lib/registry';

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="font-mono text-3xl font-semibold">Manikalkulatori.lv</h1>
        <p className="text-panel-muted">
          Bezmaksas kalkulatori auto, finanšu, mājokļa, veselības un sporta jautājumiem latviešu valodā.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map((category) => {
          const count = getCalculatorsByCategory(category.slug).length;
          return (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className="flex flex-col gap-1 rounded-lg border border-panel-border bg-panel-surface p-5"
              style={{ borderColor: category.accentVar }}
            >
              <h2 className="font-mono text-lg" style={{ color: category.accentVar }}>
                {category.title}
              </h2>
              <p className="text-sm text-panel-muted">{category.description}</p>
              <p className="text-xs text-panel-muted">{count} kalkulatori</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Write `app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next';
import { calculators, categories } from '@/lib/registry';

const BASE_URL = 'https://manikalkulatori.lv';

export default function sitemap(): MetadataRoute.Sitemap {
  const homeEntry: MetadataRoute.Sitemap[number] = {
    url: BASE_URL,
    changeFrequency: 'weekly',
    priority: 1,
  };

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/${category.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const calculatorEntries: MetadataRoute.Sitemap = calculators.map((calculator) => ({
    url: `${BASE_URL}/${calculator.category}/${calculator.slug}`,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  return [homeEntry, ...categoryEntries, ...calculatorEntries];
}
```

- [ ] **Step 3: Write `app/robots.ts`**

```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://manikalkulatori.lv/sitemap.xml',
  };
}
```

- [ ] **Step 4: Build and inspect the generated sitemap**

Run: `npm run build && npm run start`
Then: open `http://localhost:3000/sitemap.xml` and confirm it lists the homepage, the 5 category URLs, and `/auto/elektroauto-vs-benzina`. Stop the server (Ctrl+C) when done.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/sitemap.ts app/robots.ts
git commit -m "feat: add registry-driven homepage, sitemap, and robots.txt"
```

---

### Task 12: Checkpoint 1 end-to-end verification gate

**Files:** none (verification only).

- [ ] **Step 1: Run the full unit test suite**

Run: `npm run test`
Expected: PASS — `format`, `schema`, `registry`, `faq`, `elektroauto-vs-benzina` compute, and `smoke` tests all pass.

- [ ] **Step 2: Type-check the whole project**

Run: `npx tsc --noEmit`
Expected: PASS, no errors.

- [ ] **Step 3: Run a full production build**

Run: `npm run build`
Expected: PASS. Build output lists the homepage (`/`), all 5 category routes (`/auto`, `/finanses`, `/majoklis`, `/veseliba`, `/sports`), the one calculator route (`/auto/elektroauto-vs-benzina`), `/sitemap.xml`, and `/robots.txt` as static (`●`/`○`) routes — no server-rendered or dynamic routes.

- [ ] **Step 4: Manual smoke test in the browser**

Run: `npm run start`, then open `http://localhost:3000` and verify:
- Homepage shows the 5-category grid with distinct accent colors.
- `/auto` lists "Elektroauto vs benzīna auto izmaksas" and links to it.
- `/auto/elektroauto-vs-benzina` shows a result headline above the fold on load (no click needed), and changing any input updates the result immediately.
- View page source (not just DevTools-rendered DOM) and confirm three `<script type="application/ld+json">` blocks are present (`SoftwareApplication`, `BreadcrumbList`, `FAQPage`).
- Tab through the page and confirm visible focus outlines on links and inputs.
Stop the server (Ctrl+C) when done.

- [ ] **Step 5: Final commit**

```bash
git add -A
git status
git commit -m "chore: checkpoint 1 foundation complete" --allow-empty
```

(Use `--allow-empty` only if Step 4's manual check surfaced no code changes; otherwise commit the real fix first.)

---

## Self-Review Notes

- **Spec coverage:** registry as SSOT (§6, Task 5), pure compute modules (§6, Task 6), lv-LV/EUR formatting (§3/§9, Task 3), JSON-LD on every calculator page (§8/§9, Tasks 4 & 10), fixed-height ad slots (§7/§9, Task 8's `AdSlot`), dark instrument-panel design with per-category accents (§7/§9, Tasks 2 & 8), live-updating result with no "Calculate" button (§7, Task 9), sitemap/robots from the registry (§8, Task 11), one calculator wired end to end (§9 Checkpoint 1, Tasks 6/7/9/10) are all covered by name above.
- **Deferred to later checkpoints, not this plan:** the other 49 calculators (§9 Checkpoints 2–4), Dockerfile/Caddyfile/Coolify deployment notes (§9 Checkpoint 4), Plausible/Umami analytics (§3), and AdSense/affiliate wiring beyond the placeholder `AdSlot` (§8 notes).
- **Placeholder scan:** no TBDs; every step above contains complete, runnable file contents.
- **Type consistency:** `CategoryMeta`/`CalculatorMeta` (Task 5) are the only shapes referenced by name in Tasks 8, 9, 10, and 11; `FaqEntry` (Task 7) is the only FAQ shape referenced in Tasks 8 and 10 — verified no divergent names were introduced.
