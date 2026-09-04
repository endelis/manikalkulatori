export interface CelaIzmaksasInputs {
  distanceKm: number;
  consumptionLPer100km: number;
  fuelPricePerLiter: number;
  peopleCount: number;
}

export interface CelaIzmaksasResult {
  tripCost: number;
  costPerPerson: number;
}

export function calculateCelaIzmaksas(inputs: CelaIzmaksasInputs): CelaIzmaksasResult {
  const tripCost = (inputs.distanceKm / 100) * inputs.consumptionLPer100km * inputs.fuelPricePerLiter;
  const costPerPerson = inputs.peopleCount > 0 ? tripCost / inputs.peopleCount : tripCost;
  return { tripCost, costPerPerson };
}
