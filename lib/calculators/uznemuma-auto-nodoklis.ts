export type UznemumaAutoVehicleType = 'electric' | 'plugInHybrid' | 'other';

export interface UznemumaAutoNodoklaInputs {
  vehicleType: UznemumaAutoVehicleType;
  firstRegisteredAfter2009: boolean;
  enginePowerKw: number;
}

export interface UznemumaAutoNodoklaResult {
  monthlyRateEur: number;
  annualRateEur: number;
}

const FLAT_RATE_FOR_OTHER_VEHICLES = 60;
const FLAT_RATE_UP_TO_110_KW = 33;

function ratePerKwBand(enginePowerKw: number): number {
  if (enginePowerKw <= 110) return FLAT_RATE_UP_TO_110_KW;
  if (enginePowerKw <= 130) return enginePowerKw * 0.3;
  if (enginePowerKw <= 150) return enginePowerKw * 0.35;
  if (enginePowerKw <= 200) return enginePowerKw * 0.5;
  return enginePowerKw * 0.7;
}

export function calculateUznemumaAutoNodoklis(
  inputs: UznemumaAutoNodoklaInputs,
): UznemumaAutoNodoklaResult {
  let monthlyRateEur: number;

  if (inputs.vehicleType === 'electric') {
    monthlyRateEur = 15;
  } else if (inputs.vehicleType === 'plugInHybrid') {
    monthlyRateEur = 25;
  } else if (inputs.firstRegisteredAfter2009) {
    monthlyRateEur = ratePerKwBand(Math.max(0, inputs.enginePowerKw));
  } else {
    monthlyRateEur = FLAT_RATE_FOR_OTHER_VEHICLES;
  }

  return { monthlyRateEur, annualRateEur: monthlyRateEur * 12 };
}
