import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Reads the actual built HTML output (npm run build must run first), not the React
 * source, matching the methodology established for the other calculators on this site:
 * a guard that only checks the source or the registry can stay green while the emitted
 * output is empty, stale, or wrong.
 */

// Same rule as the pension calculator's dash scan (U+2212 allowed only immediately
// before a digit, i.e. genuinely part of a number). A displayed mathematical formula
// (monospace algebraic notation) also legitimately uses U+2212 as a subtraction
// operator between terms, which this strict rule alone would flag, so the three known
// formula lines are matched by their exact expected text and excluded from the scan
// below, rather than widening the regex itself: a "U+2212 followed by a letter" carve
// out would also accept a genuine prose dash before any word, e.g. "tas ir − dīvaini",
// so the exemption is scoped to these specific known strings, not a general pattern.
// See CLAUDE.md, "Dashes, hyphens, and the minus sign".
const DASH_OR_MISUSED_MINUS = /[‐‑‒–—-]|−(?!\d)/;

const FORMULA_LINES = [
  'gaismas_stundas(n) = D_vid + A × cos(2π × (n − n_vasaras_saulgrieži) ÷ 365,25)',
  'tumsas_stundas(n) = 24 − gaismas_stundas(n)',
  'kopā_tumsas_dienas = (Σ tumsas_stundas par katru nodzīvoto dienu) ÷ 24',
];

const HEADINGS = {
  methodology: 'Kā aprēķins veikts',
  limitations: 'Ko šis kalkulators neņem vērā',
  sources: 'Avoti',
  faq: 'Biežāk uzdotie jautājumi',
} as const;

// Every numeric token in the methodology, limitations, sources, and FAQ text, traced to
// its source, so an unexplained number added later gets flagged instead of silently
// passing.
const ALLOWED_NUMERIC_TOKENS: Record<string, string> = {
  '2': 'the full circle constant in 2π, universal mathematical constant',
  '4': 'retrieval date day of month ("4. septembrī") and the fixed today reference day',
  '5': 'AMPLITUDE_HOURS whole hours part (5h34.5min), lib/calculators/tumsas-kalkulators-defaults.ts',
  '6': 'SHORTEST_DAY_HOURS whole hours part (6h43min), lib/calculators/tumsas-kalkulators-defaults.ts',
  '12': 'AVERAGE_DAYLIGHT_HOURS whole hours part (12h20min), lib/calculators/tumsas-kalkulators-defaults.ts',
  '17': 'LONGEST_DAY_HOURS whole hours part (17h52min), lib/calculators/tumsas-kalkulators-defaults.ts',
  '20': 'AVERAGE_DAYLIGHT_HOURS minutes part, lib/calculators/tumsas-kalkulators-defaults.ts',
  '21': 'day of month for both the longest and shortest sourced day, claude/data/lv-riga-daylight-2026.json',
  '24': 'hours per day, universal calendar constant, also the formula\'s own literal 24',
  '35': 'AMPLITUDE_HOURS minutes part, rounded from 34.5, lib/calculators/tumsas-kalkulators-defaults.ts',
  '43': 'SHORTEST_DAY_HOURS minutes part (6h43min), lib/calculators/tumsas-kalkulators-defaults.ts',
  '52': 'LONGEST_DAY_HOURS minutes part (17h52min), lib/calculators/tumsas-kalkulators-defaults.ts',
  '57': 'rounded restatement of LATITUDE_DEGREES_NORTH (56.95) in FAQ prose, same source',
  '172': 'SUMMER_SOLSTICE_DAY_OF_YEAR, lib/calculators/tumsas-kalkulators-defaults.ts',
  '365': 'DAYS_IN_2026, lib/calculators/tumsas-kalkulators-defaults.ts',
  '365,25': 'DAYS_PER_YEAR constant in the formula itself, universal calendar constant',
  '2026': 'year references (solstice date, shortest day date, fixed today reference)',
  '4502': 'ANNUAL_TOTAL_DAYLIGHT_HOURS whole hours part, lib/calculators/tumsas-kalkulators-defaults.ts',
  '56,95': 'LATITUDE_DEGREES_NORTH, lib/calculators/tumsas-kalkulators-defaults.ts',
};

