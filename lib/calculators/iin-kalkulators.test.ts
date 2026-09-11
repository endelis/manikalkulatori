import { describe, expect, it } from 'vitest';
import { calculateIinKalkulators } from './iin-kalkulators';

describe('calculateIinKalkulators', () => {
  it('applies the 25.5% flat rate to capital income', () => {
    const result = calculateIinKalkulators({ capitalIncomeEur: 1000 });

    expect(result.taxEur).toBeCloseTo(255, 5);
    expect(result.netEur).toBeCloseTo(745, 5);
  });

  it('handles zero income', () => {
    const result = calculateIinKalkulators({ capitalIncomeEur: 0 });

    expect(result.taxEur).toBe(0);
    expect(result.netEur).toBe(0);
  });

  it('guards against a negative income without crashing', () => {
    const result = calculateIinKalkulators({ capitalIncomeEur: -500 });

    expect(result.taxEur).toBe(0);
    expect(result.netEur).toBe(0);
  });
});
