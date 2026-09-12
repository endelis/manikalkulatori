export interface SiltinajumaBiezumaInputs {
  /** Maximum permitted U-value for the building element, W/(m²*K), per LBN 002-19. */
  maxUValue: number;
  /** Insulation material's thermal conductivity (lambda), W/(m*K). */
  materialLambda: number;
}

export interface SiltinajumaBiezumaResult {
  requiredThicknessM: number;
  requiredThicknessMm: number;
  requiredThicknessCm: number;
}

export function calculateSiltinajumaBiezums(inputs: SiltinajumaBiezumaInputs): SiltinajumaBiezumaResult {
  const maxUValue = Math.max(0.001, inputs.maxUValue);
  const materialLambda = Math.max(0, inputs.materialLambda);

  const requiredThicknessM = materialLambda / maxUValue;

  return {
    requiredThicknessM,
    requiredThicknessMm: requiredThicknessM * 1000,
    requiredThicknessCm: requiredThicknessM * 100,
  };
}
