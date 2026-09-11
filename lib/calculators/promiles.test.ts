import { describe, expect, it } from 'vitest';
import { calculatePromiles } from './promiles';

describe('calculatePromiles', () => {
  it('computes BAC for a male using the Widmark formula', () => {
    const result = calculatePromiles({
      sex: 'male',
      weightKg: 80,
      volumeMl: 500,
      abvPercent: 5,
      hoursElapsed: 0,
    });

    const alcoholGrams = 500 * 0.05 * 0.789;
    const expected = alcoholGrams / (80 * 0.68);
    expect(result.bloodAlcoholPermille).toBeCloseTo(expected, 5);
  });

  it('computes a higher BAC for a female at the same weight due to the lower Widmark factor', () => {
    const male = calculatePromiles({
      sex: 'male',
      weightKg: 70,
      volumeMl: 500,
      abvPercent: 5,
      hoursElapsed: 0,
    });
    const female = calculatePromiles({
      sex: 'female',
      weightKg: 70,
      volumeMl: 500,
      abvPercent: 5,
      hoursElapsed: 0,
    });

    expect(female.bloodAlcoholPermille).toBeGreaterThan(male.bloodAlcoholPermille);
  });

  it('reduces BAC over elapsed time via the elimination rate', () => {
    const now = calculatePromiles({
      sex: 'male',
      weightKg: 80,
      volumeMl: 500,
      abvPercent: 5,
      hoursElapsed: 0,
    });
    const later = calculatePromiles({
      sex: 'male',
      weightKg: 80,
      volumeMl: 500,
      abvPercent: 5,
      hoursElapsed: 2,
    });

    expect(later.bloodAlcoholPermille).toBeCloseTo(
      Math.max(0, now.bloodAlcoholPermille - 0.15 * 2),
      5,
    );
  });

  it('never goes negative once enough time has elapsed', () => {
    const result = calculatePromiles({
      sex: 'male',
      weightKg: 80,
      volumeMl: 500,
      abvPercent: 5,
      hoursElapsed: 24,
    });

    expect(result.bloodAlcoholPermille).toBe(0);
  });

  it('guards against a zero weight without crashing', () => {
    const result = calculatePromiles({
      sex: 'male',
      weightKg: 0,
      volumeMl: 500,
      abvPercent: 5,
      hoursElapsed: 0,
    });

    expect(result.bloodAlcoholPermille).toBe(0);
  });
});
