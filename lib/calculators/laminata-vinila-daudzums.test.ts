import { describe, expect, it } from 'vitest';
import { calculateLaminataVinilaDaudzums } from './laminata-vinila-daudzums';

describe('calculateLaminataVinilaDaudzums', () => {
  it('computes pack count from area, pack coverage and waste percent', () => {
    const result = calculateLaminataVinilaDaudzums({
      areaM2: 20,
      packCoverageM2: 1.99,
      wastePercent: 10,
    });
    // withWaste = 22 m2, packs = ceil(22/1.99) = 12
    expect(result.areaWithWasteM2).toBeCloseTo(22, 6);
    expect(result.packsNeeded).toBe(12);
  });

  it('needs fewer packs for a larger pack coverage, same area', () => {
    const smallPack = calculateLaminataVinilaDaudzums({
      areaM2: 20,
      packCoverageM2: 1.39,
      wastePercent: 0,
    });
    const largePack = calculateLaminataVinilaDaudzums({
      areaM2: 20,
      packCoverageM2: 2.54,
      wastePercent: 0,
    });
    expect(largePack.packsNeeded).toBeLessThan(smallPack.packsNeeded);
  });

  it('returns 0 packs instead of dividing by zero when pack coverage is 0', () => {
    const result = calculateLaminataVinilaDaudzums({
      areaM2: 20,
      packCoverageM2: 0,
      wastePercent: 0,
    });
    expect(result.packsNeeded).toBe(0);
  });
});
