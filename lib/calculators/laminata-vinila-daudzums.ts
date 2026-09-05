export interface LaminataVinilaDaudzumaInput {
  areaM2: number;
  packCoverageM2: number;
  wastePercent: number;
}

export interface LaminataVinilaDaudzumaResult {
  areaWithWasteM2: number;
  packsNeeded: number;
}

const PERCENT_DIVISOR = 100;
const CEIL_EPSILON = 1e-9;

function ceilWhole(value: number): number {
  return Math.ceil(value - CEIL_EPSILON);
}

export function calculateLaminataVinilaDaudzums(input: LaminataVinilaDaudzumaInput): LaminataVinilaDaudzumaResult {
  const areaWithWasteM2 = input.areaM2 * (1 + input.wastePercent / PERCENT_DIVISOR);
  const packsNeeded = input.packCoverageM2 > 0 ? ceilWhole(areaWithWasteM2 / input.packCoverageM2) : 0;
  return { areaWithWasteM2, packsNeeded };
}
