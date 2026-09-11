export interface GrantsSmiltsSkembuApjomaInput {
  areaM2: number;
  depthMm: number;
  compactionPercent: number;
  densityTPerM3: number;
}

export interface GrantsSmiltsSkembuApjomaResult {
  volumeM3: number;
  volumeWithCompactionM3: number;
  massTonnes: number;
}

const MM_PER_M = 1000;
const PERCENT_DIVISOR = 100;

export function calculateGrantsSmiltsSkembuApjoms(
  input: GrantsSmiltsSkembuApjomaInput,
): GrantsSmiltsSkembuApjomaResult {
  const volumeM3 = input.areaM2 * (input.depthMm / MM_PER_M);
  const volumeWithCompactionM3 = volumeM3 * (1 + input.compactionPercent / PERCENT_DIVISOR);
  const massTonnes = volumeWithCompactionM3 * input.densityTPerM3;
  return { volumeM3, volumeWithCompactionM3, massTonnes };
}
