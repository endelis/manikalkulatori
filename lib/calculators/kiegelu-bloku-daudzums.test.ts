import { describe, expect, it } from 'vitest';
import { calculateKiegeluBlokuDaudzums } from './kiegelu-bloku-daudzums';

describe('calculateKiegeluBlokuDaudzums, ceramic brick', () => {
  it('computes brick count for a 10 m2 wall with the sourced Lode NF brick dimensions', () => {
    const result = calculateKiegeluBlokuDaudzums({
      wallAreaM2: 10,
      unitLengthMm: 250,
      unitHeightMm: 65,
      jointThicknessMm: 10,
      wastePercent: 0,
    });
    // effective area = 0.26 * 0.075 = 0.0195 m2, 10 / 0.0195 = 512.82.. -> 513
    expect(result.effectiveUnitAreaM2).toBeCloseTo(0.0195, 6);
    expect(result.unitsNeeded).toBe(Math.ceil(10 / 0.0195 - 1e-9));
  });
});

describe('calculateKiegeluBlokuDaudzums, aerated block', () => {
  it('computes block count for a 20 m2 wall with the sourced Bauroc block dimensions', () => {
    const result = calculateKiegeluBlokuDaudzums({
      wallAreaM2: 20,
      unitLengthMm: 600,
      unitHeightMm: 200,
      jointThicknessMm: 10,
      wastePercent: 5,
    });
    // effective area = 0.61 * 0.21 = 0.1281 m2, withWaste = 21 m2, 21 / 0.1281 = 163.9.. -> 164
    expect(result.effectiveUnitAreaM2).toBeCloseTo(0.1281, 6);
    expect(result.wallAreaWithWasteM2).toBeCloseTo(21, 6);
    expect(result.unitsNeeded).toBe(Math.ceil(21 / 0.1281 - 1e-9));
  });
});

describe('calculateKiegeluBlokuDaudzums, joint thickness sensitivity', () => {
  it('needs fewer units for a thicker joint (each unit occupies more effective area)', () => {
    const thinJoint = calculateKiegeluBlokuDaudzums({
      wallAreaM2: 10,
      unitLengthMm: 250,
      unitHeightMm: 65,
      jointThicknessMm: 10,
      wastePercent: 0,
    });
    const thickJoint = calculateKiegeluBlokuDaudzums({
      wallAreaM2: 10,
      unitLengthMm: 250,
      unitHeightMm: 65,
      jointThicknessMm: 14,
      wastePercent: 0,
    });
    expect(thickJoint.effectiveUnitAreaM2).toBeGreaterThan(thinJoint.effectiveUnitAreaM2);
    expect(thickJoint.unitsNeeded).toBeLessThanOrEqual(thinJoint.unitsNeeded);
  });
});

describe('calculateKiegeluBlokuDaudzums, edge cases', () => {
  it('returns 0 units instead of dividing by zero when unit dimensions are 0', () => {
    const result = calculateKiegeluBlokuDaudzums({
      wallAreaM2: 10,
      unitLengthMm: 0,
      unitHeightMm: 0,
      jointThicknessMm: 10,
      wastePercent: 0,
    });
    expect(result.unitsNeeded).toBe(0);
  });
});
