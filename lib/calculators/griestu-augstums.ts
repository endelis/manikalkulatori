export interface GriestuAugstumaInputs {
  ceilingHeightM: number;
}

export interface GriestuAugstumaResult {
  /** Minimum residential room ceiling height per LBN 200-21 point 7.2 (2,5 m). */
  minHeightM: number;
  isCompliant: boolean;
  shortfallM: number;
}

const MIN_HEIGHT_M = 2.5;

export function calculateGriestuAugstums(inputs: GriestuAugstumaInputs): GriestuAugstumaResult {
  const ceilingHeightM = Math.max(0, inputs.ceilingHeightM);

  const isCompliant = ceilingHeightM >= MIN_HEIGHT_M;
  const shortfallM = Math.max(0, MIN_HEIGHT_M - ceilingHeightM);

  return { minHeightM: MIN_HEIGHT_M, isCompliant, shortfallM };
}
