export interface FlizuDaudzumaInputs {
  areaM2: number;
  tileWidthM: number;
  tileHeightM: number;
  wastePercent: number;
}

export interface FlizuDaudzumaResult {
  tilesNeededRaw: number;
  tilesWithWaste: number;
  tilesToBuy: number;
}

export function calculateFlizuDaudzums(inputs: FlizuDaudzumaInputs): FlizuDaudzumaResult {
  const tileAreaM2 = inputs.tileWidthM * inputs.tileHeightM;
  const tilesNeededRaw = tileAreaM2 > 0 ? inputs.areaM2 / tileAreaM2 : 0;
  const tilesWithWaste = tilesNeededRaw * (1 + inputs.wastePercent / 100);
  const tilesToBuy = Math.ceil(tilesWithWaste);
  return { tilesNeededRaw, tilesWithWaste, tilesToBuy };
}
