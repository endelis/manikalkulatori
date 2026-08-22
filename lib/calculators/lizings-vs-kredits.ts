export interface LizingsVsKreditsInputs {
  vehiclePrice: number;
  downPayment: number;
  termMonths: number;
  loanAnnualRatePercent: number;
  leaseAnnualRatePercent: number;
  residualValuePercent: number;
}

export interface LizingsVsKreditsResult {
  loanMonthlyPayment: number;
  loanTotalCost: number;
  leaseMonthlyPayment: number;
  leaseTotalCost: number;
  cheaperOption: 'loan' | 'lease' | 'equal';
  monthlySavings: number;
}

function calculateLoanMonthlyPayment(principal: number, annualRatePercent: number, termMonths: number): number {
  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate === 0) {
    return principal / termMonths;
  }
  const factor = Math.pow(1 + monthlyRate, termMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export function calculateLizingsVsKredits(inputs: LizingsVsKreditsInputs): LizingsVsKreditsResult {
  const principal = inputs.vehiclePrice - inputs.downPayment;
  const residualValue = inputs.vehiclePrice * (inputs.residualValuePercent / 100);
  const capCost = inputs.vehiclePrice - inputs.downPayment;

  const loanMonthlyPayment = calculateLoanMonthlyPayment(principal, inputs.loanAnnualRatePercent, inputs.termMonths);
  const loanTotalCost = inputs.downPayment + loanMonthlyPayment * inputs.termMonths;

  const depreciationPortion = (capCost - residualValue) / inputs.termMonths;
  const financePortion = ((capCost + residualValue) * (inputs.leaseAnnualRatePercent / 100)) / 24;
  const leaseMonthlyPayment = depreciationPortion + financePortion;
  const leaseTotalCost = inputs.downPayment + leaseMonthlyPayment * inputs.termMonths;

  const monthlyDifference = loanMonthlyPayment - leaseMonthlyPayment;
  const cheaperOption: LizingsVsKreditsResult['cheaperOption'] =
    monthlyDifference > 0.005 ? 'lease' : monthlyDifference < -0.005 ? 'loan' : 'equal';

  return {
    loanMonthlyPayment,
    loanTotalCost,
    leaseMonthlyPayment,
    leaseTotalCost,
    cheaperOption,
    monthlySavings: Math.abs(monthlyDifference),
  };
}
