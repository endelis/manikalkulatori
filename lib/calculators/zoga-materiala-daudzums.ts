export interface ZogaMateriaLaDaudzumaInput {
  fenceLengthM: number;
  postSpacingM: number;
  boardWidthMm: number;
  gapMm: number;
  wastePercent: number;
}

export interface ZogaMateriaLaDaudzumaResult {
  postsNeeded: number;
  boardCoverageM: number;
  fenceLengthWithWasteM: number;
  boardsNeeded: number;
}

const MM_PER_M = 1000;
const PERCENT_DIVISOR = 100;
const CEIL_EPSILON = 1e-9;

function ceilWhole(value: number): number {
  return Math.ceil(value - CEIL_EPSILON);
}

/**
 * A post stands at both ends of a straight run plus every full spacing interval in
 * between, so the count is intervals + 1, not just length / spacing. Board coverage
 * reuses the same "pad the board's own width by the gap to its neighbour" logic as
 * kiegelu-bloku-daudzums and terases-delu-daudzums, guarded on the raw board width
 * rather than the derived coverage value for the same zero-dimension reason as those.
 */
export function calculateZogaMateriaLaDaudzums(input: ZogaMateriaLaDaudzumaInput): ZogaMateriaLaDaudzumaResult {
  const postsNeeded = input.postSpacingM > 0 ? ceilWhole(input.fenceLengthM / input.postSpacingM) + 1 : 0;

  const boardCoverageM = (input.boardWidthMm + input.gapMm) / MM_PER_M;
  const fenceLengthWithWasteM = input.fenceLengthM * (1 + input.wastePercent / PERCENT_DIVISOR);
  const hasRealBoard = input.boardWidthMm > 0;
  const boardsNeeded = hasRealBoard ? ceilWhole(fenceLengthWithWasteM / boardCoverageM) : 0;

  return { postsNeeded, boardCoverageM, fenceLengthWithWasteM, boardsNeeded };
}
