import { calculateKiegeluBlokuDaudzums } from './kiegelu-bloku-daudzums';

export interface ApmetumaInput {
  wallAreaM2: number;
  thicknessMm: number;
  consumptionKgPerM2PerMm: number;
  bagSizeKg: number;
  wastePercent: number;
}

export interface ApmetumaResult {
  wallAreaWithWasteM2: number;
  kgNeeded: number;
  bagsNeeded: number;
}

export interface JavasDaudzumaInput {
  wallAreaM2: number;
  unitLengthMm: number;
  unitWidthMm: number;
  unitHeightMm: number;
  jointThicknessMm: number;
  yieldKgPerLiter: number;
  bagSizeKg: number;
  wastePercent: number;
}

export interface JavasDaudzumaResult {
  unitsNeeded: number;
  mortarVolumeLiters: number;
  kgNeeded: number;
  bagsNeeded: number;
}

const MM_PER_M = 1000;
const PERCENT_DIVISOR = 100;
const LITERS_PER_M3 = 1000;
const CEIL_EPSILON = 1e-9;

function ceilWhole(value: number): number {
  return Math.ceil(value - CEIL_EPSILON);
}

export function calculateApmetumaDaudzums(input: ApmetumaInput): ApmetumaResult {
  const wallAreaWithWasteM2 = input.wallAreaM2 * (1 + input.wastePercent / PERCENT_DIVISOR);
  const kgNeeded = wallAreaWithWasteM2 * input.thicknessMm * input.consumptionKgPerM2PerMm;
  const bagsNeeded = input.bagSizeKg > 0 ? ceilWhole(kgNeeded / input.bagSizeKg) : 0;
  return { wallAreaWithWasteM2, kgNeeded, bagsNeeded };
}

/**
 * Mortar volume is derived geometrically (wall volume minus the solid volume of the
 * units themselves) rather than from a per-m3-of-masonry manufacturer average: those
 * averages vary too widely by unit type and void ratio to be a defensible single
 * number, while the wall-minus-units difference only assumes solid (non perforated)
 * units, a standard simplification in this kind of estimate. Reuses the same
 * unit count formula as kiegelu-bloku-daudzums so the two calculators agree.
 *
 * The unit count and wall area used in that geometric subtraction are computed with
 * wastePercent 0: mortar fills the joints of the wall as actually built, not the
 * spare units bought in case of breakage, so kiegelu-bloku-daudzums's own waste
 * padding (a masonry-purchasing concept) must not leak into this calculation. This
 * calculator's own wastePercent (mortar lost to spillage while mixing and applying)
 * is instead applied once, directly to the resulting mortar volume.
 */
export function calculateJavasDaudzums(input: JavasDaudzumaInput): JavasDaudzumaResult {
  const hasRealUnit = input.unitLengthMm > 0 && input.unitWidthMm > 0 && input.unitHeightMm > 0;
  if (!hasRealUnit) {
    return { unitsNeeded: 0, mortarVolumeLiters: 0, kgNeeded: 0, bagsNeeded: 0 };
  }

  const { unitsNeeded } = calculateKiegeluBlokuDaudzums({
    wallAreaM2: input.wallAreaM2,
    unitLengthMm: input.unitLengthMm,
    unitHeightMm: input.unitHeightMm,
    jointThicknessMm: input.jointThicknessMm,
    wastePercent: 0,
  });

  const wallVolumeM3 = input.wallAreaM2 * (input.unitWidthMm / MM_PER_M);
  const solidUnitVolumeM3 =
    unitsNeeded *
    (input.unitLengthMm / MM_PER_M) *
    (input.unitWidthMm / MM_PER_M) *
    (input.unitHeightMm / MM_PER_M);
  const mortarVolumeM3 = Math.max(wallVolumeM3 - solidUnitVolumeM3, 0);
  const mortarVolumeLiters = mortarVolumeM3 * LITERS_PER_M3 * (1 + input.wastePercent / PERCENT_DIVISOR);
  const kgNeeded = mortarVolumeLiters * input.yieldKgPerLiter;
  const bagsNeeded = input.bagSizeKg > 0 ? ceilWhole(kgNeeded / input.bagSizeKg) : 0;

  return { unitsNeeded, mortarVolumeLiters, kgNeeded, bagsNeeded };
}
