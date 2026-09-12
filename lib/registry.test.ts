import { describe, expect, it } from 'vitest';
import {
  calculators,
  categories,
  getArticle,
  getCalculator,
  getCalculatorsByCategory,
  getCategory,
  getContent,
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

  it('surfaces the hub first for a member of its cluster', () => {
    const current = getCalculator('finanses', 'pensiju-3-limena-kalkulators')!;
    const related = getRelatedCalculators(current, 4);
    expect(related[0].slug).toBe('pensija-latvija-celvedis');
  });

  it('does not surface a hub for a same-category item outside its cluster', () => {
    const current = getCalculator('finanses', 'alga-neto')!;
    const related = getRelatedCalculators(current, 10);
    expect(related.every((item) => item.slug !== 'pensija-latvija-celvedis')).toBe(true);
  });

  it('does not surface the hub as related to itself', () => {
    const hub = getArticle('finanses', 'pensija-latvija-celvedis')!;
    const related = getRelatedCalculators(hub, 4);
    expect(related.every((item) => item.slug !== 'pensija-latvija-celvedis')).toBe(true);
  });

  it('surfaces its own member spokes first when viewing a hub article', () => {
    const hub = getArticle('finanses', 'pensija-latvija-celvedis')!;
    const related = getRelatedCalculators(hub, 4);
    expect(related.map((item) => item.slug)).toEqual([
      'pensijas-kalkulators',
      'minimala-pensija',
      'priekslaicigas-pensijas-kalkulators',
      'priekslaicigas-vs-standarta-pensija',
    ]);
  });

  it('prioritizes curated overrides over default array order, after its own hub', () => {
    const current = getCalculator('majoklis', 'griestu-augstuma-kalkulators')!;
    const related = getRelatedCalculators(current, 4);
    expect(related.map((item) => item.slug)).toEqual([
      'buvniecibas-prasibu-celvedis',
      'logu-platibas-kalkulators',
      'ventilacijas-apjoma-kalkulators',
      'siltinajuma-biezuma-kalkulators',
    ]);
  });

  it('never returns duplicates even if the hub also appears in an override list', () => {
    const current = getCalculator('finanses', 'mun-kalkulators')!;
    const related = getRelatedCalculators(current, 10);
    const slugs = related.map((item) => item.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('surfaces the majoklis building-code hub first for one of its members', () => {
    const current = getCalculator('majoklis', 'griestu-augstuma-kalkulators')!;
    const related = getRelatedCalculators(current, 4);
    expect(related[0].slug).toBe('buvniecibas-prasibu-celvedis');
  });

  it('does not surface the majoklis hub for an unrelated majoklis item', () => {
    const current = getCalculator('majoklis', 'betona-apjoms')!;
    const related = getRelatedCalculators(current, 10);
    expect(related.every((item) => item.slug !== 'buvniecibas-prasibu-celvedis')).toBe(true);
  });

  it('falls back to default array order once curated relations are exhausted', () => {
    const current = getCalculator('auto', 'elektroauto-vs-benzina')!;
    const related = getRelatedCalculators(current, 4);
    expect(related).toHaveLength(4);
    expect(related.every((item) => item.category === 'auto')).toBe(true);
  });
});

describe('pension hub back-links', () => {
  it('every finanses pension spoke that RELATED_OVERRIDES/hub logic points at the hub also links back to it in its own body content', () => {
    // getContent is exercised here only to assert the spokes still exist; the actual
    // back-link text lives in lib/articleContent.tsx and app/[category]/[calculator]/page.tsx
    // explanations, which this registry-level test cannot see. See those files directly.
    const pensionSpokes = [
      'pensijas-kalkulators',
      'minimala-pensija',
      'priekslaicigas-pensijas-kalkulators',
      'priekslaicigas-vs-standarta-pensija',
      'pensiju-3-limena-kalkulators',
      'ka-izveleties-pensiju-3-limena-planu',
      'ieguldijumu-konta-nodoklu-kalkulators',
      'etf-pamati-pensijas-uzkrajumam',
      'izdienas-pensija',
    ];
    for (const slug of pensionSpokes) {
      expect(getContent('finanses', slug), `${slug} should exist in the registry`).toBeDefined();
    }
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
