import type { PopulationYearRow } from './calculators/dzimstibas-kalkulators';

/**
 * Sourced defaults for the three novads pilot pages, see claude/demografijas-defaults-2026.md,
 * section "Novads pilot". Every value here traces to CSP PxWeb tables IRS031, IDS031, and
 * IMV021, retrieved 2026-09-04.
 */
export interface NovadsPilotArea {
  slug: string;
  name: string;
  /** Latvian noun cases, written out by hand: place name declension is not regular. */
  locative: string;
  genitive: string;
  /** The real latest year with a matched population + births + deaths + natural increase set. */
  referenceYear: number;
  /** Population at the start of the year after referenceYear. */
  population: number;
  populationReferenceDate: string;
  births: number;
  deaths: number;
  naturalIncrease: number;
  netMigration: number;
  /** National comparison, same referenceYear, same pairing method. */
  nationalNaturalIncrease: number;
  nationalPopulation: number;
  /** Annual rows, at least the last five years; some fields may be null where CSP has not
   * yet published the breakdown for this area (see the data file for which and why). */
  series: PopulationYearRow[];
}

export const NOVADS_PILOT_AREAS: NovadsPilotArea[] = [
  {
    slug: 'daugavpils',
    name: 'Daugavpils',
    locative: 'Daugavpilī',
    genitive: 'Daugavpils',
    referenceYear: 2025,
    population: 77486,
    populationReferenceDate: '2026. gada 1. janvārī',
    births: 456,
    deaths: 1207,
    naturalIncrease: -751,
    netMigration: 111,
    nationalNaturalIncrease: -14178,
    nationalPopulation: 1845096,
    series: [
      { year: 2021, populationAtYearStart: 80627, liveBirths: 593, deaths: 1829, naturalIncrease: -1236, netMigration: null },
      { year: 2022, populationAtYearStart: 79120, liveBirths: 550, deaths: 1479, naturalIncrease: -929, netMigration: null },
      { year: 2023, populationAtYearStart: 79903, liveBirths: 495, deaths: 1326, naturalIncrease: -831, netMigration: null },
      { year: 2024, populationAtYearStart: 78942, liveBirths: 505, deaths: 1208, naturalIncrease: -703, netMigration: null },
      { year: 2025, populationAtYearStart: 78126, liveBirths: 456, deaths: 1207, naturalIncrease: -751, netMigration: 111 },
      { year: 2026, populationAtYearStart: 77486, liveBirths: null, deaths: null, naturalIncrease: null, netMigration: null },
    ],
  },
  {
    slug: 'jelgava',
    name: 'Jelgava',
    locative: 'Jelgavā',
    genitive: 'Jelgavas',
    referenceYear: 2025,
    population: 54408,
    populationReferenceDate: '2026. gada 1. janvārī',
    births: 363,
    deaths: 706,
    naturalIncrease: -343,
    netMigration: -83,
    nationalNaturalIncrease: -14178,
    nationalPopulation: 1845096,
    series: [
      { year: 2021, populationAtYearStart: 55336, liveBirths: 560, deaths: 911, naturalIncrease: -351, netMigration: null },
      { year: 2022, populationAtYearStart: 54694, liveBirths: 488, deaths: 799, naturalIncrease: -311, netMigration: null },
      { year: 2023, populationAtYearStart: 55459, liveBirths: 455, deaths: 693, naturalIncrease: -238, netMigration: null },
      { year: 2024, populationAtYearStart: 55216, liveBirths: 414, deaths: 718, naturalIncrease: -304, netMigration: null },
      { year: 2025, populationAtYearStart: 54834, liveBirths: 363, deaths: 706, naturalIncrease: -343, netMigration: -83 },
      { year: 2026, populationAtYearStart: 54408, liveBirths: null, deaths: null, naturalIncrease: null, netMigration: null },
    ],
  },
  {
    slug: 'varaklani',
    name: 'Varakļānu novads',
    locative: 'Varakļānu novadā',
    genitive: 'Varakļānu novada',
    // A year behind the two cities: IDS031 and IMV021 (the birth/death breakdown tables)
    // have not yet published 2025 figures for this area, only IRS031's aggregate NATGROW.
    // See claude/demografijas-defaults-2026.md for the exact check.
    referenceYear: 2024,
    population: 2820,
    populationReferenceDate: '2025. gada 1. janvārī',
    births: 20,
    deaths: 56,
    naturalIncrease: -36,
    netMigration: -36,
    nationalNaturalIncrease: -13774,
    nationalPopulation: 1860565,
    series: [
      { year: 2021, populationAtYearStart: 2945, liveBirths: 18, deaths: 69, naturalIncrease: -51, netMigration: null },
      { year: 2022, populationAtYearStart: 2918, liveBirths: 22, deaths: 57, naturalIncrease: -35, netMigration: null },
      { year: 2023, populationAtYearStart: 3001, liveBirths: 15, deaths: 58, naturalIncrease: -43, netMigration: null },
      { year: 2024, populationAtYearStart: 2892, liveBirths: 20, deaths: 56, naturalIncrease: -36, netMigration: -36 },
      { year: 2025, populationAtYearStart: 2820, liveBirths: null, deaths: null, naturalIncrease: null, netMigration: null },
    ],
  },
  {
    slug: 'liepaja',
    name: 'Liepāja',
    locative: 'Liepājā',
    genitive: 'Liepājas',
    referenceYear: 2025,
    population: 66746,
    populationReferenceDate: '2026. gada 1. janvārī',
    births: 481,
    deaths: 921,
    naturalIncrease: -440,
    netMigration: -235,
    nationalNaturalIncrease: -14178,
    nationalPopulation: 1845096,
    series: [
      { year: 2021, populationAtYearStart: 67964, liveBirths: 712, deaths: 1245, naturalIncrease: -533, netMigration: null },
      { year: 2022, populationAtYearStart: 67360, liveBirths: 610, deaths: 1107, naturalIncrease: -497, netMigration: null },
      { year: 2023, populationAtYearStart: 68436, liveBirths: 546, deaths: 964, naturalIncrease: -418, netMigration: null },
      { year: 2024, populationAtYearStart: 68106, liveBirths: 464, deaths: 986, naturalIncrease: -522, netMigration: null },
      { year: 2025, populationAtYearStart: 67421, liveBirths: 481, deaths: 921, naturalIncrease: -440, netMigration: -235 },
      { year: 2026, populationAtYearStart: 66746, liveBirths: null, deaths: null, naturalIncrease: null, netMigration: null },
    ],
  },
  {
    slug: 'ventspils',
    name: 'Ventspils',
    locative: 'Ventspilī',
    genitive: 'Ventspils',
    referenceYear: 2025,
    population: 32479,
    populationReferenceDate: '2026. gada 1. janvārī',
    births: 229,
    deaths: 497,
    naturalIncrease: -268,
    netMigration: 24,
    nationalNaturalIncrease: -14178,
    nationalPopulation: 1845096,
    series: [
      { year: 2021, populationAtYearStart: 33372, liveBirths: 239, deaths: 608, naturalIncrease: -369, netMigration: null },
      { year: 2022, populationAtYearStart: 32955, liveBirths: 266, deaths: 548, naturalIncrease: -282, netMigration: null },
      { year: 2023, populationAtYearStart: 33546, liveBirths: 225, deaths: 504, naturalIncrease: -279, netMigration: null },
      { year: 2024, populationAtYearStart: 33248, liveBirths: 200, deaths: 499, naturalIncrease: -299, netMigration: null },
      { year: 2025, populationAtYearStart: 32723, liveBirths: 229, deaths: 497, naturalIncrease: -268, netMigration: 24 },
      { year: 2026, populationAtYearStart: 32479, liveBirths: null, deaths: null, naturalIncrease: null, netMigration: null },
    ],
  },
  {
    slug: 'rezekne',
    name: 'Rēzekne',
    locative: 'Rēzeknē',
    genitive: 'Rēzeknes',
    referenceYear: 2025,
    population: 25978,
    populationReferenceDate: '2026. gada 1. janvārī',
    births: 109,
    deaths: 420,
    naturalIncrease: -311,
    netMigration: -140,
    nationalNaturalIncrease: -14178,
    nationalPopulation: 1845096,
    series: [
      { year: 2021, populationAtYearStart: 26839, liveBirths: 210, deaths: 564, naturalIncrease: -354, netMigration: null },
      { year: 2022, populationAtYearStart: 26481, liveBirths: 206, deaths: 480, naturalIncrease: -274, netMigration: null },
      { year: 2023, populationAtYearStart: 26862, liveBirths: 182, deaths: 421, naturalIncrease: -239, netMigration: null },
      { year: 2024, populationAtYearStart: 26703, liveBirths: 112, deaths: 415, naturalIncrease: -303, netMigration: null },
      { year: 2025, populationAtYearStart: 26429, liveBirths: 109, deaths: 420, naturalIncrease: -311, netMigration: -140 },
      { year: 2026, populationAtYearStart: 25978, liveBirths: null, deaths: null, naturalIncrease: null, netMigration: null },
    ],
  },
  {
    slug: 'valmiera',
    name: 'Valmiera',
    locative: 'Valmierā',
    genitive: 'Valmieras',
    referenceYear: 2025,
    population: 22746,
    populationReferenceDate: '2026. gada 1. janvārī',
    births: 162,
    deaths: 283,
    naturalIncrease: -121,
    netMigration: 55,
    nationalNaturalIncrease: -14178,
    nationalPopulation: 1845096,
    series: [
      { year: 2021, populationAtYearStart: 22971, liveBirths: 265, deaths: 363, naturalIncrease: -98, netMigration: null },
      { year: 2022, populationAtYearStart: 22757, liveBirths: 225, deaths: 365, naturalIncrease: -140, netMigration: null },
      { year: 2023, populationAtYearStart: 23237, liveBirths: 196, deaths: 303, naturalIncrease: -107, netMigration: null },
      { year: 2024, populationAtYearStart: 22986, liveBirths: 184, deaths: 311, naturalIncrease: -127, netMigration: null },
      { year: 2025, populationAtYearStart: 22812, liveBirths: 162, deaths: 283, naturalIncrease: -121, netMigration: 55 },
      { year: 2026, populationAtYearStart: 22746, liveBirths: null, deaths: null, naturalIncrease: null, netMigration: null },
    ],
  },
];

