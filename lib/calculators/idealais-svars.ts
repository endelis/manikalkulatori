export type IdealaSvaraDzimums = 'male' | 'female';

export interface IdealaSvaraInputs {
  sex: IdealaSvaraDzimums;
  heightCm: number;
}

export interface IdealaSvaraResult {
  idealWeightKg: number;
}

const CM_PER_INCH = 2.54;
const BASE_HEIGHT_INCHES = 60;

export function calculateIdealaisSvars(inputs: IdealaSvaraInputs): IdealaSvaraResult {
  const heightCm = Math.max(0, inputs.heightCm);
  const heightInches = heightCm / CM_PER_INCH;
  const inchesOverBase = heightInches - BASE_HEIGHT_INCHES;

  const baseWeight = inputs.sex === 'male' ? 50 : 45.5;
  const idealWeightKg = Math.max(0, baseWeight + 2.3 * inchesOverBase);

  return { idealWeightKg };
}
