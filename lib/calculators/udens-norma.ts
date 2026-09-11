export interface UdensNormasInputs {
  weightKg: number;
}

export interface UdensNormasResult {
  waterLiters: number;
}

const ML_PER_KG = 33;

export function calculateUdensNorma(inputs: UdensNormasInputs): UdensNormasResult {
  const weightKg = Math.max(0, inputs.weightKg);
  const waterLiters = (weightKg * ML_PER_KG) / 1000;

  return { waterLiters };
}
