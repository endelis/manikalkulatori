export interface SiltumsuknaAtmaksasInputs {
  heatPumpCostEur: number;
  annualHeatingNeedKwh: number;
  heatPumpCop: number;
  oldHeatingPricePerKwh: number;
  electricityPricePerKwh: number;
}

export interface SiltumsuknaAtmaksasResult {
  heatPumpElectricityKwh: number;
  heatPumpAnnualCost: number;
  oldAnnualCost: number;
  annualSavings: number;
  paybackYears: number;
}

export function calculateSiltumsuknaAtmaksas(inputs: SiltumsuknaAtmaksasInputs): SiltumsuknaAtmaksasResult {
  const heatPumpElectricityKwh = inputs.annualHeatingNeedKwh / inputs.heatPumpCop;
  const heatPumpAnnualCost = heatPumpElectricityKwh * inputs.electricityPricePerKwh;
  const oldAnnualCost = inputs.annualHeatingNeedKwh * inputs.oldHeatingPricePerKwh;
  const annualSavings = oldAnnualCost - heatPumpAnnualCost;
  const paybackYears = annualSavings > 0 ? inputs.heatPumpCostEur / annualSavings : Infinity;
  return { heatPumpElectricityKwh, heatPumpAnnualCost, oldAnnualCost, annualSavings, paybackYears };
}
