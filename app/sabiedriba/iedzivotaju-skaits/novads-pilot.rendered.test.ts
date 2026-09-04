import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  naturalIncreaseRatePer1000,
  yearsToLoseFraction,
  computeDzimstibas,
} from '@/lib/calculators/dzimstibas-kalkulators';
import { NOVADS_PILOT_AREAS, average } from '@/lib/novads-pilot-data';

/**
 * These tests read the actual built HTML output (npm run build must run first, same
 * order as .github/workflows/pr-checks.yml), not the registry or the React source.
 * The lesson from this session: a guard that only checks internal state (a registry
 * field, a data constant) can stay green while the emitted output is wrong or
 * inconsistent (the sitemap bug, the chart's own aria-label bug, and the double
 * "novada novadā" wording bug were all only caught by reading rendered output).
 */

// The dash/hyphen ban targets punctuation used as an AI generated text tell, not the
// mathematical minus sign attached to a digit. U+2212 (proper minus) immediately
// followed by a digit is legitimate numeric notation (see formatSignedNumber in
// lib/format.ts and CLAUDE.md, "Dashes, hyphens, and the minus sign") and is allowed;
// everywhere else, including U+2212 not attached to a digit, every dash variant
// (hyphen-minus and the hyphen/dash family) is still banned.
const DASH_OR_MISUSED_MINUS = /[‐‑‒–—-]|−(?!\d)/;

function readBuiltPage(slug: string): string | null {
  const file = path.join(process.cwd(), '.next', 'server', 'app', 'sabiedriba', 'iedzivotaju-skaits', `${slug}.html`);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf-8');
}

function visibleText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
}

const builtPages = Object.fromEntries(NOVADS_PILOT_AREAS.map((area) => [area.slug, readBuiltPage(area.slug)]));
const allBuilt = Object.values(builtPages).every((html) => html !== null);

describe.skipIf(!allBuilt)('novads pilot pages, rendered output', () => {
  it('each page renders its own distinct population, births, and deaths, not another area\'s', () => {
    const seenPopulations = new Set<number>();
    for (const area of NOVADS_PILOT_AREAS) {
      const html = builtPages[area.slug]!;
      expect(html.includes(formatPlain(area.population)), `${area.slug}: own population not found`).toBe(true);
      expect(html.includes(formatPlain(area.births)), `${area.slug}: own births not found`).toBe(true);
      expect(html.includes(formatPlain(area.deaths)), `${area.slug}: own deaths not found`).toBe(true);

      // Cross contamination check: no other area's exact population figure should
      // appear (population counts are large enough that a coincidental match across
      // these three specific areas is not realistic).
      for (const other of NOVADS_PILOT_AREAS) {
        if (other.slug === area.slug) continue;
        expect(
          html.includes(formatPlain(other.population)),
          `${area.slug}: contains ${other.slug}'s population (${other.population}), cross contamination`,
        ).toBe(false);
      }

      expect(seenPopulations.has(area.population), `${area.slug}: population duplicates another area`).toBe(false);
      seenPopulations.add(area.population);
    }
  });

  it('has no dash, hyphen, or misused minus sign character in visible text on any of the three pages', () => {
    for (const area of NOVADS_PILOT_AREAS) {
      const html = builtPages[area.slug]!;
      const text = visibleText(html);
      const matches = text.match(new RegExp(DASH_OR_MISUSED_MINUS, 'g')) ?? [];
      expect(matches, `${area.slug}: found dash/hyphen/misused-minus character(s) in visible text`).toHaveLength(0);
    }
  });

  it('suppresses the rate-comparison verdict and years-to-lose-a-tenth for the small area only', () => {
    for (const area of NOVADS_PILOT_AREAS) {
      const html = builtPages[area.slug]!;
      const small = area.population < 10000;
      expect(html.includes('dabiskā samazinājuma temps'), `${area.slug}: rate-comparison sentence present`).toBe(
        !small,
      );
      expect(
        html.includes('par desmito daļu samazinātos'),
        `${area.slug}: years-to-lose-a-tenth sentence present`,
      ).toBe(!small);
      if (small) {
        expect(html.includes('statistiska trokšņa'), `${area.slug}: small-area caveat sentence missing`).toBe(true);
      }
    }
  });

  it('states its own reference year visibly, not only inside a sentence', () => {
    for (const area of NOVADS_PILOT_AREAS) {
      // React inserts <!-- --> hydration markers between adjacent text/expression
      // nodes, which visibleText's tag strip turns into extra whitespace; collapse
      // runs of whitespace before comparing.
      const text = visibleText(builtPages[area.slug]!).replace(/\s+/g, ' ');
      expect(
        text.includes(`Jaunākie CSP dati: ${area.referenceYear} . gads`),
        `${area.slug}: no visible reference year line`,
      ).toBe(true);
    }
  });

  it('every rendered number traces to a NOVADS_PILOT_AREAS row or a pure function of one', () => {
    for (const area of NOVADS_PILOT_AREAS) {
      const html = builtPages[area.slug]!;

      // Source figures, straight from the sourced data module.
      for (const raw of [area.population, area.births, area.deaths, Math.abs(area.naturalIncrease), Math.abs(area.netMigration)]) {
        expect(html.includes(formatPlain(raw)), `${area.slug}: sourced figure ${raw} not found in rendered output`).toBe(
          true,
        );
      }

      // Derived figures, recomputed here with the same exported pure functions the
      // page itself calls, so this test would fail if the page's arithmetic (or its
      // inputs) ever silently diverged from the sourced data module. Below the small
      // area threshold the page uses a multi-year average of births/deaths as the
      // compute module's input, and suppresses the rate comparison and years-to-lose-
      // a-tenth figures entirely (see the small-area threshold test above) rather than
      // rendering them from noisy single-year counts.
      const small = area.population < 10000;
      const completeSeries = area.series.filter((row) => row.liveBirths !== null && row.deaths !== null);
      const headlineBirths = small
        ? average(completeSeries.map((row) => row.liveBirths!))
        : area.births;
      const headlineDeaths = small ? average(completeSeries.map((row) => row.deaths!)) : area.deaths;
      const result = computeDzimstibas({
        mode: 'nulles-kopejas',
        deaths: headlineDeaths,
        netMigration: area.netMigration,
        population: area.population,
        birthsCurrent: headlineBirths,
        tfrCurrent: 1, // unused by mode nulles-kopejas, not rendered on this page
      });

      expect(html.includes(formatDecimal(result.perDay, 2)), `${area.slug}: perDay not found`).toBe(true);

      if (!small) {
        const areaRate = Math.abs(naturalIncreaseRatePer1000(area.naturalIncrease, area.population));
        const yearsToLoseTenth = yearsToLoseFraction(area.population, area.naturalIncrease, 0.1);
        expect(html.includes(formatDecimal(areaRate, 2)), `${area.slug}: area rate not found`).toBe(true);
        if (yearsToLoseTenth !== null) {
          expect(
            html.includes(formatDecimal(yearsToLoseTenth, 1)),
            `${area.slug}: years to lose a tenth not found`,
          ).toBe(true);
        }
      }
    }
  });
});

