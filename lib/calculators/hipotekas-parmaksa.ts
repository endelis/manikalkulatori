export interface HipotekasParmaksasInputs {
  principalEur: number;
  annualRatePercent: number;
  termYears: number;
  extraMonthlyPaymentEur: number;
}

export interface HipotekasParmaksasResult {
  baseMonthlyPaymentEur: number;
  newPayoffMonths: number;
  interestSavedEur: number;
  monthsSaved: number;
}

function annuityPayment(principal: number, monthlyRate: number, termMonths: number): number {
  if (monthlyRate === 0) return principal / termMonths;
  const growth = Math.pow(1 + monthlyRate, termMonths);
  return (principal * monthlyRate * growth) / (growth - 1);
}

export function calculateHipotekasParmaksa(
  inputs: HipotekasParmaksasInputs,
): HipotekasParmaksasResult {
  const principal = Math.max(0, inputs.principalEur);
  const termMonths = Math.max(0, Math.round(inputs.termYears * 12));
  const monthlyRate = Math.max(0, inputs.annualRatePercent) / 100 / 12;
  const extraPayment = Math.max(0, inputs.extraMonthlyPaymentEur);

  if (principal <= 0 || termMonths <= 0) {
    return { baseMonthlyPaymentEur: 0, newPayoffMonths: 0, interestSavedEur: 0, monthsSaved: 0 };
  }

  const baseMonthlyPaymentEur = annuityPayment(principal, monthlyRate, termMonths);
  const baseTotalInterest = baseMonthlyPaymentEur * termMonths - principal;

  const newPayment = baseMonthlyPaymentEur + extraPayment;

  let newPayoffMonths: number;
  if (monthlyRate === 0) {
    newPayoffMonths = principal / newPayment;
  } else if (newPayment <= principal * monthlyRate) {
    // Payment never covers interest; loan is never paid off.
    return {
      baseMonthlyPaymentEur,
      newPayoffMonths: termMonths,
      interestSavedEur: 0,
      monthsSaved: 0,
    };
  } else {
    newPayoffMonths =
      -Math.log(1 - (monthlyRate * principal) / newPayment) / Math.log(1 + monthlyRate);
  }

  const newTotalInterest = newPayment * newPayoffMonths - principal;
  const interestSavedEur = Math.max(0, baseTotalInterest - newTotalInterest);
  const monthsSaved = Math.max(0, termMonths - newPayoffMonths);

  return { baseMonthlyPaymentEur, newPayoffMonths, interestSavedEur, monthsSaved };
}
