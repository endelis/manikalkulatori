export interface TapetesDaudzumaInput {
  wallAreaM2: number;
  rollWidthM: number;
  rollLengthM: number;
  wastePercent: number;
}

export interface TapetesDaudzumaResult {
  rollAreaM2: number;
  wallAreaWithWasteM2: number;
  rollsNeeded: number;
}

const PERCENT_DIVISOR = 100;
const CEIL_EPSILON = 1e-9;

function ceilWhole(value: number): number {
  return Math.ceil(value - CEIL_EPSILON);
}

export function calculateTapetesDaudzums(input: TapetesDaudzumaInput): TapetesDaudzumaResult {
  const rollAreaM2 = input.rollWidthM * input.rollLengthM;
  const wallAreaWithWasteM2 = input.wallAreaM2 * (1 + input.wastePercent / PERCENT_DIVISOR);
  const rollsNeeded = rollAreaM2 > 0 ? ceilWhole(wallAreaWithWasteM2 / rollAreaM2) : 0;
  return { rollAreaM2, wallAreaWithWasteM2, rollsNeeded };
}
