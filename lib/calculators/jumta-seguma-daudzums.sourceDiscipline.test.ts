import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// SOURCE DISCIPLINE: every material coverage figure (tiles per m2, sheet width, package
// coverage) must arrive as a function parameter, sourced from
// claude/buvmaterialu-daudzuma-defaults-2026.md / claude/data/lv-jumta-seguma-2026.json
// at the call site, never hardcoded in this compute module. Mirrors the pattern
// established in dzimstibas-kalkulators.sourceDiscipline.test.ts.

// 0, 1, and 100 are structural or universal (percent conversion), 180 is the
// degrees-per-half-turn constant in the degrees-to-radians conversion, and 9 is the
// exponent digit in the 1e-9 floating point epsilon (the pattern's plain digit scan
// does not parse scientific notation as one token), none are statistical figures.
const ALLOWED_NUMERIC_LITERALS = new Set(['0', '1', '9', '100', '180']);

describe('jumta-seguma-daudzums source discipline', () => {
  it('contains no numeric literal beyond the allowlisted structural and calendar constants', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'lib', 'calculators', 'jumta-seguma-daudzums.ts'),
      'utf-8',
    );

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
      `Found numeric literal(s) in jumta-seguma-daudzums.ts that are not structural constants: ${unexpected.join(', ')}. ` +
        'Every material coverage figure must be threaded in as a parameter sourced from claude/data/lv-jumta-seguma-2026.json, not hardcoded here.',
    ).toEqual([]);
  });
});
