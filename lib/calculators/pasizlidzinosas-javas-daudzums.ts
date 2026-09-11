import { calculateApmetumaDaudzums } from './javas-apmetuma-daudzums';

export interface PasizlidzinosasJavasDaudzumaInput {
  areaM2: number;
  thicknessMm: number;
  consumptionKgPerM2PerMm: number;
  bagSizeKg: number;
  wastePercent: number;
}

export interface PasizlidzinosasJavasDaudzumaResult {
  areaWithWasteM2: number;
  kgNeeded: number;
  bagsNeeded: number;
}

/**
 * Self-leveling compound consumption follows exactly the same area x thickness x rate
 * formula as the apmetums (plaster) mode in javas-apmetuma-daudzums, so this reuses that
 * function directly instead of reimplementing the same arithmetic under a new name.
 */
export function calculatePasizlidzinosasJavasDaudzums(
  input: PasizlidzinosasJavasDaudzumaInput,
): PasizlidzinosasJavasDaudzumaResult {
  const result = calculateApmetumaDaudzums({
    wallAreaM2: input.areaM2,
    thicknessMm: input.thicknessMm,
    consumptionKgPerM2PerMm: input.consumptionKgPerM2PerMm,
    bagSizeKg: input.bagSizeKg,
    wastePercent: input.wastePercent,
  });
  return {
    areaWithWasteM2: result.wallAreaWithWasteM2,
    kgNeeded: result.kgNeeded,
    bagsNeeded: result.bagsNeeded,
  };
}
