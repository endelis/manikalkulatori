import { describe, expect, it } from 'vitest';
import { calculateKasko } from './kasko-kalkulators';

describe('calculateKasko', () => {
  it('computes monthly premium, percent of value, and three-year total', () => {
    const result = calculateKasko({ vehicleValue: 20000, annualPremium: 600 });

    expect(result.monthlyPremium).toBe(50);
    expect(result.premiumPercentOfValue).toBe(3);
    expect(result.threeYearTotal).toBe(1800);
  });

  it('guards against division by zero when vehicle value is zero', () => {
    const result = calculateKasko({ vehicleValue: 0, annualPremium: 600 });

    expect(result.premiumPercentOfValue).toBe(0);
    expect(Number.isFinite(result.premiumPercentOfValue)).toBe(true);
  });

  it('computes correctly for a smaller vehicle value', () => {
    const result = calculateKasko({ vehicleValue: 15000, annualPremium: 450 });

    expect(result.monthlyPremium).toBe(37.5);
    expect(result.premiumPercentOfValue).toBe(3);
    expect(result.threeYearTotal).toBe(1350);
  });
});
