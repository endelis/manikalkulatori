export interface KreditaKalkulatoraInputs {
  principalEur: number;
  annualRatePercent: number;
  termMonths: number;
}

export interface KreditaKalkulatoraResult {
  monthlyPaymentEur: number;
  totalCostEur: number;
  totalInterestEur: number;
}

export function calculateKreditaKalkulators(
  inputs: KreditaKalkulatoraInputs,
): KreditaKalkulatoraResult {
  const principal = Math.max(0, inputs.principalEur);
  const termMonths = Math.max(0, Math.round(inputs.termMonths));
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
