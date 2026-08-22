import { describe, expect, it } from 'vitest';
import { calculateElektribasRekins } from './elektribas-rekins';

describe('calculateElektribasRekins', () => {
  it('computes variable, total monthly, and annual cost', () => {
    const result = calculateElektribasRekins({ monthlyConsumptionKwh: 250, pricePerKwh: 0.18, fixedMonthlyFee: 5 });

    expect(result.variableCost).toBeCloseTo(45, 2);
    expect(result.totalMonthlyCost).toBeCloseTo(50, 2);
    expect(result.annualCost).toBeCloseTo(600, 2);
  });

  it('applies the fixed fee even with zero consumption', () => {
    const result = calculateElektribasRekins({ monthlyConsumptionKwh: 0, pricePerKwh: 0.18, fixedMonthlyFee: 5 });

    expect(result.variableCost).toBe(0);
    expect(result.totalMonthlyCost).toBe(5);
  });

  it('handles zero fixed fee', () => {
    const result = calculateElektribasRekins({ monthlyConsumptionKwh: 400, pricePerKwh: 0.2, fixedMonthlyFee: 0 });

    expect(result.variableCost).toBeCloseTo(80, 2);
    expect(result.annualCost).toBeCloseTo(960, 2);
  });
});
