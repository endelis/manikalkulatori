import { describe, expect, it } from 'vitest';
import { calculateHipotekasParmaksa } from './hipotekas-parmaksa';

describe('calculateHipotekasParmaksa', () => {
  it('returns zero savings when there is no extra payment', () => {
    const result = calculateHipotekasParmaksa({
      principalEur: 100000,
      annualRatePercent: 4.5,
      termYears: 25,
      extraMonthlyPaymentEur: 0,
    });

    expect(result.interestSavedEur).toBeCloseTo(0, 2);
    expect(result.monthsSaved).toBeCloseTo(0, 2);
  });

  it('reduces payoff time and interest with an extra payment', () => {
    const result = calculateHipotekasParmaksa({
      principalEur: 100000,
      annualRatePercent: 4.5,
      termYears: 25,
      extraMonthlyPaymentEur: 200,
    });

    expect(result.newPayoffMonths).toBeLessThan(300);
    expect(result.interestSavedEur).toBeGreaterThan(0);
    expect(result.monthsSaved).toBeGreaterThan(0);
  });

  it('handles a zero interest rate with a simple linear payoff', () => {
    const result = calculateHipotekasParmaksa({
      principalEur: 12000,
      annualRatePercent: 0,
      termYears: 2,
      extraMonthlyPaymentEur: 500,
    });

    expect(result.baseMonthlyPaymentEur).toBe(500);
    expect(result.newPayoffMonths).toBe(12);
  });

  it('guards against a zero term without crashing', () => {
    const result = calculateHipotekasParmaksa({
      principalEur: 100000,
      annualRatePercent: 4,
      termYears: 0,
      extraMonthlyPaymentEur: 100,
    });

    expect(result.baseMonthlyPaymentEur).toBe(0);
  });
});
