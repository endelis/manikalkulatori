import { describe, expect, it } from 'vitest';
import { calculateVo2max } from './vo2max';

describe('calculateVo2max', () => {
  it('computes VO2max from a 2800m 12-minute run using the Cooper formula', () => {
    const result = calculateVo2max({ distanceMeters: 2800 });

    expect(result.vo2max).toBeCloseTo((2800 - 504.9) / 44.73, 5);
  });

  it('computes VO2max for a well-trained runner', () => {
    const result = calculateVo2max({ distanceMeters: 3200 });

    expect(result.vo2max).toBeCloseTo((3200 - 504.9) / 44.73, 5);
  });

  it('guards against a distance below the formula baseline without going negative', () => {
    const result = calculateVo2max({ distanceMeters: 400 });

    expect(result.vo2max).toBe(0);
  });

  it('guards against a negative distance without crashing', () => {
    const result = calculateVo2max({ distanceMeters: -100 });

    expect(result.vo2max).toBe(0);
  });
});
