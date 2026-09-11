export interface TerasesDeluDaudzumaInput {
  deckAreaM2: number;
  boardWidthMm: number;
  boardLengthMm: number;
  gapMm: number;
  wastePercent: number;
}

export interface TerasesDeluDaudzumaResult {
  boardCoverageM2: number;
  deckAreaWithWasteM2: number;
  boardsNeeded: number;
}

const MM_PER_M = 1000;
const PERCENT_DIVISOR = 100;
const CEIL_EPSILON = 1e-9;

function ceilWhole(value: number): number {
  return Math.ceil(value - CEIL_EPSILON);
}

/**
 * A board "occupies" its own width plus the gap on one side shared with its neighbour,
 * so the effective coverage width is boardWidth + gap, the same logic as a masonry
 * joint in kiegelu-bloku-daudzums. Board length is used as-is (no gap along the length
 * direction, only at the ends, which this simple area based model does not track).
 */
export function calculateTerasesDeluDaudzums(input: TerasesDeluDaudzumaInput): TerasesDeluDaudzumaResult {
  const boardCoverageM2 = (input.boardLengthMm / MM_PER_M) * ((input.boardWidthMm + input.gapMm) / MM_PER_M);
  const deckAreaWithWasteM2 = input.deckAreaM2 * (1 + input.wastePercent / PERCENT_DIVISOR);
  const hasRealBoard = input.boardWidthMm > 0 && input.boardLengthMm > 0;
  const boardsNeeded = hasRealBoard ? ceilWhole(deckAreaWithWasteM2 / boardCoverageM2) : 0;
  return { boardCoverageM2, deckAreaWithWasteM2, boardsNeeded };
}
