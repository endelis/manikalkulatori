import { describe, expect, it } from 'vitest';
import { calculateApkuresIzmaksas } from './apkures-izmaksas';

describe('calculateApkuresIzmaksas', () => {
  it('finds the cheapest heating option and the savings vs the most expensive', () => {
    const result = calculateApkuresIzmaksas({
      annualHeatingNeedKwh: 15000,
      gasPricePerKwh: 0.12,
      firewoodPricePerKwh: 0.05,
      heatPumpPricePerKwh: 0.06,
    });

    expect(result.gasCost).toBeCloseTo(1800, 1);
    expect(result.firewoodCost).toBeCloseTo(750, 1);
    expect(result.heatPumpCost).toBeCloseTo(900, 1);
    expect(result.cheapestOption).toBe('firewood');
    expect(result.cheapestAmount).toBeCloseTo(750, 1);
    expect(result.savingsVsMostExpensive).toBeCloseTo(1050, 1);
  });

  it('picks the first option on a tie', () => {
    const result = calculateApkuresIzmaksas({
      annualHeatingNeedKwh: 15000,
      gasPricePerKwh: 0.05,
      firewoodPricePerKwh: 0.05,
      heatPumpPricePerKwh: 0.05,
    });

    expect(result.cheapestOption).toBe('gas');
    expect(result.savingsVsMostExpensive).toBe(0);
  });
});
