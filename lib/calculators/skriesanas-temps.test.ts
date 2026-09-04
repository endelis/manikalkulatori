import { describe, expect, it } from 'vitest';
import { calculateSkriesanasTemps } from './skriesanas-temps';

describe('calculateSkriesanasTemps', () => {
  it('computes pace and speed for a 10km run', () => {
    const result = calculateSkriesanasTemps({ distanceKm: 10, hours: 0, minutes: 50, seconds: 0 });

    expect(result.paceMinPerKm).toBeCloseTo(5, 3);
    expect(result.speedKmh).toBeCloseTo(12, 3);
  });

  it('computes pace and speed for a half marathon', () => {
    const result = calculateSkriesanasTemps({ distanceKm: 21.0975, hours: 1, minutes: 45, seconds: 0 });

    expect(result.paceMinPerKm).toBeCloseTo(4.9769, 3);
    expect(result.speedKmh).toBeCloseTo(12.0557, 3);
  });

  it('guards against division by zero when distance is zero', () => {
    const result = calculateSkriesanasTemps({ distanceKm: 0, hours: 0, minutes: 30, seconds: 0 });

    expect(result.paceMinPerKm).toBe(0);
    expect(result.speedKmh).toBe(0);
  });
});
