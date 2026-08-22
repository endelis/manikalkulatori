export interface RiepuIzmeraInputs {
  originalWidthMm: number;
  originalAspectRatio: number;
  originalRimInches: number;
  newWidthMm: number;
  newAspectRatio: number;
  newRimInches: number;
  indicatedSpeedKmh: number;
}

export interface RiepuIzmeraResult {
  originalDiameterMm: number;
  newDiameterMm: number;
  speedoErrorPercent: number;
  actualSpeedKmh: number;
}

function tireDiameterMm(widthMm: number, aspectRatio: number, rimInches: number): number {
  return rimInches * 25.4 + 2 * (widthMm * (aspectRatio / 100));
}

export function calculateRiepuIzmers(inputs: RiepuIzmeraInputs): RiepuIzmeraResult {
  const originalDiameterMm = tireDiameterMm(inputs.originalWidthMm, inputs.originalAspectRatio, inputs.originalRimInches);
  const newDiameterMm = tireDiameterMm(inputs.newWidthMm, inputs.newAspectRatio, inputs.newRimInches);
  const ratio = newDiameterMm / originalDiameterMm;
  const speedoErrorPercent = (ratio - 1) * 100;
  const actualSpeedKmh = inputs.indicatedSpeedKmh * ratio;
  return { originalDiameterMm, newDiameterMm, speedoErrorPercent, actualSpeedKmh };
}
