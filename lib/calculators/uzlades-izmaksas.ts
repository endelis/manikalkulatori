export interface UzladesIzmaksasInputs {
  annualDistanceKm: number;
  consumptionKwhPer100km: number;
  homePricePerKwh: number;
  publicPricePerKwh: number;
  homeChargingPercent: number;
}

export interface UzladesIzmaksasResult {
  totalKwh: number;
  homeCost: number;
  publicCost: number;
  totalCost: number;
  allHomeCost: number;
  extraCostVsAllHome: number;
}

export function calculateUzladesIzmaksas(inputs: UzladesIzmaksasInputs): UzladesIzmaksasResult {
  const totalKwh = (inputs.annualDistanceKm / 100) * inputs.consumptionKwhPer100km;
  const homeKwh = totalKwh * (inputs.homeChargingPercent / 100);
  const publicKwh = totalKwh * (1 - inputs.homeChargingPercent / 100);
  const homeCost = homeKwh * inputs.homePricePerKwh;
  const publicCost = publicKwh * inputs.publicPricePerKwh;
  const totalCost = homeCost + publicCost;
  const allHomeCost = totalKwh * inputs.homePricePerKwh;
  const extraCostVsAllHome = totalCost - allHomeCost;
  return { totalKwh, homeCost, publicCost, totalCost, allHomeCost, extraCostVsAllHome };
}
