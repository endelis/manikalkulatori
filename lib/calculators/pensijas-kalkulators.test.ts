import { describe, expect, it } from 'vitest';
import { computePension, cumulativeIndex, type PensionInput } from './pensijas-kalkulators';

// Small, self contained fixtures (not the real ~28 year VSAA series) so each test's
// expected value can be hand verified rather than trusting the production table.
const G_TABLE: Record<number, number> = { 65: 17.76, 66: 17.09, 70: 14.39 };
const INDEX_SERIES: Record<number, number> = { 2024: 1.1, 2025: 1.05, 2026: 1.0 };

const base: PensionInput = {
  currentYear: 2026,
  birthYear: 1990,
  currentGrossSalaryMonthly: 1000,
  insuranceRecordYears: 2,
  wageGrowthPercent: 4,
  retirementAge: 65,
  ndcStartYear: 1996,
  pillar1ContributionRatePercent: 15,
  wageIndexSeries: INDEX_SERIES,
  gTable: G_TABLE,
};

describe('computePension, past capital', () => {
  it('backfills each past year at today\'s salary with no further indexation (avoids double counting wage growth)', () => {
    // 2 years of record (2024, 2025), backfilled at today's salary: 1000 * 12 * 0.15
    // = 1800 per year, flat, not run through the index series a second time (that
    // salary figure is already expressed in today's terms).
    const result = computePension(base);
    const contribution = 1000 * 12 * 0.15;
    expect(result.capitalPast).toBeCloseTo(contribution * 2, 6);
  });

  it('is unaffected by the index series entirely: identical result whether the series is populated or empty', () => {
    // Pins the "no double counting" fix: if the index series were still being applied
    // to backfilled years, this would fail (the two results would differ).
    const withIndex = computePension(base);
    const withoutIndex = computePension({ ...base, wageIndexSeries: {} });
    expect(withoutIndex.capitalPast).toBe(withIndex.capitalPast);
  });

  it('scales linearly with effectiveServiceYears, one flat contribution per year', () => {
    const oneYear = computePension({ ...base, insuranceRecordYears: 1 });
    const threeYears = computePension({ ...base, insuranceRecordYears: 3 });
    expect(threeYears.capitalPast).toBeCloseTo(oneYear.capitalPast * 3, 6);
  });
});

describe('cumulativeIndex (exported for methodology copy, not used by computePension)', () => {
  it('multiplies the published per-year indices across the requested range', () => {
    expect(cumulativeIndex(2024, 2026, INDEX_SERIES)).toBeCloseTo(1.05 * 1.0, 10);
  });

  it('treats a year with no published index as 1, not a fabricated value', () => {
    expect(cumulativeIndex(2026, 2027, INDEX_SERIES)).toBeCloseTo(1, 10);
  });
});

describe('computePension, future capital', () => {
  it('compounds projected salary at the wage growth rate, contributing the pillar 1 share each year', () => {
    const result = computePension({ ...base, insuranceRecordYears: 0, retirementAge: 66 });
    // Retirement year = 1990 + 66 = 2056, so 30 future years (2026..2055).
    const annualSalary = 1000 * 12;
    let expected = 0;
    for (let year = 2026; year < 2056; year += 1) {
      const projected = annualSalary * 1.04 ** (year - 2026);
      expected += projected * 0.15;
    }
    expect(result.capitalFuture).toBeCloseTo(expected, 4);
  });
});

describe('computePension, retirement age and G', () => {
  it('uses the G value for the selected retirement age and derives monthlyPension from it', () => {
    const result = computePension({ ...base, insuranceRecordYears: 0, retirementAge: 70 });
    expect(result.gValue).toBe(14.39);
    expect(result.monthlyPension).toBeCloseTo(result.capitalTotal / 14.39 / 12, 10);
  });

  it('throws a clear error when the G table has no entry for the requested age', () => {
    expect(() => computePension({ ...base, retirementAge: 67 })).toThrow(/67/);
  });

  it('computes retirementYear from birth year plus retirement age', () => {
    const result = computePension({ ...base, birthYear: 1985, retirementAge: 65 });
    expect(result.retirementYear).toBe(1985 + 65);
  });
});

describe('computePension, service record clamped to the NDC start year', () => {
  it('does not count service before ndcStartYear, and reports the truncation', () => {
    const result = computePension({ ...base, insuranceRecordYears: 40, currentYear: 2026, ndcStartYear: 1996 });
    // 2026 - 40 = 1986, before 1996: the effective start year clamps to 1996.
    expect(result.serviceStartYear).toBe(1996);
    expect(result.serviceTruncated).toBe(true);
    expect(result.effectiveServiceYears).toBe(2026 - 1996);
  });

  it('reports no truncation when the requested record fits entirely after ndcStartYear', () => {
    const result = computePension({ ...base, insuranceRecordYears: 5, currentYear: 2026, ndcStartYear: 1996 });
    expect(result.serviceStartYear).toBe(2021);
    expect(result.serviceTruncated).toBe(false);
    expect(result.effectiveServiceYears).toBe(5);
  });
});
