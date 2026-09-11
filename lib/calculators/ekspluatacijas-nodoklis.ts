export interface EkspluatacijasNodoklaInputs {
  co2GramsPerKm: number;
  engineOver3500cm3: boolean;
  gasEquipped: boolean;
}

export interface EkspluatacijasNodoklaResult {
  baseRateEur: number;
  surchargeEur: number;
  totalEur: number;
}

const CO2_BANDS: { maxCo2: number; rateEur: number }[] = [
  { maxCo2: 50, rateEur: 0 },
  { maxCo2: 95, rateEur: 12 },
  { maxCo2: 115, rateEur: 39 },
  { maxCo2: 130, rateEur: 72 },
  { maxCo2: 155, rateEur: 99 },
  { maxCo2: 175, rateEur: 126 },
  { maxCo2: 200, rateEur: 147 },
  { maxCo2: 225, rateEur: 186 },
  { maxCo2: 250, rateEur: 225 },
  { maxCo2: 275, rateEur: 285 },
  { maxCo2: 300, rateEur: 351 },
  { maxCo2: 350, rateEur: 471 },
  { maxCo2: 400, rateEur: 642 },
  { maxCo2: Infinity, rateEur: 834 },
];

const ENGINE_SURCHARGE_EUR = 330;
const GAS_EQUIPPED_RATE = 0.9;

export function calculateEkspluatacijasNodoklis(
  inputs: EkspluatacijasNodoklaInputs,
): EkspluatacijasNodoklaResult {
  const co2 = Math.max(0, inputs.co2GramsPerKm);
  const band = CO2_BANDS.find((b) => co2 <= b.maxCo2) ?? CO2_BANDS[CO2_BANDS.length - 1];

  const baseRateEur = band.rateEur;
  const surchargeEur = inputs.engineOver3500cm3 ? ENGINE_SURCHARGE_EUR : 0;
  const subtotal = baseRateEur + surchargeEur;
  const totalEur = inputs.gasEquipped ? subtotal * GAS_EQUIPPED_RATE : subtotal;

  return { baseRateEur, surchargeEur, totalEur };
}
