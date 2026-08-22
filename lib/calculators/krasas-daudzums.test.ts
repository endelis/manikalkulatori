import { describe, expect, it } from 'vitest';
import { calculateKrasasDaudzums } from './krasas-daudzums';

describe('calculateKrasasDaudzums', () => {
  it('computes liters needed for two coats', () => {
    const result = calculateKrasasDaudzums({ areaM2: 40, coveragePerLiterM2: 10, coats: 2 });

    expect(result.litersNeeded).toBeCloseTo(8, 2);
  });

  it('computes liters needed for a single coat', () => {
    const result = calculateKrasasDaudzums({ areaM2: 25, coveragePerLiterM2: 8, coats: 1 });

    expect(result.litersNeeded).toBeCloseTo(3.125, 3);
  });

  it('returns zero when area is zero', () => {
    const result = calculateKrasasDaudzums({ areaM2: 0, coveragePerLiterM2: 10, coats: 2 });

    expect(result.litersNeeded).toBe(0);
  });
});
