import { describe, expect, it } from 'vitest';
import { calculateKreditaKalkulators } from './kredita-kalkulators';

describe('calculateKreditaKalkulators', () => {
  it('computes monthly payment for a standard consumer loan', () => {
    const result = calculateKreditaKalkulators({
      principalEur: 5000,
      annualRatePercent: 12,
      termMonths: 36,
    });

    const monthlyRate = 0.12 / 12;
    const growth = Math.pow(1 + monthlyRate, 36);
    const expectedPayment = (5000 * monthlyRate * growth) / (growth - 1);

    expect(result.monthlyPaymentEur).toBeCloseTo(expectedPayment, 5);
    expect(result.totalCostEur).toBeCloseTo(expectedPayment * 36, 5);
    expect(result.totalInterestEur).toBeCloseTo(expectedPayment * 36 - 5000, 5);
  });

  it('computes a simple equal split when the rate is zero', () => {
    const result = calculateKreditaKalkulators({
      principalEur: 1200,
      annualRatePercent: 0,
      termMonths: 12,
    });

    expect(result.monthlyPaymentEur).toBe(100);
    expect(result.totalCostEur).toBe(1200);
    expect(result.totalInterestEur).toBe(0);
  });

  it('guards against a zero term without crashing', () => {
    const result = calculateKreditaKalkulators({
      principalEur: 5000,
      annualRatePercent: 10,
      termMonths: 0,
    });

    expect(result.monthlyPaymentEur).toBe(0);
    expect(result.totalCostEur).toBe(0);
    expect(result.totalInterestEur).toBe(0);
  });

  it('guards against a negative principal without crashing', () => {
    const result = calculateKreditaKalkulators({
      principalEur: -500,
      annualRatePercent: 10,
      termMonths: 12,
    });

    expect(result.monthlyPaymentEur).toBe(0);
  });
});
