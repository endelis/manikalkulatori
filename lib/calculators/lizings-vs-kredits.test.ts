import { describe, expect, it } from 'vitest';
import { calculateLizingsVsKredits } from './lizings-vs-kredits';

describe('calculateLizingsVsKredits', () => {
  it('compares loan and lease monthly and total costs', () => {
    const result = calculateLizingsVsKredits({
      vehiclePrice: 25000,
      downPayment: 2500,
      termMonths: 36,
      loanAnnualRatePercent: 6,
      leaseAnnualRatePercent: 4,
      residualValuePercent: 50,
    });

    expect(result.loanMonthlyPayment).toBeCloseTo(684.49, 1);
    expect(result.loanTotalCost).toBeCloseTo(27141.77, 1);
    expect(result.leaseMonthlyPayment).toBeCloseTo(336.11, 1);
    expect(result.leaseTotalCost).toBeCloseTo(14600, 1);
    expect(result.cheaperOption).toBe('lease');
    expect(['loan', 'lease', 'equal']).toContain(result.cheaperOption);
    expect(result.monthlySavings).toBeGreaterThanOrEqual(0);
  });

  it('handles a zero-rate loan without dividing by zero', () => {
    const result = calculateLizingsVsKredits({
      vehiclePrice: 10000,
      downPayment: 0,
      termMonths: 24,
      loanAnnualRatePercent: 0,
      leaseAnnualRatePercent: 0,
      residualValuePercent: 0,
    });

    expect(result.loanMonthlyPayment).toBeCloseTo(416.67, 1);
  });
});
