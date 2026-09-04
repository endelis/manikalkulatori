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
];

export function getNovadsPilotArea(slug: string): NovadsPilotArea | undefined {
  return NOVADS_PILOT_AREAS.find((area) => area.slug === slug);
}
