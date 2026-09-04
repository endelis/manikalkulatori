export interface EkiiInputs {
  vehiclePriceExclVat: number;
  isUsed: boolean;
  isPhev: boolean;
  hasFamilyCard: boolean;
  seatCount: number;
  childrenCount: number;
}

export type EkiiIneligibleReason = 'price-too-high' | 'price-too-low' | 'phev-used-not-eligible';

export interface EkiiResult {
  eligible: boolean;
  ineligibleReason: EkiiIneligibleReason | null;
  priceCapExclVat: number;
  grantAmount: number;
  netPriceExclVat: number;
}

const PRICE_CAP_STANDARD = 45000;
const PRICE_CAP_LARGE_SEATS = 60000;
const MIN_USED_PRICE = 8750;

export function calculateEkiiAtbalsts(inputs: EkiiInputs): EkiiResult {
  const priceCapExclVat = inputs.seatCount >= 6 ? PRICE_CAP_LARGE_SEATS : PRICE_CAP_STANDARD;

  if (inputs.isUsed && inputs.isPhev) {
    return {
      eligible: false,
      ineligibleReason: 'phev-used-not-eligible',
      priceCapExclVat,
      grantAmount: 0,
      netPriceExclVat: inputs.vehiclePriceExclVat,
    };
  }

  if (inputs.vehiclePriceExclVat > priceCapExclVat) {
    return {
      eligible: false,
      ineligibleReason: 'price-too-high',
      priceCapExclVat,
      grantAmount: 0,
      netPriceExclVat: inputs.vehiclePriceExclVat,
    };
  }

  if (inputs.isUsed && inputs.vehiclePriceExclVat < MIN_USED_PRICE) {
    return {
      eligible: false,
      ineligibleReason: 'price-too-low',
      priceCapExclVat,
      grantAmount: 0,
      netPriceExclVat: inputs.vehiclePriceExclVat,
    };
  }

  let grantAmount: number;
  if (!inputs.hasFamilyCard || inputs.seatCount < 5) {
    grantAmount = inputs.isUsed ? 3000 : 4000;
  } else if (inputs.seatCount >= 7) {
    grantAmount = inputs.isUsed ? 6750 : 9000;
  } else {
    grantAmount = inputs.isUsed ? 5000 : 6750;
  }

  if (inputs.hasFamilyCard && inputs.seatCount >= 5 && inputs.childrenCount >= 4) {
    grantAmount += (inputs.childrenCount - 3) * 1000;
  }

  const netPriceExclVat = Math.max(inputs.vehiclePriceExclVat - grantAmount, 0);

  return { eligible: true, ineligibleReason: null, priceCapExclVat, grantAmount, netPriceExclVat };
}
