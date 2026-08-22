export interface SkriesanasTempaInputs {
  distanceKm: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface SkriesanasTempaResult {
  paceMinPerKm: number;
  speedKmh: number;
}

export function calculateSkriesanasTemps(inputs: SkriesanasTempaInputs): SkriesanasTempaResult {
  const totalMinutes = inputs.hours * 60 + inputs.minutes + inputs.seconds / 60;
  const paceMinPerKm = inputs.distanceKm > 0 ? totalMinutes / inputs.distanceKm : 0;
  const speedKmh = totalMinutes > 0 ? inputs.distanceKm / (totalMinutes / 60) : 0;
  return { paceMinPerKm, speedKmh };
}
