import { describe, expect, it } from 'vitest';
import { calculateAlgaNeto } from './alga-neto';

describe('calculateAlgaNeto', () => {
  it('computes VSAOI at 10.5% of gross', () => {
    const result = calculateAlgaNeto({ grossMonthlyEur: 1000, applyNonTaxableMinimum: false });

    expect(result.vsaoiEur).toBeCloseTo(105, 5);
  });

  it('applies the full non-taxable minimum at low income', () => {
    const result = calculateAlgaNeto({ grossMonthlyEur: 500, applyNonTaxableMinimum: true });

    expect(result.nonTaxableMinimumEur).toBe(550);
  });

  it('phases the non-taxable minimum to zero at 1800 gross', () => {
    const result = calculateAlgaNeto({ grossMonthlyEur: 1800, applyNonTaxableMinimum: true });

    expect(result.nonTaxableMinimumEur).toBeCloseTo(0, 5);
  });

  it('phases the non-taxable minimum linearly at the midpoint', () => {
    const result = calculateAlgaNeto({ grossMonthlyEur: 1150, applyNonTaxableMinimum: true });

    // Midpoint of 500-1800 range -> half of 550
    expect(result.nonTaxableMinimumEur).toBeCloseTo(275, 1);
  });

  it('applies the lower 25.5% IIN rate below the monthly threshold', () => {
    const result = calculateAlgaNeto({ grossMonthlyEur: 1000, applyNonTaxableMinimum: false });

    const taxableBase = 1000 - 105;
    expect(result.iinEur).toBeCloseTo(taxableBase * 0.255, 5);
  });

  it('applies the higher 33% IIN rate above the monthly threshold', () => {
    const result = calculateAlgaNeto({ grossMonthlyEur: 10000, applyNonTaxableMinimum: false });

    const vsaoi = 10000 * 0.105;
    const taxableBase = 10000 - vsaoi;
    const expectedIin = 8775 * 0.255 + (taxableBase - 8775) * 0.33;
    expect(result.iinEur).toBeCloseTo(expectedIin, 5);
  });

  it('applies the top 36% IIN rate above the 200 000 EUR/year equivalent monthly threshold', () => {
    const result = calculateAlgaNeto({ grossMonthlyEur: 20000, applyNonTaxableMinimum: false });

    const vsaoi = 20000 * 0.105;
    const taxableBase = 20000 - vsaoi;
    const topThreshold = 200_000 / 12;
    const expectedIin = 8775 * 0.255 + (topThreshold - 8775) * 0.33 + (taxableBase - topThreshold) * 0.36;
    expect(result.iinEur).toBeCloseTo(expectedIin, 5);
  });

  it('computes net as gross minus VSAOI minus IIN', () => {
    const result = calculateAlgaNeto({ grossMonthlyEur: 1000, applyNonTaxableMinimum: true });

    expect(result.netMonthlyEur).toBeCloseTo(1000 - result.vsaoiEur - result.iinEur, 5);
  });

  it('guards against a negative gross without crashing', () => {
    const result = calculateAlgaNeto({ grossMonthlyEur: -500, applyNonTaxableMinimum: true });

    expect(result.netMonthlyEur).toBe(0);
  });
});
