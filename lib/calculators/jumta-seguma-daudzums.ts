export type JumtaMaterials = 'dakstini' | 'metala-loksnes' | 'bitumena-sindeli';

export interface JumtaSegumaInput {
  footprintAreaM2: number;
  pitchDegrees: number;
  wastePercent: number;
  material: JumtaMaterials;
  /** dakstiņi: gab/m², user adjustable within the sourced 8.9 to 12.8 range. */
  tilesPerM2?: number;
  /** metāla loksnes: effective covering width per sheet, meters. */
  sheetEffectiveWidthM?: number;
  /** metāla loksnes: chosen sheet length, meters, up to the sourced 12m maximum. */
  sheetLengthM?: number;
  /** bitumena šindeļi: coverage per package, m², user adjustable within the sourced range. */
  packageCoverageM2?: number;
}

export interface JumtaSegumaResult {
  roofAreaM2: number;
  roofAreaWithWasteM2: number;
  unitsNeeded: number;
}

const DEGREES_PER_HALF_TURN = 180;
const PERCENT_DIVISOR = 100;
// Guards against floating point noise pushing a mathematically whole count (e.g. a
// clean round number input) a hair over its own boundary and rounding up to one more
// unit than actually needed. Far smaller than any real world fraction of a tile, sheet,
// or package, so it never affects a genuinely non integer result.
const CEIL_EPSILON = 1e-9;

function ceilWhole(value: number): number {
  return Math.ceil(value - CEIL_EPSILON);
}

/**
 * jumta_platība = pamatnes_platība ÷ cos(slīpuma_leņķis)
 * A steeper pitch means a longer slope for the same footprint, so the actual covered
 * area is always at least the footprint area.
 */
export function calculateSlopedRoofArea(footprintAreaM2: number, pitchDegrees: number): number {
  const pitchRadians = (pitchDegrees * Math.PI) / DEGREES_PER_HALF_TURN;
  return footprintAreaM2 / Math.cos(pitchRadians);
}

export function calculateJumtaSeguma(input: JumtaSegumaInput): JumtaSegumaResult {
  const roofAreaM2 = calculateSlopedRoofArea(input.footprintAreaM2, input.pitchDegrees);
  const roofAreaWithWasteM2 = roofAreaM2 * (1 + input.wastePercent / PERCENT_DIVISOR);

  let unitsNeeded = 0;
  if (input.material === 'dakstini') {
    unitsNeeded = ceilWhole(roofAreaWithWasteM2 * (input.tilesPerM2 ?? 0));
  } else if (input.material === 'metala-loksnes') {
    const coveragePerSheetM2 = (input.sheetEffectiveWidthM ?? 0) * (input.sheetLengthM ?? 0);
    unitsNeeded = coveragePerSheetM2 > 0 ? ceilWhole(roofAreaWithWasteM2 / coveragePerSheetM2) : 0;
  } else if (input.material === 'bitumena-sindeli') {
    const coverage = input.packageCoverageM2 ?? 0;
    unitsNeeded = coverage > 0 ? ceilWhole(roofAreaWithWasteM2 / coverage) : 0;
  }

  return { roofAreaM2, roofAreaWithWasteM2, unitsNeeded };
}
