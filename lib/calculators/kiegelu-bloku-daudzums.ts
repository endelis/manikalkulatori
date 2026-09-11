export interface KiegeluBlokuDaudzumaInput {
  wallAreaM2: number;
  unitLengthMm: number;
  unitHeightMm: number;
  jointThicknessMm: number;
  wastePercent: number;
}

export interface KiegeluBlokuDaudzumaResult {
  effectiveUnitAreaM2: number;
  wallAreaWithWasteM2: number;
  unitsNeeded: number;
}

const MM_PER_M = 1000;
const PERCENT_DIVISOR = 100;
const CEIL_EPSILON = 1e-9;

function ceilWhole(value: number): number {
  return Math.ceil(value - CEIL_EPSILON);
}

/**
 * Each unit "occupies" its own footprint plus half the joint on each of the two sides
 * it shares with a neighbour, which is the same as saying the unit's length and height
 * each grow by one full joint thickness. Wall thickness (the unit's third dimension)
 * does not affect how many units are needed per m² of wall face, so it is not an input.
 */
export function calculateKiegeluBlokuDaudzums(input: KiegeluBlokuDaudzumaInput): KiegeluBlokuDaudzumaResult {
  const effectiveUnitAreaM2 =
    ((input.unitLengthMm + input.jointThicknessMm) / MM_PER_M) *
    ((input.unitHeightMm + input.jointThicknessMm) / MM_PER_M);
  const wallAreaWithWasteM2 = input.wallAreaM2 * (1 + input.wastePercent / PERCENT_DIVISOR);
  // Guard on the unit's own dimensions, not on effectiveUnitAreaM2: a joint thickness
  // alone still contributes a nonzero padded area even when the unit itself is 0 by 0,
  // so checking the computed area would miss this case and silently divide the wall
  // area by joint thickness squared instead of returning 0.
  const hasRealUnit = input.unitLengthMm > 0 && input.unitHeightMm > 0;
  const unitsNeeded = hasRealUnit ? ceilWhole(wallAreaWithWasteM2 / effectiveUnitAreaM2) : 0;
  return { effectiveUnitAreaM2, wallAreaWithWasteM2, unitsNeeded };
}
