import data from '@/claude/data/lv-pasizlidzinosas-javas-2026.json';

export type ProductIndex = 0 | 1;

export const PRODUCTS = data.products;

export const WASTE_PERCENT_MIN = data.waste.percentMin;
export const WASTE_PERCENT_MAX = data.waste.percentMax;
export const DEFAULT_WASTE_PERCENT = data.waste.percentDefault;

export const DEFAULT_AREA_M2 = 15;
