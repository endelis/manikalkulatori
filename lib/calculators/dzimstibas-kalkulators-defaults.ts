import populationData from '@/claude/data/lv-population-1920-2026.json';
import type { DzimstibasModeAInput, PopulationYearRow } from './dzimstibas-kalkulators';

/**
 * Sourced defaults, see claude/demografijas-defaults-2026.md rows 1 to 7. Every value
 * here traces to a CSP PxWeb table (IRS010 or IDK010), retrieved 2026-09-03.
 */
export const CURRENT_YEAR = 2026;
export const SOURCE_YEAR = 2025;

export const DEFAULT_POPULATION = 1_845_096; // 01.01.2026, IRS010, POP_SY
export const DEFAULT_DEATHS = 26_109; // 2025, IRS010, DEATH
export const DEFAULT_NET_MIGRATION = -1_291; // 2025, IRS010, MIGR_NET
export const DEFAULT_BIRTHS_CURRENT = 11_931; // 2025, IRS010, LBIRTH
export const DEFAULT_TFR = 1.16; // 2025, IDK010, IDK0101
export const DEFAULT_GENERAL_FERTILITY_RATE = 6.4; // 2025, IDK010, IDK0104, per 1000

export const DEFAULT_INPUT: DzimstibasModeAInput = {
  mode: 'nulles-dabiskais',
  deaths: DEFAULT_DEATHS,
  netMigration: DEFAULT_NET_MIGRATION,
  population: DEFAULT_POPULATION,
  birthsCurrent: DEFAULT_BIRTHS_CURRENT,
  tfrCurrent: DEFAULT_TFR,
};

export const POPULATION_SERIES: PopulationYearRow[] = populationData.series;

/**
 * Comparison town for the "Mērogs" engagement module, CSP PxWeb table IRS031,
 * indicator POP_SY, retrieved 2026-09-03.
 * https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__IR__IRS/IRS031/
 */
export const COMPARISON_TOWN = {
  name: 'Cēsis',
  // Latvian place name declension does not follow a regular suffix rule, so these
  // forms are written out by hand rather than derived from `name` at render time.
  locative: 'Cēsīs',
  genitive: 'Cēsu',
  population: 14_899,
  referenceDate: '2026. gada 1. janvārī',
  sourceUrl: 'https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__IR__IRS/IRS031/',
  tableCode: 'IRS031',
};
