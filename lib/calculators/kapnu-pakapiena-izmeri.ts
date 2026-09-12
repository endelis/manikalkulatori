export interface KapnuPakapienaIzmeruInputs {
  riserHeightCm: number;
  treadDepthCm: number;
}

export interface KapnuPakapienaIzmeruResult {
  /** LBN 200-21 point 62: riser height must be 12-18 cm. */
  isHeightCompliant: boolean;
  /** LBN 200-21 point 62: tread depth + 2 x riser height must be 60-65 cm. */
  formulaSumCm: number;
  isSumCompliant: boolean;
  isFullyCompliant: boolean;
}

const RISER_HEIGHT_MIN_CM = 12;
const RISER_HEIGHT_MAX_CM = 18;
const FORMULA_SUM_MIN_CM = 60;
const FORMULA_SUM_MAX_CM = 65;

export function calculateKapnuPakapienaIzmeri(inputs: KapnuPakapienaIzmeruInputs): KapnuPakapienaIzmeruResult {
  const riserHeightCm = Math.max(0, inputs.riserHeightCm);
  const treadDepthCm = Math.max(0, inputs.treadDepthCm);

  const isHeightCompliant = riserHeightCm >= RISER_HEIGHT_MIN_CM && riserHeightCm <= RISER_HEIGHT_MAX_CM;

  const formulaSumCm = treadDepthCm + 2 * riserHeightCm;
  const isSumCompliant = formulaSumCm >= FORMULA_SUM_MIN_CM && formulaSumCm <= FORMULA_SUM_MAX_CM;

  return {
    isHeightCompliant,
    formulaSumCm,
    isSumCompliant,
    isFullyCompliant: isHeightCompliant && isSumCompliant,
  };
}
