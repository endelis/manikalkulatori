import { describe, expect, it } from 'vitest';
import { calculateNolietojums } from './nolietojums';

describe('calculateNolietojums', () => {
  it('computes current value and total depreciation after several years', () => {
    const result = calculateNolietojums({ purchasePrice: 25000, ageYears: 3, annualDepreciationRatePercent: 15 });

    expect(result.currentValue).toBeCloseTo(15353.125, 2);
    expect(result.totalDepreciation).toBeCloseTo(9646.875, 2);
    expect(result.depreciationPercent).toBeCloseTo(38.5875, 3);
  });

  it('has no depreciation when age is zero', () => {
    const result = calculateNolietojums({ purchasePrice: 20000, ageYears: 0, annualDepreciationRatePercent: 15 });

    expect(result.currentValue).toBeCloseTo(20000, 2);
    expect(result.totalDepreciation).toBeCloseTo(0, 2);
  });

  it('guards against division by zero when purchase price is zero', () => {
    const result = calculateNolietojums({ purchasePrice: 0, ageYears: 3, annualDepreciationRatePercent: 15 });

    expect(result.depreciationPercent).toBe(0);
  });
});
