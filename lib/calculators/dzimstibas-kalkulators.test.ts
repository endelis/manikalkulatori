import { describe, expect, it } from 'vitest';
import {
  cohortRatio,
  cohortSize,
  computeDzimstibas,
  naturalIncreaseRatePer1000,
  yearsToLoseFraction,
  type DzimstibasBaseInput,
  type PopulationYearRow,
} from './dzimstibas-kalkulators';

// Sourced defaults, 2025 actuals and 01.01.2026 population, see
// claude/demografijas-defaults-2026.md rows 1 to 7.
const base: DzimstibasBaseInput = {
  deaths: 26109,
  netMigration: -1291,
  population: 1845096,
  birthsCurrent: 11931,
  tfrCurrent: 1.16,
};

describe('computeDzimstibas mode A, nulles dabiskais pieaugums', () => {
  it('birthsNeeded equals deaths', () => {
    const result = computeDzimstibas({ ...base, mode: 'nulles-dabiskais' });
    expect(result.birthsNeeded).toBe(26109);
  });

  it('derives perMonth, perDay, multiplier, tfrNeeded, intervalMinutes without rounding', () => {
    const result = computeDzimstibas({ ...base, mode: 'nulles-dabiskais' });
    expect(result.perMonth).toBeCloseTo(26109 / 12, 10);
    expect(result.perDay).toBeCloseTo(26109 / 365.25, 10);
    expect(result.multiplier).toBeCloseTo(26109 / 11931, 10);
    expect(result.tfrNeeded).toBeCloseTo(1.16 * (26109 / 11931), 10);
    expect(result.intervalMinutes).toBeCloseTo((365.25 * 24 * 60) / 11931, 10);
    // Not integers: proves rounding is not happening in the calculation layer.
    expect(Number.isInteger(result.perMonth)).toBe(false);
    expect(Number.isInteger(result.intervalMinutes)).toBe(false);
  });
});

describe('computeDzimstibas mode B, nulles kopējās izmaiņas', () => {
  it('birthsNeeded equals deaths minus net migration', () => {
    const result = computeDzimstibas({ ...base, mode: 'nulles-kopejas' });
    expect(result.birthsNeeded).toBeCloseTo(26109 - -1291, 10);
  });

  it('handles net migration large enough that birthsNeeded is below birthsCurrent', () => {
    const result = computeDzimstibas({
      ...base,
      mode: 'nulles-kopejas',
      netMigration: 20000,
    });
    expect(result.birthsNeeded).toBeCloseTo(26109 - 20000, 10);
    expect(result.birthsNeeded).toBeLessThan(base.birthsCurrent);
    expect(result.multiplier).toBeLessThan(1);
  });
});

describe('computeDzimstibas mode C, mērķa izaugsme, likme input', () => {
  it('adds a percentage of population growth on top of the zero-total-change baseline', () => {
    const result = computeDzimstibas({
      ...base,
      mode: 'merka-izaugsme',
      targetInputType: 'likme',
      growthRatePercent: 1,
    });
    const expected = 26109 - -1291 + (1 / 100) * 1845096;
    expect(result.birthsNeeded).toBeCloseTo(expected, 10);
  });

  it('supports a negative growth rate', () => {
    const result = computeDzimstibas({
      ...base,
      mode: 'merka-izaugsme',
      targetInputType: 'likme',
      growthRatePercent: -0.5,
    });
    const expected = 26109 - -1291 + (-0.5 / 100) * 1845096;
    expect(result.birthsNeeded).toBeCloseTo(expected, 10);
  });
});

