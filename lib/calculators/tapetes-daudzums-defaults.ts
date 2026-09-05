import data from '@/claude/data/lv-tapetes-2026.json';

/**
 * Sourced defaults, see claude/buvmaterialu-daudzuma-defaults-2026.md, calculator 2.
 * Retrieved 2026-09-05.
 */

export const DEFAULT_WALL_AREA_M2 = 30;
export const DEFAULT_ROLL_WIDTH_M = data.rollSize.widthM;
export const DEFAULT_ROLL_LENGTH_M = data.rollSize.lengthM;
export const EU_TECHNICAL_ROLL_LENGTH_M = data.rollSize.euTechnicalLengthM;

export const WASTE_PERCENT_MIN = data.waste.plain.percentMin;
export const WASTE_PERCENT_MAX = data.waste.plain.percentMax;

export type PatternType = 'nav' | 'mazs' | 'liels-taisns' | 'nobides';

export const PATTERN_WASTE_DEFAULTS: Record<PatternType, number> = {
  nav: data.waste.plain.percentDefault,
  mazs: data.waste.patternSmallRepeat.percentDefault,
  'liels-taisns': data.waste.patternLargeStraightMatch.percentDefault,
  nobides: data.waste.patternDropMatch.percentDefault,
};

export const RETRIEVED_DATE = data.retrievedDate;
