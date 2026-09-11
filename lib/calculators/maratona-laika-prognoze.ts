export interface MaratonaLaikaPrognozesInputs {
  referenceDistanceKm: number;
  referenceHours: number;
  referenceMinutes: number;
  referenceSeconds: number;
  targetDistanceKm: number;
}

export interface MaratonaLaikaPrognozesResult {
  predictedTotalSeconds: number;
  predictedPaceMinPerKm: number;
}

const RIEGEL_EXPONENT = 1.06;

export function calculateMaratonaLaikaPrognoze(
  inputs: MaratonaLaikaPrognozesInputs,
): MaratonaLaikaPrognozesResult {
  const referenceTotalSeconds =
    inputs.referenceHours * 3600 + inputs.referenceMinutes * 60 + inputs.referenceSeconds;

  if (inputs.referenceDistanceKm <= 0 || referenceTotalSeconds <= 0 || inputs.targetDistanceKm <= 0) {
    return { predictedTotalSeconds: 0, predictedPaceMinPerKm: 0 };
  }

  const predictedTotalSeconds =
    referenceTotalSeconds * Math.pow(inputs.targetDistanceKm / inputs.referenceDistanceKm, RIEGEL_EXPONENT);
  const predictedPaceMinPerKm = predictedTotalSeconds / 60 / inputs.targetDistanceKm;

  return { predictedTotalSeconds, predictedPaceMinPerKm };
}
