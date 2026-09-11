import { describe, expect, it } from 'vitest';
import { calculateUdensNorma } from './udens-norma';

describe('calculateUdensNorma', () => {
  it('computes daily water intake for a 75kg person', () => {
    const result = calculateUdensNorma({ weightKg: 75 });

    expect(result.waterLiters).toBeCloseTo((75 * 33) / 1000, 5);
  });

  it('computes daily water intake for a 60kg person', () => {
    const result = calculateUdensNorma({ weightKg: 60 });

    expect(result.waterLiters).toBeCloseTo((60 * 33) / 1000, 5);
  });

  it('guards against a negative weight without crashing', () => {
    const result = calculateUdensNorma({ weightKg: -5 });

    expect(result.waterLiters).toBe(0);
  });
});