describe('computeDzimstibas mode C, mērķa izaugsme, merķis input', () => {
  it('spreads the population gap evenly across the target years', () => {
    const result = computeDzimstibas({
      ...base,
      mode: 'merka-izaugsme',
      targetInputType: 'merkis',
      targetPopulation: 1900000,
      currentYear: 2026,
      targetYear: 2036,
    });
    const change = (1900000 - 1845096) / 10;
    const expected = 26109 - -1291 + change;
    expect(result.birthsNeeded).toBeCloseTo(expected, 10);
  });

  it('throws a clear error when target year equals current year, instead of dividing by zero', () => {
    expect(() =>
      computeDzimstibas({
        ...base,
        mode: 'merka-izaugsme',
        targetInputType: 'merkis',
        targetPopulation: 1900000,
        currentYear: 2026,
        targetYear: 2026,
      }),
    ).toThrow(/nedrīkst būt vienāds/);
  });

  it('allows a target population below the current population without throwing', () => {
    const result = computeDzimstibas({
      ...base,
      mode: 'merka-izaugsme',
      targetInputType: 'merkis',
      targetPopulation: 1700000,
      currentYear: 2026,
      targetYear: 2036,
    });
    const change = (1700000 - 1845096) / 10;
    const expected = 26109 - -1291 + change;
    expect(result.birthsNeeded).toBeCloseTo(expected, 10);
    expect(result.birthsNeeded).toBeLessThan(26109 - -1291);
  });
});

describe('computeDzimstibas edge cases', () => {
  it('returns null derived fields instead of throwing or dividing by zero when birthsCurrent is 0', () => {
    const result = computeDzimstibas({ ...base, birthsCurrent: 0, mode: 'nulles-dabiskais' });
    expect(result.birthsNeeded).toBe(26109);
    expect(result.multiplier).toBeNull();
    expect(result.tfrNeeded).toBeNull();
    expect(result.intervalMinutes).toBeNull();
    // perMonth and perDay do not depend on birthsCurrent, so they still compute.
    expect(Number.isFinite(result.perMonth)).toBe(true);
    expect(Number.isFinite(result.perDay)).toBe(true);
  });
});

describe('cohortSize and cohortRatio', () => {
  const series: PopulationYearRow[] = [
    { year: 1943, populationAtYearStart: null, liveBirths: 35915, deaths: 29904, naturalIncrease: 6011, netMigration: null },
    { year: 1944, populationAtYearStart: null, liveBirths: null, deaths: null, naturalIncrease: null, netMigration: null },
    { year: 1990, populationAtYearStart: 2668140, liveBirths: 37918, deaths: 34812, naturalIncrease: 3106, netMigration: -13085 },
    { year: 2025, populationAtYearStart: 1860565, liveBirths: 11931, deaths: 26109, naturalIncrease: -14178, netMigration: -1291 },
  ];

  it('returns the recorded birth count for a year present in the series', () => {
    expect(cohortSize(1990, series)).toBe(37918);
  });

  it('throws a clear error for a year outside the series, not a fallback value', () => {
    expect(() => cohortSize(1900, series)).toThrow(/1900/);
    expect(() => cohortSize(2030, series)).toThrow(/2030/);
  });

  it('throws for 1944, a year in range but with no published data, instead of silently returning null or zero', () => {
    expect(() => cohortSize(1944, series)).toThrow(/1944/);
  });

  it('computes the ratio of a cohort to the current annual births', () => {
    expect(cohortRatio(1990, series, 11931)).toBeCloseTo(37918 / 11931, 10);
  });

  it('returns null for the ratio instead of dividing by zero when birthsCurrent is 0', () => {
    expect(cohortRatio(1990, series, 0)).toBeNull();
  });
});

describe('naturalIncreaseRatePer1000', () => {
  it('matches the sourced national 2025 rate (Daugavpils vs national comparison on the novads pilot pages)', () => {
    // -14 178 dabiskais pieaugums, 1 845 096 population, see claude/demografijas-defaults-2026.md.
    expect(naturalIncreaseRatePer1000(-14178, 1845096)).toBeCloseTo(-7.685, 2);
  });

  it('is positive for positive natural increase', () => {
    expect(naturalIncreaseRatePer1000(500, 100000)).toBeCloseTo(5, 10);
  });
});

describe('yearsToLoseFraction', () => {
  it('matches the sourced Daugavpils figure (deaths minus births as the annual loss)', () => {
    // 77 486 population, -751 dabiskais pieaugums, see claude/demografijas-defaults-2026.md.
    expect(yearsToLoseFraction(77486, -751, 0.1)).toBeCloseTo(10.32, 1);
  });

  it('returns null when natural increase is zero, not a division by zero', () => {
    expect(yearsToLoseFraction(10000, 0, 0.1)).toBeNull();
  });

  it('returns null when natural increase is positive, since there is no decline to project', () => {
    expect(yearsToLoseFraction(10000, 50, 0.1)).toBeNull();
  });
});
