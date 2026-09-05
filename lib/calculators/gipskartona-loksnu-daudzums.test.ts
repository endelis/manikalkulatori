import { describe, expect, it } from 'vitest';
import { calculateGipskartonaLoksnuDaudzums } from './gipskartona-loksnu-daudzums';

describe('calculateGipskartonaLoksnuDaudzums', () => {
  it('computes sheet count from area, sheet size and waste percent', () => {
    const result = calculateGipskartonaLoksnuDaudzums({
      wallAreaM2: 20,
      sheetWidthMm: 1200,
      sheetLengthMm: 2600,
      wastePercent: 10,
    });
    // sheet area = 1.2 * 2.6 = 3.12 m2, withWaste = 22 m2, sheets = ceil(22/3.12) = 8
    expect(result.sheetAreaM2).toBeCloseTo(3.12, 6);
    expect(result.wallAreaWithWasteM2).toBeCloseTo(22, 6);
    expect(result.sheetsNeeded).toBe(8);
  });

  it('needs fewer sheets for a longer sheet option, same width', () => {
    const shortSheet = calculateGipskartonaLoksnuDaudzums({
      wallAreaM2: 20,
      sheetWidthMm: 1200,
      sheetLengthMm: 2000,
      wastePercent: 0,
    });
    const longSheet = calculateGipskartonaLoksnuDaudzums({
      wallAreaM2: 20,
      sheetWidthMm: 1200,
      sheetLengthMm: 3000,
      wastePercent: 0,
    });
    expect(longSheet.sheetsNeeded).toBeLessThanOrEqual(shortSheet.sheetsNeeded);
  });

  it('returns 0 sheets instead of dividing by zero when sheet dimensions are 0', () => {
    const result = calculateGipskartonaLoksnuDaudzums({
      wallAreaM2: 20,
      sheetWidthMm: 0,
      sheetLengthMm: 0,
      wastePercent: 0,
    });
    expect(result.sheetsNeeded).toBe(0);
  });
});
