export interface Vo2maxInputs {
  distanceMeters: number;
}

export interface Vo2maxResult {
  vo2max: number;
}

export function calculateVo2max(inputs: Vo2maxInputs): Vo2maxResult {
  const distanceMeters = Math.max(0, inputs.distanceMeters);
  const vo2max = Math.max(0, (distanceMeters - 504.9) / 44.73);
  return { vo2max };
}
