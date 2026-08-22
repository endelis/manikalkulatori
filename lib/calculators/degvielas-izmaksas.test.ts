import { describe, expect, it } from 'vitest';
import { calculateDegvielasIzmaksas } from './degvielas-izmaksas';

describe('calculateDegvielasIzmaksas', () => {
  it('matches the ICE side of the elektroauto-vs-benzina defaults', () => {
    const result = calculateDegvielasIzmaksas({
      annualDistanceKm: 15000,
      consumptionLPer100km: 7.0,
      fuelPricePerLiter: 1.85,
    });

    expect(result.costPer100km).toBeCloseTo(12.95, 2);
    expect(result.annualCost).toBeCloseTo(1942.5, 2);
    expect(result.monthlyCost).toBeCloseTo(161.875, 2);
  });

  it('returns zero cost for zero annual distance', () => {
    const result = calculateDegvielasIzmaksas({
      annualDistanceKm: 0,
      consumptionLPer100km: 7.0,
      fuelPricePerLiter: 1.85,
    });

    expect(result.annualCost).toBe(0);
    expect(result.monthlyCost).toBe(0);
  });

  it('computes correctly for a more efficient car', () => {
    const result = calculateDegvielasIzmaksas({
      annualDistanceKm: 20000,
      consumptionLPer100km: 5.5,
      fuelPricePerLiter: 1.7,
    });

    expect(result.costPer100km).toBeCloseTo(9.35, 2);
    expect(result.annualCost).toBeCloseTo(1870, 2);
  });
});
