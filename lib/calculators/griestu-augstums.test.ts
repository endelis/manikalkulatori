import { describe, expect, it } from 'vitest';
import { calculateGriestuAugstums } from './griestu-augstums';

describe('calculateGriestuAugstums', () => {
  it('reports 2.5 m for a residential room', () => {
    const result = calculateGriestuAugstums({ ceilingHeightM: 2.5, roomType: 'dzivojama-telpa' });

    expect(result.minHeightM).toBe(2.5);
  });

  it('reports 2.7 m for a public room', () => {
    const result = calculateGriestuAugstums({ ceilingHeightM: 2.7, roomType: 'publiska-telpa' });

    expect(result.minHeightM).toBe(2.7);
  });

  it('reports 2.2 m for a corridor or sanitary room', () => {
    const result = calculateGriestuAugstums({ ceilingHeightM: 2.2, roomType: 'gaitenis-sanitara-telpa' });

    expect(result.minHeightM).toBe(2.2);
  });

  it('reports 1.8 m for a technical room', () => {
    const result = calculateGriestuAugstums({ ceilingHeightM: 1.8, roomType: 'tehniska-telpa' });

    expect(result.minHeightM).toBe(1.8);
  });

  it('is compliant when the ceiling height meets the requirement exactly', () => {
    const result = calculateGriestuAugstums({ ceilingHeightM: 2.5, roomType: 'dzivojama-telpa' });

    expect(result.isCompliant).toBe(true);
    expect(result.shortfallM).toBe(0);
  });

  it('is not compliant and reports a shortfall when the ceiling is too low', () => {
    const result = calculateGriestuAugstums({ ceilingHeightM: 2.3, roomType: 'dzivojama-telpa' });

    expect(result.isCompliant).toBe(false);
    expect(result.shortfallM).toBeCloseTo(0.2, 10);
  });

  it('is compliant with no shortfall when the ceiling exceeds the requirement', () => {
    const result = calculateGriestuAugstums({ ceilingHeightM: 2.8, roomType: 'dzivojama-telpa' });

    expect(result.isCompliant).toBe(true);
    expect(result.shortfallM).toBe(0);
  });

  it('guards against negative input without crashing', () => {
    const result = calculateGriestuAugstums({ ceilingHeightM: -1, roomType: 'dzivojama-telpa' });

    expect(result.isCompliant).toBe(false);
    expect(result.shortfallM).toBeCloseTo(2.5, 10);
  });
});
