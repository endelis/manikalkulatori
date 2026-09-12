export interface BernuSedeklisaPrasibaInputs {
  childHeightCm: number;
}

export interface BernuSedeklisaPrasibaResult {
  thresholdCm: number;
  isSeatRequired: boolean;
}

/** Ceļu satiksmes noteikumi point 185: a child car seat or booster is required below
 * this height, regardless of age. */
const HEIGHT_THRESHOLD_CM = 150;

export function calculateBernuSedeklisaPrasiba(
  inputs: BernuSedeklisaPrasibaInputs,
): BernuSedeklisaPrasibaResult {
  const childHeightCm = Math.max(0, inputs.childHeightCm);

  return {
    thresholdCm: HEIGHT_THRESHOLD_CM,
    isSeatRequired: childHeightCm < HEIGHT_THRESHOLD_CM,
  };
}
