import { describe, expect, it } from 'vitest';
import { calculateGrantsSmiltsSkembuApjoms } from './grants-smilts-skembu-apjoms';

describe('calculateGrantsSmiltsSkembuApjoms', () => {
  it('computes volume and mass from area, depth, compaction and density', () => {
    const result = calculateGrantsSmiltsSkembuApjoms({
      areaM2: 10,
      depthMm: 100,
      compactionPercent: 15,
      densityTPerM3: 1.6,
    });
    // volume = 10 * 0.1 = 1 m3, withCompaction = 1 * 1.15 = 1.15 m3, mass = 1.15 * 1.6 = 1.84 t
    expect(result.volumeM3).toBeCloseTo(1, 6);
    expect(result.volumeWithCompactionM3).toBeCloseTo(1.15, 6);
    expect(result.massTonnes).toBeCloseTo(1.84, 6);
  });

  it('needs more mass for a denser material at the same volume', () => {
    const lighter = calculateGrantsSmiltsSkembuApjoms({
      areaM2: 10,
      depthMm: 100,
      compactionPercent: 0,
      densityTPerM3: 1.4,
    });
    const heavier = calculateGrantsSmiltsSkembuApjoms({
      areaM2: 10,
      depthMm: 100,
      compactionPercent: 0,
      densityTPerM3: 1.6,
    });
    expect(heavier.massTonnes).toBeGreaterThan(lighter.massTonnes);
    expect(heavier.volumeM3).toBeCloseTo(lighter.volumeM3, 6);
  });

  it('returns 0 volume and mass for 0 area or depth', () => {
    const result = calculateGrantsSmiltsSkembuApjoms({
      areaM2: 0,
      depthMm: 100,
      compactionPercent: 15,
      densityTPerM3: 1.6,
    });
    expect(result.volumeM3).toBe(0);
    expect(result.massTonnes).toBe(0);
  });
});
