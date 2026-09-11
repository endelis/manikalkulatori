import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// SOURCE DISCIPLINE: every number that reaches code must be traceable to a data file
// row. The pensijas-kalkulators compute module must never hardcode a statistical or
// legal figure (a rate, a coefficient, a year specific to Latvia's pension law)
// directly in its source; every such figure must arrive as a function parameter,
// sourced from claude/pension-calculator-defaults-2026.md /
// claude/data/lv-pension-vsaa-2026.json at the call site. This test scans the module's
// source for bare numeric literals and fails if anything appears beyond the small
// allowlist of universal calendar and percentage constants that need no citation.

const ALLOWED_NUMERIC_LITERALS = new Set(['0', '1', '12', '100']);

describe('pensijas-kalkulators source discipline', () => {
  it('contains no numeric literal beyond the allowlisted calendar and percentage constants', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'lib', 'calculators', 'pensijas-kalkulators.ts'), 'utf-8');

    const codeOnly = source
      .split('\n')
      .filter((line) => {
        const trimmed = line.trim();
        return (
          !trimmed.startsWith('export interface') &&
          !trimmed.startsWith('export type') &&
          !trimmed.match(/^[A-Za-z]+(\??):\s/)
        );
      })
      .join('\n')
      .replace(/\/\*\*[\s\S]*?\*\//g, '') // block comments (source notes with years)
      .replace(/\/\/.*$/gm, '') // line comments
      .replace(/`[^`]*`/g, '""')
      .replace(/'[^']*'/g, '""');

    const numericLiterals = codeOnly.match(/(?<![A-Za-z0-9_.])\d+(\.\d+)?(?![A-Za-z0-9_])/g) ?? [];
    const unexpected = numericLiterals.filter((literal) => !ALLOWED_NUMERIC_LITERALS.has(literal));

    expect(
      unexpected,
      `Found numeric literal(s) in pensijas-kalkulators.ts that are not calendar/percentage constants: ${unexpected.join(', ')}. ` +
        'Every statistical or legal figure must be threaded in as a parameter sourced from claude/pension-calculator-defaults-2026.md, not hardcoded here.',
    ).toEqual([]);
  });

  it('the G coefficient table covers every age from 65 to 70, the retirement age slider range', () => {
    const data = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'claude', 'data', 'lv-pension-vsaa-2026.json'), 'utf-8'),
    ) as { gCoefficientTable: { byAge: Record<string, number> } };
    for (let age = 65; age <= 70; age += 1) {
      expect(data.gCoefficientTable.byAge[String(age)], `missing G for age ${age}`).toBeTypeOf('number');
    }
  });

  it('the wage index series has no gap between 1997 and its latest published year', () => {
    const data = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'claude', 'data', 'lv-pension-vsaa-2026.json'), 'utf-8'),
    ) as { wageIndexSeries: { byApplicationYear: Record<string, number> } };
    const years = Object.keys(data.wageIndexSeries.byApplicationYear)
      .map(Number)
      .sort((a, b) => a - b);
    for (let i = 1; i < years.length; i += 1) {
      expect(years[i] - years[i - 1], `gap in wage index series between ${years[i - 1]} and ${years[i]}`).toBe(1);
    }
  });
});
