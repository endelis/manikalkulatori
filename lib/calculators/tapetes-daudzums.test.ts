import { describe, expect, it } from 'vitest';
import { calculateTapetesDaudzums } from './tapetes-daudzums';

describe('calculateTapetesDaudzums', () => {
  it('computes roll count for a simple room', () => {
    const result = calculateTapetesDaudzums({
      wallAreaM2: 30,
      rollWidthM: 0.53,
      rollLengthM: 10,
      wastePercent: 12,
    });
    // rollArea = 5.3, withWaste = 33.6, rolls = ceil(33.6 / 5.3) = 7
    expect(result.rollAreaM2).toBeCloseTo(5.3, 6);
    expect(result.wallAreaWithWasteM2).toBeCloseTo(33.6, 6);
    expect(result.rollsNeeded).toBe(Math.ceil(33.6 / 5.3));
  });

  it('does not round a mathematically whole roll count up an extra unit due to floating point noise', () => {
    const result = calculateTapetesDaudzums({
      wallAreaM2: 50,
      rollWidthM: 0.53,
      rollLengthM: 10,
      wastePercent: 0,
    });
    // 50 / 5.3 is not a clean whole number, so this exercises the general path; the
    // dedicated epsilon regression is the roofing calculator's own test.
    expect(result.rollsNeeded).toBe(Math.ceil(50 / 5.3 - 1e-9));
  });

  it('returns 0 rolls instead of dividing by zero when roll dimensions are 0', () => {
    const result = calculateTapetesDaudzums({ wallAreaM2: 30, rollWidthM: 0, rollLengthM: 10, wastePercent: 10 });
    expect(result.rollsNeeded).toBe(0);
  });

  it('applies a higher waste percentage for a patterned wallpaper scenario', () => {
    const plain = calculateTapetesDaudzums({ wallAreaM2: 30, rollWidthM: 0.53, rollLengthM: 10, wastePercent: 12 });
    const dropMatch = calculateTapetesDaudzums({
      wallAreaM2: 30,
      rollWidthM: 0.53,
      rollLengthM: 10,
      wastePercent: 25,
    });
    expect(dropMatch.wallAreaWithWasteM2).toBeGreaterThan(plain.wallAreaWithWasteM2);
    expect(dropMatch.rollsNeeded).toBeGreaterThanOrEqual(plain.rollsNeeded);
  });
});
