import { describe, expect, it } from 'vitest';
import { calculateCelaIzmaksas } from './cela-izmaksas';

describe('calculateCelaIzmaksas', () => {
  it('computes trip cost and cost per person for a single traveler', () => {
    const result = calculateCelaIzmaksas({ distanceKm: 350, consumptionLPer100km: 7.0, fuelPricePerLiter: 1.85, peopleCount: 1 });

    expect(result.tripCost).toBeCloseTo(45.325, 3);
    expect(result.costPerPerson).toBeCloseTo(45.325, 3);
  });

  it('splits the same trip cost across multiple people', () => {
    const result = calculateCelaIzmaksas({ distanceKm: 350, consumptionLPer100km: 7.0, fuelPricePerLiter: 1.85, peopleCount: 3 });

    expect(result.costPerPerson).toBeCloseTo(15.1083, 3);
  });

  it('has zero cost when distance is zero', () => {
    const result = calculateCelaIzmaksas({ distanceKm: 0, consumptionLPer100km: 7.0, fuelPricePerLiter: 1.85, peopleCount: 1 });

    expect(result.tripCost).toBe(0);
  });
});
