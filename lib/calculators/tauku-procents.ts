export type TaukuProcentaDzimums = 'male' | 'female';

export interface TaukuProcentaInputs {
  sex: TaukuProcentaDzimums;
  heightCm: number;
  neckCm: number;
  waistCm: number;
  hipCm: number;
}

export interface TaukuProcentaResult {
  bodyFatPercent: number;
}

function log10(value: number): number {
  return Math.log(value) / Math.LN10;
}

export function calculateTaukuProcents(inputs: TaukuProcentaInputs): TaukuProcentaResult {
  const heightCm = Math.max(1, inputs.heightCm);
  const neckCm = Math.max(1, inputs.neckCm);
  const waistCm = Math.max(1, inputs.waistCm);
  const hipCm = Math.max(1, inputs.hipCm);

  let bodyFatPercent: number;

  if (inputs.sex === 'male') {
    const waistMinusNeck = waistCm - neckCm;
    if (waistMinusNeck <= 0) {
      return { bodyFatPercent: 0 };
    }
    bodyFatPercent =
      495 / (1.0324 - 0.19077 * log10(waistMinusNeck) + 0.15456 * log10(heightCm)) - 450;
  } else {
    const combined = waistCm + hipCm - neckCm;
    if (combined <= 0) {
      return { bodyFatPercent: 0 };
    }
    bodyFatPercent =
      495 / (1.29579 - 0.35004 * log10(combined) + 0.221 * log10(heightCm)) - 450;
  }

  return { bodyFatPercent: Math.max(0, bodyFatPercent) };
}
