export type DzimstibasMode = 'nulles-dabiskais' | 'nulles-kopejas' | 'merka-izaugsme';
export type TargetInputType = 'likme' | 'merkis';

export interface PopulationYearRow {
  year: number;
  populationAtYearStart: number | null;
  liveBirths: number | null;
  deaths: number | null;
  naturalIncrease: number | null;
  netMigration: number | null;
}

export interface DzimstibasBaseInput {
  deaths: number;
  netMigration: number;
  population: number;
  birthsCurrent: number;
  tfrCurrent: number;
}

export interface DzimstibasModeAInput extends DzimstibasBaseInput {
  mode: 'nulles-dabiskais';
}

export interface DzimstibasModeBInput extends DzimstibasBaseInput {
  mode: 'nulles-kopejas';
}

export interface DzimstibasModeCRateInput extends DzimstibasBaseInput {
  mode: 'merka-izaugsme';
  targetInputType: 'likme';
  growthRatePercent: number;
}

export interface DzimstibasModeCTargetInput extends DzimstibasBaseInput {
  mode: 'merka-izaugsme';
  targetInputType: 'merkis';
  targetPopulation: number;
  currentYear: number;
  targetYear: number;
}

export type DzimstibasInput =
  | DzimstibasModeAInput
  | DzimstibasModeBInput
  | DzimstibasModeCRateInput
  | DzimstibasModeCTargetInput;

export interface DzimstibasResult {
  birthsNeeded: number;
  perMonth: number;
  perDay: number;
  multiplier: number | null;
  tfrNeeded: number | null;
  intervalMinutes: number | null;
}

const DAYS_PER_YEAR = 365.25;
const MONTHS_PER_YEAR = 12;
const MINUTES_PER_DAY = 24 * 60;
const PERCENT_DIVISOR = 100;

export function computeBirthsNeeded(input: DzimstibasInput): number {
  switch (input.mode) {
    case 'nulles-dabiskais':
      return input.deaths;
    case 'nulles-kopejas':
      return input.deaths - input.netMigration;
    case 'merka-izaugsme':
      if (input.targetInputType === 'likme') {
        return input.deaths - input.netMigration + (input.growthRatePercent / PERCENT_DIVISOR) * input.population;
      }
      if (input.targetYear === input.currentYear) {
        throw new Error('Mērķa gads nedrīkst būt vienāds ar sākuma gadu, jo tad izmaiņu periods ir nulle gadu.');
      }
      const years = input.targetYear - input.currentYear;
      const change = (input.targetPopulation - input.population) / years;
      return input.deaths - input.netMigration + change;
  }
}

export function computeDzimstibas(input: DzimstibasInput): DzimstibasResult {
  const birthsNeeded = computeBirthsNeeded(input);

  const hasCurrentBirths = input.birthsCurrent !== 0;
  const multiplier = hasCurrentBirths ? birthsNeeded / input.birthsCurrent : null;
  const tfrNeeded = multiplier !== null ? input.tfrCurrent * multiplier : null;
  const intervalMinutes = hasCurrentBirths ? (DAYS_PER_YEAR * MINUTES_PER_DAY) / input.birthsCurrent : null;

  return {
    birthsNeeded,
    perMonth: birthsNeeded / MONTHS_PER_YEAR,
    perDay: birthsNeeded / DAYS_PER_YEAR,
    multiplier,
    tfrNeeded,
    intervalMinutes,
  };
}

export function cohortSize(year: number, series: PopulationYearRow[]): number {
  const row = series.find((entry) => entry.year === year);
  if (!row || row.liveBirths === null) {
    throw new Error(`Nav pieejamu dzimušo skaita datu par ${year}. gadu.`);
  }
  return row.liveBirths;
}

export function cohortRatio(year: number, series: PopulationYearRow[], birthsCurrent: number): number | null {
  const size = cohortSize(year, series);
  if (birthsCurrent === 0) {
    return null;
  }
  return size / birthsCurrent;
}

/**
 * Natural increase or decrease per 1000 residents, for comparing places of very
 * different sizes on the same scale. `population` should be the population figure that
 * corresponds to the same reference period as `naturalIncrease` (see the data file for
 * how each place's pairing was chosen).
 */
export function naturalIncreaseRatePer1000(naturalIncrease: number, population: number): number {
  return (naturalIncrease / population) * 1000;
}

/**
 * Years until a place loses the given fraction of its population if the current
 * natural decrease continued unchanged (no migration, no age structure, this is the
 * same order of simplicity as the rest of this module, not a demographic projection).
 * Returns null when natural increase is zero or positive, since there is no decline to
 * project.
 */
export function yearsToLoseFraction(population: number, naturalIncrease: number, fraction: number): number | null {
  if (naturalIncrease >= 0) return null;
  return (fraction * population) / Math.abs(naturalIncrease);
}
