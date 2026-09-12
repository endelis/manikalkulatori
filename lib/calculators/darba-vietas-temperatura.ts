export interface DarbaVietasTemperaturaInputs {
  roomTemperatureC: number;
  isColdPeriod: boolean;
}

export interface DarbaVietasTemperaturaResult {
  minTemperatureC: number;
  maxTemperatureC: number;
  isCompliant: boolean;
}

/** MK noteikumi Nr. 359 "Darba aizsardzības prasības darba vietās", 1. pielikums,
 * I kategorijas darbs (bez fiziskas piepūles vai ar nelielu piepūli, piemēram, biroja
 * darbs). Aukstais periods: vidējā gaisa temperatūra ārpus telpām +10 °C vai mazāk. */
const COLD_PERIOD_MIN_C = 19;
const COLD_PERIOD_MAX_C = 25;
const WARM_PERIOD_MIN_C = 20;
const WARM_PERIOD_MAX_C = 28;

export function calculateDarbaVietasTemperatura(
  inputs: DarbaVietasTemperaturaInputs,
): DarbaVietasTemperaturaResult {
  const roomTemperatureC = inputs.roomTemperatureC;
  const minTemperatureC = inputs.isColdPeriod ? COLD_PERIOD_MIN_C : WARM_PERIOD_MIN_C;
  const maxTemperatureC = inputs.isColdPeriod ? COLD_PERIOD_MAX_C : WARM_PERIOD_MAX_C;

  const isCompliant = roomTemperatureC >= minTemperatureC && roomTemperatureC <= maxTemperatureC;

  return { minTemperatureC, maxTemperatureC, isCompliant };
}
