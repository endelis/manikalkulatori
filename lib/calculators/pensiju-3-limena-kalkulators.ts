export interface Pensiju3LimenaInputs {
  monthlyContributionEur: number;
  annualReturnPercent: number;
  years: number;
  annualGrossIncomeEur: number;
}

export interface Pensiju3LimenaResult {
  futureValueEur: number;
  totalContributedEur: number;
  totalGrowthEur: number;
  /** Annual contribution eligible for the IIN refund: min(annual contribution,
   * min(10% of annual gross income, 4000 EUR)) per Cabinet Regulation implementing
   * "Par iedzīvotāju ienākuma nodokli" Article 10 para 1.9, point 65.2. */
  annualEligibleForRefundEur: number;
  annualTaxRefundEur: number;
  totalTaxRefundEur: number;
}

const IIN_RATE = 0.255;
const REFUND_CAP_PERCENT_OF_INCOME = 0.1;
const REFUND_CAP_ABSOLUTE_EUR = 4000;

export function calculatePensiju3Limena(inputs: Pensiju3LimenaInputs): Pensiju3LimenaResult {
  const monthly = Math.max(0, inputs.monthlyContributionEur);
  const years = Math.max(0, inputs.years);
  const months = Math.round(years * 12);
  const monthlyRate = Math.max(0, inputs.annualReturnPercent) / 100 / 12;
  const annualGrossIncome = Math.max(0, inputs.annualGrossIncomeEur);

  const totalContributedEur = monthly * months;

  let futureValueEur: number;
  if (months <= 0) {
    futureValueEur = 0;
  } else if (monthlyRate === 0) {
    futureValueEur = totalContributedEur;
  } else {
    const growth = Math.pow(1 + monthlyRate, months);
    futureValueEur = monthly * ((growth - 1) / monthlyRate);
  }

  const annualContributionEur = monthly * 12;
  const refundCapEur = Math.min(annualGrossIncome * REFUND_CAP_PERCENT_OF_INCOME, REFUND_CAP_ABSOLUTE_EUR);
  const annualEligibleForRefundEur = Math.min(annualContributionEur, Math.max(0, refundCapEur));
  const annualTaxRefundEur = annualEligibleForRefundEur * IIN_RATE;
  const totalTaxRefundEur = annualTaxRefundEur * years;

  return {
    futureValueEur,
    totalContributedEur,
    totalGrowthEur: futureValueEur - totalContributedEur,
    annualEligibleForRefundEur,
    annualTaxRefundEur,
    totalTaxRefundEur,
  };
}
