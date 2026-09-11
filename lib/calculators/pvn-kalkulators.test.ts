import { describe, expect, it } from 'vitest';
import { calculatePvnKalkulators } from './pvn-kalkulators';

describe('calculatePvnKalkulators', () => {
  it('adds VAT to a net amount', () => {
    const result = calculatePvnKalkulators({ amountEur: 100, vatRatePercent: 21, mode: 'add' });

    expect(result.netAmountEur).toBe(100);
    expect(result.vatAmountEur).toBeCloseTo(21, 5);
    expect(result.grossAmountEur).toBeCloseTo(121, 5);
  });

  it('extracts VAT from a gross amount', () => {
    const result = calculatePvnKalkulators({ amountEur: 121, vatRatePercent: 21, mode: 'extract' });

    expect(result.grossAmountEur).toBe(121);
    expect(result.netAmountEur).toBeCloseTo(100, 5);
    expect(result.vatAmountEur).toBeCloseTo(21, 5);
  });

  it('handles a zero rate without dividing by zero', () => {
    const result = calculatePvnKalkulators({ amountEur: 100, vatRatePercent: 0, mode: 'extract' });

    expect(result.netAmountEur).toBe(100);
    expect(result.vatAmountEur).toBe(0);
  });

  it('guards against a negative amount without crashing', () => {
    const result = calculatePvnKalkulators({ amountEur: -50, vatRatePercent: 21, mode: 'add' });

    expect(result.netAmountEur).toBe(0);
    expect(result.vatAmountEur).toBe(0);
  });
});
