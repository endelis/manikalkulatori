export interface NolietojumsInputs {
  purchasePrice: number;
  ageYears: number;
  annualDepreciationRatePercent: number;
}

export interface NolietojumsResult {
  currentValue: number;
  totalDepreciation: number;
  depreciationPercent: number;
}

export function calculateNolietojums(inputs: NolietojumsInputs): NolietojumsResult {
  const currentValue =
    inputs.purchasePrice * Math.pow(1 - inputs.annualDepreciationRatePercent / 100, inputs.ageYears);
  const totalDepreciation = inputs.purchasePrice - currentValue;
  const depreciationPercent = inputs.purchasePrice > 0 ? (totalDepreciation / inputs.purchasePrice) * 100 : 0;
  return { currentValue, totalDepreciation, depreciationPercent };
}
