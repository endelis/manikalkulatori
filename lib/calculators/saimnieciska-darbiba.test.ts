import { describe, expect, it } from 'vitest';
import { calculateSaimnieciskaDarbiba } from './saimnieciska-darbiba';

describe('calculateSaimnieciskaDarbiba', () => {
  it('applies only the 10% pension rate below minimum wage', () => {
    const result = calculateSaimnieciskaDarbiba({ monthlyTaxableIncomeEur: 500 });

    expect(result.vsaoiEur).toBeCloseTo(500 * 0.1, 5);
  });

  it('applies the tiered rate at exactly minimum wage', () => {
    const result = calculateSaimnieciskaDarbiba({ monthlyTaxableIncomeEur: 780 });

    expect(result.vsaoiEur).toBeCloseTo(780 * 0.3107, 5);
  });

  it('applies 31.07% up to minimum wage and 10% above it', () => {
    const result = calculateSaimnieciskaDarbiba({ monthlyTaxableIncomeEur: 1780 });

    const expectedVsaoi = 780 * 0.3107 + 1000 * 0.1;
    expect(result.vsaoiEur).toBeCloseTo(expectedVsaoi, 5);
  });

  it('computes net as income minus VSAOI minus IIN', () => {
    const result = calculateSaimnieciskaDarbiba({ monthlyTaxableIncomeEur: 1500 });

    expect(result.netMonthlyEur).toBeCloseTo(1500 - result.vsaoiEur - result.iinEur, 5);
  });

  it('guards against a negative income without crashing', () => {
    const result = calculateSaimnieciskaDarbiba({ monthlyTaxableIncomeEur: -200 });

    expect(result.netMonthlyEur).toBe(0);
  });
});
