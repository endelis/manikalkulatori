import { describe, expect, it } from 'vitest';
import { calculateMaratonaLaikaPrognoze } from './maratona-laika-prognoze';

describe('calculateMaratonaLaikaPrognoze', () => {
  it('predicts a marathon time from a 10K result using the Riegel formula', () => {
    const result = calculateMaratonaLaikaPrognoze({
      referenceDistanceKm: 10,
      referenceHours: 0,
      referenceMinutes: 45,
      referenceSeconds: 0,
      targetDistanceKm: 42.195,
    });

    const expectedSeconds = 2700 * Math.pow(42.195 / 10, 1.06);
    expect(result.predictedTotalSeconds).toBeCloseTo(expectedSeconds, 2);
    expect(result.predictedPaceMinPerKm).toBeCloseTo(expectedSeconds / 60 / 42.195, 5);
  });

  it('predicts a half marathon time from a 5K result', () => {
    const result = calculateMaratonaLaikaPrognoze({
      referenceDistanceKm: 5,
      referenceHours: 0,
      referenceMinutes: 22,
      referenceSeconds: 30,
      targetDistanceKm: 21.0975,
    });

    const expectedSeconds = 1350 * Math.pow(21.0975 / 5, 1.06);
    expect(result.predictedTotalSeconds).toBeCloseTo(expectedSeconds, 2);
  });

  it('guards against a zero reference time without crashing', () => {
    const result = calculateMaratonaLaikaPrognoze({
      referenceDistanceKm: 10,
      referenceHours: 0,
      referenceMinutes: 0,
      referenceSeconds: 0,
      targetDistanceKm: 42.195,
    });

    expect(result.predictedTotalSeconds).toBe(0);
    expect(result.predictedPaceMinPerKm).toBe(0);
  });

  it('guards against a zero reference distance without crashing', () => {
    const result = calculateMaratonaLaikaPrognoze({
      referenceDistanceKm: 0,
      referenceHours: 0,
      referenceMinutes: 45,
      referenceSeconds: 0,
      targetDistanceKm: 42.195,
    });

    expect(result.predictedTotalSeconds).toBe(0);
  });
});
