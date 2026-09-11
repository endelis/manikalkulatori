import { describe, expect, it } from 'vitest';
import { computeTumsas, daylightHours, type TumsasInput } from './tumsas-kalkulators';

// Round, hand verifiable fixture values, not the real ~5.575h amplitude, so each
// test's expected value can be checked by hand rather than trusting the production
// constants. 2026-04-10 is day of year 100 in a non leap year (31+28+31+10).
const base = {
  averageDaylightHours: 12,
  amplitudeHours: 6,
  summerSolsticeDayOfYear: 100,
};

describe('daylightHours', () => {
  it('peaks at D_vid + A on the summer solstice day (cos(0) = 1)', () => {
    expect(daylightHours(100, base)).toBeCloseTo(18, 10);
  });

  it('bottoms out at D_vid - A half a year after the solstice (cos(pi) = -1)', () => {
    // 100 + 365.25 / 2 = 282.625
    expect(daylightHours(282.625, base)).toBeCloseTo(6, 6);
  });

  it('returns D_vid a quarter year off the solstice (cos(pi/2) = 0)', () => {
    expect(daylightHours(100 + 365.25 / 4, base)).toBeCloseTo(12, 6);
  });
});

describe('computeTumsas, single day', () => {
  it('computes darkness for exactly one lived day (birth date equals today)', () => {
    const input: TumsasInput = { ...base, birthDate: '2026-04-10', today: '2026-04-10' };
    const result = computeTumsas(input);
    expect(result.totalDaysLived).toBe(1);
    // Day 100 is the solstice in this fixture: light = 18, dark = 6, as a fraction of
    // a day that is 6 / 24 = 0.25.
    expect(result.totalDarkDays).toBeCloseTo(0.25, 10);
    expect(result.percentDark).toBeCloseTo(25, 8);
  });
});

describe('computeTumsas, multi day sum', () => {
  it('sums each day\'s darkness independently, matching daylightHours called per day', () => {
    const input: TumsasInput = { ...base, birthDate: '2026-04-10', today: '2026-04-11' };
    const result = computeTumsas(input);
    const expectedDarkHours = 24 - daylightHours(100, base) + (24 - daylightHours(101, base));
    expect(result.totalDaysLived).toBe(2);
    expect(result.totalDarkDays).toBeCloseTo(expectedDarkHours / 24, 10);
  });

  it('resets day of year correctly across a calendar year boundary', () => {
    // 2025-12-31 is day 365 of 2025 (not a leap year), 2026-01-01 is day 1 of 2026.
    const input: TumsasInput = { ...base, birthDate: '2025-12-31', today: '2026-01-01' };
    const result = computeTumsas(input);
    const expectedDarkHours = 24 - daylightHours(365, base) + (24 - daylightHours(1, base));
    expect(result.totalDaysLived).toBe(2);
    expect(result.totalDarkDays).toBeCloseTo(expectedDarkHours / 24, 10);
  });
});

describe('computeTumsas, derived fields', () => {
  it('converts totalDarkDays into whole dark years and remainder months', () => {
    // Force a birth-to-today span long enough to produce a clean multi year result by
    // using a flat, amplitude free fixture (amplitude 0 means every day is D_vid).
    const flat = { averageDaylightHours: 12, amplitudeHours: 0, summerSolsticeDayOfYear: 100 };
    const input: TumsasInput = { ...flat, birthDate: '2020-01-01', today: '2026-01-01' };
    const result = computeTumsas(input);
    // Every day is exactly half dark (12 of 24 hours), so totalDarkDays is exactly half
    // of totalDaysLived, and percentDark is exactly 50.
    expect(result.percentDark).toBeCloseTo(50, 8);
    expect(result.totalDarkDays).toBeCloseTo(result.totalDaysLived / 2, 6);
    expect(result.darkYears).toBeGreaterThan(0);
    expect(result.darkMonths).toBeGreaterThanOrEqual(0);
    expect(result.darkMonths).toBeLessThan(12);
  });
});

describe('computeTumsas, invalid input', () => {
  it('throws a clear error when today is before the birth date', () => {
    const input: TumsasInput = { ...base, birthDate: '2026-04-11', today: '2026-04-10' };
    expect(() => computeTumsas(input)).toThrow(/nedrīkst būt vēlāks/);
  });
});
