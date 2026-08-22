import { describe, expect, it } from 'vitest';
import { calculateSolaruAtmaksas } from './solaru-atmaksa';

describe('calculateSolaruAtmaksas', () => {
  it('computes annual generation, savings, and payback years', () => {
    const result = calculateSolaruAtmaksas({
      systemCostEur: 8000,
      systemSizeKwp: 6,
      annualGenerationPerKwp: 950,
      selfConsumptionPercent: 40,
      electricityPricePerKwh: 0.18,
      exportPricePerKwh: 0.06,
    });

    expect(result.annualGenerationKwh).toBeCloseTo(5700, 1);
    expect(result.annualSavings).toBeCloseTo(615.6, 1);
    expect(result.paybackYears).toBeCloseTo(12.9955, 3);
  });

  it('uses only retail price when self-consumption is 100%', () => {
    const result = calculateSolaruAtmaksas({
      systemCostEur: 8000,
      systemSizeKwp: 6,
      annualGenerationPerKwp: 950,
      selfConsumptionPercent: 100,
      electricityPricePerKwh: 0.18,
      exportPricePerKwh: 0.06,
    });

    expect(result.annualSavings).toBeCloseTo(1026, 1);
  });

  it('guards against division by zero when there are no savings', () => {
    const result = calculateSolaruAtmaksas({
      systemCostEur: 8000,
      systemSizeKwp: 6,
      annualGenerationPerKwp: 950,
      selfConsumptionPercent: 40,
      electricityPricePerKwh: 0,
      exportPricePerKwh: 0,
    });

    expect(result.annualSavings).toBe(0);
    expect(result.paybackYears).toBe(Infinity);
  });
});
