import pensionData from '@/claude/data/lv-pension-vsaa-2026.json';
import type { PensionInput } from './pensijas-kalkulators';

/**
 * Sourced defaults, see claude/pension-calculator-defaults-2026.md. Every value here
 * traces to a primary source (VSAA, LV portāls, CSP, Satversmes tiesa), retrieved
 * 2026-09-04.
 */
export const CURRENT_YEAR = 2026;

// https://lvportals.lv/e-konsultacijas/38466-pensijas-vecums-ir-65-gadi-iesniegumu-var-iesniegt-vienu-menesi-pirms-dosanas-pensija-2026
export const MIN_RETIREMENT_AGE = 65;
export const MAX_RETIREMENT_AGE = 70;
export const DEFAULT_RETIREMENT_AGE = 65;
export const MIN_INSURANCE_RECORD_YEARS = 20;

// The year the NDC pension capital system began; insurance record before this year is
// out of scope for this calculator (the Ks pre-1996 term is excluded from MVP, see
// claude/pension-calculator-defaults-2026.md, "Zināmie vienkāršojumi").
export const NDC_START_YEAR = 1996;

// https://gramatvedisriga.lv/lv/blog/vsaoi-rates-2026 and https://www.vsaa.gov.lv/en/contributions-0
export const VSAOI_TOTAL_RATE_PERCENT = 34.09;

// 15% to the 1st pillar out of 20% total pension insurance contribution, changed from
// the historical 14% since 2025, upheld by the Constitutional Court 2026-06-18, framed
// as a temporary measure with no confirmed reversion date. See
// https://www.lsm.lv/raksts/zinas/ekonomika/04.12.2024-1-no-pensiju-otra-limena-iemaksam-parnesis-uz-pirmo-limeni.a578779/
// and https://www.lsm.lv/raksts/zinas/ekonomika/18.06.2026-tiesa-pensiju-2-limena-iemaksu-likmes-termineta-samazinasana-par-vienu-procentpunktu-atbilst-satversmei.a651990/
export const PILLAR_1_CONTRIBUTION_RATE_PERCENT = 15;
export const PILLAR_1_RATE_IS_TEMPORARY = true;
// The other 5 of the 20% total, invested in the user's chosen 2nd pillar fund; this
// calculator does not model it (see claude/pension-calculator-defaults-2026.md, "MVP
// darbības joma"), but the split is cited in the methodology and FAQ copy.
export const PILLAR_2_CONTRIBUTION_RATE_PERCENT = 5;
export const TOTAL_PENSION_CONTRIBUTION_RATE_PERCENT =
  PILLAR_1_CONTRIBUTION_RATE_PERCENT + PILLAR_2_CONTRIBUTION_RATE_PERCENT;

// The source PDF (VSAA "Apdrošināšanas iemaksu algas indeksi (2025)") has no printed
// page numbers or section headings, so it is cited by physical position: page 1 has the
// 1996 to 2013 contribution year rows, page 2 has 2014 to 2023. See
// claude/data/lv-pension-vsaa-2026.json, wageIndexSeries.sourceLocation.
export const WAGE_INDEX_SOURCE_PAGE_1_YEARS = { from: 1996, to: 2013 };
export const WAGE_INDEX_SOURCE_PAGE_2_YEARS = { from: 2014, to: 2023 };

// Conservative long run default, not the recent actual or forecast (see below). Cited
// as an assumption, not a fact, see claude/pension-calculator-defaults-2026.md, row 6b.
export const DEFAULT_WAGE_GROWTH_PERCENT = 3.5;

// Recent context only, not used as the default: shown near the wage growth input as a
// cited reference point, explicitly labeled as short term and not to be extrapolated.
// https://www.csp.gov.lv/lv/jaunums/2025-gada-videjais-atalgojums-pirms-nodoklu-nomaksas-1-815-eiro
export const RECENT_ACTUAL_WAGE_GROWTH_PERCENT = 7.7;
export const RECENT_ACTUAL_WAGE_GROWTH_YEAR = 2025;
// https://www.apollo.lv/8387615/banku-analitiki-2026-gada-latvija-gaida-darba-samaksas-kapumu-par-videji-apmeram-7
export const FORECAST_WAGE_GROWTH_PERCENT = 7;
export const FORECAST_WAGE_GROWTH_YEAR = 2026;

export const G_COEFFICIENT_TABLE: Record<number, number> = Object.fromEntries(
  Object.entries(pensionData.gCoefficientTable.byAge).map(([age, value]) => [Number(age), value]),
);

// Keyed by application year Y: the index by which capital accumulated through the end
// of year Y-1 is multiplied to bring it to year Y terms. No entry exists for a year
// VSAA has not yet published (2025 onward as of this retrieval); the compute module
// must not fabricate a value for a missing year.
export const WAGE_INDEX_SERIES: Record<number, number> = Object.fromEntries(
  Object.entries(pensionData.wageIndexSeries.byApplicationYear).map(([year, value]) => [Number(year), value]),
);
export const LATEST_PUBLISHED_INDEX_YEAR = Math.max(...Object.keys(WAGE_INDEX_SERIES).map(Number));

export const DEFAULT_BIRTH_YEAR = 1990;
export const DEFAULT_GROSS_SALARY_MONTHLY = 1_815; // 2025 average, CSP, context only, not a claim about the user
export const DEFAULT_INSURANCE_RECORD_YEARS = 10;

export const DEFAULT_INPUT: PensionInput = {
  currentYear: CURRENT_YEAR,
  birthYear: DEFAULT_BIRTH_YEAR,
  currentGrossSalaryMonthly: DEFAULT_GROSS_SALARY_MONTHLY,
  insuranceRecordYears: DEFAULT_INSURANCE_RECORD_YEARS,
  wageGrowthPercent: DEFAULT_WAGE_GROWTH_PERCENT,
  retirementAge: DEFAULT_RETIREMENT_AGE,
  ndcStartYear: NDC_START_YEAR,
  pillar1ContributionRatePercent: PILLAR_1_CONTRIBUTION_RATE_PERCENT,
  wageIndexSeries: WAGE_INDEX_SERIES,
  gTable: G_COEFFICIENT_TABLE,
};