describe.skipIf(!allBuilt)('novads pilot pages, JS disabled usability', () => {
  it('renders as a plain server component, no client script required for the headline result', () => {
    for (const area of NOVADS_PILOT_AREAS) {
      const html = builtPages[area.slug]!;
      expect(html.includes('Bērni dienā'), `${area.slug}: headline label not present in initial HTML`).toBe(true);
    }
  });
});

describe('sitemap includes the novads pilot pages', () => {
  it('lists all three URLs with a valid full ISO 8601 timestamp', () => {
    const sitemapFile = path.join(process.cwd(), '.next', 'server', 'app', 'sitemap.xml.body');
    if (!fs.existsSync(sitemapFile)) {
      // Build has not run yet in this environment; nothing to check against.
      return;
    }
    const xml = fs.readFileSync(sitemapFile, 'utf-8');
    const fullIso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/;

    for (const area of NOVADS_PILOT_AREAS) {
      const url = `https://manikalkulatori.lv/sabiedriba/iedzivotaju-skaits/${area.slug}`;
      const idx = xml.indexOf(`<loc>${url}</loc>`);
      expect(idx, `${area.slug}: URL not found in sitemap`).toBeGreaterThan(-1);
      const lastmodMatch = xml.slice(idx, idx + 300).match(/<lastmod>([^<]*)<\/lastmod>/);
      expect(lastmodMatch, `${area.slug}: no lastmod found`).not.toBeNull();
      expect(fullIso.test(lastmodMatch![1]), `${area.slug}: lastmod "${lastmodMatch![1]}" is not full ISO 8601`).toBe(
        true,
      );
    }
  });
});

// lv-LV Intl.NumberFormat groups thousands with a narrow no-break space; matching HTML
// text content requires the same character, not a plain ASCII space.
function formatPlain(value: number): string {
  return new Intl.NumberFormat('lv-LV', { maximumFractionDigits: 0 }).format(value);
}

function formatDecimal(value: number, decimals: number): string {
  return new Intl.NumberFormat('lv-LV', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(
    value,
  );
}
