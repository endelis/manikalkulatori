import { describe, expect, it } from 'vitest';
import { calculateSirdsdarbibasZonas } from './sirdsdarbibas-zonas';

describe('calculateSirdsdarbibasZonas', () => {
  it('computes heart rate reserve and zones for max 190 / resting 60', () => {
    const result = calculateSirdsdarbibasZonas({ maxHeartRate: 190, restingHeartRate: 60 });

    expect(result.heartRateReserve).toBe(130);
    expect(result.zones[0]).toEqual({ name: 'Ļoti viegla', minBpm: 125, maxBpm: 138 });
    expect(result.zones[2]).toEqual({ name: 'Vidēja', minBpm: 151, maxBpm: 164 });
    expect(result.zones[4]).toEqual({ name: 'Maksimāla', minBpm: 177, maxBpm: 190 });
  });

  it('computes the easy zone for max 180 / resting 50', () => {
    const result = calculateSirdsdarbibasZonas({ maxHeartRate: 180, restingHeartRate: 50 });

    expect(result.zones[1]).toEqual({ name: 'Viegla', minBpm: 128, maxBpm: 141 });
  });

  it('guards against a zero heart rate reserve without crashing', () => {
    const result = calculateSirdsdarbibasZonas({ maxHeartRate: 190, restingHeartRate: 190 });

    expect(result.heartRateReserve).toBe(0);
    for (const zone of result.zones) {
      expect(zone.minBpm).toBe(190);
      expect(zone.maxBpm).toBe(190);
    }
  });
});
