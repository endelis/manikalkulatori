import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// SOURCE DISCIPLINE: board dimensions, gap, and waste percent must arrive as function
// parameters, sourced from claude/buvmaterialu-daudzuma-defaults-2026.md /
// claude/data/lv-terases-delu-2026.json at the call site, never hardcoded here.

const ALLOWED_NUMERIC_LITERALS = new Set(['0', '1', '9', '100', '1000']);

describe('terases-delu-daudzums source discipline', () => {
  it('contains no numeric literal beyond the allowlisted structural constants', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'lib', 'calculators', 'terases-delu-daudzums.ts'),
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
      `Found numeric literal(s) in terases-delu-daudzums.ts that are not structural constants: ${unexpected.join(', ')}. ` +
        'Every board dimension, gap, or waste percent must be threaded in as a parameter sourced from claude/data/lv-terases-delu-2026.json, not hardcoded here.',
    ).toEqual([]);
  });
});
