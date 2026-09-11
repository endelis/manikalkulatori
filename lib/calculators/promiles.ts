export type PromilesDzimums = 'male' | 'female';

export interface PromilesInputs {
  sex: PromilesDzimums;
  weightKg: number;
  volumeMl: number;
  abvPercent: number;
  hoursElapsed: number;
}

export interface PromilesResult {
  bloodAlcoholPermille: number;
}

const ETHANOL_DENSITY_G_PER_ML = 0.789;
const WIDMARK_FACTOR: Record<PromilesDzimums, number> = {
  male: 0.68,
  female: 0.55,
};
const ELIMINATION_RATE_PER_HOUR = 0.15;

export function calculatePromiles(inputs: PromilesInputs): PromilesResult {
  const weightKg = Math.max(0, inputs.weightKg);
  const volumeMl = Math.max(0, inputs.volumeMl);
  const abvPercent = Math.max(0, inputs.abvPercent);
  const hoursElapsed = Math.max(0, inputs.hoursElapsed);

  if (weightKg <= 0) {
    return { bloodAlcoholPermille: 0 };
  }

  const alcoholGrams = volumeMl * (abvPercent / 100) * ETHANOL_DENSITY_G_PER_ML;
  const r = WIDMARK_FACTOR[inputs.sex];

  const rawPermille = alcoholGrams / (weightKg * r) - ELIMINATION_RATE_PER_HOUR * hoursElapsed;

  return { bloodAlcoholPermille: Math.max(0, rawPermille) };
}
