import { describe, expect, it } from 'vitest';
import { calculateOvulacija } from './ovulacija';

describe('calculateOvulacija', () => {
  it('computes ovulation day 14 for a standard 28-day cycle', () => {
    const result = calculateOvulacija({
      lmpYear: 2026,
      lmpMonth: 1,
      lmpDay: 1,
      cycleLengthDays: 28,
    });

    // Cycle day 14 (28 - 14 luteal) = Jan 1 + 13 days = Jan 14
    expect(result.ovulationDate).toEqual({ year: 2026, month: 1, day: 14 });
  });

  it('computes the fertile window as 5 days before to 1 day after ovulation', () => {
    const result = calculateOvulacija({
      lmpYear: 2026,
      lmpMonth: 1,
      lmpDay: 1,
      cycleLengthDays: 28,
    });

    expect(result.fertileWindowStart).toEqual({ year: 2026, month: 1, day: 9 });
    expect(result.fertileWindowEnd).toEqual({ year: 2026, month: 1, day: 15 });
  });

  it('shifts ovulation day for a longer cycle', () => {
    const result = calculateOvulacija({
      lmpYear: 2026,
      lmpMonth: 1,
      lmpDay: 1,
      cycleLengthDays: 32,
    });

    // Cycle day 18 (32 - 14) = Jan 1 + 17 days = Jan 18
    expect(result.ovulationDate).toEqual({ year: 2026, month: 1, day: 18 });
  });

  it('returns null for a cycle length at or below the luteal phase length', () => {
    const result = calculateOvulacija({
      lmpYear: 2026,
      lmpMonth: 1,
      lmpDay: 1,
      cycleLengthDays: 14,
    });

    expect(result.ovulationDate).toBeNull();
  });

  it('returns null for an invalid calendar date', () => {
    const result = calculateOvulacija({
      lmpYear: 2026,
      lmpMonth: 2,
      lmpDay: 30,
      cycleLengthDays: 28,
    });

    expect(result.ovulationDate).toBeNull();
  });
});
