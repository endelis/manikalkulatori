import { describe, expect, it } from 'vitest';
import { calculateTaukuProcents } from './tauku-procents';

describe('calculateTaukuProcents', () => {
  it('computes body fat percentage for a male using the Navy formula', () => {
    const result = calculateTaukuProcents({
      sex: 'male',
      heightCm: 180,
      neckCm: 38,
      waistCm: 85,
      hipCm: 0,
    });

    const waistMinusNeck = 85 - 38;
    const expected =
      495 /
        (1.0324 -
          0.19077 * (Math.log(waistMinusNeck) / Math.LN10) +
          0.15456 * (Math.log(180) / Math.LN10)) -
      450;
    expect(result.bodyFatPercent).toBeCloseTo(expected, 4);
  });

  it('computes body fat percentage for a female using the Navy formula', () => {
    const result = calculateTaukuProcents({
      sex: 'female',
      heightCm: 165,
      neckCm: 32,
      waistCm: 70,
      hipCm: 95,
    });

    const combined = 70 + 95 - 32;
    const expected =
      495 /
        (1.29579 -
          0.35004 * (Math.log(combined) / Math.LN10) +
          0.221 * (Math.log(165) / Math.LN10)) -
      450;
    expect(result.bodyFatPercent).toBeCloseTo(expected, 4);
  });

  it('guards against a non-positive waist-minus-neck for males without crashing', () => {
    const result = calculateTaukuProcents({
      sex: 'male',
      heightCm: 180,
      neckCm: 40,
      waistCm: 40,
      hipCm: 0,
    });

    expect(result.bodyFatPercent).toBe(0);
  });

  it('guards against a non-positive combined measurement for females without crashing', () => {
    const result = calculateTaukuProcents({
      sex: 'female',
      heightCm: 165,
      neckCm: 100,
      waistCm: 30,
      hipCm: 30,
    });

    expect(result.bodyFatPercent).toBe(0);
  });
});
