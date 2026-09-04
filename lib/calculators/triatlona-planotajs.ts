export interface TriatlonaPlanotajaInputs {
  swimDistanceM: number;
  swimPaceMinPer100m: number;
  t1Minutes: number;
  bikeDistanceKm: number;
  bikeSpeedKmh: number;
  t2Minutes: number;
  runDistanceKm: number;
  runPaceMinPerKm: number;
}

export interface TriatlonaPlanotajaResult {
  swimTimeMinutes: number;
  bikeTimeMinutes: number;
  runTimeMinutes: number;
  totalTimeMinutes: number;
}

export function calculateTriatlonaPlanotajs(inputs: TriatlonaPlanotajaInputs): TriatlonaPlanotajaResult {
  const swimTimeMinutes = (inputs.swimDistanceM / 100) * inputs.swimPaceMinPer100m;
  const bikeTimeMinutes = inputs.bikeSpeedKmh > 0 ? (inputs.bikeDistanceKm / inputs.bikeSpeedKmh) * 60 : 0;
  const runTimeMinutes = inputs.runDistanceKm * inputs.runPaceMinPerKm;
  const totalTimeMinutes = swimTimeMinutes + inputs.t1Minutes + bikeTimeMinutes + inputs.t2Minutes + runTimeMinutes;
  return { swimTimeMinutes, bikeTimeMinutes, runTimeMinutes, totalTimeMinutes };
}
