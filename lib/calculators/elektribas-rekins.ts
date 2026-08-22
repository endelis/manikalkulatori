export interface ElektribasRekinaInputs {
  monthlyConsumptionKwh: number;
  pricePerKwh: number;
  fixedMonthlyFee: number;
}

export interface ElektribasRekinaResult {
  variableCost: number;
  totalMonthlyCost: number;
  annualCost: number;
}

export function calculateElektribasRekins(inputs: ElektribasRekinaInputs): ElektribasRekinaResult {
  const variableCost = inputs.monthlyConsumptionKwh * inputs.pricePerKwh;
  const totalMonthlyCost = variableCost + inputs.fixedMonthlyFee;
  const annualCost = totalMonthlyCost * 12;
  return { variableCost, totalMonthlyCost, annualCost };
}
