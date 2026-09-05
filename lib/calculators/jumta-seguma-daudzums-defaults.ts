import data from '@/claude/data/lv-jumta-seguma-2026.json';

/**
 * Sourced defaults, see claude/buvmaterialu-daudzuma-defaults-2026.md, calculator 1.
 * Every value here traces to a manufacturer or retailer source, retrieved 2026-09-05.
 */

export const DEFAULT_FOOTPRINT_AREA_M2 = 100;
export const DEFAULT_PITCH_DEGREES = 30;

export const TILES_PER_M2_MIN = data.dakstini.coveragePerM2Min;
export const TILES_PER_M2_MAX = data.dakstini.coveragePerM2Max;
export const DEFAULT_TILES_PER_M2 = data.dakstini.coveragePerM2Default;

export const SHEET_EFFECTIVE_WIDTH_M = data.metalaLoksnes.effectiveWidthM;
export const SHEET_MAX_LENGTH_M = data.metalaLoksnes.maxLengthM;
export const DEFAULT_SHEET_LENGTH_M = data.metalaLoksnes.defaultLengthM;

export const PACKAGE_COVERAGE_M2_MIN = data.bitumenaSindeli.coveragePerPackageM2Min;
export const PACKAGE_COVERAGE_M2_MAX = data.bitumenaSindeli.coveragePerPackageM2Max;
export const DEFAULT_PACKAGE_COVERAGE_M2 = data.bitumenaSindeli.coveragePerPackageM2Default;

export const WASTE_PERCENT_MIN = data.waste.percentMin;
export const WASTE_PERCENT_MAX = data.waste.percentMax;
export const DEFAULT_WASTE_PERCENT = data.waste.percentDefault;

export const RETRIEVED_DATE = data.retrievedDate;
