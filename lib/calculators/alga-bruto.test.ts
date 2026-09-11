import { describe, expect, it } from 'vitest';
import { calculateAlgaBruto } from './alga-bruto';
import { calculateAlgaNeto } from './alga-neto';

describe('calculateAlgaBruto', () => {
  it('finds a gross that round-trips to the target net (with non-taxable minimum)', () => {
    const target = 1000;
    const result = calculateAlgaBruto({ targetNetMonthlyEur: target, applyNonTaxableMinimum: true });

    const { netMonthlyEur } = calculateAlgaNeto({
      grossMonthlyEur: result.grossMonthlyEur,
      applyNonTaxableMinimum: true,
    });

    expect(netMonthlyEur).toBeCloseTo(target, 1);
  });

  it('finds a gross that round-trips to the target net (without non-taxable minimum)', () => {
    const target = 5000;
    const result = calculateAlgaBruto({
      targetNetMonthlyEur: target,
      applyNonTaxableMinimum: false,
    });

    const { netMonthlyEur } = calculateAlgaNeto({
      grossMonthlyEur: result.grossMonthlyEur,
      applyNonTaxableMinimum: false,
    });

    expect(netMonthlyEur).toBeCloseTo(target, 1);
  });

  it('round-trips correctly in the higher 33% IIN bracket', () => {
    const target = 8000;
    const result = calculateAlgaBruto({ targetNetMonthlyEur: target, applyNonTaxableMinimum: false });

    const { netMonthlyEur } = calculateAlgaNeto({
      grossMonthlyEur: result.grossMonthlyEur,
      applyNonTaxableMinimum: false,
    });

    expect(netMonthlyEur).toBeCloseTo(target, 1);
  });

  it('returns zero for a zero target net', () => {
    const result = calculateAlgaBruto({ targetNetMonthlyEur: 0, applyNonTaxableMinimum: true });

    expect(result.grossMonthlyEur).toBe(0);
  });

  it('guards against a negative target without crashing', () => {
    const result = calculateAlgaBruto({ targetNetMonthlyEur: -500, applyNonTaxableMinimum: true });

    expect(result.grossMonthlyEur).toBe(0);
  });
});
