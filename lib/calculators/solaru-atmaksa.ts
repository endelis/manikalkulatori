export interface SolaruAtmaksasInputs {
  systemCostEur: number;
  systemSizeKwp: number;
  annualGenerationPerKwp: number;
  selfConsumptionPercent: number;
  electricityPricePerKwh: number;
  exportPricePerKwh: number;
}

export interface SolaruAtmaksasResult {
  annualGenerationKwh: number;
  annualSavings: number;
  paybackYears: number;
}

export function calculateSolaruAtmaksas(inputs: SolaruAtmaksasInputs): SolaruAtmaksasResult {
  const annualGenerationKwh = inputs.systemSizeKwp * inputs.annualGenerationPerKwp;
  const selfConsumedKwh = annualGenerationKwh * (inputs.selfConsumptionPercent / 100);
  const exportedKwh = annualGenerationKwh - selfConsumedKwh;
  const annualSavings = selfConsumedKwh * inputs.electricityPricePerKwh + exportedKwh * inputs.exportPricePerKwh;
  const paybackYears = annualSavings > 0 ? inputs.systemCostEur / annualSavings : Infinity;
  return { annualGenerationKwh, annualSavings, paybackYears };
}
