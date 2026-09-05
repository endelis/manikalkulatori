import data from '@/claude/data/lv-grants-smilts-skembu-2026.json';

export type MaterialType = 'smilts' | 'grants' | 'skembas';

export const MATERIALS = data.materials;

export const COMPACTION_PERCENT_MIN = data.compaction.percentMin;
export const COMPACTION_PERCENT_MAX = data.compaction.percentMax;
export const DEFAULT_COMPACTION_PERCENT = data.compaction.percentDefault;

export const DEFAULT_AREA_M2 = 10;
export const DEFAULT_DEPTH_MM = 100;
