import { describe, expect, it } from 'vitest';
import { calculatePensiju3Limena } from './pensiju-3-limena-kalkulators';

describe('calculatePensiju3Limena', () => {
  it('computes future value with compound growth on monthly contributions', () => {
    const result = calculatePensiju3Limena({
      monthlyContributionEur: 100,
      annualReturnPercent: 6,
      years: 10,
      annualGrossIncomeEur: 20000,
    });

    const monthlyRate = 0.06 / 12;
    const months = 120;
    const growth = Math.pow(1 + monthlyRate, months);
    const expectedFv = 100 * ((growth - 1) / monthlyRate);

    expect(result.futureValueEur).toBeCloseTo(expectedFv, 5);
    expect(result.totalContributedEur).toBe(100 * 120);
  });

  it('handles a zero return rate as simple contribution summing', () => {
    const result = calculatePensiju3Limena({
      monthlyContributionEur: 50,
      annualReturnPercent: 0,
      years: 2,
      annualGrossIncomeEur: 20000,
    });

    expect(result.futureValueEur).toBe(50 * 24);
    expect(result.totalGrowthEur).toBe(0);
  });

  it('caps the refund-eligible contribution at 10% of gross income when that is the binding limit', () => {
    // 200/month = 2400/year; 10% of 20000 income = 2000, which is below both the
    // contribution and the 4000 absolute cap, so 2000 is the binding limit.
    const result = calculatePensiju3Limena({
      monthlyContributionEur: 200,
      annualReturnPercent: 5,
      years: 1,
      annualGrossIncomeEur: 20000,
    });

    expect(result.annualEligibleForRefundEur).toBe(2000);
    expect(result.annualTaxRefundEur).toBeCloseTo(2000 * 0.255, 5);
  });

  it('caps the refund-eligible contribution at 4000 EUR when income is high enough that the absolute cap binds', () => {
    // 500/month = 6000/year; 10% of 100000 income = 10000, so the 4000 absolute cap binds.
    const result = calculatePensiju3Limena({
      monthlyContributionEur: 500,
      annualReturnPercent: 5,
      years: 1,
      annualGrossIncomeEur: 100000,
    });

    expect(result.annualEligibleForRefundEur).toBe(4000);
    expect(result.annualTaxRefundEur).toBeCloseTo(4000 * 0.255, 5);
  });

  it('caps the refund-eligible contribution at the actual contribution when that is smaller than both caps', () => {
    // 50/month = 600/year, well under both the income-based and absolute caps.
    const result = calculatePensiju3Limena({
      monthlyContributionEur: 50,
      annualReturnPercent: 5,
      years: 3,
      annualGrossIncomeEur: 100000,
    });

    expect(result.annualEligibleForRefundEur).toBe(600);
    expect(result.totalTaxRefundEur).toBeCloseTo(600 * 0.255 * 3, 5);
  });

  it('guards against negative inputs without crashing', () => {
    const result = calculatePensiju3Limena({
      monthlyContributionEur: -50,
      annualReturnPercent: 5,
      years: 5,
      annualGrossIncomeEur: -1000,
    });

    expect(result.futureValueEur).toBeGreaterThanOrEqual(0);
    expect(result.annualTaxRefundEur).toBeGreaterThanOrEqual(0);
  });
});
