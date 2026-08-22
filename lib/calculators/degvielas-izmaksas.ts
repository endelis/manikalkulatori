export interface DegvielasIzmaksasInputs {
  annualDistanceKm: number;
  consumptionLPer100km: number;
  fuelPricePerLiter: number;
}

export interface DegvielasIzmaksasResult {
  annualCost: number;
  monthlyCost: number;
  costPer100km: number;
}

export function calculateDegvielasIzmaksas(inputs: DegvielasIzmaksasInputs): DegvielasIzmaksasResult {
  const costPer100km = inputs.consumptionLPer100km * inputs.fuelPricePerLiter;
  const annualCost = (inputs.annualDistanceKm / 100) * costPer100km;
  const monthlyCost = annualCost / 12;
  return { annualCost, monthlyCost, costPer100km };
}
