import { describe, expect, it } from 'vitest';
import { calculateJumtaSeguma, calculateSlopedRoofArea } from './jumta-seguma-daudzums';

describe('calculateSlopedRoofArea', () => {
  it('returns the footprint area unchanged for a flat roof (0 degrees)', () => {
    expect(calculateSlopedRoofArea(100, 0)).toBeCloseTo(100, 6);
  });

  it('increases the area for a pitched roof (cos(60) = 0.5, so area doubles)', () => {
    expect(calculateSlopedRoofArea(100, 60)).toBeCloseTo(200, 6);
  });

  it('matches a hand computable 30 degree case', () => {
    // cos(30 deg) = sqrt(3)/2 ~= 0.8660254
    expect(calculateSlopedRoofArea(100, 30)).toBeCloseTo(100 / (Math.sqrt(3) / 2), 6);
  });
});

describe('calculateJumtaSeguma, dakstiņi', () => {
  it('computes tile count from roof area, waste, and tiles per m2', () => {
    const result = calculateJumtaSeguma({
      footprintAreaM2: 100,
      pitchDegrees: 0,
      wastePercent: 10,
      material: 'dakstini',
      tilesPerM2: 10,
    });
    // roofArea = 100, withWaste = 110, tiles = ceil(110 * 10) = 1100. Floating point
    // noise alone would push this to 1101 (100 * 1.1 is 110.00000000000001 in IEEE 754),
    // pinning the exact 1100 here specifically to guard the epsilon fix in ceilWhole.
    expect(result.roofAreaM2).toBeCloseTo(100, 6);
    expect(result.roofAreaWithWasteM2).toBeCloseTo(110, 6);
    expect(result.unitsNeeded).toBe(1100);
  });

  it('rounds up to a whole tile', () => {
    const result = calculateJumtaSeguma({
      footprintAreaM2: 10,
      pitchDegrees: 0,
      wastePercent: 0,
      material: 'dakstini',
      tilesPerM2: 10.33,
    });
    expect(result.unitsNeeded).toBe(Math.ceil(10 * 10.33));
  });
});

describe('calculateJumtaSeguma, metāla loksnes', () => {
  it('computes sheet count from roof area and per sheet coverage', () => {
    const result = calculateJumtaSeguma({
      footprintAreaM2: 100,
      pitchDegrees: 0,
      wastePercent: 0,
      material: 'metala-loksnes',
      sheetEffectiveWidthM: 1.1,
      sheetLengthM: 6,
    });
    // coverage per sheet = 6.6, sheets = ceil(100 / 6.6) = 16
    expect(result.unitsNeeded).toBe(Math.ceil(100 / 6.6));
  });

  it('returns 0 units instead of dividing by zero when sheet dimensions are missing', () => {
    const result = calculateJumtaSeguma({
      footprintAreaM2: 100,
      pitchDegrees: 0,
      wastePercent: 0,
      material: 'metala-loksnes',
    });
    expect(result.unitsNeeded).toBe(0);
  });
});

describe('calculateJumtaSeguma, bitumena šindeļi', () => {
  it('computes package count from roof area and package coverage', () => {
    const result = calculateJumtaSeguma({
      footprintAreaM2: 50,
      pitchDegrees: 0,
      wastePercent: 15,
      material: 'bitumena-sindeli',
      packageCoverageM2: 2.5,
    });
    // withWaste = 57.5, packages = ceil(57.5 / 2.5) = 23
    expect(result.unitsNeeded).toBe(Math.ceil(57.5 / 2.5));
  });

  it('returns 0 units instead of dividing by zero when package coverage is 0', () => {
    const result = calculateJumtaSeguma({
      footprintAreaM2: 50,
      pitchDegrees: 0,
      wastePercent: 0,
      material: 'bitumena-sindeli',
      packageCoverageM2: 0,
    });
    expect(result.unitsNeeded).toBe(0);
  });
});

describe('calculateJumtaSeguma, combined pitch and waste', () => {
  it('applies both the pitch area increase and the waste percentage together', () => {
    const result = calculateJumtaSeguma({
      footprintAreaM2: 120,
      pitchDegrees: 35,
      wastePercent: 12,
      material: 'dakstini',
      tilesPerM2: 10,
    });
    const expectedRoofArea = 120 / Math.cos((35 * Math.PI) / 180);
    const expectedWithWaste = expectedRoofArea * 1.12;
    expect(result.roofAreaM2).toBeCloseTo(expectedRoofArea, 6);
    expect(result.roofAreaWithWasteM2).toBeCloseTo(expectedWithWaste, 6);
    expect(result.unitsNeeded).toBe(Math.ceil(expectedWithWaste * 10));
  });
});
