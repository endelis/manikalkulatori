import { describe, expect, it } from 'vitest';
import { calculateSiltumsuknaAtmaksas } from './siltumsukna-atmaksa';

describe('calculateSiltumsuknaAtmaksas', () => {
  it('computes electricity use, costs, savings, and payback years', () => {
    const result = calculateSiltumsuknaAtmaksas({
      heatPumpCostEur: 6000,
      annualHeatingNeedKwh: 15000,
      heatPumpCop: 3.5,
      oldHeatingPricePerKwh: 0.09,
      electricityPricePerKwh: 0.18,
    });

    expect(result.heatPumpElectricityKwh).toBeCloseTo(4285.7143, 2);
    expect(result.heatPumpAnnualCost).toBeCloseTo(771.4286, 2);
    expect(result.oldAnnualCost).toBeCloseTo(1350, 1);
    expect(result.annualSavings).toBeCloseTo(578.5714, 2);
    expect(result.paybackYears).toBeCloseTo(10.3704, 3);
  });

  it('never pays back when the heat pump costs more than the old system', () => {
    const result = calculateSiltumsuknaAtmaksas({
      heatPumpCostEur: 6000,
      annualHeatingNeedKwh: 15000,
      heatPumpCop: 1,
      oldHeatingPricePerKwh: 0.1,
      electricityPricePerKwh: 0.18,
    });

    expect(result.annualSavings).toBeCloseTo(-1200, 1);
    expect(result.paybackYears).toBe(Infinity);
  });
});
