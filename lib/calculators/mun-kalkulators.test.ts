import { describe, expect, it } from 'vitest';
import { calculateMunKalkulators } from './mun-kalkulators';

describe('calculateMunKalkulators', () => {
  it('applies the 25% flat rate to turnover', () => {
    const result = calculateMunKalkulators({ turnoverEur: 10000 });

    expect(result.taxEur).toBe(2500);
    expect(result.netEur).toBe(7500);
  });

  it('handles zero turnover', () => {
    const result = calculateMunKalkulators({ turnoverEur: 0 });

    expect(result.taxEur).toBe(0);
    expect(result.netEur).toBe(0);
  });

  it('guards against a negative turnover without crashing', () => {
    const result = calculateMunKalkulators({ turnoverEur: -500 });

    expect(result.taxEur).toBe(0);
    expect(result.netEur).toBe(0);
  });
});
