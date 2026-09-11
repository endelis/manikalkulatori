import { describe, expect, it } from 'vitest';
import { calculateInflacija } from './inflacija';

describe('calculateInflacija', () => {
  it('computes future purchasing power with compounding inflation', () => {
    const result = calculateInflacija({ amountEur: 1000, annualInflationPercent: 3, years: 10 });

    const expected = 1000 / Math.pow(1.03, 10);
    expect(result.futurePurchasingPowerEur).toBeCloseTo(expected, 5);
    expect(result.purchasingPowerLostEur).toBeCloseTo(1000 - expected, 5);
  });

  it('returns the same amount for zero years', () => {
    const result = calculateInflacija({ amountEur: 500, annualInflationPercent: 5, years: 0 });

    expect(result.futurePurchasingPowerEur).toBe(500);
    expect(result.purchasingPowerLostEur).toBe(0);
  });

  it('returns the same amount for zero inflation', () => {
    const result = calculateInflacija({ amountEur: 500, annualInflationPercent: 0, years: 10 });

    expect(result.futurePurchasingPowerEur).toBe(500);
  });

  it('guards against a negative amount without crashing', () => {
    const result = calculateInflacija({ amountEur: -100, annualInflationPercent: 3, years: 5 });

    expect(result.futurePurchasingPowerEur).toBe(0);
  });
});
