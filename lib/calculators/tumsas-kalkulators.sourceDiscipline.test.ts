import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// SOURCE DISCIPLINE: every number that reaches code must be traceable to a data file
// row. The tumsas-kalkulators compute module must never hardcode a Rīga specific
// daylight figure (D_vid, the amplitude, the solstice day) directly in its source;
// every such figure must arrive as a function parameter, sourced from
// claude/tumsas-kalkulators-defaults-2026.md / claude/data/lv-riga-daylight-2026.json
// at the call site. This test scans the module's source for bare numeric literals and
// fails if anything appears beyond the small allowlist of universal calendar and
// mathematical constants that need no citation.

// 0 and 1 are structural sentinels (loop bounds, day of year base), not statistical
// figures. 2 is the full circle constant in 2π, not a citation worthy figure. 12, 24,
// 60, 1000, and 365.25 are the same universal calendar constants already allowlisted in
// dzimstibas-kalkulators.sourceDiscipline.test.ts.
const ALLOWED_NUMERIC_LITERALS = new Set(['0', '1', '2', '12', '24', '60', '100', '365.25', '1000']);

describe('tumsas-kalkulators source discipline', () => {
  it('contains no numeric literal beyond the allowlisted calendar and mathematical constants', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'lib', 'calculators', 'tumsas-kalkulators.ts'), 'utf-8');

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
      .replace(/\/\*\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '')
      .replace(/`[^`]*`/g, '""')
      .replace(/'[^']*'/g, '""');

    const numericLiterals = codeOnly.match(/(?<![A-Za-z0-9_.])\d+(\.\d+)?(?![A-Za-z0-9_])/g) ?? [];
    const unexpected = numericLiterals.filter((literal) => !ALLOWED_NUMERIC_LITERALS.has(literal));

    expect(
      unexpected,
      `Found numeric literal(s) in tumsas-kalkulators.ts that are not calendar/mathematical constants: ${unexpected.join(', ')}. ` +
        'Every Rīga specific daylight figure must be threaded in as a parameter sourced from claude/tumsas-kalkulators-defaults-2026.md, not hardcoded here.',
    ).toEqual([]);
  });

  it('the longest and shortest sourced days both fall in 2026, matching the annual total they are cross checked against', () => {
    const data = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'claude', 'data', 'lv-riga-daylight-2026.json'), 'utf-8'),
    ) as { longestDay2026: { date: string }; shortestDay2026: { date: string } };
    expect(data.longestDay2026.date.startsWith('2026')).toBe(true);
    expect(data.shortestDay2026.date.startsWith('2026')).toBe(true);
  });
});
