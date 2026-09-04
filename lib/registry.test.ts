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
  it('defines exactly the six top-level categories from the spec', () => {
    expect(categories.map((c) => c.slug).sort()).toEqual(
      ['auto', 'finanses', 'majoklis', 'sports', 'veseliba', 'sabiedriba'].sort(),
    );
  });
});

describe('contentUpdatedAt', () => {
  // Full ISO 8601 date-time with a mandatory timezone offset (Z or ±HH:MM). A bare
  // date ("2026-09-03") must not pass: it cannot represent a second same-day content
  // change, which is exactly the deadlock lib/calculatorContentDrift.test.ts exists to
  // catch (see that file's docstring, and PR #16). This test is the guard that stops a
  // bare date from creeping back onto any calculator.
  const FULL_ISO_8601_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/;

  it('every calculator has a full ISO 8601 timestamp with a timezone offset, not a bare date', () => {
    for (const calc of calculators) {
      expect(
        FULL_ISO_8601_WITH_OFFSET.test(calc.contentUpdatedAt),
        `${calc.slug}: contentUpdatedAt "${calc.contentUpdatedAt}" is not a full ISO 8601 timestamp with a timezone offset`,
      ).toBe(true);
    }
  });

  it('every calculator has a parseable, non-future timestamp', () => {
    const now = Date.now();
    for (const calc of calculators) {
      const parsed = new Date(calc.contentUpdatedAt).getTime();
      expect(Number.isNaN(parsed), `${calc.slug}: contentUpdatedAt "${calc.contentUpdatedAt}" does not parse`).toBe(
        false,
      );
      expect(parsed, `${calc.slug}: contentUpdatedAt "${calc.contentUpdatedAt}" is in the future`).toBeLessThanOrEqual(
        now,
      );
    }
  });
});
