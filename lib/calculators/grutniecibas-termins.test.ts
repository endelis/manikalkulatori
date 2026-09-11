import { describe, expect, it } from 'vitest';
import { calculateGrutniecibasTermins } from './grutniecibas-termins';

describe('calculateGrutniecibasTermins', () => {
  it('computes the due date as 280 days after the last menstrual period', () => {
    const result = calculateGrutniecibasTermins({
      lmpYear: 2026,
      lmpMonth: 1,
      lmpDay: 1,
      today: '2026-01-01',
    });

    expect(result.dueDate).toEqual({ year: 2026, month: 10, day: 8 });
  });

  it('computes gestational age from LMP to today', () => {
    const result = calculateGrutniecibasTermins({
      lmpYear: 2026,
      lmpMonth: 1,
      lmpDay: 1,
      today: '2026-02-12',
    });

    // Jan 1 to Feb 12 is 42 days = 6 weeks 0 days
    expect(result.gestationalWeeks).toBe(6);
    expect(result.gestationalDaysRemainder).toBe(0);
  });

  it('handles a leap year correctly', () => {
    const result = calculateGrutniecibasTermins({
      lmpYear: 2027,
      lmpMonth: 5,
      lmpDay: 20,
      today: '2027-05-20',
    });

    expect(result.dueDate).not.toBeNull();
  });

  it('returns null due date for an invalid calendar date', () => {
    const result = calculateGrutniecibasTermins({
      lmpYear: 2026,
      lmpMonth: 2,
      lmpDay: 30,
      today: '2026-03-01',
    });

    expect(result.dueDate).toBeNull();
  });

  it('does not go negative when today is before the LMP date', () => {
    const result = calculateGrutniecibasTermins({
      lmpYear: 2026,
      lmpMonth: 6,
      lmpDay: 1,
      today: '2026-01-01',
    });

    expect(result.gestationalWeeks).toBe(0);
    expect(result.gestationalDaysRemainder).toBe(0);
  });
});