function readBuiltPage(): string | null {
  const file = path.join(process.cwd(), '.next', 'server', 'app', 'sabiedriba', 'tumsas-kalkulators.html');
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

describe.skipIf(!built)('tumsas-kalkulators page, rendered output', () => {
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

  it('formula lines contain exactly the expected text, not something with a smuggled dash', () => {
    for (const line of FORMULA_LINES) {
      expect(text.includes(line), `formula line not found verbatim: ${line}`).toBe(true);
    }
  });

  it('has no dash, hyphen, or misused minus sign character anywhere in visible text outside the formula lines', () => {
    let textWithoutFormulas = text;
    for (const line of FORMULA_LINES) {
      textWithoutFormulas = textWithoutFormulas.replaceAll(line, '');
    }
    const matches = textWithoutFormulas.match(new RegExp(DASH_OR_MISUSED_MINUS, 'g')) ?? [];
    expect(matches, 'found dash/hyphen/misused-minus character(s) in visible text outside the formula').toHaveLength(
      0,
    );
  });

  it('every numeric token in the methodology, limitations, sources, and FAQ text traces to a cited source', () => {
    const start = text.indexOf(HEADINGS.methodology);
    const end = text.indexOf('Par mums');
    const block = text.slice(start, end);
    const tokens = block.match(/\d+(?:[.,]\d+)?/g) ?? [];
    const unexpected = [...new Set(tokens)].filter((token) => !(token in ALLOWED_NUMERIC_TOKENS));
    expect(
      unexpected,
      `Found numeric token(s) with no recorded citation: ${unexpected.join(', ')}. ` +
        'Every number in this block must trace to a sourced constant; add it to ALLOWED_NUMERIC_TOKENS with its source once verified, or fix the copy if it is not actually sourced.',
    ).toEqual([]);
  });

  it('shows the formula visibly, not just describes it in prose', () => {
    expect(text).toContain('gaismas_stundas(n)');
    expect(text).toContain('tumsas_stundas(n)');
    expect(text).toContain('kopā_tumsas_dienas');
  });

  it('never interpolates a raw ISO date string into visible prose', () => {
    // A stray "YYYY-MM-DD" would slip past the dash scan's formula exemption if it
    // happened to sit next to a letter or paren by coincidence, so check directly too.
    expect(text).not.toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it('excludes twilight explicitly, not as a footnote', () => {
    expect(text).toContain('Krēslu');
    expect(text).toContain('krēslu');
  });

  it('signposts the latitude assumption as a limitation', () => {
    expect(text).toContain('Vietas maiņu');
  });
});

describe('sitemap includes the darkness calculator page', () => {
  it('lists the URL with a valid full ISO 8601 timestamp', () => {
    const sitemapFile = path.join(process.cwd(), '.next', 'server', 'app', 'sitemap.xml.body');
    if (!fs.existsSync(sitemapFile)) return;
    const xml = fs.readFileSync(sitemapFile, 'utf-8');
    const fullIso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/;
    const url = 'https://manikalkulatori.lv/sabiedriba/tumsas-kalkulators';
    const idx = xml.indexOf(`<loc>${url}</loc>`);
    expect(idx, 'tumsas-kalkulators URL not found in sitemap').toBeGreaterThan(-1);
    const lastmodMatch = xml.slice(idx, idx + 300).match(/<lastmod>([^<]*)<\/lastmod>/);
    expect(lastmodMatch, 'no lastmod found').not.toBeNull();
    expect(fullIso.test(lastmodMatch![1]), `lastmod "${lastmodMatch![1]}" is not full ISO 8601`).toBe(true);
  });
});
