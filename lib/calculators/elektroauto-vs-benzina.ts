export interface EvVsIceInput {
  annualDistanceKm: number;
  evConsumptionKwhPer100km: number;
  electricityPricePerKwh: number;
  iceConsumptionLPer100km: number;
  fuelPricePerLiter: number;
  evAnnualExtraCosts?: number;
  iceAnnualExtraCosts?: number;
}

export interface EvVsIceResult {
  evAnnualEnergyCost: number;
  iceAnnualFuelCost: number;
  evAnnualTotalCost: number;
  iceAnnualTotalCost: number;
  annualSavings: number;
  cheaperOption: 'ev' | 'ice' | 'equal';
  fiveYearSavings: number;
}

export function computeEvVsIce(input: EvVsIceInput): EvVsIceResult {
  const evAnnualExtraCosts = input.evAnnualExtraCosts ?? 0;
  const iceAnnualExtraCosts = input.iceAnnualExtraCosts ?? 0;

  const evAnnualEnergyCost =
    (input.annualDistanceKm / 100) * input.evConsumptionKwhPer100km * input.electricityPricePerKwh;
  const iceAnnualFuelCost =
    (input.annualDistanceKm / 100) * input.iceConsumptionLPer100km * input.fuelPricePerLiter;

  const evAnnualTotalCost = evAnnualEnergyCost + evAnnualExtraCosts;
  const iceAnnualTotalCost = iceAnnualFuelCost + iceAnnualExtraCosts;

  const annualSavings = iceAnnualTotalCost - evAnnualTotalCost;

  let cheaperOption: EvVsIceResult['cheaperOption'] = 'equal';
  if (annualSavings > 0.005) cheaperOption = 'ev';
  else if (annualSavings < -0.005) cheaperOption = 'ice';

  return {
    evAnnualEnergyCost,
    iceAnnualFuelCost,
    evAnnualTotalCost,
    iceAnnualTotalCost,
    annualSavings,
    cheaperOption,
    fiveYearSavings: annualSavings * 5,
  };
}
