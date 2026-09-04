import { describe, expect, it } from 'vitest';
import { calculateTriatlonaPlanotajs } from './triatlona-planotajs';

describe('calculateTriatlonaPlanotajs', () => {
  it('computes segment times and total for a standard-distance triathlon', () => {
    const result = calculateTriatlonaPlanotajs({
      swimDistanceM: 1500,
      swimPaceMinPer100m: 2,
      t1Minutes: 3,
      bikeDistanceKm: 40,
      bikeSpeedKmh: 30,
      t2Minutes: 2,
      runDistanceKm: 10,
      runPaceMinPerKm: 5,
    });

    expect(result.swimTimeMinutes).toBeCloseTo(30, 2);
    expect(result.bikeTimeMinutes).toBeCloseTo(80, 2);
    expect(result.runTimeMinutes).toBeCloseTo(50, 2);
    expect(result.totalTimeMinutes).toBeCloseTo(165, 2);
  });

  it('computes segment times and total for a sprint-distance triathlon', () => {
    const result = calculateTriatlonaPlanotajs({
      swimDistanceM: 750,
      swimPaceMinPer100m: 2.5,
      t1Minutes: 2,
      bikeDistanceKm: 20,
      bikeSpeedKmh: 28,
      t2Minutes: 1.5,
      runDistanceKm: 5,
      runPaceMinPerKm: 5.5,
    });

    expect(result.swimTimeMinutes).toBeCloseTo(18.75, 2);
    expect(result.bikeTimeMinutes).toBeCloseTo(42.8571, 2);
    expect(result.runTimeMinutes).toBeCloseTo(27.5, 2);
    expect(result.totalTimeMinutes).toBeCloseTo(92.6071, 2);
  });

  it('guards against division by zero when bike speed is zero', () => {
    const result = calculateTriatlonaPlanotajs({
      swimDistanceM: 1500,
      swimPaceMinPer100m: 2,
      t1Minutes: 3,
      bikeDistanceKm: 40,
      bikeSpeedKmh: 0,
      t2Minutes: 2,
      runDistanceKm: 10,
      runPaceMinPerKm: 5,
    });

    expect(result.bikeTimeMinutes).toBe(0);
  });
});
