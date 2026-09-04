export interface PensionInput {
  currentYear: number;
  birthYear: number;
  currentGrossSalaryMonthly: number;
  /** Years of insurance record (apdrošināšanas stāžs) since ndcStartYear. */
  insuranceRecordYears: number;
  wageGrowthPercent: number;
  retirementAge: number;
  /** The year the NDC capital system began; record before this year is out of scope. */
  ndcStartYear: number;
  pillar1ContributionRatePercent: number;
  /** Keyed by application year Y: index applied to capital from end of Y-1 to Y. */
  wageIndexSeries: Record<number, number>;
  /** Keyed by retirement age. */
  gTable: Record<number, number>;
}

export interface PensionResult {
  retirementYear: number;
  /** Insurance record years actually counted, after clamping to ndcStartYear. */
  effectiveServiceYears: number;
  /** True if insuranceRecordYears implied a start year before ndcStartYear. */
  serviceTruncated: boolean;
  serviceStartYear: number;
  capitalPast: number;
  capitalFuture: number;
  capitalTotal: number;
  gValue: number;
  monthlyPension: number;
}

const MONTHS_PER_YEAR = 12;
const PERCENT_DIVISOR = 100;

/**
 * Cumulative index factor from `fromYear` forward to `toYear`, using the real per-year
 * VSAA index series. Exported for the page's methodology copy (to show, as cited
 * context, what a genuinely historical nominal amount from `fromYear` would have grown
 * to by `toYear`) — not used by computePension's own backfilled past capital, see the
 * comment there for why. A year with no published index (fromYear + 1 through toYear,
 * inclusive, must all be present) is treated as 1 (no indexation yet), matching the
 * site's convention of not fabricating an unpublished value.
 */
export function cumulativeIndex(fromYear: number, toYear: number, series: Record<number, number>): number {
  let factor = 1;
  for (let year = fromYear + 1; year <= toYear; year += 1) {
    factor *= series[year] ?? 1;
  }
  return factor;
}

export function computePension(input: PensionInput): PensionResult {
  const {
    currentYear,
    currentGrossSalaryMonthly,
    insuranceRecordYears,
    wageGrowthPercent,
    retirementAge,
    ndcStartYear,
    pillar1ContributionRatePercent,
    gTable,
  } = input;

  const rawServiceStartYear = currentYear - insuranceRecordYears;
  const serviceStartYear = Math.max(ndcStartYear, rawServiceStartYear);
  const serviceTruncated = rawServiceStartYear < ndcStartYear;
  const effectiveServiceYears = currentYear - serviceStartYear;

  const pillar1Rate = pillar1ContributionRatePercent / PERCENT_DIVISOR;
  const annualSalaryNow = currentGrossSalaryMonthly * MONTHS_PER_YEAR;

  // Past capital: each past year's contribution is approximated using today's salary,
  // since no year by year salary history is collected. That approximated amount is
  // already expressed in today's nominal terms, so it is NOT run through the real
  // per-year VSAA index: the index exists to bring a genuinely historical (lower)
  // nominal amount up to today's terms, and applying it on top of an already-current
  // stand-in figure would double count wage growth, inflating capitalPast beyond what
  // the backfill assumption can defend. See
  // claude/pension-calculator-defaults-2026.md, "K aprēķina vienkāršojums".
  const capitalPast = effectiveServiceYears * annualSalaryNow * pillar1Rate;

  // Future capital: from now until retirement, salary is projected to grow at the
  // wage growth assumption; no further indexation is applied, since a future index has
  // not been published and cannot be sourced (the assumption growth rate stands in for
  // it).
  const retirementYear = input.birthYear + retirementAge;
  let capitalFuture = 0;
  for (let year = currentYear; year < retirementYear; year += 1) {
    const yearsFromNow = year - currentYear;
    const projectedAnnualSalary = annualSalaryNow * (1 + wageGrowthPercent / PERCENT_DIVISOR) ** yearsFromNow;
    capitalFuture += projectedAnnualSalary * pillar1Rate;
  }

  const capitalTotal = capitalPast + capitalFuture;

  const gValue = gTable[retirementAge];
  if (gValue === undefined) {
    throw new Error(`Nav pieejama koeficienta G vērtība ${retirementAge} gadu vecumam.`);
  }

  const monthlyPension = capitalTotal / gValue / MONTHS_PER_YEAR;

  return {
    retirementYear,
    effectiveServiceYears,
    serviceTruncated,
    serviceStartYear,
    capitalPast,
    capitalFuture,
    capitalTotal,
    gValue,
    monthlyPension,
  };
}
