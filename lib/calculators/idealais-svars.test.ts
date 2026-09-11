import { describe, expect, it } from 'vitest';
import { calculateIdealaisSvars } from './idealais-svars';

describe('calculateIdealaisSvars', () => {
  it('computes ideal weight for a male at 180cm using the Devine formula', () => {
    const result = calculateIdealaisSvars({ sex: 'male', heightCm: 180 });

    const heightInches = 180 / 2.54;
    const expected = 50 + 2.3 * (heightInches - 60);
    expect(result.idealWeightKg).toBeCloseTo(expected, 5);
  });

  it('computes ideal weight for a female at 165cm using the Devine formula', () => {
    const result = calculateIdealaisSvars({ sex: 'female', heightCm: 165 });

    const heightInches = 165 / 2.54;
    const expected = 45.5 + 2.3 * (heightInches - 60);
    expect(result.idealWeightKg).toBeCloseTo(expected, 5);
  });

  it('returns exactly the base weight at 152.4cm (60 inches)', () => {
    const result = calculateIdealaisSvars({ sex: 'male', heightCm: 152.4 });

    expect(result.idealWeightKg).toBeCloseTo(50, 3);
  });

  it('guards against a very short height without going negative', () => {
    const result = calculateIdealaisSvars({ sex: 'female', heightCm: 50 });

    expect(result.idealWeightKg).toBe(0);
  });
});
