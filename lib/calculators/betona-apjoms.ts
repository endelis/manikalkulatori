export interface BetonaApjomaInputs {
  lengthM: number;
  widthM: number;
  thicknessM: number;
  bagYieldM3: number;
}

export interface BetonaApjomaResult {
  volumeM3: number;
  bagsNeeded: number;
}

export function calculateBetonaApjoms(inputs: BetonaApjomaInputs): BetonaApjomaResult {
  const volumeM3 = inputs.lengthM * inputs.widthM * inputs.thicknessM;
  const bagsNeeded = inputs.bagYieldM3 > 0 ? Math.ceil(volumeM3 / inputs.bagYieldM3) : 0;
  return { volumeM3, bagsNeeded };
}
