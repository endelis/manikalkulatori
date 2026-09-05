import data from '@/claude/data/lv-javas-apmetuma-2026.json';

export type ApmetumsProductKey = 0 | 1 | 2;

export const APMETUMS_PRODUCTS = data.apmetums.products;

export const APMETUMS_THICKNESS_MM_MIN = data.apmetums.thicknessMmMin;
export const APMETUMS_THICKNESS_MM_MAX = data.apmetums.thicknessMmMax;
export const DEFAULT_APMETUMS_THICKNESS_MM = data.apmetums.thicknessMmDefault;

export const MURJAVA_YIELD_KG_PER_LITER = data.murjava.yieldProduct.kgPerLiter;
export const MURJAVA_YIELD_BAG_SIZE_KG = data.murjava.yieldProduct.bagSizeKg;
export const MURJAVA_YIELD_PRODUCT_NAME = data.murjava.yieldProduct.name;

export const DEFAULT_WASTE_PERCENT = data.waste.percentDefault;

export const DEFAULT_WALL_AREA_M2 = 10;
