import data from '@/claude/data/lv-terases-delu-2026.json';

export type TerasesMaterialType = 'kompozits' | 'koks';

export const TERASES_MATERIALS = data.materials;

export const GAP_MM_MIN = data.gap.mmMin;
export const GAP_MM_MAX = data.gap.mmMax;
export const DEFAULT_GAP_MM = data.gap.mmDefault;

export const WASTE_PERCENT_MIN = data.waste.percentMin;
export const WASTE_PERCENT_MAX = data.waste.percentMax;
export const DEFAULT_WASTE_PERCENT = data.waste.percentDefault;

export const DEFAULT_DECK_AREA_M2 = 15;
