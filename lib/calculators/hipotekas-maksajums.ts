export interface HipotekasMaksajumaInputs {
  principalEur: number;
  annualRatePercent: number;
  termYears: number;
}

export interface HipotekasMaksajumaResult {
  monthlyPaymentEur: number;
  totalCostEur: number;
  totalInterestEur: number;
}

export function calculateHipotekasMaksajums(
  inputs: HipotekasMaksajumaInputs,
): HipotekasMaksajumaResult {
  const principal = Math.max(0, inputs.principalEur);
  const termMonths = Math.max(0, Math.round(inputs.termYears * 12));
  const monthlyRate = Math.max(0, inputs.annualRatePercent) / 100 / 12;

  if (principal <= 0 || termMonths <= 0) {
    return { monthlyPaymentEur: 0, totalCostEur: 0, totalInterestEur: 0 };
  }

  let monthlyPaymentEur: number;
  if (monthlyRate === 0) {
    monthlyPaymentEur = principal / termMonths;
  } else {
    const growth = Math.pow(1 + monthlyRate, termMonths);
    monthlyPaymentEur = (principal * monthlyRate * growth) / (growth - 1);
  }

  const totalCostEur = monthlyPaymentEur * termMonths;
  const totalInterestEur = totalCostEur - principal;

  return { monthlyPaymentEur, totalCostEur, totalInterestEur };
}
