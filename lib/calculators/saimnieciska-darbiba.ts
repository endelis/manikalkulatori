import { progressiveIin } from './alga-neto';

export interface SaimnieciskasDarbibasInputs {
  monthlyTaxableIncomeEur: number;
}

export interface SaimnieciskasDarbibasResult {
  vsaoiEur: number;
  iinEur: number;
  netMonthlyEur: number;
}

const MINIMUM_WAGE_EUR = 780;
const VSAOI_RATE_UP_TO_MIN_WAGE = 0.3107;
const VSAOI_RATE_ABOVE_MIN_WAGE = 0.1;

function selfEmployedVsaoi(monthlyTaxableIncomeEur: number): number {
  if (monthlyTaxableIncomeEur < MINIMUM_WAGE_EUR) {
    return monthlyTaxableIncomeEur * VSAOI_RATE_ABOVE_MIN_WAGE;
  }

  const baseVsaoi = MINIMUM_WAGE_EUR * VSAOI_RATE_UP_TO_MIN_WAGE;
  const excessVsaoi = (monthlyTaxableIncomeEur - MINIMUM_WAGE_EUR) * VSAOI_RATE_ABOVE_MIN_WAGE;
  return baseVsaoi + excessVsaoi;
}

export function calculateSaimnieciskaDarbiba(
  inputs: SaimnieciskasDarbibasInputs,
): SaimnieciskasDarbibasResult {
  const monthlyTaxableIncomeEur = Math.max(0, inputs.monthlyTaxableIncomeEur);

  const vsaoiEur = selfEmployedVsaoi(monthlyTaxableIncomeEur);
  const iinBaseEur = Math.max(0, monthlyTaxableIncomeEur - vsaoiEur);
  const iinEur = progressiveIin(iinBaseEur);

  const netMonthlyEur = monthlyTaxableIncomeEur - vsaoiEur - iinEur;

  return { vsaoiEur, iinEur, netMonthlyEur };
}
