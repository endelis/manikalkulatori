import { describe, expect, it } from 'vitest';
import { calculateIeguldijumuKonta } from './ieguldijumu-konta-nodoklu-kalkulators';

describe('calculateIeguldijumuKonta', () => {
  it('computes the same pre-tax future value as standard compound growth', () => {
    const result = calculateIeguldijumuKonta({
      initialAmountEur: 1000,
      monthlyContributionEur: 100,
      annualReturnPercent: 6,
      years: 10,
    });

    const monthlyRate = 0.06 / 12;
    const months = 120;
    const growth = Math.pow(1 + monthlyRate, months);
    const expectedFv = 1000 * growth + 100 * ((growth - 1) / monthlyRate);

    expect(result.futureValueEur).toBeCloseTo(expectedFv, 5);
    expect(result.totalContributedEur).toBe(1000 + 100 * 120);
  });

  it('taxes the investment account only once, on total growth, at 25.5%', () => {
    const result = calculateIeguldijumuKonta({
      initialAmountEur: 1000,
      monthlyContributionEur: 100,
      annualReturnPercent: 6,
      years: 10,
    });

    const expectedTax = (result.futureValueEur - result.totalContributedEur) * 0.255;
    expect(result.investmentAccountTaxEur).toBeCloseTo(expectedTax, 5);
    expect(result.investmentAccountNetEur).toBeCloseTo(result.futureValueEur - expectedTax, 5);
  });

  it('the investment account nets more than the annually-taxed regular account when there is real growth', () => {
    const result = calculateIeguldijumuKonta({
      initialAmountEur: 1000,
      monthlyContributionEur: 100,
      annualReturnPercent: 6,
      years: 10,
    });

    expect(result.investmentAccountNetEur).toBeGreaterThan(result.regularAccountNetEur);
    expect(result.taxDeferralBenefitEur).toBeGreaterThan(0);
  });

  it('produces no tax and no deferral benefit at zero return', () => {
    const result = calculateIeguldijumuKonta({
      initialAmountEur: 500,
      monthlyContributionEur: 50,
      annualReturnPercent: 0,
      years: 5,
    });

    expect(result.investmentAccountTaxEur).toBe(0);
    expect(result.taxDeferralBenefitEur).toBeCloseTo(0, 5);
    expect(result.regularAccountNetEur).toBeCloseTo(result.totalContributedEur, 5);
  });

  it('returns the initial amount unchanged for zero years', () => {
    const result = calculateIeguldijumuKonta({
      initialAmountEur: 1000,
      monthlyContributionEur: 100,
      annualReturnPercent: 6,
      years: 0,
    });

    expect(result.futureValueEur).toBe(1000);
    expect(result.regularAccountNetEur).toBe(1000);
  });

  it('guards against negative inputs without crashing', () => {
    const result = calculateIeguldijumuKonta({
      initialAmountEur: -100,
      monthlyContributionEur: -50,
      annualReturnPercent: 6,
      years: 5,
    });

    expect(result.futureValueEur).toBeGreaterThanOrEqual(0);
    expect(result.regularAccountNetEur).toBeGreaterThanOrEqual(0);
  });
});
