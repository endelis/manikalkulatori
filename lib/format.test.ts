import { describe, expect, it } from 'vitest';
import { formatCurrencyEUR, formatNumber, formatPercent } from './format';

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

describe('formatPercent', () => {
  it('formats a percentage value with one decimal by default', () => {
    expect(formatPercent(42.5)).toMatch(/42,5\s?%/);
  });

  it('formats with a custom decimal count', () => {
    expect(formatPercent(7, 0)).toMatch(/7\s?%/);
  });
});
