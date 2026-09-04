import { describe, expect, it } from 'vitest';
import { calculateFlizuDaudzums } from './flizu-daudzums';

describe('calculateFlizuDaudzums', () => {
  it('computes tile count with waste and rounds up', () => {
    const result = calculateFlizuDaudzums({ areaM2: 20, tileWidthM: 0.3, tileHeightM: 0.3, wastePercent: 10 });

    expect(result.tilesNeededRaw).toBeCloseTo(222.2222, 2);
    expect(result.tilesWithWaste).toBeCloseTo(244.4444, 2);
    expect(result.tilesToBuy).toBe(245);
  });

  it('computes tile count with no waste', () => {
    const result = calculateFlizuDaudzums({ areaM2: 10, tileWidthM: 0.6, tileHeightM: 0.6, wastePercent: 0 });

    expect(result.tilesNeededRaw).toBeCloseTo(27.7778, 2);
    expect(result.tilesToBuy).toBe(28);
  });

  it('computes tile count for small tiles with higher waste', () => {
    const result = calculateFlizuDaudzums({ areaM2: 5, tileWidthM: 0.25, tileHeightM: 0.25, wastePercent: 15 });

    expect(result.tilesNeededRaw).toBeCloseTo(80, 2);
    expect(result.tilesWithWaste).toBeCloseTo(92, 2);
    expect(result.tilesToBuy).toBe(92);
  });
});
