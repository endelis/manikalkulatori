import { describe, expect, it } from 'vitest';
import { calculateTreninaKalorijas } from './trenina-kalorijas';

describe('calculateTreninaKalorijas', () => {
  it('computes calories burned for a 30-minute run at 75kg', () => {
    const result = calculateTreninaKalorijas({
      activity: 'running',
      weightKg: 75,
      durationMinutes: 30,
    });

    expect(result.caloriesBurned).toBeCloseTo(8.3 * 75 * 0.5, 5);
  });

  it('computes calories burned for a 45-minute walk at 60kg', () => {
    const result = calculateTreninaKalorijas({
      activity: 'walking',
      weightKg: 60,
      durationMinutes: 45,
    });

    expect(result.caloriesBurned).toBeCloseTo(3.8 * 60 * 0.75, 5);
  });

  it('computes calories burned for cycling', () => {
    const result = calculateTreninaKalorijas({
      activity: 'cycling',
      weightKg: 80,
      durationMinutes: 60,
    });

    expect(result.caloriesBurned).toBeCloseTo(7.5 * 80 * 1, 5);
  });

  it('computes calories burned for swimming', () => {
    const result = calculateTreninaKalorijas({
      activity: 'swimming',
      weightKg: 70,
      durationMinutes: 40,
    });

    expect(result.caloriesBurned).toBeCloseTo(6.0 * 70 * (40 / 60), 5);
  });

  it('guards against a zero duration without crashing', () => {
    const result = calculateTreninaKalorijas({
      activity: 'running',
      weightKg: 75,
      durationMinutes: 0,
    });

    expect(result.caloriesBurned).toBe(0);
  });

  it('guards against a negative weight without crashing', () => {
    const result = calculateTreninaKalorijas({
      activity: 'running',
      weightKg: -10,
      durationMinutes: 30,
    });

    expect(result.caloriesBurned).toBe(0);
  });
});