export function getNovadsPilotArea(slug: string): NovadsPilotArea | undefined {
  return NOVADS_PILOT_AREAS.find((area) => area.slug === slug);
}

/**
 * Below this population, a single year's births/deaths count is small enough that
 * ordinary year to year sampling noise (Poisson-ish: relative variation scales with
 * 1/sqrt(count)) is comparable to or larger than the real signal a rate comparison or
 * a "years until a tenth is lost" projection is trying to detect. At Latvia's roughly
 * 6 to 7 births per 1000 residents per year, 10,000 residents means on the order of
 * 60 to 70 births a year (relative noise around 12 to 13 percent); well below that,
 * annual counts drop into the low tens, where the relative noise exceeds 20 percent.
 * This is not a theoretical worry: Varakļānu novads (population ~2,820, see below)
 * had 18, 22, 15, and 20 live births in four consecutive years, a swing of about a
 * third with no underlying trend. Below this threshold, single-year derived figures
 * (a rate comparison verdict, years until a tenth of the population is lost) are
 * suppressed rather than shown with false precision; see
 * app/sabiedriba/iedzivotaju-skaits/[slug]/page.tsx.
 */
export const SMALL_AREA_POPULATION_THRESHOLD = 10000;

export function isSmallArea(area: NovadsPilotArea): boolean {
  return area.population < SMALL_AREA_POPULATION_THRESHOLD;
}

export function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
