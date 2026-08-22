export interface KaskoInputs {
  vehicleValue: number;
  annualPremium: number;
}

export interface KaskoResult {
  monthlyPremium: number;
  premiumPercentOfValue: number;
  threeYearTotal: number;
}

export function calculateKasko(inputs: KaskoInputs): KaskoResult {
  const monthlyPremium = inputs.annualPremium / 12;
  const premiumPercentOfValue = inputs.vehicleValue > 0 ? (inputs.annualPremium / inputs.vehicleValue) * 100 : 0;
  const threeYearTotal = inputs.annualPremium * 3;
  return { monthlyPremium, premiumPercentOfValue, threeYearTotal };
}
