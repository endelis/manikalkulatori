export interface TualetesIzmeruInputs {
  widthM: number;
  lengthM: number;
  isAccessible: boolean;
}

export interface TualetesIzmeruResult {
  minWidthM: number;
  minLengthM: number;
  isWidthCompliant: boolean;
  isLengthCompliant: boolean;
  isFullyCompliant: boolean;
}

/** LBN 200-21 point 118: general minimum, and the separate minimum for a toilet room
 * accessible to people with functional disabilities. */
const GENERAL_MIN_WIDTH_M = 0.8;
const GENERAL_MIN_LENGTH_M = 1.4;
const ACCESSIBLE_MIN_WIDTH_M = 1.6;
const ACCESSIBLE_MIN_LENGTH_M = 2.2;

export function calculateTualetesIzmeri(inputs: TualetesIzmeruInputs): TualetesIzmeruResult {
  const widthM = Math.max(0, inputs.widthM);
  const lengthM = Math.max(0, inputs.lengthM);

  const minWidthM = inputs.isAccessible ? ACCESSIBLE_MIN_WIDTH_M : GENERAL_MIN_WIDTH_M;
  const minLengthM = inputs.isAccessible ? ACCESSIBLE_MIN_LENGTH_M : GENERAL_MIN_LENGTH_M;

  const isWidthCompliant = widthM >= minWidthM;
  const isLengthCompliant = lengthM >= minLengthM;

  return {
    minWidthM,
    minLengthM,
    isWidthCompliant,
    isLengthCompliant,
    isFullyCompliant: isWidthCompliant && isLengthCompliant,
  };
}
