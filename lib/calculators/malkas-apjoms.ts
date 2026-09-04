export interface MalkasApjomaInputs {
  stackLengthM: number;
  stackWidthM: number;
  stackHeightM: number;
  solidWoodFactor: number;
}

export interface MalkasApjomaResult {
  stackedVolumeM3: number;
  solidVolumeM3: number;
}

export function calculateMalkasApjoms(inputs: MalkasApjomaInputs): MalkasApjomaResult {
  const stackedVolumeM3 = inputs.stackLengthM * inputs.stackWidthM * inputs.stackHeightM;
  const solidVolumeM3 = stackedVolumeM3 * inputs.solidWoodFactor;
  return { stackedVolumeM3, solidVolumeM3 };
}
