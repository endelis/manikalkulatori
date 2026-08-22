import { describe, expect, it } from 'vitest';
import { calculateOcta } from './octa-kalkulators';

describe('calculateOcta', () => {
  it('finds the cheapest of three quotes', () => {
    const result = calculateOcta({ quote1: 85, quote2: 92, quote3: 78 });

    expect(result.cheapestAmount).toBe(78);
    expect(result.cheapestQuoteNumber).toBe(3);
    expect(result.mostExpensiveAmount).toBe(92);
    expect(result.savings).toBe(14);
  });

  it('picks the first quote on a tie', () => {
    const result = calculateOcta({ quote1: 100, quote2: 100, quote3: 100 });

    expect(result.cheapestAmount).toBe(100);
    expect(result.cheapestQuoteNumber).toBe(1);
    expect(result.savings).toBe(0);
  });

  it('finds the cheapest when the second quote is lowest', () => {
    const result = calculateOcta({ quote1: 90, quote2: 75, quote3: 95 });

    expect(result.cheapestAmount).toBe(75);
    expect(result.cheapestQuoteNumber).toBe(2);
    expect(result.mostExpensiveAmount).toBe(95);
    expect(result.savings).toBe(20);
  });
});
