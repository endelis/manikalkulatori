export interface InflacijasInputs {
  amountEur: number;
  annualInflationPercent: number;
  years: number;
}

export interface InflacijasResult {
  futurePurchasingPowerEur: number;
  purchasingPowerLostEur: number;
}

export function calculateInflacija(inputs: InflacijasInputs): InflacijasResult {
  const amount = Math.max(0, inputs.amountEur);
  const rate = Math.max(0, inputs.annualInflationPercent) / 100;
  const years = Math.max(0, inputs.years);

  const futurePurchasingPowerEur = amount / Math.pow(1 + rate, years);
  const purchasingPowerLostEur = amount - futurePurchasingPowerEur;

  return { futurePurchasingPowerEur, purchasingPowerLostEur };
}
