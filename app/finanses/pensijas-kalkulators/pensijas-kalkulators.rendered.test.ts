import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Reads the actual built HTML output (npm run build must run first, same order as
 * .github/workflows/pr-checks.yml), not the React source, matching the methodology
 * established for the novads pilot pages: a guard that only checks the source or the
 * registry can stay green while the emitted output is empty, stale, or wrong.
 */

// Same distinction as the novads pilot dash scan: U+2212 immediately followed by a
// digit is a legitimate minus sign in a number, everywhere else every dash variant
// (hyphen-minus and the hyphen/dash family) is banned. See CLAUDE.md, "Dashes,
// hyphens, and the minus sign".
const DASH_OR_MISUSED_MINUS = /[‐‑‒–—-]|−(?!\d)/;

const HEADINGS = {
  methodology: 'Kā aprēķins veikts',
  limitations: 'Ko šis kalkulators neņem vērā',
  sources: 'Avoti',
  faq: 'Biežāk uzdotie jautājumi',
} as const;

// Every numeric token that appears in the methodology, limitations, sources, and FAQ
// text, each traced to its source so an unexplained number added later gets flagged
// instead of silently passing.
const ALLOWED_NUMERIC_TOKENS: Record<string, string> = {
  '1': 'ordinal reference ("1. līmenim", "1. lapā"), not a statistic',
  '2': 'ordinal reference ("2. līmenim", "2. lapā"), not a statistic',
  '3': 'ordinal reference ("3. līmeņa", out of scope callout), not a statistic',
  '4': 'retrieval date day of month ("4. septembrī"), claude/pension-calculator-defaults-2026.md',
  '5': 'PILLAR_2_CONTRIBUTION_RATE_PERCENT, lib/calculators/pensijas-kalkulators-defaults.ts',
  '12': 'months per year, universal calendar constant',
  '14,39': 'G_COEFFICIENT_TABLE[70], claude/data/lv-pension-vsaa-2026.json',
  '15': 'PILLAR_1_CONTRIBUTION_RATE_PERCENT, lib/calculators/pensijas-kalkulators-defaults.ts',
  '17,76': 'G_COEFFICIENT_TABLE[65], claude/data/lv-pension-vsaa-2026.json',
  '20': 'TOTAL_PENSION_CONTRIBUTION_RATE_PERCENT (15 + 5), lib/calculators/pensijas-kalkulators-defaults.ts',
  '30': 'minimum pension guarantee mechanism threshold, claude/pension-calculator-defaults-2026.md, Formula section',
  '65': 'DEFAULT_RETIREMENT_AGE / MIN_RETIREMENT_AGE, lib/calculators/pensijas-kalkulators-defaults.ts',
  '70': 'MAX_RETIREMENT_AGE, lib/calculators/pensijas-kalkulators-defaults.ts',
  '1996': 'NDC_START_YEAR, lib/calculators/pensijas-kalkulators-defaults.ts',
  '1997': 'first year in WAGE_INDEX_SERIES, claude/data/lv-pension-vsaa-2026.json',
  '1999': 'end year of the Ks reference period, claude/pension-calculator-defaults-2026.md, Formula section',
  '2013': 'WAGE_INDEX_SOURCE_PAGE_1_YEARS.to, lib/calculators/pensijas-kalkulators-defaults.ts',
  '2014': 'WAGE_INDEX_SOURCE_PAGE_2_YEARS.from, lib/calculators/pensijas-kalkulators-defaults.ts',
  '2023': 'WAGE_INDEX_SOURCE_PAGE_2_YEARS.to, lib/calculators/pensijas-kalkulators-defaults.ts',
  '2024': 'LATEST_PUBLISHED_INDEX_YEAR, lib/calculators/pensijas-kalkulators-defaults.ts',
  '2025': 'year the 15/5 pillar split took effect, claude/pension-calculator-defaults-2026.md, row 4',
  '2026': 'CURRENT_YEAR / G table effective date, lib/calculators/pensijas-kalkulators-defaults.ts',
};

function readBuiltPage(): string | null {
  const file = path.join(process.cwd(), '.next', 'server', 'app', 'finanses', 'pensijas-kalkulators.html');
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf-8');
}

function visibleText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
}

const html = readBuiltPage();
const built = html !== null;

describe.skipIf(!built)('pensijas-kalkulators page, rendered output', () => {
  const text = built ? visibleText(html!) : '';

  it('renders all four content sections, none empty', () => {
    const order = [HEADINGS.methodology, HEADINGS.limitations, HEADINGS.sources, HEADINGS.faq, 'Par mums'];
    for (let i = 0; i < order.length - 1; i += 1) {
      const start = text.indexOf(order[i]);
      const end = text.indexOf(order[i + 1]);
      expect(start, `heading not found: ${order[i]}`).toBeGreaterThan(-1);
      expect(end, `heading not found: ${order[i + 1]}`).toBeGreaterThan(-1);
      const body = text.slice(start + order[i].length, end).trim();
      expect(body.length, `section "${order[i]}" has suspiciously little content (${body.length} chars)`).toBeGreaterThan(
        100,
      );
    }
  });

  it('has no dash, hyphen, or misused minus sign character anywhere in visible text', () => {
    const matches = text.match(new RegExp(DASH_OR_MISUSED_MINUS, 'g')) ?? [];
    expect(matches, 'found dash/hyphen/misused-minus character(s) in visible text').toHaveLength(0);
  });

  it('every numeric token in the methodology, limitations, sources, and FAQ text traces to a cited source', () => {
    const start = text.indexOf(HEADINGS.methodology);
    const end = text.indexOf('Par mums');
    const block = text.slice(start, end);
    const tokens = block.match(/\d+(?:,\d+)?/g) ?? [];
    const unexpected = [...new Set(tokens)].filter((token) => !(token in ALLOWED_NUMERIC_TOKENS));
    expect(
      unexpected,
      `Found numeric token(s) in the methodology/limitations/sources/FAQ text with no recorded citation: ${unexpected.join(', ')}. ` +
        'Every number in this block must trace to a sourced constant or the defaults doc; add it to ALLOWED_NUMERIC_TOKENS with its source once verified, or fix the copy if it is not actually sourced.',
    ).toEqual([]);
  });

  it('states the wage index source location precisely (page 1 and page 2, not a vague file reference)', () => {
    expect(text).toContain('1. lapā ir 1996');
    expect(text).toContain('2. lapā ir 2014');
  });

  it('signposts 2nd and 3rd pillar as future work, not a silent omission', () => {
    expect(text).toContain('nākamais solis');
  });
});

describe('sitemap includes the pension calculator page', () => {
  it('lists the URL with a valid full ISO 8601 timestamp', () => {
    const sitemapFile = path.join(process.cwd(), '.next', 'server', 'app', 'sitemap.xml.body');
    if (!fs.existsSync(sitemapFile)) return;
    const xml = fs.readFileSync(sitemapFile, 'utf-8');
    const fullIso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/;
    const url = 'https://manikalkulatori.lv/finanses/pensijas-kalkulators';
    const idx = xml.indexOf(`<loc>${url}</loc>`);
    expect(idx, 'pensijas-kalkulators URL not found in sitemap').toBeGreaterThan(-1);
    const lastmodMatch = xml.slice(idx, idx + 300).match(/<lastmod>([^<]*)<\/lastmod>/);
    expect(lastmodMatch, 'no lastmod found').not.toBeNull();
    expect(fullIso.test(lastmodMatch![1]), `lastmod "${lastmodMatch![1]}" is not full ISO 8601`).toBe(true);
  });
});
