import { describe, expect, it } from 'vitest';
import { calculateSlimibasNauda } from './slimibas-nauda';

describe('calculateSlimibasNauda', () => {
  it('pays nothing for day 1', () => {
    const result = calculateSlimibasNauda({ averageDailyEarningsEur: 50, sickDays: 1 });

    expect(result.totalSickPayEur).toBe(0);
  });

  it('pays 75% for days 2-3', () => {
    const result = calculateSlimibasNauda({ averageDailyEarningsEur: 50, sickDays: 3 });

    expect(result.totalSickPayEur).toBeCloseTo(50 * 0.75 * 2, 5);
  });

  it('pays 75% for days 2-3 and 80% for days 4-9', () => {
    const result = calculateSlimibasNauda({ averageDailyEarningsEur: 50, sickDays: 9 });

    const expected = 50 * 0.75 * 2 + 50 * 0.8 * 6;
    expect(result.totalSickPayEur).toBeCloseTo(expected, 5);
    expect(result.employerPaidDays).toBe(9);
  });

  it('caps employer-paid days at 9 and flags state benefit start', () => {
    const result = calculateSlimibasNauda({ averageDailyEarningsEur: 50, sickDays: 14 });

    const expected = 50 * 0.75 * 2 + 50 * 0.8 * 6;
    expect(result.totalSickPayEur).toBeCloseTo(expected, 5);
    expect(result.employerPaidDays).toBe(9);
    expect(result.stateBenefitDaysFrom).toBe(10);
  });

  it('returns null stateBenefitDaysFrom when illness does not exceed employer obligation', () => {
    const result = calculateSlimibasNauda({ averageDailyEarningsEur: 50, sickDays: 5 });

    expect(result.stateBenefitDaysFrom).toBeNull();
  });

  it('guards against negative inputs without crashing', () => {
    const result = calculateSlimibasNauda({ averageDailyEarningsEur: -10, sickDays: -3 });

    expect(result.totalSickPayEur).toBe(0);
  });
});
