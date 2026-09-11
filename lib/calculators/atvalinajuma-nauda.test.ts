import { describe, expect, it } from 'vitest';
import { calculateAtvalinajumaNauda } from './atvalinajuma-nauda';

describe('calculateAtvalinajumaNauda', () => {
  it('multiplies average daily earnings by vacation days', () => {
    const result = calculateAtvalinajumaNauda({
      averageDailyEarningsEur: 45.5,
      vacationDays: 20,
    });

    expect(result.totalVacationPayEur).toBeCloseTo(910, 5);
  });

  it('handles the standard 28-calendar-day minimum leave', () => {
    const result = calculateAtvalinajumaNauda({
      averageDailyEarningsEur: 30,
      vacationDays: 28,
    });

    expect(result.totalVacationPayEur).toBe(840);
  });

  it('guards against negative inputs without crashing', () => {
    const result = calculateAtvalinajumaNauda({
      averageDailyEarningsEur: -10,
      vacationDays: -5,
    });

    expect(result.totalVacationPayEur).toBe(0);
  });
});
