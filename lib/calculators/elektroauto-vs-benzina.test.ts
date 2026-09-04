import { describe, expect, it } from 'vitest';
import { computeEvVsIce } from './elektroauto-vs-benzina';

describe('computeEvVsIce', () => {
  it('picks the EV as cheaper when energy cost per km is lower', () => {
    const result = computeEvVsIce({
      annualDistanceKm: 15000,
      evConsumptionKwhPer100km: 17,
      electricityPricePerKwh: 0.2,
      iceConsumptionLPer100km: 6.5,
      fuelPricePerLiter: 1.65,
    });

    expect(result.evAnnualEnergyCost).toBeCloseTo(510, 5);
    expect(result.iceAnnualFuelCost).toBeCloseTo(1608.75, 5);
    expect(result.cheaperOption).toBe('ev');
    expect(result.annualSavings).toBeCloseTo(1098.75, 5);
    expect(result.fiveYearSavings).toBeCloseTo(5493.75, 5);
  });

  it('picks the ICE car as cheaper when its total cost is lower', () => {
    const result = computeEvVsIce({
      annualDistanceKm: 5000,
      evConsumptionKwhPer100km: 17,
      electricityPricePerKwh: 0.5,
      iceConsumptionLPer100km: 4,
      fuelPricePerLiter: 1.2,
    });

    expect(result.cheaperOption).toBe('ice');
    expect(result.annualSavings).toBeLessThan(0);
  });

  it('reports equal when annual total costs match within a cent', () => {
    const result = computeEvVsIce({
      annualDistanceKm: 10000,
      evConsumptionKwhPer100km: 20,
      electricityPricePerKwh: 0.1,
      iceConsumptionLPer100km: 5,
      fuelPricePerLiter: 0.4,
    });

    expect(result.evAnnualEnergyCost).toBeCloseTo(result.iceAnnualFuelCost, 5);
    expect(result.cheaperOption).toBe('equal');
  });

  it('adds optional annual extra costs to each side before comparing', () => {
    const result = computeEvVsIce({
      annualDistanceKm: 10000,
      evConsumptionKwhPer100km: 20,
      electricityPricePerKwh: 0.1,
      iceConsumptionLPer100km: 5,
      fuelPricePerLiter: 0.4,
      evAnnualExtraCosts: 300,
      iceAnnualExtraCosts: 0,
    });

    expect(result.evAnnualTotalCost).toBeCloseTo(result.evAnnualEnergyCost + 300, 5);
    expect(result.cheaperOption).toBe('ice');
  });

  it('returns all zeros and equal for zero annual distance', () => {
    const result = computeEvVsIce({
      annualDistanceKm: 0,
      evConsumptionKwhPer100km: 17,
      electricityPricePerKwh: 0.2,
      iceConsumptionLPer100km: 6.5,
      fuelPricePerLiter: 1.65,
    });

    expect(result.evAnnualEnergyCost).toBe(0);
    expect(result.iceAnnualFuelCost).toBe(0);
    expect(result.cheaperOption).toBe('equal');
  });

  it('matches the sourced Latvia defaults (Aug 2026) used as the UI defaults in Task 9', () => {
    const result = computeEvVsIce({
      annualDistanceKm: 15000,
      evConsumptionKwhPer100km: 16.5,
      electricityPricePerKwh: 0.18,
      iceConsumptionLPer100km: 7.0,
      fuelPricePerLiter: 1.85,
    });

    expect(result.evAnnualEnergyCost).toBeCloseTo(445.5, 2);
    expect(result.iceAnnualFuelCost).toBeCloseTo(1942.5, 2);
    expect(result.annualSavings).toBeCloseTo(1497, 2);
    expect(result.fiveYearSavings).toBeCloseTo(7485, 2);
    expect(result.cheaperOption).toBe('ev');
  });
});
