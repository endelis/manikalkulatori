import { describe, expect, it } from 'vitest';
import { calculateUzladesIzmaksas } from './uzlades-izmaksas';

describe('calculateUzladesIzmaksas', () => {
  it('computes total energy and blended cost for mixed home/public charging', () => {
    const result = calculateUzladesIzmaksas({
      annualDistanceKm: 15000,
      consumptionKwhPer100km: 16.5,
      homePricePerKwh: 0.18,
      publicPricePerKwh: 0.45,
      homeChargingPercent: 80,
    });

    expect(result.totalKwh).toBeCloseTo(2475, 1);
    expect(result.totalCost).toBeCloseTo(579.15, 2);
    expect(result.allHomeCost).toBeCloseTo(445.5, 2);
    expect(result.extraCostVsAllHome).toBeCloseTo(133.65, 2);
  });

  it('matches all-home cost when charging entirely at home', () => {
    const result = calculateUzladesIzmaksas({
      annualDistanceKm: 15000,
      consumptionKwhPer100km: 16.5,
      homePricePerKwh: 0.18,
      publicPricePerKwh: 0.45,
      homeChargingPercent: 100,
    });

    expect(result.totalCost).toBeCloseTo(445.5, 2);
    expect(result.extraCostVsAllHome).toBeCloseTo(0, 2);
    expect(result.publicCost).toBe(0);
  });

  it('computes public-only cost when charging entirely away from home', () => {
    const result = calculateUzladesIzmaksas({
      annualDistanceKm: 15000,
      consumptionKwhPer100km: 16.5,
      homePricePerKwh: 0.18,
      publicPricePerKwh: 0.45,
      homeChargingPercent: 0,
    });

    expect(result.homeCost).toBe(0);
    expect(result.publicCost).toBeCloseTo(1113.75, 2);
  });
});
