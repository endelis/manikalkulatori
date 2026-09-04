export interface KrasasDaudzumaInputs {
  areaM2: number;
  coveragePerLiterM2: number;
  coats: number;
}

export interface KrasasDaudzumaResult {
  litersNeeded: number;
}

export function calculateKrasasDaudzums(inputs: KrasasDaudzumaInputs): KrasasDaudzumaResult {
  const litersNeeded = (inputs.areaM2 * inputs.coats) / inputs.coveragePerLiterM2;
  return { litersNeeded };
}
