export interface KapnuFormulaInputs {
  riserHeightCm: number;
  treadDepthCm: number;
}

export interface KapnuFormulaResult {
  /** Blondel's formula: 2 x riser height + tread depth, cm. */
  formulaSumCm: number;
  isComfortable: boolean;
  /** How far outside the 60-64 cm comfortable range the sum falls, 0 if inside it. */
  differenceFromRangeCm: number;
}

const COMFORT_RANGE_MIN_CM = 60;
const COMFORT_RANGE_MAX_CM = 64;

export function calculateKapnuFormula(inputs: KapnuFormulaInputs): KapnuFormulaResult {
  const riserHeightCm = Math.max(0, inputs.riserHeightCm);
  const treadDepthCm = Math.max(0, inputs.treadDepthCm);

  const formulaSumCm = 2 * riserHeightCm + treadDepthCm;

  let differenceFromRangeCm = 0;
  if (formulaSumCm < COMFORT_RANGE_MIN_CM) {
    differenceFromRangeCm = COMFORT_RANGE_MIN_CM - formulaSumCm;
  } else if (formulaSumCm > COMFORT_RANGE_MAX_CM) {
    differenceFromRangeCm = formulaSumCm - COMFORT_RANGE_MAX_CM;
  }

  return {
    formulaSumCm,
    isComfortable: differenceFromRangeCm === 0,
    differenceFromRangeCm,
  };
}
