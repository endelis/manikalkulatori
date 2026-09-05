export interface GipskartonaLoksnuDaudzumaInput {
  wallAreaM2: number;
  sheetWidthMm: number;
  sheetLengthMm: number;
  wastePercent: number;
}

export interface GipskartonaLoksnuDaudzumaResult {
  sheetAreaM2: number;
  wallAreaWithWasteM2: number;
  sheetsNeeded: number;
}

const MM_PER_M = 1000;
const PERCENT_DIVISOR = 100;
const CEIL_EPSILON = 1e-9;

function ceilWhole(value: number): number {
  return Math.ceil(value - CEIL_EPSILON);
}

export function calculateGipskartonaLoksnuDaudzums(
  input: GipskartonaLoksnuDaudzumaInput,
): GipskartonaLoksnuDaudzumaResult {
  const sheetAreaM2 = (input.sheetWidthMm / MM_PER_M) * (input.sheetLengthMm / MM_PER_M);
  const wallAreaWithWasteM2 = input.wallAreaM2 * (1 + input.wastePercent / PERCENT_DIVISOR);
  const sheetsNeeded = sheetAreaM2 > 0 ? ceilWhole(wallAreaWithWasteM2 / sheetAreaM2) : 0;
  return { sheetAreaM2, wallAreaWithWasteM2, sheetsNeeded };
}
