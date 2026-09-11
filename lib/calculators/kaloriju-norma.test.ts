import { describe, expect, it } from 'vitest';
import { calculateKalorijuNorma } from './kaloriju-norma';

describe('calculateKalorijuNorma', () => {
  it('computes BMR and TDEE for a moderately active male', () => {
    const result = calculateKalorijuNorma({
      sex: 'male',
      weightKg: 80,
      heightCm: 180,
      age: 30,
      activityLevel: 'moderate',
    });

    const expectedBmr = 10 * 80 + 6.25 * 180 - 5 * 30 + 5;
    expect(result.bmr).toBeCloseTo(expectedBmr, 5);
    expect(result.tdee).toBeCloseTo(expectedBmr * 1.55, 5);
  });

  it('computes BMR and TDEE for a sedentary female', () => {
    const result = calculateKalorijuNorma({
      sex: 'female',
      weightKg: 65,
      heightCm: 165,
      age: 28,
      activityLevel: 'sedentary',
    });

    const expectedBmr = 10 * 65 + 6.25 * 165 - 5 * 28 - 161;
    expect(result.bmr).toBeCloseTo(expectedBmr, 5);
    expect(result.tdee).toBeCloseTo(expectedBmr * 1.2, 5);
  });

  it('applies the correct multiplier for very active', () => {
    const result = calculateKalorijuNorma({
      sex: 'male',
      weightKg: 80,
      heightCm: 180,
      age: 30,
      activityLevel: 'veryActive',
    });

    const expectedBmr = 10 * 80 + 6.25 * 180 - 5 * 30 + 5;
    expect(result.tdee).toBeCloseTo(expectedBmr * 1.9, 5);
  });

  it('guards against a negative BMR without crashing', () => {
    const result = calculateKalorijuNorma({
      sex: 'female',
      weightKg: 0,
      heightCm: 0,
      age: 90,
      activityLevel: 'sedentary',
    });

    expect(result.bmr).toBe(0);
    expect(result.tdee).toBe(0);
  });
});
