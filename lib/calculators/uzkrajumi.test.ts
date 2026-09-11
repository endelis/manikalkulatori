import { describe, expect, it } from 'vitest';
import { calculateUzkrajumi } from './uzkrajumi';

describe('calculateUzkrajumi', () => {
  it('computes future value with compound growth and contributions', () => {
    const result = calculateUzkrajumi({
      initialAmountEur: 1000,
      monthlyContributionEur: 100,
      annualReturnPercent: 6,
      years: 10,
    });

    const monthlyRate = 0.06 / 12;
    const months = 120;
    const growth = Math.pow(1 + monthlyRate, months);
    const expectedFv = 1000 * growth + 100 * ((growth - 1) / monthlyRate);

    expect(result.futureValueEur).toBeCloseTo(expectedFv, 5);
    expect(result.totalContributedEur).toBe(1000 + 100 * 120);
  });

  it('handles a zero return rate as simple contribution summing', () => {
    const result = calculateUzkrajumi({
      initialAmountEur: 500,
      monthlyContributionEur: 50,
      annualReturnPercent: 0,
      years: 2,
    });

    expect(result.futureValueEur).toBe(500 + 50 * 24);
    expect(result.totalGrowthEur).toBe(0);
  });

  it('returns the initial amount unchanged for zero years', () => {
    const result = calculateUzkrajumi({
      initialAmountEur: 1000,
      monthlyContributionEur: 100,
      annualReturnPercent: 6,
      years: 0,
    });

    expect(result.futureValueEur).toBe(1000);
    expect(result.totalGrowthEur).toBe(0);
  });

  it('guards against negative inputs without crashing', () => {
    const result = calculateUzkrajumi({
      initialAmountEur: -100,
      monthlyContributionEur: -50,
      annualReturnPercent: 6,
      years: 5,
    });

    expect(result.futureValueEur).toBeGreaterThanOrEqual(0);
  });
});
