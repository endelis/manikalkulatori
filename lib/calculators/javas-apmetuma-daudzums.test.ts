import { describe, expect, it } from 'vitest';
import { calculateApmetumaDaudzums, calculateJavasDaudzums } from './javas-apmetuma-daudzums';

describe('calculateApmetumaDaudzums', () => {
  it('computes bag count from area, thickness and a consumption rate', () => {
    const result = calculateApmetumaDaudzums({
      wallAreaM2: 20,
      thicknessMm: 10,
      consumptionKgPerM2PerMm: 1.4,
      bagSizeKg: 25,
      wastePercent: 5,
    });
    // withWaste = 21 m2, kg = 21 * 10 * 1.4 = 294, bags = ceil(294/25) = 12
    expect(result.wallAreaWithWasteM2).toBeCloseTo(21, 6);
    expect(result.kgNeeded).toBeCloseTo(294, 6);
    expect(result.bagsNeeded).toBe(12);
  });

  it('returns 0 bags when bag size is 0 instead of dividing by zero', () => {
    const result = calculateApmetumaDaudzums({
      wallAreaM2: 20,
      thicknessMm: 10,
      consumptionKgPerM2PerMm: 1.4,
      bagSizeKg: 0,
      wastePercent: 0,
    });
    expect(result.bagsNeeded).toBe(0);
  });
});

describe('calculateJavasDaudzums', () => {
  it('derives mortar volume geometrically as wall volume minus solid unit volume', () => {
    const result = calculateJavasDaudzums({
      wallAreaM2: 10,
      unitLengthMm: 250,
      unitWidthMm: 120,
      unitHeightMm: 65,
      jointThicknessMm: 10,
      yieldKgPerLiter: 1.6667,
      bagSizeKg: 25,
      wastePercent: 0,
    });
    // units = ceil(10 / 0.0195 - eps) = 513
    // solid volume = 513 * 0.25 * 0.12 * 0.065 = 1.00035 m3
    // wall volume = 10 * 0.12 = 1.2 m3, mortar volume = 1.2 - 1.00035 = 0.19965 m3 = 199.65 L
    expect(result.unitsNeeded).toBe(513);
    expect(result.mortarVolumeLiters).toBeCloseTo(199.65, 2);
  });

  it('gives a positive mortar volume for a thicker wall than the unit width', () => {
    const result = calculateJavasDaudzums({
      wallAreaM2: 10,
      unitLengthMm: 250,
      unitWidthMm: 250,
      unitHeightMm: 65,
      jointThicknessMm: 10,
      yieldKgPerLiter: 1.6667,
      bagSizeKg: 25,
      wastePercent: 0,
    });
    expect(result.mortarVolumeLiters).toBeGreaterThan(0);
    expect(result.kgNeeded).toBeCloseTo(result.mortarVolumeLiters * 1.6667, 4);
    expect(result.bagsNeeded).toBe(Math.ceil(result.kgNeeded / 25 - 1e-9));
  });

  it('returns all zeros when unit dimensions are 0 instead of dividing by zero', () => {
    const result = calculateJavasDaudzums({
      wallAreaM2: 10,
      unitLengthMm: 0,
      unitWidthMm: 0,
      unitHeightMm: 0,
      jointThicknessMm: 10,
      yieldKgPerLiter: 1.6667,
      bagSizeKg: 25,
      wastePercent: 0,
    });
    expect(result).toEqual({ unitsNeeded: 0, mortarVolumeLiters: 0, kgNeeded: 0, bagsNeeded: 0 });
  });
});
