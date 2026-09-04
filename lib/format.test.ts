import { describe, expect, it } from 'vitest';
import { formatCurrencyEUR, formatNumber, formatPercent, formatSignedNumber, pluralizeKalkulatori } from './format';

describe('formatCurrencyEUR', () => {
  it('formats a whole euro amount with the euro sign', () => {
    const result = formatCurrencyEUR(1234);
    expect(result).toContain('€');
    expect(result).toMatch(/1[\s ]234,00/);
  });

  it('formats a fractional amount with two decimals by default', () => {
    expect(formatCurrencyEUR(9.5)).toMatch(/9,50/);
  });

  it('respects a custom maximumFractionDigits', () => {
    const result = formatCurrencyEUR(9.567, { maximumFractionDigits: 0 });
    expect(result).toContain('10');
    expect(result).not.toMatch(/,\d/);
  });
});

describe('formatNumber', () => {
  it('formats an integer with thousands separators and no decimals by default', () => {
    expect(formatNumber(12345)).toMatch(/12[\s ]345/);
  });

  it('formats with the requested number of decimals', () => {
    expect(formatNumber(12.3, 2)).toMatch(/12,30/);
  });
});

describe('pluralizeKalkulatori', () => {
  it('uses the nominative singular for counts ending in 1', () => {
    expect(pluralizeKalkulatori(1)).toBe('1 kalkulators');
    expect(pluralizeKalkulatori(21)).toBe('21 kalkulators');
  });

  it('uses the nominative plural for 11 and other plural counts', () => {
    expect(pluralizeKalkulatori(11)).toBe('11 kalkulatori');
    expect(pluralizeKalkulatori(5)).toBe('5 kalkulatori');
    expect(pluralizeKalkulatori(50)).toBe('50 kalkulatori');
  });

  it('uses the genitive plural for zero', () => {
    expect(pluralizeKalkulatori(0)).toBe('0 kalkulatoru');
  });
});

describe('formatSignedNumber', () => {
  it('formats a non-negative value the same as formatNumber', () => {
    expect(formatSignedNumber(47)).toBe(formatNumber(47));
    expect(formatSignedNumber(0)).toBe(formatNumber(0));
  });

  it('prefixes a negative value with U+2212 MINUS SIGN, never U+002D HYPHEN-MINUS', () => {
    const result = formatSignedNumber(-47);
    expect(result[0]).toBe('−');
    expect(result).not.toContain('-');
    expect(result.slice(1)).toBe(formatNumber(47));
  });
});

describe('formatPercent', () => {
  it('formats a percentage value with one decimal by default', () => {
    expect(formatPercent(42.5)).toMatch(/42,5\s?%/);
  });

  it('formats with a custom decimal count', () => {
    expect(formatPercent(7, 0)).toMatch(/7\s?%/);
  });
});
