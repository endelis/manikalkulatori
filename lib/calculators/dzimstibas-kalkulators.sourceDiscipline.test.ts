import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// SOURCE DISCIPLINE: every number that reaches code must be traceable to a data file
// row. The dzimstibas-kalkulators compute module must never hardcode a statistical
// figure (a population, birth, death, or TFR value) directly in its source; every such
// figure must arrive as a function parameter, sourced from
// claude/demografijas-defaults-2026.md / claude/data/lv-population-1920-2026.json at
// the call site. This test scans the module's source for bare numeric literals and
// fails if anything appears beyond the small allowlist of universal calendar and
// percentage constants that need no statistical citation.

// 0 is allowed as a structural sentinel (zero-check guards), not a statistical figure.
// 1000 is the universal per-1000-residents demographic rate convention (used the same
// way in every CSP table this project sources from), not a statistical figure itself.
const ALLOWED_NUMERIC_LITERALS = new Set(['365.25', '12', '24', '60', '100', '0', '1000']);

describe('dzimstibas-kalkulators source discipline', () => {
  it('contains no numeric literal beyond the allowlisted calendar and percentage constants', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'lib', 'calculators', 'dzimstibas-kalkulators.ts'),
      'utf-8',
    );

    // Strip type-only lines (interfaces/type aliases) and string contents, so year
    // numbers in error message strings and type positions do not trigger false
    // positives; only numbers appearing in actual expressions are checked.
    const codeOnly = source
      .split('\n')
      .filter((line) => {
        const trimmed = line.trim();
        return (
          !trimmed.startsWith('export interface') &&
          !trimmed.startsWith('export type') &&
          !trimmed.match(/^[A-Za-z]+(\??):\s/) // property type declarations
        );
      })
      .join('\n')
      .replace(/`[^`]*`/g, '""') // template literals (error messages)
      .replace(/'[^']*'/g, '""'); // string literals (mode discriminants)

    const numericLiterals = codeOnly.match(/(?<![A-Za-z0-9_.])\d+(\.\d+)?(?![A-Za-z0-9_])/g) ?? [];

    const unexpected = numericLiterals.filter((literal) => !ALLOWED_NUMERIC_LITERALS.has(literal));

    expect(
      unexpected,
      `Found numeric literal(s) in dzimstibas-kalkulators.ts that are not calendar/percentage constants: ${unexpected.join(', ')}. ` +
        'Every statistical figure must be threaded in as a parameter sourced from claude/demografijas-defaults-2026.md, not hardcoded here.',
    ).toEqual([]);
  });

  it('every year referenced by the sourced test defaults exists as a row in the population data file', () => {
    const dataFile = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'claude', 'data', 'lv-population-1920-2026.json'),
        'utf-8',
      ),
    ) as { series: Array<{ year: number }> };
    const years = new Set(dataFile.series.map((row) => row.year));

    // The years the compute module's own test suite exercises for the birth year
    // cohort feature (1943, 1944, 1990, 2025) must all exist as rows, so the module's
    // documented behavior (including the deliberate 1944 gap) stays truthful to the
    // real data file rather than to numbers invented in the test file.
    for (const year of [1943, 1944, 1990, 2025]) {
      expect(years.has(year), `year ${year} missing from lv-population-1920-2026.json`).toBe(true);
    }
  });
});
