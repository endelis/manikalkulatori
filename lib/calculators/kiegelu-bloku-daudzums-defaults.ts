import data from '@/claude/data/lv-kiegelu-bloku-2026.json';

export const CERAMIC_BRICK_LENGTH_MM = data.ceramicBrick.lengthMm;
export const CERAMIC_BRICK_WIDTH_MM = data.ceramicBrick.widthMm;
export const CERAMIC_BRICK_HEIGHT_MM = data.ceramicBrick.heightMm;

export const AERATED_BLOCK_LENGTH_MM = data.aeratedBlock.lengthMm;
export const AERATED_BLOCK_WIDTH_MM = data.aeratedBlock.widthMm;
export const AERATED_BLOCK_HEIGHT_MM = data.aeratedBlock.heightMm;

export const JOINT_THICKNESS_MM_MIN = data.jointThickness.millimetersMin;
export const JOINT_THICKNESS_MM_MAX = data.jointThickness.millimetersMax;
export const DEFAULT_JOINT_THICKNESS_MM = data.jointThickness.millimetersDefault;

export const DEFAULT_WASTE_PERCENT = data.waste.percentDefault;

export type UnitType = 'kiegelis' | 'bloks';

export const UNIT_DEFAULTS: Record<UnitType, { lengthMm: number; widthMm: number; heightMm: number }> = {
  kiegelis: { lengthMm: CERAMIC_BRICK_LENGTH_MM, widthMm: CERAMIC_BRICK_WIDTH_MM, heightMm: CERAMIC_BRICK_HEIGHT_MM },
  bloks: { lengthMm: AERATED_BLOCK_LENGTH_MM, widthMm: AERATED_BLOCK_WIDTH_MM, heightMm: AERATED_BLOCK_HEIGHT_MM },
};

export const DEFAULT_WALL_AREA_M2 = 10;
