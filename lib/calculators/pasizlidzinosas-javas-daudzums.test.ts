import { describe, expect, it } from 'vitest';
import { calculatePasizlidzinosasJavasDaudzums } from './pasizlidzinosas-javas-daudzums';

describe('calculatePasizlidzinosasJavasDaudzums', () => {
  it('computes bag count from area, thickness, consumption rate and waste percent', () => {
    const result = calculatePasizlidzinosasJavasDaudzums({
      areaM2: 15,
      thicknessMm: 5,
      consumptionKgPerM2PerMm: 1.5,
      bagSizeKg: 25,
      wastePercent: 5,
    });
    // withWaste = 15.75 m2, kg = 15.75 * 5 * 1.5 = 118.125, bags = ceil(118.125/25) = 5
    expect(result.areaWithWasteM2).toBeCloseTo(15.75, 6);
    expect(result.kgNeeded).toBeCloseTo(118.125, 6);
    expect(result.bagsNeeded).toBe(5);
  });

  it('needs more bags for a thicker fill layer at the same area', () => {
    const thin = calculatePasizlidzinosasJavasDaudzums({
      areaM2: 15,
      thicknessMm: 5,
      consumptionKgPerM2PerMm: 2.0,
      bagSizeKg: 25,
      wastePercent: 0,
    });
    const thick = calculatePasizlidzinosasJavasDaudzums({
      areaM2: 15,
      thicknessMm: 20,
      consumptionKgPerM2PerMm: 2.0,
      bagSizeKg: 25,
      wastePercent: 0,
    });
    expect(thick.bagsNeeded).toBeGreaterThan(thin.bagsNeeded);
  });

  it('returns 0 bags when bag size is 0 instead of dividing by zero', () => {
    const result = calculatePasizlidzinosasJavasDaudzums({
      areaM2: 15,
      thicknessMm: 5,
      consumptionKgPerM2PerMm: 1.5,
      bagSizeKg: 0,
      wastePercent: 0,
    });
    expect(result.bagsNeeded).toBe(0);
  });
});
