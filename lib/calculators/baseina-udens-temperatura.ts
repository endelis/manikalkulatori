export interface BaseinaUdensTemperaturaInputs {
  waterTemperatureC: number;
  isChildrenPool: boolean;
}

export interface BaseinaUdensTemperaturaResult {
  minTemperatureC: number;
  maxTemperatureC: number;
  isCompliant: boolean;
}

/** MK noteikumi Nr. 470 "Higiēnas prasības baseina un pirts pakalpojumiem", 15. punkts. */
const STANDARD_MIN_C = 26;
const STANDARD_MAX_C = 30;
const CHILDREN_MIN_C = 28;
const CHILDREN_MAX_C = 32;

export function calculateBaseinaUdensTemperatura(
  inputs: BaseinaUdensTemperaturaInputs,
): BaseinaUdensTemperaturaResult {
  const waterTemperatureC = inputs.waterTemperatureC;
  const minTemperatureC = inputs.isChildrenPool ? CHILDREN_MIN_C : STANDARD_MIN_C;
  const maxTemperatureC = inputs.isChildrenPool ? CHILDREN_MAX_C : STANDARD_MAX_C;

  const isCompliant = waterTemperatureC >= minTemperatureC && waterTemperatureC <= maxTemperatureC;

  return { minTemperatureC, maxTemperatureC, isCompliant };
}
