import { describe, expect, it } from 'vitest';
import { calculateRiepuProtektoraDzilums } from './riepu-protektora-dzilums';

describe('calculateRiepuProtektoraDzilums', () => {
  it('uses the 1.6 mm summer minimum outside the winter season', () => {
    const result = calculateRiepuProtektoraDzilums({ treadDepthMm: 2, isWinterSeason: false });

    expect(result.minDepthMm).toBe(1.6);
    expect(result.isCompliant).toBe(true);
  });

  it('uses the 4 mm winter minimum during the winter season', () => {
    const result = calculateRiepuProtektoraDzilums({ treadDepthMm: 5, isWinterSeason: true });

    expect(result.minDepthMm).toBe(4);
    expect(result.isCompliant).toBe(true);
  });

  it('flags non-compliance when tread depth is below the summer minimum', () => {
    const result = calculateRiepuProtektoraDzilums({ treadDepthMm: 1.2, isWinterSeason: false });

    expect(result.isCompliant).toBe(false);
    expect(result.shortfallMm).toBeCloseTo(0.4, 10);
  });

  it('flags non-compliance when tread depth is below the winter minimum', () => {
    const result = calculateRiepuProtektoraDzilums({ treadDepthMm: 3, isWinterSeason: true });

    expect(result.isCompliant).toBe(false);
    expect(result.shortfallMm).toBe(1);
  });

  it('is compliant with no shortfall exactly at the boundary', () => {
    const result = calculateRiepuProtektoraDzilums({ treadDepthMm: 1.6, isWinterSeason: false });

    expect(result.isCompliant).toBe(true);
    expect(result.shortfallMm).toBe(0);
  });

  it('guards against negative input without crashing', () => {
    const result = calculateRiepuProtektoraDzilums({ treadDepthMm: -1, isWinterSeason: true });

    expect(result.isCompliant).toBe(false);
    expect(result.shortfallMm).toBe(4);
  });
});
