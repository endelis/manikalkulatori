export interface AlgaNetoInputs {
  grossMonthlyEur: number;
  applyNonTaxableMinimum: boolean;
}

export interface AlgaNetoResult {
  vsaoiEur: number;
  nonTaxableMinimumEur: number;
  iinEur: number;
  netMonthlyEur: number;
}

const VSAOI_EMPLOYEE_RATE = 0.105;
const IIN_LOWER_RATE = 0.255;
const IIN_HIGHER_RATE = 0.33;
/** Solidarity surtax: an additional 3 percentage points on top of the 33% rate for
 * income above the top threshold, per fm.gov.lv's 2026 rate page (fetched 2026-09-12):
 * "gada ienākuma daļai līdz 105 300 eiro – 25,5%; gada ienākuma daļai, kas pārsniedz
 * 105 300 eiro – 33%", plus a separately confirmed supplementary 3% above 200 000 EUR/year. */
const IIN_TOP_RATE = 0.36;
const IIN_MONTHLY_THRESHOLD_EUR = 8775;
const IIN_MONTHLY_TOP_THRESHOLD_EUR = 200_000 / 12;

const NTM_MAX_EUR = 550;
const NTM_FULL_UP_TO_INCOME_EUR = 500;
const NTM_ZERO_FROM_INCOME_EUR = 1800;

function nonTaxableMinimum(grossMonthlyEur: number): number {
  if (grossMonthlyEur <= NTM_FULL_UP_TO_INCOME_EUR) return NTM_MAX_EUR;
  if (grossMonthlyEur >= NTM_ZERO_FROM_INCOME_EUR) return 0;

  const range = NTM_ZERO_FROM_INCOME_EUR - NTM_FULL_UP_TO_INCOME_EUR;
  const overage = grossMonthlyEur - NTM_FULL_UP_TO_INCOME_EUR;
  return NTM_MAX_EUR * (1 - overage / range);
}

export function progressiveIin(taxableBaseEur: number): number {
  if (taxableBaseEur <= 0) return 0;
  if (taxableBaseEur <= IIN_MONTHLY_THRESHOLD_EUR) return taxableBaseEur * IIN_LOWER_RATE;

  const lowerPortion = IIN_MONTHLY_THRESHOLD_EUR * IIN_LOWER_RATE;

  if (taxableBaseEur <= IIN_MONTHLY_TOP_THRESHOLD_EUR) {
    const higherPortion = (taxableBaseEur - IIN_MONTHLY_THRESHOLD_EUR) * IIN_HIGHER_RATE;
    return lowerPortion + higherPortion;
  }

  const midPortion = (IIN_MONTHLY_TOP_THRESHOLD_EUR - IIN_MONTHLY_THRESHOLD_EUR) * IIN_HIGHER_RATE;
  const topPortion = (taxableBaseEur - IIN_MONTHLY_TOP_THRESHOLD_EUR) * IIN_TOP_RATE;
  return lowerPortion + midPortion + topPortion;
}

export function calculateAlgaNeto(inputs: AlgaNetoInputs): AlgaNetoResult {
  const grossMonthlyEur = Math.max(0, inputs.grossMonthlyEur);

  const vsaoiEur = grossMonthlyEur * VSAOI_EMPLOYEE_RATE;
  const nonTaxableMinimumEur = inputs.applyNonTaxableMinimum
    ? nonTaxableMinimum(grossMonthlyEur)
    : 0;

  const taxableBaseEur = Math.max(0, grossMonthlyEur - vsaoiEur - nonTaxableMinimumEur);
  const iinEur = progressiveIin(taxableBaseEur);

  const netMonthlyEur = grossMonthlyEur - vsaoiEur - iinEur;

  return { vsaoiEur, nonTaxableMinimumEur, iinEur, netMonthlyEur };
}
