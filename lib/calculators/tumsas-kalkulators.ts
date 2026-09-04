export interface TumsasInput {
  /** ISO 'YYYY-MM-DD'. */
  birthDate: string;
  /** ISO 'YYYY-MM-DD', injected rather than read from the clock inside this pure function. */
  today: string;
  /** D_vid: Rīga's annual average daylight, in hours. */
  averageDaylightHours: number;
  /** A: half the swing between the longest and shortest day, in hours. */
  amplitudeHours: number;
  /** n_vasaras_saulgrieži: day of year of the summer solstice. */
  summerSolsticeDayOfYear: number;
}

export interface TumsasResult {
  totalDaysLived: number;
  totalDarkDays: number;
  darkYears: number;
  darkMonths: number;
  percentDark: number;
}

const HOURS_PER_DAY = 24;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAYS_PER_YEAR = 365.25;
const MONTHS_PER_YEAR = 12;

function toEpochDay(isoDate: string): number {
  const [year, month, day] = isoDate.split('-').map(Number);
  return Date.UTC(year, month - 1, day) / MS_PER_DAY;
}

function dayOfYear(epochDay: number): number {
  const date = new Date(epochDay * MS_PER_DAY);
  const year = date.getUTCFullYear();
  const startOfYearEpochDay = Date.UTC(year, 0, 1) / MS_PER_DAY;
  return epochDay - startOfYearEpochDay + 1;
}

/**
 * gaismas_stundas(n) = D_vid + A * cos(2π * (n - n_vasaras_saulgrieži) / 365.25)
 * A sinusoidal approximation of Rīga's daylight hours for day of year `n`, not an
 * ephemeris calculation. See claude/tumsas-kalkulators-defaults-2026.md for why this
 * approximation was chosen over exact sunrise and sunset tables.
 */
export function daylightHours(
  n: number,
  input: Pick<TumsasInput, 'averageDaylightHours' | 'amplitudeHours' | 'summerSolsticeDayOfYear'>,
): number {
  return (
    input.averageDaylightHours +
    input.amplitudeHours * Math.cos((2 * Math.PI * (n - input.summerSolsticeDayOfYear)) / DAYS_PER_YEAR)
  );
}

/**
 * Sums darkness hours (24 minus the approximated daylight hours) over every calendar
 * day from birthDate to today inclusive, then converts the total back to whole days.
 * A day by day loop, not a closed form integral, so the running total stays auditable
 * against the sourced constants one day at a time.
 */
export function computeTumsas(input: TumsasInput): TumsasResult {
  const birthEpochDay = toEpochDay(input.birthDate);
  const todayEpochDay = toEpochDay(input.today);

  if (todayEpochDay < birthEpochDay) {
    throw new Error('Dzimšanas datums nedrīkst būt vēlāks par šodienu.');
  }

  let totalDarkHours = 0;
  let totalDaysLived = 0;
  for (let epochDay = birthEpochDay; epochDay <= todayEpochDay; epochDay += 1) {
    const n = dayOfYear(epochDay);
    const light = daylightHours(n, input);
    totalDarkHours += HOURS_PER_DAY - light;
    totalDaysLived += 1;
  }

  const totalDarkDays = totalDarkHours / HOURS_PER_DAY;
  const darkYears = Math.floor(totalDarkDays / DAYS_PER_YEAR);
  const darkMonths = Math.floor(((totalDarkDays - darkYears * DAYS_PER_YEAR) / DAYS_PER_YEAR) * MONTHS_PER_YEAR);
  const percentDark = (totalDarkDays / totalDaysLived) * 100;

  return { totalDaysLived, totalDarkDays, darkYears, darkMonths, percentDark };
}
