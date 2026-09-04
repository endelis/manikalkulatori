import daylightData from '@/claude/data/lv-riga-daylight-2026.json';
import type { TumsasInput } from './tumsas-kalkulators';

/**
 * Sourced defaults, see claude/tumsas-kalkulators-defaults-2026.md. Every value here
 * traces to sunrisesunset.io or tutiempo.net for Rīga, retrieved 2026-09-04.
 */

function parseHoursMinutes(value: string): number {
  const [hours, minutes] = value.split(':').map(Number);
  return hours + minutes / 60;
}

// D_max and D_min: the two sourced daily extremes, parsed as raw hours:minutes rather
// than pre-rounded decimals, so the derived average and amplitude below stay auditable
// against the cited source.
export const LONGEST_DAY_HOURS = parseHoursMinutes(daylightData.longestDay2026.daylightHoursMinutes);
export const SHORTEST_DAY_HOURS = parseHoursMinutes(daylightData.shortestDay2026.daylightHoursMinutes);
export const LONGEST_DAY_DATE = daylightData.longestDay2026.date;
export const SHORTEST_DAY_DATE = daylightData.shortestDay2026.date;

// A = (D_max - D_min) / 2, derived here rather than hand entered, so it stays exactly
// consistent with LONGEST_DAY_HOURS and SHORTEST_DAY_HOURS above.
export const AMPLITUDE_HOURS = (LONGEST_DAY_HOURS - SHORTEST_DAY_HOURS) / 2;

// D_vid: annual total daylight for 2026 divided by the number of days in that year
// (2026 is not a leap year), rather than a separately hand entered average, so it
// stays exactly consistent with the cited annual total.
export const ANNUAL_TOTAL_DAYLIGHT_HOURS = parseHoursMinutes(daylightData.annualTotal2026.totalHoursMinutes);
export const DAYS_IN_2026 = daylightData.annualTotal2026.daysInYear;
export const AVERAGE_DAYLIGHT_HOURS = ANNUAL_TOTAL_DAYLIGHT_HOURS / DAYS_IN_2026;

export const SUMMER_SOLSTICE_DAY_OF_YEAR = daylightData.summerSolstice2026.dayOfYear;
export const LATITUDE_DEGREES_NORTH = daylightData.latitude.degreesNorth;

export const RETRIEVED_DATE = daylightData.retrievedDate;

export const DEFAULT_BIRTH_DATE = '1990-06-15';

export function buildTumsasInput(birthDate: string, today: string): TumsasInput {
  return {
    birthDate,
    today,
    averageDaylightHours: AVERAGE_DAYLIGHT_HOURS,
    amplitudeHours: AMPLITUDE_HOURS,
    summerSolsticeDayOfYear: SUMMER_SOLSTICE_DAY_OF_YEAR,
  };
}
