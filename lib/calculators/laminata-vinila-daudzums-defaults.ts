import data from '@/claude/data/lv-laminata-vinila-2026.json';

export type FloorMaterialType = 'laminats' | 'vinils';

export const FLOOR_MATERIALS = data.materials;

export const WASTE_PERCENT_MIN = data.waste.percentMin;
export const WASTE_PERCENT_MAX = data.waste.percentMax;
export const DEFAULT_WASTE_PERCENT = data.waste.percentDefault;

export const DEFAULT_AREA_M2 = 20;
