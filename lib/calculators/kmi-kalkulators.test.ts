import { describe, expect, it } from 'vitest';
import { calculateKmi } from './kmi-kalkulators';

describe('calculateKmi', () => {
  it('computes BMI and classifies as normal', () => {
    const result = calculateKmi({ weightKg: 70, heightCm: 175 });

    expect(result.bmi).toBeCloseTo(70 / (1.75 * 1.75), 5);
    expect(result.category).toBe('normal');
  });

  it('classifies as underweight below 18.5', () => {
    const result = calculateKmi({ weightKg: 50, heightCm: 175 });

    expect(result.category).toBe('underweight');
  });

  it('classifies as overweight between 25 and 30', () => {
    const result = calculateKmi({ weightKg: 85, heightCm: 175 });

    expect(result.category).toBe('overweight');
  });

  it('classifies as obese at 30 or above', () => {
    const result = calculateKmi({ weightKg: 100, heightCm: 175 });

    expect(result.category).toBe('obese');
  });

  it('guards against a zero height without crashing', () => {
    const result = calculateKmi({ weightKg: 70, heightCm: 0 });

    expect(result.bmi).toBe(0);
  });
});
