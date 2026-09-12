export interface LoguPlatibasInputs {
  floorAreaM2: number;
  plannedWindowAreaM2: number;
}

export interface LoguPlatibasResult {
  /** Minimum window glazing area required for this floor area, per LBN 200-21 point 99
   * (window area : floor area >= 1:8, for residential rooms and kitchens). */
  requiredWindowAreaM2: number;
  isCompliant: boolean;
  shortfallM2: number;
}

const MIN_RATIO = 1 / 8;

export function calculateLoguPlatibasAttieciba(inputs: LoguPlatibasInputs): LoguPlatibasResult {
  const floorAreaM2 = Math.max(0, inputs.floorAreaM2);
  const plannedWindowAreaM2 = Math.max(0, inputs.plannedWindowAreaM2);

  const requiredWindowAreaM2 = floorAreaM2 * MIN_RATIO;
  const isCompliant = plannedWindowAreaM2 >= requiredWindowAreaM2;
  const shortfallM2 = Math.max(0, requiredWindowAreaM2 - plannedWindowAreaM2);

  return { requiredWindowAreaM2, isCompliant, shortfallM2 };
}
