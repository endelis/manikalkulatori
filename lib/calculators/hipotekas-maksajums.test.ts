import { describe, expect, it } from 'vitest';
import { calculateHipotekasMaksajums } from './hipotekas-maksajums';

describe('calculateHipotekasMaksajums', () => {
  it('computes monthly payment for a standard mortgage', () => {
    const result = calculateHipotekasMaksajums({
      principalEur: 100000,
      annualRatePercent: 4.5,
      termYears: 25,
    });

    const monthlyRate = 0.045 / 12;
    const growth = Math.pow(1 + monthlyRate, 300);
    const expectedPayment = (100000 * monthlyRate * growth) / (growth - 1);

    expect(result.monthlyPaymentEur).toBeCloseTo(expectedPayment, 5);
    expect(result.totalCostEur).toBeCloseTo(expectedPayment * 300, 5);
  });

  it('computes a simple equal split when the rate is zero', () => {
    const result = calculateHipotekasMaksajums({
      principalEur: 12000,
      annualRatePercent: 0,
      termYears: 1,
    });

    expect(result.monthlyPaymentEur).toBe(1000);
    expect(result.totalInterestEur).toBe(0);
  });

  it('guards against a zero term without crashing', () => {
    const result = calculateHipotekasMaksajums({
      principalEur: 100000,
      annualRatePercent: 4,
      termYears: 0,
    });

    expect(result.monthlyPaymentEur).toBe(0);
  });

  it('guards against a negative principal without crashing', () => {
    const result = calculateHipotekasMaksajums({
      principalEur: -1000,
      annualRatePercent: 4,
      termYears: 25,
    });

    expect(result.monthlyPaymentEur).toBe(0);
  });
});
