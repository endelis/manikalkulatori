import { describe, expect, it } from 'vitest';
import { calculateGriestuAugstums } from './griestu-augstums';

describe('calculateGriestuAugstums', () => {
  it('reports the minimum required height as 2.5 m', () => {
    const result = calculateGriestuAugstums({ ceilingHeightM: 2.5 });

    expect(result.minHeightM).toBe(2.5);
  });

  it('is compliant when the ceiling height meets the requirement exactly', () => {
    const result = calculateGriestuAugstums({ ceilingHeightM: 2.5 });

    expect(result.isCompliant).toBe(true);
    expect(result.shortfallM).toBe(0);
  });

  it('is not compliant and reports a shortfall when the ceiling is too low', () => {
    const result = calculateGriestuAugstums({ ceilingHeightM: 2.3 });

    expect(result.isCompliant).toBe(false);
    expect(result.shortfallM).toBeCloseTo(0.2, 10);
  });

  it('is compliant with no shortfall when the ceiling exceeds the requirement', () => {
    const result = calculateGriestuAugstums({ ceilingHeightM: 2.8 });

    expect(result.isCompliant).toBe(true);
    expect(result.shortfallM).toBe(0);
  });

  it('guards against negative input without crashing', () => {
    const result = calculateGriestuAugstums({ ceilingHeightM: -1 });

    expect(result.isCompliant).toBe(false);
    expect(result.shortfallM).toBeCloseTo(2.5, 10);
  });
});
