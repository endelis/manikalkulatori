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
