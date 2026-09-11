import { describe, expect, it } from 'vitest';
import { calculateIpasumaNodoklis } from './ipasuma-nodoklis';

describe('calculateIpasumaNodoklis', () => {
  it('computes annual tax from cadastral value and rate', () => {
    const result = calculateIpasumaNodoklis({ cadastralValueEur: 50000, ratePercent: 1.5 });

    expect(result.annualTaxEur).toBeCloseTo(750, 5);
    expect(result.quarterlyTaxEur).toBeCloseTo(187.5, 5);
  });

  it('handles a zero rate', () => {
    const result = calculateIpasumaNodoklis({ cadastralValueEur: 50000, ratePercent: 0 });

    expect(result.annualTaxEur).toBe(0);
  });

  it('guards against negative inputs without crashing', () => {
    const result = calculateIpasumaNodoklis({ cadastralValueEur: -1000, ratePercent: -1 });

    expect(result.annualTaxEur).toBe(0);
  });
});
