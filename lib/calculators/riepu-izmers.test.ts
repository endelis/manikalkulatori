import { describe, expect, it } from 'vitest';
import { calculateRiepuIzmers } from './riepu-izmers';

describe('calculateRiepuIzmers', () => {
  it('computes diameters and speedometer error for a larger new tire', () => {
    const result = calculateRiepuIzmers({
      originalWidthMm: 205,
      originalAspectRatio: 55,
      originalRimInches: 16,
      newWidthMm: 205,
      newAspectRatio: 60,
      newRimInches: 16,
      indicatedSpeedKmh: 100,
    });

    expect(result.originalDiameterMm).toBeCloseTo(631.9, 1);
    expect(result.newDiameterMm).toBeCloseTo(652.4, 1);
    expect(result.speedoErrorPercent).toBeCloseTo(3.24, 2);
    expect(result.actualSpeedKmh).toBeCloseTo(103.24, 2);
  });

  it('has no speedo error when tire sizes are identical', () => {
    const result = calculateRiepuIzmers({
      originalWidthMm: 205,
      originalAspectRatio: 55,
      originalRimInches: 16,
      newWidthMm: 205,
      newAspectRatio: 55,
      newRimInches: 16,
      indicatedSpeedKmh: 100,
    });

    expect(result.speedoErrorPercent).toBeCloseTo(0, 2);
    expect(result.actualSpeedKmh).toBeCloseTo(100, 2);
  });
});
